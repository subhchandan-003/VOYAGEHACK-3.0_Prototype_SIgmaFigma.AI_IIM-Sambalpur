/**
 * Vision Controller – Claude Opus image identification
 * =====================================================
 * Receives a base64 JPEG from the frontend, sends it to Claude Opus
 * and returns a rich LocationResult with full travel information:
 * identification, nearby attractions, activities, tips, cuisine, etc.
 *
 * Required env variable:  ANTHROPIC_API_KEY
 */

import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VISION_PROMPT = `You are a world-class travel expert and landmark identification AI.

Analyze this image carefully and identify the exact location, monument, historical site, or natural wonder shown. Then provide comprehensive, accurate travel information.

Return ONLY valid JSON — no markdown fences, no explanation, no extra text:
{
  "name": "Exact landmark name (e.g., Taj Mahal | Eiffel Tower | Burj Khalifa | Grand Canyon | Gateway of India)",
  "city": "Nearest major city",
  "country": "Country name",
  "region": "State or province (e.g., Uttar Pradesh | Île-de-France | Dubai)",
  "confidence": 95,
  "category": "Architecture|Historical|Nature|Adventure|Scenic|Cultural|Beach|Religious",
  "description": "2-3 vivid, engaging sentences about why this place is remarkable and what visitors experience there",
  "history": "1-2 sentences about when it was built, who built it, and its historical or cultural significance",
  "bestTimeToVisit": "Best months or season (e.g., October to March | June to August | Year-round)",
  "entryFee": "Entry fee with currency (e.g., ₹50 for Indians, ₹1100 for foreigners | Free | $25 per person | €17 adults)",
  "timings": "Opening hours (e.g., 6:00 AM – 6:30 PM, closed Fridays | Sunrise to Sunset | Open 24 hours)",
  "nearbyAttractions": [
    {
      "name": "Nearby attraction name",
      "distance": "Distance from main landmark (e.g., 2 km | 15 min drive | 500 m walk)",
      "description": "One engaging sentence about why this place is worth visiting"
    }
  ],
  "activities": [
    {
      "name": "Activity or experience name",
      "duration": "Approximate time needed (e.g., 1–2 hours | Half day | 30 minutes)",
      "price": "Cost (e.g., Free | ₹500 per person | $20 | Included in entry)",
      "description": "What this activity involves and why it is worth doing"
    }
  ],
  "travelTips": [
    "Specific practical tip for visitors",
    "Photography or best viewpoint tip",
    "Timing or crowd-avoidance tip",
    "Local etiquette, dress code, or dos and don'ts"
  ],
  "howToReach": "Concise directions from the nearest major airport or railway station",
  "localCuisine": ["Local specialty 1", "Local dish 2", "Local street food or drink 3", "Regional delicacy 4"],
  "searchKeywords": ["keyword1", "keyword2", "keyword3"],
  "alternativeGuesses": [
    {"name": "Second possibility", "city": "city", "country": "country", "confidence": 20}
  ]
}

STRICT RULES:
1. Provide at least 4 nearbyAttractions, 5 activities, 4 travelTips, and 3 localCuisine items.
2. Use REAL, ACCURATE information for famous landmarks — do not fabricate entry fees or timings.
3. Use ₹ (rupees) for India. Use USD ($) for USA. Use EUR (€) for Europe. Use local currency for others.
4. For Seven Wonders, UNESCO sites, globally iconic landmarks: use their exact universally known names.
5. alternativeGuesses: only include if genuinely uncertain (confidence < 75). Leave as [] if confident.
6. Never return empty strings — use "Information not available" only as a last resort.
7. confidence is your certainty (0–100) that you correctly identified the landmark.`;

export async function identifyImage(req: Request, res: Response): Promise<void> {
  const { imageBase64 } = req.body as { imageBase64?: string };

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ success: false, message: 'imageBase64 (string) is required' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ success: false, message: 'ANTHROPIC_API_KEY not configured on server' });
    return;
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1600,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
            },
            { type: 'text', text: VISION_PROMPT },
          ],
        },
      ],
    });

    const raw = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      res.status(422).json({ success: false, message: 'Claude did not return valid JSON' });
      return;
    }

    const p = JSON.parse(match[0]);

    const result = {
      name:            String(p.name || 'Unknown Location'),
      city:            String(p.city || ''),
      country:         String(p.country || ''),
      region:          String(p.region || ''),
      confidence:      Math.min(100, Math.max(0, Number(p.confidence) || 70)),
      category:        String(p.category || 'Scenic'),
      description:     String(p.description || ''),
      history:         String(p.history || ''),
      bestTimeToVisit: String(p.bestTimeToVisit || 'Year-round'),
      entryFee:        String(p.entryFee || 'Check locally'),
      timings:         String(p.timings || 'Check locally'),
      howToReach:      String(p.howToReach || ''),
      nearbyAttractions: Array.isArray(p.nearbyAttractions)
        ? p.nearbyAttractions.map((a: any) => ({
            name:        String(a.name || ''),
            distance:    String(a.distance || ''),
            description: String(a.description || ''),
          }))
        : [],
      activities: Array.isArray(p.activities)
        ? p.activities.map((a: any) => ({
            name:        String(a.name || ''),
            duration:    String(a.duration || ''),
            price:       String(a.price || 'Varies'),
            description: String(a.description || ''),
          }))
        : [],
      travelTips:     Array.isArray(p.travelTips)     ? p.travelTips.map(String)     : [],
      localCuisine:   Array.isArray(p.localCuisine)   ? p.localCuisine.map(String)   : [],
      searchKeywords: Array.isArray(p.searchKeywords)  ? p.searchKeywords.map(String) : [],
      alternativeGuesses: Array.isArray(p.alternativeGuesses)
        ? p.alternativeGuesses.map((a: any) => ({
            name:       String(a.name || ''),
            city:       String(a.city || ''),
            country:    String(a.country || ''),
            confidence: Number(a.confidence) || 0,
          }))
        : [],
    };

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Claude vision error:', err?.message ?? err);
    res.status(500).json({ success: false, message: 'Claude API error', detail: err?.message });
  }
}
