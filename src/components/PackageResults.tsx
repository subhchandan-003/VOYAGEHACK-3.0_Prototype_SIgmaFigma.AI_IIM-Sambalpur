import { useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Plane, Hotel, Car, Compass, TrendingUp, Check, ChevronRight, Star, Info, SlidersHorizontal, ArrowUpDown, GitCompare } from 'lucide-react';
import { generatePackages, parseQuery } from '../utils/packageGenerator';
import { TravelPackage } from '../types';
import { PackageFilters } from './PackageFilters';
import { PackageComparison } from './PackageComparison';
import { DestinationGuide } from './DestinationGuide';
import { FareCalendar } from './FareCalendar';
import { DealBadges } from './DealBadges';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { packageApi, searchApi } from '../services/api';

export function PackageResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || '';
  const parsed = parseQuery(query);
  const { destination, nights, adults } = parsed;
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [packagesToCompare, setPackagesToCompare] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'confidence'>('confidence');
  const [showFareCalendar, setShowFareCalendar] = useState(false);
  const [showDestinationGuide, setShowDestinationGuide] = useState(true);

  useEffect(() => {
    // Persist the search to MongoDB via Express API
    if (query) {
      const dest = query.split(',')[0]?.trim() || 'Unknown';
      searchApi.create({ query, destination: dest, dates: '', travelers: '' }).catch(() => {});
    }

    // Try fetching from Express API first, fall back to mock data
    const fetchPackages = async () => {
      try {
        const { data, fromApi } = await packageApi.search(query);
        if (fromApi && data && data.length > 0) {
          setPackages(data);
          setFilteredPackages(data);
          setIsLoading(false);
          return;
        }
      } catch {}

      // Fallback: use dataset-powered generator with simulated delay
      setTimeout(() => {
        const generated = generatePackages(destination, nights, adults);
        setPackages(generated);
        setFilteredPackages(generated);
        setIsLoading(false);
      }, 2000);
    };

    fetchPackages();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...packages];
    filtered = filtered.filter(
      (pkg) => pkg.totalPrice >= filters.priceRange[0] && pkg.totalPrice <= filters.priceRange[1]
    );
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(
        (pkg) =>
          filters.airlines.includes(pkg.outboundFlight.airline) ||
          filters.airlines.includes(pkg.returnFlight.airline)
      );
    }
    if (filters.stops.length > 0) {
      filtered = filtered.filter(
        (pkg) =>
          filters.stops.includes(pkg.outboundFlight.stops) ||
          filters.stops.includes(pkg.returnFlight.stops)
      );
    }
    if (filters.hotelStars.length > 0) {
      filtered = filtered.filter((pkg) => filters.hotelStars.includes(pkg.hotel.category));
    }
    setFilteredPackages(filtered);
  };

  const handleSort = (value: string) => {
    setSortBy(value as any);
    let sorted = [...filteredPackages];
    switch (value) {
      case 'price-low':
        sorted.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'confidence':
        sorted.sort((a, b) => b.confidenceScore - a.confidenceScore);
        break;
    }
    setFilteredPackages(sorted);
  };

  const togglePackageComparison = (packageId: string) => {
    setPackagesToCompare((prev) => {
      if (prev.includes(packageId)) return prev.filter((id) => id !== packageId);
      else if (prev.length < 3) return [...prev, packageId];
      return prev;
    });
  };

  const openComparison = () => {
    if (packagesToCompare.length >= 2) setShowComparison(true);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Building Your Packages...</h3>
          <p className="text-gray-600 mb-6">AI is analyzing TBO inventory and creating optimized trip bundles</p>
          <div className="max-w-md mx-auto space-y-2">
            {['Searching flights across airlines', 'Matching hotels by location & category', 'Bundling transfers & activities', 'Calculating best pricing'].map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Search Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {filteredPackages.length} Packages Found
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3">Based on: "{query}"</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="line-clamp-2">
                Intent extracted: {destination} • {nights} night{nights !== 1 ? 's' : ''} • {adults} adult{adults !== 1 ? 's' : ''}
                {parsed.budgetText ? ` • ${parsed.budgetText}` : ''}
                {parsed.vibe ? ` • ${parsed.vibe}` : ''}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFareCalendar(!showFareCalendar)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {showFareCalendar ? 'Hide' : 'Show'} Fare Calendar
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Modify Search
            </button>
          </div>
        </div>
      </div>

      {showFareCalendar && (
        <div className="mb-6">
          <FareCalendar onDateSelect={(date) => console.log('Selected date:', date)} />
        </div>
      )}

      {showDestinationGuide && <DestinationGuide destination={destination} />}

      {/* Filters and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <PackageFilters onFilterChange={handleFilterChange} isMobile={true} />
          {packagesToCompare.length >= 2 && (
            <Button onClick={openComparison} variant="outline">
              <GitCompare className="w-4 h-4 mr-2" />
              Compare ({packagesToCompare.length})
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confidence">Best Match</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Package Cards */}
      <div className="space-y-4 sm:space-y-6">
        {filteredPackages.map((pkg, index) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-xl border-2 transition-all ${
              selectedPackage === pkg.id
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
            }`}
          >
            {/* Package Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-start gap-3 mb-4">
                <Checkbox
                  checked={packagesToCompare.includes(pkg.id)}
                  onCheckedChange={() => togglePackageComparison(pkg.id)}
                  disabled={!packagesToCompare.includes(pkg.id) && packagesToCompare.length >= 3}
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <DealBadges
                        confidenceScore={pkg.confidenceScore}
                        matchScore={pkg.matchScore}
                        isPopular={index === 0}
                        isLimitedTime={index === 1}
                        isBestValue={pkg.totalPrice < 50000}
                      />
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ₹{pkg.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">Total for all travelers</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium ${getConfidenceColor(pkg.confidenceScore)}`}>
                      {pkg.confidenceScore}% Match
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(pkg.hotel.category)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      ))}
                    </div>
                    {pkg.hotel.rating && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{pkg.hotel.rating}</span>
                        {pkg.hotel.reviewCount && (
                          <span className="text-gray-500">({pkg.hotel.reviewCount} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Why This Bundle */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-blue-900">Why this bundle:</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {pkg.whyThisBundle.map((reason, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-blue-800">• {reason}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Package Components */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Flights */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Flights</h4>
                  <span className="ml-auto text-xs sm:text-sm font-medium text-gray-900">
                    ₹{pkg.priceBreakdown.flights.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-3 bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xs sm:text-sm">
                    <div className="font-medium text-gray-900 mb-1">Outbound</div>
                    <div className="text-gray-600">
                      {pkg.outboundFlight.airline} {pkg.outboundFlight.flightNumber} • {pkg.outboundFlight.departure} → {pkg.outboundFlight.arrival}
                    </div>
                    <div className="text-gray-500">{pkg.outboundFlight.departureTime} - {pkg.outboundFlight.arrivalTime} ({pkg.outboundFlight.duration})</div>
                    {pkg.outboundFlight.stops === 0 ? (
                      <div className="text-green-600 font-medium mt-1">Non-stop</div>
                    ) : (
                      <div className="text-amber-600 mt-1">{pkg.outboundFlight.stops} stop(s)</div>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="font-medium text-gray-900 mb-1">Return</div>
                    <div className="text-gray-600">
                      {pkg.returnFlight.airline} {pkg.returnFlight.flightNumber} • {pkg.returnFlight.departure} → {pkg.returnFlight.arrival}
                    </div>
                    <div className="text-gray-500">{pkg.returnFlight.departureTime} - {pkg.returnFlight.arrivalTime} ({pkg.returnFlight.duration})</div>
                    {pkg.returnFlight.stops === 0 ? (
                      <div className="text-green-600 font-medium mt-1">Non-stop</div>
                    ) : (
                      <div className="text-amber-600 mt-1">{pkg.returnFlight.stops} stop(s)</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hotel */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Hotel className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Hotel</h4>
                  <span className="ml-auto text-xs sm:text-sm font-medium text-gray-900">
                    ₹{pkg.priceBreakdown.hotel.toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{pkg.hotel.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">{pkg.hotel.area}</div>
                  <div className="flex flex-wrap gap-2">
                    {pkg.hotel.amenities.map((amenity, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white text-xs text-gray-600 rounded border border-gray-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transfer */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Transfer</h4>
                  <span className="ml-auto text-xs sm:text-sm font-medium text-gray-900">
                    ₹{pkg.priceBreakdown.transfer.toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
                  {pkg.transfer.type} - {pkg.transfer.vehicle}
                  <div className="text-xs text-gray-500 mt-1">
                    {pkg.transfer.pickupLocation ?? `${pkg.outboundFlight.arrival} Airport`} → {pkg.transfer.dropoffLocation ?? pkg.hotel.name}
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Activities</h4>
                  <span className="ml-auto text-xs sm:text-sm font-medium text-gray-900">
                    ₹{pkg.priceBreakdown.activities.toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                  {pkg.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <div className="text-gray-900">{activity.name}</div>
                        <div className="text-xs text-gray-500">{activity.duration}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.included && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded whitespace-nowrap">Included</span>
                        )}
                        <span className="text-gray-600 whitespace-nowrap">₹{activity.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-b-xl">
              <button
                onClick={() => navigate(`/package/${pkg.id}`)}
                className="px-4 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                Customize Package
              </button>
              <button
                onClick={() => navigate(`/quote/${pkg.id}`)}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
              >
                Generate Quote
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Package Comparison Dialog */}
      <PackageComparison
        packages={packages.filter((pkg) => packagesToCompare.includes(pkg.id))}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onSelectPackage={(id) => navigate(`/package/${id}`)}
      />
    </div>
  );
}
