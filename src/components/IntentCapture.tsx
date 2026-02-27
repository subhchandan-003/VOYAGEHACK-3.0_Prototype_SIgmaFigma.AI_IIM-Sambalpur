import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Sparkles, MapPin, Calendar, Users, DollarSign, Heart, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../context/AppContext';
import { TravelIntent } from '../types';

const DEMO_PHRASES = [
  'Goa, 5 nights, 2 adults and 1 child, budget 60 thousand, beach resort, mid December',
  'Dubai luxury trip, 4 nights, couple, shopping and theme parks, budget 1.5 lakh',
  'Kerala backwaters, honeymoon, 6 nights, houseboat stay, budget 80 thousand',
  'Manali adventure trip, 3 nights, family of 4, snow activities, budget 40 thousand',
];

export function IntentCapture() {
  const navigate = useNavigate();
  const { setCurrentIntent } = useApp();
  const [naturalQuery, setNaturalQuery] = useState('');
  const [showStructuredForm, setShowStructuredForm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechMode, setSpeechMode] = useState<'real' | 'demo' | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const baseQueryRef = React.useRef('');
  const demoTimerRef = React.useRef<any>(null);
  const demoAbortRef = React.useRef(false);

  // Structured form state
  const [destination, setDestination] = useState('Goa');
  const [startDate, setStartDate] = useState('2026-12-15');
  const [endDate, setEndDate] = useState('2026-12-20');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [budget, setBudget] = useState(60000);
  const [vibes, setVibes] = useState<string[]>(['beach']);

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
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }
      const base = baseQueryRef.current;
      const separator = base && !base.endsWith(' ') ? ' ' : '';
      setNaturalQuery(base + separator + finalTranscript + interimTranscript);
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
        toast.error('Speech recognition error: ' + event.error);
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

  const startDemoListening = () => {
    const phrase = DEMO_PHRASES[Math.floor(Math.random() * DEMO_PHRASES.length)];
    setIsListening(true);
    demoAbortRef.current = false;
    toast('Demo mode: Simulating voice input...', { icon: '🎙️', duration: 2000 });

    let charIndex = 0;
    const baseText = naturalQuery;

    const typeNextChar = () => {
      if (demoAbortRef.current) return;
      if (charIndex <= phrase.length) {
        setNaturalQuery(baseText + (baseText ? ' ' : '') + phrase.slice(0, charIndex));
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
      baseQueryRef.current = naturalQuery;
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

  const handleNaturalSearch = () => {
    // Parse natural query (simplified for demo)
    const intent: TravelIntent = {
      destination: 'Goa',
      dates: {
        startDate: '2026-12-15',
        endDate: '2026-12-20',
        flexible: true
      },
      passengers: {
        adults: 2,
        children: 1,
        infants: 0
      },
      budget: {
        amount: 60000,
        currency: 'INR'
      },
      preferences: {
        vibe: ['beach', 'relaxation'],
        accommodation: ['5-star', 'resort'],
        activities: ['water-sports', 'cultural']
      },
      constraints: []
    };

    setCurrentIntent(intent);
    navigate('/packages');
  };

  const handleStructuredSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const intent: TravelIntent = {
      destination,
      dates: {
        startDate,
        endDate,
        flexible: false
      },
      passengers: {
        adults,
        children,
        infants: 0
      },
      budget: {
        amount: budget,
        currency: 'INR'
      },
      preferences: {
        vibe: vibes,
        accommodation: ['5-star'],
        activities: []
      },
      constraints: []
    };

    setCurrentIntent(intent);
    navigate('/packages');
  };

  const toggleVibe = (vibe: string) => {
    setVibes(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe)
        : [...prev, vibe]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="size-4" />
            <span>AI-Powered Intent Capture</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Turn Client Requests into Ready-to-Sell Packages
          </h1>
          <p className="text-lg text-gray-600">
            One search → Complete dynamic packages → Instant quotes
          </p>
        </div>

        {/* Natural Language Search */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <Sparkles className="size-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 mb-1">Natural Language Search</h2>
              <p className="text-sm text-gray-600">Type what your client wants, just like they said it</p>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder='Example: "Goa, 5 nights, 2 adults + 1 child, budget ₹60k, beach, mid-Dec, flexible dates"'
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
            {isListening && (
              <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>Listening...</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleNaturalSearch}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Search className="size-5" />
              <span>Find Packages</span>
            </button>
            <button
              onClick={toggleListening}
              type="button"
              title={isListening ? 'Stop listening' : 'Start voice input'}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg animate-pulse'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              <span>{isListening ? 'Stop' : 'Speak'}</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Quick examples:</span>
            <button
              onClick={() => setNaturalQuery("Dubai, 4 nights, couple, luxury, ₹1.5L, shopping + beach")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
            >
              Dubai Luxury
            </button>
            <button
              onClick={() => setNaturalQuery("Manali, 3 nights, family of 4, adventure, ₹40k, snow")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
            >
              Manali Adventure
            </button>
            <button
              onClick={() => setNaturalQuery("Kerala backwaters, 6 nights, honeymoon, ₹80k, relaxation")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
            >
              Kerala Honeymoon
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <button
              onClick={() => setShowStructuredForm(!showStructuredForm)}
              className="bg-white px-4 py-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              {showStructuredForm ? 'Hide' : 'Show'} structured form
            </button>
          </div>
        </div>

        {/* Structured Form */}
        {showStructuredForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-semibold text-gray-900 mb-6">Structured Search</h2>
            
            <form onSubmit={handleStructuredSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destination */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="size-4 mr-1" />
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Goa, Dubai, Bali"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="size-4 mr-1" />
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="60000"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="size-4 mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="size-4 mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Adults */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Users className="size-4 mr-1" />
                    Adults
                  </label>
                  <input
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Children */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Users className="size-4 mr-1" />
                    Children
                  </label>
                  <input
                    type="number"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Vibes */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Heart className="size-4 mr-1" />
                  Travel Vibe
                </label>
                <div className="flex flex-wrap gap-2">
                  {['beach', 'adventure', 'luxury', 'cultural', 'relaxation', 'family-friendly', 'romantic'].map((vibe) => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => toggleVibe(vibe)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        vibes.includes(vibe)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <Search className="size-5" />
                <span>Find Perfect Packages</span>
              </button>
            </form>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="size-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Intent Extraction</h3>
            <p className="text-sm text-gray-600">
              Natural language processing understands complex client requests instantly
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="size-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Dynamic Bundling</h3>
            <p className="text-sm text-gray-600">
              Automatically creates 3-5 complete packages from TBO inventory
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Heart className="size-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Confidence Scoring</h3>
            <p className="text-sm text-gray-600">
              Each package rated on match quality and price stability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}