// ─── Demo dataset integration ─────────────────────────────────────────────────
import {
  buildDestinationContext,
  calculatePackageCost,
  getVisaProfileForCity,
  findDemoDestination,
} from '../data/demoDataset';

// Re-export helpers used by other components
export { buildDestinationContext, calculatePackageCost, getVisaProfileForCity, findDemoDestination };

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExtractedIntent {
  destination?: string;
  nights?: number;
  adults?: number;
  children?: number;
  budget?: number;
  budgetText?: string;
  vibe?: string;
  dates?: string;
  occasion?: string;
  preferences?: string[];
}

export type ConversationPhase =
  | 'greeting'
  | 'discovery'
  | 'refinement'
  | 'navigating'
  | 'results';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  extractedIntent?: ExtractedIntent;
  uiSynced?: boolean;
  fromVoice?: boolean;
  suggestedReplies?: string[];
}

export interface CopilotResponse {
  text: string;
  nextPhase: ConversationPhase;
  shouldNavigate: boolean;
  searchQuery: string;
  uiUpdate?: string;
  suggestedReplies?: string[];
}

// ─── Language support ─────────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'EN', name: 'English' },
  { code: 'hi-IN', label: 'HI', name: 'हिंदी' },
  { code: 'bn-IN', label: 'BN', name: 'বাংলা' },
  { code: 'ta-IN', label: 'TA', name: 'தமிழ்' },
  { code: 'te-IN', label: 'TE', name: 'తెలుగు' },
  { code: 'mr-IN', label: 'MR', name: 'मराठी' },
  { code: 'gu-IN', label: 'GU', name: 'ગુજરાતી' },
  { code: 'kn-IN', label: 'KN', name: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'ML', name: 'മലയാളം' },
  { code: 'pa-IN', label: 'PA', name: 'ਪੰਜਾਬੀ' },
];

// ─── Destination list ─────────────────────────────────────────────────────────

const DESTINATIONS = [
  // India — North / Hills
  'Manali', 'Shimla', 'Mussoorie', 'Darjeeling', 'Nainital', 'Auli', 'Kasol',
  'Kheerganga', 'Tirthan', 'Bir Billing', 'McLeod Ganj', 'Dharamshala', 'Spiti',
  'Leh', 'Ladakh', 'Zanskar', 'Pahalgam', 'Gulmarg', 'Srinagar', 'Dalhousie',
  // India — South / East
  'Kerala', 'Munnar', 'Alleppey', 'Thekkady', 'Wayanad', 'Varkala', 'Coorg',
  'Ooty', 'Kodaikanal', 'Pondicherry', 'Hampi', 'Mysore',
  'Meghalaya', 'Shillong', 'Cherrapunji', 'Sikkim', 'Gangtok',
  'Arunachal', 'Tawang', 'Kaziranga',
  // India — Beach / Islands
  'Goa', 'Andaman', 'Port Blair', 'Havelock', 'Lakshadweep', 'Diu', 'Daman',
  // India — Rajasthan / Heritage
  'Rajasthan', 'Jaipur', 'Udaipur', 'Jodhpur', 'Pushkar', 'Mount Abu',
  'Agra', 'Varanasi', 'Rishikesh', 'Haridwar', 'Jim Corbett', 'Ranthambore',
  'Bandhavgarh', 'Rann of Kutch',
  // India — Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune',
  // Dataset cities
  'Jaipur', 'Udaipur', 'Srinagar', 'Leh', 'Port Blair', 'Havelock', 'Munnar',
  'Alleppey', 'Coorg', 'Rishikesh', 'Manali',
  // International — Middle East
  'Dubai', 'Abu Dhabi', 'Qatar', 'Doha', 'Oman', 'Muscat', 'Jordan', 'Petra',
  // International — SE Asia
  'Maldives', 'Thailand', 'Bangkok', 'Pattaya', 'Phuket', 'Krabi',
  'Bali', 'Indonesia', 'Singapore', 'Malaysia', 'Kuala Lumpur',
  'Vietnam', 'Ho Chi Minh', 'Hanoi', 'Cambodia', 'Angkor',
  'Philippines', 'Cebu', 'Palawan',
  // International — East Asia
  'Japan', 'Tokyo', 'Kyoto', 'Osaka', 'South Korea', 'Seoul',
  'Hong Kong', 'Macau', 'Taiwan', 'Taipei',
  // International — South Asia
  'Sri Lanka', 'Nepal', 'Kathmandu', 'Bhutan',
  // International — Europe
  'Europe', 'Paris', 'Nice', 'London', 'Rome', 'Venice', 'Barcelona', 'Amsterdam',
  'Switzerland', 'Zurich', 'Lucerne', 'Interlaken', 'Prague', 'Vienna',
  'Budapest', 'Istanbul', 'Cappadocia', 'Turkey', 'Greece', 'Santorini',
  'Iceland', 'Norway', 'Croatia', 'Dubrovnik', 'Portugal', 'Lisbon',
  // International — Caucasus
  'Tbilisi', 'Georgia', 'Baku', 'Azerbaijan',
  // International — Africa / Oceania
  'Mauritius', 'Seychelles', 'Safari', 'Cape Town', 'Morocco', 'Marrakech',
  'Egypt', 'Cairo', 'Australia', 'New Zealand', 'Fiji', 'Bora Bora',
  // International — Americas
  'USA', 'Hawaii', 'Canada', 'Mexico', 'Peru', 'Machu Picchu',
];

