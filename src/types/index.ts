export interface SearchIntent {
  destination: string;
  nights: number;
  adults: number;
  children: number;
  budget: number;
  vibe: string;
  dates: string;
  flexible: boolean;
  // Enhanced search fields
  departureDate?: string;
  returnDate?: string;
  rooms?: number;
  infants?: number;
  childAges?: number[];
  flightClass?: 'economy' | 'premium-economy' | 'business' | 'first';
  hotelStarRating?: number[];
  mealPlan?: 'room-only' | 'breakfast' | 'half-board' | 'full-board' | 'all-inclusive';
  transferRequired?: boolean;
  transferType?: 'private' | 'shared';
  visaAssistance?: boolean;
  travelInsurance?: boolean;
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  // Enhanced flight details
  layoverDetails?: { city: string; duration: string }[];
  cabinClass?: string;
  baggageAllowance?: { cabin: string; checkin: string };
  refundable?: boolean;
  seatAvailability?: number;
}

export interface Hotel {
  name: string;
  category: number;
  area: string;
  amenities: string[];
  price: number;
  images: string[];
  // Enhanced hotel details
  roomType?: string;
  mealPlan?: string;
  bedConfiguration?: string;
  maxOccupancy?: number;
  checkInTime?: string;
  checkOutTime?: string;
  rating?: number;
  reviewCount?: number;
  cancellationPolicy?: string;
  distanceFromAirport?: string;
  nearbyAttractions?: string[];
}

export interface Transfer {
  type: string;
  vehicle: string;
  price: number;
  // Enhanced transfer details
  pickupLocation?: string;
  dropoffLocation?: string;
  vehicleCapacity?: number;
  included?: boolean;
  driverDetails?: string;
}

export interface Activity {
  name: string;
  duration: string;
  price: number;
  included: boolean;
  // Enhanced activity details
  category?: string;
  description?: string;
  timeslot?: string;
  minimumAge?: number;
  difficultyLevel?: 'easy' | 'moderate' | 'challenging';
  pickupIncluded?: boolean;
}

export interface TravelPackage {
  id: string;
  name: string;
  outboundFlight: Flight;
  returnFlight: Flight;
  hotel: Hotel;
  transfer: Transfer;
  activities: Activity[];
  totalPrice: number;
  priceBreakdown: {
    flights: number;
    hotel: number;
    transfer: number;
    activities: number;
  };
  confidenceScore: number;
  whyThisBundle: string[];
  matchScore: number;
}

export interface Trip {
  id: string;
  clientName: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'in-progress';
  package: TravelPackage;
  pnr: string;
  alerts: Alert[];
  // Enhanced trip details
  travelers?: TravelerDetails[];
  specialRequests?: string;
  addOns?: AddOn[];
  totalPaid?: number;
  balanceDue?: number;
  paymentStatus?: 'full' | 'partial' | 'pending';
}

export interface Alert {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

// New interfaces for enhanced features
export interface TravelerDetails {
  id: string;
  title: 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Master';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  passportExpiry?: string;
  nationality: string;
  type: 'adult' | 'child' | 'infant';
  email?: string;
  phone?: string;
  frequentFlyerNumber?: string;
  mealPreference?: string;
  specialAssistance?: string;
}

export interface AddOn {
  id: string;
  name: string;
  category: 'insurance' | 'visa' | 'baggage' | 'seat' | 'meal' | 'other';
  price: number;
  selected: boolean;
  description?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface PriceCalendar {
  date: string;
  price: number;
  availability: 'available' | 'limited' | 'sold-out';
}