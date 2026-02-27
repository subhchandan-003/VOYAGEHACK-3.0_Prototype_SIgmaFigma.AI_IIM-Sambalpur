import { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, Users, X } from 'lucide-react';
import { Card } from './ui/card';
import { searchApi } from '../services/api';

interface RecentSearch {
  id: string;
  destination: string;
  dates: string;
  travelers: string;
  timestamp: string;
}

interface RecentSearchesProps {
  onSearchSelect: (search: RecentSearch) => void;
}

// Local fallback
const FALLBACK_SEARCHES: RecentSearch[] = [
  { id: '1', destination: 'Goa', dates: 'Dec 15 - Dec 20', travelers: '2 Adults, 1 Child', timestamp: '2 hours ago' },
  { id: '2', destination: 'Dubai', dates: 'Jan 10 - Jan 16', travelers: '4 Adults', timestamp: '1 day ago' },
  { id: '3', destination: 'Manali', dates: 'Dec 22 - Dec 25', travelers: '2 Adults', timestamp: '3 days ago' },
];

export function RecentSearches({ onSearchSelect }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(FALLBACK_SEARCHES);

  // Try fetching from Express API
  useEffect(() => {
    searchApi.getRecent().then(({ data, fromApi }) => {
      if (fromApi && data && data.length > 0) {
        const mapped = data.map((s: any) => ({
          id: s._id || s.id,
          destination: s.destination,
          dates: s.dates || '',
          travelers: s.travelers || '',
          timestamp: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recently',
        }));
        setRecentSearches(mapped);
      }
    });
  }, []);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Remove from API if connected, else remove locally
    searchApi.delete(id).catch(() => {});
    setRecentSearches(prev => prev.filter(s => s.id !== id));
  };

  if (recentSearches.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recentSearches.map((search) => (
          <Card
            key={search.id}
            className="p-3 hover:shadow-md transition-all cursor-pointer group relative"
            onClick={() => onSearchSelect(search)}
          >
            <button
              onClick={(e) => handleRemove(e, search.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-900">{search.destination}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                {search.dates}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="w-3 h-3" />
                {search.travelers}
              </div>

              <div className="text-xs text-gray-500">{search.timestamp}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
