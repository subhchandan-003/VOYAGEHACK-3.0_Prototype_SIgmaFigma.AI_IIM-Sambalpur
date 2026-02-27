import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Send, Plus, Minus, FileText, Check } from 'lucide-react';
import { generateMockPackages } from '../utils/mockData';
import { saveTrip, generateId } from '../utils/storage';
import { Trip } from '../types';
import { packageApi, quoteApi, tripApi } from '../services/api';

export function QuoteBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [markup, setMarkup] = useState(10);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  // Load package from API or mock
  useEffect(() => {
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading quote builder...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600 mb-4">Package not found</p>
        <button onClick={() => navigate('/packages')} className="text-blue-600 hover:text-blue-700">Back to Packages</button>
      </div>
    );
  }

  const subtotal = pkg.totalPrice;
  const markupAmount = (subtotal * markup) / 100;
  const taxes = (subtotal + markupAmount) * 0.05;
  const finalTotal = subtotal + markupAmount + taxes;

  const handleSendQuote = async () => {
    // Save to MongoDB via Express API
    const quoteData = {
      clientName: clientName || clientEmail.split('@')[0],
      clientEmail,
      packageId: pkg._id || pkg.id,
      packageSnapshot: pkg,
      destination: 'Goa',
      dates: 'Dec 15-20, 2025',
      travelers: '2 Adults + 1 Child',
      totalPrice: subtotal,
      markup: markupAmount,
      finalPrice: Math.round(finalTotal),
      notes,
    };
    quoteApi.create(quoteData).catch(() => {});

    // Also create a trip via API
    const tripData = {
      clientName: quoteData.clientName,
      clientEmail,
      destination: 'Goa',
      dates: 'Dec 15-20, 2025',
      status: 'pending',
      packageId: pkg._id || pkg.id,
      packageSnapshot: pkg,
      totalPaid: 0,
      balanceDue: Math.round(finalTotal),
      paymentStatus: 'pending',
    };
    tripApi.create(tripData).catch(() => {});

    // Also persist to localStorage for offline/fallback
    const newTrip: Trip = {
      id: generateId('trip'),
      clientName: clientName || clientEmail.split('@')[0],
      destination: 'Goa',
      dates: 'Dec 15-20, 2025',
      status: 'pending',
      package: pkg,
      pnr: generateId('PNR').toUpperCase(),
      alerts: [
        { type: 'warning', message: 'Awaiting client approval on quote', timestamp: 'Just now' },
      ],
    };
    saveTrip(newTrip);

    setSent(true);
    setTimeout(() => navigate('/trips'), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Client Quote Builder</h1>
        <p className="text-sm sm:text-base text-gray-600">Add markup, customize pricing, and share with your client</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Quote Preview */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Client Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Client Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter client name" className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Client Email</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@example.com" className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
              </div>
            </div>
          </div>

          {/* Package Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{pkg.name}</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Flight Details</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{pkg.outboundFlight.departure} → {pkg.outboundFlight.arrival}</span>
                    <span className="text-gray-900">₹{pkg.priceBreakdown.flights.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">{pkg.outboundFlight.airline} • {pkg.outboundFlight.departureTime} - {pkg.outboundFlight.arrivalTime}</div>
                </div>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Accommodation</h3>
                <div className="flex justify-between text-xs sm:text-sm">
                  <div>
                    <div className="text-gray-900">{pkg.hotel.name}</div>
                    <div className="text-xs text-gray-500">5 nights • {pkg.hotel.area}</div>
                  </div>
                  <span className="text-gray-900">₹{pkg.priceBreakdown.hotel.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Transfers</h3>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">{pkg.transfer.type} - Airport ↔ Hotel</span>
                  <span className="text-gray-900">₹{pkg.priceBreakdown.transfer.toLocaleString()}</span>
                </div>
              </div>
              <div className="pb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Activities & Sightseeing</h3>
                <div className="space-y-2">
                  {pkg.activities.filter((a: any) => a.included).map((activity: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{activity.name}</span>
                      <span className="text-gray-900">₹{activity.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Client Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Additional Notes for Client</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any special instructions, terms & conditions, or highlights..." className="w-full h-32 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
          </div>
        </div>

        {/* Right: Pricing & Actions */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Pricing</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Package Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-700">Markup %</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setMarkup(Math.max(0, markup - 1))} className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center font-medium text-sm">{markup}%</span>
                    <button onClick={() => setMarkup(Math.min(50, markup + 1))} className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Markup Amount</span>
                  <span className="text-gray-900">₹{markupAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Taxes & Fees (5%)</span>
                <span className="text-gray-900">₹{taxes.toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t-2 border-gray-900 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">Client Total</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{Math.round(finalTotal).toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs text-green-800 font-medium mb-1">Your Margin</div>
              <div className="text-base sm:text-lg font-bold text-green-700">₹{markupAmount.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Share Quote</h3>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-medium">Quote sent successfully!</span>
              </div>
            ) : (
              <>
                <button onClick={handleSendQuote} disabled={!clientEmail || !clientName} className="w-full px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2 text-sm sm:text-base">
                  <Send className="w-4 h-4" /> Send Quote to Client
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-700 mt-0.5" />
              <h4 className="text-xs sm:text-sm font-medium text-amber-900">Policy Highlights</h4>
            </div>
            <ul className="text-xs text-amber-800 space-y-1 ml-6">
              <li>• Full payment required 7 days before travel</li>
              <li>• Cancellation charges apply as per airline/hotel policy</li>
              <li>• Travel insurance recommended</li>
              <li>• Valid passport required (6 months validity)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
