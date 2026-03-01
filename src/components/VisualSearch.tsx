import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Camera, Upload, X, Search, MapPin, Clock, Plane,
  ChevronRight, Sparkles, Building2, Mountain, Globe, Compass,
  Heart, Eye, Loader2, AlertCircle, CheckCircle2, TrendingUp,
  Activity, ImageIcon, Zap,
} from 'lucide-react';
import { simulateImageRecognition, LandmarkEntry, categoryLabels, landmarkDatabase } from '../data/visualSearchData';
import { toast } from 'sonner';
import { findDemoDestination } from '../data/demoDataset';

// ─── Gemini API key ────────────────────────────────────────────────────────────
const GEMINI_KEY = 'AIzaSyAxK4hIYv0nfSft9QyEos255ZwTsoQKlH8';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GeminiIdent {
  name: string;
  aliases: string[];
  city: string;
  country: string;
  region: string;
  category: string;
  destinationType: string;
  description: string;
  confidence: number;
  searchKeywords: string[];
  alternativeGuesses: { name: string; city: string; country: string; confidence: number }[];
}

type SearchState = 'idle' | 'analyzing' | 'results' | 'error';

interface Step { text: string; done: boolean }

// ─── Image compression ────────────────────────────────────────────────────────
// Accepts any format, always outputs JPEG so Gemini receives a consistent MIME type.
function compressImage(base64: string, inputMime = 'image/jpeg', maxDim = 1536, quality = 0.92): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]);
    };
    img.onerror = () => resolve(base64);
    // Use the real MIME so the browser decodes the source correctly before re-encoding to JPEG
    img.src = `data:${inputMime};base64,${base64}`;
  });
}

// ─── Gemini Vision ─────────────────────────────────────────────────────────────
// NOTE: compressed image is always JPEG — mime_type is hardcoded to image/jpeg.
// system_instruction and topK/topP are deliberately omitted: they are not
// supported on all models and silently cause 400 errors on some endpoints.
async function identifyWithGemini(base64: string): Promise<GeminiIdent | null> {
  const prompt = `You are a world-class travel landmark identification AI.
Look at this image carefully and identify EXACTLY what landmark, monument, building, or travel destination is shown.

RULES — follow strictly:
1. Return the single most precise, universally-known name.
   Examples: "Taj Mahal" not "Indian mausoleum" | "Eiffel Tower" not "Paris tower" | "Burj Khalifa" not "tall Dubai building" | "Gateway of India" not "Mumbai arch" | "Colosseum" not "ancient ruins".
2. For Seven Wonders, UNESCO World Heritage Sites, globally famous landmarks — name them EXACTLY as they are universally known.
3. For Indian landmarks use: Taj Mahal / Gateway of India / Hawa Mahal / Qutub Minar / India Gate / Red Fort / Lotus Temple.
4. For natural wonders use: Grand Canyon / Victoria Falls / Mount Everest / Niagara Falls.
5. For city skylines: "Dubai Marina Skyline" / "New York Skyline" / "Singapore Skyline".
6. Set confidence (0–100) honestly based on how certain you are.

Return ONLY valid JSON — no markdown fences, no explanation, no extra text:
{
  "name": "EXACT landmark name",
  "aliases": ["alternate name if any"],
  "city": "nearest major city",
  "country": "country name",
  "region": "state or province",
  "category": "Architecture|Historical|Nature|Adventure|Scenic|Cultural",
  "destinationType": "monument|temple|palace|beach|mountain|ruins|waterfall|island|skyline|canyon|forest|desert|lake|garden|other",
  "description": "2 engaging sentences about visiting this place",
  "confidence": 95,
  "searchKeywords": ["keyword1", "keyword2", "keyword3"],
  "alternativeGuesses": [
    {"name": "second best guess", "city": "city", "country": "country", "confidence": 30}
  ]
}`;

  // Try models in order of reliability. gemini-1.5-flash is the most stable
  // free-tier model; 2.0-flash and 1.5-pro are tried as progressively larger fallbacks.
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                // Always JPEG after compressImage — never send a mismatched MIME type
                { inline_data: { mime_type: 'image/jpeg', data: base64 } },
              ],
            }],
            generationConfig: { temperature: 0, maxOutputTokens: 800 },
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.warn(`Gemini ${model}: HTTP ${res.status}`, errBody);
        continue;
      }

      const data = await res.json();
      const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) { console.warn(`Gemini ${model}: no JSON in response`, raw.slice(0, 200)); continue; }

      const p = JSON.parse(match[0]);
      return {
        name: String(p.name || 'Unknown Destination'),
        aliases: Array.isArray(p.aliases) ? p.aliases : [],
        city: String(p.city || ''),
        country: String(p.country || ''),
        region: String(p.region || ''),
        category: String(p.category || 'Scenic'),
        destinationType: String(p.destinationType || 'other'),
        description: String(p.description || ''),
        confidence: Math.min(100, Math.max(0, Number(p.confidence) || 70)),
        searchKeywords: Array.isArray(p.searchKeywords) ? p.searchKeywords : [],
        alternativeGuesses: Array.isArray(p.alternativeGuesses) ? p.alternativeGuesses : [],
      };
    } catch (err) {
      console.warn(`Gemini ${model} error:`, err);
    }
  }
  return null;
}

