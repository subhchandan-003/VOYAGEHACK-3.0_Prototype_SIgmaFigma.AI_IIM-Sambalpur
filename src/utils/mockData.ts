import { TravelPackage, Trip } from '../types';

export const generateMockPackages = (): TravelPackage[] => [
  {
    id: 'pkg-001',
    name: 'Beachfront Bliss Package',
    outboundFlight: {
      airline: 'IndiGo',
      flightNumber: '6E 2345',
      departure: 'Delhi (DEL)',
      arrival: 'Goa (GOI)',
      departureTime: '06:30',
      arrivalTime: '09:00',
      duration: '2h 30m',
      stops: 0,
      price: 8500
    },
    returnFlight: {
      airline: 'IndiGo',
      flightNumber: '6E 2346',
      departure: 'Goa (GOI)',
      arrival: 'Delhi (DEL)',
      departureTime: '18:45',
      arrivalTime: '21:15',
      duration: '2h 30m',
      stops: 0,
      price: 8500
    },
    hotel: {
      name: 'Taj Exotica Resort & Spa',
      category: 5,
      area: 'Benaulim Beach',
      amenities: ['Pool', 'Beach Access', 'Spa', 'Restaurant', 'WiFi'],
      price: 35000,
      images: [],
      rating: 4.7,
      reviewCount: 2843,
      roomType: 'Deluxe Sea View Room',
      mealPlan: 'Breakfast Included',
      cancellationPolicy: 'Free cancellation until 48 hours before check-in',
    },
    transfer: {
      type: 'Private Car',
      vehicle: 'Sedan',
      price: 2500
    },
    activities: [
      { name: 'Dolphin Spotting Cruise', duration: '2 hours', price: 1500, included: true },
      { name: 'Spice Plantation Tour', duration: '4 hours', price: 2000, included: true },
      { name: 'Water Sports Package', duration: '3 hours', price: 3500, included: false }
    ],
    totalPrice: 58000,
    priceBreakdown: {
      flights: 17000,
      hotel: 35000,
      transfer: 2500,
      activities: 3500
    },
    confidenceScore: 95,
    whyThisBundle: [
      'Beachfront 5-star property matches "beach vibe" preference',
      'Non-stop flights optimize travel time',
      'Total price ₹58k fits within ₹60k budget with margin',
      'Included activities enhance package value'
    ],
    matchScore: 95
  },
  {
    id: 'pkg-002',
    name: 'Budget Beach Escape',
    outboundFlight: {
      airline: 'SpiceJet',
      flightNumber: 'SG 1234',
      departure: 'Delhi (DEL)',
      arrival: 'Goa (GOI)',
      departureTime: '10:15',
      arrivalTime: '13:00',
      duration: '2h 45m',
      stops: 0,
      price: 6500
    },
    returnFlight: {
      airline: 'SpiceJet',
      flightNumber: 'SG 1235',
      departure: 'Goa (GOI)',
      arrival: 'Delhi (DEL)',
      departureTime: '15:30',
      arrivalTime: '18:00',
      duration: '2h 30m',
      stops: 0,
      price: 6500
    },
    hotel: {
      name: 'Lemon Tree Amarante Beach Resort',
      category: 4,
      area: 'Candolim',
      amenities: ['Pool', 'Beach Access', 'Restaurant', 'WiFi'],
      price: 25000,
      images: [],
      rating: 4.4,
      reviewCount: 1856,
      roomType: 'Superior Room',
      mealPlan: 'Breakfast Included',
      cancellationPolicy: 'Partial refund - 50% if cancelled 7 days before',
    },
    transfer: {
      type: 'Shared Shuttle',
      vehicle: 'AC Coach',
      price: 1200
    },
    activities: [
      { name: 'North Goa Sightseeing', duration: '6 hours', price: 1800, included: true },
      { name: 'Sunset Cruise', duration: '2 hours', price: 1500, included: false }
    ],
    totalPrice: 42500,
    priceBreakdown: {
      flights: 13000,
      hotel: 25000,
      transfer: 1200,
      activities: 3300
    },
    confidenceScore: 88,
    whyThisBundle: [
      'Best value option - ₹17.5k under budget',
      'Well-rated 4-star beachfront property',
      'Direct flights with good timing',
      'Leaves room for client margin or upgrades'
    ],
    matchScore: 88
  },
  {
    id: 'pkg-003',
    name: 'Luxury Coastal Retreat',
    outboundFlight: {
      airline: 'Vistara',
      flightNumber: 'UK 987',
      departure: 'Delhi (DEL)',
      arrival: 'Goa (GOI)',
      departureTime: '08:00',
      arrivalTime: '10:45',
      duration: '2h 45m',
      stops: 0,
      price: 12000
    },
    returnFlight: {
      airline: 'Vistara',
      flightNumber: 'UK 988',
      departure: 'Goa (GOI)',
      arrival: 'Delhi (DEL)',
      departureTime: '20:00',
      arrivalTime: '22:45',
      duration: '2h 45m',
      stops: 0,
      price: 12000
    },
    hotel: {
      name: 'The Leela Goa',
      category: 5,
      area: 'Mobor Beach',
      amenities: ['Pool', 'Private Beach', 'Spa', 'Golf Course', 'Fine Dining', 'WiFi'],
      price: 45000,
      images: [],
      rating: 4.8,
      reviewCount: 3124,
      roomType: 'Deluxe Villa with Pool',
      mealPlan: 'Half Board (Breakfast + Dinner)',
      cancellationPolicy: 'Free cancellation until 72 hours before check-in',
    },
    transfer: {
      type: 'Private Luxury Car',
      vehicle: 'SUV',
      price: 3500
    },
    activities: [
      { name: 'Private Yacht Cruise', duration: '3 hours', price: 5000, included: true },
      { name: 'Couple Spa Session', duration: '2 hours', price: 4000, included: true },
      { name: 'Gourmet Food Tour', duration: '4 hours', price: 3000, included: false }
    ],
    totalPrice: 75500,
    priceBreakdown: {
      flights: 24000,
      hotel: 45000,
      transfer: 3500,
      activities: 3000
    },
    confidenceScore: 82,
    whyThisBundle: [
      'Premium upgrade option for high-value clients',
      'Luxury 5-star with extensive amenities',
      'Premium Vistara flights with better service',
      '₹15.5k over budget but offers upsell potential'
    ],
    matchScore: 82
  }
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-001',
    clientName: 'Rajesh & Priya Sharma',
    destination: 'Goa',
    dates: 'Dec 15-20, 2025',
    status: 'confirmed',
    package: generateMockPackages()[0],
    pnr: 'TBO123456',
    alerts: [
      {
        type: 'info',
        message: 'E-tickets and hotel vouchers sent to client',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'trip-002',
    clientName: 'Amit Patel Family',
    destination: 'Dubai',
    dates: 'Jan 10-15, 2026',
    status: 'pending',
    package: generateMockPackages()[1],
    pnr: 'TBO789012',
    alerts: [
      {
        type: 'warning',
        message: 'Awaiting client approval on quote',
        timestamp: '1 day ago'
      }
    ]
  }
];