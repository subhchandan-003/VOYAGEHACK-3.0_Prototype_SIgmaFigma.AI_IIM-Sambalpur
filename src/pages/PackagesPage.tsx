import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { PackageCard } from '../components/PackageCard';
import { ArrowLeft, Filter, SlidersHorizontal, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { extractIntentFromText } from '../services/voiceAI';
import { TravelPackage } from '../types';

// ── Destination profiles ───────────────────────────────────────────────────────
interface DestProfile {
  airports: [string, string];
  airlines: [string, string][];
  flightDuration: string;
  hotels: { name: string; stars: number; area: string; pricePerNight: number }[];
  activities: { name: string; duration: string; price: number }[];
  international?: boolean;
}

const PROFILES: Record<string, DestProfile> = {
  Goa: {
    airports: ['DEL', 'GOI'], airlines: [['IndiGo', '6E 5316'], ['Air India', 'AI 635'], ['Vistara', 'UK 993']], flightDuration: '2h 45m',
    hotels: [{ name: 'The Leela Goa', stars: 5, area: 'South Goa', pricePerNight: 8500 }, { name: 'Taj Fort Aguada', stars: 5, area: 'North Goa', pricePerNight: 7200 }, { name: 'Alila Diwa Goa', stars: 4, area: 'South Goa', pricePerNight: 4800 }],
    activities: [{ name: 'Scuba Diving at Grande Island', duration: '4 hours', price: 3500 }, { name: 'Old Goa Heritage Walk', duration: '3 hours', price: 1200 }, { name: 'Sunset Cruise on Mandovi', duration: '2 hours', price: 1800 }],
  },
  Manali: {
    airports: ['DEL', 'KUU'], airlines: [['SpiceJet', 'SG 182'], ['Air India', 'AI 211'], ['IndiGo', '6E 312']], flightDuration: '1h 15m',
    hotels: [{ name: 'Span Resort & Spa', stars: 5, area: 'Old Manali', pricePerNight: 6500 }, { name: 'The Orchard Greens', stars: 4, area: 'Manali Town', pricePerNight: 4200 }, { name: 'Johnson Lodge', stars: 3, area: 'Mall Road', pricePerNight: 2800 }],
    activities: [{ name: 'Solang Valley Snow Activities', duration: '5 hours', price: 2500 }, { name: 'Rohtang Pass Day Trip', duration: '8 hours', price: 3800 }, { name: 'Paragliding at Dobhi', duration: '2 hours', price: 2200 }],
  },
  Shimla: {
    airports: ['DEL', 'SLV'], airlines: [['Air India', 'AI 201'], ['SpiceJet', 'SG 412']], flightDuration: '1h 05m',
    hotels: [{ name: 'Wildflower Hall', stars: 5, area: 'Mashobra', pricePerNight: 14000 }, { name: 'The Cecil Hotel', stars: 5, area: 'Mall Road', pricePerNight: 9000 }, { name: 'Hotel Combermere', stars: 3, area: 'The Ridge', pricePerNight: 3500 }],
    activities: [{ name: 'Toy Train Shimla', duration: '3 hours', price: 850 }, { name: 'Kufri Snow Point Visit', duration: '4 hours', price: 1500 }, { name: 'Jakhu Temple Trek', duration: '2 hours', price: 600 }],
  },
  Kerala: {
    airports: ['DEL', 'COK'], airlines: [['IndiGo', '6E 401'], ['Air India', 'AI 509'], ['Vistara', 'UK 812']], flightDuration: '3h 20m',
    hotels: [{ name: 'Kumarakom Lake Resort', stars: 5, area: 'Backwaters', pricePerNight: 12000 }, { name: 'The Leela Kovalam', stars: 5, area: 'Kovalam Beach', pricePerNight: 9500 }, { name: 'Pepper Trail Homestay', stars: 3, area: 'Munnar', pricePerNight: 3500 }],
    activities: [{ name: 'Houseboat Stay in Alleppey', duration: '1 day', price: 8500 }, { name: 'Kathakali Dance Performance', duration: '2 hours', price: 1200 }, { name: 'Munnar Tea Plantation Tour', duration: '4 hours', price: 1800 }],
  },
  Maldives: {
    airports: ['DEL', 'MLE'], airlines: [['Air India', 'AI 271'], ['IndiGo', '6E 1231']], flightDuration: '4h 45m', international: true,
    hotels: [{ name: 'Soneva Jani', stars: 5, area: 'North Malé Atoll', pricePerNight: 65000 }, { name: 'Anantara Veli', stars: 5, area: 'South Malé Atoll', pricePerNight: 38000 }, { name: 'Holiday Inn Kandooma', stars: 4, area: 'South Malé Atoll', pricePerNight: 22000 }],
    activities: [{ name: 'Snorkelling & Reef Excursion', duration: '3 hours', price: 5500 }, { name: 'Sunset Dolphin Cruise', duration: '2 hours', price: 4200 }, { name: 'Underwater Restaurant Dinner', duration: '2 hours', price: 12000 }],
  },
  Dubai: {
    airports: ['DEL', 'DXB'], airlines: [['Emirates', 'EK 508'], ['IndiGo', '6E 1401'], ['Air India', 'AI 995']], flightDuration: '3h 30m', international: true,
    hotels: [{ name: 'Burj Al Arab', stars: 5, area: 'Jumeirah', pricePerNight: 55000 }, { name: 'Atlantis The Palm', stars: 5, area: 'Palm Jumeirah', pricePerNight: 32000 }, { name: 'JW Marriott Marina', stars: 4, area: 'Dubai Marina', pricePerNight: 12000 }],
    activities: [{ name: 'Burj Khalifa At the Top', duration: '2 hours', price: 4800 }, { name: 'Desert Safari with BBQ', duration: '6 hours', price: 6500 }, { name: 'Dubai Marina Cruise', duration: '2 hours', price: 3200 }],
  },
  Bali: {
    airports: ['DEL', 'DPS'], airlines: [['IndiGo', '6E 1833'], ['Air India', 'AI 367']], flightDuration: '7h 10m', international: true,
    hotels: [{ name: 'Four Seasons Sayan', stars: 5, area: 'Ubud', pricePerNight: 28000 }, { name: 'The Mulia Resort', stars: 5, area: 'Nusa Dua', pricePerNight: 18000 }, { name: 'Alaya Resort Ubud', stars: 4, area: 'Ubud', pricePerNight: 9500 }],
    activities: [{ name: 'Tanah Lot Temple Sunset', duration: '3 hours', price: 2800 }, { name: 'Mount Batur Sunrise Trek', duration: '6 hours', price: 4500 }, { name: 'Ubud Rice Terrace Walk', duration: '4 hours', price: 2200 }],
  },
  Thailand: {
    airports: ['DEL', 'BKK'], airlines: [['Thai Airways', 'TG 316'], ['IndiGo', '6E 1801']], flightDuration: '4h 20m', international: true,
    hotels: [{ name: 'Mandarin Oriental Bangkok', stars: 5, area: 'Riverside', pricePerNight: 24000 }, { name: 'Avani Pattaya Resort', stars: 4, area: 'Pattaya Beach', pricePerNight: 9000 }, { name: 'Ibis Styles Phuket', stars: 3, area: 'Patong', pricePerNight: 4500 }],
    activities: [{ name: 'Grand Palace & Emerald Buddha', duration: '4 hours', price: 2500 }, { name: 'Thai Cooking Class', duration: '3 hours', price: 3200 }, { name: 'Phi Phi Island Day Trip', duration: '8 hours', price: 4800 }],
  },
  Singapore: {
    airports: ['DEL', 'SIN'], airlines: [['Singapore Airlines', 'SQ 408'], ['IndiGo', '6E 1611']], flightDuration: '5h 50m', international: true,
    hotels: [{ name: 'Marina Bay Sands', stars: 5, area: 'Marina Bay', pricePerNight: 35000 }, { name: 'The Fullerton Hotel', stars: 5, area: 'Raffles Place', pricePerNight: 22000 }, { name: 'Hotel Boss', stars: 3, area: 'Lavender', pricePerNight: 7500 }],
    activities: [{ name: 'Gardens by the Bay Night Show', duration: '2 hours', price: 3500 }, { name: 'Universal Studios Singapore', duration: '8 hours', price: 8000 }, { name: 'Sentosa Cable Car', duration: '3 hours', price: 3200 }],
  },
  Rajasthan: {
    airports: ['DEL', 'JAI'], airlines: [['IndiGo', '6E 2201'], ['Air India', 'AI 447']], flightDuration: '1h 20m',
    hotels: [{ name: 'Taj Lake Palace, Udaipur', stars: 5, area: 'Lake Pichola', pricePerNight: 32000 }, { name: 'Rambagh Palace, Jaipur', stars: 5, area: 'Jaipur', pricePerNight: 24000 }, { name: 'Ummed Jodhpur', stars: 4, area: 'Jodhpur', pricePerNight: 8500 }],
    activities: [{ name: 'Amber Fort & City Palace Tour', duration: '6 hours', price: 3500 }, { name: 'Desert Camel Safari', duration: '4 hours', price: 2800 }, { name: 'Pushkar Heritage Walk', duration: '3 hours', price: 1500 }],
  },
  Leh: {
    airports: ['DEL', 'IXL'], airlines: [['Air India', 'AI 445'], ['IndiGo', '6E 2311']], flightDuration: '1h 25m',
    hotels: [{ name: 'The Grand Dragon Ladakh', stars: 5, area: 'Leh Town', pricePerNight: 8500 }, { name: 'The Chospa Hotel', stars: 4, area: 'Leh', pricePerNight: 5500 }, { name: 'Saboo Resorts', stars: 3, area: 'Saboo Valley', pricePerNight: 3200 }],
    activities: [{ name: 'Pangong Lake Excursion', duration: '1 day', price: 4500 }, { name: 'Nubra Valley & Khardung La', duration: '1 day', price: 3800 }, { name: 'Monastery Circuit Tour', duration: '6 hours', price: 2800 }],
  },
  Udaipur: {
    airports: ['DEL', 'UDR'], airlines: [['IndiGo', '6E 312'], ['Air India', 'AI 477']], flightDuration: '1h 30m',
    hotels: [{ name: 'Oberoi Udaivilas', stars: 5, area: 'Pichola Lake', pricePerNight: 40000 }, { name: 'Taj Lake Palace', stars: 5, area: 'Lake Pichola', pricePerNight: 32000 }, { name: 'Vivanta Udaipur', stars: 4, area: 'City Centre', pricePerNight: 9500 }],
    activities: [{ name: 'Lake Pichola Boat Ride', duration: '2 hours', price: 1800 }, { name: 'City Palace Museum Tour', duration: '3 hours', price: 2200 }, { name: 'Vintage Car Museum', duration: '2 hours', price: 1200 }],
  },
  Darjeeling: {
    airports: ['CCU', 'IXB'], airlines: [['IndiGo', '6E 711'], ['Air India', 'AI 783']], flightDuration: '1h 10m',
    hotels: [{ name: 'Mayfair Darjeeling', stars: 5, area: 'Observatory Hill', pricePerNight: 8500 }, { name: 'The Elgin Hotel', stars: 4, area: 'Mall Road', pricePerNight: 5500 }, { name: 'Hotel Shangrila', stars: 3, area: 'Town Centre', pricePerNight: 2800 }],
    activities: [{ name: 'Tiger Hill Sunrise', duration: '4 hours', price: 1200 }, { name: 'Darjeeling Himalayan Railway', duration: '3 hours', price: 1800 }, { name: 'Tea Estate Tour', duration: '3 hours', price: 1500 }],
  },
  Rishikesh: {
    airports: ['DEL', 'DED'], airlines: [['IndiGo', '6E 822'], ['SpiceJet', 'SG 411']], flightDuration: '1h 10m',
    hotels: [{ name: 'Taj Rishikesh Resort & Spa', stars: 5, area: 'Rishikesh Hills', pricePerNight: 18000 }, { name: 'Ananda in the Himalayas', stars: 5, area: 'Narendra Nagar', pricePerNight: 35000 }, { name: 'Zostel Rishikesh', stars: 3, area: 'Laxman Jhula', pricePerNight: 1800 }],
    activities: [{ name: 'White Water Rafting', duration: '3 hours', price: 2500 }, { name: 'Bungee Jumping at Jumpin Heights', duration: '2 hours', price: 3500 }, { name: 'Yoga & Meditation Session', duration: '2 hours', price: 1200 }],
  },
  Varanasi: {
    airports: ['DEL', 'VNS'], airlines: [['Air India', 'AI 411'], ['IndiGo', '6E 512']], flightDuration: '1h 30m',
    hotels: [{ name: 'Taj Ganges, Varanasi', stars: 5, area: 'Nadesar Palace', pricePerNight: 12000 }, { name: 'BrijRama Palace', stars: 5, area: 'Ghats', pricePerNight: 16000 }, { name: 'Hotel Surya', stars: 3, area: 'Godowlia', pricePerNight: 3200 }],
    activities: [{ name: 'Ganga Aarti at Dashashwamedh', duration: '2 hours', price: 500 }, { name: 'Sunrise Boat Ride on Ganga', duration: '2 hours', price: 1200 }, { name: 'Sarnath Buddhist Circuit', duration: '4 hours', price: 2000 }],
  },
};

function getProfile(destination: string): DestProfile {
  const key = Object.keys(PROFILES).find(k =>
    destination.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(destination.toLowerCase())
  );
  if (key) return PROFILES[key];
  // Default synthesized profile
  return {
    airports: ['DEL', 'XXX'], airlines: [['IndiGo', '6E 1001'], ['Air India', 'AI 501']], flightDuration: '2h 30m',
    hotels: [
      { name: `The Grand ${destination}`, stars: 5, area: `${destination} City`, pricePerNight: 9000 },
      { name: `${destination} Heritage Resort`, stars: 4, area: `${destination} Central`, pricePerNight: 5500 },
      { name: `${destination} Comfort Inn`, stars: 3, area: `${destination} Town`, pricePerNight: 3200 },
    ],
    activities: [
      { name: `${destination} City Tour`, duration: '4 hours', price: 2000 },
      { name: 'Local Food & Culture Walk', duration: '3 hours', price: 1500 },
      { name: 'Sunset Point Visit', duration: '2 hours', price: 800 },
    ],
  };
}

function generatePackages(destination: string, nights: number, adults: number): TravelPackage[] {
  const p = getProfile(destination);
  const tiers = [
    { label: 'Premium', hotelIdx: 0, cabin: 'Business' as const },
    { label: 'Standard', hotelIdx: 1, cabin: 'Economy' as const },
    { label: 'Budget', hotelIdx: 2, cabin: 'Economy' as const },
  ];

  return tiers.map((tier, i) => {
    const hotel = p.hotels[Math.min(tier.hotelIdx, p.hotels.length - 1)];
    const airline = p.airlines[Math.min(i, p.airlines.length - 1)];
    const depH = 6 + i * 3;
    const flightMins = parseInt(p.flightDuration);
    const arrH = depH + flightMins;
    const retH = 17 + i * 2;
    const retArrH = retH + flightMins;

    const flightPrice = p.international
      ? 18000 + i * 6000 + Math.round(Math.random() * 3000)
      : 7500 + i * 2500 + Math.round(Math.random() * 1500);

    const hotelTotal = hotel.pricePerNight * nights * adults;
    const transferPrice = p.international ? 4500 - i * 800 : 1800 - i * 400;
    const selectedActivities = p.activities.slice(0, 3 - Math.min(i, 2));
    const activitiesTotal = selectedActivities.reduce((s, a) => s + a.price * adults, 0);
    const totalPrice = (flightPrice * 2 * adults) + hotelTotal + transferPrice + activitiesTotal;
    const confidenceScore = Math.round(94 - i * 9 + Math.random() * 4);

    const retFlightNum = `${airline[1].split(' ')[0]} ${parseInt(airline[1].split(' ')[1]) + 500}`;

    return {
      id: `PKG-${destination.toUpperCase().replace(/\s+/g, '')}-${Date.now()}-${i}`,
      name: `${tier.label} ${destination} — ${nights}N/${nights + 1}D`,
      outboundFlight: {
        airline: airline[0],
        flightNumber: airline[1],
        departure: p.airports[0],
        arrival: p.airports[1],
        departureTime: `${String(depH).padStart(2, '0')}:${['30', '15', '45'][i]}`,
        arrivalTime: `${String(arrH + 2).padStart(2, '0')}:${['15', '45', '30'][i]}`,
        duration: p.flightDuration,
        stops: i === 2 ? 1 : 0,
        price: flightPrice,
        cabinClass: tier.cabin,
        baggageAllowance: { cabin: '7kg', checkin: tier.cabin === 'Business' ? '30kg' : '15kg' },
      },
      returnFlight: {
        airline: airline[0],
        flightNumber: retFlightNum,
        departure: p.airports[1],
        arrival: p.airports[0],
        departureTime: `${String(retH).padStart(2, '0')}:00`,
        arrivalTime: `${String(retArrH + 2).padStart(2, '0')}:${['45', '30', '15'][i]}`,
        duration: p.flightDuration,
        stops: i === 2 ? 1 : 0,
        price: flightPrice,
        cabinClass: tier.cabin,
        baggageAllowance: { cabin: '7kg', checkin: tier.cabin === 'Business' ? '30kg' : '15kg' },
      },
      hotel: {
        name: hotel.name,
        category: hotel.stars,
        area: hotel.area,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', ...(i === 0 ? ['Butler Service'] : [])],
        price: hotelTotal,
        images: [],
        roomType: ['Suite', 'Deluxe Room', 'Standard Room'][i],
        mealPlan: i === 0 ? 'Breakfast + Dinner' : 'Breakfast included',
        rating: parseFloat((4.9 - i * 0.25).toFixed(1)),
        reviewCount: Math.round(850 - i * 200 + Math.random() * 80),
        cancellationPolicy: i === 0 ? 'Free cancellation until 7 days before' : 'Free cancellation until 3 days before',
      },
      transfer: {
        type: i === 0 ? 'Private' : 'Shared',
        vehicle: ['Luxury SUV', 'Sedan', 'Hatchback'][i],
        price: transferPrice,
        included: i === 0,
      },
      activities: selectedActivities.map(a => ({
        name: a.name,
        duration: a.duration,
        price: a.price * adults,
        included: i === 0,
        category: 'Sightseeing',
      })),
      totalPrice,
      priceBreakdown: {
        flights: flightPrice * 2 * adults,
        hotel: hotelTotal,
        transfer: transferPrice,
        activities: activitiesTotal,
      },
      confidenceScore,
      whyThisBundle: [
        `${tier.label} value for ${destination}`,
        `${hotel.stars}★ ${hotel.name}`,
        `${p.international ? 'International' : 'Direct domestic'} flights with ${airline[0]}`,
        ...(i === 0 ? ['Business class & butler service'] : []),
      ],
      matchScore: confidenceScore,
    } as TravelPackage;
  });
}

function parseQuery(queryStr: string) {
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

// ─────────────────────────────────────────────────────────────────────────────

export function PackagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentIntent, setSelectedPackage } = useApp();

  const queryStr: string = (location.state as any)?.query ?? '';
  const parsed = React.useMemo(() => parseQuery(queryStr), [queryStr]);

  const [displayPackages, setDisplayPackages] = React.useState<TravelPackage[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setDisplayPackages(generatePackages(parsed.destination, parsed.nights, parsed.adults));
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [parsed.destination, parsed.nights, parsed.adults]);

  const handleSelectPackage = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    navigate('/customize');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {loading
                  ? 'Finding packages…'
                  : `${displayPackages.length} Packages for ${parsed.destination}`}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {parsed.destination}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                  🌙 {parsed.nights} nights
                </span>
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                  👥 {parsed.adults} adult{parsed.adults > 1 ? 's' : ''}
                </span>
                {parsed.budgetText && (
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                    💰 {parsed.budgetText}
                  </span>
                )}
                {parsed.dates && (
                  <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full">
                    📅 {parsed.dates}
                  </span>
                )}
                {parsed.vibe && (
                  <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full">
                    ✨ {parsed.vibe}
                  </span>
                )}
                {/* Fallback: show currentIntent destination if no queryStr */}
                {!queryStr && currentIntent && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    📍 {currentIntent.destination}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="size-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="size-4" />
                <span className="text-sm font-medium">Sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 text-sm">
              Searching packages for <span className="font-semibold text-gray-800">{parsed.destination}</span>…
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {displayPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onSelect={() => handleSelectPackage(pkg)}
                />
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Insights for {parsed.destination}
              </h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Packages are sorted by confidence score — higher score means better fit for your requirements</li>
                <li>• {parsed.destination} is best visited {parsed.dates ? `in ${parsed.dates}` : 'during the ideal travel season'}</li>
                <li>• Premium package includes business class & butler service for a premium experience</li>
                <li>• Book within 48 hours — prices may increase based on demand and seat availability</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
