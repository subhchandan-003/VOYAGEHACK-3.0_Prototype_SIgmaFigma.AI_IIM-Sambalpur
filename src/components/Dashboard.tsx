import React from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Search, IndianRupee, Mic, MicOff, Sparkles, MapPin, Calendar, Users, Package, Globe, Shield, ArrowRight, ChevronDown, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AdvancedSearch } from './AdvancedSearch';
import { PopularPackages } from './PopularPackages';
import { RecentSearches } from './RecentSearches';
import { TrendingDestinations } from './TrendingDestinations';
import { VisualSearch } from './VisualSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { tripApi, searchApi } from '../services/api';
import { SUPPORTED_LANGUAGES, extractIntentFromText, getMissingFields } from '../services/voiceAI';
import { demoDestinations, getDestEmoji } from '../data/demoDataset';

// ── Dataset-driven region groups (module-level, derived from static constant) ─
const REGION_GROUPS: { label: string; dests: typeof demoDestinations }[] = (() => {
  const g: Record<string, typeof demoDestinations> = {
    'India': [],
    'SE & NE Asia': [],
    'Middle East': [],
    'Europe': [],
    'Island Escapes': [],
  };
  for (const d of demoDestinations) {
    if (d.country === 'India') g['India'].push(d);
    else if (['Thailand', 'Singapore', 'Indonesia', 'Malaysia', 'Japan', 'South Korea'].includes(d.country)) g['SE & NE Asia'].push(d);
    else if (d.country === 'UAE') g['Middle East'].push(d);
    else if (['France', 'Switzerland', 'Italy', 'Spain', 'Netherlands', 'Hungary', 'Czech Republic', 'Austria', 'Turkey', 'Georgia', 'Azerbaijan'].includes(d.country)) g['Europe'].push(d);
    else g['Island Escapes'].push(d);
  }
  return Object.entries(g).map(([label, dests]) => ({ label, dests }));
})();

const DEMO_PHRASES = [
  'Goa, check-in [Date], check-out [Date], 2 adults + 1 child, by flight, beach resort, all meals, budget 60 thousand',
  'Dubai, check-in [Date], check-out [Date], 2 adults, by flight, deluxe room, breakfast, luxury shopping, budget 1.5 lakh',
  'Alleppey, check-in [Date], check-out [Date], couple, by train, houseboat stay, honeymoon, budget 80 thousand',
  'Manali, check-in [Date], check-out [Date], family of 4, by flight, snow activities, budget 40 thousand',
];

