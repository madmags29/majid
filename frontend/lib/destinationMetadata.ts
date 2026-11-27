import { DestinationOption } from './destinations';

export type RegionKey = 'India' | 'Europe' | 'Asia' | 'Americas' | 'Middle East' | 'Africa';
export type BudgetTier = 'Budget' | 'Moderate' | 'Premium';

export interface DestinationEditorialMeta {
  region: RegionKey;
  bestTime: string;
  idealDuration: string;
  budgetTier: BudgetTier;
  dailyBudgetEstimate: string;
  suitability: ('Couples' | 'Family' | 'Solo' | 'Friends')[];
  howToReach: {
    air: string;
    rail: string;
    road: string;
  };
  safetyAndAccessibility: string;
  localFood: string;
}

const INDIA_IDS = new Set([
  'india', 'manali', 'shimla', 'goa', 'mumbai', 'delhi', 'jaipur', 'udaipur',
  'munnar', 'varanasi', 'andaman', 'leh', 'rishikesh', 'agra', 'darjeeling',
  'gokarna', 'hyderabad', 'kochi', 'pondicherry', 'mysore', 'amritsar',
  'hampi', 'coorg', 'alleppey', 'jodhpur'
]);

const EUROPE_IDS = new Set([
  'europe', 'paris', 'london', 'rome', 'venice', 'amsterdam', 'barcelona',
  'santorini', 'prague', 'lisbon', 'athens', 'vienna', 'budapest', 'florence'
]);

const MIDDLE_EAST_IDS = new Set(['dubai', 'abudhabi', 'doha']);

const AMERICAS_IDS = new Set([
  'newyork', 'losangeles', 'cancun', 'riodejaneiro', 'vancouver',
  'san-francisco', 'mexico-city', 'buenos-aires'
]);

const AFRICA_IDS = new Set(['cairo', 'marrakesh', 'cape-town']);

const SPECIFIC_META: Record<string, Partial<DestinationEditorialMeta>> = {
  goa: {
    bestTime: 'November – February (pleasant coastal weather; June – September for lush monsoon)',
    budgetTier: 'Moderate',
    dailyBudgetEstimate: '₹2,500 – ₹6,500 / person / day (estimate)',
    localFood: 'Goan fish curry, prawn balchão, bebinca, and coastal café fare.',
  },
  manali: {
    bestTime: 'March – June (pleasant valleys) & December – February (snowfall)',
    budgetTier: 'Budget',
    dailyBudgetEstimate: '₹2,000 – ₹5,000 / person / day (estimate)',
    localFood: 'Himachali siddu, trout fish, momos, and Old Manali café cuisine.',
  },
  shimla: {
    bestTime: 'March – June & October – February',
    budgetTier: 'Moderate',
    dailyBudgetEstimate: '₹2,200 – ₹5,500 / person / day (estimate)',
    localFood: 'Chana madra, babru, Himachali dham, and Mall Road bakeries.',
  },
  jaipur: {
    bestTime: 'October – March (cool winter days ideal for fort walks)',
    budgetTier: 'Moderate',
    dailyBudgetEstimate: '₹2,000 – ₹6,000 / person / day (estimate)',
    localFood: 'Dal baati churma, pyaaz kachori, ghevar, and Rajasthani thalis.',
  },
  udaipur: {
    bestTime: 'September – March',
    budgetTier: 'Moderate',
    dailyBudgetEstimate: '₹2,500 – ₹7,000 / person / day (estimate)',
    localFood: 'Dal baati, mirchi vada, gatte ki sabzi, and rooftop lakeside dining.',
  },
  rishikesh: {
    bestTime: 'September – November & February – May (rafting season)',
    budgetTier: 'Budget',
    dailyBudgetEstimate: '₹1,500 – ₹4,000 / person / day (estimate)',
    localFood: 'Sattvic vegetarian thalis, aloo puri, and riverside organic cafés.',
  },
  munnar: {
    bestTime: 'September – May (cool misty mornings across tea estates)',
    budgetTier: 'Moderate',
    dailyBudgetEstimate: '₹2,200 – ₹5,500 / person / day (estimate)',
    localFood: 'Appam with stew, Kerala parotta, cardamom tea, and local spices.',
  },
  varanasi: {
    bestTime: 'October – March',
    budgetTier: 'Budget',
    dailyBudgetEstimate: '₹1,500 – ₹4,000 / person / day (estimate)',
    localFood: 'Kachori sabzi, Banarasi chaat, malaiyo (winter), and lassi.',
  },
  dubai: {
    bestTime: 'November – March (outdoor desert & beach weather)',
    budgetTier: 'Premium',
    dailyBudgetEstimate: '$150 – $350 / person / day (estimate)',
    localFood: 'Shawarma, machboos, luqaimat, and global fine dining.',
  },
  tokyo: {
    bestTime: 'March – May (cherry blossoms) & October – November (autumn)',
    budgetTier: 'Premium',
    dailyBudgetEstimate: '$120 – $280 / person / day (estimate)',
    localFood: 'Ramen, sushi, izakaya yakitori, and depachika street food.',
  },
  paris: {
    bestTime: 'April – June & September – October',
    budgetTier: 'Premium',
    dailyBudgetEstimate: '€140 – €300 / person / day (estimate)',
    localFood: 'Croissants, bistro steak-frites, crêpes, and artisanal cheeses.',
  },
  bali: {
    bestTime: 'April – October (dry tropical season)',
    budgetTier: 'Moderate',
    dailyBudgetEstimate: '$50 – $140 / person / day (estimate)',
    localFood: 'Nasi campur, sate lilit, smoothie bowls, and Ubud warungs.',
  },
};

