/**
 * Database Seeder – Populates MongoDB with demo data
 *
 * Usage:
 *   npx tsx server/seed.ts
 *   npx tsx server/seed.ts --clear   (drops collections first)
 */
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import Destination from './models/Destination';
import Package from './models/Package';
import Trip from './models/Trip';
import RecentSearch from './models/RecentSearch';

const destinationsSeed = [
  { name: 'Goa', country: 'India', tagline: 'Sun, Sand & Serenity', startingPrice: 18999, image: 'https://images.unsplash.com/photo-1698430184854-17aa542d247c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-orange-500/90 to-amber-600/90', rating: 4.7, reviews: 2840, badge: 'Best Seller', badgeColor: 'bg-orange-500', bestTime: 'Oct - Mar', flightTime: '2h 15m', categories: ['india', 'beach'] },
  { name: 'Dubai', country: 'UAE', tagline: 'Luxury Beyond Limits', startingPrice: 54999, image: 'https://images.unsplash.com/photo-1657106251952-2d584ebdf886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-purple-600/90 to-indigo-700/90', rating: 4.9, reviews: 1920, badge: 'Premium', badgeColor: 'bg-purple-500', bestTime: 'Nov - Mar', flightTime: '3h 30m', categories: ['international'] },
  { name: 'Maldives', country: 'Maldives', tagline: 'Paradise on Water', startingPrice: 89999, image: 'https://images.unsplash.com/photo-1633503609367-c74b3795329c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-cyan-500/90 to-blue-600/90', rating: 4.9, reviews: 980, badge: 'Honeymoon', badgeColor: 'bg-pink-500', bestTime: 'Nov - Apr', flightTime: '4h 20m', categories: ['international', 'beach'] },
  { name: 'Bali', country: 'Indonesia', tagline: 'Island of the Gods', startingPrice: 45999, image: 'https://images.unsplash.com/photo-1703222421255-aca13345c288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-emerald-500/90 to-teal-600/90', rating: 4.8, reviews: 2150, badge: 'Trending', badgeColor: 'bg-green-500', bestTime: 'Apr - Oct', flightTime: '8h 00m', categories: ['international', 'beach'] },
  { name: 'Manali', country: 'India', tagline: 'Mountains Calling', startingPrice: 15999, image: 'https://images.unsplash.com/photo-1655468981043-eccbf08b1d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-sky-500/90 to-blue-700/90', rating: 4.6, reviews: 1560, bestTime: 'Oct - Feb', flightTime: '1h 50m', categories: ['india', 'mountain'] },
  { name: 'Singapore', country: 'Singapore', tagline: 'Garden City Wonders', startingPrice: 62999, image: 'https://images.unsplash.com/photo-1652843134988-6fafc5121ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-pink-500/90 to-rose-600/90', rating: 4.7, reviews: 1340, bestTime: 'Year Round', flightTime: '5h 30m', categories: ['international'] },
  { name: 'Jaipur', country: 'India', tagline: 'Royal Heritage Trail', startingPrice: 12999, image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-rose-500/90 to-red-600/90', rating: 4.5, reviews: 1890, bestTime: 'Oct - Mar', flightTime: '2h 00m', categories: ['india', 'heritage'] },
  { name: 'Thailand', country: 'Thailand', tagline: 'Tropical Bliss & Culture', startingPrice: 35999, image: 'https://images.unsplash.com/photo-1559882203-fa7d5f167422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-yellow-500/90 to-orange-600/90', rating: 4.7, reviews: 2310, bestTime: 'Nov - Feb', flightTime: '4h 00m', categories: ['international', 'beach'] },
  { name: 'Paris', country: 'France', tagline: 'City of Love & Lights', startingPrice: 125999, image: 'https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-violet-500/90 to-purple-700/90', rating: 4.8, reviews: 1640, badge: 'Romantic', badgeColor: 'bg-pink-600', bestTime: 'Apr - Jun', flightTime: '9h 00m', categories: ['international', 'heritage'] },
  { name: 'Santorini', country: 'Greece', tagline: 'Aegean Dream Escape', startingPrice: 139999, image: 'https://images.unsplash.com/photo-1719607526486-96f27a995fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-blue-500/90 to-indigo-600/90', rating: 4.9, reviews: 870, badge: 'Dream Dest.', badgeColor: 'bg-indigo-500', bestTime: 'May - Oct', flightTime: '10h 30m', categories: ['international', 'beach'] },
  { name: 'Switzerland', country: 'Switzerland', tagline: 'Alpine Wonderland', startingPrice: 159999, image: 'https://images.unsplash.com/photo-1607972467949-db144d1227d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-teal-500/90 to-emerald-700/90', rating: 4.9, reviews: 1120, badge: 'Luxury', badgeColor: 'bg-amber-600', bestTime: 'Jun - Sep', flightTime: '8h 30m', categories: ['international', 'mountain'] },
  { name: 'Tokyo', country: 'Japan', tagline: 'Future Meets Tradition', startingPrice: 95999, image: 'https://images.unsplash.com/photo-1663511174063-48de51073e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-red-500/90 to-rose-700/90', rating: 4.8, reviews: 1450, bestTime: 'Mar - May', flightTime: '8h 00m', categories: ['international', 'heritage'] },
  { name: 'Kerala', country: 'India', tagline: "God's Own Country", startingPrice: 22999, image: 'https://images.unsplash.com/photo-1707893013488-51672ef83425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-green-500/90 to-emerald-600/90', rating: 4.7, reviews: 2060, badge: 'Top Rated', badgeColor: 'bg-teal-500', bestTime: 'Sep - Mar', flightTime: '2h 40m', categories: ['india', 'beach'] },
  { name: 'Udaipur', country: 'India', tagline: 'Venice of the East', startingPrice: 16999, image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-amber-500/90 to-yellow-600/90', rating: 4.6, reviews: 1380, bestTime: 'Oct - Mar', flightTime: '1h 45m', categories: ['india', 'heritage'] },
  { name: 'Istanbul', country: 'Turkey', tagline: 'Where East Meets West', startingPrice: 72999, image: 'https://images.unsplash.com/photo-1572280075160-be1ab588d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-orange-600/90 to-red-700/90', rating: 4.7, reviews: 1190, bestTime: 'Apr - Jun', flightTime: '6h 30m', categories: ['international', 'heritage'] },
  { name: 'Vietnam', country: 'Vietnam', tagline: 'Halong Bay & Beyond', startingPrice: 42999, image: 'https://images.unsplash.com/photo-1759853697456-c7c86c81cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-lime-500/90 to-green-600/90', rating: 4.6, reviews: 920, bestTime: 'Feb - Apr', flightTime: '5h 00m', categories: ['international', 'beach'] },
  { name: 'Mauritius', country: 'Mauritius', tagline: 'Tropical Island Bliss', startingPrice: 78999, image: 'https://images.unsplash.com/photo-1768737817241-bbf91eb38158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-cyan-500/90 to-teal-600/90', rating: 4.8, reviews: 760, badge: 'Honeymoon', badgeColor: 'bg-pink-500', bestTime: 'May - Dec', flightTime: '7h 00m', categories: ['international', 'beach'] },
  { name: 'New Zealand', country: 'New Zealand', tagline: 'Epic Adventure Awaits', startingPrice: 185999, image: 'https://images.unsplash.com/photo-1668010882703-fb9fc62c250a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-blue-600/90 to-sky-700/90', rating: 4.9, reviews: 640, badge: 'Adventure', badgeColor: 'bg-blue-600', bestTime: 'Dec - Mar', flightTime: '14h 00m', categories: ['international', 'mountain'] },
  { name: 'Sri Lanka', country: 'Sri Lanka', tagline: 'Pearl of the Indian Ocean', startingPrice: 38999, image: 'https://images.unsplash.com/photo-1558871625-e6582689bbda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-amber-500/90 to-orange-600/90', rating: 4.5, reviews: 810, bestTime: 'Dec - Mar', flightTime: '2h 00m', categories: ['international', 'beach', 'heritage'] },
  { name: 'Egypt', country: 'Egypt', tagline: 'Land of the Pharaohs', startingPrice: 68999, image: 'https://images.unsplash.com/photo-1705874930271-88eeb8f533dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-yellow-600/90 to-amber-700/90', rating: 4.6, reviews: 950, bestTime: 'Oct - Apr', flightTime: '5h 30m', categories: ['international', 'heritage'] },
  { name: 'Rome', country: 'Italy', tagline: 'Eternal City of Wonders', startingPrice: 119999, image: 'https://images.unsplash.com/photo-1662898290891-a6c7f022e851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-stone-500/90 to-neutral-700/90', rating: 4.8, reviews: 1520, bestTime: 'Apr - Jun', flightTime: '9h 30m', categories: ['international', 'heritage'] },
  { name: 'Andaman', country: 'India', tagline: 'Turquoise Island Paradise', startingPrice: 32999, image: 'https://images.unsplash.com/photo-1767784543748-1f587672851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', color: 'from-teal-500/90 to-cyan-600/90', rating: 4.7, reviews: 1150, badge: 'Hidden Gem', badgeColor: 'bg-emerald-600', bestTime: 'Nov - May', flightTime: '2h 30m', categories: ['india', 'beach'] },
];

const packagesSeed = [
  {
    name: 'Beach Paradise Package', destination: 'Goa', confidenceScore: 94,
    whyThisBundle: 'Best match for beach vibe + luxury preference with premium resort.',
    outboundFlight: { airline: 'IndiGo', flightNumber: '6E 5316', departure: { airport: 'DEL', city: 'Delhi', time: '06:30', terminal: 'T2' }, arrival: { airport: 'GOI', city: 'Goa', time: '09:15', terminal: 'T1' }, duration: '2h 45m', stops: 0, class: 'Economy', price: 8500, baggage: '15kg + 7kg' },
    returnFlight: { airline: 'IndiGo', flightNumber: '6E 5011', departure: { airport: 'GOI', city: 'Goa', time: '19:45', terminal: 'T1' }, arrival: { airport: 'DEL', city: 'Delhi', time: '22:30', terminal: 'T2' }, duration: '2h 45m', stops: 0, class: 'Economy', price: 9100, baggage: '15kg + 7kg' },
    hotel: { name: 'The Leela Goa', category: '5-star Luxury', rating: 4.8, location: 'Cavelossim Beach, South Goa', area: 'South Goa', images: [], amenities: ['Private Beach', 'Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym'], roomType: 'Deluxe Ocean View', mealPlan: 'Breakfast included', pricePerNight: 8500, totalPrice: 42500, nights: 5, cancellationPolicy: 'Free cancellation until 7 days before check-in' },
    activities: [{ name: 'Scuba Diving at Grande Island', type: 'Water Sports', duration: '4 hours', price: 3500 }, { name: 'Sunset Dolphin Cruise', type: 'Cruise', duration: '2 hours', price: 1200 }],
    transfers: [{ type: 'Airport Pickup', vehicle: 'Sedan (AC)', from: 'GOI', to: 'Hotel', price: 800 }, { type: 'Airport Drop', vehicle: 'Sedan (AC)', from: 'Hotel', to: 'GOI', price: 800 }],
    totalPrice: 42999, priceBreakdown: { flights: 17600, hotel: 42500, activities: 4700, transfers: 1600, taxes: 3300 },
    policies: { cancellation: 'Free cancellation until 7 days before departure.', amendment: 'Date changes allowed + ₹2000 fee.', payment: '30% advance, balance 15 days before.' },
    badge: 'Best Seller', badgeColor: 'bg-orange-500', discount: 22, originalPrice: 54999, travelers: '2 Adults', duration: '4N / 5D', highlights: ['Beach Resort', 'Water Sports', 'Airport Transfer'],
  },
  {
    name: 'Luxury Shopping Extravaganza', destination: 'Dubai', confidenceScore: 92,
    whyThisBundle: 'Premium Dubai experience with 5-star hotel, desert safari, and city tour.',
    outboundFlight: { airline: 'Emirates', flightNumber: 'EK 505', departure: { airport: 'DEL', city: 'Delhi', time: '08:00' }, arrival: { airport: 'DXB', city: 'Dubai', time: '10:30' }, duration: '3h 30m', stops: 0, class: 'Economy', price: 22000, baggage: '30kg + 7kg' },
    returnFlight: { airline: 'Emirates', flightNumber: 'EK 510', departure: { airport: 'DXB', city: 'Dubai', time: '23:00' }, arrival: { airport: 'DEL', city: 'Delhi', time: '04:30' }, duration: '3h 30m', stops: 0, class: 'Economy', price: 22000, baggage: '30kg + 7kg' },
    hotel: { name: 'Atlantis The Palm', category: '5-star', rating: 4.9, location: 'Palm Jumeirah', area: 'Palm Jumeirah', images: [], amenities: ['Beach', 'Aquaventure', 'Pool', 'Spa', 'Restaurants'], roomType: 'Ocean King', mealPlan: 'Half Board', pricePerNight: 15000, totalPrice: 75000, nights: 5, cancellationPolicy: 'Free cancellation until 5 days before check-in' },
    activities: [{ name: 'Desert Safari', type: 'Adventure', duration: '6 hours', price: 5000 }, { name: 'Dubai City Tour', type: 'Sightseeing', duration: '4 hours', price: 3000 }],
    transfers: [{ type: 'Airport Pickup', vehicle: 'Luxury Sedan', from: 'DXB', to: 'Hotel', price: 1500 }, { type: 'Airport Drop', vehicle: 'Luxury Sedan', from: 'Hotel', to: 'DXB', price: 1500 }],
    totalPrice: 124999, priceBreakdown: { flights: 44000, hotel: 75000, activities: 8000, transfers: 3000, taxes: 6999 },
    policies: { cancellation: 'Free cancellation until 5 days before departure.', amendment: 'Date changes + fare diff.', payment: '30% advance.' },
    badge: 'Premium', badgeColor: 'bg-purple-500', discount: 17, originalPrice: 149999, travelers: 'Family of 4', duration: '5N / 6D', highlights: ['5-Star Hotel', 'Desert Safari', 'City Tour'],
  },
  {
    name: 'Adventure Seeker Special', destination: 'Manali', confidenceScore: 88,
    whyThisBundle: 'Perfect mountain getaway with trekking and bonfire experiences.',
    outboundFlight: { airline: 'Vistara', flightNumber: 'UK 721', departure: { airport: 'DEL', city: 'Delhi', time: '07:00' }, arrival: { airport: 'KUU', city: 'Kullu', time: '08:50' }, duration: '1h 50m', stops: 0, class: 'Economy', price: 7500, baggage: '15kg + 7kg' },
    returnFlight: { airline: 'Vistara', flightNumber: 'UK 722', departure: { airport: 'KUU', city: 'Kullu', time: '17:00' }, arrival: { airport: 'DEL', city: 'Delhi', time: '18:50' }, duration: '1h 50m', stops: 0, class: 'Economy', price: 7500, baggage: '15kg + 7kg' },
    hotel: { name: 'The Himalayan', category: '4-star', rating: 4.6, location: 'Old Manali', area: 'Manali', images: [], amenities: ['Mountain View', 'Restaurant', 'Bonfire', 'WiFi'], roomType: 'Deluxe Room', mealPlan: 'All meals', pricePerNight: 5000, totalPrice: 15000, nights: 3, cancellationPolicy: 'Free cancellation until 3 days before check-in' },
    activities: [{ name: 'Solang Valley Trekking', type: 'Adventure', duration: '5 hours', price: 2000 }, { name: 'Rohtang Pass Trip', type: 'Sightseeing', duration: '8 hours', price: 3000 }],
    transfers: [{ type: 'Airport Pickup', vehicle: 'SUV (AC)', from: 'KUU', to: 'Hotel', price: 1000 }, { type: 'Airport Drop', vehicle: 'SUV (AC)', from: 'Hotel', to: 'KUU', price: 1000 }],
    totalPrice: 28999, priceBreakdown: { flights: 15000, hotel: 15000, activities: 5000, transfers: 2000, taxes: 1999 },
    policies: { cancellation: 'Free cancellation 3 days before.', amendment: 'Date changes + ₹1000 fee.', payment: '25% advance.' },
    badge: 'Limited Offer', badgeColor: 'bg-red-500', discount: 19, originalPrice: 35999, travelers: 'Couple', duration: '3N / 4D', highlights: ['Mountain View', 'Trekking', 'Bonfire'],
  },
  {
    name: 'Honeymoon Special', destination: 'Maldives', confidenceScore: 96,
    whyThisBundle: 'Ultimate romantic escape with overwater villa and all-inclusive spa package.',
    outboundFlight: { airline: 'Air India', flightNumber: 'AI 261', departure: { airport: 'DEL', city: 'Delhi', time: '09:00' }, arrival: { airport: 'MLE', city: 'Male', time: '13:20' }, duration: '4h 20m', stops: 0, class: 'Economy', price: 18000, baggage: '25kg + 8kg' },
    returnFlight: { airline: 'Air India', flightNumber: 'AI 262', departure: { airport: 'MLE', city: 'Male', time: '14:30' }, arrival: { airport: 'DEL', city: 'Delhi', time: '19:50' }, duration: '4h 20m', stops: 0, class: 'Economy', price: 18000, baggage: '25kg + 8kg' },
    hotel: { name: 'Soneva Fushi', category: '5-star Luxury', rating: 4.9, location: 'Baa Atoll', area: 'Baa Atoll', images: [], amenities: ['Overwater Villa', 'Private Pool', 'Spa', 'All Inclusive', 'Diving'], roomType: 'Water Villa with Pool', mealPlan: 'All Inclusive', pricePerNight: 28000, totalPrice: 140000, nights: 5, cancellationPolicy: 'Free cancellation until 14 days before check-in' },
    activities: [{ name: 'Sunset Cruise', type: 'Romantic', duration: '2 hours', price: 5000 }, { name: 'Spa Couples Treatment', type: 'Wellness', duration: '3 hours', price: 8000 }],
    transfers: [{ type: 'Seaplane Transfer', vehicle: 'Seaplane', from: 'MLE', to: 'Resort', price: 12000 }, { type: 'Seaplane Transfer', vehicle: 'Seaplane', from: 'Resort', to: 'MLE', price: 12000 }],
    totalPrice: 189999, priceBreakdown: { flights: 36000, hotel: 140000, activities: 13000, transfers: 24000, taxes: 10999 },
    policies: { cancellation: 'Free cancellation 14 days before.', amendment: 'Date changes subject to availability.', payment: '40% advance.' },
    badge: 'Trending', badgeColor: 'bg-green-500', discount: 21, originalPrice: 239999, travelers: 'Couple', duration: '5N / 6D', highlights: ['Overwater Villa', 'Spa', 'All Inclusive'],
  },
];

const recentSearchesSeed = [
  { query: 'Goa beach trip for 2 adults and 1 child, mid December, budget 60k', destination: 'Goa', dates: 'Dec 15 - Dec 20', travelers: '2 Adults, 1 Child' },
  { query: 'Dubai luxury family holiday January', destination: 'Dubai', dates: 'Jan 10 - Jan 16', travelers: '4 Adults' },
  { query: 'Manali weekend couple adventure', destination: 'Manali', dates: 'Dec 22 - Dec 25', travelers: '2 Adults' },
];

async function seed() {
  try {
    await connectDB();

    const shouldClear = process.argv.includes('--clear');

    if (shouldClear) {
      console.log('Clearing existing data...');
      await Destination.deleteMany({});
      await Package.deleteMany({});
      await Trip.deleteMany({});
      await RecentSearch.deleteMany({});
      console.log('Collections cleared.');
    }

    console.log('Seeding destinations...');
    await Destination.insertMany(destinationsSeed, { ordered: false }).catch(() => {});
    console.log(`  → ${destinationsSeed.length} destinations`);

    console.log('Seeding packages...');
    await Package.insertMany(packagesSeed, { ordered: false }).catch(() => {});
    console.log(`  → ${packagesSeed.length} packages`);

    console.log('Seeding recent searches...');
    await RecentSearch.insertMany(recentSearchesSeed, { ordered: false }).catch(() => {});
    console.log(`  → ${recentSearchesSeed.length} recent searches`);

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
