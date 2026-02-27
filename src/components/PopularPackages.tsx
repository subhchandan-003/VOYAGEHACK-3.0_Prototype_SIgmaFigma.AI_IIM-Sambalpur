import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Calendar, Users, Star, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { packageApi } from '../services/api';

interface PopularPkg {
  id: string;
  destination: string;
  title: string;
  duration: string;
  travelers: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
  highlights: string[];
  image: string;
}

const FALLBACK_PACKAGES: PopularPkg[] = [
  {
    id: 'pop-1', destination: 'Goa', title: 'Beach Paradise Package', duration: '4N / 5D', travelers: '2 Adults',
    price: 42999, originalPrice: 54999, discount: 22, rating: 4.7, reviews: 2840,
    badge: 'Best Seller', badgeColor: 'bg-orange-500', highlights: ['Beach Resort', 'Water Sports', 'Airport Transfer'],
    image: 'https://images.unsplash.com/photo-1701421016474-09b19faa9f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHb2ElMjBJbmRpYSUyMGx1eHVyeSUyMGJlYWNoJTIwcmVzb3J0JTIwcG9vbHxlbnwxfHx8fDE3NzIwMjA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'pop-2', destination: 'Dubai', title: 'Luxury Shopping Extravaganza', duration: '5N / 6D', travelers: 'Family of 4',
    price: 124999, originalPrice: 149999, discount: 17, rating: 4.9, reviews: 1920,
    badge: 'Premium', badgeColor: 'bg-purple-500', highlights: ['5-Star Hotel', 'Desert Safari', 'City Tour'],
    image: 'https://images.unsplash.com/photo-1664607069803-96e9d885050e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMGx1eHVyeSUyMGhvdGVsJTIwZGVzZXJ0JTIwc2FmYXJpJTIwZXZlbmluZ3xlbnwxfHx8fDE3NzIwMjA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'pop-3', destination: 'Manali', title: 'Adventure Seeker Special', duration: '3N / 4D', travelers: 'Couple',
    price: 28999, originalPrice: 35999, discount: 19, rating: 4.6, reviews: 1560,
    badge: 'Limited Offer', badgeColor: 'bg-red-500', highlights: ['Mountain View', 'Trekking', 'Bonfire'],
    image: 'https://images.unsplash.com/photo-1675515642372-cf31b44f802f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYW5hbGklMjBJbmRpYSUyMGFkdmVudHVyZSUyMHRyZWtraW5nJTIwc25vd3xlbnwxfHx8fDE3NzIwMjA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'pop-4', destination: 'Maldives', title: 'Honeymoon Special', duration: '5N / 6D', travelers: 'Couple',
    price: 189999, originalPrice: 239999, discount: 21, rating: 4.9, reviews: 980,
    badge: 'Trending', badgeColor: 'bg-green-500', highlights: ['Overwater Villa', 'Spa', 'All Inclusive'],
    image: 'https://images.unsplash.com/flagged/photo-1564469780912-79870c424161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxkaXZlcyUyMG92ZXJ3YXRlciUyMHZpbGxhJTIwaG9uZXltb29uJTIwc3Vuc2V0fGVufDF8fHx8MTc3MjAyMDg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function PopularPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PopularPkg[]>(FALLBACK_PACKAGES);

  // Try fetching from Express/MongoDB API
  useEffect(() => {
    packageApi.getAll({ sortBy: 'confidence' }).then(({ data, fromApi }) => {
      if (fromApi && data && data.length > 0) {
        const mapped: PopularPkg[] = data.slice(0, 4).map((p: any) => ({
          id: p._id || p.id,
          destination: p.destination,
          title: p.name,
          duration: p.duration || '4N / 5D',
          travelers: p.travelers || '2 Adults',
          price: p.totalPrice,
          originalPrice: p.originalPrice || Math.round(p.totalPrice * 1.2),
          discount: p.discount || 20,
          rating: p.hotel?.rating || 4.5,
          reviews: p.hotel?.reviewCount || 1000,
          badge: p.badge || 'Popular',
          badgeColor: p.badgeColor || 'bg-blue-500',
          highlights: p.highlights || [],
          image: FALLBACK_PACKAGES.find(f => f.destination === p.destination)?.image || FALLBACK_PACKAGES[0].image,
        }));
        setPackages(mapped);
      }
    });
  }, []);

  const handlePackageClick = (pkg: PopularPkg) => {
    const query = `${pkg.destination}, ${pkg.duration}, ${pkg.travelers}, budget ₹${pkg.price}`;
    navigate('/packages', { state: { query } });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900">Popular Packages</h2>
          </div>
          <p className="text-sm text-gray-500">Handpicked deals with the best value for your clients</p>
        </div>
        <button className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-gray-100"
            onClick={() => handlePackageClick(pkg)}
          >
            <div className="relative h-48">
              <ImageWithFallback
                src={pkg.image}
                alt={pkg.destination}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className={`${pkg.badgeColor} text-white border-0 shadow-lg`}>
                  {pkg.badge}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-red-600 shadow-sm">
                {pkg.discount}% OFF
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{pkg.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    {pkg.destination}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {pkg.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {pkg.travelers}
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">{pkg.rating}</span>
                <span className="text-xs text-gray-500">({pkg.reviews.toLocaleString('en-IN')} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {pkg.highlights.map((highlight, index) => (
                  <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</div>
                  <div className="text-xl font-bold text-gray-900">₹{pkg.price.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500">per package</div>
                </div>
                <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  View Details →
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
