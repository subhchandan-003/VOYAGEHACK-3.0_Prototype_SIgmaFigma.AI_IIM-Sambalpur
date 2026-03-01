// ─── Demo Seed Dataset for TBO Holiday Package Chatbot ────────────────────────
// All prices are demo values in INR. For production, replace with live API feed.

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface DemoDestination {
  destination_id: string;
  country: string;
  city: string;
  theme: string;
  best_for: string[];
  sample_nights: number;
  starting_package_pp_inr: number;
  activity_menu: { name: string; price: number }[];
  visa_profile_id: string;
}

export interface DemoFlight {
  flight_id: string;
  from_city: string;
  from_airport: string;
  to_city: string;
  to_airport: string;
  airline: string;
  flight_no: string;
  travel_date: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
  cabin: string;
  fare_inr: number;
  refundable: boolean;
  baggage: string;
  meal: string;
  priority_checkin_available: boolean;
}

export interface DemoHotel {
  hotel_id: string;
  country: string;
  city: string;
  hotel_name: string;
  segment_star_demo: number;
  room_type: string;
  board_type: string;
  nightly_rate_inr: number;
  early_checkin_available: boolean;
  early_checkin_fee_inr: number;
  priority_checkin_available: boolean;
  priority_checkin_fee_inr: number;
  free_cancellation_until: string;
  highlights: string[];
}

export interface DemoAddOn {
  add_on_id: string;
  add_on_name: string;
  scope: string;
  price_inr: number;
  pricing_unit: string;
  availability_rule: string;
  bot_trigger: string;
  description: string;
}

export interface DemoVisaProfile {
  visa_profile_id: string;
  country_or_region: string;
  visa_mode_demo: string;
  turnaround_days_demo: string;
  bot_question: string;
  documents_required_demo: string[];
  if_pending_bot_reply: string;
  if_approved_bot_reply: string;
}

// ─── 1. Destinations (40 entries) ─────────────────────────────────────────────

