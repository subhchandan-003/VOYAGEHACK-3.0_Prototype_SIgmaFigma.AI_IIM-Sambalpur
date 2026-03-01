import { TravelPackage } from '../types';
import { extractIntentFromText } from '../services/voiceAI';
import {
  findDemoDestination,
  findDemoFlights,
  findDemoHotels,
} from '../data/demoDataset';

// ─── IATA airport code lookup ──────────────────────────────────────────────────
const AIRPORT_CODES: Record<string, string> = {
  // India
  'goa': 'GOI', 'mumbai': 'BOM', 'delhi': 'DEL', 'new delhi': 'DEL',
  'bangalore': 'BLR', 'bengaluru': 'BLR', 'chennai': 'MAA', 'kolkata': 'CCU',
  'jaipur': 'JAI', 'hyderabad': 'HYD', 'kochi': 'COK', 'cochin': 'COK',
  'ahmedabad': 'AMD', 'pune': 'PNQ', 'guwahati': 'GAU', 'amritsar': 'ATQ',
  'varanasi': 'VNS', 'udaipur': 'UDR', 'jodhpur': 'JDH', 'shimla': 'SLV',
  'leh': 'IXL', 'manali': 'KUU', 'agra': 'AGR', 'srinagar': 'SXR',
  'andaman': 'IXZ', 'port blair': 'IXZ', 'coimbatore': 'CJB',
  'trichy': 'TRZ', 'tiruchirappalli': 'TRZ', 'vizag': 'VTZ',
  'visakhapatnam': 'VTZ', 'indore': 'IDR', 'bhopal': 'BHO',
  'nagpur': 'NAG', 'raipur': 'RPR',
  // International
  'dubai': 'DXB', 'abu dhabi': 'AUH', 'singapore': 'SIN', 'bangkok': 'BKK',
  'london': 'LHR', 'paris': 'CDG', 'new york': 'JFK', 'tokyo': 'NRT',
  'sydney': 'SYD', 'maldives': 'MLE', 'male': 'MLE', 'bali': 'DPS',
  'denpasar': 'DPS', 'colombo': 'CMB', 'sri lanka': 'CMB',
  'kathmandu': 'KTM', 'nepal': 'KTM', 'mauritius': 'MRU', 'doha': 'DOH',
  'amsterdam': 'AMS', 'rome': 'FCO', 'barcelona': 'BCN', 'milan': 'MXP',
  'istanbul': 'IST', 'frankfurt': 'FRA', 'zurich': 'ZRH', 'vienna': 'VIE',
  'kuala lumpur': 'KUL', 'kl': 'KUL', 'hong kong': 'HKG', 'seoul': 'ICN',
  'taipei': 'TPE', 'osaka': 'KIX', 'cairo': 'CAI', 'johannesburg': 'JNB',
  'nairobi': 'NBO', 'toronto': 'YYZ', 'vancouver': 'YVR', 'miami': 'MIA',
  'los angeles': 'LAX', 'san francisco': 'SFO', 'chicago': 'ORD',
  'phuket': 'HKT', 'chiang mai': 'CNX', 'krabi': 'KBV', 'pattaya': 'UTP',
  'muscat': 'MCT', 'oman': 'MCT', 'bahrain': 'BAH', 'kuwait': 'KWI',
  'cape town': 'CPT',
};

export function getAirportCode(destination: string): string {
  const lower = destination.toLowerCase().trim();
  return AIRPORT_CODES[lower] ?? destination.slice(0, 3).toUpperCase();
}

