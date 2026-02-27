import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, MapPin, User, AlertCircle, CheckCircle, Clock, ChevronRight, Plane, Hotel, Car, FileText, Trash2 } from 'lucide-react';
import { mockTrips } from '../utils/mockData';
import { getTrips, deleteTrip as deleteLocalTrip, updateTripStatus as updateLocalTripStatus, initializeStorage } from '../utils/storage';
import { Trip } from '../types';
import { tripApi } from '../services/api';

export function TripManagement() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    initializeStorage();

    // Try Express API first, fall back to localStorage/mock
    tripApi.getAll().then(({ data, fromApi }) => {
      if (fromApi && data && data.length > 0) {
        const mapped = data.map((t: any) => ({
          ...t,
          id: t._id || t.id,
          package: t.packageSnapshot || t.package,
        }));
        setTrips(mapped);
        setSelectedTrip(mapped[0]);
      } else {
        // Fallback to localStorage
        const storedTrips = getTrips();
        if (storedTrips.length === 0) {
          setTrips(mockTrips);
          setSelectedTrip(mockTrips[0]);
        } else {
          setTrips(storedTrips);
          setSelectedTrip(storedTrips[0]);
        }
      }
    });
  }, []);

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      // Delete from API
      tripApi.delete(tripId).catch(() => {});
      // Delete from localStorage
      deleteLocalTrip(tripId);

      const updatedTrips = trips.filter(t => t.id !== tripId);
      setTrips(updatedTrips);

      if (selectedTrip?.id === tripId && updatedTrips.length > 0) {
        setSelectedTrip(updatedTrips[0]);
      } else if (updatedTrips.length === 0) {
        setSelectedTrip(null);
      }
    }
  };

  const handleUpdateStatus = (tripId: string, status: 'confirmed' | 'pending' | 'in-progress') => {
    // Update via API
    tripApi.updateStatus(tripId, status).catch(() => {});
    // Update localStorage
    updateLocalTripStatus(tripId, status);

    const updatedTrips = trips.map(t => t.id === tripId ? { ...t, status } : t);
    setTrips(updatedTrips);

    const updated = updatedTrips.find(t => t.id === tripId);
    if (updated && selectedTrip?.id === tripId) {
      setSelectedTrip(updated);
    }
  };

  const statusConfig = {
    confirmed: { color: 'green', icon: CheckCircle, label: 'Confirmed' },
    pending: { color: 'amber', icon: Clock, label: 'Pending Approval' },
    'in-progress': { color: 'blue', icon: Plane, label: 'In Progress' },
  };

  const getStatusStyle = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: status };
    return {
      bg: `bg-${config.color}-50`,
      text: `text-${config.color}-700`,
      border: `border-${config.color}-200`,
      icon: config.icon,
      label: config.label,
    };
  };

  if (!selectedTrip && trips.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Trip Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage bookings, track status, and handle post-booking operations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Trips Yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Create your first quote to see trips here</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
            Start New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Trip Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage bookings, track status, and handle post-booking operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Trip List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Active Trips ({trips.length})</h2>
          {trips.map((trip) => {
            const status = getStatusStyle(trip.status);
            const StatusIcon = status.icon;
            return (
              <div
                key={trip.id}
                className={`relative group rounded-xl border-2 transition-all ${
                  selectedTrip?.id === trip.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button onClick={() => setSelectedTrip(trip)} className="w-full text-left p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">{trip.clientName}</div>
                      <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{trip.destination}</span>
                      </div>
                    </div>
                    <StatusIcon className={`w-5 h-5 ${status.text} flex-shrink-0`} />
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    {trip.dates}
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 ${status.bg} ${status.text} border ${status.border} rounded-full text-xs`}>
                    {status.label}
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all"
                  title="Delete trip"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Trip Details */}
        {selectedTrip && (
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">{selectedTrip.clientName}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{selectedTrip.destination}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {selectedTrip.dates}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">PNR</div>
                  <div className="font-mono font-bold text-gray-900 text-sm sm:text-base">{selectedTrip.pnr}</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">Update Status:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pending', 'confirmed', 'in-progress'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(selectedTrip.id, s)}
                      className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm border transition-colors ${
                        selectedTrip.status === s
                          ? s === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : s === 'confirmed' ? 'bg-green-50 border-green-300 text-green-700'
                            : 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTrip.alerts && selectedTrip.alerts.length > 0 && (
                <div className="space-y-2">
                  {selectedTrip.alerts.map((alert, index) => {
                    const alertStyles: Record<string, string> = {
                      info: 'bg-blue-50 border-blue-200 text-blue-800',
                      warning: 'bg-amber-50 border-amber-200 text-amber-800',
                      error: 'bg-red-50 border-red-200 text-red-800',
                    };
                    return (
                      <div key={index} className={`flex items-start gap-2 p-3 border rounded-lg ${alertStyles[alert.type] || alertStyles.info}`}>
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm">{alert.message}</div>
                          <div className="text-xs opacity-75 mt-1">{alert.timestamp}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trip Itinerary */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Trip Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Outbound Flight</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedTrip.package.outboundFlight.airline} {selectedTrip.package.outboundFlight.flightNumber}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">
                      {selectedTrip.package.outboundFlight.departure} → {selectedTrip.package.outboundFlight.arrival} • {selectedTrip.package.outboundFlight.departureTime}
                    </div>
                  </div>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg h-fit whitespace-nowrap flex-shrink-0">View E-Ticket</button>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-5 h-5 text-purple-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Hotel Stay</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{selectedTrip.package.hotel.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">5 nights • {selectedTrip.package.hotel.area}</div>
                  </div>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg h-fit whitespace-nowrap flex-shrink-0">View Voucher</button>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Airport Transfer</div>
                    <div className="text-xs sm:text-sm text-gray-600">{selectedTrip.package.transfer.type}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Airport ↔ Hotel</div>
                  </div>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg h-fit whitespace-nowrap flex-shrink-0">View Details</button>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 text-blue-700 transform rotate-180" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Return Flight</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedTrip.package.returnFlight.airline} {selectedTrip.package.returnFlight.flightNumber}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">
                      {selectedTrip.package.returnFlight.departure} → {selectedTrip.package.returnFlight.arrival} • {selectedTrip.package.returnFlight.departureTime}
                    </div>
                  </div>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg h-fit whitespace-nowrap flex-shrink-0">View E-Ticket</button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-700 mb-2" />
                <div className="font-medium text-gray-900 text-sm sm:text-base">All Documents</div>
                <div className="text-xs text-gray-500">E-tickets, vouchers, receipts</div>
              </button>
              <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <User className="w-5 h-5 text-gray-700 mb-2" />
                <div className="font-medium text-gray-900 text-sm sm:text-base">Contact Client</div>
                <div className="text-xs text-gray-500">Send updates & reminders</div>
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Need Help?</h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">For complex changes or disruptions, escalate to TBO support team</p>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">Escalate to Support</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
