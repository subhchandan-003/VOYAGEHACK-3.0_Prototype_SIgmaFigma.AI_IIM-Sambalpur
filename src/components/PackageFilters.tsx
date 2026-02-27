import { useState } from 'react';
import { Filter, X, Star, Plane, Hotel, Clock, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface FilterOptions {
  priceRange: [number, number];
  airlines: string[];
  stops: number[];
  departureTime: string[];
  hotelStars: number[];
  mealPlans: string[];
  transferIncluded: boolean;
}

interface PackageFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  isMobile?: boolean;
}

export function PackageFilters({ onFilterChange, isMobile = false }: PackageFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [20000, 200000],
    airlines: [],
    stops: [],
    departureTime: [],
    hotelStars: [],
    mealPlans: [],
    transferIncluded: false,
  });

  const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Emirates', 'Qatar Airways'];
  const stopsOptions = [
    { value: 0, label: 'Non-stop' },
    { value: 1, label: '1 Stop' },
    { value: 2, label: '2+ Stops' },
  ];
  const departureTimeSlots = [
    { value: 'early-morning', label: 'Early Morning (12am - 6am)' },
    { value: 'morning', label: 'Morning (6am - 12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm - 6pm)' },
    { value: 'evening', label: 'Evening (6pm - 12am)' },
  ];
  const mealPlanOptions = ['Room Only', 'Breakfast', 'Half Board', 'Full Board', 'All Inclusive'];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: any) => {
    const currentArray = filters[key] as any[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterOptions = {
      priceRange: [20000, 200000],
      airlines: [],
      stops: [],
      departureTime: [],
      hotelStars: [],
      mealPlans: [],
      transferIncluded: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFiltersCount = 
    filters.airlines.length +
    filters.stops.length +
    filters.departureTime.length +
    filters.hotelStars.length +
    filters.mealPlans.length +
    (filters.transferIncluded ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Range
          </Label>
          <span className="text-sm text-gray-600">
            ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          min={10000}
          max={300000}
          step={5000}
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹10k</span>
          <span>₹300k</span>
        </div>
      </div>

      {/* Airlines */}
      <div>
        <Label className="font-semibold flex items-center gap-2 mb-3">
          <Plane className="w-4 h-4" />
          Airlines
        </Label>
        <div className="space-y-2">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.airlines.includes(airline)}
                onCheckedChange={() => toggleArrayFilter('airlines', airline)}
              />
              <span className="text-sm text-gray-700">{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stops */}
      <div>
        <Label className="font-semibold flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          Number of Stops
        </Label>
        <div className="space-y-2">
          {stopsOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.stops.includes(option.value)}
                onCheckedChange={() => toggleArrayFilter('stops', option.value)}
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <Label className="font-semibold flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          Departure Time
        </Label>
        <div className="space-y-2">
          {departureTimeSlots.map((slot) => (
            <label key={slot.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.departureTime.includes(slot.value)}
                onCheckedChange={() => toggleArrayFilter('departureTime', slot.value)}
              />
              <span className="text-sm text-gray-700">{slot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Hotel Stars */}
      <div>
        <Label className="font-semibold flex items-center gap-2 mb-3">
          <Hotel className="w-4 h-4" />
          Hotel Star Rating
        </Label>
        <div className="flex gap-2">
          {[3, 4, 5].map((stars) => (
            <button
              key={stars}
              onClick={() => toggleArrayFilter('hotelStars', stars)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.hotelStars.includes(stars)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {stars} <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Meal Plans */}
      <div>
        <Label className="font-semibold mb-3 block">Meal Plans</Label>
        <div className="space-y-2">
          {mealPlanOptions.map((plan) => (
            <label key={plan} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.mealPlans.includes(plan)}
                onCheckedChange={() => toggleArrayFilter('mealPlans', plan)}
              />
              <span className="text-sm text-gray-700">{plan}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transfer Included */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.transferIncluded}
            onCheckedChange={(checked) => handleFilterChange('transferIncluded', checked)}
          />
          <span className="text-sm font-medium text-gray-700">Airport Transfer Included</span>
        </label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter Packages</SheetTitle>
            <SheetDescription>
              Refine your search with these filters
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </h3>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </div>
      <FilterContent />
    </Card>
  );
}
