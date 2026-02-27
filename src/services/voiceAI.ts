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
  'Europe', 'Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam',
  'Switzerland', 'Zurich', 'Interlaken', 'Prague', 'Vienna',
  'Istanbul', 'Turkey', 'Greece', 'Santorini',
  'Iceland', 'Norway', 'Croatia', 'Dubrovnik', 'Portugal', 'Lisbon',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMissingFields(intent: ExtractedIntent): string[] {
  const m: string[] = [];
  if (!intent.destination) m.push('destination');
  if (!intent.nights) m.push('duration');
  if (!intent.adults) m.push('travelers');
  if (!intent.budget) m.push('budget');
  return m;
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
  isAgentMode: boolean = false,
): CopilotResponse {
  const missing = getMissingFields(intent);
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
  const hasEnough = intent.destination && (intent.nights || intent.budget) && intent.adults;
  if (hasEnough) {
    const summary = buildSummary(intent);
    const text = isAgentMode
      ? `Got it — pulling up packages for **${summary}**. Screen is updating now!`
      : pick([
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

  // ── Discovery: ask for missing info ───────────────────────────────────────
  if (missing.includes('destination')) {
    return {
      text: pick([
        "Where does your client want to go? Any destination in mind — beach, hills, or international escape?\n\n💡 You can say things like *\"Goa\"*, *\"Manali\"*, *\"Dubai\"*, or even *\"somewhere in Rajasthan\"*.",
        "Let's start with the destination! Domestic or international?\n\n💡 I understand English, Hindi, and most Indian regional languages — just speak naturally.",
        "Which destination are they thinking of? Just name it — city, state, or country works.\n\n💡 Examples: *Goa, Kerala, Maldives, Bangkok, Shimla*",
      ]),
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
      suggestedReplies: ['🏖️ Beach (Goa / Maldives)', '🏔️ Hills (Manali / Shimla)', '🌏 International (Dubai / Bali)', '🤔 Suggest something'],
    };
  }

  if (missing.includes('duration')) {
    const dest = intent.destination;
    return {
      text: pick([
        `**${dest}** is a great choice! How long is the trip?\n\n💡 You can say *"5 nights"*, *"1 week"*, or even *"long weekend"*. In Hindi: *"paanch raat"* or *"ek hafte ke liye"*.`,
        `How many nights are they looking at for **${dest}**? A quick getaway or a longer stay?\n\n💡 Weekend = 2 nights, Long weekend = 3 nights`,
        `Nice pick! How long — a weekend escape or something like 5–7 nights in **${dest}**?`,
      ]),
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
      suggestedReplies: ['🗓️ Weekend (2N)', '🗓️ Long weekend (3N)', '🗓️ 5 nights', '🗓️ 1 week'],
    };
  }

  if (missing.includes('travelers')) {
    return {
      text: pick([
        `Got it — **${intent.nights} nights** in **${intent.destination}**. Who's going?\n\n💡 Say *"2 adults"*, *"family of 4"*, or *"solo trip"*. In Hindi: *"hum do log"*, *"parivar ke saath"*, or *"akele"*.`,
        `Who's travelling? Just tell me the number of adults and if there are any kids.\n\n💡 Examples: *"couple"*, *"3 friends"*, *"me and my wife with 1 kid"*`,
        `Is this a solo trip, couple, family, or group of friends? How many in total?`,
      ]),
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
      suggestedReplies: ['👤 Solo trip', '💑 Couple (2 adults)', '👨‍👩‍👧 Family with kids', '👫 Group of friends'],
    };
  }

  if (missing.includes('budget')) {
    const tl = travelerLabel(intent);
    return {
      text: pick([
        `**${tl}** for **${intent.nights} nights** in **${intent.destination}**. What's the budget?\n\n💡 You can say *"50k"*, *"1.5 lakh"*, or just *"mid-range"* / *"luxury"*. In Hindi: *"pachaas hazar"* or *"ek lakh"*.`,
        `Almost there! What's the overall budget — economy, mid-range, or luxury?\n\n💡 Rough ranges: Budget ≤₹40k | Mid-range ₹50–90k | Luxury ₹1L+`,
        `Budget range? Even a rough number helps — I'll find the best packages within it.`,
      ]),
      nextPhase: 'discovery',
      shouldNavigate: false,
      searchQuery: '',
      suggestedReplies: ['💸 Budget (≤₹40k)', '💳 Mid-range (₹50–80k)', '💎 Luxury (₹1L+)', '🤷 Flexible on budget'],
    };
  }

  return {
    text: "Tell me a bit more and I'll find the perfect packages for you!",
    nextPhase: 'discovery',
    shouldNavigate: false,
    searchQuery: '',
    suggestedReplies: ['Start over', 'What can you do?'],
  };
}

// ─── Welcome / greeting messages ──────────────────────────────────────────────

const GREETINGS = [
  `Hi! I'm **TripBrain**, your AI travel copilot. 🌏\n\nI can help you:\n• Find packages for any destination\n• Compare flights, hotels & activities\n• Build client quotes instantly\n• Work in **English, Hindi & 8 regional languages**\n\nJust tell me where your client wants to go — I'll handle the rest!`,
  `Hello! I'm your **AI Voice Copilot**. 🤖\n\nSpeak or type naturally — I understand English, Hindi, Bengali, Tamil, and more.\n\nTell me the trip details:\n📍 Destination • 🌙 Nights • 👥 Travelers • 💰 Budget\n\nAnd I'll find ready-to-sell packages in seconds!`,
  `Hey there! Ready to plan an amazing trip? I'm **TripBrain**. 🌟\n\nI support **voice + text** input in English and Indian regional languages.\n\n*What's the destination, how long, who's going, and what's the budget?*\n\nYou can answer one at a time — I'll guide you through it!`,
];

const B2B_GREETING =
  `**B2B Agent Mode active.** 📞\n\nI'm listening alongside your client call. Speak naturally — I'll silently extract preferences and update your screen with matching packages in real time.\n\n💡 Tips:\n• Just continue your normal conversation\n• I'll detect destination, dates, budget, and traveler count automatically\n• Your screen will update as I gather information`;

export function getGreeting(isAgentMode: boolean = false): string {
  return isAgentMode ? B2B_GREETING : pick(GREETINGS);
}

export function getCapabilitiesMessage(): string {
  return `Here's what I can do:\n\n🔍 **Search** — Find packages by destination, dates, budget, and preferences\n🗣️ **Voice** — Speak in English, Hindi, or any Indian regional language\n⚖️ **Compare** — Side-by-side package comparison\n📋 **Quote** — Generate instant client quotes with markup\n📞 **B2B Mode** — Listen to client calls and pull up options silently\n\n*What would you like to start with?*`;
}

// ─── Contextual suggested replies ─────────────────────────────────────────────

export function getSuggestedReplies(phase: ConversationPhase, intent: ExtractedIntent): string[] {
  if (phase === 'results' || phase === 'navigating') {
    return ['Compare top 2', 'Best recommendation', 'Cheapest option', 'Build a quote'];
  }
  if (!intent.destination) {
    return ['Beach holiday (Goa / Maldives)', 'Hills (Manali / Shimla)', 'International (Dubai / Bali)', 'Suggest something'];
  }
  if (!intent.nights) {
    return ['Weekend (2 nights)', 'Long weekend (3N)', '5 nights', '1 week'];
  }
  if (!intent.adults) {
    return ['Solo trip', 'Couple (2 adults)', 'Family with kids', 'Group of friends'];
  }
  if (!intent.budget) {
    return ['Budget (up to 40k)', 'Mid-range (50–80k)', 'Luxury (1L+)', 'Flexible on budget'];
  }
  return ['Search now', 'Add more preferences', 'Start over'];
}

// ─── Gemini AI integration ────────────────────────────────────────────────────

function buildIntentSummary(intent: ExtractedIntent): string {
  const parts: string[] = [];
  if (intent.destination) parts.push(`Destination: ${intent.destination}`);
  if (intent.nights)      parts.push(`Duration: ${intent.nights} nights`);
  if (intent.adults)      parts.push(`Adults: ${intent.adults}`);
  if (intent.children)    parts.push(`Children: ${intent.children}`);
  if (intent.budget)      parts.push(`Budget: ₹${Math.round(intent.budget / 1000)}k`);
  if (intent.dates)       parts.push(`When: ${intent.dates}`);
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
  isAgentMode: boolean,
  apiKey: string,
): Promise<{ text: string; shouldSearch: boolean }> {
  const intentSummary = buildIntentSummary(intent);
  const hasEnough = !!(intent.destination && (intent.nights || intent.budget) && intent.adults);

  const systemPrompt = `You are TripBrain, an AI travel copilot built into TBO TravelAgent — a B2B travel booking platform used by travel agents across India.

PERSONALITY: Warm, natural, and concise. You improvise on every reply — never sound scripted or robotic. Be like a knowledgeable friend who happens to know travel inside out.

YOUR MISSION: Through natural conversation, help the agent gather: destination, trip duration (nights), number of adults and children, and budget in INR. Then trigger a package search.

LANGUAGE RULE: Always respond in the same language and register the user is using. If they write in Hindi or Hinglish, respond the same way.

RESPONSE FORMAT — strictly follow these:
- Maximum 2 short sentences. This is a voice-first interface.
- Plain text only. No bullet points, no markdown asterisks, no emojis in your response.
- Sound completely human. Vary your phrasing every time.
- Always acknowledge what the user just said before asking the next question.
- Never ask more than one question at a time.

SEARCH TRIGGER: When you have all of destination + (nights or budget) + adult count, end your response with the exact token [SEARCH] after a natural confirmation sentence.
Example: "Great, Goa for 5 nights with 4 friends and a 40k budget — let me pull those up right now! [SEARCH]"

ON RESULTS PAGE: Help compare, recommend, or guide toward booking. Keep it to 1–2 sentences.
${isAgentMode ? '\nB2B MODE: The agent is on a call with a client. Be extra concise and efficient.' : ''}

Currently captured info: ${intentSummary}
Conversation phase: ${phase}
Ready to search: ${hasEnough ? 'YES — trigger [SEARCH] now if not done already' : 'NO — still gathering info'}`;

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

// ─── Resolve API key from env or localStorage ─────────────────────────────────

export function resolveGeminiKey(): string | null {
  // Vite env variable (set VITE_GEMINI_API_KEY in .env)
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  if (envKey && envKey.length > 10) return envKey;
  // User-supplied key saved in browser
  return localStorage.getItem('tripbrain_gemini_key') || null;
}
