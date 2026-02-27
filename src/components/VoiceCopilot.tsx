import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Mic, MicOff, Bot, Send,
  Volume2, VolumeX, RotateCcw, Phone, PhoneOff, HelpCircle, ChevronDown, Key,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  extractIntentFromText,
  generateCopilotResponse,
  generateAIResponse,
  resolveGeminiKey,
  getGreeting,
  getCapabilitiesMessage,
  getSuggestedReplies,
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
    .replace(/\p{Emoji_Presentation}/gu, '')   // unicode emoji
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')    // emoji ranges
    .replace(/[•·★☆♦]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\[SEARCH\]/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 340);
}

// ─── Markdown-lite renderer (bold + line breaks only) ─────────────────────────
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

// ─── API-key modal ────────────────────────────────────────────────────────────
function ApiKeyModal({ onSave, onClose }: { onSave: (k: string) => void; onClose: () => void }) {
  const [val, setVal] = React.useState(localStorage.getItem('tripbrain_gemini_key') ?? '');
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl">
      <div className="bg-white rounded-xl shadow-xl p-5 mx-4 w-full max-w-sm">
        <p className="font-semibold text-gray-800 mb-1">Gemini API Key</p>
        <p className="text-xs text-gray-500 mb-3">
          Get a free key at <span className="text-violet-600">aistudio.google.com</span>. Stored only in your browser.
        </p>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono"
          placeholder="AIza…"
          value={val}
          onChange={e => setVal(e.target.value)}
        />
        <div className="flex gap-2 mt-3">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => { localStorage.setItem('tripbrain_gemini_key', val.trim()); onSave(val.trim()); onClose(); toast.success('API key saved — AI mode active'); }}
            className="flex-1 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium"
          >Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function VoiceCopilot({
  open: controlledOpen,
  onOpenChange,
}: { open?: boolean; onOpenChange?: (v: boolean) => void } = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Open state
  const [_internalOpen, _setInternalOpen] = React.useState(false);
  const isOpen  = controlledOpen !== undefined ? controlledOpen : _internalOpen;
  const setIsOpen = (v: boolean) => onOpenChange ? onOpenChange(v) : _setInternalOpen(v);
  const [hasUnread, setHasUnread] = React.useState(false);

  // Conversation
  const [messages,          setMessages]          = React.useState<CopilotMessage[]>([]);
  const [accumulatedIntent, setAccumulatedIntent] = React.useState<ExtractedIntent>({});
  const [phase,             setPhase]             = React.useState<ConversationPhase>('greeting');
  const [isAgentMode,       setIsAgentMode]       = React.useState(false);

  // Voice
  const [isListening,    setIsListening]    = React.useState(false);
  const [isSpeaking,     setIsSpeaking]     = React.useState(false);
  const [isThinking,     setIsThinking]     = React.useState(false);
  const [liveTranscript, setLiveTranscript] = React.useState('');
  const [speechReady,    setSpeechReady]    = React.useState(false);
  const [ttsOn,          setTtsOn]          = React.useState(true);
  const [selectedLang,   setSelectedLang]   = React.useState('en-IN');

  // Text input
  const [inputText, setInputText] = React.useState('');

  // AI key
  const [geminiKey, setGeminiKey] = React.useState<string | null>(() => resolveGeminiKey());
  const [showKeyModal, setShowKeyModal] = React.useState(false);

  // Refs
  const recognitionRef  = React.useRef<any>(null);
  const synthRef        = React.useRef<SpeechSynthesis | null>(null);
  const voiceRef        = React.useRef<SpeechSynthesisVoice | null>(null);
  const scrollRef       = React.useRef<HTMLDivElement>(null);
  const inputRef        = React.useRef<HTMLInputElement>(null);
  const demoRef         = React.useRef<any>(null);
  const phaseRef        = React.useRef<ConversationPhase>('greeting');
  const messagesRef     = React.useRef<CopilotMessage[]>([]);

  React.useEffect(() => { phaseRef.current   = phase;    }, [phase]);
  React.useEffect(() => { messagesRef.current = messages; }, [messages]);

  // ── Init STT + TTS ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false; rec.interimResults = true; rec.lang = selectedLang;
      rec.onstart  = () => setIsListening(true);
      rec.onerror  = () => { setIsListening(false); setLiveTranscript(''); };
      rec.onend    = () => setIsListening(false);
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

  React.useEffect(() => { if (recognitionRef.current) recognitionRef.current.lang = selectedLang; }, [selectedLang]);
  React.useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking, liveTranscript]);
  React.useEffect(() => { if (!isOpen && messages.length > 0) setHasUnread(true); }, [messages.length]);
  React.useEffect(() => {
    if (location.pathname.startsWith('/packages') && phase !== 'results' && phase !== 'navigating') setPhase('results');
  }, [location.pathname]);
  React.useEffect(() => {
    if (isOpen && messages.length === 0) {
      const g = getGreeting(isAgentMode);
      pushBot(g, { suggestedReplies: ['Plan a trip', 'B2B Agent Mode', 'What can you do?'] });
      setPhase('discovery'); speak(g);
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
    utt.onend   = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  };

  // ── Push bot message ────────────────────────────────────────────────────────
  const pushBot = (text: string, extra?: Partial<CopilotMessage>) => {
    const msg: CopilotMessage = { id: genId(), role: 'assistant', text, timestamp: Date.now(), ...extra };
    setMessages(prev => [...prev, msg]);
    if (!isOpen) setHasUnread(true);
  };

  // ── Core: process input ─────────────────────────────────────────────────────
  const processInput = async (text: string, fromVoice = false) => {
    if (!text.trim() || isThinking) return;
    setLiveTranscript(''); setInputText('');

    // Handle capabilities query locally
    if (/what can you do|capabilities|help me|kya kar sakte/i.test(text)) {
      setMessages(prev => [...prev, { id: genId(), role: 'user', text, timestamp: Date.now(), fromVoice }]);
      setIsThinking(true);
      await delay(400);
      setIsThinking(false);
      const cap = getCapabilitiesMessage();
      pushBot(cap, { suggestedReplies: ['Plan a trip', 'Try B2B Mode', 'Search Goa 5 nights 2 adults'] });
      speak(cap); return;
    }

    // Add user bubble
    const userMsg: CopilotMessage = { id: genId(), role: 'user', text, timestamp: Date.now(), fromVoice };
    const updated = [...messagesRef.current, userMsg];
    setMessages(updated);

    // Thinking
    setIsThinking(true);
    await delay(500 + Math.random() * 400);
    setIsThinking(false);

    // Extract intent
    const newIntent = extractIntentFromText(text, accumulatedIntent);
    setAccumulatedIntent(newIntent);
    const currentPhase = phaseRef.current;

    let responseText = '';
    let shouldNav    = false;
    let searchQuery  = buildSearchQuery(newIntent);

    // ── Try Gemini first ─────────────────────────────────────────────────────
    if (geminiKey) {
      try {
        const ai = await generateAIResponse(updated, newIntent, currentPhase, isAgentMode, geminiKey);
        responseText = ai.text;
        shouldNav    = ai.shouldSearch && !!(newIntent.destination && newIntent.adults);
      } catch (err) {
        console.warn('Gemini failed, falling back:', err);
        // fall through to rule-based
      }
    }

    // ── Rule-based fallback ──────────────────────────────────────────────────
    if (!responseText) {
      const rule = generateCopilotResponse(text, newIntent, currentPhase, updated, isAgentMode);
      responseText = rule.text;
      shouldNav    = rule.shouldNavigate;
      searchQuery  = rule.searchQuery || searchQuery;
    }

    const replies = getSuggestedReplies(shouldNav ? 'navigating' : currentPhase, newIntent);

    pushBot(responseText, {
      extractedIntent: newIntent,
      uiSynced: shouldNav,
      suggestedReplies: replies,
    });
    speak(responseText);
    setPhase(shouldNav ? 'navigating' : currentPhase);

    if (shouldNav && searchQuery) {
      await delay(1000);
      navigate('/packages', { state: { query: searchQuery } });
      await delay(1500);
      const syncText = 'Packages are up on screen — take a look! Let me know if you want me to compare any of them or help you pick one.';
      pushBot(syncText, {
        uiSynced: true,
        suggestedReplies: ['Compare top 2', 'Best recommendation', 'Cheapest option', 'Build a quote'],
      });
      speak(syncText);
      setPhase('results');
    }
  };

  // ── Mic ─────────────────────────────────────────────────────────────────────
  const handleMic = () => {
    if (isListening) { clearInterval(demoRef.current); recognitionRef.current?.stop(); setIsListening(false); setLiveTranscript(''); return; }
    if (speechReady && recognitionRef.current) {
      setLiveTranscript(''); recognitionRef.current.lang = selectedLang;
      try { recognitionRef.current.start(); } catch { runDemo(); }
    } else { runDemo(); }
  };

  // ── Demo simulation ──────────────────────────────────────────────────────────
  const runDemo = () => {
    const pools: Record<string, string[]> = {
      greeting:  ['Goa for Holi weekend, 4 friends, budget 40 thousand', 'Manali 5 nights, me and my wife, 60k budget', 'Dubai luxury, 4 nights, 2 adults, 1.5 lakh', 'Hum teen log Kerala jaana chahte hain'],
      discovery: ['budget around 60k', '5 nights please', '2 adults no kids', 'beach vibes please', 'December dates'],
      results:   ['compare the top 2', 'which one do you recommend?', 'show me cheapest', 'how do I build a quote'],
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

  // ── Reset ────────────────────────────────────────────────────────────────────
  const resetConversation = () => {
    synthRef.current?.cancel(); clearInterval(demoRef.current);
    setMessages([]); setAccumulatedIntent({}); setPhase('greeting');
    setLiveTranscript(''); setIsListening(false); setIsSpeaking(false); setIsThinking(false);
    setTimeout(() => {
      const g = getGreeting(isAgentMode);
      pushBot(g, { suggestedReplies: ['Plan a trip', 'B2B Agent Mode', 'What can you do?'] });
      setPhase('discovery'); speak(g);
    }, 80);
  };

  const toggleAgentMode = () => {
    const next = !isAgentMode; setIsAgentMode(next); resetConversation();
    toast(next ? 'B2B Agent Mode activated' : 'Standard Mode activated');
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const intentFilled = Object.values(accumulatedIntent).some(v => v !== undefined);
  const lastBotId    = [...messages].reverse().find(m => m.role === 'assistant')?.id ?? null;
  const langName     = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name ?? 'English';
  const statusLabel  = isListening ? `Listening in ${langName}` : isThinking ? 'Thinking' : isSpeaking ? 'Speaking' : isAgentMode ? 'B2B Mode' : geminiKey ? 'AI Mode' : 'Standard Mode';

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── FAB ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        title={isOpen ? 'Close Copilot' : 'Open TripBrain'}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gray-700 hover:bg-gray-800 scale-95' : 'bg-gradient-to-br from-violet-600 to-purple-700 hover:scale-105'
        }`}
      >
        {(isListening || isThinking) && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-20 pointer-events-none" />
        )}
        <Bot className="w-6 h-6 text-white relative z-10" />
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white pointer-events-none" />
        )}
      </button>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          className="fixed z-50 flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{
            width: 420, maxWidth: 'calc(100vw - 16px)',
            height: 640, maxHeight: 'calc(100vh - 100px)',
            bottom: 88, right: 24,
            boxShadow: '0 20px 60px rgba(109,40,217,0.16), 0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(221,214,254,0.6)',
          }}
        >
          {/* API key modal */}
          {showKeyModal && (
            <ApiKeyModal
              onSave={k => setGeminiKey(k || null)}
              onClose={() => setShowKeyModal(false)}
            />
          )}

          {/* ── Header ── */}
          <div className="flex-shrink-0 bg-gradient-to-r from-violet-600 to-purple-700 px-4 pt-3.5 pb-2.5">
            <div className="flex items-center justify-between">
              {/* Avatar + name + status */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight truncate">TripBrain</p>
                  <p className="text-violet-200 text-[11px] leading-tight truncate">{statusLabel}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button onClick={toggleAgentMode} title={isAgentMode ? 'Standard mode' : 'B2B Agent Mode'}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${isAgentMode ? 'bg-white text-violet-700' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                  {isAgentMode ? <PhoneOff className="w-3 h-3" /> : <Phone className="w-3 h-3" />} B2B
                </button>
                <button onClick={() => setTtsOn(v => !v)} title={ttsOn ? 'Mute' : 'Unmute'}
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                  {ttsOn ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5 text-white" />}
                </button>
                <button onClick={() => setShowKeyModal(true)} title={geminiKey ? 'AI active — click to change key' : 'Set Gemini API key for AI mode'}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${geminiKey ? 'bg-emerald-400/30 hover:bg-emerald-400/50' : 'bg-white/15 hover:bg-white/25'}`}>
                  <Key className="w-3.5 h-3.5 text-white" />
                </button>
                <button onClick={() => processInput('what can you do?', false)} title="Help"
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-white" />
                </button>
                <button onClick={resetConversation} title="New conversation"
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Minimise"
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <ChevronDown className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Language pills */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <button key={lang.code}
                  onClick={() => { setSelectedLang(lang.code); if (recognitionRef.current) recognitionRef.current.lang = lang.code; toast(lang.name, { duration: 1000 }); }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 transition-all ${selectedLang === lang.code ? 'bg-white text-violet-700 shadow-sm' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-gray-50/50" style={{ scrollbarWidth: 'thin' }}>

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 select-none">
                <Bot className="w-14 h-14 text-violet-300" />
                <p className="text-sm text-gray-400">Starting…</p>
              </div>
            )}

            {messages.map(msg => {
              const isUser    = msg.role === 'user';
              const isLastBot = msg.id === lastBotId;

              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Bot avatar */}
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 self-end mb-5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`} style={{ maxWidth: '76%' }}>
                    {/* Voice badge */}
                    {isUser && msg.fromVoice && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 px-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> Voice
                      </span>
                    )}

                    {/* Bubble */}
                    <div
                      className={`text-sm leading-relaxed break-words ${
                        isUser
                          ? 'bg-violet-600 text-white rounded-2xl rounded-br-sm shadow-sm shadow-violet-100'
                          : msg.uiSynced
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl rounded-bl-sm shadow-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm'
                      }`}
                      style={{ padding: '10px 14px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      {isUser ? msg.text : <RichText text={msg.text} />}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-gray-400 px-1 select-none">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Suggested reply pills — last bot msg only */}
                    {!isUser && isLastBot && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.suggestedReplies.map((r, i) => (
                          <button key={i}
                            onClick={() => processInput(r.replace(/^[^\w₹a-zA-Z]*/, ''), false)}
                            disabled={isThinking || isListening}
                            className="text-[11px] px-3 py-1 bg-white border border-violet-200 text-violet-700 rounded-full hover:bg-violet-50 hover:border-violet-400 transition-all disabled:opacity-40 shadow-sm whitespace-nowrap"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Ghost transcript while listening */}
            {isListening && (
              <div className="flex items-end gap-2 flex-row-reverse">
                <div className="flex flex-col items-end gap-0.5" style={{ maxWidth: '76%' }}>
                  <span className="text-[10px] text-red-400 flex items-center gap-1 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" /> Speaking
                  </span>
                  <div
                    className="text-sm italic text-violet-600 bg-violet-50 border-2 border-dashed border-violet-300 rounded-2xl rounded-br-sm"
                    style={{ padding: '10px 14px', minWidth: '80px', wordBreak: 'break-word' }}
                  >
                    {liveTranscript
                      ? <>{liveTranscript}<span className="animate-pulse not-italic text-violet-400 ml-0.5">|</span></>
                      : <span className="text-violet-300 not-italic">Listening…</span>
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Thinking dots */}
            {isThinking && (
              <div className="flex items-end gap-2 flex-row">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm" style={{ padding: '12px 16px' }}>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* ── Intent chips ── */}
          {intentFilled && (
            <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Captured:</span>
              {accumulatedIntent.destination && <IC icon="📍" label={accumulatedIntent.destination} />}
              {accumulatedIntent.nights      && <IC icon="🌙" label={`${accumulatedIntent.nights}N`} />}
              {accumulatedIntent.adults !== undefined && (
                <IC icon="👥" label={`${accumulatedIntent.adults}${accumulatedIntent.children ? `+${accumulatedIntent.children}` : ''}`} />
              )}
              {accumulatedIntent.budgetText  && <IC icon="💰" label={accumulatedIntent.budgetText} />}
              {accumulatedIntent.dates       && <IC icon="📅" label={accumulatedIntent.dates} />}
              {accumulatedIntent.vibe        && <IC icon="✨" label={accumulatedIntent.vibe} />}
            </div>
          )}

          {/* ── Input bar ── */}
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2">
              {/* Mic */}
              <button onClick={handleMic} disabled={isThinking}
                className={`relative w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all disabled:opacity-40 ${
                  isListening ? 'bg-red-500 text-white shadow shadow-red-200' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                {isListening && <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25 pointer-events-none" />}
                {isListening ? <MicOff className="w-3.5 h-3.5 relative z-10" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && inputText.trim() && !isThinking && !isListening) processInput(inputText, false); }}
                placeholder={isListening ? `Listening…` : isThinking ? 'Thinking…' : `Message in ${langName}…`}
                disabled={isListening || isThinking}
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              />

              {/* Send */}
              <button
                onClick={() => { if (inputText.trim() && !isThinking && !isListening) processInput(inputText, false); }}
                disabled={!inputText.trim() || isListening || isThinking}
                className="w-8 h-8 rounded-full bg-violet-600 text-white flex-shrink-0 flex items-center justify-center hover:bg-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow shadow-violet-200"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-1.5 leading-none">
              {geminiKey ? 'Gemini AI active' : 'Standard mode — set a key for AI'}
              {' · '}
              {speechReady ? `${langName} mic ready` : 'demo mode'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Intent chip ────────────────────────────────────────────────────────────────
function IC({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] bg-violet-50 text-violet-600 border border-violet-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
      {icon} {label}
    </span>
  );
}

// ── util ───────────────────────────────────────────────────────────────────────
function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }
