import { TravelPackage, Flight, Hotel, Activity, Transfer } from '../types';

// Mock flights
export const mockFlights: Flight[] = [
  {
    id: 'F001',
    airline: 'IndiGo',
    flightNumber: '6E 5316',
    departure: {
      airport: 'DEL',
      city: 'Delhi',
      time: '06:30',
      terminal: 'T2'
    },
    arrival: {
      airport: 'GOI',
      city: 'Goa',
      time: '09:15',
      terminal: 'T1'
    },
    duration: '2h 45m',
    stops: 0,
    class: 'Economy',
    price: 8500,
    baggage: '15kg checked + 7kg cabin'
  },
  {
    id: 'F002',
    airline: 'Air India',
    flightNumber: 'AI 635',
    departure: {
      airport: 'DEL',
      city: 'Delhi',
      time: '11:20',
      terminal: 'T3'
    },
    arrival: {
      airport: 'GOI',
      city: 'Goa',
      time: '14:10',
      terminal: 'T1'
    },
    duration: '2h 50m',
    stops: 0,
    class: 'Economy',
    price: 9200,
    baggage: '25kg checked + 8kg cabin'
  }
];

export const mockReturnFlights: Flight[] = [
  {
    id: 'F003',
    airline: 'IndiGo',
    flightNumber: '6E 5011',
    departure: {
      airport: 'GOI',
      city: 'Goa',
      time: '19:45',
      terminal: 'T1'
    },
    arrival: {
      airport: 'DEL',
      city: 'Delhi',
      time: '22:30',
      terminal: 'T2'
    },
    duration: '2h 45m',
    stops: 0,
    class: 'Economy',
    price: 9100,
    baggage: '15kg checked + 7kg cabin'
  },
  {
    id: 'F004',
    airline: 'Vistara',
    flightNumber: 'UK 993',
    departure: {
      airport: 'GOI',
      city: 'Goa',
      time: '16:30',
      terminal: 'T1'
    },
    arrival: {
      airport: 'DEL',
      city: 'Delhi',
      time: '19:20',
      terminal: 'T3'
    },
    duration: '2h 50m',
    stops: 0,
    class: 'Economy',
    price: 10500,
    baggage: '15kg checked + 7kg cabin'
  }
];

// Mock hotels
export const mockHotels: Hotel[] = [
  {
    id: 'H001',
    name: 'The Leela Goa',
    category: '5-star Luxury',
    rating: 4.8,
    location: 'Cavelossim Beach, South Goa',
    area: 'South Goa',
    images: ['goa-luxury-resort'],
    amenities: ['Private Beach', 'Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym'],
    roomType: 'Deluxe Ocean View',
    mealPlan: 'Breakfast included',
    pricePerNight: 8500,
    totalPrice: 42500,
    nights: 5,
    cancellationPolicy: 'Free cancellation until 7 days before check-in'
  },
  {
    id: 'H002',
    name: 'Taj Fort Aguada Resort & Spa',
    category: '5-star',
    rating: 4.7,
    location: 'Candolim, North Goa',
    area: 'North Goa',
    images: ['goa-beach-resort'],
    amenities: ['Beach Access', 'Pool', 'Spa', 'Multiple Restaurants', 'WiFi'],
    roomType: 'Premier Room',
    mealPlan: 'Breakfast + Dinner',
    pricePerNight: 7200,
    totalPrice: 36000,
    nights: 5,
    cancellationPolicy: 'Free cancellation until 5 days before check-in'
  },
  {
    id: 'H003',
    name: 'Alila Diwa Goa',
    category: '5-star Boutique',
    rating: 4.6,
    location: 'Majorda Beach, South Goa',
    area: 'South Goa',
    images: ['goa-boutique-hotel'],
    amenities: ['Beach', 'Infinity Pool', 'Spa', 'Fine Dining', 'WiFi'],
    roomType: 'Terrace Room',
    mealPlan: 'Breakfast included',
    pricePerNight: 6800,
    totalPrice: 34000,
    nights: 5,
    cancellationPolicy: 'Free cancellation until 7 days before check-in'
  }
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: 'A001',
    name: 'Scuba Diving at Grande Island',
    type: 'Water Sports',
    duration: '4 hours',
    description: 'Explore underwater marine life with certified instructors',
    included: ['Equipment', 'Instructor', 'Boat transfer', 'Light refreshments'],
    price: 3500,
    image: 'scuba-diving-goa'
  },
  {
    id: 'A002',
    name: 'Sunset Dolphin Cruise',
    type: 'Cruise',
    duration: '2 hours',
    description: 'Evening cruise with dolphin watching and live music',
    included: ['Boat cruise', 'Welcome drink', 'Snacks', 'Music'],
    price: 1200,
    image: 'sunset-cruise-goa'
  },
  {
    id: 'A003',
    name: 'Old Goa Heritage Tour',
    type: 'Cultural',
    duration: '5 hours',
    description: 'Visit UNESCO heritage churches and Portuguese architecture',
    included: ['AC transport', 'Guide', 'Entry fees', 'Lunch'],
    price: 2000,
    image: 'old-goa-church'
  },
  {
    id: 'A004',
    name: 'Spice Plantation Tour',
    type: 'Nature',
    duration: '3 hours',
    description: 'Guided tour of organic spice farm with traditional Goan lunch',
    included: ['Transport', 'Guide', 'Lunch', 'Spice samples'],
    price: 1800,
    image: 'spice-plantation-goa'
  },
  {
    id: 'A005',
    name: 'Water Sports Combo',
    type: 'Adventure',
    duration: '3 hours',
    description: 'Jet ski, parasailing, and banana boat ride',
    included: ['All equipment', 'Safety gear', 'Instructor'],
    price: 2500,
    image: 'water-sports-goa'
  }
];