export function getDestinationRegion(dest: DestinationOption): RegionKey {
  if (INDIA_IDS.has(dest.id)) return 'India';
  if (EUROPE_IDS.has(dest.id)) return 'Europe';
  if (MIDDLE_EAST_IDS.has(dest.id)) return 'Middle East';
  if (AMERICAS_IDS.has(dest.id)) return 'Americas';
  if (AFRICA_IDS.has(dest.id)) return 'Africa';
  return 'Asia';
}

export function getDestinationEditorialMeta(dest: DestinationOption): DestinationEditorialMeta {
  const region = getDestinationRegion(dest);
  const specific = SPECIFIC_META[dest.id] || {};
  const tagsLower = dest.tags.map(t => t.toLowerCase());

  const defaultBestTime: Record<RegionKey, string> = {
    India: 'October – March (pleasant weather; March – June for high mountain valleys)',
    Europe: 'April – June & September – October (mild weather and fewer crowds)',
    Asia: 'November – March (dry & comfortable across most Southeast/East Asian hubs)',
    Americas: 'May – September & October (varies by northern/southern hemisphere)',
    'Middle East': 'November – March (cool desert evenings)',
    Africa: 'March – May & September – November',
  };

  const isLuxury = tagsLower.includes('luxury') || region === 'Europe' || region === 'Americas' || region === 'Middle East';
  const isBudget = tagsLower.includes('backpacking') || tagsLower.includes('spiritual') || tagsLower.includes('rafting');

  const budgetTier: BudgetTier = specific.budgetTier || (isLuxury ? 'Premium' : isBudget ? 'Budget' : 'Moderate');

  const defaultBudget: Record<BudgetTier, string> = {
    Budget: region === 'India' ? '₹1,500 – ₹3,500 / person / day (estimate)' : '$45 – $95 / person / day (estimate)',
    Moderate: region === 'India' ? '₹2,500 – ₹6,000 / person / day (estimate)' : '$85 – $175 / person / day (estimate)',
    Premium: region === 'India' ? '₹6,000 – ₹14,000+ / person / day (estimate)' : '$150 – $320+ / person / day (estimate)',
  };

  const suitability: DestinationEditorialMeta['suitability'] = ['Couples', 'Solo', 'Friends'];
  if (!tagsLower.includes('backpacking') && !tagsLower.includes('scuba')) {
    suitability.unshift('Family');
  }

  return {
    region,
    bestTime: specific.bestTime || defaultBestTime[region],
    idealDuration: tagsLower.includes('islands') || tagsLower.includes('road trip') ? '3–4 Days (Long Weekend)' : '2–3 Days (Weekend)',
    budgetTier,
    dailyBudgetEstimate: specific.dailyBudgetEstimate || defaultBudget[budgetTier],
    suitability,
    howToReach: specific.howToReach || {
      air: `Nearest commercial airport serving ${dest.name}, ${dest.country}; check direct weekend flights 2–3 weeks ahead.`,
      rail: region === 'India' || region === 'Europe'
        ? `Well-connected via regional rail networks; book express or overnight trains early for Friday departures.`
        : `Check regional rail or airport express transfers into central ${dest.name}.`,
      road: `Accessible via national highways or local cab/bus transfers; allow extra buffer time on Friday evenings and Sunday nights.`,
    },
    safetyAndAccessibility: `Stick to well-lit central neighborhoods at night, confirm official attraction opening hours locally, and carry offline maps in mountain or coastal zones.`,
    localFood: specific.localFood || `Explore local markets and neighborhood eateries in ${dest.name} for authentic ${dest.country} cuisine.`,
  };
}

