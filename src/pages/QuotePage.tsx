import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Download, Mail, Share2, Plus, Minus, IndianRupee, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';

export function QuotePage() {
  const navigate = useNavigate();
  const { selectedPackage, currentQuote, setCurrentQuote } = useApp();
  const [markup, setMarkup] = useState(5000);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [quoteSent, setQuoteSent] = useState(false);

  if (!selectedPackage || !currentQuote) {
    navigate('/packages');
    return null;
  }

  const basePrice = selectedPackage.totalPrice;
  const finalPrice = basePrice + markup;
  const markupPercentage = ((markup / basePrice) * 100).toFixed(1);

  const handleSendQuote = () => {
    if (clientName && clientEmail) {
      setCurrentQuote({
        ...currentQuote,
        agentMarkup: markup,
        finalPrice,
        clientName,
        clientEmail,
        notes,
        status: 'sent'
      });
      setQuoteSent(true);
    }
  };

  const handleProceedToBooking = () => {
    navigate('/booking');
  };

  if (quoteSent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Quote Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your quote has been sent to <span className="font-medium">{clientEmail}</span>. 
            They'll receive a professional PDF with all package details.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleProceedToBooking}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Proceed to Booking
            </button>
            <button
              onClick={() => navigate('/packages')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/customize')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back to Customize</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Generate Client Quote
              </h1>
              <p className="text-gray-600">Add your markup and send to client for approval</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <div className="text-xs text-blue-600 mb-1">Quote Valid Until</div>
              <div className="text-sm font-semibold text-blue-900">
                {new Date(currentQuote.validUntil).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Quote Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedPackage.name}</h2>
                    <div className="flex items-center space-x-4 text-blue-100 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="size-4" />
                        <span>5 Nights / 6 Days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="size-4" />
                        <span>2 Adults, 1 Child</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-100 mb-1">Quote ID</div>
                    <div className="font-mono font-semibold">{currentQuote.id}</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-blue-100 mb-2">Total Package Price</div>
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="size-8" />
                    <span className="text-4xl font-bold">{finalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-sm text-blue-100 mt-2">
                    All-inclusive • Flights, Hotel, Activities & Transfers
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="p-8 space-y-6">
                {/* Itinerary Highlights */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Package Includes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Round-trip Flights</div>
                        <div className="text-sm text-gray-600">Delhi ↔ Goa • Economy class</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedPackage.hotel.nights} Nights Accommodation</div>
                        <div className="text-sm text-gray-600">{selectedPackage.hotel.name} • {selectedPackage.hotel.category}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Airport Transfers</div>
                        <div className="text-sm text-gray-600">Private {selectedPackage.transfers[0].vehicle}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedPackage.activities.length} Curated Experiences</div>
                        <div className="text-sm text-gray-600">Water sports, cultural tours & more</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities List */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Included Activities</h3>
                  <div className="space-y-2">
                    {selectedPackage.activities.map(activity => (
                      <div key={activity.id} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="size-1.5 rounded-full bg-blue-600"></div>
                        <span>{activity.name} ({activity.duration})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Package Base Price</span>
                      <span className="font-medium">₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-blue-600">
                      <span>Service Fee ({markupPercentage}%)</span>
                      <span className="font-medium">₹{markup.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="text-lg font-bold text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <span className="font-semibold">Payment Terms:</span> {selectedPackage.policies.payment}
                  </div>
                  <div>
                    <span className="font-semibold">Cancellation Policy:</span> {selectedPackage.policies.cancellation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Settings */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Markup Control */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Agent Markup</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Markup Amount (₹)</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setMarkup(Math.max(0, markup - 500))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Minus className="size-4" />
                      </button>
                      <input
                        type="number"
                        value={markup}
                        onChange={(e) => setMarkup(Number(e.target.value))}
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => setMarkup(markup + 500)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-2">
                      {markupPercentage}% margin
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-semibold text-blue-900 mb-2">Your Earnings</div>
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="size-5 text-blue-700" />
                      <span className="text-2xl font-bold text-blue-700">
                        {markup.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quick markup presets */}
                  <div>
                    <div className="text-xs text-gray-600 mb-2">Quick presets:</div>
                    <div className="flex flex-wrap gap-2">
                      {[3000, 5000, 8000, 10000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setMarkup(amount)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            markup === amount
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ₹{amount.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Client Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Client Name *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Rajesh Sharma"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Client Email *</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any special notes or customizations..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSendQuote}
                  disabled={!clientName || !clientEmail}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Mail className="size-5" />
                  <span>Send Quote to Client</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="size-4" />
                    <span className="text-sm font-medium">Download PDF</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="size-4" />
                    <span className="text-sm font-medium">Share Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