export const demoDestinations: DemoDestination[] = [
  { destination_id: 'D001', country: 'India', city: 'Goa', theme: 'Beach & nightlife', best_for: ['Friends', 'Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 18500, activity_menu: [{ name: 'Sunset cruise', price: 1200 }, { name: 'North Goa sightseeing', price: 1800 }, { name: 'Water sports combo', price: 3500 }], visa_profile_id: 'V000' },
  { destination_id: 'D002', country: 'India', city: 'Jaipur', theme: 'Heritage & culture', best_for: ['Family', 'Couples'], sample_nights: 3, starting_package_pp_inr: 15500, activity_menu: [{ name: 'Amber Fort visit', price: 700 }, { name: 'City Palace entry', price: 900 }, { name: 'Chokhi Dhani evening', price: 1600 }], visa_profile_id: 'V000' },
  { destination_id: 'D003', country: 'India', city: 'Udaipur', theme: 'Royal romance', best_for: ['Couples', 'Family'], sample_nights: 3, starting_package_pp_inr: 17800, activity_menu: [{ name: 'Lake Pichola boat ride', price: 900 }, { name: 'City Palace visit', price: 1100 }, { name: 'Cultural show', price: 1200 }], visa_profile_id: 'V000' },
  { destination_id: 'D004', country: 'India', city: 'Srinagar', theme: 'Scenic & family', best_for: ['Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 22900, activity_menu: [{ name: 'Shikara ride', price: 800 }, { name: 'Gulmarg day trip', price: 2500 }, { name: 'Mughal garden tour', price: 900 }], visa_profile_id: 'V000' },
  { destination_id: 'D005', country: 'India', city: 'Leh', theme: 'Adventure', best_for: ['Friends', 'Adventure travellers'], sample_nights: 5, starting_package_pp_inr: 28900, activity_menu: [{ name: 'Nubra Valley excursion', price: 3200 }, { name: 'Pangong day trip', price: 4200 }, { name: 'Bike rental', price: 1800 }], visa_profile_id: 'V000' },
  { destination_id: 'D006', country: 'India', city: 'Port Blair', theme: 'Island holiday', best_for: ['Family', 'Couples'], sample_nights: 5, starting_package_pp_inr: 31500, activity_menu: [{ name: 'Cellular Jail entry', price: 500 }, { name: 'Ross Island tour', price: 1400 }, { name: 'Snorkeling', price: 2200 }], visa_profile_id: 'V000' },
  { destination_id: 'D007', country: 'India', city: 'Havelock', theme: 'Beach & diving', best_for: ['Couples', 'Honeymooners'], sample_nights: 3, starting_package_pp_inr: 21200, activity_menu: [{ name: 'Scuba try dive', price: 3800 }, { name: 'Radhanagar transfer', price: 900 }, { name: 'Glass bottom boat', price: 1200 }], visa_profile_id: 'V000' },
  { destination_id: 'D008', country: 'India', city: 'Munnar', theme: 'Hills & tea', best_for: ['Couples', 'Family'], sample_nights: 3, starting_package_pp_inr: 14900, activity_menu: [{ name: 'Tea museum', price: 400 }, { name: 'Eravikulam ticket', price: 600 }, { name: 'Jeep safari', price: 1800 }], visa_profile_id: 'V000' },
  { destination_id: 'D009', country: 'India', city: 'Alleppey', theme: 'Backwater leisure', best_for: ['Couples', 'Family'], sample_nights: 2, starting_package_pp_inr: 16900, activity_menu: [{ name: 'Houseboat lunch cruise', price: 3200 }, { name: 'Village canoe ride', price: 900 }, { name: 'Ayurveda massage', price: 1800 }], visa_profile_id: 'V000' },
  { destination_id: 'D010', country: 'India', city: 'Coorg', theme: 'Relaxation & nature', best_for: ['Couples', 'Family'], sample_nights: 3, starting_package_pp_inr: 15900, activity_menu: [{ name: 'Abbey Falls visit', price: 300 }, { name: 'Coffee estate tour', price: 1200 }, { name: 'Dubare camp', price: 800 }], visa_profile_id: 'V000' },
  { destination_id: 'D011', country: 'India', city: 'Rishikesh', theme: 'Adventure & spirituality', best_for: ['Friends', 'Family'], sample_nights: 3, starting_package_pp_inr: 12900, activity_menu: [{ name: 'River rafting', price: 1800 }, { name: 'Bungee jump', price: 3500 }, { name: 'Ganga aarti transfer', price: 600 }], visa_profile_id: 'V000' },
  { destination_id: 'D012', country: 'India', city: 'Manali', theme: 'Snow & mountains', best_for: ['Friends', 'Couples', 'Family'], sample_nights: 4, starting_package_pp_inr: 14900, activity_menu: [{ name: 'Solang activities', price: 2200 }, { name: 'Atal Tunnel trip', price: 1600 }, { name: 'Cafe crawl', price: 700 }], visa_profile_id: 'V000' },
  { destination_id: 'D013', country: 'UAE', city: 'Dubai', theme: 'Luxury & lifestyle', best_for: ['Family', 'Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 36500, activity_menu: [{ name: 'Dhow cruise', price: 3200 }, { name: 'Burj Khalifa 124/125', price: 4200 }, { name: 'Desert safari', price: 4500 }], visa_profile_id: 'V001' },
  { destination_id: 'D014', country: 'UAE', city: 'Abu Dhabi', theme: 'Premium family trip', best_for: ['Family', 'Couples'], sample_nights: 3, starting_package_pp_inr: 34800, activity_menu: [{ name: 'Louvre Abu Dhabi', price: 1800 }, { name: 'Ferrari World', price: 7200 }, { name: 'Grand Mosque visit', price: 0 }], visa_profile_id: 'V001' },
  { destination_id: 'D015', country: 'Thailand', city: 'Bangkok', theme: 'Shopping & nightlife', best_for: ['Friends', 'Family'], sample_nights: 4, starting_package_pp_inr: 28500, activity_menu: [{ name: 'Chao Phraya cruise', price: 1800 }, { name: 'Safari World', price: 2600 }, { name: 'Temple city tour', price: 1400 }], visa_profile_id: 'V002' },
  { destination_id: 'D016', country: 'Thailand', city: 'Phuket', theme: 'Beach & honeymoon', best_for: ['Couples', 'Friends', 'Family'], sample_nights: 4, starting_package_pp_inr: 31200, activity_menu: [{ name: 'Phi Phi island tour', price: 4200 }, { name: 'Phuket Fantasea', price: 3500 }, { name: 'ATV ride', price: 2900 }], visa_profile_id: 'V002' },
  { destination_id: 'D017', country: 'Thailand', city: 'Krabi', theme: 'Beach & soft adventure', best_for: ['Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 29800, activity_menu: [{ name: 'Four islands trip', price: 3100 }, { name: 'Emerald pool transfer', price: 1800 }, { name: 'Sea kayak', price: 2500 }], visa_profile_id: 'V002' },
  { destination_id: 'D018', country: 'Singapore', city: 'Singapore', theme: 'Family city holiday', best_for: ['Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 42500, activity_menu: [{ name: 'Universal Studios', price: 5600 }, { name: 'Night Safari', price: 4200 }, { name: 'Gardens by the Bay', price: 2500 }], visa_profile_id: 'V003' },
  { destination_id: 'D019', country: 'Indonesia', city: 'Bali', theme: 'Honeymoon & leisure', best_for: ['Couples', 'Friends'], sample_nights: 5, starting_package_pp_inr: 33800, activity_menu: [{ name: 'Uluwatu sunset tour', price: 2200 }, { name: 'Nusa Penida day trip', price: 4200 }, { name: 'Spa session', price: 3000 }], visa_profile_id: 'V004' },
  { destination_id: 'D020', country: 'Malaysia', city: 'Kuala Lumpur', theme: 'Value city break', best_for: ['Family', 'Friends'], sample_nights: 3, starting_package_pp_inr: 26800, activity_menu: [{ name: 'Petronas entry', price: 1600 }, { name: 'Genting day trip', price: 2400 }, { name: 'Sunway Lagoon', price: 4500 }], visa_profile_id: 'V005' },
  { destination_id: 'D021', country: 'Japan', city: 'Tokyo', theme: 'Premium city escape', best_for: ['Family', 'Couples', 'Friends'], sample_nights: 5, starting_package_pp_inr: 78500, activity_menu: [{ name: 'Disneyland pass', price: 6200 }, { name: 'Tokyo Skytree', price: 1800 }, { name: 'Mt Fuji day trip', price: 6200 }], visa_profile_id: 'V006' },
  { destination_id: 'D022', country: 'Japan', city: 'Kyoto', theme: 'Culture & calm', best_for: ['Couples', 'Family'], sample_nights: 4, starting_package_pp_inr: 76200, activity_menu: [{ name: 'Tea ceremony', price: 3200 }, { name: 'Arashiyama transfer', price: 1800 }, { name: 'Temple trail pass', price: 1400 }], visa_profile_id: 'V006' },
  { destination_id: 'D023', country: 'South Korea', city: 'Seoul', theme: 'K-culture & shopping', best_for: ['Friends', 'Couples'], sample_nights: 4, starting_package_pp_inr: 64800, activity_menu: [{ name: 'N Seoul Tower', price: 1400 }, { name: 'Lotte World', price: 3900 }, { name: 'DMZ tour', price: 4200 }], visa_profile_id: 'V007' },
  { destination_id: 'D024', country: 'France', city: 'Paris', theme: 'Romance & icons', best_for: ['Couples', 'Family'], sample_nights: 5, starting_package_pp_inr: 92500, activity_menu: [{ name: 'Eiffel summit', price: 3600 }, { name: 'Seine cruise', price: 2200 }, { name: 'Disneyland Paris', price: 7800 }], visa_profile_id: 'V008' },
  { destination_id: 'D025', country: 'France', city: 'Nice', theme: 'Riviera & leisure', best_for: ['Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 84800, activity_menu: [{ name: 'Monaco day trip', price: 4200 }, { name: 'Old Town walk', price: 0 }, { name: 'Beach club access', price: 2500 }], visa_profile_id: 'V008' },
  { destination_id: 'D026', country: 'Switzerland', city: 'Zurich', theme: 'Premium scenic trip', best_for: ['Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 102000, activity_menu: [{ name: 'Rhine Falls trip', price: 2600 }, { name: 'Lindt Home of Chocolate', price: 1800 }, { name: 'City pass', price: 3200 }], visa_profile_id: 'V009' },
  { destination_id: 'D027', country: 'Switzerland', city: 'Lucerne', theme: 'Scenic romance', best_for: ['Couples', 'Family'], sample_nights: 4, starting_package_pp_inr: 108000, activity_menu: [{ name: 'Mt Titlis tour', price: 9200 }, { name: 'Lake Lucerne cruise', price: 3000 }, { name: 'Pilatus trip', price: 7800 }], visa_profile_id: 'V009' },
  { destination_id: 'D028', country: 'Italy', city: 'Rome', theme: 'History & food', best_for: ['Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 89500, activity_menu: [{ name: 'Colosseum entry', price: 2800 }, { name: 'Vatican tour', price: 3200 }, { name: 'Food walk', price: 2600 }], visa_profile_id: 'V010' },
  { destination_id: 'D029', country: 'Italy', city: 'Venice', theme: 'Romance & canals', best_for: ['Couples', 'Friends'], sample_nights: 3, starting_package_pp_inr: 87800, activity_menu: [{ name: 'Gondola ride', price: 4200 }, { name: 'Murano visit', price: 3200 }, { name: 'St Mark guided visit', price: 1800 }], visa_profile_id: 'V010' },
  { destination_id: 'D030', country: 'Spain', city: 'Barcelona', theme: 'City & beach', best_for: ['Friends', 'Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 88600, activity_menu: [{ name: 'Sagrada Familia', price: 3000 }, { name: 'Park Guell', price: 1800 }, { name: 'Camp Nou tour', price: 2400 }], visa_profile_id: 'V011' },
  { destination_id: 'D031', country: 'Netherlands', city: 'Amsterdam', theme: 'Leisure & culture', best_for: ['Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 83200, activity_menu: [{ name: 'Canal cruise', price: 2200 }, { name: 'Rijksmuseum', price: 2100 }, { name: 'Zaanse Schans day trip', price: 3200 }], visa_profile_id: 'V012' },
  { destination_id: 'D032', country: 'Hungary', city: 'Budapest', theme: 'Architecture & value', best_for: ['Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 68800, activity_menu: [{ name: 'Danube cruise', price: 2200 }, { name: 'Szechenyi Bath', price: 2600 }, { name: 'Buda Castle tour', price: 1800 }], visa_profile_id: 'V013' },
  { destination_id: 'D033', country: 'Czech Republic', city: 'Prague', theme: 'Fairytale city break', best_for: ['Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 70200, activity_menu: [{ name: 'Prague Castle', price: 1800 }, { name: 'Vltava cruise', price: 2100 }, { name: 'Beer spa', price: 3200 }], visa_profile_id: 'V014' },
  { destination_id: 'D034', country: 'Austria', city: 'Vienna', theme: 'Classical & elegant', best_for: ['Family', 'Couples'], sample_nights: 4, starting_package_pp_inr: 78600, activity_menu: [{ name: 'Schonbrunn Palace', price: 2200 }, { name: 'Classical concert', price: 4200 }, { name: 'Danube Valley trip', price: 5200 }], visa_profile_id: 'V015' },
  { destination_id: 'D035', country: 'Turkey', city: 'Istanbul', theme: 'Culture & shopping', best_for: ['Family', 'Couples', 'Friends'], sample_nights: 4, starting_package_pp_inr: 59800, activity_menu: [{ name: 'Bosphorus cruise', price: 2500 }, { name: 'Topkapi entry', price: 1600 }, { name: 'Turkish hamam', price: 3200 }], visa_profile_id: 'V016' },
  { destination_id: 'D036', country: 'Turkey', city: 'Cappadocia', theme: 'Adventure romance', best_for: ['Couples', 'Friends'], sample_nights: 3, starting_package_pp_inr: 64500, activity_menu: [{ name: 'Hot air balloon', price: 14800 }, { name: 'ATV sunset ride', price: 3200 }, { name: 'Green tour', price: 4200 }], visa_profile_id: 'V016' },
  { destination_id: 'D037', country: 'Georgia', city: 'Tbilisi', theme: 'Budget Europe feel', best_for: ['Friends', 'Couples'], sample_nights: 4, starting_package_pp_inr: 44800, activity_menu: [{ name: 'Old Town walk', price: 900 }, { name: 'Kazbegi day trip', price: 3200 }, { name: 'Wine tasting', price: 2800 }], visa_profile_id: 'V017' },
  { destination_id: 'D038', country: 'Azerbaijan', city: 'Baku', theme: 'Modern city break', best_for: ['Friends', 'Family'], sample_nights: 4, starting_package_pp_inr: 51200, activity_menu: [{ name: 'Gobustan tour', price: 3200 }, { name: 'Absheron trip', price: 2600 }, { name: 'Old city walk', price: 800 }], visa_profile_id: 'V018' },
  { destination_id: 'D039', country: 'Maldives', city: 'Maldives', theme: 'Luxury beach escape', best_for: ['Couples', 'Honeymooners'], sample_nights: 4, starting_package_pp_inr: 125000, activity_menu: [{ name: 'Snorkeling trip', price: 4800 }, { name: 'Spa', price: 6200 }, { name: 'Sunset cruise', price: 4200 }], visa_profile_id: 'V019' },
  { destination_id: 'D040', country: 'Mauritius', city: 'Mauritius', theme: 'Family beach holiday', best_for: ['Family', 'Couples'], sample_nights: 5, starting_package_pp_inr: 118000, activity_menu: [{ name: 'Ile aux Cerfs', price: 5200 }, { name: 'Submarine ride', price: 6800 }, { name: 'Casela Park', price: 4800 }], visa_profile_id: 'V020' },
];

// ─── 2. Flights (24 entries) ──────────────────────────────────────────────────

export const demoFlights: DemoFlight[] = [
  { flight_id: 'F001', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Goa', to_airport: 'GOX', airline: 'Air India', flight_no: 'AI882', travel_date: '2026-04-12', departure_time: '06:10', arrival_time: '08:45', duration: '2h35m', stops: 0, cabin: 'Economy', fare_inr: 6800, refundable: true, baggage: '15kg', meal: 'Snack', priority_checkin_available: true },
  { flight_id: 'F002', from_city: 'Mumbai', from_airport: 'BOM', to_city: 'Srinagar', to_airport: 'SXR', airline: 'IndiGo', flight_no: '6E6125', travel_date: '2026-04-18', departure_time: '09:20', arrival_time: '12:15', duration: '2h55m', stops: 0, cabin: 'Economy', fare_inr: 7200, refundable: false, baggage: '15kg', meal: 'Buy-on-board', priority_checkin_available: true },
  { flight_id: 'F003', from_city: 'Bengaluru', from_airport: 'BLR', to_city: 'Port Blair', to_airport: 'IXZ', airline: 'Air India Express', flight_no: 'IX2451', travel_date: '2026-05-02', departure_time: '05:55', arrival_time: '08:35', duration: '2h40m', stops: 0, cabin: 'Economy', fare_inr: 8900, refundable: false, baggage: '15kg', meal: 'Snack', priority_checkin_available: false },
  { flight_id: 'F004', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Jaipur', to_airport: 'JAI', airline: 'IndiGo', flight_no: '6E736', travel_date: '2026-04-09', departure_time: '11:40', arrival_time: '12:35', duration: '0h55m', stops: 0, cabin: 'Economy', fare_inr: 3100, refundable: false, baggage: '15kg', meal: 'No', priority_checkin_available: true },
  { flight_id: 'F005', from_city: 'Chennai', from_airport: 'MAA', to_city: 'Kochi', to_airport: 'COK', airline: 'Air India', flight_no: 'AI682', travel_date: '2026-04-16', departure_time: '07:15', arrival_time: '08:30', duration: '1h15m', stops: 0, cabin: 'Economy', fare_inr: 3600, refundable: true, baggage: '15kg', meal: 'Snack', priority_checkin_available: true },
  { flight_id: 'F006', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Kullu', to_airport: 'KUU', airline: 'Alliance Air', flight_no: '9I623', travel_date: '2026-04-21', departure_time: '06:40', arrival_time: '08:00', duration: '1h20m', stops: 0, cabin: 'Economy', fare_inr: 5400, refundable: false, baggage: '15kg', meal: 'No', priority_checkin_available: false },
  { flight_id: 'F007', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Leh', to_airport: 'IXL', airline: 'IndiGo', flight_no: '6E2017', travel_date: '2026-05-10', departure_time: '05:30', arrival_time: '06:50', duration: '1h20m', stops: 0, cabin: 'Economy', fare_inr: 6200, refundable: false, baggage: '15kg', meal: 'Buy-on-board', priority_checkin_available: true },
  { flight_id: 'F008', from_city: 'Bengaluru', from_airport: 'BLR', to_city: 'Dehradun', to_airport: 'DED', airline: 'Akasa Air', flight_no: 'QP1842', travel_date: '2026-04-25', departure_time: '08:10', arrival_time: '11:05', duration: '2h55m', stops: 0, cabin: 'Economy', fare_inr: 5900, refundable: false, baggage: '15kg', meal: 'Snack', priority_checkin_available: false },
  { flight_id: 'F009', from_city: 'Mumbai', from_airport: 'BOM', to_city: 'Dubai', to_airport: 'DXB', airline: 'Emirates', flight_no: 'EK501', travel_date: '2026-04-14', departure_time: '04:30', arrival_time: '06:05', duration: '3h05m', stops: 0, cabin: 'Economy', fare_inr: 19800, refundable: true, baggage: '25kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F010', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Bangkok', to_airport: 'BKK', airline: 'Thai Airways', flight_no: 'TG316', travel_date: '2026-04-15', departure_time: '23:30', arrival_time: '05:20', duration: '4h20m', stops: 0, cabin: 'Economy', fare_inr: 22400, refundable: true, baggage: '20kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F011', from_city: 'Mumbai', from_airport: 'BOM', to_city: 'Phuket', to_airport: 'HKT', airline: 'IndiGo', flight_no: '6E1073', travel_date: '2026-04-17', departure_time: '02:55', arrival_time: '08:40', duration: '4h15m', stops: 0, cabin: 'Economy', fare_inr: 20100, refundable: false, baggage: '20kg', meal: 'Buy-on-board', priority_checkin_available: true },
  { flight_id: 'F012', from_city: 'Chennai', from_airport: 'MAA', to_city: 'Singapore', to_airport: 'SIN', airline: 'Singapore Airlines', flight_no: 'SQ529', travel_date: '2026-04-19', departure_time: '23:15', arrival_time: '06:05', duration: '4h20m', stops: 0, cabin: 'Economy', fare_inr: 26800, refundable: true, baggage: '25kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F013', from_city: 'Bengaluru', from_airport: 'BLR', to_city: 'Bali', to_airport: 'DPS', airline: 'AirAsia', flight_no: 'AK52', travel_date: '2026-05-07', departure_time: '22:45', arrival_time: '09:50', duration: '8h35m', stops: 1, cabin: 'Economy', fare_inr: 28900, refundable: false, baggage: '20kg', meal: 'Meal', priority_checkin_available: false },
  { flight_id: 'F014', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Kuala Lumpur', to_airport: 'KUL', airline: 'Malaysia Airlines', flight_no: 'MH173', travel_date: '2026-04-22', departure_time: '13:15', arrival_time: '21:10', duration: '5h25m', stops: 0, cabin: 'Economy', fare_inr: 24100, refundable: true, baggage: '25kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F015', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Tokyo', to_airport: 'NRT', airline: 'Air India', flight_no: 'AI306', travel_date: '2026-05-15', departure_time: '20:20', arrival_time: '07:55', duration: '8h05m', stops: 0, cabin: 'Economy', fare_inr: 58600, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F016', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Seoul', to_airport: 'ICN', airline: 'Korean Air', flight_no: 'KE482', travel_date: '2026-05-18', departure_time: '19:05', arrival_time: '08:10', duration: '9h35m', stops: 1, cabin: 'Economy', fare_inr: 55200, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F017', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Paris', to_airport: 'CDG', airline: 'Air France', flight_no: 'AF225', travel_date: '2026-05-20', departure_time: '01:10', arrival_time: '07:05', duration: '9h25m', stops: 0, cabin: 'Economy', fare_inr: 61200, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F018', from_city: 'Mumbai', from_airport: 'BOM', to_city: 'Zurich', to_airport: 'ZRH', airline: 'SWISS', flight_no: 'LX155', travel_date: '2026-05-22', departure_time: '00:55', arrival_time: '06:20', duration: '8h55m', stops: 0, cabin: 'Economy', fare_inr: 64800, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F019', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Rome', to_airport: 'FCO', airline: 'ITA Airways', flight_no: 'AZ771', travel_date: '2026-05-24', departure_time: '03:20', arrival_time: '12:10', duration: '12h20m', stops: 1, cabin: 'Economy', fare_inr: 59800, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F020', from_city: 'Mumbai', from_airport: 'BOM', to_city: 'Amsterdam', to_airport: 'AMS', airline: 'KLM', flight_no: 'KL878', travel_date: '2026-05-26', departure_time: '02:25', arrival_time: '08:00', duration: '9h05m', stops: 0, cabin: 'Economy', fare_inr: 60400, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F021', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Budapest', to_airport: 'BUD', airline: 'Lufthansa', flight_no: 'LH761', travel_date: '2026-05-28', departure_time: '01:45', arrival_time: '11:40', duration: '13h25m', stops: 1, cabin: 'Economy', fare_inr: 57800, refundable: true, baggage: '23kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F022', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Istanbul', to_airport: 'IST', airline: 'Turkish Airlines', flight_no: 'TK717', travel_date: '2026-05-12', departure_time: '06:55', arrival_time: '11:10', duration: '6h45m', stops: 0, cabin: 'Economy', fare_inr: 36400, refundable: true, baggage: '30kg', meal: 'Meal', priority_checkin_available: true },
  { flight_id: 'F023', from_city: 'Delhi', from_airport: 'DEL', to_city: 'Tbilisi', to_airport: 'TBS', airline: 'Air Arabia', flight_no: 'G9511', travel_date: '2026-05-14', departure_time: '18:35', arrival_time: '02:10', duration: '9h05m', stops: 1, cabin: 'Economy', fare_inr: 29200, refundable: false, baggage: '20kg', meal: 'Meal', priority_checkin_available: false },
  { flight_id: 'F024', from_city: 'Mumbai', from_airport: 'BOM', to_city: 'Maldives', to_airport: 'MLE', airline: 'IndiGo', flight_no: '6E1131', travel_date: '2026-05-16', departure_time: '08:25', arrival_time: '11:10', duration: '2h15m', stops: 0, cabin: 'Economy', fare_inr: 28400, refundable: false, baggage: '20kg', meal: 'Buy-on-board', priority_checkin_available: true },
];

// ─── 3. Hotels (12 entries) ───────────────────────────────────────────────────

export const demoHotels: DemoHotel[] = [
  { hotel_id: 'H001', country: 'India', city: 'Goa', hotel_name: 'ibis Styles Goa Calangute', segment_star_demo: 3, room_type: 'Standard Queen', board_type: 'Breakfast', nightly_rate_inr: 5200, early_checkin_available: true, early_checkin_fee_inr: 1200, priority_checkin_available: true, priority_checkin_fee_inr: 600, free_cancellation_until: '72h before check-in', highlights: ['Near Calangute belt', 'Good for couples and friends', 'Value stay'] },
  { hotel_id: 'H002', country: 'India', city: 'Goa', hotel_name: 'Fairfield by Marriott Goa Anjuna', segment_star_demo: 4, room_type: 'Deluxe Room', board_type: 'Breakfast', nightly_rate_inr: 8600, early_checkin_available: true, early_checkin_fee_inr: 1800, priority_checkin_available: true, priority_checkin_fee_inr: 900, free_cancellation_until: '72h before check-in', highlights: ['Anjuna side access', 'Reliable chain stay', 'Pool and breakfast'] },
  { hotel_id: 'H003', country: 'India', city: 'Goa', hotel_name: 'Grand Hyatt Goa', segment_star_demo: 5, room_type: 'King Garden View', board_type: 'Breakfast', nightly_rate_inr: 16800, early_checkin_available: true, early_checkin_fee_inr: 3500, priority_checkin_available: true, priority_checkin_fee_inr: 1500, free_cancellation_until: '5 days before check-in', highlights: ['Premium resort feel', 'Family friendly', 'Large property'] },
  { hotel_id: 'H004', country: 'UAE', city: 'Dubai', hotel_name: 'Rove Downtown Dubai', segment_star_demo: 3, room_type: 'Standard Room', board_type: 'Room Only', nightly_rate_inr: 7800, early_checkin_available: true, early_checkin_fee_inr: 1800, priority_checkin_available: true, priority_checkin_fee_inr: 800, free_cancellation_until: '48h before check-in', highlights: ['Close to Downtown', 'Modern value hotel', 'Good for city stays'] },
  { hotel_id: 'H005', country: 'UAE', city: 'Dubai', hotel_name: 'Hilton Garden Inn Dubai Al Mina', segment_star_demo: 4, room_type: 'King Room', board_type: 'Breakfast', nightly_rate_inr: 9800, early_checkin_available: true, early_checkin_fee_inr: 2200, priority_checkin_available: true, priority_checkin_fee_inr: 950, free_cancellation_until: '48h before check-in', highlights: ['Business + leisure balance', 'Reliable chain', 'Good transport access'] },
  { hotel_id: 'H006', country: 'UAE', city: 'Dubai', hotel_name: 'Taj Dubai', segment_star_demo: 5, room_type: 'Luxury Burj View', board_type: 'Breakfast', nightly_rate_inr: 19800, early_checkin_available: true, early_checkin_fee_inr: 4500, priority_checkin_available: true, priority_checkin_fee_inr: 1800, free_cancellation_until: '5 days before check-in', highlights: ['Near Downtown', 'Premium service', 'Luxury city experience'] },
  { hotel_id: 'H007', country: 'Hungary', city: 'Budapest', hotel_name: 'ibis Styles Budapest Airport', segment_star_demo: 3, room_type: 'Standard Twin', board_type: 'Breakfast', nightly_rate_inr: 7400, early_checkin_available: true, early_checkin_fee_inr: 1600, priority_checkin_available: true, priority_checkin_fee_inr: 700, free_cancellation_until: '48h before check-in', highlights: ['Airport convenience', 'Quick layover option', 'Simple modern rooms'] },
  { hotel_id: 'H008', country: 'Hungary', city: 'Budapest', hotel_name: 'Novotel Budapest Danube', segment_star_demo: 4, room_type: 'Superior Room', board_type: 'Breakfast', nightly_rate_inr: 11200, early_checkin_available: true, early_checkin_fee_inr: 2400, priority_checkin_available: true, priority_checkin_fee_inr: 1000, free_cancellation_until: '72h before check-in', highlights: ['Danube-facing location', 'Strong value', 'Business + leisure'] },
  { hotel_id: 'H009', country: 'Hungary', city: 'Budapest', hotel_name: 'Anantara New York Palace Budapest', segment_star_demo: 5, room_type: 'Deluxe Room', board_type: 'Breakfast', nightly_rate_inr: 22400, early_checkin_available: true, early_checkin_fee_inr: 4800, priority_checkin_available: true, priority_checkin_fee_inr: 1800, free_cancellation_until: '5 days before check-in', highlights: ['Iconic interiors', 'Luxury stay', 'Special occasion favorite'] },
  { hotel_id: 'H010', country: 'Luxembourg', city: 'Luxembourg City', hotel_name: 'ibis Styles Luxembourg Centre Gare', segment_star_demo: 3, room_type: 'Standard Double', board_type: 'Breakfast', nightly_rate_inr: 8600, early_checkin_available: true, early_checkin_fee_inr: 1800, priority_checkin_available: true, priority_checkin_fee_inr: 700, free_cancellation_until: '48h before check-in', highlights: ['Good rail access', 'Compact city stay', 'Budget-friendly Europe'] },
  { hotel_id: 'H011', country: 'Luxembourg', city: 'Luxembourg City', hotel_name: 'Novotel Luxembourg Centre', segment_star_demo: 4, room_type: 'Superior Room', board_type: 'Breakfast', nightly_rate_inr: 13800, early_checkin_available: true, early_checkin_fee_inr: 2600, priority_checkin_available: true, priority_checkin_fee_inr: 1100, free_cancellation_until: '72h before check-in', highlights: ['Central access', 'Family-friendly rooms', 'Reliable chain'] },
  { hotel_id: 'H012', country: 'Luxembourg', city: 'Luxembourg City', hotel_name: 'Sofitel Luxembourg Europe', segment_star_demo: 5, room_type: 'Luxury King', board_type: 'Breakfast', nightly_rate_inr: 24800, early_checkin_available: true, early_checkin_fee_inr: 5000, priority_checkin_available: true, priority_checkin_fee_inr: 1900, free_cancellation_until: '5 days before check-in', highlights: ['Premium district stay', 'Luxury business-leisure', 'High service quality'] },
];

// ─── 4. Add-Ons (8 entries) ───────────────────────────────────────────────────

export const demoAddOns: DemoAddOn[] = [
  { add_on_id: 'A001', add_on_name: 'Private airport pickup', scope: 'Airport transfer', price_inr: 1600, pricing_unit: 'per booking', availability_rule: 'Domestic and international cities with airport transfer support', bot_trigger: 'pickup|airport pickup|arrival transfer', description: 'Driver pickup from airport to hotel with meet point details' },
  { add_on_id: 'A002', add_on_name: 'Private airport drop-off', scope: 'Airport transfer', price_inr: 1500, pricing_unit: 'per booking', availability_rule: 'Domestic and international cities with airport transfer support', bot_trigger: 'drop|drop-off|departure transfer', description: 'Private transfer from hotel to airport' },
  { add_on_id: 'A003', add_on_name: 'Early morning pickup', scope: 'Airport transfer', price_inr: 600, pricing_unit: 'per booking', availability_rule: 'Applied on pickups between 00:00 and 06:00', bot_trigger: 'early pickup|late night arrival', description: 'Night surcharge for odd-hour transfer' },
  { add_on_id: 'A004', add_on_name: 'Priority hotel check-in', scope: 'Hotel service', price_inr: 900, pricing_unit: 'per room', availability_rule: 'Only if selected hotel has priority_checkin_available = Yes', bot_trigger: 'priority checkin|faster check-in', description: 'Fast-track front desk request' },
  { add_on_id: 'A005', add_on_name: 'Early hotel check-in', scope: 'Hotel service', price_inr: 1800, pricing_unit: 'per room', availability_rule: 'Only if selected hotel has early_checkin_available = Yes', bot_trigger: 'early check-in|check-in before time', description: 'Subject to room availability; fee varies by hotel' },
  { add_on_id: 'A006', add_on_name: 'Visa documentation assistance', scope: 'Visa support', price_inr: 2500, pricing_unit: 'per traveler', availability_rule: 'International destinations only', bot_trigger: 'visa help|visa support|document check', description: 'Checklist review and appointment guidance' },
  { add_on_id: 'A007', add_on_name: 'Travel insurance', scope: 'Protection', price_inr: 1200, pricing_unit: 'per traveler', availability_rule: 'Domestic or international', bot_trigger: 'insurance|travel protection', description: 'Basic trip protection cover for demo purposes' },
  { add_on_id: 'A008', add_on_name: 'Airport lounge access', scope: 'Airport service', price_inr: 2200, pricing_unit: 'per traveler', availability_rule: 'Selected airports and airlines only', bot_trigger: 'lounge|airport lounge', description: 'Single-visit lounge access' },
];

// ─── 5. Visa Profiles (21 entries) ───────────────────────────────────────────

export const demoVisaProfiles: DemoVisaProfile[] = [
  { visa_profile_id: 'V000', country_or_region: 'India domestic', visa_mode_demo: 'No visa', turnaround_days_demo: '0', bot_question: 'No visa is needed. Shall I continue with flights, hotel, and activities?', documents_required_demo: ['Government ID for hotel check-in'], if_pending_bot_reply: 'No visa step needed for domestic travel.', if_approved_bot_reply: "Great, I'll continue with package building." },
  { visa_profile_id: 'V001', country_or_region: 'UAE', visa_mode_demo: 'Pre-approved visa / sponsor / travel rule check', turnaround_days_demo: '3-7', bot_question: 'For Dubai/Abu Dhabi, do all travellers already have visa approval or a valid eligible entry status?', documents_required_demo: ['Passport', 'photo', 'return ticket', 'hotel booking', 'financial proof (if asked)'], if_pending_bot_reply: "No problem. I can still prepare the package, but I'll mark it as visa-pending and keep visa assistance as an add-on.", if_approved_bot_reply: "Perfect. I'll proceed with flight, hotel, and activity options." },
  { visa_profile_id: 'V002', country_or_region: 'Thailand', visa_mode_demo: 'Check latest entry rule', turnaround_days_demo: '2-5', bot_question: 'Before I confirm Thailand options, have all travellers completed the required visa or entry approval step for your travel dates?', documents_required_demo: ['Passport', 'photo', 'hotel booking', 'return flight', 'fund proof if required'], if_pending_bot_reply: "I'll continue with package planning and keep a visa reminder in your trip summary.", if_approved_bot_reply: "Great, I'll show the best package options now." },
  { visa_profile_id: 'V003', country_or_region: 'Singapore', visa_mode_demo: 'Pre-travel entry check', turnaround_days_demo: '3-7', bot_question: 'For Singapore, do you already have valid visa approval or eligible travel documents for every traveller?', documents_required_demo: ['Passport', 'photo', 'itinerary', 'return ticket', 'hotel proof'], if_pending_bot_reply: "I'll proceed with package search and flag visa approval as pending.", if_approved_bot_reply: "Perfect. I'll continue with hotels, flights, and attractions." },
  { visa_profile_id: 'V004', country_or_region: 'Indonesia', visa_mode_demo: 'Check visa / VOA eligibility', turnaround_days_demo: '1-5', bot_question: 'For Bali, should I assume visa/entry approval is already sorted for all travellers?', documents_required_demo: ['Passport', 'photo', 'return ticket', 'hotel booking'], if_pending_bot_reply: "I can still build the package and keep the visa step pending.", if_approved_bot_reply: "Got it. I'll continue with your Bali package." },
  { visa_profile_id: 'V005', country_or_region: 'Malaysia', visa_mode_demo: 'Check latest entry rule', turnaround_days_demo: '1-5', bot_question: 'Before I lock Malaysia options, are the travellers visa-ready for these dates?', documents_required_demo: ['Passport', 'return ticket', 'hotel booking', 'supporting financials if asked'], if_pending_bot_reply: "I'll keep the package flexible and mark visa status as pending.", if_approved_bot_reply: "Understood. Proceeding with your Kuala Lumpur package." },
  { visa_profile_id: 'V006', country_or_region: 'Japan', visa_mode_demo: 'Consulate / pre-approved visa workflow', turnaround_days_demo: '5-10', bot_question: 'For Japan, have all travellers received visa approval already?', documents_required_demo: ['Passport', 'photo', 'bank statement', 'leave proof', 'itinerary', 'hotel and flight plan'], if_pending_bot_reply: "I can build the package first and keep the booking flow on hold until visa approval.", if_approved_bot_reply: "Excellent. I'll now show Tokyo and Kyoto options." },
  { visa_profile_id: 'V007', country_or_region: 'South Korea', visa_mode_demo: 'Consulate / pre-approved visa workflow', turnaround_days_demo: '5-10', bot_question: 'For South Korea, do you want me to continue assuming visa approval is already in place?', documents_required_demo: ['Passport', 'photo', 'financial proof', 'itinerary', 'hotel booking'], if_pending_bot_reply: "No issue. I'll continue the package search and mark visa approval as pending.", if_approved_bot_reply: "Great. I'll continue with your Seoul package." },
  { visa_profile_id: 'V008', country_or_region: 'France / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Paris or other Schengen cities, do all travellers already have a valid Schengen visa for these dates?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'bank proof', 'hotel booking', 'flight itinerary'], if_pending_bot_reply: "I can still prepare the package and quote, but booking should be confirmed after visa approval.", if_approved_bot_reply: "Perfect. I'll continue with your Europe package." },
  { visa_profile_id: 'V009', country_or_region: 'Switzerland / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Switzerland, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'bank proof', 'trip plan'], if_pending_bot_reply: "I'll keep this as a visa-pending package and continue the planning side.", if_approved_bot_reply: "Great. I'll continue with Zurich and Lucerne options." },
  { visa_profile_id: 'V010', country_or_region: 'Italy / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Italy, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'financial proof', 'itinerary'], if_pending_bot_reply: "I can continue the package design and mark visa as pending.", if_approved_bot_reply: "Perfect. Let me show Rome and Venice options." },
  { visa_profile_id: 'V011', country_or_region: 'Spain / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Spain, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'financial proof', 'trip plan'], if_pending_bot_reply: "I'll continue with package planning and keep visa follow-up open.", if_approved_bot_reply: "Great. Proceeding with Barcelona options." },
  { visa_profile_id: 'V012', country_or_region: 'Netherlands / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Amsterdam, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'bank proof', 'trip itinerary'], if_pending_bot_reply: "I'll continue with the trip quote and leave visa as pending.", if_approved_bot_reply: "Perfect. I'll continue with Amsterdam packages." },
  { visa_profile_id: 'V013', country_or_region: 'Hungary / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Budapest, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'bank statement', 'hotel and flight plan'], if_pending_bot_reply: "I'll prepare the quote and keep visa status pending.", if_approved_bot_reply: "Great. I'll continue with Budapest package options." },
  { visa_profile_id: 'V014', country_or_region: 'Czech Republic / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Prague, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'itinerary', 'financial proof'], if_pending_bot_reply: "I'll continue the search and keep visa approval marked as pending.", if_approved_bot_reply: "Perfect. Proceeding with Prague package options." },
  { visa_profile_id: 'V015', country_or_region: 'Austria / Schengen region', visa_mode_demo: 'Schengen visa workflow', turnaround_days_demo: '10-20', bot_question: 'For Vienna, do all travellers already hold a valid Schengen visa?', documents_required_demo: ['Passport', 'photo', 'travel insurance', 'bank proof', 'travel plan'], if_pending_bot_reply: "I can continue with planning while keeping visa follow-up open.", if_approved_bot_reply: "Great. I'll show Vienna options." },
  { visa_profile_id: 'V016', country_or_region: 'Turkey', visa_mode_demo: 'Check latest visa / e-visa path', turnaround_days_demo: '3-7', bot_question: 'For Turkey, do all travellers already have the required visa or eligible entry approval for your passport type?', documents_required_demo: ['Passport', 'photo', 'hotel booking', 'return ticket'], if_pending_bot_reply: "I'll keep this package in visa-pending mode and continue planning.", if_approved_bot_reply: "Perfect. Let me show Istanbul and Cappadocia options." },
  { visa_profile_id: 'V017', country_or_region: 'Georgia', visa_mode_demo: 'Check latest passport / visa path', turnaround_days_demo: '1-5', bot_question: 'For Georgia, should I proceed assuming all travellers meet the latest entry requirements?', documents_required_demo: ['Passport', 'return ticket', 'hotel booking'], if_pending_bot_reply: "I'll continue with the package and leave entry approval as pending.", if_approved_bot_reply: "Great. Proceeding with Tbilisi options." },
  { visa_profile_id: 'V018', country_or_region: 'Azerbaijan', visa_mode_demo: 'E-visa / pre-travel approval check', turnaround_days_demo: '3-5', bot_question: 'For Baku, do all travellers already have the required e-visa or travel approval?', documents_required_demo: ['Passport', 'photo', 'hotel booking', 'return ticket'], if_pending_bot_reply: "I'll continue with planning and leave the visa step pending.", if_approved_bot_reply: "Perfect. I'll continue with Baku package options." },
  { visa_profile_id: 'V019', country_or_region: 'Maldives', visa_mode_demo: 'Check latest entry / arrival rules', turnaround_days_demo: '1-3', bot_question: 'For Maldives, should I proceed assuming all required entry approvals are in place?', documents_required_demo: ['Passport', 'return ticket', 'resort booking', 'health declaration if needed'], if_pending_bot_reply: "I'll continue with the package and keep entry approval as a pending reminder.", if_approved_bot_reply: "Great. I'll continue with your Maldives package." },
  { visa_profile_id: 'V020', country_or_region: 'Mauritius', visa_mode_demo: 'Check latest entry / visa rule', turnaround_days_demo: '1-5', bot_question: 'For Mauritius, do all travellers meet the current entry requirement for your travel dates?', documents_required_demo: ['Passport', 'hotel booking', 'return ticket', 'fund proof if asked'], if_pending_bot_reply: "I'll continue planning and mark entry approval as pending.", if_approved_bot_reply: "Perfect. Proceeding with Mauritius options." },
];

// ─── Helper Functions ──────────────────────────────────────────────────────────

/** Find destination by city name — case-insensitive, partial match */
export function findDemoDestination(city: string): DemoDestination | null {
  const lower = city.toLowerCase().trim();
  return (
    demoDestinations.find(d => d.city.toLowerCase() === lower) ??
    demoDestinations.find(d => lower.includes(d.city.toLowerCase()) || d.city.toLowerCase().includes(lower)) ??
    null
  );
}

/** Find flights to a city (any origin) */
export function findDemoFlights(toCity: string): DemoFlight[] {
  const lower = toCity.toLowerCase().trim();
  // Direct match
  const direct = demoFlights.filter(f =>
    f.to_city.toLowerCase().includes(lower) || lower.includes(f.to_city.toLowerCase())
  );
  if (direct.length) return direct;
  // Country-level match (e.g. "Krabi" → Thailand flights)
  const dest = findDemoDestination(toCity);
  if (dest) {
    return demoFlights.filter(f => {
      const matchDest = demoDestinations.find(d =>
        f.to_city.toLowerCase().includes(d.city.toLowerCase()) && d.country === dest.country
      );
      return !!matchDest;
    });
  }
  return [];
}

/** Find hotels for a city */
export function findDemoHotels(city: string): DemoHotel[] {
  const lower = city.toLowerCase().trim();
  return demoHotels.filter(h =>
    h.city.toLowerCase().includes(lower) || lower.includes(h.city.toLowerCase())
  );
}

/** Get visa profile by ID */
export function getVisaProfile(visaProfileId: string): DemoVisaProfile | null {
  return demoVisaProfiles.find(v => v.visa_profile_id === visaProfileId) ?? null;
}

/** Get visa profile for a city */
export function getVisaProfileForCity(city: string): DemoVisaProfile | null {
  const dest = findDemoDestination(city);
  if (!dest) return null;
  return getVisaProfile(dest.visa_profile_id);
}

/** Build a compact context string for Gemini prompt injection */
export function buildDestinationContext(city: string): string {
  const dest = findDemoDestination(city);
  if (!dest) return '';

  const activities = dest.activity_menu
    .slice(0, 3)
    .map(a => `${a.name} ₹${(a.price / 1000).toFixed(1)}k`)
    .join(', ');

  const flights = findDemoFlights(city);
  const cheapestFlight = flights.length
    ? `₹${(Math.min(...flights.map(f => f.fare_inr)) / 1000).toFixed(1)}k pp`
    : 'varies';

  const hotels = findDemoHotels(city);
  const hotelRange = hotels.length
    ? `₹${(Math.min(...hotels.map(h => h.nightly_rate_inr)) / 1000).toFixed(1)}k–₹${(Math.max(...hotels.map(h => h.nightly_rate_inr)) / 1000).toFixed(1)}k/night`
    : 'varies';

  const visa = getVisaProfile(dest.visa_profile_id);
  const visaInfo = visa?.visa_profile_id === 'V000'
    ? 'No visa required'
    : `${visa?.visa_mode_demo ?? 'Visa check needed'} (${visa?.turnaround_days_demo ?? '?'} days)`;

  return `${dest.city}, ${dest.country} | Theme: ${dest.theme} | Land pkg from ₹${(dest.starting_package_pp_inr / 1000).toFixed(1)}k pp (${dest.sample_nights}N) | Flights: ${cheapestFlight} | Hotels: ${hotelRange} | Activities: ${activities} | Visa: ${visaInfo}`;
}

/** Calculate cost breakup */
export function calculatePackageCost(params: {
  destination: string;
  nights: number;
  adults: number;
  hotelStar?: number;    // 3, 4, or 5
  activityCount?: number; // how many activities to include
  includePickup?: boolean;
  includePriorityCheckin?: boolean;
  includeInsurance?: boolean;
}): { flights: number; hotel: number; activities: number; addOns: number; total: number; breakdown: string[] } {
  const { destination, nights, adults, hotelStar = 4, activityCount = 2, includePickup = true, includePriorityCheckin = false, includeInsurance = false } = params;

  const dest = findDemoDestination(destination);
  const flights = findDemoFlights(destination);
  const hotels = findDemoHotels(destination);

  // Flight cost
  let farePerPerson = 0;
  if (flights.length) {
    const sorted = [...flights].sort((a, b) => a.fare_inr - b.fare_inr);
    const tierIdx = hotelStar === 5 ? sorted.length - 1 : hotelStar === 3 ? 0 : Math.floor(sorted.length / 2);
    farePerPerson = sorted[Math.min(tierIdx, sorted.length - 1)]?.fare_inr ?? 0;
  } else if (dest) {
    // Synthesize from starting price (flights ≈ 35% of land pkg)
    farePerPerson = Math.round(dest.starting_package_pp_inr * 0.35);
  }
  const flightsCost = farePerPerson * 2 * adults; // round trip × adults

  // Hotel cost
  let nightlyRate = 0;
  if (hotels.length) {
    const byStars = hotels.filter(h => h.segment_star_demo === hotelStar);
    const pool = byStars.length ? byStars : hotels;
    nightlyRate = Math.round(pool.reduce((s, h) => s + h.nightly_rate_inr, 0) / pool.length);
  } else if (dest) {
    // Synthesize from starting price (hotel ≈ 45% of land pkg per night)
    nightlyRate = Math.round(dest.starting_package_pp_inr * 0.45 / dest.sample_nights);
  }
  const hotelCost = nightlyRate * nights;

  // Activities cost
  const activities = dest?.activity_menu.slice(0, activityCount) ?? [];
  const activitiesCost = activities.reduce((s, a) => s + a.price * adults, 0);

  // Add-ons
  let addOnsCost = 0;
  const breakdown: string[] = [];

  if (flightsCost > 0) breakdown.push(`Flights (${farePerPerson > 0 ? `₹${(farePerPerson / 1000).toFixed(1)}k × 2 × ${adults}` : 'estimate'}): ₹${flightsCost.toLocaleString('en-IN')}`);
  if (hotelCost > 0) breakdown.push(`Hotel (₹${(nightlyRate / 1000).toFixed(1)}k × ${nights} nights): ₹${hotelCost.toLocaleString('en-IN')}`);
  if (activitiesCost > 0) {
    activities.forEach(a => breakdown.push(`${a.name} (×${adults}): ₹${(a.price * adults).toLocaleString('en-IN')}`));
  }

  if (includePickup) {
    addOnsCost += 1600 + 1500; // pickup + drop
    breakdown.push('Airport pickup + drop: ₹3,100');
  }
  if (includePriorityCheckin) {
    addOnsCost += 900;
    breakdown.push('Priority check-in: ₹900');
  }
  if (includeInsurance) {
    addOnsCost += 1200 * adults;
    breakdown.push(`Travel insurance (×${adults}): ₹${(1200 * adults).toLocaleString('en-IN')}`);
  }

  const total = flightsCost + hotelCost + activitiesCost + addOnsCost;
  breakdown.push(`**Total: ₹${total.toLocaleString('en-IN')}**`);

  return { flights: flightsCost, hotel: hotelCost, activities: activitiesCost, addOns: addOnsCost, total, breakdown };
}

/** Emoji map for destination themes */
const DEST_EMOJI: Record<string, string> = {
  'Beach': '🏖️', 'beach': '🏖️', 'Snow': '🏔️', 'snow': '🏔️',
  'Heritage': '🏯', 'heritage': '🏯', 'Hills': '⛰️', 'hills': '⛰️',
  'Adventure': '🧗', 'adventure': '🧗', 'Luxury': '✨', 'luxury': '✨',
  'Culture': '🎭', 'culture': '🎭', 'Romance': '💑', 'romance': '💑',
  'Family': '👨‍👩‍👧', 'Shopping': '🛍️', 'Honeymoon': '💍',
  'Island': '🏝️', 'island': '🏝️', 'Backwater': '🚣', 'Scenic': '🌄',
  'City': '🌆', 'city': '🌆', 'Premium': '🌟', 'premium': '🌟',
  'Budget': '💰', 'Nature': '🌿', 'Fairytale': '🏰',
};

export function getDestEmoji(theme: string): string {
  for (const [key, emoji] of Object.entries(DEST_EMOJI)) {
    if (theme.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return '✈️';
}