export const REGION_HUBS: Record<string, {
  id: string;
  name: string;
  regionKey: RegionKey;
  title: string;
  description: string;
  highlights: string[];
}> = {
  india: {
    id: 'india',
    name: 'India',
    regionKey: 'India',
    title: 'India Weekend Getaways & Travel Guides',
    description: 'Explore 25+ curated weekend destinations across India—from Himalayan hill stations and Rajasthan heritage forts to Kerala backwaters and coastal beaches.',
    highlights: ['2–4 day road & rail getaways from Delhi, Mumbai, Bangalore & Hyderabad', 'Seasonal monsoon, winter & summer hill-station planning', 'Realistic INR budget estimates & local transport tips'],
  },
  europe: {
    id: 'europe',
    name: 'Europe',
    regionKey: 'Europe',
    title: 'Europe City Breaks & Weekend Guides',
    description: 'Discover walkable European capitals, canal cities, Renaissance hubs, and Mediterranean islands built for compact 2-to-4 day rail or short-haul breaks.',
    highlights: ['High-speed rail-friendly city pairings', 'Shoulder-season tips for April–June & September–October', 'Neighborhood stay & museum timing guidance'],
  },
  asia: {
    id: 'asia',
    name: 'Asia',
    regionKey: 'Asia',
    title: 'Asia Weekend Trips & Cultural Guides',
    description: 'Browse vibrant Asian city breaks, island retreats, temple circuits, and street-food capitals across Japan, Thailand, Singapore, Indonesia, and South Korea.',
    highlights: ['Compact 48–72 hour city & island itineraries', 'Public transit & street-food neighborhood highlights', 'Dry-season & festival calendar planning'],
  },
  americas: {
    id: 'americas',
    name: 'Americas',
    regionKey: 'Americas',
    title: 'Americas Weekend Escapes & City Guides',
    description: 'Plan quick city breaks, coastal getaways, and cultural weekends across North and South America—from New York and Vancouver to Mexico City and Rio.',
    highlights: ['Long-weekend coastal & mountain escapes', 'Neighborhood walkability & transit tips', 'Seasonal climate guidance across hemispheres'],
  },
  'middle-east': {
    id: 'middle-east',
    name: 'Middle East',
    regionKey: 'Middle East',
    title: 'Middle East Stopovers & Luxury Weekends',
    description: 'Make the most of 48–72 hours in Dubai, Abu Dhabi, and Doha with desert excursions, architectural landmarks, and winter-season planning.',
    highlights: ['Ideal 2–3 day stopover & short-haul itineraries', 'Cool-season (November–March) outdoor planning', 'Cultural etiquette & metro transit notes'],
  },
};

export interface OfficialSourceLink {
  label: string;
  url: string;
  note: string;
}

