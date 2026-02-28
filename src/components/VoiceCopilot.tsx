import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Mic, MicOff, Bot, Send, X,
  Volume2, VolumeX, RotateCcw, Sparkles,
} from 'lucide-react';
import {
  extractIntentFromText,
  generateCopilotResponse,
  generateAIResponse,
  resolveGeminiKey,
  getGreeting,
  FIRST_QUESTION,
  getCapabilitiesMessage,
  buildSearchQuery,
  SUPPORTED_LANGUAGES,
  CopilotMessage,
  ExtractedIntent,
  ConversationPhase,
} from '../services/voiceAI';

// ─── Helpers ──────────────────────────────────────────────────────────────────
let _mid = 0;
const genId = () => `m${++_mid}-${Date.now()}`;

/** Strip emojis, markdown symbols, and newlines so TTS sounds natural */
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
    .replace(/\[SEARCH\]/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 340);
}

// ─── Markdown-lite renderer (bold + line breaks) ──────────────────────────────
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part.split('\n').map((line, j, arr) => (
          <React.Fragment key={`${i}-${j}`}>
            {line}{j < arr.length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </>
  );
}

// ─── Intent chip ──────────────────────────────────────────────────────────────
function IC({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
      {icon} {label}
    </span>
  );
}

// ─── util ─────────────────────────────────────────────────────────────────────
function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

// ─── Main component ───────────────────────────────────────────────────────────
export function VoiceCopilot({
  open: controlledOpen,
  onOpenChange,
}: { open?: boolean; onOpenChange?: (v: boolean) => void } = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Open state — controlled or internal
  const [_internalOpen, _setInternalOpen] = React.useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : _internalOpen;
  const setIsOpen = (v: boolean) => onOpenChange ? onOpenChange(v) : _setInternalOpen(v);
  const [hasUnread, setHasUnread] = React.useState(false);

  // Conversation — messages persist across open/close; only cleared by Clear button
  const [messages, setMessages] = React.useState<CopilotMessage[]>([]);
  const [accumulatedIntent, setAccumulatedIntent] = React.useState<ExtractedIntent>({});
  const [phase, setPhase] = React.useState<ConversationPhase>('greeting');

  // Voice
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const [liveTranscript, setLiveTranscript] = React.useState('');
  const [speechReady, setSpeechReady] = React.useState(false);
  const [ttsOn, setTtsOn] = React.useState(true);
  const [selectedLang] = React.useState('en-IN');

  // Text input
  const [inputText, setInputText] = React.useState('');

  // Gemini key — always resolved from hardcoded value
  const [geminiKey] = React.useState<string | null>(() => resolveGeminiKey());

  // Refs
  const recognitionRef = React.useRef<any>(null);
  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const voiceRef = React.useRef<SpeechSynthesisVoice | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const demoRef = React.useRef<any>(null);
  const phaseRef = React.useRef<ConversationPhase>('greeting');
  const messagesRef = React.useRef<CopilotMessage[]>([]);
  const intentRef = React.useRef<ExtractedIntent>({});
  // Guard: prevents greeting from firing twice (React Strict Mode double-invoke)
  const greetedRef = React.useRef(false);

  React.useEffect(() => { phaseRef.current = phase; }, [phase]);
  React.useEffect(() => { messagesRef.current = messages; }, [messages]);
  React.useEffect(() => { intentRef.current = accumulatedIntent; }, [accumulatedIntent]);

  // ── Init STT + TTS ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false; rec.interimResults = true; rec.lang = selectedLang;
      rec.onstart = () => setIsListening(true);
      rec.onerror = () => { setIsListening(false); setLiveTranscript(''); };
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        let final = '', interim = '';
        for (let i = 0; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t; else interim += t;
        }
        setLiveTranscript(final || interim);
        if (final) { setIsListening(false); setLiveTranscript(''); processInput(final.trim(), true); }
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
          voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft'))) ||
          voices.find(v => v.lang.startsWith('en')) || null;
      };
      pickVoice();
      if (synthRef.current.onvoiceschanged !== undefined) synthRef.current.onvoiceschanged = pickVoice;
    }

    return () => { recognitionRef.current?.abort(); synthRef.current?.cancel(); clearInterval(demoRef.current); };
  }, []);

  React.useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking, liveTranscript]);
  React.useEffect(() => { if (!isOpen && messages.length > 0) setHasUnread(true); }, [messages.length]);
  React.useEffect(() => {
    if (location.pathname.startsWith('/packages') && phase !== 'results' && phase !== 'navigating') setPhase('results');
  }, [location.pathname]);
  React.useEffect(() => {
    if (isOpen && messages.length === 0 && !greetedRef.current) {
      greetedRef.current = true;
      const g = getGreeting();
      pushBot(g);
      speak(g);
      setPhase('discovery');
      // Ask the first question as a separate message after a short delay
      // so Gemini never re-asks it (it'll see it already in the history)
      setTimeout(() => {
        pushBot(FIRST_QUESTION);
        speak(FIRST_QUESTION);
      }, 1100);
    }
  }, [isOpen]);

  // ── TTS ────────────────────────────────────────────────────────────────────
  const speak = (text: string) => {
    if (!synthRef.current || !ttsOn) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
    if (voiceRef.current) utt.voice = voiceRef.current;
    utt.pitch = 1.05; utt.rate = 0.95; utt.volume = 1;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  };

  // ── Push bot message ─────────────────────────────────────────────────────
  const pushBot = (text: string, extra?: Partial<CopilotMessage>) => {
    const msg: CopilotMessage = { id: genId(), role: 'assistant', text, timestamp: Date.now(), ...extra };
    setMessages(prev => [...prev, msg]);
    if (!isOpen) setHasUnread(true);
  };

  // ── Core: process input ──────────────────────────────────────────────────
  const processInput = async (text: string, fromVoice = false) => {
    if (!text.trim() || isThinking) return;
    setLiveTranscript(''); setInputText('');

    if (/what can you do|capabilities|help me|kya kar sakte/i.test(text)) {
      setMessages(prev => [...prev, { id: genId(), role: 'user', text, timestamp: Date.now(), fromVoice }]);
      setIsThinking(true);
      await delay(400);
      setIsThinking(false);
      const cap = getCapabilitiesMessage();
      pushBot(cap); speak(cap); return;
    }

    const userMsg: CopilotMessage = { id: genId(), role: 'user', text, timestamp: Date.now(), fromVoice };
    const updated = [...messagesRef.current, userMsg];
    setMessages(updated);

    setIsThinking(true);
    await delay(500 + Math.random() * 400);
    setIsThinking(false);

    const newIntent = extractIntentFromText(text, accumulatedIntent);
    setAccumulatedIntent(newIntent);
    const currentPhase = phaseRef.current;

    let responseText = '';
    let shouldNav = false;
    let searchQuery = buildSearchQuery(newIntent);

    // Try Gemini first (always active since key is hardcoded)
    if (geminiKey) {
      try {
        const ai = await generateAIResponse(updated, newIntent, currentPhase, geminiKey);
        responseText = ai.text;
        shouldNav = ai.shouldSearch && !!(newIntent.destination && newIntent.dates && newIntent.adults !== undefined);
      } catch (err) {
        console.warn('Gemini failed, falling back to rule-based:', err);
      }
    }

    // Rule-based fallback if Gemini fails
    if (!responseText) {
      const rule = generateCopilotResponse(text, newIntent, currentPhase, updated);
      responseText = rule.text;
      shouldNav = rule.shouldNavigate;
      searchQuery = rule.searchQuery || searchQuery;
    }

    pushBot(responseText, { extractedIntent: newIntent, uiSynced: shouldNav });
    speak(responseText);
    setPhase(shouldNav ? 'navigating' : currentPhase);

    if (shouldNav && searchQuery) {
      await delay(1000);
      navigate('/packages', { state: { query: searchQuery } });
      await delay(1500);
      const syncText = 'Packages are up on screen — take a look! Let me know if you want me to compare any of them or help you pick one.';
      pushBot(syncText, { uiSynced: true });
      speak(syncText);
      setPhase('results');
    }
  };

  // ── Mic ──────────────────────────────────────────────────────────────────
  const handleMic = () => {
    if (isListening) {
      clearInterval(demoRef.current);
      recognitionRef.current?.stop();
      setIsListening(false);
      setLiveTranscript('');
      return;
    }
    if (isSpeaking) { synthRef.current?.cancel(); setIsSpeaking(false); }
    if (speechReady && recognitionRef.current) {
      setLiveTranscript(''); recognitionRef.current.lang = selectedLang;
      try { recognitionRef.current.start(); } catch { runDemo(); }
    } else { runDemo(); }
  };

  // ── Demo simulation ───────────────────────────────────────────────────────
  const runDemo = () => {
    const pools: Record<string, string[]> = {
      greeting: ['Goa for Holi weekend, 4 friends, budget 40 thousand', 'Manali 5 nights, me and my wife, 60k budget', 'Dubai luxury, 4 nights, 2 adults, 1.5 lakh'],
      discovery: ['budget around 60k', '5 nights please', '2 adults no kids', 'beach vibes please', 'December dates'],
      results: ['compare the top 2', 'which one do you recommend?', 'show me cheapest', 'how do I build a quote'],
    };
    const list = pools[phaseRef.current] ?? pools.greeting;
    const text = list[Math.floor(Math.random() * list.length)];
    setIsListening(true); setLiveTranscript('');
    let i = 0;
    demoRef.current = setInterval(() => {
      if (i <= text.length) { setLiveTranscript(text.slice(0, i)); i++; }
      else { clearInterval(demoRef.current); setIsListening(false); setLiveTranscript(''); processInput(text, true); }
    }, 36);
  };

  // ── Clear / Reset ─────────────────────────────────────────────────────────
  const resetConversation = () => {
    synthRef.current?.cancel(); clearInterval(demoRef.current);
    setMessages([]); setAccumulatedIntent({}); setPhase('greeting');
    setLiveTranscript(''); setIsListening(false); setIsSpeaking(false); setIsThinking(false);
    // Reset guard so the greeting effect fires again after clear
    greetedRef.current = false;
    setTimeout(() => {
      greetedRef.current = true;
      const g = getGreeting();
      pushBot(g);
      speak(g);
      setPhase('discovery');
      setTimeout(() => { pushBot(FIRST_QUESTION); speak(FIRST_QUESTION); }, 1100);
    }, 80);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const intentFilled = Object.values(accumulatedIntent).some(v => v !== undefined);
  const langName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name ?? 'English';
  const statusLabel = isListening
    ? `Listening in ${langName}…`
    : isThinking ? 'Thinking…'
    : isSpeaking ? 'Speaking…'
    : geminiKey  ? 'Gemini AI · Ready'
    : 'Ready';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Click-outside backdrop — closes panel without clearing messages ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        title={isOpen ? 'Minimise Copilot' : 'Open TripBrain'}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-indigo-800 hover:bg-indigo-900 scale-95'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600 hover:scale-110 hover:shadow-indigo-300/40'
        }`}
      >
        {(isListening || isThinking) && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20 pointer-events-none" />
        )}
        {isOpen
          ? <X className="w-5 h-5 text-white relative z-10" />
          : <Bot className="w-6 h-6 text-white relative z-10" />
        }
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white pointer-events-none" />
        )}
      </button>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          className="fixed z-50 flex flex-col rounded-3xl overflow-hidden"
          style={{
            width: 400,
            maxWidth: 'calc(100vw - 20px)',
            height: 620,
            maxHeight: 'calc(100vh - 110px)',
            bottom: 88,
            right: 24,
            background: 'linear-gradient(160deg, #fefefe 0%, #f5f3ff 100%)',
            boxShadow: '0 32px 80px rgba(79,70,229,0.18), 0 8px 32px rgba(0,0,0,0.07)',
            border: '1px solid rgba(167,139,250,0.22)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div
            className="flex-shrink-0 px-4 py-3.5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-violet-200" />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px] leading-tight tracking-wide">TripBrain</p>
                <p className="text-violet-300 text-[10px] leading-tight font-medium">
                  {geminiKey ? '✦ Gemini AI Active' : 'Travel Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTtsOn(v => !v)}
                title={ttsOn ? 'Mute voice' : 'Unmute voice'}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
              >
                {ttsOn
                  ? <Volume2 className="w-3.5 h-3.5 text-white/80" />
                  : <VolumeX className="w-3.5 h-3.5 text-white/80" />
                }
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimise"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-3.5 h-3.5 text-white/80" />
              </button>
            </div>
          </div>

          {/* ── Listening / thinking indicator bar (only shown when active) ── */}
          {(isListening || isThinking || isSpeaking) && (
            <div
              className={`flex-shrink-0 px-4 py-1.5 flex items-center gap-2 text-[11px] font-medium tracking-wide transition-all ${
                isListening ? 'bg-rose-50 text-rose-500'
                : isThinking  ? 'bg-amber-50 text-amber-500'
                :               'bg-indigo-50 text-indigo-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${
                  isListening ? 'bg-rose-400'
                  : isThinking  ? 'bg-amber-400'
                  :               'bg-indigo-400'
                }`}
              />
              {statusLabel}
            </div>
          )}

          {/* ── Messages ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#c4b5fd transparent' }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-25 select-none">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Starting conversation…</p>
              </div>
            )}

            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {/* Bot avatar */}
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mb-5 shadow-sm shadow-indigo-200">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}
                    style={{ maxWidth: '78%' }}
                  >
                    {/* Voice badge */}
                    {isUser && msg.fromVoice && (
                      <span className="text-[10px] text-rose-400 flex items-center gap-1 px-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" /> Voice
                      </span>
                    )}

                    {/* Bubble */}
                    <div
                      className={`text-sm leading-relaxed break-words ${
                        isUser
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl rounded-br-sm shadow-md shadow-indigo-200/40'
                          : msg.uiSynced
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl rounded-bl-sm shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm'
                      }`}
                      style={{ padding: '10px 14px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      {isUser ? msg.text : <RichText text={msg.text} />}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-gray-400 px-1 select-none">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Ghost transcript while listening */}
            {isListening && (
              <div className="flex justify-end items-end gap-2">
                <div className="flex flex-col items-end gap-0.5" style={{ maxWidth: '78%' }}>
                  <span className="text-[10px] text-rose-400 flex items-center gap-1 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse inline-block" /> Listening
                  </span>
                  <div
                    className="text-sm italic text-indigo-500 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl rounded-br-sm"
                    style={{ padding: '10px 14px', minWidth: '80px', wordBreak: 'break-word' }}
                  >
                    {liveTranscript
                      ? <>{liveTranscript}<span className="animate-pulse not-italic text-indigo-300 ml-0.5">|</span></>
                      : <span className="text-indigo-300 not-italic">Listening…</span>
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Thinking dots */}
            {isThinking && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div
                  className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm"
                  style={{ padding: '13px 16px' }}
                >
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* ── Intent chips ── */}
          {intentFilled && (
            <div className="flex-shrink-0 px-4 py-2 bg-white/80 border-t border-violet-50 flex flex-wrap gap-1.5 items-center">
              <span className="text-[9px] text-violet-300 font-bold uppercase tracking-widest">Noted:</span>
              {accumulatedIntent.destination && <IC icon="📍" label={accumulatedIntent.destination} />}
              {accumulatedIntent.nights && <IC icon="🌙" label={`${accumulatedIntent.nights}N`} />}
              {accumulatedIntent.adults !== undefined && (
                <IC icon="👥" label={`${accumulatedIntent.adults}${accumulatedIntent.children ? `+${accumulatedIntent.children}` : ''}`} />
              )}
              {accumulatedIntent.budgetText && <IC icon="💰" label={accumulatedIntent.budgetText} />}
              {accumulatedIntent.dates && <IC icon="📅" label={accumulatedIntent.dates} />}
              {accumulatedIntent.vibe && <IC icon="✨" label={accumulatedIntent.vibe} />}
            </div>
          )}

          {/* ── Input bar ── */}
          <div className="flex-shrink-0 bg-white/90 border-t border-gray-100 px-3 pt-3 pb-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100/80">
              {/* Mic */}
              <button
                onClick={handleMic}
                disabled={isThinking}
                className={`relative w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center transition-all disabled:opacity-40 ${
                  isListening
                    ? 'bg-rose-500 text-white shadow shadow-rose-200'
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-xl bg-rose-400 animate-ping opacity-25 pointer-events-none" />
                )}
                {isListening
                  ? <MicOff className="w-3.5 h-3.5 relative z-10" />
                  : <Mic className="w-3.5 h-3.5" />
                }
              </button>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && inputText.trim() && !isThinking && !isListening)
                    processInput(inputText, false);
                }}
                placeholder={
                  isListening ? 'Listening…'
                  : isThinking ? 'Thinking…'
                  : `Message in ${langName}…`
                }
                disabled={isListening || isThinking}
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              />

              {/* Send */}
              <button
                onClick={() => {
                  if (inputText.trim() && !isThinking && !isListening) processInput(inputText, false);
                }}
                disabled={!inputText.trim() || isListening || isThinking}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex-shrink-0 flex items-center justify-center disabled:opacity-30 transition-all shadow shadow-indigo-200 hover:shadow-md hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── Clear Chat button ── */}
            <button
              onClick={resetConversation}
              className="w-full mt-2 py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
