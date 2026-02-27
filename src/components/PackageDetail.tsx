import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Unlock, RefreshCw, ChevronRight } from 'lucide-react';
import { generateMockPackages } from '../utils/mockData';
import { packageApi } from '../services/api';

export function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try Express API first, fall back to local mock
    packageApi.getById(id!).then(({ data, fromApi }) => {
      if (fromApi && data) {
        setPkg(data);
      } else {
        setPkg(generateMockPackages().find(p => p.id === id) || null);
      }
      setLoading(false);
    }).catch(() => {
      setPkg(generateMockPackages().find(p => p.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  const [lockedItems, setLockedItems] = useState({
    flights: false,
    hotel: false,
    transfer: false,
    activities: false,
  });

  const [showAlternatives, setShowAlternatives] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600 mb-4">Package not found</p>
        <button onClick={() => navigate('/packages')} className="text-blue-600 hover:text-blue-700">Back to Packages</button>
      </div>
    );
  }

  const toggleLock = (item: keyof typeof lockedItems) => {
    setLockedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const alternatives = {
    flights: [
      { airline: 'Air India', time: '07:00 - 09:30', price: 9500, stops: 0 },
      { airline: 'Vistara', time: '12:30 - 15:15', price: 11000, stops: 0 },
    ],
    hotels: [
      { name: 'Alila Diwa Goa', area: 'Majorda', stars: 5, price: 38000 },
      { name: 'Grand Hyatt Goa', area: 'Bambolim', stars: 5, price: 42000 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button onClick={() => navigate('/packages')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Packages
        </button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Customize Package</h1>
            <p className="text-sm sm:text-base text-gray-600">Lock items you want to keep, optimize the rest</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">₹{pkg.totalPrice.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-gray-500">Current total</div>
          </div>
        </div>
      </div>

      {/* Customization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Flights */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Flights</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleLock('flights')} className={`p-2 rounded-lg transition-colors ${lockedItems.flights ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {lockedItems.flights ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowAlternatives(showAlternatives === 'flights' ? null : 'flights')} className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 sm:gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Alternatives</span>
              </button>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Outbound</div>
              <div className="text-xs sm:text-sm text-gray-700">{pkg.outboundFlight.airline} {pkg.outboundFlight.flightNumber}</div>
              <div className="text-xs sm:text-sm text-gray-600">{pkg.outboundFlight.departureTime} - {pkg.outboundFlight.arrivalTime} • Non-stop</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Return</div>
              <div className="text-xs sm:text-sm text-gray-700">{pkg.returnFlight.airline} {pkg.returnFlight.flightNumber}</div>
              <div className="text-xs sm:text-sm text-gray-600">{pkg.returnFlight.departureTime} - {pkg.returnFlight.arrivalTime} • Non-stop</div>
            </div>
          </div>
          {showAlternatives === 'flights' && (
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Alternative Flights:</div>
              {alternatives.flights.map((alt, index) => (
                <button key={index} className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900">{alt.airline}</div>
                      <div className="text-xs text-gray-600">{alt.time} • {alt.stops === 0 ? 'Non-stop' : `${alt.stops} stop`}</div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">₹{alt.price}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hotel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Hotel</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleLock('hotel')} className={`p-2 rounded-lg transition-colors ${lockedItems.hotel ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {lockedItems.hotel ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowAlternatives(showAlternatives === 'hotels' ? null : 'hotels')} className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 sm:gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Alternatives</span>
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
            <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{pkg.hotel.name}</div>
            <div className="text-xs sm:text-sm text-gray-600 mb-3">{pkg.hotel.area} • {pkg.hotel.category} Star</div>
            <div className="flex flex-wrap gap-2">
              {pkg.hotel.amenities.map((amenity: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-white text-xs text-gray-600 rounded border border-gray-200">{amenity}</span>
              ))}
            </div>
          </div>
          {showAlternatives === 'hotels' && (
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Alternative Hotels:</div>
              {alternatives.hotels.map((alt, index) => (
                <button key={index} className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{alt.name}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">₹{alt.price}</div>
                  </div>
                  <div className="text-xs text-gray-600">{alt.area} • {alt.stars} Star</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transfer */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Transfer</h3>
            <button onClick={() => toggleLock('transfer')} className={`p-2 rounded-lg transition-colors ${lockedItems.transfer ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {lockedItems.transfer ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">{pkg.transfer.type}</div>
            <div className="text-xs sm:text-sm text-gray-600">{pkg.transfer.vehicle} • Airport ↔ Hotel</div>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Activities</h3>
            <button onClick={() => toggleLock('activities')} className={`p-2 rounded-lg transition-colors ${lockedItems.activities ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {lockedItems.activities ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
          <div className="space-y-2">
            {pkg.activities.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.name}</div>
                  <div className="text-xs text-gray-500">{activity.duration}</div>
                </div>
                <input type="checkbox" defaultChecked={activity.included} className="w-4 h-4 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="w-full lg:w-auto">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">Locked items:</div>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(lockedItems).map(([key, locked]) =>
                locked && (
                  <span key={key} className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm rounded-full border border-green-200 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                )
              )}
              {!Object.values(lockedItems).some(v => v) && (
                <span className="text-xs sm:text-sm text-gray-500">None (will optimize all components)</span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button onClick={() => navigate('/packages')} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={() => navigate(`/quote/${pkg.id}`)} className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
              Generate Quote
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