const INDIA_STATE_SOURCES: Record<string, OfficialSourceLink> = {
  goa: { label: 'Goa Tourism (Official)', url: 'https://goatourism.gov.in/', note: 'Beaches, heritage sites, and seasonal advisories' },
  manali: { label: 'Himachal Pradesh Tourism', url: 'https://himachaltourism.gov.in/', note: 'Rohtang/Atal Tunnel permits and hill-station updates' },
  shimla: { label: 'Himachal Pradesh Tourism', url: 'https://himachaltourism.gov.in/', note: 'Shimla heritage routes and weather advisories' },
  jaipur: { label: 'Rajasthan Tourism', url: 'https://www.tourism.rajasthan.gov.in/', note: 'Fort/palace entry fees and monument timings' },
  udaipur: { label: 'Rajasthan Tourism', url: 'https://www.tourism.rajasthan.gov.in/', note: 'Lake Pichola, City Palace, and regional guides' },
  jodhpur: { label: 'Rajasthan Tourism', url: 'https://www.tourism.rajasthan.gov.in/', note: 'Mehrangarh Fort and heritage advisories' },
  munnar: { label: 'Kerala Tourism', url: 'https://www.keralatourism.org/', note: 'Eravikulam National Park and tea-hill advisories' },
  kochi: { label: 'Kerala Tourism', url: 'https://www.keralatourism.org/', note: 'Fort Kochi heritage trail and ferry updates' },
  alleppey: { label: 'Kerala Tourism', url: 'https://www.keralatourism.org/', note: 'Backwater houseboat guidelines and routes' },
  rishikesh: { label: 'Uttarakhand Tourism', url: 'https://uttarakhandtourism.gov.in/', note: 'River rafting seasons and pilgrimage updates' },
  varanasi: { label: 'UP Tourism', url: 'https://uptourism.gov.in/', note: 'Ghat timings, temple access, and cultural events' },
  agra: { label: 'UP Tourism / ASI', url: 'https://asi.nic.in/', note: 'Taj Mahal & Agra Fort official monument timings' },
  darjeeling: { label: 'West Bengal Tourism', url: 'https://wbtourism.gov.in/', note: 'Darjeeling Himalayan Railway & viewpoint updates' },
  amritsar: { label: 'Punjab Tourism', url: 'https://punjabtourism.punjab.gov.in/', note: 'Golden Temple & Wagah Border ceremony timings' },
  hampi: { label: 'Karnataka Tourism', url: 'https://karnatakatourism.org/', note: 'Hampi UNESCO ruins & heritage site access' },
  coorg: { label: 'Karnataka Tourism', url: 'https://karnatakatourism.org/', note: 'Kodagu waterfalls, estates, and road updates' },
  mysore: { label: 'Karnataka Tourism', url: 'https://karnatakatourism.org/', note: 'Mysore Palace illumination & entry timings' },
  gokarna: { label: 'Karnataka Tourism', url: 'https://karnatakatourism.org/', note: 'Coastal trek and beach safety advisories' },
  andaman: { label: 'Andaman & Nicobar Tourism', url: 'https://www.andamantourism.gov.in/', note: 'Ferry schedules and island permit rules' },
  leh: { label: 'Ladakh Tourism', url: 'https://ladakh.gov.in/', note: 'High-altitude acclimatization and inner-line permits' },
  pondicherry: { label: 'Puducherry Tourism', url: 'https://tourism.py.gov.in/', note: 'French Quarter, beaches, and local events' },
  mumbai: { label: 'Maharashtra Tourism', url: 'https://maharashtratourism.gov.in/', note: 'Elephanta Caves ferries and city heritage' },
  delhi: { label: 'Delhi Tourism', url: 'https://delhitourism.gov.in/', note: 'Monument timings and Delhi Metro connections' },
  hyderabad: { label: 'Telangana Tourism', url: 'https://tourism.telangana.gov.in/', note: 'Golconda Fort, Charminar, and museum hours' },
};