// ─── Occasion → date hints ────────────────────────────────────────────────────

const OCCASIONS: Record<string, string> = {
  'holi': 'March',
  'diwali': 'October–November',
  'christmas': 'December',
  'new year': 'December–January',
  'eid': 'April–May',
  'navratri': 'October',
  'durga puja': 'October',
  'republic day': 'January',
  'independence day': 'August',
  'valentine': 'February',
  'summer': 'May–June',
  'monsoon': 'July–August',
  'winter': 'December–January',
};

// ─── Vibe keywords (English + Hinglish + regional transliterations) ───────────

const VIBE_MAP: [RegExp, string][] = [
  [/\b(beach|sea|ocean|coastal|sand|samundar|samudra|kadal)\b/i, 'beach'],
  [/\b(hill|mountain|snow|valley|pahad|pahar|malai|giri)\b/i, 'hills'],
  [/\b(adventure|trek|trekking|hike|bungee|rafting|camping|offbeat)\b/i, 'adventure'],
  [/\b(luxury|5.?star|five.?star|premium|lavish|mehenga)\b/i, 'luxury'],
  [/\b(honeymoon|romantic|anniversary|couple|jodi)\b/i, 'romantic'],
  [/\b(family|kids|children|parivar|bachche|kutumb)\b/i, 'family'],
  [/\b(party|nightlife|club)\b/i, 'party'],
  [/\b(cultural|heritage|temple|historical|history)\b/i, 'cultural'],
  [/\b(spiritual|pilgrimage|yoga|ashram|dhaam|tirtha)\b/i, 'spiritual'],
  [/\b(wildlife|safari|jungle|forest|national.?park|jungle)\b/i, 'wildlife'],
  [/\b(peaceful|relaxing|calm|serene|retreat|wellness|spa|sukoon)\b/i, 'peaceful'],
  [/\b(backpacker|budget|cheap|sasta|economical|affordable)\b/i, 'budget-friendly'],
];

// ─── Intent extraction ────────────────────────────────────────────────────────