// ─── DB matching / synthesis ───────────────────────────────────────────────────
function scoreMatch(entry: LandmarkEntry, g: GeminiIdent): number {
  const en = entry.name.toLowerCase();
  const ec = entry.city.toLowerCase();
  const eco = entry.country.toLowerCase();
  const gn = g.name.toLowerCase();
  const gc = g.city.toLowerCase();
  const gco = g.country.toLowerCase();
  const gr = g.region.toLowerCase();
  const allAliases = g.aliases.map(a => a.toLowerCase());
  const allKeywords = g.searchKeywords.map(k => k.toLowerCase());

  let score = 0;
  if (en === gn) score += 100;
  else if (en.includes(gn) || gn.includes(en)) score += 70;
  else if (allAliases.some(a => en.includes(a) || a.includes(en))) score += 55;
  else if (allKeywords.some(k => en.includes(k))) score += 30;

  if (ec && gc && (ec === gc || ec.includes(gc) || gc.includes(ec))) score += 40;
  else if (ec && gr && (ec.includes(gr) || gr.includes(ec))) score += 22;

  if (eco && gco && (eco.includes(gco) || gco.includes(eco))) score += 10;
  if (entry.category.toLowerCase() === g.category.toLowerCase()) score += 15;
  if (entry.tags.some(t => t === g.destinationType)) score += 10;
  if (g.alternativeGuesses.some(a => en.includes(a.name.toLowerCase()) || ec.includes(a.city.toLowerCase()))) score += 20;

  return score;
}

