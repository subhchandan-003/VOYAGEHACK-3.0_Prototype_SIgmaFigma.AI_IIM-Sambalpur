/**
 * Visual Search Landmark Database
 * ================================
 * Comprehensive database of landmarks, natural wonders, and destinations
 * used by the image-to-text visual search feature. Each entry maps a
 * recognized place to travel suggestions (hotels, activities, logistics).
 */

export interface LandmarkEntry {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  city: string;
  country: string;
  continent: string;
  description: string;
  funFact: string;
  bestTime: string;
  avgBudget: number; // per person INR
  flightFromDelhi: string;
  visaRequired: boolean;
  visaType?: string;
  nearbyAttractions: string[];
  suggestedHotels: { name: string; stars: number; pricePerNight: number; area: string }[];
  suggestedActivities: { name: string; duration: string; price: number; type: string }[];
  travelTips: string[];
  tags: string[];
  similarDestinations: string[];
  confidence?: number;
  matchReason?: string;
}

export const landmarkDatabase: LandmarkEntry[] = [
  // ── ARCHITECTURE & STRUCTURES ──────────────────────────────
  {
    id: 'eiffel-tower', name: 'Eiffel Tower', category: 'Architecture', subcategory: 'Monument',
    city: 'Paris', country: 'France', continent: 'Europe',
    description: 'Iconic iron lattice tower on the Champ de Mars, built in 1889 for the World\'s Fair. Standing 330m tall, it\'s the most-visited paid monument in the world.',
    funFact: 'The tower grows about 15cm taller in summer due to thermal expansion of the iron.',
    bestTime: 'Apr - Jun, Sep - Oct', avgBudget: 125000, flightFromDelhi: '9h 00m', visaRequired: true, visaType: 'Schengen',
    nearbyAttractions: ['Louvre Museum', 'Arc de Triomphe', 'Seine River Cruise', 'Montmartre', 'Champs-Élysées'],
    suggestedHotels: [
      { name: 'Hôtel Plaza Athénée', stars: 5, pricePerNight: 45000, area: 'Avenue Montaigne' },
      { name: 'Pullman Paris Tour Eiffel', stars: 4, pricePerNight: 18000, area: 'Champ de Mars' },
      { name: 'Mercure Paris Centre', stars: 3, pricePerNight: 9500, area: 'Marais' },
    ],
    suggestedActivities: [
      { name: 'Eiffel Tower Summit Access', duration: '2 hours', price: 2500, type: 'Sightseeing' },
      { name: 'Seine River Dinner Cruise', duration: '3 hours', price: 8000, type: 'Romantic' },
      { name: 'Louvre Museum Guided Tour', duration: '3 hours', price: 5000, type: 'Cultural' },
      { name: 'Montmartre Walking Tour', duration: '2.5 hours', price: 3000, type: 'Walking' },
    ],
    travelTips: ['Book Eiffel Tower tickets 2 months ahead', 'Metro is the fastest way around Paris', 'Try crêpes from street vendors near the tower'],
    tags: ['romantic', 'iconic', 'city', 'europe', 'monument', 'night-views'],
    similarDestinations: ['London Eye', 'Statue of Liberty', 'Tokyo Tower', 'Burj Khalifa'],
  },
  {
    id: 'taj-mahal', name: 'Taj Mahal', category: 'Architecture', subcategory: 'Monument',
    city: 'Agra', country: 'India', continent: 'Asia',
    description: 'White marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal. A UNESCO World Heritage Site and one of the New 7 Wonders.',
    funFact: 'The Taj Mahal changes color depending on the time of day — pinkish at dawn, white during day, and golden under moonlight.',
    bestTime: 'Oct - Mar', avgBudget: 15000, flightFromDelhi: '0h (3h drive)', visaRequired: false,
    nearbyAttractions: ['Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh', 'Itimad-ud-Daulah', 'Jaipur (4h drive)'],
    suggestedHotels: [
      { name: 'The Oberoi Amarvilas', stars: 5, pricePerNight: 35000, area: 'Taj East Gate' },
      { name: 'ITC Mughal', stars: 5, pricePerNight: 12000, area: 'Fatehabad Road' },
      { name: 'Crystal Sarovar Premiere', stars: 4, pricePerNight: 5500, area: 'Fatehabad Road' },
    ],
    suggestedActivities: [
      { name: 'Taj Mahal Sunrise Tour', duration: '3 hours', price: 2000, type: 'Heritage' },
      { name: 'Agra Fort Heritage Walk', duration: '2 hours', price: 1500, type: 'Heritage' },
      { name: 'Mughal Cooking Class', duration: '3 hours', price: 2500, type: 'Culinary' },
      { name: 'Fatehpur Sikri Day Trip', duration: '5 hours', price: 3000, type: 'Historical' },
    ],
    travelTips: ['Visit at sunrise for best photos and fewer crowds', 'Taj is closed on Fridays', 'Gatiman Express from Delhi is the fastest train'],
    tags: ['heritage', 'romantic', 'india', 'monument', 'unesco', 'wonder'],
    similarDestinations: ['Amber Fort Jaipur', 'Humayun\'s Tomb Delhi', 'Mysore Palace', 'Hawa Mahal'],
  },
  {
    id: 'colosseum', name: 'Colosseum', category: 'Architecture', subcategory: 'Ancient Ruins',
    city: 'Rome', country: 'Italy', continent: 'Europe',
    description: 'The largest ancient amphitheatre ever built, constructed 70-80 AD. Could hold 50,000-80,000 spectators for gladiatorial contests.',
    funFact: 'The Colosseum had a retractable awning called the "velarium" operated by sailors to shade spectators.',
    bestTime: 'Apr - Jun, Sep - Oct', avgBudget: 120000, flightFromDelhi: '9h 30m', visaRequired: true, visaType: 'Schengen',
    nearbyAttractions: ['Roman Forum', 'Vatican City', 'Trevi Fountain', 'Pantheon', 'Sistine Chapel'],
    suggestedHotels: [
      { name: 'Hotel de Russie', stars: 5, pricePerNight: 40000, area: 'Piazza del Popolo' },
      { name: 'Palazzo Manfredi', stars: 5, pricePerNight: 32000, area: 'Colosseum View' },
      { name: 'Hotel Artemide', stars: 4, pricePerNight: 14000, area: 'Via Nazionale' },
    ],
    suggestedActivities: [
      { name: 'Colosseum Underground Tour', duration: '3 hours', price: 5500, type: 'Heritage' },
      { name: 'Vatican Museums & Sistine Chapel', duration: '4 hours', price: 6000, type: 'Art & Culture' },
      { name: 'Trastevere Food Walking Tour', duration: '3 hours', price: 4500, type: 'Culinary' },
      { name: 'Rome by Vespa Tour', duration: '3 hours', price: 5000, type: 'Adventure' },
    ],
    travelTips: ['Buy skip-the-line tickets online', 'Wear comfortable walking shoes', 'Aperitivo hour (6-8pm) offers free snacks with drinks'],
    tags: ['ancient', 'heritage', 'europe', 'ruins', 'unesco', 'wonder', 'history'],
    similarDestinations: ['Petra', 'Acropolis Athens', 'Pompeii', 'Ephesus'],
  },
  {
    id: 'machu-picchu', name: 'Machu Picchu', category: 'Historical', subcategory: 'Ancient City',
    city: 'Cusco', country: 'Peru', continent: 'South America',
    description: '15th-century Inca citadel set high in the Andes Mountains at 2,430m. Rediscovered in 1911 by Hiram Bingham.',
    funFact: 'No wheels, iron tools, or mortar were used to build the city, yet the stones fit so precisely that a knife blade cannot fit between them.',
    bestTime: 'May - Sep', avgBudget: 180000, flightFromDelhi: '24h+', visaRequired: false,
    nearbyAttractions: ['Sacred Valley', 'Rainbow Mountain', 'Cusco Old Town', 'Ollantaytambo', 'Lake Titicaca'],
    suggestedHotels: [
      { name: 'Belmond Sanctuary Lodge', stars: 5, pricePerNight: 55000, area: 'Machu Picchu Gate' },
      { name: 'Inkaterra Machu Picchu', stars: 5, pricePerNight: 25000, area: 'Aguas Calientes' },
      { name: 'Casa del Sol', stars: 4, pricePerNight: 12000, area: 'Aguas Calientes' },
    ],
    suggestedActivities: [
      { name: 'Inca Trail 4-Day Trek', duration: '4 days', price: 45000, type: 'Trekking' },
      { name: 'Huayna Picchu Climb', duration: '3 hours', price: 3000, type: 'Hiking' },
      { name: 'Sacred Valley Full Day Tour', duration: '10 hours', price: 5000, type: 'Cultural' },
      { name: 'Rainbow Mountain Trek', duration: '12 hours', price: 4000, type: 'Hiking' },
    ],
    travelTips: ['Acclimatize in Cusco (3,400m) for 2 days before trekking', 'Book Inca Trail 6 months ahead', 'Coca tea helps with altitude sickness'],
    tags: ['ancient', 'trekking', 'mountains', 'unesco', 'wonder', 'south-america', 'adventure'],
    similarDestinations: ['Chichen Itza', 'Angkor Wat', 'Petra', 'Tikal'],
  },
  {
    id: 'great-wall', name: 'Great Wall of China', category: 'Architecture', subcategory: 'Monument',
    city: 'Beijing', country: 'China', continent: 'Asia',
    description: 'Series of fortifications stretching 21,196 km, built over centuries to protect Chinese states. The most well-preserved sections near Beijing date to the Ming Dynasty.',
    funFact: 'Sticky rice was used as mortar in some sections — the amylopectin in rice created an incredibly strong binding agent.',
    bestTime: 'Apr - May, Sep - Nov', avgBudget: 85000, flightFromDelhi: '6h 00m', visaRequired: true, visaType: 'Chinese Visa',
    nearbyAttractions: ['Forbidden City', 'Temple of Heaven', 'Summer Palace', 'Tiananmen Square', 'Hutong Alleys'],
    suggestedHotels: [
      { name: 'Aman at Summer Palace', stars: 5, pricePerNight: 38000, area: 'Summer Palace' },
      { name: 'The Peninsula Beijing', stars: 5, pricePerNight: 22000, area: 'Wangfujing' },
      { name: 'Hotel Kapok', stars: 4, pricePerNight: 8000, area: 'Dongcheng' },
    ],
    suggestedActivities: [
      { name: 'Mutianyu Section Hike', duration: '5 hours', price: 4000, type: 'Hiking' },
      { name: 'Forbidden City Guided Tour', duration: '3 hours', price: 3500, type: 'Heritage' },
      { name: 'Hutong Rickshaw Tour', duration: '2 hours', price: 2000, type: 'Cultural' },
      { name: 'Peking Duck Dinner Experience', duration: '2 hours', price: 3000, type: 'Culinary' },
    ],
    travelTips: ['Mutianyu is less crowded than Badaling', 'Take the cable car up, toboggan down', 'Bring layers — it\'s windy on the wall'],
    tags: ['ancient', 'heritage', 'wonder', 'hiking', 'asia', 'china', 'monument'],
    similarDestinations: ['Forbidden City', 'Terracotta Warriors', 'Angkor Wat', 'Petra'],
  },
  {
    id: 'burj-khalifa', name: 'Burj Khalifa', category: 'Architecture', subcategory: 'Skyscraper',
    city: 'Dubai', country: 'UAE', continent: 'Asia',
    description: 'The world\'s tallest structure at 828m with 163 floors. Observation decks on floors 124, 125, and 148 offer panoramic views of Dubai.',
    funFact: 'The tip of the Burj Khalifa can be seen from 95km away. On the 148th floor, you\'re literally above the clouds.',
    bestTime: 'Nov - Mar', avgBudget: 55000, flightFromDelhi: '3h 30m', visaRequired: true, visaType: 'Visa on Arrival',
    nearbyAttractions: ['Dubai Mall', 'Dubai Fountain', 'Palm Jumeirah', 'Dubai Marina', 'Old Dubai Souks'],
    suggestedHotels: [
      { name: 'Armani Hotel Dubai', stars: 5, pricePerNight: 28000, area: 'Burj Khalifa' },
      { name: 'Atlantis The Palm', stars: 5, pricePerNight: 15000, area: 'Palm Jumeirah' },
      { name: 'Rove Downtown', stars: 3, pricePerNight: 5500, area: 'Downtown Dubai' },
    ],
    suggestedActivities: [
      { name: 'At The Top Observation Deck', duration: '1.5 hours', price: 3000, type: 'Sightseeing' },
      { name: 'Desert Safari with BBQ Dinner', duration: '6 hours', price: 4500, type: 'Adventure' },
      { name: 'Dubai Fountain Show & Abra Ride', duration: '1 hour', price: 1000, type: 'Entertainment' },
      { name: 'Dubai Frame Visit', duration: '1.5 hours', price: 1200, type: 'Sightseeing' },
    ],
    travelTips: ['Book At The Top tickets 2 weeks ahead', 'Visit the fountain show at sunset', 'Friday brunch is a Dubai institution'],
    tags: ['modern', 'luxury', 'skyscraper', 'dubai', 'city', 'night-views', 'shopping'],
    similarDestinations: ['Singapore Marina Bay', 'Shanghai Bund', 'Hong Kong Skyline', 'Tokyo Tower'],
  },

  // ── NATURAL WONDERS ──────────────────────────────────────
  {
    id: 'grand-canyon', name: 'Grand Canyon', category: 'Nature', subcategory: 'Canyon',
    city: 'Arizona', country: 'USA', continent: 'North America',
    description: 'A steep-sided canyon carved by the Colorado River, 446 km long, up to 29 km wide, and over 1,800m deep. Exposes 2 billion years of Earth\'s geological history.',
    funFact: 'The Grand Canyon has its own weather — it can be snowing at the rim while being sunny and warm at the bottom.',
    bestTime: 'Mar - May, Sep - Nov', avgBudget: 150000, flightFromDelhi: '18h+', visaRequired: true, visaType: 'US B1/B2',
    nearbyAttractions: ['Antelope Canyon', 'Horseshoe Bend', 'Monument Valley', 'Sedona', 'Lake Powell'],
    suggestedHotels: [
      { name: 'El Tovar Hotel', stars: 4, pricePerNight: 22000, area: 'South Rim' },
      { name: 'Phantom Ranch', stars: 3, pricePerNight: 8000, area: 'Canyon Floor' },
      { name: 'Grand Canyon Lodge', stars: 3, pricePerNight: 12000, area: 'North Rim' },
    ],
    suggestedActivities: [
      { name: 'Helicopter Tour over Canyon', duration: '1 hour', price: 20000, type: 'Aerial' },
      { name: 'Bright Angel Trail Hike', duration: '6 hours', price: 0, type: 'Hiking' },
      { name: 'Colorado River Rafting', duration: '1 day', price: 15000, type: 'Adventure' },
      { name: 'Antelope Canyon Tour', duration: '2 hours', price: 5000, type: 'Photography' },
    ],
    travelTips: ['South Rim is open year-round, North Rim is seasonal', 'Bring 2 liters of water per person for any hike', 'Sunrise at Mather Point is magical'],
    tags: ['nature', 'canyon', 'hiking', 'usa', 'photography', 'geological', 'adventure'],
    similarDestinations: ['Bryce Canyon', 'Zhangjiajie', 'Verdon Gorge', 'Fish River Canyon'],
  },
  {
    id: 'northern-lights', name: 'Northern Lights (Aurora Borealis)', category: 'Nature', subcategory: 'Phenomenon',
    city: 'Tromsø', country: 'Norway', continent: 'Europe',
    description: 'Natural light display in Earth\'s sky, predominantly seen in high-latitude regions. Caused by charged particles from the sun interacting with Earth\'s magnetosphere.',
    funFact: 'The same phenomenon occurs in the southern hemisphere and is called Aurora Australis (Southern Lights).',
    bestTime: 'Sep - Mar', avgBudget: 175000, flightFromDelhi: '12h+', visaRequired: true, visaType: 'Schengen',
    nearbyAttractions: ['Arctic Cathedral', 'Whale Watching', 'Sami Culture', 'Dog Sledding', 'Fjord Cruises'],
    suggestedHotels: [
      { name: 'Malangen Resort', stars: 4, pricePerNight: 25000, area: 'Malangen Fjord' },
      { name: 'Scandic Ishavshotel', stars: 4, pricePerNight: 14000, area: 'Tromsø Center' },
      { name: 'Glass Igloo Resort', stars: 4, pricePerNight: 35000, area: 'Finnish Lapland' },
    ],
    suggestedActivities: [
      { name: 'Northern Lights Chase Tour', duration: '6 hours', price: 12000, type: 'Nature' },
      { name: 'Dog Sledding Experience', duration: '3 hours', price: 8000, type: 'Adventure' },
      { name: 'Whale Watching Cruise', duration: '4 hours', price: 10000, type: 'Wildlife' },
      { name: 'Reindeer Sled Ride with Sami Culture', duration: '3 hours', price: 7000, type: 'Cultural' },
    ],
    travelTips: ['Book aurora alerts from local tour operators', 'Clear sky + darkness + solar activity = best chances', 'Bring thermal layers, it can be -20°C'],
    tags: ['nature', 'phenomenon', 'arctic', 'winter', 'photography', 'bucket-list', 'norway'],
    similarDestinations: ['Iceland', 'Finnish Lapland', 'Svalbard', 'Lofoten Islands'],
  },
  {
    id: 'great-barrier-reef', name: 'Great Barrier Reef', category: 'Nature', subcategory: 'Coral Reef',
    city: 'Cairns', country: 'Australia', continent: 'Oceania',
    description: 'World\'s largest coral reef system spanning 2,300 km with 2,900+ individual reef systems. Home to 1,500 species of fish and 400 types of coral.',
    funFact: 'The reef is so large it can be seen from outer space. It\'s the largest living structure on Earth.',
    bestTime: 'Jun - Oct', avgBudget: 200000, flightFromDelhi: '14h+', visaRequired: true, visaType: 'ETA',
    nearbyAttractions: ['Daintree Rainforest', 'Whitsunday Islands', 'Cape Tribulation', 'Kuranda Village', 'Green Island'],
    suggestedHotels: [
      { name: 'Lizard Island Resort', stars: 5, pricePerNight: 65000, area: 'Great Barrier Reef' },
      { name: 'Silky Oaks Lodge', stars: 5, pricePerNight: 35000, area: 'Daintree' },
      { name: 'Riley Cairns', stars: 4, pricePerNight: 12000, area: 'Cairns Esplanade' },
    ],
    suggestedActivities: [
      { name: 'Scuba Diving on the Reef', duration: '6 hours', price: 15000, type: 'Diving' },
      { name: 'Snorkeling Day Trip', duration: '8 hours', price: 8000, type: 'Water Sports' },
      { name: 'Scenic Helicopter Flight', duration: '1 hour', price: 22000, type: 'Aerial' },
      { name: 'Daintree Rainforest Tour', duration: '10 hours', price: 10000, type: 'Nature' },
    ],
    travelTips: ['Reef-safe sunscreen only', 'Snorkeling is amazing even without diving certification', 'Stinger suits recommended Nov-May'],
    tags: ['nature', 'diving', 'ocean', 'coral', 'australia', 'unesco', 'marine', 'bucket-list'],
    similarDestinations: ['Maldives Reefs', 'Raja Ampat', 'Red Sea', 'Belize Barrier Reef'],
  },
  {
    id: 'santorini', name: 'Santorini', category: 'Lifestyle', subcategory: 'Island',
    city: 'Santorini', country: 'Greece', continent: 'Europe',
    description: 'Volcanic island in the Aegean Sea known for its dramatic caldera views, whitewashed buildings with blue domes, and stunning sunsets.',
    funFact: 'Santorini may have been the inspiration for Plato\'s legend of Atlantis — the island was devastated by a volcanic eruption around 1600 BC.',
    bestTime: 'May - Oct', avgBudget: 140000, flightFromDelhi: '10h 30m', visaRequired: true, visaType: 'Schengen',
    nearbyAttractions: ['Oia Sunset', 'Red Beach', 'Akrotiri Archaeological Site', 'Fira Town', 'Wine Tasting'],
    suggestedHotels: [
      { name: 'Canaves Oia Epitome', stars: 5, pricePerNight: 55000, area: 'Oia' },
      { name: 'Andronis Luxury Suites', stars: 5, pricePerNight: 38000, area: 'Oia' },
      { name: 'Volcano View Hotel', stars: 4, pricePerNight: 12000, area: 'Fira' },
    ],
    suggestedActivities: [
      { name: 'Sunset Catamaran Cruise', duration: '5 hours', price: 8000, type: 'Romantic' },
      { name: 'Wine Tasting Tour', duration: '4 hours', price: 5000, type: 'Culinary' },
      { name: 'Akrotiri Archaeological Site', duration: '2 hours', price: 2000, type: 'Heritage' },
      { name: 'Volcano & Hot Springs Boat Tour', duration: '5 hours', price: 4000, type: 'Nature' },
    ],
    travelTips: ['Stay in Oia for best sunset views', 'Book caldera-view hotel for the iconic experience', 'Visit in May/June for fewer crowds'],
    tags: ['romantic', 'island', 'sunset', 'europe', 'greece', 'beach', 'photography', 'honeymoon'],
    similarDestinations: ['Amalfi Coast', 'Mykonos', 'Dubrovnik', 'Cinque Terre'],
  },
  {
    id: 'maldives-overwater', name: 'Maldives Overwater Bungalows', category: 'Lifestyle', subcategory: 'Beach Resort',
    city: 'Male Atoll', country: 'Maldives', continent: 'Asia',
    description: 'Tropical paradise of 1,192 coral islands grouped in 26 atolls, famous for crystal-clear turquoise waters, overwater villas, and vibrant marine life.',
    funFact: 'The Maldives is the lowest country in the world with an average ground level of just 1.5m above sea level.',
    bestTime: 'Nov - Apr', avgBudget: 190000, flightFromDelhi: '4h 20m', visaRequired: false,
    nearbyAttractions: ['Bioluminescent Beach', 'Whale Shark Encounters', 'Underwater Restaurant', 'Sand Bank Excursion', 'Dolphin Cruise'],
    suggestedHotels: [
      { name: 'Soneva Fushi', stars: 5, pricePerNight: 85000, area: 'Baa Atoll' },
      { name: 'Conrad Maldives Rangali', stars: 5, pricePerNight: 55000, area: 'Ari Atoll' },
      { name: 'Coco Palm Dhuni Kolhu', stars: 5, pricePerNight: 25000, area: 'Baa Atoll' },
    ],
    suggestedActivities: [
      { name: 'Sunset Dolphin Cruise', duration: '2 hours', price: 5000, type: 'Wildlife' },
      { name: 'Snorkeling with Manta Rays', duration: '3 hours', price: 8000, type: 'Marine' },
      { name: 'Spa Overwater Treatment', duration: '2 hours', price: 12000, type: 'Wellness' },
      { name: 'Underwater Dining Experience', duration: '3 hours', price: 15000, type: 'Culinary' },
    ],
    travelTips: ['Book seaplane transfer from Male', 'Pack reef-safe sunscreen', 'All-inclusive packages offer best value'],
    tags: ['beach', 'luxury', 'honeymoon', 'tropical', 'diving', 'overwater', 'romantic', 'island'],
    similarDestinations: ['Bora Bora', 'Seychelles', 'Fiji', 'Mauritius'],
  },
  {
    id: 'cappadocia', name: 'Cappadocia Hot Air Balloons', category: 'Scenic', subcategory: 'Aerial',
    city: 'Göreme', country: 'Turkey', continent: 'Europe/Asia',
    description: 'Surreal landscape of fairy chimneys, cave dwellings, and ancient rock churches, best experienced at dawn from a hot air balloon floating over the valleys.',
    funFact: 'Cappadocia\'s underground cities could shelter up to 20,000 people along with their livestock and food stores.',
    bestTime: 'Apr - Jun, Sep - Nov', avgBudget: 75000, flightFromDelhi: '7h 00m', visaRequired: true, visaType: 'E-Visa',
    nearbyAttractions: ['Derinkuyu Underground City', 'Göreme Open Air Museum', 'Love Valley', 'Pigeon Valley', 'Uçhisar Castle'],
    suggestedHotels: [
      { name: 'Museum Hotel', stars: 5, pricePerNight: 28000, area: 'Uçhisar' },
      { name: 'Sultan Cave Suites', stars: 4, pricePerNight: 12000, area: 'Göreme' },
      { name: 'Koza Cave Hotel', stars: 3, pricePerNight: 6000, area: 'Göreme' },
    ],
    suggestedActivities: [
      { name: 'Hot Air Balloon Sunrise Flight', duration: '1.5 hours', price: 15000, type: 'Aerial' },
      { name: 'Derinkuyu Underground City Tour', duration: '2 hours', price: 2000, type: 'Heritage' },
      { name: 'ATV Quad Bike through Valleys', duration: '2 hours', price: 3000, type: 'Adventure' },
      { name: 'Turkish Pottery Workshop', duration: '3 hours', price: 2500, type: 'Cultural' },
    ],
    travelTips: ['Book balloon flights 3 months ahead in peak season', 'Stay in a cave hotel for the full experience', 'Pack layers — mornings are cold at altitude'],
    tags: ['aerial', 'balloon', 'photography', 'turkey', 'cave', 'sunrise', 'bucket-list', 'landscape'],
    similarDestinations: ['Bagan Temples', 'Wadi Rum', 'Monument Valley', 'Zhangjiajie'],
  },
  {
    id: 'victoria-falls', name: 'Victoria Falls', category: 'Nature', subcategory: 'Waterfall',
    city: 'Livingstone', country: 'Zambia/Zimbabwe', continent: 'Africa',
    description: 'The world\'s largest curtain of falling water at 1,708m wide and 108m tall. Known locally as "Mosi-oa-Tunya" — The Smoke That Thunders.',
    funFact: 'During peak flow, 500 million liters of water per minute crash over the edge, creating a mist visible from 50km away.',
    bestTime: 'Feb - May', avgBudget: 160000, flightFromDelhi: '14h+', visaRequired: true, visaType: 'UniVisa',
    nearbyAttractions: ['Devil\'s Pool', 'Zambezi River', 'Chobe National Park', 'Bungee Bridge', 'Helicopter Flights'],
    suggestedHotels: [
      { name: 'Royal Livingstone by Anantara', stars: 5, pricePerNight: 30000, area: 'Zambezi River' },
      { name: 'Victoria Falls Hotel', stars: 5, pricePerNight: 22000, area: 'Zimbabwe Side' },
      { name: 'Avani Victoria Falls Resort', stars: 4, pricePerNight: 12000, area: 'Livingstone' },
    ],
    suggestedActivities: [
      { name: 'Devil\'s Pool Swim (Sep-Dec)', duration: '3 hours', price: 10000, type: 'Adventure' },
      { name: 'Helicopter Flight of Angels', duration: '15 min', price: 12000, type: 'Aerial' },
      { name: 'Zambezi Sunset Cruise', duration: '2 hours', price: 5000, type: 'Scenic' },
      { name: 'Bungee Jump off the Bridge', duration: '1 hour', price: 8000, type: 'Extreme' },
    ],
    travelTips: ['Bring a waterproof camera cover', 'Visit both the Zambian and Zimbabwean sides', 'Devil\'s Pool is only accessible Sep-Dec when water is lower'],
    tags: ['waterfall', 'africa', 'adventure', 'nature', 'bucket-list', 'extreme', 'photography'],
    similarDestinations: ['Iguazu Falls', 'Niagara Falls', 'Angel Falls', 'Gullfoss'],
  },
  {
    id: 'angkor-wat', name: 'Angkor Wat', category: 'Architecture', subcategory: 'Temple',
    city: 'Siem Reap', country: 'Cambodia', continent: 'Asia',
    description: 'Largest religious monument in the world, originally built as a Hindu temple dedicated to Vishnu in the 12th century, later converted to Buddhism.',
    funFact: 'Angkor Wat appears on Cambodia\'s national flag — the only building to appear on a national flag.',
    bestTime: 'Nov - Mar', avgBudget: 65000, flightFromDelhi: '6h+', visaRequired: true, visaType: 'E-Visa/VOA',
    nearbyAttractions: ['Bayon Temple', 'Ta Prohm', 'Tonlé Sap Lake', 'Phnom Kulen', 'Banteay Srei'],
    suggestedHotels: [
      { name: 'Amansara', stars: 5, pricePerNight: 55000, area: 'Siem Reap' },
      { name: 'Sofitel Angkor', stars: 5, pricePerNight: 12000, area: 'Siem Reap' },
      { name: 'Shinta Mani Angkor', stars: 4, pricePerNight: 7000, area: 'Siem Reap' },
    ],
    suggestedActivities: [
      { name: 'Angkor Wat Sunrise Tour', duration: '4 hours', price: 2500, type: 'Heritage' },
      { name: 'Grand Circuit Temples Tour', duration: '8 hours', price: 4000, type: 'Heritage' },
      { name: 'Tonlé Sap Floating Village', duration: '3 hours', price: 2000, type: 'Cultural' },
      { name: 'Khmer Cooking Class', duration: '4 hours', price: 2500, type: 'Culinary' },
    ],
    travelTips: ['Buy a 3-day pass for best value', 'Arrive before 5am for iconic sunrise reflection', 'Tuk-tuk is the best way to explore temples'],
    tags: ['temple', 'ancient', 'asia', 'heritage', 'unesco', 'photography', 'sunrise', 'spiritual'],
    similarDestinations: ['Borobudur', 'Bagan', 'Hampi', 'Sukhothai'],
  },
  {
    id: 'swiss-alps', name: 'Swiss Alps', category: 'Nature', subcategory: 'Mountains',
    city: 'Interlaken', country: 'Switzerland', continent: 'Europe',
    description: 'Majestic Alpine peaks including the Jungfrau, Eiger, and Matterhorn, with pristine lakes, charming villages, and world-class skiing.',
    funFact: 'Switzerland has more than 7,000 lakes, and you\'re never more than 16 km from one.',
    bestTime: 'Jun - Sep (summer), Dec - Mar (ski)', avgBudget: 160000, flightFromDelhi: '8h 30m', visaRequired: true, visaType: 'Schengen',
    nearbyAttractions: ['Jungfraujoch', 'Lake Lucerne', 'Zermatt & Matterhorn', 'Lauterbrunnen Valley', 'Grindelwald'],
    suggestedHotels: [
      { name: 'Victoria Jungfrau Grand Hotel', stars: 5, pricePerNight: 35000, area: 'Interlaken' },
      { name: 'Hotel Bellevue des Alpes', stars: 4, pricePerNight: 20000, area: 'Kleine Scheidegg' },
      { name: 'Hotel Lötschberg', stars: 3, pricePerNight: 10000, area: 'Interlaken' },
    ],
    suggestedActivities: [
      { name: 'Jungfraujoch "Top of Europe" Train', duration: '6 hours', price: 18000, type: 'Scenic' },
      { name: 'Paragliding over Interlaken', duration: '30 min', price: 12000, type: 'Adventure' },
      { name: 'Glacier Express Scenic Train', duration: '8 hours', price: 15000, type: 'Rail Journey' },
      { name: 'Lauterbrunnen Valley Hike', duration: '4 hours', price: 0, type: 'Hiking' },
    ],
    travelTips: ['Swiss Travel Pass saves money on trains/buses/boats', 'Carry cash — some mountain huts don\'t take cards', 'Layer up — weather changes fast at altitude'],
    tags: ['mountains', 'alps', 'scenic', 'europe', 'skiing', 'adventure', 'luxury', 'train'],
    similarDestinations: ['Dolomites', 'Austrian Alps', 'Canadian Rockies', 'Himalayas'],
  },
  {
    id: 'bali-temples', name: 'Bali (Gates of Heaven)', category: 'Lifestyle', subcategory: 'Temple',
    city: 'Bali', country: 'Indonesia', continent: 'Asia',
    description: 'Lempuyang Temple\'s split gateway frames Mount Agung in one of the world\'s most Instagrammable shots. Bali blends spiritual temples, rice terraces, and tropical beaches.',
    funFact: 'Bali has over 20,000 temples — at least one in every home, and one for every village occasion.',
    bestTime: 'Apr - Oct', avgBudget: 50000, flightFromDelhi: '8h 00m', visaRequired: false,
    nearbyAttractions: ['Ubud Rice Terraces', 'Tanah Lot', 'Uluwatu Temple', 'Mount Batur', 'Seminyak Beach'],
    suggestedHotels: [
      { name: 'Four Seasons Sayan', stars: 5, pricePerNight: 40000, area: 'Ubud' },
      { name: 'Alila Villas Uluwatu', stars: 5, pricePerNight: 28000, area: 'Uluwatu' },
      { name: 'Komaneka at Tanggayuda', stars: 4, pricePerNight: 8000, area: 'Ubud' },
    ],
    suggestedActivities: [
      { name: 'Mount Batur Sunrise Trek', duration: '6 hours', price: 3500, type: 'Hiking' },
      { name: 'Tegallalang Rice Terrace Walk', duration: '2 hours', price: 500, type: 'Nature' },
      { name: 'Uluwatu Kecak Fire Dance', duration: '2 hours', price: 1500, type: 'Cultural' },
      { name: 'Balinese Spa & Massage', duration: '2 hours', price: 2500, type: 'Wellness' },
    ],
    travelTips: ['Rent a scooter for freedom but be cautious', 'Dress modestly at temples (sarong required)', 'Nyepi Day (Day of Silence) — everything shuts down'],
    tags: ['temple', 'tropical', 'asia', 'beach', 'spiritual', 'instagram', 'culture', 'wellness'],
    similarDestinations: ['Angkor Wat', 'Sri Lanka', 'Thailand Temples', 'Ubud'],
  },
  {
    id: 'safari-serengeti', name: 'Serengeti Safari', category: 'Adventure', subcategory: 'Safari',
    city: 'Arusha', country: 'Tanzania', continent: 'Africa',
    description: 'Home to the Great Migration — over 2 million wildebeest and zebras traverse the Serengeti ecosystem annually in a circular route following the rains.',
    funFact: 'The Serengeti is home to the largest terrestrial mammal migration in the world.',
    bestTime: 'Jun - Oct (migration), Jan - Feb (calving)', avgBudget: 250000, flightFromDelhi: '10h+', visaRequired: true, visaType: 'E-Visa',
    nearbyAttractions: ['Ngorongoro Crater', 'Mount Kilimanjaro', 'Zanzibar', 'Lake Manyara', 'Olduvai Gorge'],
    suggestedHotels: [
      { name: 'Four Seasons Serengeti', stars: 5, pricePerNight: 75000, area: 'Central Serengeti' },
      { name: 'Singita Grumeti', stars: 5, pricePerNight: 120000, area: 'Western Serengeti' },
      { name: 'Serengeti Serena Safari Lodge', stars: 4, pricePerNight: 25000, area: 'Central Serengeti' },
    ],
    suggestedActivities: [
      { name: 'Full Day Game Drive', duration: '10 hours', price: 15000, type: 'Safari' },
      { name: 'Hot Air Balloon Safari', duration: '1 hour', price: 35000, type: 'Aerial' },
      { name: 'Ngorongoro Crater Excursion', duration: '10 hours', price: 12000, type: 'Safari' },
      { name: 'Maasai Village Visit', duration: '2 hours', price: 3000, type: 'Cultural' },
    ],
    travelTips: ['Yellow fever vaccination required', 'Pack neutral-colored clothing for safari', 'Binoculars and a telephoto lens are essential'],
    tags: ['safari', 'wildlife', 'africa', 'migration', 'adventure', 'nature', 'bucket-list', 'photography'],
    similarDestinations: ['Masai Mara', 'Kruger National Park', 'Okavango Delta', 'Etosha'],
  },
  {
    id: 'kyoto-fushimi', name: 'Fushimi Inari Shrine', category: 'Architecture', subcategory: 'Shrine',
    city: 'Kyoto', country: 'Japan', continent: 'Asia',
    description: 'Iconic Shinto shrine famous for its thousands of vermillion torii gates creating a tunnel-like path up Mount Inari. Dedicated to Inari, the god of rice.',
    funFact: 'There are approximately 10,000 torii gates, each donated by businesses praying for prosperity.',
    bestTime: 'Mar - May (cherry blossom), Oct - Nov (autumn)', avgBudget: 95000, flightFromDelhi: '8h 00m', visaRequired: true, visaType: 'Japan Visa',
    nearbyAttractions: ['Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Nara Deer Park', 'Gion Geisha District', 'Kiyomizu-dera'],
    suggestedHotels: [
      { name: 'Aman Kyoto', stars: 5, pricePerNight: 65000, area: 'North Kyoto' },
      { name: 'Hotel The Mitsui Kyoto', stars: 5, pricePerNight: 42000, area: 'Nijo' },
      { name: 'Piece Hostel Kyoto', stars: 2, pricePerNight: 4000, area: 'Kyoto Station' },
    ],
    suggestedActivities: [
      { name: 'Fushimi Inari Summit Hike', duration: '3 hours', price: 0, type: 'Hiking' },
      { name: 'Traditional Tea Ceremony', duration: '1.5 hours', price: 3500, type: 'Cultural' },
      { name: 'Geisha District Walking Tour', duration: '2 hours', price: 4000, type: 'Cultural' },
      { name: 'Bamboo Forest & Monkey Park', duration: '4 hours', price: 2000, type: 'Nature' },
    ],
    travelTips: ['Visit Fushimi Inari at dawn (5am) for empty gates', 'Japan Rail Pass saves money for multi-city trips', 'Cherry blossom season is late March to mid-April'],
    tags: ['shrine', 'japan', 'asia', 'photography', 'spiritual', 'instagram', 'cherry-blossom', 'cultural'],
    similarDestinations: ['Itsukushima Shrine', 'Meiji Shrine Tokyo', 'Angkor Wat', 'Golden Temple Amritsar'],
  },
  // ── MORE DESTINATIONS (condensed) ──────────────────────────
  {
    id: 'petra', name: 'Petra (Al-Khazneh)', category: 'Historical', subcategory: 'Ancient City',
    city: 'Wadi Musa', country: 'Jordan', continent: 'Asia',
    description: 'Rose-red ancient city carved into cliff faces by the Nabataeans over 2,000 years ago. The Treasury facade is one of the most iconic archaeological sites.',
    funFact: 'Only about 15% of Petra has been explored — 85% remains underground and undiscovered.',
    bestTime: 'Mar - May, Sep - Nov', avgBudget: 90000, flightFromDelhi: '7h', visaRequired: true, visaType: 'Jordan Visa',
    nearbyAttractions: ['Wadi Rum', 'Dead Sea', 'Amman Citadel', 'Aqaba', 'Jerash'],
    suggestedHotels: [
      { name: 'Mövenpick Resort Petra', stars: 5, pricePerNight: 18000, area: 'Petra Gate' },
    ],
    suggestedActivities: [
      { name: 'Petra by Night Experience', duration: '2 hours', price: 2500, type: 'Heritage' },
      { name: 'Wadi Rum Desert Camp', duration: '1 day', price: 8000, type: 'Adventure' },
    ],
    travelTips: ['Buy a 2-day pass', 'Wear sturdy shoes for uneven terrain'],
    tags: ['ancient', 'heritage', 'wonder', 'desert', 'photography', 'middle-east'],
    similarDestinations: ['Machu Picchu', 'Angkor Wat', 'Colosseum', 'Great Wall'],
  },
  {
    id: 'niagara-falls', name: 'Niagara Falls', category: 'Nature', subcategory: 'Waterfall',
    city: 'Niagara Falls', country: 'Canada/USA', continent: 'North America',
    description: 'Three waterfalls straddling the border of Ontario and New York. Combined, they form the highest flow rate of any waterfall in the world.',
    funFact: 'About 3,160 tons of water flow over Niagara Falls every second during peak daytime tourist hours.',
    bestTime: 'Jun - Aug', avgBudget: 140000, flightFromDelhi: '16h+', visaRequired: true, visaType: 'Canada/US Visa',
    nearbyAttractions: ['Maid of the Mist', 'Niagara-on-the-Lake', 'Skylon Tower', 'Journey Behind the Falls', 'Hornblower Cruise'],
    suggestedHotels: [
      { name: 'Marriott Fallsview', stars: 4, pricePerNight: 18000, area: 'Fallsview' },
    ],
    suggestedActivities: [
      { name: 'Hornblower Niagara Cruise', duration: '1 hour', price: 3000, type: 'Scenic' },
      { name: 'Journey Behind the Falls', duration: '1 hour', price: 2000, type: 'Nature' },
    ],
    travelTips: ['Canadian side has better views', 'Fireworks every Friday/Sunday night in summer'],
    tags: ['waterfall', 'nature', 'north-america', 'scenic', 'bucket-list', 'border'],
    similarDestinations: ['Victoria Falls', 'Iguazu Falls', 'Gullfoss', 'Angel Falls'],
  },
  {
    id: 'iceland-landscape', name: 'Iceland Ring Road', category: 'Nature', subcategory: 'Landscape',
    city: 'Reykjavik', country: 'Iceland', continent: 'Europe',
    description: 'A 1,322 km highway encircling the island, passing volcanic landscapes, glaciers, geysers, hot springs, and waterfalls — a road tripper\'s paradise.',
    funFact: 'Iceland has no mosquitoes and no army, but has more books published per capita than any other country.',
    bestTime: 'Jun - Aug (midnight sun), Sep - Mar (northern lights)', avgBudget: 175000, flightFromDelhi: '14h+', visaRequired: true, visaType: 'Schengen',
    nearbyAttractions: ['Blue Lagoon', 'Golden Circle', 'Jökulsárlón Glacier Lagoon', 'Reynisfjara Black Beach', 'Skógafoss'],
    suggestedHotels: [
      { name: 'The Retreat at Blue Lagoon', stars: 5, pricePerNight: 75000, area: 'Blue Lagoon' },
      { name: 'Ion Adventure Hotel', stars: 4, pricePerNight: 28000, area: 'Thingvellir' },
    ],
    suggestedActivities: [
      { name: 'Blue Lagoon Spa Experience', duration: '3 hours', price: 8000, type: 'Wellness' },
      { name: 'Glacier Hiking on Sólheimajökull', duration: '4 hours', price: 10000, type: 'Adventure' },
      { name: 'Golden Circle Day Tour', duration: '8 hours', price: 8000, type: 'Scenic' },
      { name: 'Ice Cave Exploration', duration: '3 hours', price: 12000, type: 'Adventure' },
    ],
    travelTips: ['Rent a 4WD for highland roads', 'Weather changes every 15 minutes', 'Hotdog stands are surprisingly amazing'],
    tags: ['road-trip', 'nature', 'volcanic', 'glacier', 'europe', 'adventure', 'photography', 'hot-springs'],
    similarDestinations: ['Norway Fjords', 'Faroe Islands', 'Patagonia', 'New Zealand'],
  },
];

