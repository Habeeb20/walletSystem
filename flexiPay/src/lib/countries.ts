export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string;
}

/** Destinations offered for international top-ups. Trim this to what your provider supports. */
export const COUNTRIES: Country[] = [
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'TZ', name: 'Tanzania', dial: '+255' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'CM', name: 'Cameroon', dial: '+237' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225' },
  { code: 'SN', name: 'Senegal', dial: '+221' },
  { code: 'RW', name: 'Rwanda', dial: '+250' },
  { code: 'ZM', name: 'Zambia', dial: '+260' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'US', name: 'United States', dial: '+1' },
];

export const BETTING_PROVIDERS = [
  { key: 'bet9ja', label: 'Bet9ja' },
  { key: 'sportybet', label: 'SportyBet' },
  { key: '1xbet', label: '1xBet' },
  { key: 'betking', label: 'BetKing' },
  { key: 'nairabet', label: 'NairaBet' },
  { key: 'betway', label: 'Betway' },
  { key: 'merrybet', label: 'MerryBet' },
  { key: 'bangbet', label: 'BangBet' },
  { key: 'cloudbet', label: 'CloudBet' },
  { key: 'livescorebet', label: 'LiveScore Bet' },
];

export const EXAMS = [
  { key: 'waec', label: 'WAEC' },
  { key: 'neco', label: 'NECO' },
  { key: 'nabteb', label: 'NABTEB' },
];

export const JAMB_TYPES = [
  { key: 'utme', label: 'UTME' },
  { key: 'de', label: 'Direct Entry (DE)' },
];
