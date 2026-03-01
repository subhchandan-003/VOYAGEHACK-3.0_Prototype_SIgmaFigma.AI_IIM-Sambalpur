import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { PackageCard } from '../components/PackageCard';
import { ArrowLeft, Filter, SlidersHorizontal, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { TravelPackage } from '../types';
import { findDemoDestination } from '../data/demoDataset';
import { generatePackages, parseQuery } from '../utils/packageGenerator';

// ─────────────────────────────────────────────────────────────────────────────

export function PackagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentIntent, setSelectedPackage } = useApp();

  const queryStr: string = (location.state as any)?.query ?? '';
  const parsed = React.useMemo(() => parseQuery(queryStr), [queryStr]);

  // Enrich header with dataset info
  const destInfo = React.useMemo(() => findDemoDestination(parsed.destination), [parsed.destination]);

  const [displayPackages, setDisplayPackages] = React.useState<TravelPackage[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setDisplayPackages(generatePackages(parsed.destination, parsed.nights, parsed.adults));
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [parsed.destination, parsed.nights, parsed.adults]);

  const handleSelectPackage = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    navigate('/customize');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {loading
                  ? 'Finding packages…'
                  : `${displayPackages.length} Packages for ${parsed.destination}`}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {parsed.destination}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                  🌙 {parsed.nights} nights
                </span>
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                  👥 {parsed.adults} adult{parsed.adults > 1 ? 's' : ''}
                </span>
                {destInfo && (
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                    ✨ {destInfo.theme}
                  </span>
                )}
                {destInfo && (
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
                    from ₹{(destInfo.starting_package_pp_inr / 1000).toFixed(0)}k pp
                  </span>
                )}
                {parsed.budgetText && (
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                    💰 {parsed.budgetText}
                  </span>
                )}
                {parsed.dates && (
                  <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full">
                    📅 {parsed.dates}
                  </span>
                )}
                {parsed.vibe && (
                  <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full">
                    ✨ {parsed.vibe}
                  </span>
                )}
                {!queryStr && currentIntent && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    📍 {currentIntent.destination}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="size-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="size-4" />
                <span className="text-sm font-medium">Sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 text-sm">
              Searching packages for <span className="font-semibold text-gray-800">{parsed.destination}</span>…
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {displayPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onSelect={() => handleSelectPackage(pkg)}
                />
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Insights for {parsed.destination}
              </h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Packages are sorted by confidence score — higher score means better fit for your requirements</li>
                <li>• {parsed.destination} is best visited {parsed.dates ? `in ${parsed.dates}` : 'during the ideal travel season'}</li>
                {destInfo && <li>• Top activities: {destInfo.activity_menu.slice(0, 2).map(a => `${a.name} (₹${a.price.toLocaleString('en-IN')})`).join(' · ')}</li>}
                <li>• Premium package includes business class & butler service for a premium experience</li>
                <li>• Book within 48 hours — prices may increase based on demand and seat availability</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