// ── Category label map ─────────────────────────────────────
export const categoryLabels: Record<string, string> = {
  'Architecture': 'Architecture & Structures',
  'Historical': 'Historical & Cultural',
  'Nature': 'Natural Wonders',
  'Lifestyle': 'Lifestyle & Urban',
  'Adventure': 'Adventure & Wildlife',
  'Scenic': 'Scenic & Photogenic',
};

// ── Simulated recognition function ─────────────────────────
// In production, this would call a Vision API (Google Cloud Vision, AWS Rekognition, etc.)
// For demo, we randomly select a landmark and simulate confidence scoring.
export function simulateImageRecognition(): {
  primary: LandmarkEntry;
  similar: LandmarkEntry[];
  analysisSteps: string[];
} {
  const shuffled = [...landmarkDatabase].sort(() => Math.random() - 0.5);
  const primary = { ...shuffled[0], confidence: 85 + Math.floor(Math.random() * 14), matchReason: 'Architectural features and skyline patterns match' };

  // Pick 3-4 similar from same tags
  const primaryTags = new Set(primary.tags);
  const similar = shuffled
    .slice(1)
    .filter(l => l.tags.some(t => primaryTags.has(t)))
    .slice(0, 4)
    .map(l => ({ ...l, confidence: 55 + Math.floor(Math.random() * 30) }));

  const analysisSteps = [
    'Extracting visual features from image...',
    'Analyzing architectural patterns & landmarks...',
    'Cross-referencing with global landmark database...',
    'Identifying geographical context & terrain...',
    'Matching with travel destination profiles...',
    'Generating personalized trip suggestions...',
  ];

  return { primary, similar, analysisSteps };
}