// ─── Shared package generator ──────────────────────────────────────────────────
export function generatePackages(destination: string, nights: number, adults: number): TravelPackage[] {
  const dest = findDemoDestination(destination);
  const datasetFlights = findDemoFlights(destination);
  const datasetHotels = findDemoHotels(destination);
  const isIntl = dest ? dest.country !== 'India' : false;
  const destAirport = getAirportCode(destination);

  const getHotel = (star: number) => {
    const matched =
      datasetHotels.find((h) => h.segment_star_demo === star) ??
      datasetHotels.sort(
        (a, b) =>
          Math.abs(a.segment_star_demo - star) -
          Math.abs(b.segment_star_demo - star)
      )[0];
    if (matched) {
      return {
        name: matched.hotel_name,
        stars: matched.segment_star_demo,
        area: matched.highlights?.[0] ?? matched.city,
        pricePerNight: matched.nightly_rate_inr,
        cancellation: matched.free_cancellation_until,
        board: matched.board_type,
      };
    }
    const base = dest?.starting_package_pp_inr ?? 30000;
    const rate =
      star === 5
        ? Math.round(base * 0.55)
        : star === 4
        ? Math.round(base * 0.32)
        : Math.round(base * 0.18);
    return {
      name:
        star === 5
          ? `The Grand ${destination}`
          : star === 4
          ? `${destination} Premier Hotel`
          : `${destination} Comfort Inn`,
      stars: star,
      area: `${destination} City Centre`,
      pricePerNight: rate,
      cancellation: star === 5 ? '5 days before check-in' : '72h before check-in',
      board: star >= 4 ? 'Breakfast' : 'Room Only',
    };
  };

  const getFlight = (tierIdx: number) => {
    if (datasetFlights.length > 0) {
      const sorted = [...datasetFlights].sort((a, b) => a.fare_inr - b.fare_inr);
      const f = sorted[Math.min(tierIdx, sorted.length - 1)];
      return {
        airline: f.airline,
        flightNo: f.flight_no,
        from: f.from_airport,
        to: f.to_airport,
        fare: f.fare_inr,
        duration: f.duration,
        stops: f.stops,
      };
    }
    const base = dest
      ? Math.round(dest.starting_package_pp_inr * 0.35)
      : isIntl
      ? 20000
      : 7500;
    const fare = base + tierIdx * Math.round(base * 0.15);
    const airlines: [string, string][] = isIntl
      ? [['Emirates', 'EK501'], ['IndiGo', '6E1401'], ['Air India', 'AI312']]
      : [['IndiGo', '6E2201'], ['Air India', 'AI501'], ['SpiceJet', 'SG411']];
    const [airline, flightNo] = airlines[Math.min(tierIdx, 2)];
    return {
      airline,
      flightNo,
      from: 'DEL',
      to: destAirport,          // ← uses real IATA code now
      fare,
      duration: isIntl ? '4h 30m' : '2h 15m',
      stops: tierIdx === 2 ? 1 : 0,
    };
  };

  const getActivities = (count: number) => {
    if (dest?.activity_menu.length) return dest.activity_menu.slice(0, count);
    return [
      { name: `${destination} City Tour`, price: 2000 },
      { name: 'Local Food & Culture Walk', price: 1500 },
      { name: 'Sunset Point Visit', price: 800 },
    ].slice(0, count);
  };

  const tiers = [
    { label: 'Premium', starTier: 5, cabin: 'Business' as const, actCount: 3 },
    { label: 'Standard', starTier: 4, cabin: 'Economy' as const, actCount: 2 },
    { label: 'Budget', starTier: 3, cabin: 'Economy' as const, actCount: 1 },
  ];

  return tiers.map((tier, i) => {
    const hotel = getHotel(tier.starTier);
    const fl = getFlight(i);
    const depH = 6 + i * 3;
    const retH = 17 + i * 2;
    const activities = getActivities(tier.actCount);
    const transferPrice = isIntl ? 4500 - i * 800 : 1800 - i * 400;

    const flightsCost = fl.fare * 2 * adults;
    const hotelTotal = hotel.pricePerNight * nights;
    const activitiesTotal = activities.reduce((s, a) => s + a.price * adults, 0);
    const totalPrice = flightsCost + hotelTotal + transferPrice + activitiesTotal;
    const confidenceScore = Math.round(94 - i * 9 + Math.random() * 4);
    const retFlightNo = fl.flightNo.replace(/(\d+)/, (m) => String(parseInt(m) + 500));

    return {
      id: `PKG-${destination.toUpperCase().replace(/\s+/g, '')}-${Date.now()}-${i}`,
      name: `${tier.label} ${destination} — ${nights}N/${nights + 1}D`,
      outboundFlight: {
        airline: fl.airline,
        flightNumber: fl.flightNo,
        departure: fl.from,
        arrival: fl.to,
        departureTime: `${String(depH).padStart(2, '0')}:${['30', '15', '45'][i]}`,
        arrivalTime: `${String(depH + 3).padStart(2, '0')}:${['15', '45', '30'][i]}`,
        duration: fl.duration,
        stops: fl.stops,
        price: fl.fare,
        cabinClass: tier.cabin,
        baggageAllowance: { cabin: '7kg', checkin: tier.cabin === 'Business' ? '30kg' : '15kg' },
      },
      returnFlight: {
        airline: fl.airline,
        flightNumber: retFlightNo,
        departure: fl.to,
        arrival: fl.from,
        departureTime: `${String(retH).padStart(2, '0')}:00`,
        arrivalTime: `${String(retH + 3).padStart(2, '0')}:${['45', '30', '15'][i]}`,
        duration: fl.duration,
        stops: fl.stops,
        price: fl.fare,
        cabinClass: tier.cabin,
        baggageAllowance: { cabin: '7kg', checkin: tier.cabin === 'Business' ? '30kg' : '15kg' },
      },
      hotel: {
        name: hotel.name,
        category: hotel.stars,
        area: hotel.area,
        amenities: [
          'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym',
          ...(i === 0 ? ['Butler Service', 'Concierge'] : []),
        ],
        price: hotelTotal,
        images: [],
        roomType: ['Suite', 'Deluxe Room', 'Standard Room'][i],
        mealPlan:
          i === 0
            ? 'Breakfast + Dinner'
            : hotel.board === 'Breakfast'
            ? 'Breakfast included'
            : 'Room only',
        rating: parseFloat((4.9 - i * 0.25).toFixed(1)),
        reviewCount: Math.round(850 - i * 200 + Math.random() * 80),
        cancellationPolicy: `Free cancellation until ${hotel.cancellation}`,
      },
      transfer: {
        type: i === 0 ? 'Private' : 'Shared',
        vehicle: ['Luxury SUV', 'Sedan', 'Hatchback'][i],
        price: transferPrice,
        included: i === 0,
        pickupLocation: `${fl.to} Airport`,
        dropoffLocation: hotel.name,
      },
      activities: activities.map((a) => ({
        name: a.name,
        duration: '3 hours',
        price: a.price * adults,
        included: i === 0,
        category: 'Sightseeing',
      })),
      totalPrice,
      priceBreakdown: {
        flights: flightsCost,
        hotel: hotelTotal,
        transfer: transferPrice,
        activities: activitiesTotal,
      },
      confidenceScore,
      whyThisBundle: [
        `${tier.label} value for ${destination}`,
        `${hotel.stars}★ ${hotel.name} (${hotel.board})`,
        `${isIntl ? 'International' : 'Direct domestic'} flights with ${fl.airline}`,
        ...(i === 0 ? ['Business class & butler service'] : []),
        ...(dest ? [`Best for: ${dest.best_for.join(', ')}`] : []),
      ],
      matchScore: confidenceScore,
    } as TravelPackage;
  });
}

// ─── Query parser ──────────────────────────────────────────────────────────────
export function parseQuery(queryStr: string) {
  const intent = extractIntentFromText(queryStr, {});
  return {
    destination: intent.destination ?? 'Goa',
    nights: intent.nights ?? 5,
    adults: intent.adults ?? 2,
    budgetText: intent.budgetText,
    dates: intent.dates,
    vibe: intent.vibe,
  };
}