export function extractIntentFromText(
  text: string,
  existing: ExtractedIntent = {},
): ExtractedIntent {
  const intent: ExtractedIntent = { ...existing };
  const lower = text.toLowerCase();

  // --- Destination ---
  if (!intent.destination) {
    for (const dest of DESTINATIONS) {
      if (lower.includes(dest.toLowerCase())) {
        intent.destination = dest;
        break;
      }
    }
  }

  // --- Nights / duration (English + Hinglish) ---
  if (!intent.nights) {
    // English
    const nightsM = lower.match(/(\d+)\s*nights?/);
    const daysM = lower.match(/(\d+)\s*days?\b/);
    // Hinglish: "teen raat", "paanch din"
    const hindiNightM = lower.match(/(ek|do|teen|chaar|paanch|chheh|saat|aath)\s*raat/);
    const hindiDayM = lower.match(/(ek|do|teen|chaar|paanch|chheh|saat|aath)\s*din/);
    const numWords: Record<string, number> = {
      ek: 1, do: 2, teen: 3, chaar: 4, paanch: 5, chheh: 6, saat: 7, aath: 8,
    };

    if (nightsM) {
      intent.nights = parseInt(nightsM[1]);
    } else if (daysM) {
      intent.nights = Math.max(1, parseInt(daysM[1]) - 1);
    } else if (hindiNightM) {
      intent.nights = numWords[hindiNightM[1]] ?? 3;
    } else if (hindiDayM) {
      intent.nights = Math.max(1, (numWords[hindiDayM[1]] ?? 3) - 1);
    } else if (/\blong\s+weekend\b/.test(lower)) {
      intent.nights = 3;
    } else if (/\bweekend\b/.test(lower)) {
      intent.nights = 2;
    } else if (/\b(?:a\s+)?week\b/.test(lower)) {
      intent.nights = 7;
    }
  }

  // --- Adults (English + Hinglish) ---
  if (!intent.adults) {
    const m =
      lower.match(/(\d+)\s*adults?/) ||
      lower.match(/(\d+)\s*(?:people|persons?|pax|friends?|log|aadmi|vyakti)/) ||
      lower.match(/(?:group|gang|squad|dost|yaar)\s*of\s*(\d+)/) ||
      lower.match(/family\s*of\s*(\d+)/) ||
      null;
    if (m) {
      intent.adults = parseInt(m[1]);
    } else if (/\b(solo|akele|khud|ek log|just me|myself)\b/.test(lower)) {
      intent.adults = 1;
    } else if (/\b(couple|honeymoon|hum dono|jodi|do log|just us two|two of us)\b/.test(lower)) {
      intent.adults = 2;
    } else if (/\bwith\s+(?:my\s+)?(?:wife|husband|partner|girlfriend|boyfriend|patni|pati|biwi)\b/.test(lower)) {
      intent.adults = 2;
    } else if (/\b(friends|dost|yaar)\b/.test(lower)) {
      // "with friends" — ask for count; default 4 if no number
      const numM = lower.match(/(\d+)/);
      intent.adults = numM ? parseInt(numM[1]) : undefined;
    }
  }

  // --- Children (English + Hinglish) ---
  if (intent.children === undefined) {
    const m = lower.match(/(\d+)\s*(?:kids?|children?|child|bachche?|bache?)\b/);
    if (m) {
      intent.children = parseInt(m[1]);
    } else if (/\b(no kids?|without kids?|child.?free|bachche nahi)\b/.test(lower)) {
      intent.children = 0;
    }
  }

  // --- Budget (English + Hinglish) ---
  if (!intent.budget) {
    const lakh = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)/);
    const k = lower.match(/(\d+(?:\.\d+)?)\s*(?:thousand|hazar|k)\b/);
    const rupee = lower.match(/[₹rs\.]+\s*(\d[\d,.]*)/) || lower.match(/(\d[\d,.]+)\s*(?:rupees?|rs)/);
    const perPerson = /\b(per\s+person|pp|each|har\s+aadmi|pratyek)\b/.test(lower);

    let budget = 0;
    let budgetText = '';

    if (lakh) {
      budget = parseFloat(lakh[1]) * 100000;
      budgetText = `₹${lakh[1]}L`;
    } else if (k) {
      budget = parseFloat(k[1]) * 1000;
      budgetText = `₹${k[1]}k`;
    } else if (rupee) {
      budget = parseFloat(rupee[1].replace(/,/g, ''));
      budgetText = `₹${budget.toLocaleString('en-IN')}`;
    } else if (/\b(not too expensive|affordable|budget.?friendly|sasta|kam budget|thoda sasta|economical|cheap)\b/.test(lower)) {
      budget = 35000; budgetText = 'budget-friendly (~₹35k)';
    } else if (/\b(luxury|premium|high.?end|lavish|mehenga|bahut acha)\b/.test(lower)) {
      budget = 150000; budgetText = 'luxury (~₹1.5L)';
    } else if (/\b(mid.?range|moderate|reasonable|theek thak)\b/.test(lower)) {
      budget = 65000; budgetText = 'mid-range (~₹65k)';
    }

    if (budget) {
      if (perPerson && intent.adults && intent.adults > 1) {
        const total = budget * intent.adults;
        intent.budget = total;
        intent.budgetText = `${budgetText} × ${intent.adults} = ₹${(total / 100000).toFixed(1)}L total`;
      } else {
        intent.budget = budget;
        intent.budgetText = budgetText;
      }
    }
  }

  // --- Dates / occasions ---
  if (!intent.dates) {
    const months = [
      'january','february','march','april','may','june',
      'july','august','september','october','november','december',
    ];
    for (const m of months) {
      if (lower.includes(m)) { intent.dates = m[0].toUpperCase() + m.slice(1); break; }
    }
    if (!intent.dates) {
      for (const [occ, hint] of Object.entries(OCCASIONS)) {
        if (lower.includes(occ)) { intent.occasion = occ; intent.dates = hint; break; }
      }
    }
    if (!intent.dates) {
      if (/\bnext\s+month\b/.test(lower)) {
        const d = new Date(); d.setMonth(d.getMonth() + 1);
        intent.dates = d.toLocaleString('default', { month: 'long' });
      } else if (/\bthis\s+month\b/.test(lower)) {
        intent.dates = new Date().toLocaleString('default', { month: 'long' });
      } else if (/\b(?:next|this|coming)\s+weekend\b/.test(lower)) {
        intent.dates = 'this weekend';
        if (!intent.nights) intent.nights = 2;
      }
    }
  }

  // --- Vibe ---
  if (!intent.vibe) {
    for (const [re, vibe] of VIBE_MAP) {
      if (re.test(lower)) { intent.vibe = vibe; break; }
    }
  }

  // --- Preferences list ---
  const prefs: string[] = [];
  if (/beach|pool|samundar/.test(lower)) prefs.push('beach');
  if (/mountain|hills|snow|pahad/.test(lower)) prefs.push('hills');
  if (/adventure|trek|raft/.test(lower)) prefs.push('adventure');
  if (/food|cuisine|khana/.test(lower)) prefs.push('local cuisine');
  if (/culture|heritage|history/.test(lower)) prefs.push('cultural');
  if (/wildlife|safari|jungle/.test(lower)) prefs.push('wildlife');
  if (/spa|wellness|yoga/.test(lower)) prefs.push('wellness');
  if (/shop/.test(lower)) prefs.push('shopping');
  if (/scuba|snorkel|water.?sport/.test(lower)) prefs.push('water sports');
  if (prefs.length) intent.preferences = prefs;

  return intent;
}

