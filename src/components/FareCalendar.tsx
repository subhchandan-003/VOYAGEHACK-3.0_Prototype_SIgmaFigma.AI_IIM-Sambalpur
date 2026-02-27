import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface FareCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export function FareCalendar({ onDateSelect, selectedDate }: FareCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate mock prices for the next 30 days
  const generateFareDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const basePrice = 45000;
      const variance = Math.random() * 20000 - 10000;
      const price = Math.round(basePrice + variance);
      
      // Determine availability
      const random = Math.random();
      let availability: 'available' | 'limited' | 'sold-out';
      if (random > 0.85) availability = 'sold-out';
      else if (random > 0.6) availability = 'limited';
      else availability = 'available';
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        price,
        availability,
        isPeak: date.getDay() === 0 || date.getDay() === 6, // weekends
      });
    }
    
    return dates;
  };

  const fareDates = generateFareDates();
  const lowestPrice = Math.min(...fareDates.filter(d => d.availability !== 'sold-out').map(d => d.price));

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'sold-out':
        return 'bg-gray-200 text-gray-400 cursor-not-allowed';
      case 'limited':
        return 'bg-orange-50 border-orange-200 hover:border-orange-400';
      default:
        return 'bg-white border-gray-200 hover:border-blue-400';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Best Fares</h3>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <TrendingDown className="w-3 h-3 text-green-600" />
          Lowest: ₹{lowestPrice.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
        {fareDates.slice(0, 20).map((fareDate) => (
          <button
            key={fareDate.date}
            onClick={() => fareDate.availability !== 'sold-out' && onDateSelect(fareDate.date)}
            disabled={fareDate.availability === 'sold-out'}
            className={`relative p-2 border rounded-lg transition-all ${getAvailabilityColor(fareDate.availability)} ${
              selectedDate === fareDate.date ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            <div className="text-xs text-gray-600 font-medium">{fareDate.dayName}</div>
            <div className="text-sm font-bold text-gray-900">{fareDate.day}</div>
            {fareDate.availability !== 'sold-out' ? (
              <div className={`text-xs font-semibold mt-1 ${
                fareDate.price === lowestPrice ? 'text-green-600' : 'text-gray-700'
              }`}>
                ₹{(fareDate.price / 1000).toFixed(0)}k
              </div>
            ) : (
              <div className="text-xs text-gray-400 mt-1">Full</div>
            )}
            {fareDate.isPeak && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" title="Peak season" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded" />
            <span>Limited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <span>Sold Out</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
