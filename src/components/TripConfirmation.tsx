import { useLocation, useNavigate } from 'react-router';
import {
  CheckCircle2,
  Plane,
  Hotel,
  Car,
  Calendar,
  Users,
  Download,
  Mail,
  Copy,
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  Phone,
} from 'lucide-react';
import { useState } from 'react';

export function TripConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;
  const [copied, setCopied] = useState(false);

  if (!state?.pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 mb-4">No trip information found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { pkg, clientName, clientEmail, finalTotal, tripId, pnr, paymentMethod, transactionId, paidAt } = state;

  const paymentMethodLabel =
    paymentMethod === 'card' ? 'Credit/Debit Card' :
    paymentMethod === 'upi' ? 'UPI' : 'Net Banking';

  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const handleCopyPNR = () => {
    navigator.clipboard.writeText(pnr || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Success Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Trip Confirmed!</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Booking for <span className="font-semibold">{clientName}</span> has been successfully confirmed.
        </p>
      </div>

      {/* PNR & Transaction */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 sm:p-6 text-white mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-blue-200 text-xs uppercase tracking-wider mb-1">PNR / Booking Ref</div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-wider">{pnr}</span>
              <button
                onClick={handleCopyPNR}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Copy PNR"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <div className="text-blue-200 text-xs uppercase tracking-wider mb-1">Transaction ID</div>
            <div className="text-sm font-mono">{transactionId}</div>
          </div>
          <div>
            <div className="text-blue-200 text-xs uppercase tracking-wider mb-1">Amount Paid</div>
            <div className="text-xl sm:text-2xl font-bold">₹{finalTotal?.toLocaleString()}</div>
            <div className="text-blue-200 text-xs">via {paymentMethodLabel}</div>
          </div>
        </div>
      </div>

      {/* Trip Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Flight Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Plane className="w-4 h-4 text-blue-600" /> Flight Details
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 font-medium mb-1">Outbound</div>
              <div className="text-sm font-medium text-gray-900">{pkg.outboundFlight?.airline} {pkg.outboundFlight?.flightNumber}</div>
              <div className="text-xs text-gray-600 mt-1">
                {pkg.outboundFlight?.departure} → {pkg.outboundFlight?.arrival}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {pkg.outboundFlight?.departureTime} - {pkg.outboundFlight?.arrivalTime} • {pkg.outboundFlight?.duration}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 font-medium mb-1">Return</div>
              <div className="text-sm font-medium text-gray-900">{pkg.returnFlight?.airline} {pkg.returnFlight?.flightNumber}</div>
              <div className="text-xs text-gray-600 mt-1">
                {pkg.returnFlight?.departure} → {pkg.returnFlight?.arrival}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {pkg.returnFlight?.departureTime} - {pkg.returnFlight?.arrivalTime} • {pkg.returnFlight?.duration}
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Hotel className="w-4 h-4 text-blue-600" /> Accommodation
          </h3>
          <div className="p-3 bg-blue-50 rounded-lg mb-3">
            <div className="text-sm font-medium text-gray-900">{pkg.hotel?.name}</div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
              <MapPin className="w-3 h-3" /> {pkg.hotel?.area}
            </div>
            <div className="text-xs text-gray-500 mt-1">{pkg.hotel?.category}★ • {pkg.hotel?.roomType || 'Standard Room'}</div>
            {pkg.hotel?.mealPlan && (
              <div className="text-xs text-green-700 mt-1 font-medium">{pkg.hotel.mealPlan}</div>
            )}
          </div>
          {pkg.hotel?.amenities && (
            <div className="flex flex-wrap gap-1.5">
              {pkg.hotel.amenities.slice(0, 5).map((amenity: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full">{amenity}</span>
              ))}
            </div>
          )}
        </div>

        {/* Transfer Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Car className="w-4 h-4 text-blue-600" /> Transfer
          </h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">{pkg.transfer?.type} Transfer</div>
            <div className="text-xs text-gray-600 mt-1">{pkg.transfer?.vehicle} • Airport ↔ Hotel</div>
            {pkg.transfer?.included && (
              <div className="text-xs text-green-700 mt-1 font-medium">Included in package</div>
            )}
          </div>
        </div>

        {/* Traveler & Payment Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Users className="w-4 h-4 text-blue-600" /> Traveler & Payment
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Traveler</span>
              <span className="text-gray-900 font-medium">{clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900">{clientEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment</span>
              <span className="text-gray-900">{paymentMethodLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid on</span>
              <span className="text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      {pkg.activities && pkg.activities.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Sparkles className="w-4 h-4 text-blue-600" /> Activities & Sightseeing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pkg.activities
              .filter((a: any) => a.included)
              .map((activity: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                    <div className="text-xs text-gray-500">{activity.duration}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Download Itinerary</div>
            <div className="text-xs text-gray-500">PDF with full trip details</div>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Email Confirmation</div>
            <div className="text-xs text-gray-500">Send to {clientEmail}</div>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Contact Support</div>
            <div className="text-xs text-gray-500">24/7 travel assistance</div>
          </div>
        </button>
      </div>

      {/* Important Information */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <h4 className="font-medium text-amber-900 mb-3 flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4" /> Important Information
        </h4>
        <ul className="text-xs text-amber-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Web check-in opens 48 hours before departure. Pre-select your seats online.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Carry a printed or digital copy of this confirmation to the airport.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Valid photo ID required at check-in. International travelers need a passport with 6-month validity.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Hotel check-in time is typically 2:00 PM. Early check-in subject to availability.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>For cancellations or modifications, contact support at least 72 hours before travel.</span>
          </li>
        </ul>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
        <button
          onClick={() => navigate('/trips')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          View All Trips
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 text-sm sm:text-base"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
