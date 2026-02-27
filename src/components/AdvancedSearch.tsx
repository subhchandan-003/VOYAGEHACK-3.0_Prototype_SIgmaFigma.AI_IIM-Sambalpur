import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, MapPin, Calendar, Users, Home, Plane, Car, Shield, 
  Plus, Minus, ChevronDown, Star, UtensilsCrossed, X
} from 'lucide-react';
import { SearchIntent } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function AdvancedSearch() {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Basic search fields
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [childAges, setChildAges] = useState<number[]>([]);
  
  // Advanced filters
  const [flightClass, setFlightClass] = useState<'economy' | 'premium-economy' | 'business' | 'first'>('economy');
  const [hotelStarRating, setHotelStarRating] = useState<number[]>([3, 4, 5]);
  const [mealPlan, setMealPlan] = useState<'room-only' | 'breakfast' | 'half-board' | 'full-board' | 'all-inclusive'>('breakfast');
  const [transferRequired, setTransferRequired] = useState(true);
  const [transferType, setTransferType] = useState<'private' | 'shared'>('private');
  const [visaAssistance, setVisaAssistance] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(false);
  const [budget, setBudget] = useState(60000);
  const [flexible, setFlexible] = useState(false);
  
  const [showTravelersPopup, setShowTravelersPopup] = useState(false);

  const popularDestinations = [
    { name: 'Goa', type: 'Beach', image: '🏖️' },
    { name: 'Dubai', type: 'Luxury', image: '🏙️' },
    { name: 'Manali', type: 'Adventure', image: '⛰️' },
    { name: 'Kerala', type: 'Nature', image: '🌴' },
    { name: 'Maldives', type: 'Honeymoon', image: '🏝️' },
    { name: 'Singapore', type: 'Family', image: '🎡' },
  ];

  const handleSearch = () => {
    const nights = departureDate && returnDate 
      ? Math.ceil((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / (1000 * 60 * 60 * 24))
      : 5;

    const searchIntent: SearchIntent = {
      destination,
      nights,
      adults,
      children,
      budget,
      vibe: '',
      dates: `${departureDate} to ${returnDate}`,
      flexible,
      departureDate,
      returnDate,
      rooms,
      infants,
      childAges,
      flightClass,
      hotelStarRating,
      mealPlan,
      transferRequired,
      transferType,
      visaAssistance,
      travelInsurance,
    };

    navigate('/packages', { state: { searchIntent } });
  };

  const updateChildAges = (newChildCount: number) => {
    const currentAges = [...childAges];
    if (newChildCount > currentAges.length) {
      // Add default ages for new children
      while (currentAges.length < newChildCount) {
        currentAges.push(5);
      }
    } else if (newChildCount < currentAges.length) {
      // Remove ages for removed children
      currentAges.splice(newChildCount);
    }
    setChildAges(currentAges);
  };

  const toggleStarRating = (star: number) => {
    setHotelStarRating(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star)
        : [...prev, star].sort()
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
      {/* Main Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Destination */}
        <div className="lg:col-span-2">
          <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-gray-500" />
            Destination
          </Label>
          <Input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where do you want to go?"
            className="w-full"
          />
          
          {/* Popular Destinations */}
          {!destination && (
            <div className="flex flex-wrap gap-2 mt-3">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => setDestination(dest.name)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full text-xs text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <span>{dest.image}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div>
          <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-gray-500" />
            Check-in
          </Label>
          <Input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>

        {/* Return Date */}
        <div>
          <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-gray-500" />
            Check-out
          </Label>
          <Input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate || new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Travelers */}
        <div className="relative">
          <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Users className="w-4 h-4 text-gray-500" />
            Travelers & Rooms
          </Label>
          <button
            onClick={() => setShowTravelersPopup(!showTravelersPopup)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-sm">
              {adults + children + infants} Traveler{adults + children + infants > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showTravelersPopup && (
            <Card className="absolute top-full mt-2 w-full md:w-80 z-50 shadow-xl">
              <CardContent className="p-4 space-y-4">
                {/* Rooms */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Rooms</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{rooms}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRooms(Math.min(10, rooms + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Adults</div>
                    <div className="text-xs text-gray-500">12+ years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(Math.min(20, adults + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Children</div>
                    <div className="text-xs text-gray-500">2-12 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const newCount = Math.max(0, children - 1);
                        setChildren(newCount);
                        updateChildAges(newCount);
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const newCount = Math.min(10, children + 1);
                        setChildren(newCount);
                        updateChildAges(newCount);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Child Ages */}
                {children > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium mb-2">Children's Ages</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: children }).map((_, index) => (
                        <div key={index}>
                          <Label className="text-xs text-gray-600">Child {index + 1}</Label>
                          <Select
                            value={childAges[index]?.toString() || '5'}
                            onValueChange={(value) => {
                              const newAges = [...childAges];
                              newAges[index] = parseInt(value);
                              setChildAges(newAges);
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 11 }, (_, i) => i + 2).map((age) => (
                                <SelectItem key={age} value={age.toString()}>
                                  {age} years
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Infants</div>
                    <div className="text-xs text-gray-500">Under 2 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{infants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setInfants(Math.min(4, infants + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => setShowTravelersPopup(false)}
                  className="w-full"
                  size="sm"
                >
                  Done
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Flight Class */}
        <div>
          <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Plane className="w-4 h-4 text-gray-500" />
            Flight Class
          </Label>
          <Select value={flightClass} onValueChange={(value: any) => setFlightClass(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium-economy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div>
          <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
            Budget (₹)
          </Label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="60000"
            className="w-full"
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          {/* Hotel Star Rating */}
          <div>
            <Label className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Star className="w-4 h-4 text-gray-500" />
              Hotel Star Rating
            </Label>
            <div className="flex gap-2">
              {[3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => toggleStarRating(star)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    hotelStarRating.includes(star)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {star} <Star className="w-3 h-3 inline fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
                <UtensilsCrossed className="w-4 h-4 text-gray-500" />
                Meal Plan
              </Label>
              <Select value={mealPlan} onValueChange={(value: any) => setMealPlan(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room-only">Room Only</SelectItem>
                  <SelectItem value="breakfast">Breakfast Included</SelectItem>
                  <SelectItem value="half-board">Half Board (Breakfast + Dinner)</SelectItem>
                  <SelectItem value="full-board">Full Board (All Meals)</SelectItem>
                  <SelectItem value="all-inclusive">All Inclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transfer Type */}
            <div>
              <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
                <Car className="w-4 h-4 text-gray-500" />
                Airport Transfer
              </Label>
              <Select 
                value={transferRequired ? transferType : 'none'} 
                onValueChange={(value) => {
                  if (value === 'none') {
                    setTransferRequired(false);
                  } else {
                    setTransferRequired(true);
                    setTransferType(value as 'private' | 'shared');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Transfer</SelectItem>
                  <SelectItem value="shared">Shared Transfer</SelectItem>
                  <SelectItem value="private">Private Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <Label className="mb-3 text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              Additional Services
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  checked={visaAssistance}
                  onChange={(e) => setVisaAssistance(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Visa Assistance</div>
                  <div className="text-xs text-gray-500">+ ₹2,500 per person</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  checked={travelInsurance}
                  onChange={(e) => setTravelInsurance(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Travel Insurance</div>
                  <div className="text-xs text-gray-500">+ ₹999 per person</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  checked={flexible}
                  onChange={(e) => setFlexible(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Flexible Dates</div>
                  <div className="text-xs text-gray-500">±3 days from selected dates</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Search Button */}
      <div className="mt-6">
        <Button
          onClick={handleSearch}
          disabled={!destination || !departureDate || !returnDate}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Packages
        </Button>
      </div>
    </div>
  );
}