const HERO_IMAGE = 'https://images.unsplash.com/photo-1751699123722-0ec88b5b90dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHRyYXZlbCUyMGFkdmVudHVyZSUyMGFlcmlhbCUyMG9jZWFufGVufDF8fHx8MTc3MjAyMDQzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState<'simple' | 'advanced'>('simple');
  const [isListening, setIsListening] = React.useState(false);
  const [speechMode, setSpeechMode] = React.useState<'real' | 'demo' | null>(null);
  const [voiceLang, setVoiceLang] = React.useState('en-IN');
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);
  const [showMissingPopup, setShowMissingPopup] = React.useState(false);

  const recognitionRef = React.useRef<any>(null);
  const baseQueryRef = React.useRef('');
  const demoTimerRef = React.useRef<any>(null);
  const demoAbortRef = React.useRef(false);
  const langMenuRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Friendly labels and icons for each missing field
  const FIELD_META: Record<string, { label: string; icon: React.ReactNode }> = {
    destination: { label: 'Destination',             icon: <MapPin className="w-3 h-3" /> },
    dates:       { label: 'Check-in / Check-out Dates', icon: <Calendar className="w-3 h-3" /> },
    duration:    { label: 'No. of Nights',            icon: <Calendar className="w-3 h-3" /> },
    travelers:   { label: 'No. of Travelers',         icon: <Users className="w-3 h-3" /> },
    budget:      { label: 'Budget',                   icon: <IndianRupee className="w-3 h-3" /> },
  };

  // Fetch dashboard stats from Express API (falls back to defaults)
  const [quickStats, setQuickStats] = React.useState([
    { label: 'Active Bookings', value: '24', icon: TrendingUp, color: 'blue', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Pending Quotes', value: '8', icon: Search, color: 'amber', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'This Month Revenue', value: '₹12.4L', icon: IndianRupee, color: 'green', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ]);

  React.useEffect(() => {
    tripApi.getStats().then(({ data, fromApi }) => {
      if (fromApi && data) {
        const rev = data.totalRevenue >= 100000 ? `₹${(data.totalRevenue / 100000).toFixed(1)}L` : `₹${data.totalRevenue.toLocaleString('en-IN')}`;
        setQuickStats([
          { label: 'Active Bookings', value: String(data.confirmed + data.inProgress), icon: TrendingUp, color: 'blue', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Pending Quotes', value: String(data.pending), icon: Search, color: 'amber', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
          { label: 'This Month Revenue', value: rev, icon: IndianRupee, color: 'green', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        ]);
      }
    });
  }, []);

  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechMode('demo');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setSpeechMode('real');
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interimTranscript += t;
      }
      const base = baseQueryRef.current;
      const sep = base && !base.endsWith(' ') ? ' ' : '';
      setQuery(base + sep + finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setSpeechMode('demo');
        setIsListening(false);
        toast('Microphone access blocked — switching to demo voice mode', { icon: '🎤' });
        startDemoListening();
        return;
      }
      if (event.error !== 'aborted') {
        toast.error('Speech error: ' + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, []);

  // Update recognition language when user changes it
  React.useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = voiceLang;
  }, [voiceLang]);

  // Close language menu on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const startDemoListening = () => {
    const phrase = DEMO_PHRASES[Math.floor(Math.random() * DEMO_PHRASES.length)];
    setIsListening(true);
    demoAbortRef.current = false;
    toast('Demo mode: Simulating voice input...', { icon: '🎙️', duration: 2000 });

    let charIndex = 0;
    const baseText = query;

    const typeNextChar = () => {
      if (demoAbortRef.current) return;
      if (charIndex <= phrase.length) {
        setQuery(baseText + (baseText ? ' ' : '') + phrase.slice(0, charIndex));
        charIndex++;
        const speed = 30 + Math.random() * 40;
        demoTimerRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsListening(false);
        toast.success('Voice input complete!', { duration: 2000 });
      }
    };

    demoTimerRef.current = setTimeout(typeNextChar, 600);
  };

  const stopDemoListening = () => {
    demoAbortRef.current = true;
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      if (speechMode === 'demo') {
        stopDemoListening();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    if (speechMode === 'demo') {
      startDemoListening();
      return;
    }

    if (recognitionRef.current) {
      baseQueryRef.current = query;
      try {
        recognitionRef.current.start();
      } catch {
        setSpeechMode('demo');
        startDemoListening();
      }
    } else {
      setSpeechMode('demo');
      startDemoListening();
    }
  };

  const exampleSearches = [
    { text: 'Goa, check-in [Date], check-out [Date], 2 adults + 1 child, by flight, beach resort, all meals, budget ₹60k', label: 'Goa Beach Trip', emoji: '🏖️' },
    { text: 'Dubai, check-in [Date], check-out [Date], 2 adults, by flight, deluxe room, breakfast, shopping & theme parks, budget ₹1.5L', label: 'Dubai Family', emoji: '🏙️' },
    { text: 'Manali, check-in [Date], check-out [Date], family of 4, by flight, snow activities, budget ₹40k', label: 'Manali Adventure', emoji: '🏔️' },
  ];


  const handleSearch = async (force = false) => {
    if (!query.trim()) return;

    if (!force) {
      const intent = extractIntentFromText(query);
      const missing = getMissingFields(intent);
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowMissingPopup(true);
        return;
      }
    }

    setShowMissingPopup(false);
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/packages', { state: { query } });
  };

  const handleRecentSearchSelect = (search: any) => {
    const query = `${search.destination}, ${search.dates}, ${search.travelers}`;
    navigate('/packages', { state: { query } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HERO_IMAGE}
            alt="Travel hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/70 to-gray-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-32 sm:pb-40">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-5 text-xs sm:text-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Dynamic Package Builder</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 px-4 leading-tight">
              One Intent → Complete Trip Package
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl mx-auto px-4">
              Describe what your client wants in plain language. TravelAgent will generate ready-to-sell 
              packages with flights, hotels, transfers, and activities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Overlapping the hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Modes */}
        <Tabs value={searchMode} onValueChange={(value: any) => setSearchMode(value)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4">
            <TabsTrigger value="simple">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Search
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Search className="w-4 h-4 mr-2" />
              Advanced Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simple">
            {/* Main Search Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 sm:mt-1 shadow-lg shadow-blue-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your client's trip requirements
                  </label>
                  {/* Format Guide — single line */}
                  <div className="mb-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                    <p className="text-[11px] text-blue-700">
                      <span className="font-semibold">Format:</span>{' '}
                      [Destination] · [Check-in Date] · [Check-out Date] · [No. of Travelers] · [Mode of Travel] · [Room type, meals, budget]
                    </p>
                  </div>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); if (showMissingPopup) setShowMissingPopup(false); }}
                      placeholder="E.g. [Dubai], check-in [15 Mar], check-out [19 Mar], [2 adults], by [flight], [deluxe room + breakfast], budget [₹1.5L]"
                      className={`w-full h-32 px-3 sm:px-4 py-2 sm:py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base transition-colors ${
                        isListening
                          ? 'border-red-400 focus:ring-red-300 bg-red-50/30'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      disabled={isProcessing}
                    />
                    {isListening && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs shadow-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span>Listening{speechMode === 'demo' ? ' (Demo)' : ''}...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <IndianRupee className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline ml-1">AI will extract: destination, dates, travelers, budget & preferences</span>
                  <span className="lg:hidden ml-1">AI extracts key details</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Language selector dropdown */}
                  <div className="relative flex-shrink-0" ref={langMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowLangMenu(v => !v)}
                      title="Voice language"
                      className="flex items-center gap-1 px-2.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>{SUPPORTED_LANGUAGES.find(l => l.code === voiceLang)?.label ?? 'EN'}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                    {showLangMenu && (
                      <div className="absolute bottom-full mb-1.5 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[130px]">
                        {SUPPORTED_LANGUAGES.map(lang => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => { setVoiceLang(lang.code); setShowLangMenu(false); toast(`Voice: ${lang.name}`, { duration: 1200 }); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-blue-50 transition-colors ${voiceLang === lang.code ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}
                          >
                            <span className="font-bold w-6 text-center">{lang.label}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={toggleListening}
                    type="button"
                    title={isListening ? 'Stop listening' : `Start voice input in ${SUPPORTED_LANGUAGES.find(l => l.code === voiceLang)?.name ?? 'English'}`}
                    className={`relative px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all flex-shrink-0 flex items-center gap-2 text-sm sm:text-base ${
                      isListening
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
                    }`}
                  >
                    {isListening && (
                      <span className="absolute inset-0 rounded-xl bg-red-400 animate-ping opacity-20"></span>
                    )}
                    {isListening ? <MicOff className="w-5 h-5 relative z-10" /> : <Mic className="w-5 h-5" />}
                    <span className="relative z-10 hidden sm:inline">{isListening ? 'Stop' : 'Speak'}</span>
                  </button>
                  <button
                    onClick={() => handleSearch()}
                    disabled={!query.trim() || isProcessing}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-sm sm:text-base shadow-md shadow-blue-200 disabled:shadow-none"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Find Packages
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Missing Details Gentle Nudge ─────────────────────────────── */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                showMissingPopup
                  ? 'max-h-72 opacity-100 mb-5'
                  : 'max-h-0 opacity-0 mb-0 pointer-events-none'
              }`}
            >
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  {/* Icon badge */}
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-amber-900 leading-snug">
                        A few details would help us find better packages
                      </p>
                      <button
                        onClick={() => setShowMissingPopup(false)}
                        className="flex-shrink-0 p-0.5 text-amber-400 hover:text-amber-600 rounded transition-colors"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtitle */}
                    <p className="text-xs text-amber-700 mb-3 leading-relaxed">
                      Your search is missing:{' '}
                      {missingFields.map((f, i) => (
                        <span key={f}>
                          {i > 0 && ', '}
                          <strong>{FIELD_META[f]?.label ?? f}</strong>
                        </span>
                      ))}
                      . Adding these lets our AI match the perfect package for your client.
                    </p>

                    {/* Missing field chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {missingFields.map(field => (
                        <span
                          key={field}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-amber-300 text-amber-800 rounded-full text-xs font-medium shadow-sm"
                        >
                          {FIELD_META[field]?.icon}
                          {FIELD_META[field]?.label ?? field}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setShowMissingPopup(false); textareaRef.current?.focus(); }}
                        className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 active:scale-95 transition-all"
                      >
                        Add details
                      </button>
                      <button
                        onClick={() => handleSearch(true)}
                        className="px-3.5 py-1.5 bg-white border border-amber-300 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-50 active:scale-95 transition-all"
                      >
                        Continue anyway
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Destination Picker — dataset-powered, 40 destinations */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-3 px-1 font-medium">Popular destinations — click to search:</h3>
              <div className="space-y-2.5">
                {REGION_GROUPS.map(({ label, dests }) => (
                  <div key={label}>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5 px-0.5">{label}</p>
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {dests.map(dest => {
                        const budgetK = Math.round(dest.starting_package_pp_inr * 2 / 1000);
                        const q = `${dest.city}, ${dest.sample_nights} nights, 2 adults, ${dest.theme}, budget ₹${budgetK}k`;
                        return (
                          <button
                            key={dest.destination_id}
                            onClick={() => { setQuery(q); navigate('/packages', { state: { query: q } }); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm whitespace-nowrap flex-shrink-0"
                          >
                            <span>{getDestEmoji(dest.theme)}</span>
                            <span>{dest.city}</span>
                            <span className="text-gray-300 mx-0.5">·</span>
                            <span className="text-emerald-600 font-semibold">₹{(dest.starting_package_pp_inr / 1000).toFixed(0)}k</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Searches */}
            <div className="mb-8">
              <h3 className="text-sm text-gray-500 mb-3 px-1">Or try these full examples:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {exampleSearches.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example.text)}
                    className="text-left p-4 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{example.emoji}</span>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{example.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{example.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedSearch />
          </TabsContent>
        </Tabs>

        {/* Recent Searches */}
        <RecentSearches onSearchSelect={handleRecentSearchSelect} />

        {/* Visual Search - Image to Trip */}
        <VisualSearch />

        {/* Trending Destinations */}
        <TrendingDestinations />

        {/* Popular Packages */}
        <PopularPackages />

        {/* Why TBO Section */}
        <div className="mt-10 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Why Travel Agents Love TBO TravelAgent™</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">AI-powered tools built for B2B travel professionals to create, sell, and manage trips faster</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Package,
                title: 'Dynamic Bundling',
                description: 'Auto-generates 3-5 complete trip packages from TBO inventory in seconds',
                gradient: 'from-blue-500 to-blue-600',
              },
              {
                icon: Sparkles,
                title: 'Smart Matching',
                description: 'Confidence scores show how well each package matches client intent',
                gradient: 'from-purple-500 to-purple-600',
              },
              {
                icon: Globe,
                title: '1M+ Hotels & Flights',
                description: 'Access global inventory with real-time pricing and availability',
                gradient: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: Shield,
                title: 'Quote & Book',
                description: 'Generate branded client quotes and book with one-click confirmation',
                gradient: 'from-orange-500 to-orange-600',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-10 text-center shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Build Smarter Packages?</h2>
          <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-lg mx-auto">
            Start creating AI-powered travel packages in seconds. Your clients will love the personalized experience.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-700 px-6 sm:px-8 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Start Searching
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}