const INTERNATIONAL_SOURCES: Record<string, OfficialSourceLink> = {
  paris: { label: 'Paris je t’aime (Official)', url: 'https://parisjetaime.com/eng/', note: 'Museum passes, transit, and opening hours' },
  london: { label: 'Visit London / TfL', url: 'https://www.visitlondon.com/', note: 'Attractions, Oyster/contactless transit, and events' },
  rome: { label: 'Italia.it / Turismo Roma', url: 'https://www.turismoroma.it/en', note: 'Colosseum, Vatican, and public transit guidance' },
  venice: { label: 'Venezia Unica (Official)', url: 'https://www.veneziaunica.it/en', note: 'Vaporetto passes and city access fee rules' },
  florence: { label: 'Feel Florence (Official)', url: 'https://www.feelflorence.it/en', note: 'Uffizi & Duomo booking and museum hours' },
  amsterdam: { label: 'I amsterdam (Official)', url: 'https://www.iamsterdam.com/en', note: 'Canal cruises, Rijksmuseum, and GVB transit' },
  barcelona: { label: 'Barcelona Turisme', url: 'https://www.barcelonaturisme.com/', note: 'Sagrada Família tickets and TMB transit' },
  santorini: { label: 'Visit Greece (Official)', url: 'https://www.visitgreece.gr/', note: 'Ferry connections and seasonal island guidance' },
  prague: { label: 'Prague City Tourism', url: 'https://www.prague.eu/en', note: 'Prague Castle hours and PID public transport' },
  lisbon: { label: 'Visit Lisboa (Official)', url: 'https://www.visitlisboa.com/', note: 'Tram 28, Sintra rail, and museum passes' },
  athens: { label: 'This is Athens (Official)', url: 'https://www.thisisathens.org/', note: 'Acropolis tickets and archaeological sites' },
  vienna: { label: 'Wien.info (Official)', url: 'https://www.wien.info/en', note: 'Palaces, Wiener Linien transit, and concert halls' },
  budapest: { label: 'Visit Budapest', url: 'https://www.budapestinfo.hu/en', note: 'Thermal baths, Parliament tours, and BKK transit' },
  tokyo: { label: 'JNTO / Go Tokyo', url: 'https://www.gotokyo.org/en/', note: 'JR passes, Suica/Pasmo, and attraction hours' },
  dubai: { label: 'Visit Dubai (Official)', url: 'https://www.visitdubai.com/en', note: 'RTA Metro, attractions, and seasonal events' },
  abudhabi: { label: 'Visit Abu Dhabi', url: 'https://visitabudhabi.ae/en', note: 'Sheikh Zayed Grand Mosque & museum access' },
  doha: { label: 'Visit Qatar (Official)', url: 'https://visitqatar.com/', note: 'Stopover transit, Souq Waqif, and museums' },
  newyork: { label: 'NYC Tourism (Official)', url: 'https://www.nycgo.com/', note: 'MTA subway, ferries, and landmark tickets' },
  losangeles: { label: 'Discover Los Angeles', url: 'https://www.discoverlosangeles.com/', note: 'Museums, beaches, and LA Metro info' },
  'san-francisco': { label: 'SF Travel (Official)', url: 'https://www.sftravel.com/', note: 'Alcatraz ferries, cable cars, and BART' },
  vancouver: { label: 'Destination Vancouver', url: 'https://www.destinationvancouver.com/', note: 'Stanley Park, SeaBus, and transit updates' },
  cancun: { label: 'Visit Mexico', url: 'https://www.visitmexico.com/', note: 'Ferry routes, Chichén Itzá, and beach advisories' },
  'mexico-city': { label: 'Visit Mexico', url: 'https://www.visitmexico.com/', note: 'Museum hours and Metrobus transit' },
  riodejaneiro: { label: 'Visit Brasil', url: 'https://visitbrasil.com/', note: 'Christ the Redeemer & Sugarloaf tickets' },
  'buenos-aires': { label: 'Turismo Buenos Aires', url: 'https://turismo.buenosaires.gob.ar/en', note: 'SUBE card transit and neighborhood guides' },
  cairo: { label: 'Experience Egypt', url: 'https://www.experienceegypt.eg/', note: 'Giza Plateau & GEM official ticket info' },
  marrakesh: { label: 'Visit Morocco', url: 'https://www.visitmorocco.com/en', note: 'Medina guidance and ONCF rail connections' },
  'cape-town': { label: 'Cape Town Tourism', url: 'https://www.capetown.travel/', note: 'Table Mountain cableway and Robben Island ferries' },
};

export function getOfficialSourcesForDestination(dest: DestinationOption): OfficialSourceLink[] {
  const sources: OfficialSourceLink[] = [];
  const isIndia = INDIA_IDS.has(dest.id) || dest.country.toLowerCase() === 'india';

  if (isIndia) {
    if (INDIA_STATE_SOURCES[dest.id]) {
      sources.push(INDIA_STATE_SOURCES[dest.id]);
    }
    sources.push(
      { label: 'Incredible India (Ministry of Tourism)', url: 'https://www.incredibleindia.gov.in/', note: 'National tourism advisories & heritage sites' },
      { label: 'IRCTC / Indian Railways', url: 'https://www.irctc.co.in/', note: 'Live train schedules, seat availability & fares' }
    );
  } else if (INTERNATIONAL_SOURCES[dest.id]) {
    sources.push(INTERNATIONAL_SOURCES[dest.id]);
  } else {
    sources.push({
      label: 'UN Tourism (UNWTO)',
      url: 'https://www.unwto.org/',
      note: 'Global destination & travel advisory portal',
    });
  }

  sources.push(
    { label: 'OpenStreetMap', url: 'https://www.openstreetmap.org/', note: 'Map coordinates & neighborhood layout' },
    { label: 'Open-Meteo', url: 'https://open-meteo.com/', note: 'Live weather forecast data' }
  );

  return sources;
}