function matchOrSynthesize(g: GeminiIdent): { primary: LandmarkEntry; similar: LandmarkEntry[] } {
  const scored = landmarkDatabase
    .map(e => ({ entry: e, score: scoreMatch(e, g) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (best.score >= 30) {
    const primary: LandmarkEntry = {
      ...best.entry,
      confidence: g.confidence,
      description: g.confidence >= 80 && g.description ? g.description : best.entry.description,
    };
    const similar: LandmarkEntry[] = scored
      .slice(1).filter(s => s.score > 0).slice(0, 4)
      .map(s => ({ ...s.entry, confidence: Math.min(90, Math.round(35 + s.score / 2)) }));
    if (similar.length < 4) {
      landmarkDatabase
        .filter(e => e.id !== best.entry.id && !similar.find(s => s.id === e.id))
        .sort(() => Math.random() - 0.5).slice(0, 4 - similar.length)
        .forEach(e => similar.push({ ...e, confidence: Math.round(35 + Math.random() * 20) }));
    }
    return { primary, similar };
  }

  const inferContinent = (country: string): string => {
    const c = country.toLowerCase();
    if (['india', 'china', 'japan', 'thailand', 'indonesia', 'vietnam', 'singapore', 'malaysia', 'maldives', 'nepal', 'sri lanka'].some(x => c.includes(x))) return 'Asia';
    if (['france', 'italy', 'spain', 'germany', 'united kingdom', 'uk', 'greece', 'turkey', 'norway', 'switzerland'].some(x => c.includes(x))) return 'Europe';
    if (['usa', 'united states', 'canada', 'mexico'].some(x => c.includes(x))) return 'North America';
    if (['brazil', 'argentina', 'peru', 'colombia', 'chile'].some(x => c.includes(x))) return 'South America';
    if (['australia', 'new zealand'].some(x => c.includes(x))) return 'Oceania';
    if (['kenya', 'south africa', 'egypt', 'morocco'].some(x => c.includes(x))) return 'Africa';
    return 'Unknown';
  };

  const isIndia = g.country.toLowerCase().includes('india');
  const noVisa = ['india', 'maldives', 'nepal', 'bhutan'].some(x => g.country.toLowerCase().includes(x));
  const demoData = findDemoDestination(g.city);

  const synth: LandmarkEntry = {
    id: `ai-${Date.now()}`,
    name: g.name,
    category: g.category,
    subcategory: g.destinationType,
    city: g.city,
    country: g.country,
    continent: inferContinent(g.country),
    description: g.description || `${g.name} is a remarkable destination in ${g.city}, ${g.country}.`,
    funFact: `${g.name} was identified by Gemini AI Vision with ${g.confidence}% confidence from your photo.`,
    bestTime: demoData?.best_months ?? 'Year-round',
    avgBudget: demoData?.starting_package_pp_inr ?? (isIndia ? 35000 : 90000),
    flightFromDelhi: isIndia ? '1–3 hours' : 'Varies by origin',
    visaRequired: !noVisa,
    visaType: noVisa ? undefined : 'Tourist Visa',
    nearbyAttractions: g.alternativeGuesses.map(a => a.name).filter(Boolean),
    suggestedHotels: demoData ? [] : [],
    suggestedActivities: demoData?.activity_menu?.slice(0, 4).map(a => ({ name: a.name, duration: '3 hours', price: a.price, type: 'Experience' })) ?? [],
    travelTips: [
      `Best time to visit ${g.name}: ${demoData?.best_months ?? 'check seasonal conditions'}.`,
      ...g.searchKeywords.slice(0, 2).map(k => `Known for: ${k}`),
      `Explore ${g.city} city for local culture and cuisine.`,
    ],
    tags: [g.destinationType, g.category.toLowerCase(), g.country.toLowerCase().replace(/\s+/g, '-'), ...g.searchKeywords.slice(0, 3)].filter(Boolean),
    similarDestinations: g.alternativeGuesses.map(a => a.name),
    confidence: g.confidence,
  };

  const similar = landmarkDatabase
    .filter(e => e.category === g.category || e.country === g.country)
    .sort(() => Math.random() - 0.5).slice(0, 4)
    .map(e => ({ ...e, confidence: Math.round(38 + Math.random() * 25) }));

  return { primary: synth, similar };
}

// ─── Category icons ────────────────────────────────────────────────────────────
function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'Architecture': return Building2;
    case 'Historical': return Globe;
    case 'Nature': return Mountain;
    case 'Adventure': return Activity;
    case 'Scenic': return Eye;
    default: return MapPin;
  }
}

// ─── Confidence colour ─────────────────────────────────────────────────────────
function confColour(n: number): { bg: string; text: string; ring: string } {
  if (n >= 85) return { bg: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-200' };
  if (n >= 65) return { bg: 'bg-blue-500', text: 'text-blue-700', ring: 'ring-blue-200' };
  return { bg: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-200' };
}

// ─── Component ─────────────────────────────────────────────────────────────────
// ─── Demo sequence ─────────────────────────────────────────────────────────────
const DEMO_SEQUENCE = ['taj-mahal', 'burj-khalifa', 'eiffel-tower', 'gateway-of-india'] as const;
const DEMO_IMAGES: Record<string, string> = {
  'taj-mahal':        'https://images.unsplash.com/photo-1548013146-72479768bada?w=900',
  'burj-khalifa':     'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900',
  'eiffel-tower':     'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=900',
  'gateway-of-india': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=900',
};

export function VisualSearch() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const demoIndexRef = useRef(0);

  const [state, setState] = useState<SearchState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<{ primary: LandmarkEntry; similar: LandmarkEntry[] } | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'tips'>('overview');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Image processing ──────────────────────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      const raw = dataUrl.split(',')[1] ?? '';
      // Pass the real MIME so the browser decodes the source correctly,
      // then runAnalysis always receives JPEG output from compressImage.
      const compressed = await compressImage(raw, file.type || 'image/jpeg');
      runAnalysis(compressed);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

  // ── Demo — cycles through Taj Mahal → Burj Khalifa → Eiffel Tower → Gateway of India ──
  const handleDemo = () => {
    const id = DEMO_SEQUENCE[demoIndexRef.current];
    demoIndexRef.current = (demoIndexRef.current + 1) % DEMO_SEQUENCE.length;

    const entry = landmarkDatabase.find(e => e.id === id);
    if (!entry) return;

    const primary: LandmarkEntry = { ...entry, confidence: 95 };

    // Pick similar: same category first, then fill from any
    const similar: LandmarkEntry[] = landmarkDatabase
      .filter(e => e.id !== id && (e.category === entry.category || e.country === entry.country))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(e => ({ ...e, confidence: Math.round(42 + Math.random() * 32) }));

    setPreview(DEMO_IMAGES[id] ?? null);
    setResult({ primary, similar });
    setState('results');
    toast.success(`Demo: ${entry.name}`, { description: `${entry.city}, ${entry.country}` });
  };

  // ── Analysis ──────────────────────────────────────────────────────────────
  const runAnalysis = async (base64: string) => {
    setState('analyzing');
    setResult(null);
    setErrorMsg('');
    setActiveTab('overview');

    const stepTexts = [
      'Compressing & uploading image...',
      'Sending to Gemini Vision AI...',
      'Identifying landmarks & visual features...',
      'Matching destination database...',
      'Building travel recommendations...',
    ];
    const initial: Step[] = stepTexts.map(text => ({ text, done: false }));
    setSteps(initial);

    stepTexts.forEach((_, idx) => {
      setTimeout(() => {
        setSteps(prev => prev.map((s, i) => i <= idx ? { ...s, done: true } : s));
      }, (idx + 1) * 650);
    });

    const t0 = Date.now();
    const aiResult = await identifyWithGemini(base64);
    const minMs = (stepTexts.length + 1) * 650;
    const wait = Math.max(0, minMs - (Date.now() - t0));

    setTimeout(() => {
      if (aiResult) {
        const matched = matchOrSynthesize(aiResult);
        setResult(matched);
        setState('results');
        toast.success(`Identified: ${aiResult.name}`, {
          description: `${aiResult.city ? aiResult.city + ', ' : ''}${aiResult.country} — ${aiResult.confidence}% confidence`,
        });
      } else {
        // Show a real error — never show random results as if they were identified
        setState('error');
        setErrorMsg('Gemini could not identify this image. Please try a clearer photo with the landmark prominently visible, then upload again.');
        toast.error('Could not identify landmark', { description: 'Try a well-lit, front-facing photo of a famous landmark.' });
      }
    }, wait);
  };

  const reset = () => {
    setState('idle');
    setPreview(null);
    setResult(null);
    setSteps([]);
    setErrorMsg('');
    setActiveTab('overview');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const planTrip = (lm: LandmarkEntry) => {
    const dest = findDemoDestination(lm.city);
    const nights = dest?.sample_nights ?? 5;
    const budget = Math.round((dest?.starting_package_pp_inr ?? lm.avgBudget) * 2.5 / 1000);
    const query = `${lm.city}, ${lm.country}, ${nights} nights, 2 adults, budget ₹${budget}k`;
    navigate('/packages', { state: { query, visualSearchResult: lm } });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); toast('Removed from wishlist'); }
      else { n.add(id); toast.success('Saved to wishlist!'); }
      return n;
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="mb-10">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Camera className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Visual Search</h2>
        <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-semibold rounded-full flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" /> Gemini AI
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Upload any travel photo and Gemini Vision AI identifies the destination — monuments, beaches, skylines, temples, and more.
      </p>

      {/* ── IDLE ───────────────────────────────────────────────────────────── */}
      {state === 'idle' && (
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`rounded-2xl border-2 border-dashed transition-all duration-200 bg-white ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          {/* ── Top zone ── */}
          <div className="px-10 pt-10 pb-8">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-colors ${
              isDragging ? 'bg-indigo-100' : 'bg-gray-100'
            }`}>
              {isDragging
                ? <Upload className="w-7 h-7 text-indigo-600" />
                : <Camera className="w-7 h-7 text-gray-500" />
              }
            </div>

            {/* Title */}
            <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
              {isDragging ? 'Drop your image here' : 'Search by Photo'}
            </h3>

            {/* Description */}
            <p className="text-center text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-7">
              Drag and drop a travel photo or upload one. Gemini Vision AI identifies any landmark, monument, or cityscape instantly.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '10px 28px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4338ca')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4f46e5')}
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={handleDemo}
                style={{
                  padding: '10px 28px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  borderRadius: '10px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.backgroundColor = '#f5f5ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                Try Demo
              </button>
            </div>

            {/* Format info */}
            <p className="text-center text-xs text-gray-400">
              JPEG · PNG · WebP · up to 10 MB &nbsp;·&nbsp;
              <span className="text-indigo-500 font-medium">Powered by Gemini Vision</span>
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-gray-100 mx-8" />

          {/* ── Recognition tags ── */}
          <div className="px-8 py-5">
            <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Can Recognise
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: 'Monuments', icon: Building2 },
                { label: 'Beaches', icon: Compass },
                { label: 'Mountains', icon: Mountain },
                { label: 'Temples', icon: Globe },
                { label: 'City Skylines', icon: Eye },
                { label: 'Ancient Ruins', icon: MapPin },
                { label: 'Landscapes', icon: Activity },
                { label: 'Natural Wonders', icon: Sparkles },
              ].map(({ label, icon: Icon }) => (
                <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-[12px] text-gray-600 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* ── ANALYZING ──────────────────────────────────────────────────────── */}
      {state === 'analyzing' && (
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image with scan overlay */}
            <div className="relative min-h-[320px] bg-gray-900 flex items-center justify-center overflow-hidden">
              {preview && (
                <img src={preview} alt="Analyzing" className="w-full h-full object-cover opacity-75" style={{ maxHeight: '420px' }} />
              )}
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-transparent to-indigo-900/30" />

              {/* Scanning line */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-lg shadow-indigo-400"
                style={{ animation: 'scanLine 1.8s ease-in-out infinite' }} />

              {/* Corner brackets */}
              {[
                'top-5 left-5 border-t-2 border-l-2 rounded-tl-lg',
                'top-5 right-5 border-t-2 border-r-2 rounded-tr-lg',
                'bottom-5 left-5 border-b-2 border-l-2 rounded-bl-lg',
                'bottom-5 right-5 border-b-2 border-r-2 rounded-br-lg',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-7 h-7 border-indigo-400 ${cls}`} />
              ))}

              {/* AI badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                <Loader2 className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
                <span className="text-white text-xs font-medium">Gemini Vision</span>
              </div>

              <button onClick={reset}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white backdrop-blur-sm transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps */}
            <div className="p-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Analyzing Image…</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Gemini AI is identifying your destination</p>
                </div>
              </div>

              <div className="space-y-3.5 mb-7">
                {steps.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${step.done ? 'opacity-100' : 'opacity-35'}`}>
                    {step.done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      : <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    }
                    <span className={`text-sm ${step.done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${(steps.filter(s => s.done).length / Math.max(steps.length, 1)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-indigo-500 mt-2 font-medium">
                {steps.filter(s => s.done).length} / {steps.length} steps complete
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR ──────────────────────────────────────────────────────────── */}
      {state === 'error' && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Could not identify destination</h3>
          <p className="text-sm text-gray-500 mb-5">{errorMsg || 'Gemini could not recognise the image. Try a clearer photo of a landmark or scenery.'}</p>
          <button onClick={reset}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors">
            Try Another Image
          </button>
        </div>
      )}

      {/* ── RESULTS ────────────────────────────────────────────────────────── */}
      {state === 'results' && result && (() => {
        const { primary, similar } = result;
        const conf = confColour(primary.confidence);
        const CatIcon = getCategoryIcon(primary.category);
        return (
          <div className="space-y-5">
            {/* ── Main card ── */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Left: image */}
                <div className="lg:col-span-2 relative min-h-[280px] overflow-hidden">
                  {preview ? (
                    <img src={preview} alt={primary.name} className="w-full h-full object-cover" style={{ maxHeight: '500px' }} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-indigo-300" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

                  {/* Confidence badge */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${conf.bg} text-white text-xs font-bold rounded-full shadow-lg`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {primary.confidence}% Confidence
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full">
                      <Zap className="w-3 h-3 text-violet-300" /> Gemini Vision
                    </div>
                  </div>

                  {/* New search */}
                  <button onClick={reset}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs rounded-full hover:bg-white transition-colors shadow-sm font-medium flex items-center gap-1">
                    <Camera className="w-3 h-3" /> New Search
                  </button>

                  {/* Bottom name */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CatIcon className="w-3.5 h-3.5 text-indigo-300" />
                      <span className="text-indigo-300 text-xs">{categoryLabels[primary.category] || primary.category}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white leading-tight">{primary.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-white/70" />
                      <span className="text-white/80 text-sm">{primary.city}{primary.city && primary.country ? ', ' : ''}{primary.country}</span>
                    </div>
                  </div>
                </div>

                {/* Right: details */}
                <div className="lg:col-span-3 flex flex-col">
                  {/* Tabs */}
                  <div className="flex gap-1 border-b border-gray-100 px-5 pt-4">
                    {(['overview', 'tips'] as const).map(tab => (
                      <button key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors capitalize ${
                          activeTab === tab
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}>
                        {tab === 'overview' ? 'Overview' : 'Travel Tips'}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto" style={{ maxHeight: '360px' }}>
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700 leading-relaxed">{primary.description}</p>

                        {/* Fun fact */}
                        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 leading-relaxed">{primary.funFact}</p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { icon: Clock, label: 'Best Time', value: primary.bestTime },
                            { icon: Plane, label: 'From Delhi', value: primary.flightFromDelhi },
                            { icon: TrendingUp, label: 'Avg Budget', value: `₹${primary.avgBudget.toLocaleString('en-IN')}` },
                            { icon: Globe, label: 'Visa', value: primary.visaRequired ? (primary.visaType || 'Required') : 'Not Required' },
                          ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                              <Icon className="w-4 h-4 text-indigo-400 mx-auto mb-1.5" />
                              <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
                              <div className="text-xs font-semibold text-gray-900">{value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Nearby */}
                        {primary.nearbyAttractions.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 mb-2">Nearby Attractions</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {primary.nearbyAttractions.map(a => (
                                <span key={a} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        {primary.suggestedActivities.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 mb-2">Top Experiences</h4>
                            <div className="space-y-2">
                              {primary.suggestedActivities.slice(0, 3).map((act, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-xs text-gray-800">{act.name}</span>
                                  </div>
                                  <span className="text-xs font-medium text-gray-600">
                                    {act.price === 0 ? 'Free' : `₹${act.price.toLocaleString('en-IN')}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'tips' && (
                      <div className="space-y-3">
                        {primary.travelTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                          </div>
                        ))}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-600 mb-2 mt-3">Tags</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {primary.tags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                                {tag.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA bar */}
                  <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3">
                    <button
                      onClick={() => toggleWishlist(primary.id)}
                      className={`p-2.5 border rounded-xl transition-colors ${
                        wishlist.has(primary.id)
                          ? 'bg-pink-50 border-pink-200 text-pink-600'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.has(primary.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => planTrip(primary)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-md shadow-indigo-200 transition-all"
                    >
                      <Search className="w-4 h-4" />
                      Plan This Trip
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Similar destinations ── */}
            {similar.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-500" />
                  You Might Also Like
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {similar.map(dest => {
                    const Icon = getCategoryIcon(dest.category);
                    return (
                      <button
                        key={dest.id}
                        onClick={() => planTrip(dest)}
                        className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center mb-3 group-hover:from-indigo-100 group-hover:to-violet-100 transition-colors">
                          <Icon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors leading-snug">
                          {dest.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                          <MapPin className="w-2.5 h-2.5" />
                          {dest.city}, {dest.country}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">₹{dest.avgBudget.toLocaleString('en-IN')}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* CSS animations */}
      <style>{`
        @keyframes scanLine {
          0%, 100% { top: 5%; opacity: 0; }
          10%       { opacity: 1; }
          50%       { top: 90%; opacity: 1; }
          65%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
