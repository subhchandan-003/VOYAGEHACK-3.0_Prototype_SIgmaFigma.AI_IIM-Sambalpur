import { X, Check, Minus, Plane, Hotel, Car, MapPin, Star } from 'lucide-react';
import { TravelPackage } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface PackageComparisonProps {
  packages: TravelPackage[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (packageId: string) => void;
}

export function PackageComparison({ packages, isOpen, onClose, onSelectPackage }: PackageComparisonProps) {
  if (packages.length === 0) return null;

  const comparisonData = [
    {
      category: 'Price',
      icon: '₹',
      items: packages.map((pkg) => `₹${pkg.totalPrice.toLocaleString('en-IN')}`),
    },
    {
      category: 'Confidence Score',
      icon: Star,
      items: packages.map((pkg) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {pkg.confidenceScore}%
        </div>
      )),
    },
    {
      category: 'Outbound Flight',
      icon: Plane,
      items: packages.map((pkg) => (
        <div className="text-xs">
          <div className="font-medium">{pkg.outboundFlight.airline}</div>
          <div className="text-gray-600">{pkg.outboundFlight.flightNumber}</div>
          <div className="text-gray-600">{pkg.outboundFlight.departureTime} - {pkg.outboundFlight.arrivalTime}</div>
          <div className="text-gray-600">{pkg.outboundFlight.stops === 0 ? 'Non-stop' : `${pkg.outboundFlight.stops} stop(s)`}</div>
        </div>
      )),
    },
    {
      category: 'Return Flight',
      icon: Plane,
      items: packages.map((pkg) => (
        <div className="text-xs">
          <div className="font-medium">{pkg.returnFlight.airline}</div>
          <div className="text-gray-600">{pkg.returnFlight.flightNumber}</div>
          <div className="text-gray-600">{pkg.returnFlight.departureTime} - {pkg.returnFlight.arrivalTime}</div>
          <div className="text-gray-600">{pkg.returnFlight.stops === 0 ? 'Non-stop' : `${pkg.returnFlight.stops} stop(s)`}</div>
        </div>
      )),
    },
    {
      category: 'Hotel',
      icon: Hotel,
      items: packages.map((pkg) => (
        <div className="text-xs">
          <div className="font-medium">{pkg.hotel.name}</div>
          <div className="flex items-center gap-1 text-gray-600">
            {Array.from({ length: pkg.hotel.category }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-gray-600">{pkg.hotel.area}</div>
          <div className="text-gray-600">{pkg.hotel.roomType || 'Deluxe Room'}</div>
        </div>
      )),
    },
    {
      category: 'Transfer',
      icon: Car,
      items: packages.map((pkg) => (
        <div className="text-xs">
          <div className="font-medium">{pkg.transfer.type}</div>
          <div className="text-gray-600">{pkg.transfer.vehicle}</div>
        </div>
      )),
    },
    {
      category: 'Activities',
      icon: MapPin,
      items: packages.map((pkg) => (
        <div className="text-xs space-y-1">
          {pkg.activities.slice(0, 3).map((activity, idx) => (
            <div key={idx} className="flex items-start gap-1">
              <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{activity.name}</span>
            </div>
          ))}
          {pkg.activities.length > 3 && (
            <div className="text-gray-500">+{pkg.activities.length - 3} more</div>
          )}
        </div>
      )),
    },
    {
      category: 'Meals',
      icon: '🍽️',
      items: packages.map((pkg) => pkg.hotel.mealPlan || 'Breakfast Included'),
    },
    {
      category: 'Cancellation',
      icon: '📋',
      items: packages.map((pkg) => (
        <div className="text-xs">
          <div className={pkg.hotel.cancellationPolicy?.includes('Free') ? 'text-green-600' : 'text-orange-600'}>
            {pkg.hotel.cancellationPolicy || 'Flexible - Free cancellation'}
          </div>
        </div>
      )),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Packages</DialogTitle>
          <DialogDescription>
            Compare features and pricing across {packages.length} packages
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 bg-gray-50 sticky left-0 z-10 min-w-[150px]">
                  Features
                </th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 bg-gray-50 min-w-[200px]">
                    <div className="font-bold text-sm text-gray-900 mb-2">{pkg.name}</div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ₹{pkg.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <Button
                      onClick={() => {
                        onSelectPackage(pkg.id);
                        onClose();
                      }}
                      size="sm"
                      className="w-full"
                    >
                      Select
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-700 bg-white sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      {typeof row.icon === 'string' ? (
                        <span>{row.icon}</span>
                      ) : (
                        <row.icon className="w-4 h-4" />
                      )}
                      {row.category}
                    </div>
                  </td>
                  {row.items.map((item, itemIdx) => (
                    <td key={itemIdx} className="p-4 text-gray-700">
                      {typeof item === 'string' ? <div className="text-sm">{item}</div> : item}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
