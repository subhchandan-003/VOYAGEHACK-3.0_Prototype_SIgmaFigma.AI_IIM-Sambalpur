import { useState, useEffect } from 'react';
import { MapPin, Info, Sun, Umbrella, DollarSign, Users, Shield, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { resolveGeminiKey } from '../services/voiceAI';

interface DestinationGuideProps {
  destination: string;
}

interface DestData {
  name: string;
  description: string;
  bestTimeToVisit: string;
  weatherInfo: string;
  currency: string;
  language: string;
  visaRequired: string;
  highlights: string[];
  topAttractions: { name: string; type: string; time: string }[];
  travelTips: string[];
  budgetGuide: { budget: string; midRange: string; luxury: string };
}

async function fetchDestinationFromGemini(destination: string, apiKey: string): Promise<DestData> {
  const prompt = `You are a travel expert. Return ONLY a valid JSON object with no markdown, no code blocks, and no extra text for the travel destination "${destination}". Use exactly this structure:
{
  "description": "2 engaging sentences about ${destination} as a travel destination",
  "bestTimeToVisit": "best months to visit ${destination}",
  "weatherInfo": "typical temperature range and climate at ${destination}",
  "currency": "local currency with symbol used at ${destination}",
  "language": "main spoken languages at ${destination}",
  "visaRequired": "visa requirements for Indian passport holders visiting ${destination}",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4", "highlight 5", "highlight 6"],
  "topAttractions": [
    {"name": "top attraction name", "type": "Nature", "time": "X-Y hours"},
    {"name": "second attraction", "type": "Culture", "time": "X-Y hours"},
    {"name": "third attraction", "type": "Adventure", "time": "X-Y hours"},
    {"name": "fourth attraction", "type": "Shopping", "time": "X-Y hours"},
    {"name": "fifth attraction", "type": "Food", "time": "X-Y hours"}
  ],
  "travelTips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5", "tip 6"],
  "budgetGuide": {
    "budget": "cost range per day for budget travelers (hostel, street food, public transport)",
    "midRange": "cost range per day for mid-range travelers (3-4 star hotel, restaurants)",
    "luxury": "cost range per day for luxury travelers (5 star, fine dining, private tours)"
  }
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 900 },
      }),
    }
  );

  const json = await res.json();
  const raw: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(clean);
  return { name: destination, ...parsed };
}

export function DestinationGuide({ destination }: DestinationGuideProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<DestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!destination) return;
    setLoading(true);
    setFetchError(false);
    setData(null);
    setActiveTab('overview');

    const apiKey = resolveGeminiKey();
    if (!apiKey) {
      setFetchError(true);
      setLoading(false);
      return;
    }

    fetchDestinationFromGemini(destination, apiKey)
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setFetchError(true); setLoading(false); });
  }, [destination]);

  if (loading) {
    return (
      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded-md w-52 animate-pulse" />
            <div className="h-3.5 bg-gray-100 rounded-md w-full animate-pulse" />
            <div className="h-3.5 bg-gray-100 rounded-md w-4/5 animate-pulse" />
          </div>
        </div>
        <div className="h-9 bg-gray-100 rounded-lg w-full animate-pulse mb-5" />
        <div className="flex items-center justify-center py-6 gap-2.5 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Fetching destination guide for {destination}…</span>
        </div>
      </Card>
    );
  }

  if (fetchError || !data) {
    return (
      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Destination Guide: {destination}</h2>
            <p className="text-sm text-gray-500">
              Could not load guide. Check your Gemini API key or try again.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Destination Guide: {data.name}
          </h2>
          <p className="text-sm text-gray-600">{data.description}</p>
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
                <div className="text-sm text-gray-600">{data.bestTimeToVisit}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Umbrella className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Weather</div>
                <div className="text-sm text-gray-600">{data.weatherInfo}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Currency</div>
                <div className="text-sm text-gray-600">{data.currency}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Language</div>
                <div className="text-sm text-gray-600">{data.language}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">Visa Requirements</div>
                <div className="text-sm text-gray-600">{data.visaRequired}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Top Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="space-y-3">
          {data.topAttractions.map((attraction, idx) => (
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
                  <span className="text-xs text-gray-600">⏱ {attraction.time}</span>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tips" className="space-y-2">
          {data.travelTips.map((tip, idx) => (
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
              <div className="text-lg font-bold text-green-700">{data.budgetGuide.budget}</div>
              <div className="text-xs text-green-600 mt-1">Hostels, local food, public transport</div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-semibold text-blue-900 mb-1">Mid-Range</div>
              <div className="text-lg font-bold text-blue-700">{data.budgetGuide.midRange}</div>
              <div className="text-xs text-blue-600 mt-1">3-4★ hotels, mix of dining, some tours</div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="font-semibold text-purple-900 mb-1">Luxury</div>
              <div className="text-lg font-bold text-purple-700">{data.budgetGuide.luxury}</div>
              <div className="text-xs text-purple-600 mt-1">5★ resorts, fine dining, private tours</div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                Approximate daily costs per person. Actual expenses may vary based on travel style, season, and specific activities.
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
