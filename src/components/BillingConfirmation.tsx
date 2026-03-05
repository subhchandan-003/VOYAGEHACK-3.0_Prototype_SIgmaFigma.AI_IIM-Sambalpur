import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  Shield,
  ArrowLeft,
  IndianRupee,
  FileText,
  Clock,
  Users,
  Plane,
  Hotel,
} from 'lucide-react';

type PaymentMethod = 'card' | 'upi' | 'netbanking';

export function BillingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!state?.pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 mb-4">No billing information found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { pkg, clientName, clientEmail, subtotal, markupAmount, taxes, finalTotal, tripId, pnr, query } = state;

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      navigate('/trip-confirmed', {
        state: {
          pkg,
          clientName,
          clientEmail,
          finalTotal,
          tripId,
          pnr,
          paymentMethod,
          query,
          transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
          paidAt: new Date().toISOString(),
        },
      });
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  };

  const isFormValid =
    agreedToTerms &&
    ((paymentMethod === 'card' && cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvv.length >= 3 && cardName.length > 1) ||
      (paymentMethod === 'upi' && upiId.includes('@')) ||
      (paymentMethod === 'netbanking' && selectedBank));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Quote
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Billing & Payment</h1>
        <p className="text-sm text-gray-600">Complete the payment to confirm the booking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <FileText className="w-4 h-4 text-blue-600" /> Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Plane className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{pkg.outboundFlight?.airline} {pkg.outboundFlight?.flightNumber}</div>
                  <div className="text-xs text-gray-500">{pkg.outboundFlight?.departure} → {pkg.outboundFlight?.arrival}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Hotel className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{pkg.hotel?.name}</div>
                  <div className="text-xs text-gray-500">{pkg.hotel?.area} • {pkg.hotel?.category}★</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{clientName}</div>
                  <div className="text-xs text-gray-500">{clientEmail}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {([
                { key: 'card' as PaymentMethod, label: 'Card', icon: CreditCard },
                { key: 'upi' as PaymentMethod, label: 'UPI', icon: Smartphone },
                { key: 'netbanking' as PaymentMethod, label: 'Net Banking', icon: Building2 },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setPaymentMethod(key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === key
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs sm:text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Card Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Payment Fields */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                  A payment request will be sent to your UPI app for approval.
                </div>
              </div>
            )}

            {/* Net Banking Fields */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-4">
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">Select Bank</label>
                <div className="grid grid-cols-2 gap-3">
                  {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 text-sm rounded-lg border-2 text-left transition-all ${
                        selectedBank === bank
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">
                I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span>,{' '}
                <span className="text-blue-600 font-medium">Cancellation Policy</span>, and{' '}
                <span className="text-blue-600 font-medium">Privacy Policy</span>. Full payment is required 7 days before travel. Cancellation charges apply as per airline/hotel policy.
              </span>
            </label>
          </div>
        </div>

        {/* Right: Price Breakdown & Pay Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Price Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Package Subtotal</span>
                <span className="text-gray-900">₹{subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agent Markup</span>
                <span className="text-gray-900">₹{markupAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees (5%)</span>
                <span className="text-gray-900">₹{Math.round(taxes ?? 0).toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-gray-900 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">₹{finalTotal?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!isFormValid || processing}
              className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4" />
                  Pay ₹{finalTotal?.toLocaleString()}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit SSL Encrypted & Secure</span>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  <div className="font-medium mb-1">Price Lock Guarantee</div>
                  <p>This price is locked for the next 30 minutes. Complete your payment to secure this booking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
