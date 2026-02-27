import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, ArrowRight, Star, Flame, Clock, Plane, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { destinationApi } from '../services/api';

type Category = 'all' | 'india' | 'international' | 'beach' | 'mountain' | 'heritage';

interface Destination {
  name: string;
  country: string;
  tagline: string;
  startingPrice: number;
  image: string;
  color: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  bestTime: string;
  flightTime: string;
  categories: Category[];
}

// Local fallback data used when the Express API is unreachable
const FALLBACK_DESTINATIONS: Destination[] = [
  { name: 'Goa', country: 'India', tagline: 'Sun, Sand & Serenity', startingPrice: 18999, image: 'https://images.unsplash.com/photo-1698430184854-17aa542d247c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHb2ElMjBiZWFjaCUyMHRyb3BpY2FsJTIwc3Vuc2V0JTIwSW5kaWF8ZW58MXx8fHwxNzcyMDIwNjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-orange-500/90 to-amber-600/90', rating: 4.7, reviews: 2840, badge: 'Best Seller', badgeColor: 'bg-orange-500', bestTime: 'Oct - Mar', flightTime: '2h 15m', categories: ['india', 'beach'] },
  { name: 'Dubai', country: 'UAE', tagline: 'Luxury Beyond Limits', startingPrice: 54999, image: 'https://images.unsplash.com/photo-1657106251952-2d584ebdf886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBCdXJqJTIwS2hhbGlmYSUyMG5pZ2h0fGVufDF8fHx8MTc3MjAyMDQyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-purple-600/90 to-indigo-700/90', rating: 4.9, reviews: 1920, badge: 'Premium', badgeColor: 'bg-purple-500', bestTime: 'Nov - Mar', flightTime: '3h 30m', categories: ['international'] },
  { name: 'Maldives', country: 'Maldives', tagline: 'Paradise on Water', startingPrice: 89999, image: 'https://images.unsplash.com/photo-1633503609367-c74b3795329c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxkaXZlcyUyMG92ZXJ3YXRlciUyMGJ1bmdhbG93JTIwY3J5c3RhbCUyMGJsdWV8ZW58MXx8fHwxNzcyMDIwNjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-cyan-500/90 to-blue-600/90', rating: 4.9, reviews: 980, badge: 'Honeymoon', badgeColor: 'bg-pink-500', bestTime: 'Nov - Apr', flightTime: '4h 20m', categories: ['international', 'beach'] },
  { name: 'Bali', country: 'Indonesia', tagline: 'Island of the Gods', startingPrice: 45999, image: 'https://images.unsplash.com/photo-1703222421255-aca13345c288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwcmljZSUyMHRlcnJhY2UlMjB0ZW1wbGUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzIwMjA0MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-emerald-500/90 to-teal-600/90', rating: 4.8, reviews: 2150, badge: 'Trending', badgeColor: 'bg-green-500', bestTime: 'Apr - Oct', flightTime: '8h 00m', categories: ['international', 'beach'] },
  { name: 'Manali', country: 'India', tagline: 'Mountains Calling', startingPrice: 15999, image: 'https://images.unsplash.com/photo-1655468981043-eccbf08b1d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYW5hbGklMjBzbm93JTIwbW91bnRhaW5zJTIwSGltYWxheWFzfGVufDF8fHx8MTc3MjAyMDQyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-sky-500/90 to-blue-700/90', rating: 4.6, reviews: 1560, bestTime: 'Oct - Feb', flightTime: '1h 50m', categories: ['india', 'mountain'] },
  { name: 'Singapore', country: 'Singapore', tagline: 'Garden City Wonders', startingPrice: 62999, image: 'https://images.unsplash.com/photo-1652843134988-6fafc5121ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaW5nYXBvcmUlMjBNYXJpbmElMjBCYXklMjBTYW5kcyUyMHNreWxpbmV8ZW58MXx8fHwxNzcyMDAzNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-pink-500/90 to-rose-600/90', rating: 4.7, reviews: 1340, bestTime: 'Year Round', flightTime: '5h 30m', categories: ['international'] },
  { name: 'Jaipur', country: 'India', tagline: 'Royal Heritage Trail', startingPrice: 12999, image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWlwdXIlMjBIYXdhJTIwTWFoYWwlMjBwaW5rJTIwcGFsYWNlJTIwSW5kaWF8ZW58MXx8fHwxNzcyMDIwNDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-rose-500/90 to-red-600/90', rating: 4.5, reviews: 1890, bestTime: 'Oct - Mar', flightTime: '2h 00m', categories: ['india', 'heritage'] },
  { name: 'Thailand', country: 'Thailand', tagline: 'Tropical Bliss & Culture', startingPrice: 35999, image: 'https://images.unsplash.com/photo-1559882203-fa7d5f167422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMFBodWtldCUyMHRyb3BpY2FsJTIwYmVhY2glMjBpc2xhbmR8ZW58MXx8fHwxNzcyMDIwNDMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-yellow-500/90 to-orange-600/90', rating: 4.7, reviews: 2310, bestTime: 'Nov - Feb', flightTime: '4h 00m', categories: ['international', 'beach'] },
  { name: 'Paris', country: 'France', tagline: 'City of Love & Lights', startingPrice: 125999, image: 'https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEVpZmZlbCUyMFRvd2VyJTIwcm9tYW50aWMlMjBldmVuaW5nfGVufDF8fHx8MTc3MjAyMDYzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-violet-500/90 to-purple-700/90', rating: 4.8, reviews: 1640, badge: 'Romantic', badgeColor: 'bg-pink-600', bestTime: 'Apr - Jun', flightTime: '9h 00m', categories: ['international', 'heritage'] },
  { name: 'Santorini', country: 'Greece', tagline: 'Aegean Dream Escape', startingPrice: 139999, image: 'https://images.unsplash.com/photo-1719607526486-96f27a995fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW50b3JpbmklMjBHcmVlY2UlMjB3aGl0ZSUyMGJsdWUlMjBkb21lcyUyMHN1bnNldHxlbnwxfHx8fDE3NzIwMjA2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-blue-500/90 to-indigo-600/90', rating: 4.9, reviews: 870, badge: 'Dream Dest.', badgeColor: 'bg-indigo-500', bestTime: 'May - Oct', flightTime: '10h 30m', categories: ['international', 'beach'] },
  { name: 'Switzerland', country: 'Switzerland', tagline: 'Alpine Wonderland', startingPrice: 159999, image: 'https://images.unsplash.com/photo-1607972467949-db144d1227d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTd2lzcyUyMEFscHMlMjBtb3VudGFpbnMlMjBzY2VuaWMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcyMDIwNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-teal-500/90 to-emerald-700/90', rating: 4.9, reviews: 1120, badge: 'Luxury', badgeColor: 'bg-amber-600', bestTime: 'Jun - Sep', flightTime: '8h 30m', categories: ['international', 'mountain'] },
  { name: 'Tokyo', country: 'Japan', tagline: 'Future Meets Tradition', startingPrice: 95999, image: 'https://images.unsplash.com/photo-1663511174063-48de51073e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMEphcGFuJTIwbmVvbiUyMGNpdHlzY2FwZSUyMG5pZ2h0fGVufDF8fHx8MTc3MjAyMDYzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-red-500/90 to-rose-700/90', rating: 4.8, reviews: 1450, bestTime: 'Mar - May', flightTime: '8h 00m', categories: ['international', 'heritage'] },
  { name: 'Kerala', country: 'India', tagline: "God's Own Country", startingPrice: 22999, image: 'https://images.unsplash.com/photo-1707893013488-51672ef83425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXJzJTIwaG91c2Vib2F0JTIwSW5kaWF8ZW58MXx8fHwxNzcxOTkzOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-green-500/90 to-emerald-600/90', rating: 4.7, reviews: 2060, badge: 'Top Rated', badgeColor: 'bg-teal-500', bestTime: 'Sep - Mar', flightTime: '2h 40m', categories: ['india', 'beach'] },
  { name: 'Udaipur', country: 'India', tagline: 'Venice of the East', startingPrice: 16999, image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVZGFpcHVyJTIwbGFrZSUyMHBhbGFjZSUyMFJhamFzdGhhbiUyMEluZGlhfGVufDF8fHx8MTc3MjAwNzg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-amber-500/90 to-yellow-600/90', rating: 4.6, reviews: 1380, bestTime: 'Oct - Mar', flightTime: '1h 45m', categories: ['india', 'heritage'] },
  { name: 'Istanbul', country: 'Turkey', tagline: 'Where East Meets West', startingPrice: 72999, image: 'https://images.unsplash.com/photo-1572280075160-be1ab588d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bCUyMFR1cmtleSUyMG1vc3F1ZSUyMEJvc3Bob3J1cyUyMHN1bnNldHxlbnwxfHx8fDE3NzIwMjA2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-orange-600/90 to-red-700/90', rating: 4.7, reviews: 1190, bestTime: 'Apr - Jun', flightTime: '6h 30m', categories: ['international', 'heritage'] },
  { name: 'Vietnam', country: 'Vietnam', tagline: 'Halong Bay & Beyond', startingPrice: 42999, image: 'https://images.unsplash.com/photo-1759853697456-c7c86c81cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtJTIwSGFsb25nJTIwQmF5JTIwc2NlbmljJTIwbGltZXN0b25lfGVufDF8fHx8MTc3MjAyMDYzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-lime-500/90 to-green-600/90', rating: 4.6, reviews: 920, bestTime: 'Feb - Apr', flightTime: '5h 00m', categories: ['international', 'beach'] },
  { name: 'Mauritius', country: 'Mauritius', tagline: 'Tropical Island Bliss', startingPrice: 78999, image: 'https://images.unsplash.com/photo-1768737817241-bbf91eb38158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYXVyaXRpdXMlMjBiZWFjaCUyMHRyb3BpY2FsJTIwcmVzb3J0fGVufDF8fHx8MTc3MjAyMDYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-cyan-500/90 to-teal-600/90', rating: 4.8, reviews: 760, badge: 'Honeymoon', badgeColor: 'bg-pink-500', bestTime: 'May - Dec', flightTime: '7h 00m', categories: ['international', 'beach'] },
  { name: 'New Zealand', country: 'New Zealand', tagline: 'Epic Adventure Awaits', startingPrice: 185999, image: 'https://images.unsplash.com/photo-1668010882703-fb9fc62c250a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXclMjBaZWFsYW5kJTIwZmpvcmQlMjBtb3VudGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcyMDIwNjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-blue-600/90 to-sky-700/90', rating: 4.9, reviews: 640, badge: 'Adventure', badgeColor: 'bg-blue-600', bestTime: 'Dec - Mar', flightTime: '14h 00m', categories: ['international', 'mountain'] },
  { name: 'Sri Lanka', country: 'Sri Lanka', tagline: 'Pearl of the Indian Ocean', startingPrice: 38999, image: 'https://images.unsplash.com/photo-1558871625-e6582689bbda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYSUyMGFuY2llbnQlMjB0ZW1wbGUlMjBzY2VuaWN8ZW58MXx8fHwxNzcyMDIwNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-amber-500/90 to-orange-600/90', rating: 4.5, reviews: 810, bestTime: 'Dec - Mar', flightTime: '2h 00m', categories: ['international', 'beach', 'heritage'] },
  { name: 'Egypt', country: 'Egypt', tagline: 'Land of the Pharaohs', startingPrice: 68999, image: 'https://images.unsplash.com/photo-1705874930271-88eeb8f533dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFZ3lwdCUyMHB5cmFtaWRzJTIwR2l6YSUyMGRlc2VydHxlbnwxfHx8fDE3NzIwMjA2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-yellow-600/90 to-amber-700/90', rating: 4.6, reviews: 950, bestTime: 'Oct - Apr', flightTime: '5h 30m', categories: ['international', 'heritage'] },
  { name: 'Rome', country: 'Italy', tagline: 'Eternal City of Wonders', startingPrice: 119999, image: 'https://images.unsplash.com/photo-1662898290891-a6c7f022e851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21lJTIwQ29sb3NzZXVtJTIwSXRhbHklMjBhbmNpZW50fGVufDF8fHx8MTc3MTk1MDgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-stone-500/90 to-neutral-700/90', rating: 4.8, reviews: 1520, bestTime: 'Apr - Jun', flightTime: '9h 30m', categories: ['international', 'heritage'] },
  { name: 'Andaman', country: 'India', tagline: 'Turquoise Island Paradise', startingPrice: 32999, image: 'https://images.unsplash.com/photo-1767784543748-1f587672851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBbmRhbWFuJTIwSXNsYW5kcyUyMHR1cnF1b2lzZSUyMHdhdGVyJTIwSW5kaWF8ZW58MXx8fHwxNzcyMDIwNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', color: 'from-teal-500/90 to-cyan-600/90', rating: 4.7, reviews: 1150, badge: 'Hidden Gem', badgeColor: 'bg-emerald-600', bestTime: 'Nov - May', flightTime: '2h 30m', categories: ['india', 'beach'] },
];

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Destinations' },
  { id: 'india', label: 'India' },
  { id: 'international', label: 'International' },
  { id: 'beach', label: 'Beach & Islands' },
  { id: 'mountain', label: 'Mountains' },
  { id: 'heritage', label: 'Heritage & Culture' },
];

export function TrendingDestinations() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>(FALLBACK_DESTINATIONS);

  // Try fetching from Express/MongoDB API; fall back to local data
  useEffect(() => {
    destinationApi.getAll().then(({ data, fromApi }) => {
      if (fromApi && data && data.length > 0) {
        setDestinations(data);
      }
    });
  }, []);

  const filteredDestinations = activeCategory === 'all'
    ? destinations
    : destinations.filter(d => d.categories.includes(activeCategory));

  const displayedDestinations = showAll ? filteredDestinations : filteredDestinations.slice(0, 8);

  const handleClick = (dest: Destination) => {
    navigate('/packages', { state: { query: `${dest.name}, 4 nights, 2 adults, budget ₹${dest.startingPrice * 2}` } });
  };

  const featured = destinations.find(d => d.badge === 'Best Seller') || destinations[0];

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Trending Destinations</h2>
          </div>
          <p className="text-sm text-gray-500">Most booked by travel agents this month &middot; {destinations.length} destinations</p>
        </div>
        <button
          onClick={() => navigate('/packages', { state: { query: 'Popular destinations' } })}
          className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group"
        >
          Explore All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Featured Hero Card */}
      <button
        onClick={() => handleClick(featured)}
        className="relative w-full rounded-2xl overflow-hidden mb-6 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ height: '280px' }}
      >
        <ImageWithFallback
          src={featured.image}
          alt={featured.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center p-6 sm:p-10 text-left">
          <div className="max-w-lg">
            {featured.badge && (
              <span className={`${featured.badgeColor} text-white text-xs px-3 py-1 rounded-full inline-block mb-3`}>
                {featured.badge}
              </span>
            )}
            <h3 className="text-white font-bold text-2xl sm:text-3xl mb-1">{featured.name}, {featured.country}</h3>
            <p className="text-white/80 text-sm sm:text-base mb-3">{featured.tagline}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm mb-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-medium">{featured.rating}</span>
                <span>({featured.reviews.toLocaleString('en-IN')})</span>
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.bestTime}</span>
              <span className="flex items-center gap-1"><Plane className="w-3.5 h-3.5" /> {featured.flightTime}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                Starting from <span className="text-xl sm:text-2xl font-bold">₹{featured.startingPrice.toLocaleString('en-IN')}</span>
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-white/30 transition-colors">
                View Packages →
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Category Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setShowAll(false); }}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayedDestinations.map((dest) => (
          <button
            key={dest.name}
            onClick={() => handleClick(dest)}
            onMouseEnter={() => setHoveredCard(dest.name)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-xl transition-shadow"
          >
            <ImageWithFallback
              src={dest.image}
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} via-transparent from-black/80 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity`} />

            {dest.badge && (
              <div className="absolute top-3 left-3">
                <span className={`${dest.badgeColor} text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium shadow-lg`}>
                  {dest.badge}
                </span>
              </div>
            )}

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
              <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
                <Heart className="w-4 h-4 text-white" />
              </span>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-left">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-xs font-medium">{dest.rating}</span>
                <span className="text-white/60 text-[10px]">({dest.reviews.toLocaleString('en-IN')})</span>
              </div>

              <div className="flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-white/80" />
                <span className="text-white/80 text-xs">{dest.country}</span>
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg leading-tight">{dest.name}</h3>
              <p className="text-white/70 text-xs mt-0.5 hidden sm:block">{dest.tagline}</p>

              <div className={`overflow-hidden transition-all duration-300 ${hoveredCard === dest.name ? 'max-h-20 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/60">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dest.bestTime}</span>
                  <span className="flex items-center gap-1"><Plane className="w-3 h-3" /> {dest.flightTime}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-white/90 text-xs">
                  From <span className="font-bold text-white text-sm">₹{dest.startingPrice.toLocaleString('en-IN')}</span>
                </span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredDestinations.length > 8 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm flex items-center gap-2"
          >
            {showAll ? 'Show Less' : `Show All ${filteredDestinations.length} Destinations`}
            <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>
      )}
    </section>
  );
}