// Mock transfers
export const mockTransfers: Transfer[] = [
  {
    id: 'T001',
    type: 'Airport Pickup',
    vehicle: 'Sedan (AC)',
    from: 'Goa Airport (GOI)',
    to: 'Hotel',
    price: 800
  },
  {
    id: 'T002',
    type: 'Airport Drop',
    vehicle: 'Sedan (AC)',
    from: 'Hotel',
    to: 'Goa Airport (GOI)',
    price: 800
  },
  {
    id: 'T003',
    type: 'Airport Pickup',
    vehicle: 'SUV (AC)',
    from: 'Goa Airport (GOI)',
    to: 'Hotel',
    price: 1200
  },
  {
    id: 'T004',
    type: 'Airport Drop',
    vehicle: 'SUV (AC)',
    from: 'Hotel',
    to: 'Goa Airport (GOI)',
    price: 1200
  }
];

// Generate mock packages
export const mockPackages: TravelPackage[] = [
  {
    id: 'PKG001',
    name: 'Goa Beach Bliss - Premium',
    confidenceScore: 94,
    whyThisBundle: 'Best match for "beach vibe" + luxury preference. The Leela offers private beach access and stays within ₹60k budget. Early morning flight maximizes vacation time. Includes curated water sports and cultural experiences.',
    outboundFlight: mockFlights[0],
    returnFlight: mockReturnFlights[0],
    hotel: mockHotels[0],
    activities: [mockActivities[0], mockActivities[1], mockActivities[3]],
    transfers: [mockTransfers[0], mockTransfers[1]],
    totalPrice: 59700,
    priceBreakdown: {
      flights: 17600,
      hotel: 42500,
      activities: 6700,
      transfers: 1600,
      taxes: 3300
    },
    policies: {
      cancellation: 'Free cancellation until 7 days before departure. 50% charge between 7-3 days. No refund within 72 hours.',
      amendment: 'Date changes allowed with fare difference + ₹2000 fee per person.',
      payment: '30% advance at booking. Balance 15 days before departure.'
    }
  },
  {
    id: 'PKG002',
    name: 'Goa Explorer - Best Value',
    confidenceScore: 91,
    whyThisBundle: 'Best overall value. Taj Fort Aguada in North Goa offers great beach access + nightlife proximity. Includes meals (breakfast + dinner) reducing daily expenses. Mix of adventure and culture activities.',
    outboundFlight: mockFlights[0],
    returnFlight: mockReturnFlights[1],
    hotel: mockHotels[1],
    activities: [mockActivities[1], mockActivities[2], mockActivities[4]],
    transfers: [mockTransfers[0], mockTransfers[1]],
    totalPrice: 55300,
    priceBreakdown: {
      flights: 19000,
      hotel: 36000,
      activities: 5700,
      transfers: 1600,
      taxes: 3000
    },
    policies: {
      cancellation: 'Free cancellation until 5 days before departure. 50% charge between 5-2 days. No refund within 48 hours.',
      amendment: 'Date changes allowed with fare difference + ₹1500 fee per person.',
      payment: '25% advance at booking. Balance 10 days before departure.'
    }
  },
  {
    id: 'PKG003',
    name: 'Goa Boutique Escape',
    confidenceScore: 88,
    whyThisBundle: 'Boutique luxury at competitive price. Alila Diwa offers modern design + peaceful South Goa location. Mid-day departure allows leisurely morning. Focus on relaxation with spa-adjacent activities.',
    outboundFlight: mockFlights[1],
    returnFlight: mockReturnFlights[0],
    hotel: mockHotels[2],
    activities: [mockActivities[1], mockActivities[3]],
    transfers: [mockTransfers[2], mockTransfers[3]],
    totalPrice: 53500,
    priceBreakdown: {
      flights: 18700,
      hotel: 34000,
      activities: 3000,
      transfers: 2400,
      taxes: 2900
    },
    policies: {
      cancellation: 'Free cancellation until 7 days before departure. 40% charge between 7-3 days. No refund within 72 hours.',
      amendment: 'Date changes allowed with fare difference + ₹1800 fee per person.',
      payment: '30% advance at booking. Balance 12 days before departure.'
    }
  }
];
