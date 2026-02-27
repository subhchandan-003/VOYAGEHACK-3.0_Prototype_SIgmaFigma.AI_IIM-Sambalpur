import { useState } from 'react';
import { MapPin, Info, Sun, Umbrella, Calendar, DollarSign, Users, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DestinationGuideProps {
  destination: string;
}

export function DestinationGuide({ destination }: DestinationGuideProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock destination data - in real app, fetch from API
  const destinationData = {
    name: destination,
    description: `${destination} is a popular destination known for its stunning landscapes, rich culture, and world-class hospitality. Perfect for travelers seeking adventure, relaxation, and unforgettable experiences.`,
    bestTimeToVisit: 'October to March',
    weatherInfo: '25-30°C, Pleasant weather with minimal rainfall',
    currency: '₹ INR (Indian Rupee)',
    language: 'Hindi, English',
    visaRequired: 'Indian citizens - No visa required',
    highlights: [
      'Pristine beaches and water sports',
      'Historic forts and monuments',
      'Vibrant nightlife and entertainment',
      'Local cuisine and seafood delicacies',
      'Shopping markets and bazaars',
      'Adventure activities and excursions',
    ],
    topAttractions: [
      { name: 'Beach Paradise', type: 'Nature', time: '2-3 hours' },
      { name: 'Historic Fort', type: 'Culture', time: '1-2 hours' },
      { name: 'Water Sports Center', type: 'Adventure', time: '3-4 hours' },
      { name: 'Local Market', type: 'Shopping', time: '2-3 hours' },
    ],
    travelTips: [
      'Book accommodations in advance during peak season',
      'Try local street food from recommended vendors',
      'Carry sunscreen and stay hydrated',
      'Respect local customs and traditions',
      'Keep emergency contacts handy',
      'Use authorized tour operators for activities',
    ],
    budgetGuide: {
      budget: '₹2,000 - ₹3,500 per day',
      midRange: '₹3,500 - ₹7,000 per day',
      luxury: '₹7,000+ per day',
    },
  };

  return (
    <Card className="p-4 sm:p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Destination Guide: {destinationData.name}
          </h2>
          <p className="text-sm text-gray-600">{destinationData.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="tips">Travel Tips</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Best Time to Visit</div>
                <div className="text-sm text-gray-600">{destinationData.bestTimeToVisit}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Umbrella className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Weather</div>
                <div className="text-sm text-gray-600">{destinationData.weatherInfo}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Currency</div>
                <div className="text-sm text-gray-600">{destinationData.currency}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Language</div>
                <div className="text-sm text-gray-600">{destinationData.language}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Visa Requirements</div>
                <div className="text-sm text-gray-600">{destinationData.visaRequired}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Top Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {destinationData.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="space-y-3">
          {destinationData.topAttractions.map((attraction, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{attraction.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {attraction.type}
                  </Badge>
                  <span className="text-xs text-gray-600">⏱️ {attraction.time}</span>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tips" className="space-y-2">
          {destinationData.travelTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="budget" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-semibold text-green-900 mb-1">Budget</div>
              <div className="text-lg font-bold text-green-700">{destinationData.budgetGuide.budget}</div>
              <div className="text-xs text-green-600 mt-1">Hostels, local food, public transport</div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-semibold text-blue-900 mb-1">Mid-Range</div>
              <div className="text-lg font-bold text-blue-700">{destinationData.budgetGuide.midRange}</div>
              <div className="text-xs text-blue-600 mt-1">3-4★ hotels, mix of dining, some tours</div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="font-semibold text-purple-900 mb-1">Luxury</div>
              <div className="text-lg font-bold text-purple-700">{destinationData.budgetGuide.luxury}</div>
              <div className="text-xs text-purple-600 mt-1">5★ resorts, fine dining, private tours</div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                These are approximate daily costs per person. Actual expenses may vary based on travel style, season, and specific activities.
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