// ─── Dataset-powered helpers (exported for components) ────────────────────────

/** Get the visa question for a destination (null = domestic / no action needed) */
export function getVisaQuestion(destination: string): string | null {
  const visa = getVisaProfileForCity(destination);
  if (!visa || visa.visa_profile_id === 'V000') return null;
  return visa.bot_question;
}

/** Build a formatted cost breakup string from collected intent */
export function buildCostBreakup(intent: ExtractedIntent): string {
  if (!intent.destination || !intent.nights || intent.adults === undefined) return '';
  const result = calculatePackageCost({
    destination: intent.destination,
    nights: intent.nights,
    adults: intent.adults,
    hotelStar: 4,
    activityCount: 2,
    includePickup: true,
    includeInsurance: false,
  });
  if (result.total === 0) return '';
  return result.breakdown.join('\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMissingFields(intent: ExtractedIntent): string[] {
  const m: string[] = [];
  if (!intent.destination) m.push('destination');
  if (!intent.dates) m.push('dates');
  if (!intent.nights) m.push('duration');
  if (intent.adults === undefined) m.push('travelers');
  if (!intent.budget) m.push('budget');
  return m;
}

// ─── Structured question flow helpers ─────────────────────────────────────────

export const QUESTION_ORDER = ['destination', 'dates', 'duration', 'travelers', 'budget'] as const;
export type QuestionField = typeof QUESTION_ORDER[number];

export function getFirstMissingField(intent: ExtractedIntent): QuestionField | null {
  if (!intent.destination) return 'destination';
  if (!intent.dates) return 'dates';
  if (!intent.nights) return 'duration';
  if (intent.adults === undefined) return 'travelers';
  if (!intent.budget) return 'budget';
  return null;
}

export function getPreviousField(field: QuestionField): QuestionField | null {
  const idx = QUESTION_ORDER.indexOf(field);
  if (idx <= 0) return null;
  return QUESTION_ORDER[idx - 1] as QuestionField;
}

export function clearField(intent: ExtractedIntent, field: QuestionField): ExtractedIntent {
  const updated = { ...intent };
  switch (field) {
    case 'destination': delete updated.destination; break;
    case 'dates':       delete updated.dates; delete updated.occasion; break;
    case 'duration':    delete updated.nights; break;
    case 'travelers':   delete updated.adults; delete updated.children; break;
    case 'budget':      delete updated.budget; delete updated.budgetText; break;
  }
  return updated;
}

export function wasFieldFilled(field: QuestionField, intent: ExtractedIntent): boolean {
  switch (field) {
    case 'destination': return !!intent.destination;
    case 'dates':       return !!intent.dates;
    case 'duration':    return !!intent.nights;
    case 'travelers':   return intent.adults !== undefined;
    case 'budget':      return !!intent.budget;
    default:            return true;
  }
}

export function buildSearchQuery(intent: ExtractedIntent): string {
  const parts: string[] = [];
  if (intent.destination) parts.push(intent.destination);
  if (intent.nights) parts.push(`${intent.nights} nights`);
  if (intent.adults) {
    const c = intent.children;
    parts.push(c
      ? `${intent.adults} adults + ${c} child${c > 1 ? 'ren' : ''}`
      : `${intent.adults} adult${intent.adults > 1 ? 's' : ''}`);
  }
  if (intent.budget) parts.push(`budget ₹${Math.round(intent.budget / 1000)}k`);
  if (intent.vibe) parts.push(intent.vibe);
  if (intent.dates) parts.push(intent.dates);
  return parts.join(', ');
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function travelerLabel(intent: ExtractedIntent): string {
  const a = intent.adults ?? 0;
  const c = intent.children ?? 0;
  if (a === 1 && !c) return 'solo traveler';
  if (a === 2 && !c) return 'couple';
  if (c) return `${a} adult${a > 1 ? 's' : ''} + ${c} kid${c > 1 ? 's' : ''}`;
  return `${a} traveler${a > 1 ? 's' : ''}`;
}

function buildSummary(intent: ExtractedIntent): string {
  return [
    intent.destination,
    intent.nights && `${intent.nights} nights`,
    intent.adults && travelerLabel(intent),
    intent.budgetText && `budget ${intent.budgetText}`,
    intent.dates && `in ${intent.dates}`,
  ].filter(Boolean).join(', ');
}

// ─── Response generator ───────────────────────────────────────────────────────

export function generateCopilotResponse(
  userText: string,
  intent: ExtractedIntent,
  phase: ConversationPhase,
  _history: CopilotMessage[],
): CopilotResponse {
  const searchQuery = buildSearchQuery(intent);

  // ── Results-page follow-ups ────────────────────────────────────────────────
  if (phase === 'navigating' || phase === 'results') {
    const lower = userText.toLowerCase();

    if (/\bcompar[ei]\b|\bvs\b|\bdifference\b/.test(lower)) {
      return {
        text: "Sure! Tick the checkboxes on any two or three package cards and click **Compare** at the top of the page — I'll show a side-by-side breakdown of flights, hotels, price, and confidence score.\n\n💡 Tip: The **confidence score** tells you how closely a package matches your client's requirements.",
        nextPhase: 'results',
        shouldNavigate: false,
        searchQuery,
        suggestedReplies: ['Which has the best hotel?', 'Cheapest option?', 'Refine my search'],
      };
    }
    if (/\bcheap|budget|affordable|lowest\s*price|sasta/.test(lower)) {
      return {
        text: "Packages are sorted by price — scroll down to see the most affordable ones. The cheapest option still shows a confidence score so you know it's a good match.\n\n💡 Tip: Use the **Price Range** filter on the left to narrow down further.",
        nextPhase: 'results',
        shouldNavigate: false,
        searchQuery,
        suggestedReplies: ['Compare top 2', 'Best match overall?', 'Book a package'],
      };
    }
    if (/\bbest|recommend|which\s*one|top\s*pick|kaun\s*sa\b/.test(lower)) {
      return {
        text: "I'd go with the package showing the **highest confidence score** — it's the closest match to everything you described. Look for the green badge on the card!\n\n💡 Tip: Click **View Details** on any package to see the full itinerary, room type, and cancellation policy.",
        nextPhase: 'results',
        shouldNavigate: false,
        searchQuery,
        suggestedReplies: ['Compare top 2', 'How do I book?', 'Change budget'],
      };
    }
    if (/\bbook|confirm|proceed|quote|kharidna\b/.test(lower)) {
      return {
        text: "Click **Build Quote** on any package card. You'll go to the Quote Builder where you can:\n• Enter client details\n• Adjust your agent markup\n• Generate a ready-to-send branded quote\n\n💡 Tip: You can share the quote link directly with your client via WhatsApp or email.",
        nextPhase: 'results',
        shouldNavigate: false,
        searchQuery,
        suggestedReplies: ['Compare packages first', 'Can I modify dates?', 'Back to search'],
      };
    }
    if (/\brefine|change|different|update|badlo|naya\b/.test(lower)) {
      return {
        text: `Refreshing results with updated preferences — check your screen in a moment!`,
        nextPhase: 'navigating',
        shouldNavigate: true,
        searchQuery,
        uiUpdate: 'Refreshing results',
        suggestedReplies: [],
      };
    }
    if (/\bhotel|stay|accommodation\b/.test(lower)) {
      return {
        text: "Each package card shows the hotel name, star rating, and room type. Click **View Details** to see amenities, meal plan, check-in/out times, and guest reviews.\n\n💡 Tip: Use the **Hotel Stars** filter to show only 4★ or 5★ properties.",
        nextPhase: 'results',
        shouldNavigate: false,
        searchQuery,
        suggestedReplies: ['Compare hotels', 'Only 5-star options', 'What about flights?'],
      };
    }
    if (/\bflight|airline|nonstop|direct\b/.test(lower)) {
      return {
        text: "Flight details are shown on each package card — airline, departure/arrival times, duration, and number of stops. Use the **Airlines** and **Stops** filters on the left panel to narrow down.\n\n💡 Tip: Non-stop flights are filtered with '0 stops'.",
        nextPhase: 'results',
        shouldNavigate: false,
        searchQuery,
        suggestedReplies: ['Only direct flights', 'Compare top 2', 'Best value package'],
      };
    }

    return {
      text: "I can help you:\n• **Compare** packages side by side\n• Find the **cheapest** or **best match**\n• Explain **hotel or flight** details\n• Help you **book** or generate a **quote**\n\nWhat would you like to do?",
      nextPhase: 'results',
      shouldNavigate: false,
      searchQuery,
      suggestedReplies: ['Compare top 2', 'Best recommendation', 'Build a quote', 'Refine search'],
    };
  }

  // ── Check if we have enough to navigate ───────────────────────────────────
  const hasEnough = intent.destination && intent.dates && (intent.nights || intent.budget) && intent.adults !== undefined;
  if (hasEnough) {
    const summary = buildSummary(intent);
    const text = pick([
      `Perfect! **${summary}**. Finding the best packages for you — check your screen!`,
      `Sounds great! Searching for **${summary}**. Opening results now!`,
      `On it! Packages for **${summary}** are loading on screen.`,
    ]);
    return {
      text,
      nextPhase: 'navigating',
      shouldNavigate: true,
      searchQuery,
      uiUpdate: 'Fetching packages…',
      suggestedReplies: [],
    };
  }

  // ── Discovery: Phase 1 script (D01 → D02 → D03 → D04 → duration → D07) ───────
  // D01 — Primary destination
  if (!intent.destination) {
    return {
      text: "Do you have a destination in mind, or would you like some suggestions based on your interests?",
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
    };
  }

  // D02 — Experience type (captured as vibe / preferences)
  const hasExperience = intent.vibe || (intent.preferences && intent.preferences.length > 0);
  if (!hasExperience) {
    return {
      text: `What kind of experience are you hoping for in ${intent.destination}? For example, are you looking for relaxation on a beach, cultural immersion, adventure activities, a food tour, or something else entirely?`,
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
    };
  }

  // D03 — Group size and composition
  if (intent.adults === undefined) {
    return {
      text: "How many people will be traveling, and could you tell me a bit about the group? For instance, are you traveling solo, as a couple, with family, or with friends?",
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
    };
  }

  // D04 — Dates and flexibility
  if (!intent.dates) {
    return {
      text: "What dates are you considering for your trip, and is there any flexibility around those dates? Sometimes shifting by a day or two can open up better availability or pricing.",
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
    };
  }

  // Duration (how long)
  if (!intent.nights) {
    return {
      text: `How long are you planning to stay in ${intent.destination}?`,
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
    };
  }

  // D07 — Budget
  if (!intent.budget) {
    return {
      text: "What's your overall budget range for this trip? Even a ballpark helps me tailor everything — from accommodation style to activity choices — so the plan fits comfortably within your expectations.",
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
    };
  }

  return {
    text: "Tell me anything else about the trip and I'll refine the results for you.",
    nextPhase: 'discovery',
    shouldNavigate: false,
    searchQuery: '',
  };
}

// ─── Welcome / greeting messages ──────────────────────────────────────────────

export function getGreeting(_isAgentMode: boolean = false): string {
  return "Welcome to TBO! I'm TripBrain, your AI travel assistant. I'm here to help you plan the perfect trip.";
}

export const FIRST_QUESTION =
  "Where are you thinking of heading? Got a destination in mind, or shall I suggest some spots based on what you enjoy?";

export function getCapabilitiesMessage(): string {
  return "I'm here to help you plan a complete trip — from choosing a destination and experience style, to flights, accommodation, and booking. I'll guide you through it step by step. Just tell me where you'd like to go, or describe the kind of trip you have in mind and I'll offer some suggestions.";
}

// ─── Contextual suggested replies ─────────────────────────────────────────────

export function getSuggestedReplies(phase: ConversationPhase, _intent: ExtractedIntent): string[] {
  if (phase === 'results' || phase === 'navigating') {
    return ['Compare top 2', 'Best recommendation', 'Cheapest option', 'Build a quote'];
  }
  // During discovery, questions are open-ended — no suggestion pills
  return [];
}

// ─── Gemini AI integration ────────────────────────────────────────────────────

function buildIntentSummary(intent: ExtractedIntent): string {
  const parts: string[] = [];
  if (intent.destination) parts.push(`Destination: ${intent.destination}`);
  if (intent.dates)       parts.push(`Check-in: ${intent.dates}`);
  if (intent.nights)      parts.push(`Duration: ${intent.nights} nights`);
  if (intent.adults)      parts.push(`Adults: ${intent.adults}`);
  if (intent.children)    parts.push(`Children: ${intent.children}`);
  if (intent.budget)      parts.push(`Budget: ₹${Math.round(intent.budget / 1000)}k`);
  if (intent.vibe)        parts.push(`Vibe: ${intent.vibe}`);
  return parts.length ? parts.join(' | ') : 'Nothing captured yet';
}

function buildGeminiHistory(messages: CopilotMessage[]) {
  const raw = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
    parts: [{ text: m.text.replace(/\*\*/g, '').replace(/\[SEARCH\]/g, '').trim() }],
  })).filter(m => m.parts[0].text.length > 0);

  // Merge consecutive same-role turns (Gemini requires strict alternation)
  const merged: typeof raw = [];
  for (const turn of raw) {
    if (merged.length && merged[merged.length - 1].role === turn.role) {
      merged[merged.length - 1].parts[0].text += ' ' + turn.parts[0].text;
    } else {
      merged.push({ ...turn, parts: [{ text: turn.parts[0].text }] });
    }
  }

  // Gemini contents must start with 'user'
  while (merged.length && merged[0].role === 'model') merged.shift();
  return merged;
}

