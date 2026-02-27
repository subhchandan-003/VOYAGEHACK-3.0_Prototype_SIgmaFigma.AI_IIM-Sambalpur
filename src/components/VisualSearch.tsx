import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Camera, Upload, Image as ImageIcon, X, Search, MapPin, Star, Clock, Plane,
  ChevronRight, Sparkles, Building2, Mountain, Globe, Compass, Heart, Eye, Loader2,
  Clipboard, Smartphone, AlertCircle, CheckCircle2, TrendingUp, Hotel, Activity
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { simulateImageRecognition, LandmarkEntry, categoryLabels } from '../data/visualSearchData';
import { toast } from 'sonner@2.0.3';

type SearchState = 'idle' | 'uploading' | 'analyzing' | 'results';

interface AnalysisStep {
  text: string;
  completed: boolean;
}

export function VisualSearch() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<SearchState>('idle');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [result, setResult] = useState<{ primary: LandmarkEntry; similar: LandmarkEntry[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'activities' | 'tips'>('overview');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // ── Image handlers ────────────────────────────────────────
  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setState('uploading');
      toast.success('Image uploaded! Starting analysis...');
      setTimeout(() => startAnalysis(), 800);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  }, [processImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Paste from clipboard
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          processImage(file);
          toast.success('Image pasted from clipboard!');
          return;
        }
      }
    }
  }, [processImage]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Demo: use a sample image
  const handleDemoSearch = () => {
    setImagePreview('https://images.unsplash.com/photo-1715615153018-68b21fc0d8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800');
    setState('uploading');
    toast.success('Demo image loaded! Starting analysis...');
    setTimeout(() => startAnalysis(), 800);
  };

  // ── Analysis simulation ───────────────────────────────────
  const startAnalysis = () => {
    setState('analyzing');
    const recognition = simulateImageRecognition();
    const steps = recognition.analysisSteps.map(text => ({ text, completed: false }));
    setAnalysisSteps(steps);

    // Animate steps one by one
    steps.forEach((_, idx) => {
      setTimeout(() => {
        setAnalysisSteps(prev => prev.map((s, i) => i <= idx ? { ...s, completed: true } : s));
      }, (idx + 1) * 600);
    });

    // Show results after all steps
    setTimeout(() => {
      setResult({ primary: recognition.primary, similar: recognition.similar });
      setState('results');
      toast.success(`Identified: ${recognition.primary.name}!`, { description: `${recognition.primary.city}, ${recognition.primary.country}` });
    }, (steps.length + 1) * 600);
  };

  const resetSearch = () => {
    setState('idle');
    setImagePreview(null);
    setResult(null);
    setAnalysisSteps([]);
    setActiveTab('overview');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePlanTrip = (landmark: LandmarkEntry) => {
    const query = `${landmark.city}, ${landmark.country}, 5 nights, 2 adults, ${landmark.tags.includes('luxury') ? 'luxury' : 'mid-range'} hotels, budget ₹${landmark.avgBudget}`;
    navigate('/packages', { state: { query, visualSearchResult: landmark } });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from wishlist'); }
      else { next.add(id); toast.success('Added to wishlist!'); }
      return next;
    });
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Architecture': return Building2;
      case 'Historical': return Globe;
      case 'Nature': return Mountain;
      case 'Lifestyle': return Compass;
      case 'Adventure': return Activity;
      case 'Scenic': return Eye;
      default: return MapPin;
    }
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-1">
        <Camera className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-900">Visual Search</h2>
        <span className="ml-2 px-2.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] rounded-full font-medium">AI-Powered</span>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Upload any travel photo — from social media, screenshots, or movie scenes — and our AI will identify the destination and build your trip.
      </p>

      {/* ── IDLE STATE: Upload Area ──────────────────────────── */}
      {state === 'idle' && (
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50 scale-[1.01] shadow-lg shadow-indigo-100'
              : 'border-gray-200 bg-gradient-to-br from-gray-50 to-indigo-50/30 hover:border-indigo-300 hover:bg-indigo-50/50'
          }`}
        >
          <div className="p-8 sm:p-12 text-center">
            {/* Animated icon */}
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all ${
              isDragging ? 'bg-indigo-100 scale-110' : 'bg-gradient-to-br from-indigo-100 to-purple-100'
            }`}>
              {isDragging ? (
                <Upload className="w-9 h-9 text-indigo-600 animate-bounce" />
              ) : (
                <Camera className="w-9 h-9 text-indigo-600" />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {isDragging ? 'Drop your image here!' : 'Search by Image'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Drag & drop a photo, paste from clipboard (Ctrl+V), or click to upload.
              Our AI identifies landmarks, landscapes, and destinations instantly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 shadow-md shadow-indigo-200 transition-all text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
              <button
                onClick={handleDemoSearch}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 transition-all text-sm font-medium shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                Try Demo
              </button>
            </div>

            {/* Supported formats */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPEG, PNG, WebP</span>
              <span className="flex items-center gap-1"><Clipboard className="w-3 h-3" /> Paste from clipboard</span>
              <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Camera capture</span>
            </div>

            {/* Capability badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {['Monuments', 'Landscapes', 'Beaches', 'Temples', 'Skylines', 'Mountains', 'Movie Scenes'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/80 border border-gray-100 text-xs text-gray-500 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            capture="environment"
          />
        </div>
      )}

      {/* ── ANALYZING STATE ──────────────────────────────────── */}
      {(state === 'uploading' || state === 'analyzing') && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Preview */}
            <div className="relative bg-gray-900 flex items-center justify-center min-h-[300px]">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full h-full object-cover opacity-80"
                  style={{ maxHeight: '400px' }}
                />
              )}
              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-indigo-600/10" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />
                {/* Scanning line animation */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-lg shadow-indigo-400/50"
                  style={{ animation: 'scan 2s ease-in-out infinite', top: '0%' }}
                />
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br" />
              </div>
              <button
                onClick={resetSearch}
                className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white backdrop-blur-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Analysis Progress */}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Analyzing Image...</h3>
                  <p className="text-xs text-gray-500">AI is identifying landmarks and destinations</p>
                </div>
              </div>

              <div className="space-y-3">
                {analysisSteps.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-indigo-50 rounded-lg p-3">
                <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${(analysisSteps.filter(s => s.completed).length / Math.max(analysisSteps.length, 1)) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-indigo-600 mt-2 text-center">
                  {analysisSteps.filter(s => s.completed).length} of {analysisSteps.length} steps complete
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS STATE ────────────────────────────────────── */}
      {state === 'results' && result && (
        <div className="space-y-6">
          {/* Main Result Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Image + overlay */}
              <div className="lg:col-span-2 relative min-h-[280px]">
                {imagePreview && (
                  <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" style={{ maxHeight: '450px' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Confidence badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {result.primary.confidence}% Match
                </div>

                <button
                  onClick={resetSearch}
                  className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs rounded-full hover:bg-white transition-colors shadow-sm font-medium flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> New Search
                </button>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="flex items-center gap-1.5 mb-1">
                    {(() => { const Icon = getCategoryIcon(result.primary.category); return <Icon className="w-3.5 h-3.5 text-indigo-300" />; })()}
                    <span className="text-indigo-300 text-xs">{categoryLabels[result.primary.category] || result.primary.category}</span>
                  </div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">{result.primary.name}</h2>
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {result.primary.city}, {result.primary.country}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-3 flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-4 sm:px-6">
                  {([
                    { id: 'overview', label: 'Overview', icon: Eye },
                    { id: 'hotels', label: 'Hotels', icon: Hotel },
                    { id: 'activities', label: 'Activities', icon: Activity },
                    { id: 'tips', label: 'Tips', icon: AlertCircle },
                  ] as const).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: '380px' }}>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{result.primary.description}</p>

                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-amber-800">Fun Fact:</span>
                            <p className="text-xs text-amber-700 mt-0.5">{result.primary.funFact}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-500">Best Time</div>
                          <div className="text-xs font-medium text-gray-900 mt-0.5">{result.primary.bestTime}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <Plane className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-500">Flight</div>
                          <div className="text-xs font-medium text-gray-900 mt-0.5">{result.primary.flightFromDelhi}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-500">Avg Budget</div>
                          <div className="text-xs font-medium text-gray-900 mt-0.5">₹{result.primary.avgBudget.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <Globe className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-500">Visa</div>
                          <div className="text-xs font-medium text-gray-900 mt-0.5">{result.primary.visaRequired ? result.primary.visaType : 'Not Required'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Nearby Attractions</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {result.primary.nearbyAttractions.map(a => (
                            <span key={a} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hotels Tab */}
                  {activeTab === 'hotels' && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 mb-3">Recommended accommodations near {result.primary.name}</p>
                      {result.primary.suggestedHotels.map((hotel, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{hotel.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(hotel.stars)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{hotel.area}</span>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="font-bold text-gray-900 text-sm">₹{hotel.pricePerNight.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-gray-500">per night</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Activities Tab */}
                  {activeTab === 'activities' && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 mb-3">Top experiences at {result.primary.city}</p>
                      {result.primary.suggestedActivities.map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{act.name}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {act.duration}
                              </span>
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded-full">{act.type}</span>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="font-bold text-gray-900 text-sm">
                              {act.price === 0 ? 'Free' : `₹${act.price.toLocaleString('en-IN')}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tips Tab */}
                  {activeTab === 'tips' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Travel Tips</h4>
                        <ul className="space-y-2">
                          {result.primary.travelTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {result.primary.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{tag.replace('-', ' ')}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Footer */}
                <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => toggleWishlist(result.primary.id)}
                    className={`px-4 py-2.5 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      wishlist.has(result.primary.id)
                        ? 'bg-pink-50 border-pink-200 text-pink-600'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.has(result.primary.id) ? 'fill-current' : ''}`} />
                    {wishlist.has(result.primary.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => handlePlanTrip(result.primary)}
                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 text-sm font-medium shadow-md shadow-indigo-200 transition-all"
                  >
                    <Search className="w-4 h-4" />
                    Plan This Trip
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Destinations */}
          {result.similar.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" />
                Similar Destinations You Might Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.similar.map((dest) => {
                  const CatIcon = getCategoryIcon(dest.category);
                  return (
                    <button
                      key={dest.id}
                      onClick={() => handlePlanTrip(dest)}
                      className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <CatIcon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-xs text-gray-400">{dest.confidence}% match</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors">{dest.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        {dest.city}, {dest.country}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">From ₹{dest.avgBudget.toLocaleString('en-IN')}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS for scanning animation */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 90%; opacity: 1; }
          60% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
