// Shia Ramadan Content - Based on Quran and Ahlul Bayt
// Duas and Aamal are now extracted from Mafatih al-Jinan

// Re-export Dua and Aamal types and data from extracted content
// Switch between static (build-time) and live (client-side glob) content here
// import { duas as extractedDuas, aamal as extractedAamal } from './ramadan_extracted';
import { duas as liveDuas, aamal as liveAamal } from './live_content';

export const duas = liveDuas;
export const aamal = liveAamal;

export interface CalendarEvent {
  date: number;
  title: string;
  arabicTitle?: string;
  description: string;
  type: 'occasion' | 'night-of-power' | 'martyrdom' | 'birth';
  level: 1 | 2 | 3;
}

export interface FiqhPoint {
  id: string;
  question: string;
  answer: string;
  source: string;
  day: number;
}

export interface AkhlaqPoint {
  id: string;
  title: string;
  quote: string;
  source: string;
  reflection: string;
  day: number;
}

export const calendarEvents: CalendarEvent[] = [
  // From Mafatih al-Jinan - Ramadan Calendar (Level 1: Essential)
  {
    date: 10,
    title: 'Passing of Khadijah al-Kubra (as)',
    arabicTitle: 'وفاة خديجة الكبرى عليها السلام',
    description: 'The passing of Khadijah al-Kubra (peace be upon her) in the tenth year of the Prophetic mission.',
    type: 'martyrdom',
    level: 1
  },
  {
    date: 15,
    title: 'Birth of Imam Hasan al-Mujtaba (as)',
    arabicTitle: 'ولادة الإمام الحسن المجتبى عليه السلام',
    description: 'The birth of the Prophet\'s (peace and blessings be upon him and his progeny) eldest grandson, al-Hasan al-Mujtaba (peace be upon him), in the third year of the Hijra.',
    type: 'birth',
    level: 1
  },
  {
    date: 17,
    title: 'Victory of the Battle of Badr',
    arabicTitle: 'انتصار المسلمين في معركة بدر',
    description: 'The victory of the Muslims in the Battle of Badr in the second year of the Hijra.',
    type: 'occasion',
    level: 1
  },
  {
    date: 19,
    title: 'Wounding of Imam Ali (as)',
    arabicTitle: 'جرح أميرالمؤمنين عليه السلام',
    description: 'The wounding of the Commander of the Faithful (peace be upon him) at the hands of Ibn Muljam, in the 40th year of the Hijra.',
    type: 'martyrdom',
    level: 1
  },
  {
    date: 21,
    title: 'Martyrdom of Imam Ali (as)',
    arabicTitle: 'شهادة أميرالمؤمنين عليّ بن أبي طالب عليه السلام',
    description: 'The martyrdom of the Master of the Pious, the Commander of the Faithful Ali ibn Abi Talib (peace be upon him), in the 40th year of the Hijra, which saddened the Islamic world.',
    type: 'martyrdom',
    level: 1
  }
];


export const fiqhPoints: FiqhPoint[] = [
  {
    id: 'fiqh-1',
    question: 'What invalidates the fast during Ramadan?',
    answer: 'Intentional eating, drinking, sexual intercourse, or deliberate vomiting invalidates the fast. Unintentional acts (forgetting) do not break the fast according to the hadith: "Whoever forgets he is fasting and eats or drinks, let him complete his fast, for it was Allah who fed him and gave him drink."',
    source: 'Wasail al-Shia, Kitab al-Sawm',
    day: 1
  },
  {
    id: 'fiqh-2',
    question: 'Can one use eye drops while fasting?',
    answer: 'Yes, eye drops do not invalidate the fast as they are not considered nourishment and do not reach the stomach through a normal channel.',
    source: 'Tahdhib al-Ahkam',
    day: 2
  },
  {
    id: 'fiqh-3',
    question: 'What is the ruling on brushing teeth while fasting?',
    answer: 'Brushing teeth with a dry toothbrush or miswak is permitted. Using toothpaste is discouraged during the day as there is a risk of swallowing, though it does not automatically invalidate the fast unless swallowed intentionally.',
    source: 'Man La Yahduruhu al-Faqih',
    day: 3
  },
  {
    id: 'fiqh-4',
    question: 'Can a traveler break their fast?',
    answer: 'Yes, a traveler on a journey of at least 8 farsakh (approximately 44 km) may break their fast and make up the days later. However, it is often recommended to fast if the journey is not difficult.',
    source: 'Kitab al-Sawm, Wasail al-Shia',
    day: 4
  },
  {
    id: 'fiqh-5',
    question: 'What is the Kaffara (expiation) for breaking a fast intentionally?',
    answer: 'For intentionally breaking a fast without valid excuse, one must either fast for 60 consecutive days, feed 60 poor people, or free a slave. The feeding should be approximately 750g of food per person.',
    source: 'Tahdhib al-Ahkam, Kitab al-Sawm',
    day: 5
  }
];