export async function generateAIResponse(
  messages: CopilotMessage[],
  intent: ExtractedIntent,
  phase: ConversationPhase,
  apiKey: string,
): Promise<{ text: string; shouldSearch: boolean }> {
  const intentSummary = buildIntentSummary(intent);
  const hasEnough = !!(intent.destination && (intent.nights || intent.budget) && intent.adults);

  // Inject real dataset context for the destination if available
  const destCtx = intent.destination ? buildDestinationContext(intent.destination) : '';
  const visaQ = intent.destination ? getVisaQuestion(intent.destination) : null;
  const costBreakup = (intent.destination && intent.nights && intent.adults !== undefined)
    ? buildCostBreakup(intent)
    : '';

  const systemPrompt = `You are TripBrain, the AI travel copilot for TBO.com. You help travellers plan complete trips through a warm, natural conversation.

PERSONALITY: Warm, conversational, never robotic. Speak like a knowledgeable travel consultant.

CONVERSATION SCRIPT — follow this question flow exactly, one question per turn:

PHASE 1 — DESTINATION & INTERESTS
D01: "Do you have a destination in mind, or would you like some suggestions based on your interests?"
  → If destination given: "That's a wonderful choice! Have you visited before, or will this be your first time?"
D02: "What kind of experience are you hoping for on this trip? For example, are you looking for relaxation on a beach, cultural immersion, adventure activities, a food and wine tour, or something else entirely?"
  → Follow-up: "If you could describe your perfect day on this trip from morning to night, what would it look like?"
D03: "How many people will be traveling, and could you tell me a bit about the group? For instance, are you traveling solo, as a couple, with family, or with friends?"
  → Follow-up if family: "Are there any children or elderly members in the group whose needs we should plan around?"
D04: "What dates are you considering for your trip, and is there any flexibility around those dates? Sometimes shifting by a day or two can open up better availability or pricing."
  → Follow-up: "Is this trip tied to a specific event, holiday, or school break?"
D05: "Are there specific neighborhoods, landmarks, or attractions you'd like to explore? I can also suggest popular local gems that most visitors love."
D06: "How important is local food and dining in your trip? Would you like recommendations for markets, street food, fine dining, cooking classes, or food tours?"
D07: "What's your overall budget range for this trip? Even a ballpark helps me tailor everything — from accommodation style to activity choices — so the plan fits comfortably within your expectations."
  → Follow-up: "Would you like me to prioritize spending on any particular area — for example, splurge on the hotel but keep activities budget-friendly, or vice versa?"

PHASE 2 — FLIGHTS (ask after search results are shown)
F01: "Which city or airport will you be departing from, and do you have a preferred arrival airport at your destination?"
F02: "Do you have a preference for flight times? Would you like an early morning departure to maximize your first day, or is a later departure more comfortable?"
F03: "Which cabin class would you prefer — economy, premium economy, business, or first class? And do you have any airline preferences or loyalty programs to factor in?"
F04: "Will you need checked baggage, or will you be traveling light with carry-on only?"
F05: "Once you arrive, how would you like to get around? Options include rental cars, private transfers, ride-sharing, or public transit."

PHASE 3 — ACCOMMODATION (ask after flights are sorted)
A01: "What type of accommodation appeals to you most — a full-service hotel, a boutique property, a vacation rental, a resort?"
A02: "How many rooms do you need, and what bed configuration works best — king, queen, twin, or connecting rooms?"
A03: "Is location a top priority? Would you like to be near the beach, city centre, airport, or a particular neighbourhood?"
A04: "On a scale from practical and affordable to luxurious and indulgent, where does your ideal accommodation fall? And is there a nightly budget range you'd like me to work within?"
A05: "What time do you expect to arrive at the hotel, and is an early check-in important to you?"
A06: "Are there any special requests or occasions I should let the hotel know about — a birthday, anniversary, honeymoon, or room preferences like a high floor or a view?"

PHASE 4 — FINALISATION
B01: "I've put together your complete itinerary. Let me walk you through it day by day — please let me know if anything needs adjusting."
B02: "Let me confirm the key details: traveller names as on passports, dates of birth, and any loyalty or frequent flyer numbers."
B03: "Here's a summary of the total cost, broken down by flights, accommodation, transfers, and activities. Would you like to review each component?"
B04: "Let me walk you through the cancellation and modification policies. Would you prefer flexible options or non-refundable rates for a lower price?"
B05: "How would you like to handle payment — a single transaction, or split payments across bookings?"
B06: "Everything is confirmed! I'll send your complete itinerary and all booking references to your email. What's the best email address?"
B07: "Is there anything else I can help with — restaurant reservations, event tickets, packing suggestions, or any last questions about your destination?"
B08: "Thank you for booking with TBO! We're excited about your trip. If anything changes or you think of something later, don't hesitate to reach back out. Have an amazing journey!"

LANGUAGE RULE: Always respond in the same language the user is using.

RESPONSE FORMAT:
- Maximum 2 short sentences. This is a voice-first interface.
- Plain text only. No bullet points, no markdown, no emojis.
- Always acknowledge what the user said before asking the next question.
- Never ask more than one question per turn.
- Ask open-ended questions only — never embed choices or options inside the question.

SEARCH TRIGGER: When you have destination + dates + adult count, end your response with the exact token [SEARCH].
Example: "Goa in July for 5 nights with 2 adults and a 60k budget — pulling those up now! [SEARCH]"

${destCtx ? `LIVE DATASET FOR ${intent.destination?.toUpperCase()}:
${destCtx}` : ''}
${visaQ ? `VISA RULE: Before confirming search, ask: "${visaQ}"` : ''}
${costBreakup ? `ESTIMATED COST BREAKUP (when user asks for price):
${costBreakup}` : ''}
ADD-ONS AVAILABLE: Airport pickup ₹1,600 | Drop-off ₹1,500 | Priority check-in ₹900 | Early check-in ₹1,800 | Insurance ₹1,200/person | Lounge ₹2,200/person

Currently captured: ${intentSummary}
Phase: ${phase}
Ready to search: ${hasEnough ? 'YES — include [SEARCH] if not already triggered' : 'NO — still gathering Phase 1 info'}`;

  const contents = buildGeminiHistory(messages);
  if (!contents.length) return { text: '', shouldSearch: false };

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.88, maxOutputTokens: 180, topP: 0.95 },
      }),
    },
  );

  if (!resp.ok) throw new Error(`Gemini ${resp.status}`);
  const data = await resp.json();
  const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const shouldSearch = raw.includes('[SEARCH]');
  return { text: raw.replace('[SEARCH]', '').replace(/\s{2,}/g, ' ').trim(), shouldSearch };
}

