import React from 'react';
import { TravelPackage } from '../types';
import { Plane, Hotel, Activity, Car, IndianRupee, TrendingUp, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface PackageCardProps {
  package: TravelPackage;
  onSelect: () => void;
}

export function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 85) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
            <div className="flex items-center space-x-2 text-blue-100 text-sm">
              <MapPin className="size-4" />
              <span>{pkg.hotel.location}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border ${getConfidenceColor(pkg.confidenceScore)} text-sm font-semibold`}>
            {pkg.confidenceScore}% match
          </div>
        </div>
      </div>

      {/* Why This Bundle */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-start space-x-2">
          <TrendingUp className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-blue-900 mb-1">Why this bundle?</div>
            <p className="text-sm text-blue-800 leading-relaxed">{pkg.whyThisBundle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Flight */}
        <div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
            <Plane className="size-4 text-blue-600" />
            <span>Flights</span>
          </div>
          <div className="space-y-2 pl-6">
            <div className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{pkg.outboundFlight.airline} {pkg.outboundFlight.flightNumber}</span>
                <span className="text-gray-500">{pkg.outboundFlight.duration}</span>
              </div>
              <div className="text-gray-600">
                {pkg.outboundFlight.departure.city} ({pkg.outboundFlight.departure.time}) → {pkg.outboundFlight.arrival.city} ({pkg.outboundFlight.arrival.time})
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{pkg.returnFlight.airline} {pkg.returnFlight.flightNumber}</span>
                <span className="text-gray-500">{pkg.returnFlight.duration}</span>
              </div>
              <div className="text-gray-600">
                {pkg.returnFlight.departure.city} ({pkg.returnFlight.departure.time}) → {pkg.returnFlight.arrival.city} ({pkg.returnFlight.arrival.time})
              </div>
            </div>
          </div>
        </div>

        {/* Hotel */}
        <div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
            <Hotel className="size-4 text-blue-600" />
            <span>Accommodation</span>
          </div>
          <div className="pl-6">
            <div className="text-sm">
              <div className="font-medium mb-1">{pkg.hotel.name}</div>
              <div className="text-gray-600 flex items-center space-x-2">
                <span>{pkg.hotel.category}</span>
                <span>•</span>
                <span>{pkg.hotel.nights} nights</span>
                <span>•</span>
                <span>{pkg.hotel.mealPlan}</span>
              </div>
              <div className="mt-1 text-gray-500">{pkg.hotel.area}</div>
            </div>
          </div>
        </div>

        {/* Activities */}
        {pkg.activities.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
              <Activity className="size-4 text-blue-600" />
              <span>Experiences ({pkg.activities.length})</span>
            </div>
            <div className="pl-6 space-y-1">
              {pkg.activities.map(activity => (
                <div key={activity.id} className="text-sm text-gray-600 flex items-start">
                  <CheckCircle2 className="size-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{activity.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transfers */}
        <div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
            <Car className="size-4 text-blue-600" />
            <span>Transfers</span>
          </div>
          <div className="pl-6">
            <div className="text-sm text-gray-600">
              Airport pickup & drop ({pkg.transfers[0].vehicle})
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Package Price</div>
            <div className="flex items-center space-x-1">
              <IndianRupee className="size-5 text-gray-900" />
              <span className="text-2xl font-bold text-gray-900">
                {pkg.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              For {pkg.hotel.nights} nights • All inclusive
            </div>
          </div>
          <button
            onClick={onSelect}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Customize & Quote
          </button>
        </div>

        {/* Quick breakdown */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-300">
          <span>Flights: ₹{pkg.priceBreakdown.flights.toLocaleString('en-IN')}</span>
          <span>Hotel: ₹{pkg.priceBreakdown.hotel.toLocaleString('en-IN')}</span>
          <span>Activities: ₹{pkg.priceBreakdown.activities.toLocaleString('en-IN')}</span>
          <span>Taxes: ₹{pkg.priceBreakdown.taxes.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
