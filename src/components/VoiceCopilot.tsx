import React from 'react';
import { Bot, Send, X, Volume2, VolumeX, RotateCcw, Sparkles, Mic, MicOff } from 'lucide-react';
import {
  CopilotMessage,
  generateGeminiFollowUpResponse,
  resolveGeminiKey,
  SUPPORTED_LANGUAGES,
} from '../services/voiceAI';

let _mid = 0;
const genId = () => `m${++_mid}-${Date.now()}`;

type StageKey =
  | 'intent'
  | 'flight_assist'
  | 'travel_class'
  | 'travelers'
  | 'stay_preference'
  | 'room_setup'
  | 'dates'
  | 'review';

interface StageDef {
  key: StageKey;
  title: string;
  question: string;
}

interface TripScriptState {
  destination: string;
  flightAssistance: string;
  travelClass: string;
  travelers: string;
  stayPreference: string;
  roomSetup: string;
  dates: string;
  reviewDecision: string;
}

const STAGES: StageDef[] = [
  {
    key: 'intent',
    title: 'Greeting + Intent',
    question: `Hey! I'd love to help you plan this trip. Where are you thinking of going?`,
  },
  {
    key: 'flight_assist',
    title: 'Flight Assistance',
    question: 'Got it. Would you like me to check flight options for this destination as well?',
  },
  {
    key: 'travel_class',
    title: 'Travel Class',
    question: 'Sure — what kind of flight would you prefer: Economy, Premium Economy, Business, or First Class?',
  },
  {
    key: 'travelers',
    title: 'Travelers',
    question: 'Perfect. How many people are traveling altogether? You can include adults, children, and infants too.',
  },
  {
    key: 'stay_preference',
    title: 'Stay Preference',
    question: `Now let's find the right stay for you. What kind of place would you like — budget hotel, premium hotel, luxury stay, apartment, or resort?`,
  },
  {
    key: 'room_setup',
    title: 'Room and Guest Setup',
    question: 'How should I arrange the rooms for your stay? Tell me how many rooms you need and how many guests will stay in each room.',
  },
  {
    key: 'dates',
    title: 'Dates',
    question: `What dates are you planning for check-in and check-out? If you'd like, I can match flight options around these dates too?`,
  },
  {
    key: 'review',
    title: 'Review + Proceed',
    question: `Great, I've put together your trip details. Would you like to review the summary and go ahead with booking?`,
  },
];

