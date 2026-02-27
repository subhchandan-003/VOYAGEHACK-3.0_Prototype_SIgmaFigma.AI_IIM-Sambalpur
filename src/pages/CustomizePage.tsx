import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plane, Hotel, Activity, Car, Lock, IndianRupee, AlertCircle, CheckCircle2, Edit2 } from 'lucide-react';

export function CustomizePage() {
  const navigate = useNavigate();
  const { selectedPackage, setCurrentQuote } = useApp();
  const [isEditingFlight, setIsEditingFlight] = useState(false);
  const [isEditingHotel, setIsEditingHotel] = useState(false);
  const [lockedItems, setLockedItems] = useState<string[]>([]);

  if (!selectedPackage) {
    navigate('/packages');
    return null;
  }

  const handleGenerateQuote = () => {
    const quote = {
      id: 'Q' + Date.now(),
      packageId: selectedPackage.id,
      agentMarkup: 5000,
      finalPrice: selectedPackage.totalPrice + 5000,
      validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      status: 'draft' as const
    };
    setCurrentQuote(quote);
    navigate('/quote');
  };

  const toggleLock = (item: string) => {
    setLockedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/packages')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back to Packages</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Customize Package
              </h1>
              <p className="text-gray-600">{selectedPackage.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Current Total</div>
              <div className="flex items-center space-x-1">
                <IndianRupee className="size-5 text-gray-900" />
                <span className="text-2xl font-bold text-gray-900">
                  {selectedPackage.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flights Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Plane className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Flights</h2>
                    <p className="text-sm text-gray-600">Round trip • {selectedPackage.outboundFlight.class}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleLock('flight')}
                    className={`p-2 rounded-lg transition-colors ${
                      lockedItems.includes('flight')
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Lock className="size-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingFlight(!isEditingFlight)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Outbound Flight */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">OUTBOUND</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {selectedPackage.outboundFlight.airline} {selectedPackage.outboundFlight.flightNumber}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedPackage.outboundFlight.departure.city} ({selectedPackage.outboundFlight.departure.time}) → {selectedPackage.outboundFlight.arrival.city} ({selectedPackage.outboundFlight.arrival.time})
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedPackage.outboundFlight.duration} • {selectedPackage.outboundFlight.stops === 0 ? 'Non-stop' : `${selectedPackage.outboundFlight.stops} stop`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₹{selectedPackage.outboundFlight.price.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{selectedPackage.outboundFlight.baggage}</div>
                    </div>
                  </div>
                </div>

                {/* Return Flight */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">RETURN</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {selectedPackage.returnFlight.airline} {selectedPackage.returnFlight.flightNumber}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedPackage.returnFlight.departure.city} ({selectedPackage.returnFlight.departure.time}) → {selectedPackage.returnFlight.arrival.city} ({selectedPackage.returnFlight.arrival.time})
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedPackage.returnFlight.duration} • {selectedPackage.returnFlight.stops === 0 ? 'Non-stop' : `${selectedPackage.returnFlight.stops} stop`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₹{selectedPackage.returnFlight.price.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{selectedPackage.returnFlight.baggage}</div>
                    </div>
                  </div>
                </div>

                {isEditingFlight && (
                  <div className="pt-4 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      + View alternative flight options
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Hotel Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Hotel className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Accommodation</h2>
                    <p className="text-sm text-gray-600">{selectedPackage.hotel.nights} nights • {selectedPackage.hotel.mealPlan}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleLock('hotel')}
                    className={`p-2 rounded-lg transition-colors ${
                      lockedItems.includes('hotel')
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Lock className="size-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingHotel(!isEditingHotel)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{selectedPackage.hotel.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                        ⭐ {selectedPackage.hotel.rating}
                      </span>
                      <span>{selectedPackage.hotel.category}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{selectedPackage.hotel.location}</div>
                    <div className="text-sm mb-3">
                      <span className="font-medium text-gray-700">Room:</span> {selectedPackage.hotel.roomType}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPackage.hotel.amenities.slice(0, 4).map(amenity => (
                        <span key={amenity} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-gray-900 mb-1">
                      ₹{selectedPackage.hotel.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹{selectedPackage.hotel.pricePerNight.toLocaleString('en-IN')}/night
                    </div>
                  </div>
                </div>

                {isEditingHotel && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      + View alternative hotels in this area
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Activities Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Activity className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Experiences</h2>
                    <p className="text-sm text-gray-600">{selectedPackage.activities.length} activities included</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {selectedPackage.activities.map(activity => (
                  <div key={activity.id} className="flex items-start justify-between pb-3 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{activity.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{activity.type}</span>
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold text-gray-900">₹{activity.price.toLocaleString('en-IN')}</div>
                      <button className="text-xs text-red-600 hover:text-red-700 mt-1">Remove</button>
                    </div>
                  </div>
                ))}
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center pt-3">
                  + Add more activities
                </button>
              </div>
            </div>

            {/* Transfers Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-600 p-2 rounded-lg">
                    <Car className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Transfers</h2>
                    <p className="text-sm text-gray-600">Airport pickup & drop</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {selectedPackage.transfers.map(transfer => (
                  <div key={transfer.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{transfer.type}</div>
                      <div className="text-sm text-gray-600">{transfer.vehicle} • {transfer.from} → {transfer.to}</div>
                    </div>
                    <div className="font-semibold text-gray-900">₹{transfer.price.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Flights</span>
                    <span className="font-medium">₹{selectedPackage.priceBreakdown.flights.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hotel ({selectedPackage.hotel.nights} nights)</span>
                    <span className="font-medium">₹{selectedPackage.priceBreakdown.hotel.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Activities</span>
                    <span className="font-medium">₹{selectedPackage.priceBreakdown.activities.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transfers</span>
                    <span className="font-medium">₹{selectedPackage.priceBreakdown.transfers.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">₹{selectedPackage.priceBreakdown.taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="size-4 text-gray-900" />
                        <span className="text-xl font-bold text-gray-900">
                          {selectedPackage.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <h3 className="font-semibold text-blue-900 mb-3 text-sm">Important Policies</h3>
                <div className="space-y-2 text-xs text-blue-800">
                  <div>
                    <div className="font-medium mb-1">Cancellation</div>
                    <div>{selectedPackage.policies.cancellation}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Payment</div>
                    <div>{selectedPackage.policies.payment}</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleGenerateQuote}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Generate Client Quote
              </button>

              <div className="flex items-start space-x-2 text-xs text-gray-600">
                <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                <span>Price locked for 48 hours. Quote can be sent to client for approval.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
