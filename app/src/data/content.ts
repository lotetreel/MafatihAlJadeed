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

export interface FiqhRuling {
  type: 'ruling' | 'exception' | 'important' | 'detail';
  label: string;
  text: string;
  link?: string;
}

export interface FiqhQAItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
  rulings?: FiqhRuling[];
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


export const fiqhQA: FiqhQAItem[] = [
  {
    id: 'fiqh-1',
    topic: 'Intention (Niyyah)',
    question: 'Do I need to have an intention for fasting, and must I say it loudly?',
    answer: 'Yes, for every act of worship (like Salah or fasting), you must have an intention; otherwise, the action is not valid. However, the intention does not need to be said loudly. As long as the intention is in the heart before the action commences, it is sufficient.',
    rulings: [
      {
        type: 'ruling',
        label: 'Ruling',
        text: 'It is permissible to have the intention for all 30 days of fasting before the first night of Ramadan begins.',
      },
    ],
  },
  {
    id: 'fiqh-2',
    topic: 'Brushing Teeth',
    question: 'Are we allowed to brush our teeth, and what happens if I swallow water?',
    answer: 'Yes, it is not only permissible but mustahab (recommended) to brush your teeth while fasting.',
    rulings: [
      {
        type: 'ruling',
        label: 'Ruling',
        text: 'As long as you spit the water out three times, the moisture that remains in your mouth is permissible, even if you accidentally swallow it.',
      },
    ],
  },
  {
    id: 'fiqh-3',
    topic: 'State of Janabah',
    question: 'Does waking up in a state of Janabah break my fast?',
    answer: 'Waking up in a state of Janabah (e.g., a wet dream) does not always break your fast.',
    rulings: [
      {
        type: 'detail',
        label: 'Before Fajr',
        text: 'If you realize you are in a state of Janabah before Fajr time, you must perform Ghusl al-Janabah (ritual bathing) before sunrise.',
      },
      {
        type: 'exception',
        label: 'Intentional Delay',
        text: 'If you know you are in this state and intentionally wait until after Fajr time to bathe, your fast is invalid, and you must pay a Kaffarah.',
      },
      {
        type: 'ruling',
        label: 'Unintentional',
        text: 'If you wake up after Fajr and realised you are Najis (impure from Janabah), your fasting is valid and this does not invalidate your fasting even without Ghusl, but you still need to do it before prayer.',
      },
    ],
  },
  {
    id: 'fiqh-4',
    topic: 'Injections & Vaccines',
    question: 'Can I have a vaccine or injection whilst fasting?',
    answer: 'Yes. Having any subcutaneous or intramuscular injections, or an intravenous line straight to the bloodstream, is permissible.',
    rulings: [
      {
        type: 'exception',
        label: 'Exception',
        text: 'Pathways that take food straight to the stomach, such as a PEG tube or nasal gastric tube, are not permissible.',
      },
    ],
  },
  {
    id: 'fiqh-5',
    topic: 'Traveling for Work',
    question: 'If my work consists of travelling far distances, can I still fast?',
    answer: 'Yes, provided you meet the criteria of a frequent traveler.',
    rulings: [
      {
        type: 'detail',
        label: 'Frequent Traveler Criteria',
        text: 'You must travel out of your hometown either: 10 times each month for 6 months, OR 30 times within 3 months.',
      },
      {
        type: 'ruling',
        label: 'Definition of a Traveler',
        text: 'A traveler is one who leaves their hometown/city and crosses the border by 8 farsakhs (approx. 44km total). This counts as either 44km one way or 22km going and 22km returning.',
      },
    ],
  },
  {
    id: 'fiqh-6',
    topic: 'Breaking the Fast & Penalties',
    question: 'What is the penalty for breaking the fast, intentionally or unintentionally?',
    answer: '',
    rulings: [
      {
        type: 'exception',
        label: 'Intentional (No Valid Reason)',
        text: 'You must pay a Kaffarah. This involves feeding 60 poor people OR fasting for 60 consecutive days for each day missed.',
      },
      {
        type: 'ruling',
        label: 'Valid Reason',
        text: 'You must pay a Fidya (approx. $3 to $4 per day). In addition, if you are able to fast later, you must make up (repeat) the missed days.',
      },
      {
        type: 'important',
        label: 'Important Note',
        text: 'Please see alayn.com.au to organise your penalties and send them through.',
        link: 'https://alayn.com.au',
      },
    ],
  },
];

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