export async function generateGeminiFollowUpResponse(
  messages: CopilotMessage[],
  tripSummary: string,
  apiKey: string,
): Promise<string> {
  const contents = buildGeminiHistory(messages);
  if (!contents.length) return '';

  const systemPrompt = `You are TripBrain, a premium travel copilot for TBO.com.

You are answering FOLLOW-UP questions after a scripted trip intake is complete.
Use the user's trip details as context:
${tripSummary}

RULES:
- Be concise and practical.
- Max 3 short sentences.
- Plain text only, no markdown, no bullets, no emojis.
- If details are missing, ask exactly one clarifying question.
- Do not restart the intake script.`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.35, maxOutputTokens: 220, topP: 0.9 },
      }),
    },
  );

  if (!resp.ok) throw new Error(`Gemini follow-up ${resp.status}`);
  const data = await resp.json();
  const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return raw.replace(/\s{2,}/g, ' ').trim();
}

// ─── Resolve API key from env or localStorage ─────────────────────────────────

export function resolveGeminiKey(): string | null {
  // Vite env variable (set VITE_GEMINI_API_KEY in .env)
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  if (envKey && envKey.length > 10) return envKey;
  // Hardcoded Gemini API key — always active
  return 'AIzaSyArUkaNW8ddJUqXD_5Rjec4krPOK_UIzrY';
}