export const akhlaqPoints: AkhlaqPoint[] = [
  {
    id: 'akhlaq-1',
    title: 'Silence is Wisdom',
    quote: 'The Prophet (saw) said: "Whoever is silent is saved."',
    source: 'Bihar al-Anwar',
    reflection: 'In Ramadan, let your silence be a form of worship. Guard your tongue from idle talk, backbiting, and argument.',
    day: 1
  },
  {
    id: 'akhlaq-2',
    title: 'Patience in Hunger',
    quote: 'Imam Ali (as) said: "Patience is of two kinds: patience over what pains you, and patience about what you love."',
    source: 'Nahj al-Balagha',
    reflection: 'Your hunger today connects you to those who hunger always. Let it breed compassion, not complaint.',
    day: 2
  },
  {
    id: 'akhlaq-3',
    title: 'Generosity of Spirit',
    quote: 'Imam Hassan (as) said: "Generosity is giving in prosperity and adversity."',
    source: 'Bihar al-Anwar',
    reflection: 'Ramadan is the month of generosity. Give not only from your wealth but from your time, your patience, and your forgiveness.',
    day: 3
  },
  {
    id: 'akhlaq-4',
    title: 'Humility in Worship',
    quote: 'Imam Sadiq (as) said: "The best of worship is humility."',
    source: 'Al-Kafi',
    reflection: 'When you pray, pray as if you see Allah. When you fast, fast with sincerity, not for show.',
    day: 4
  },
  {
    id: 'akhlaq-5',
    title: 'Forgiveness',
    quote: 'The Prophet (saw) said: "The best of you are those who forgive when they are angry."',
    source: 'Bihar al-Anwar',
    reflection: 'Use this blessed month to mend relationships. Forgive those who have wronged you, and seek forgiveness from those you have wronged.',
    day: 5
  }
];

export const understandingRamadan = {
  title: 'Understanding Shahr Ramadan',
  subtitle: 'The Month of the Quran',
  introduction: `Ramadan is not merely abstinence. It is a covenant of nearness—fasting with the limbs, guarding the tongue, and turning the heart toward the Ahlul Bayt (as).`,
  sheikhNasserResearch: `Sheikh Nasser's research emphasizes the triple movement: purification (tazkiyah), presence (muraqabah), and service (khidmah). The fast encompasses not only food and drink but sight, hearing, and thought.`,
  quranicVerse: {
    arabic: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ',
    translation: 'The month of Ramadan in which was sent down the Quran, a guidance for mankind and clear proofs for the guidance and the criterion (between right and wrong).',
    reference: 'Al-Baqarah 2:185'
  },
  hadith: {
    text: 'The Messenger of Allah (saw) said: "The month of Ramadan is the month of Allah. The other months are the months of people."',
    source: 'Bihar al-Anwar, Vol. 89'
  }
};

export const levels = {
  1: {
    name: 'Essentials',
    description: 'Core fast, daily dua, and one fiqh point. Perfect for those beginning their journey or with limited time.',
    features: ['Daily fasting', 'Essential duas', 'Basic fiqh points', 'Daily akhlaq reflection']
  },
  2: {
    name: 'Strivers',
    description: 'Extra prayers, deeper reflection, and nightly aamal. For those seeking to deepen their connection.',
    features: ['All Level 1 content', 'Night prayers (Nafilah)', 'Dua Sahar', "A'amal al-Layl", 'Extended supplications']
  },
  3: {
    name: 'Wayfarers',
    description: 'Full program: tahajjud, extensive dua, and service projects. For those seeking the highest spiritual stations.',
    features: ['All Level 1 & 2 content', 'Tahajjud prayer', 'Dua Jawshan al-Kabir', "I'tikaf (retreat)", 'Service projects', 'Ziyarat practices']
  }
};