const EMPTY_SCRIPT_STATE: TripScriptState = {
  destination: '',
  flightAssistance: '',
  travelClass: '',
  travelers: '',
  stayPreference: '',
  roomSetup: '',
  dates: '',
  reviewDecision: '',
};

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function cleanForSpeech(text: string): string {
  return text
    .replace(/\p{Emoji_Presentation}/gu, '')
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[•·★☆♦◆▸▶→←↑↓]/g, '')
    .replace(/\*+/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/_+/g, '')
    .replace(/`+/g, '')
    .replace(/>\s*/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 360);
}

function isAffirmative(text: string): boolean {
  return /\b(yes|yeah|yep|sure|go ahead|proceed|book|confirm|continue|ok|okay)\b/i.test(text);
}

function stageValueFromInput(stage: StageKey, text: string): Partial<TripScriptState> {
  const value = text.trim();
  switch (stage) {
    case 'intent': return { destination: value };
    case 'flight_assist': return { flightAssistance: value };
    case 'travel_class': return { travelClass: value };
    case 'travelers': return { travelers: value };
    case 'stay_preference': return { stayPreference: value };
    case 'room_setup': return { roomSetup: value };
    case 'dates': return { dates: value };
    case 'review': return { reviewDecision: value };
    default: return {};
  }
}

function buildTripSummary(state: TripScriptState): string {
  return [
    `Destination: ${state.destination || 'Not provided'}`,
    `Flights requested: ${state.flightAssistance || 'Not provided'}`,
    `Travel class: ${state.travelClass || 'Not provided'}`,
    `Travelers: ${state.travelers || 'Not provided'}`,
    `Stay type: ${state.stayPreference || 'Not provided'}`,
    `Room setup: ${state.roomSetup || 'Not provided'}`,
    `Dates: ${state.dates || 'Not provided'}`,
  ].join('\n');
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, idx, arr) => (
        <React.Fragment key={`${line}-${idx}`}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

export function VoiceCopilot({
  open: controlledOpen,
  onOpenChange,
}: { open?: boolean; onOpenChange?: (v: boolean) => void } = {}) {
  const [_internalOpen, _setInternalOpen] = React.useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : _internalOpen;
  const setIsOpen = (v: boolean) => onOpenChange ? onOpenChange(v) : _setInternalOpen(v);

  const [hasUnread, setHasUnread] = React.useState(false);
  const [messages, setMessages] = React.useState<CopilotMessage[]>([]);
  const [stageIndex, setStageIndex] = React.useState(0);
  const [scriptState, setScriptState] = React.useState<TripScriptState>(EMPTY_SCRIPT_STATE);
  const [scriptComplete, setScriptComplete] = React.useState(false);

  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const [liveTranscript, setLiveTranscript] = React.useState('');
  const [speechReady, setSpeechReady] = React.useState(false);
  const [ttsOn, setTtsOn] = React.useState(true);
  const [inputText, setInputText] = React.useState('');
  const [selectedLang] = React.useState('en-IN');

  const [geminiKey] = React.useState<string | null>(() => resolveGeminiKey());

  const recognitionRef = React.useRef<any>(null);
  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const voiceRef = React.useRef<SpeechSynthesisVoice | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const greetedRef = React.useRef(false);
  const messagesRef = React.useRef<CopilotMessage[]>([]);
  // Always points to the latest processInput so the speech-recognition
  // onresult callback (set up once in useEffect) never uses a stale closure.
  const processInputRef = React.useRef<(text: string, fromVoice?: boolean) => Promise<void>>(async () => {});

  React.useEffect(() => { messagesRef.current = messages; }, [messages]);
  React.useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking, liveTranscript]);

  React.useEffect(() => {
    if (!isOpen && messages.length > 0) setHasUnread(true);
  }, [isOpen, messages.length]);

  React.useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = selectedLang;
      rec.onstart = () => setIsListening(true);
      rec.onerror = () => { setIsListening(false); setLiveTranscript(''); };
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        let final = '';
        let interim = '';
        for (let i = 0; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t;
          else interim += t;
        }
        setLiveTranscript(final || interim);
        if (final.trim()) {
          setIsListening(false);
          setLiveTranscript('');
          processInputRef.current(final.trim(), true);
        }
      };
      recognitionRef.current = rec;
      setSpeechReady(true);
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const pickVoice = () => {
        const voices = synthRef.current!.getVoices();
        voiceRef.current =
          voices.find(v => v.lang === 'en-IN') ||
          voices.find(v => v.lang.startsWith('en') && /female|woman/i.test(v.name)) ||
          voices.find(v => v.lang.startsWith('en')) ||
          null;
      };
      pickVoice();
      if (synthRef.current.onvoiceschanged !== undefined) synthRef.current.onvoiceschanged = pickVoice;
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, [selectedLang]);

  const speak = (text: string) => {
    if (!ttsOn || !synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text));
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.pitch = 1.02;
    utterance.rate = 0.96;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const pushBot = (text: string, extra?: Partial<CopilotMessage>) => {
    const msg: CopilotMessage = {
      id: genId(),
      role: 'assistant',
      text,
      timestamp: Date.now(),
      ...extra,
    };
    setMessages(prev => [...prev, msg]);
    if (!isOpen) setHasUnread(true);
    speak(text);
  };

  const startScript = () => {
    const first = STAGES[0].question;
    pushBot(first);
  };

  React.useEffect(() => {
    if (isOpen && messages.length === 0 && !greetedRef.current) {
      greetedRef.current = true;
      startScript();
    }
  }, [isOpen, messages.length]);

  const handleScriptProgression = async (text: string, updatedMessages: CopilotMessage[]) => {
    const currentStage = STAGES[stageIndex];
    if (!currentStage) return;

    const partial = stageValueFromInput(currentStage.key, text);
    const nextState = { ...scriptState, ...partial };
    setScriptState(nextState);

    if (currentStage.key === 'review') {
      setScriptComplete(true);
      const summary = buildTripSummary(nextState);

      if (isAffirmative(text)) {
        const doneText = `Perfect — here's your trip summary:\n${summary}\n\nYour intake is complete. Ask me any follow-up question and I'll help with options, budget, visas, or optimization.`;
        pushBot(doneText);
      } else {
        pushBot(`No problem — share what you want to change, and I'll guide you through updates or answer any follow-up question.`);
      }
      return;
    }

    const nextIndex = Math.min(stageIndex + 1, STAGES.length - 1);
    setStageIndex(nextIndex);

    await delay(250);
    const nextQuestion = STAGES[nextIndex].question;
    pushBot(nextQuestion);

    const latest = updatedMessages[updatedMessages.length - 1];
    if (!latest?.fromVoice) return;
  };

  const handleFollowUpQuery = async (updatedMessages: CopilotMessage[]) => {
    const latestUserText = updatedMessages[updatedMessages.length - 1]?.text ?? '';
    if (/\b(show|view).*(summary)|\btrip summary\b/i.test(latestUserText)) {
      pushBot(`Here is your latest trip summary:\n${buildTripSummary(scriptState)}`);
      return;
    }

    const summary = buildTripSummary(scriptState);

    if (!geminiKey) {
      pushBot('I can help with follow-up questions, but Gemini is not configured. Please add a valid API key to continue.');
      return;
    }

    try {
      const aiText = await generateGeminiFollowUpResponse(updatedMessages, summary, geminiKey);
      if (aiText) pushBot(aiText);
      else pushBot('I can help with that. Could you share a bit more detail about what you want to optimize?');
    } catch {
      pushBot(`I hit a temporary AI issue. Please ask again in a moment, and I'll continue from your saved trip details.`);
    }
  };

  const processInput = async (text: string, fromVoice = false) => {
    if (!text.trim() || isThinking) return;
    setInputText('');
    setLiveTranscript('');

    const userMsg: CopilotMessage = {
      id: genId(),
      role: 'user',
      text,
      timestamp: Date.now(),
      fromVoice,
    };

    const updatedMessages = [...messagesRef.current, userMsg];
    setMessages(updatedMessages);

    setIsThinking(true);
    await delay(320);
    setIsThinking(false);

    if (!scriptComplete) {
      await handleScriptProgression(text, updatedMessages);
    } else {
      await handleFollowUpQuery(updatedMessages);
    }
  };

  // Runs on every render — keeps the ref pointing to the latest processInput
  // so the speech-recognition onresult callback (created once in useEffect)
  // never uses a stale closure with old stageIndex / scriptState values.
  processInputRef.current = processInput;

  const handleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setLiveTranscript('');
      return;
    }

    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }

    if (!speechReady || !recognitionRef.current) return;

    setLiveTranscript('');
    recognitionRef.current.lang = selectedLang;
    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
    }
  };

  const resetConversation = () => {
    synthRef.current?.cancel();
    setMessages([]);
    setScriptState(EMPTY_SCRIPT_STATE);
    setStageIndex(0);
    setScriptComplete(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setLiveTranscript('');
    setInputText('');
    greetedRef.current = false;
    if (isOpen) {
      setTimeout(() => {
        greetedRef.current = true;
        startScript();
      }, 120);
    }
  };

  const currentStep = Math.min(stageIndex + 1, STAGES.length);
  const langName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name ?? 'English';

  const statusText = isListening
    ? `Listening in ${langName}...`
    : isThinking
      ? 'Thinking...'
      : isSpeaking
        ? 'Speaking...'
        : scriptComplete
          ? 'Follow-up mode with Gemini'
          : `Guided script mode · Step ${currentStep}/8`;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden />}

      <button
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        title={isOpen ? 'Minimise Copilot' : 'Open Copilot'}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-indigo-800 hover:bg-indigo-900 scale-95'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600 hover:scale-105'
        }`}
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-white" />}
        {hasUnread && !isOpen && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />}
      </button>

      {isOpen && (
        <div
          className="fixed z-50 flex flex-col rounded-3xl overflow-hidden border border-violet-200 bg-white"
          style={{
            width: 400,
            maxWidth: 'calc(100vw - 24px)',
            height: 560,
            maxHeight: 'calc(100vh - 100px)',
            bottom: 88,
            right: 20,
            boxShadow: '0 24px 60px rgba(79,70,229,0.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-800 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-200" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide">Trip Copilot</div>
                  <div className="text-[10px] text-violet-300">{statusText}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTtsOn(v => !v)}
                  title={ttsOn ? 'Mute voice' : 'Unmute voice'}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center"
                >
                  {ttsOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center"
                  title="Minimise"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!scriptComplete && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-violet-300 mb-1">
                  <span>{STAGES[stageIndex].title}</span>
                  <span>Step {currentStep} / 8</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((currentStep / STAGES.length) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {(scriptState.destination || scriptState.travelClass || scriptState.travelers || scriptState.dates) && (
            <div className="flex-shrink-0 px-3 py-1.5 border-b border-gray-100 bg-slate-50 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">Captured</span>
              {scriptState.destination && <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-50 text-indigo-700 flex-shrink-0 whitespace-nowrap">{scriptState.destination}</span>}
              {scriptState.travelClass && <span className="px-2 py-0.5 text-[10px] rounded-full bg-violet-50 text-violet-700 flex-shrink-0 whitespace-nowrap">{scriptState.travelClass}</span>}
              {scriptState.travelers && <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0 whitespace-nowrap">{scriptState.travelers}</span>}
              {scriptState.dates && <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-50 text-amber-700 flex-shrink-0 whitespace-nowrap">{scriptState.dates}</span>}
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col bg-slate-50/60">
            {messages.length > 0 && <div className="flex-1" />}

            <div className={`px-4 py-4 space-y-4${messages.length === 0 ? ' flex-1 flex flex-col justify-center' : ''}`}>
              {messages.length === 0 && (
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-100 text-violet-500 flex items-center justify-center mb-3 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">Share your destination and I'll guide the trip setup step by step.</p>
                </div>
              )}

              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`text-sm leading-relaxed px-4 py-2.5 ${
                        isUser
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl rounded-br-none shadow-lg shadow-indigo-300/30'
                          : 'bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-md shadow-gray-200/80 border border-gray-100'
                      }`}>
                        {isUser ? msg.text : <RichText text={msg.text} />}
                      </div>
                      <span className={`text-[10px] text-gray-400 px-1 ${isUser ? 'self-end' : 'self-start'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isListening && (
                <div className="flex justify-end items-end gap-2">
                  <div className="max-w-[78%] flex flex-col gap-1 items-end">
                    <div className="bg-gradient-to-br from-indigo-400 to-violet-500 text-white rounded-2xl rounded-br-none shadow-lg shadow-indigo-300/30 px-4 py-2.5 flex items-center gap-2.5 min-w-[100px]">
                      <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-ping flex-shrink-0" />
                      <span className="text-sm italic opacity-90 truncate">{liveTranscript || 'Listening...'}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 px-1">now</span>
                  </div>
                </div>
              )}

              {isThinking && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none shadow-md shadow-gray-200/80 px-4 py-3">
                    <div className="flex gap-1.5 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.14}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {scriptComplete && !isThinking && !isListening && messages.length > 0 && (
                <div className="pt-2 flex flex-col gap-2">
                  <p className="text-[10px] font-medium text-gray-400 text-center uppercase tracking-wide">Suggested follow-ups</p>
                  {['Show my trip summary', 'Can you optimize the budget?', 'Any visa tips for this trip?'].map(s => (
                    <button
                      key={s}
                      onClick={() => processInput(s, false)}
                      className="w-full text-left text-sm px-4 py-2.5 rounded-2xl border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </div>

          <div className="border-t border-gray-100 px-3 pt-3 pb-2 bg-white">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2">
              <button
                onClick={handleMic}
                disabled={isThinking}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
                  isListening ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && inputText.trim() && !isListening && !isThinking) {
                    processInput(inputText, false);
                  }
                }}
                placeholder={isListening ? 'Listening...' : isThinking ? 'Thinking...' : 'Type your response...'}
                disabled={isListening || isThinking}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none disabled:opacity-40"
              />

              <button
                onClick={() => inputText.trim() && processInput(inputText, false)}
                disabled={!inputText.trim() || isListening || isThinking}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={resetConversation}
              className="w-full mt-2 py-1.5 text-[11px] font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Conversation
            </button>
          </div>
        </div>
      )}
    </>
  );
}
