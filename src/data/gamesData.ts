import { GameInfo, Grade, Badge } from '../types';

export const GAMES_INFO: GameInfo[] = [
  {
    id: 'math_quiz',
    title: 'Matematik Viktorina',
    subtitle: 'Tezkor hisob-kitob va chaqqon aql',
    emoji: '⚡',
    badge: 'Tezkor hisob',
    color: 'border-blue-300',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'memory',
    title: 'Xotira O\'yini',
    subtitle: 'Juft kartalarni toping va xotirani charxlang',
    emoji: '🧠',
    badge: 'Kuchli xotira',
    color: 'border-purple-300',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'word_puzzle',
    title: 'So\'z Topish',
    subtitle: 'Aralash harflardan to\'g\'ri so\'z yig\'ing',
    emoji: '🔤',
    badge: 'So\'z ustasi',
    color: 'border-amber-300',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'match_pairs',
    title: 'Rasm va So\'z Mosligi',
    subtitle: 'O\'zaro bog\'liq juftliklarni birlashtiring',
    emoji: '🎯',
    badge: 'Diqqat sinovi',
    color: 'border-emerald-300',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'english_explorer',
    title: 'English Word Master',
    subtitle: 'Inglizcha so\'zlar va to\'g\'ri talaffuz',
    emoji: '🇬🇧',
    badge: 'Poliglot',
    color: 'border-rose-300',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'drag_drop',
    title: 'Joyiga Joylashtir',
    subtitle: 'Buyumlarni mos qutilarga saralang',
    emoji: '📥',
    badge: 'Saralash',
    color: 'border-cyan-300',
    gradient: 'from-cyan-500 to-blue-600',
  },
];

export const BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'Birinchi Qadam',
    description: 'Birinchi dars va testni muvaffaqiyatli yakunladingiz!',
    emoji: '🌱',
    requiredStars: 10,
  },
  {
    id: 'star_collector',
    title: 'Yulduz Teruvchi',
    description: '50 ta yulduzchani to\'pladingiz!',
    emoji: '⭐',
    requiredStars: 50,
  },
  {
    id: 'math_wizard',
    title: 'Matematik Dahosi',
    description: '100 ta yulduz va chaqqon hisob-kitob sohibi!',
    emoji: '🔢',
    requiredStars: 100,
  },
  {
    id: 'polyglot',
    title: 'Kichik Poliglot',
    description: '150 ta yulduz va tillar bilimdoni!',
    emoji: '🇬🇧',
    requiredStars: 150,
  },
  {
    id: 'super_scholar',
    title: 'Super Olim',
    description: '250 ta yulduz va yuksak natija!',
    emoji: '👑',
    requiredStars: 250,
  },
  {
    id: 'champion',
    title: 'Zukko Chempion',
    description: '400+ yulduz bilan mutlaq bilim g\'olibi!',
    emoji: '🏆',
    requiredStars: 400,
  },
];

// Helper to get grade-appropriate rank title
export const getRankByStars = (stars: number): { title: string; emoji: string; nextLevel: number } => {
  if (stars < 50) {
    return { title: 'Boshlovchi Sayohatchi', emoji: '🐣', nextLevel: 50 };
  } else if (stars < 120) {
    return { title: 'Izlanuvchi O\'quvchi', emoji: '🎒', nextLevel: 120 };
  } else if (stars < 250) {
    return { title: 'Bilimdon Donishmand', emoji: '💡', nextLevel: 250 };
  } else if (stars < 400) {
    return { title: 'Zukko Chempion', emoji: '🏆', nextLevel: 400 };
  } else {
    return { title: 'Super Olim', emoji: '👑', nextLevel: 1000 };
  }
};

// Word puzzle bank per grade
export const WORD_PUZZLES_BY_GRADE: Record<Grade, { word: string; hint: string; emoji: string }[]> = {
  1: [
    { word: 'ONA', hint: 'Eng mehribon va aziz inson', emoji: '👩' },
    { word: 'BOLA', hint: 'Maktabda o\'qiydigan jajji do\'stimiz', emoji: '🧒' },
    { word: 'NON', hint: 'Dasturxonimiz ko\'rki, eng aziz ne\'mat', emoji: '🍞' },
    { word: 'GUL', hint: 'Bahorda bog\'da ochiladigan go\'zallik', emoji: '🌸' },
    { word: 'QUYOSH', hint: 'Kunduzi osmonda nur sochadi', emoji: '☀️' },
  ],
  2: [
    { word: 'KITOB', hint: 'Bilim manbai va eng yaxshi do\'st', emoji: '📚' },
    { word: 'MAKTAB', hint: 'Ustozlar bizga saboq beradigan dargoh', emoji: '🏫' },
    { word: 'QALAM', hint: 'Daftarga rasm va so\'z yozadigan anjom', emoji: '✏️' },
    { word: 'VATAN', hint: 'Biz tug\'ilib o\'sgan muqaddas diyor', emoji: '🇺🇿' },
    { word: 'DAFTAR', hint: 'Vazifalarni chiroyli yozadigan buyum', emoji: '📓' },
  ],
  3: [
    { word: 'DARAXT', hint: 'Meva beradi va toza havo chiqaradi', emoji: '🌳' },
    { word: 'DOSTLAR', hint: 'Birga o\'ynaydigan qadrdonlarimiz', emoji: '🤝' },
    { word: 'PAXTA', hint: 'O\'zbekistonning oq oltini', emoji: '☁️' },
    { word: 'SHIRIN', hint: 'Asal, konfet yoki mevalarning ta\'mi', emoji: '🍯' },
    { word: 'KAPALAK', hint: 'Rang-barang qanotli nozik hasharot', emoji: '🦋' },
  ],
  4: [
    { word: 'ADOLAT', hint: 'Amir Temur shiori: Kuch — ...dadir', emoji: '⚖️' },
    { word: 'NAVOIY', hint: 'Buyuk shoir va mutafakkir bobomiz', emoji: '📜' },
    { word: 'SHAXMAT', hint: 'Aql va mantiqiy fikrlash o\'yini', emoji: '♟️' },
    { word: 'SAMARQAND', hint: 'Registon maydoni joylashgan go\'zal shahar', emoji: '🏛️' },
    { word: 'TABIAT', hint: 'Tog\'lar, daryolar, o\'rmonlar va osmon', emoji: '🏔️' },
  ],
  5: [
    { word: 'MANGUBERDI', hint: 'Mo\'g\'ullarga qarshi kurashgan mard sarkarda', emoji: '⚔️' },
    { word: 'PLANETA', hint: 'Quyosh atrofida aylanuvchi osmon jismi', emoji: '🪐' },
    { word: 'SINONIM', hint: 'Ma\'nolari bir-biriga yaqin so\'zlar', emoji: '📖' },
    { word: 'KOSMOS', hint: 'Yulduzlar va galaktikalar joylashgan cheksiz fazo', emoji: '🚀' },
    { word: 'MUSTAQIL', hint: 'Erkin va o\'z yo\'liga ega bo\'lgan davlat', emoji: '🕊️' },
  ],
};

// Match pairs per grade
export const MATCH_PAIRS_BY_GRADE: Record<Grade, { left: string; right: string; emoji: string }[]> = {
  1: [
    { left: '🍎 Olma', right: 'Meva', emoji: '🍎' },
    { left: '🦁 Sher', right: 'Hayvon', emoji: '🦁' },
    { left: '🚗 Mashina', right: 'Transport', emoji: '🚗' },
    { left: '☀️ Quyosh', right: 'Kunduzi chiqadi', emoji: '☀️' },
  ],
  2: [
    { left: '📚 Kitob', right: 'O\'qish uchun', emoji: '📚' },
    { left: '✏️ Qalam', right: 'Yozish uchun', emoji: '✏️' },
    { left: '🥛 Sut', right: 'Foydali ichimlik', emoji: '🥛' },
    { left: '🌱 Urug\'', right: 'O\'simlik unadi', emoji: '🌱' },
  ],
  3: [
    { left: '👤 Bola (Kim?)', right: 'Ot so\'z turkumi', emoji: '👦' },
    { left: '🌈 Chiroyli (Qanday?)', right: 'Sifat so\'z turkumi', emoji: '✨' },
    { left: '🏃 Yugurdi (Nima qildi?)', right: 'Fe\'l so\'z turkumi', emoji: '🏃' },
    { left: '🔢 Besh (Nechta?)', right: 'Son so\'z turkumi', emoji: '🔢' },
  ],
  4: [
    { left: '🩺 Shifokor', right: 'Bemorlarni davolaydi', emoji: '👨‍⚕️' },
    { left: '🧑‍🏫 O\'qituvchi', right: 'Ilm va tarbiya beradi', emoji: '👩‍🏫' },
    { left: '✈️ Uchuvchi', right: 'Samolyotni boshqaradi', emoji: '👨‍✈️' },
    { left: '👨‍🍳 Oshpaz', right: 'Mazali taomlar pishiradi', emoji: '👨‍🍳' },
  ],
  5: [
    { left: '🔴 Mars', right: 'Qizil sayyora', emoji: '🪐' },
    { left: '🪐 Saturn', right: 'Halqali gigant', emoji: '✨' },
    { left: '☀️ Quyosh', right: 'Eng yaqin yulduz', emoji: '☀️' },
    { left: '🌙 Oy', right: 'Yerning yo\'ldoshi', emoji: '🌙' },
  ],
};

// English Explorer Vocabulary per grade
export const ENGLISH_WORDS_BY_GRADE: Record<Grade, { english: string; uzbek: string; emoji: string; example: string }[]> = {
  1: [
    { english: 'Cat', uzbek: 'Mushuk', emoji: '🐱', example: 'A cute little cat.' },
    { english: 'Dog', uzbek: 'It / Kuchukcha', emoji: '🐶', example: 'The dog is friendly.' },
    { english: 'Red', uzbek: 'Qizil', emoji: '🔴', example: 'I like the red apple.' },
    { english: 'Sun', uzbek: 'Quyosh', emoji: '☀️', example: 'The sun is shining.' },
    { english: 'Star', uzbek: 'Yulduz', emoji: '⭐', example: 'Look at that bright star.' },
  ],
  2: [
    { english: 'Book', uzbek: 'Kitob', emoji: '📚', example: 'Open your book, please.' },
    { english: 'School', uzbek: 'Maktab', emoji: '🏫', example: 'I go to school every day.' },
    { english: 'Apple', uzbek: 'Olma', emoji: '🍏', example: 'Apples are delicious and healthy.' },
    { english: 'Water', uzbek: 'Suv', emoji: '💧', example: 'Drink fresh water.' },
    { english: 'Friend', uzbek: 'Do\'st', emoji: '🤝', example: 'He is my best friend.' },
  ],
  3: [
    { english: 'Elephant', uzbek: 'Fil', emoji: '🐘', example: 'The elephant is very big.' },
    { english: 'Jump', uzbek: 'Sakramoq', emoji: '🦘', example: 'Rabbits can jump high.' },
    { english: 'Swim', uzbek: 'Suzmoq', emoji: '🏊', example: 'Fish swim in the river.' },
    { english: 'Tree', uzbek: 'Daraxt', emoji: '🌳', example: 'Green trees give fresh air.' },
    { english: 'Happy', uzbek: 'Baxtli / Xursand', emoji: '😄', example: 'We are very happy today.' },
  ],
  4: [
    { english: 'Doctor', uzbek: 'Shifokor', emoji: '👨‍⚕️', example: 'The doctor helps sick people.' },
    { english: 'Morning', uzbek: 'Tong / Ertalab', emoji: '🌅', example: 'Good morning, everyone!' },
    { english: 'Travel', uzbek: 'Sayohat qilmoq', emoji: '🧳', example: 'I want to travel the world.' },
    { english: 'Strong', uzbek: 'Kuchli / Baquvvat', emoji: '💪', example: 'Athletes are very strong.' },
    { english: 'Family', uzbek: 'Oila', emoji: '👨‍👩‍👧‍👦', example: 'My family is very united.' },
  ],
  5: [
    { english: 'Planet', uzbek: 'Sayyora', emoji: '🪐', example: 'Earth is our home planet.' },
    { english: 'Mountain', uzbek: 'Tog\'', emoji: '🏔️', example: 'Everest is the highest mountain.' },
    { english: 'Scientist', uzbek: 'Olim', emoji: '🔬', example: 'A scientist discovers new things.' },
    { english: 'Universe', uzbek: 'Koinot / Olam', emoji: '🌌', example: 'The universe is vast and wonderful.' },
    { english: 'Knowledge', uzbek: 'Bilim', emoji: '💡', example: 'Knowledge is real power.' },
  ],
};

// Drag and drop sorting puzzles per grade
export const DRAG_DROP_BY_GRADE: Record<Grade, {
  title: string;
  instruction: string;
  categories: { id: string; name: string; emoji: string; color: string }[];
  items: { id: string; name: string; emoji: string; categoryId: string }[];
}> = {
  1: {
    title: 'Mevalar va Sabzavotlar',
    instruction: 'Har bir ne\'matni meva yoki sabzavot savatchasiga joylashtiring:',
    categories: [
      { id: 'meva', name: 'Mevalar savati', emoji: '🍎', color: 'bg-rose-100 border-rose-300 text-rose-800' },
      { id: 'sabzi', name: 'Sabzavotlar savati', emoji: '🥕', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    ],
    items: [
      { id: 'i1', name: 'Olma', emoji: '🍎', categoryId: 'meva' },
      { id: 'i2', name: 'Sabzi', emoji: '🥕', categoryId: 'sabzi' },
      { id: 'i3', name: 'Banan', emoji: '🍌', categoryId: 'meva' },
      { id: 'i4', name: 'Pomidor', emoji: '🍅', categoryId: 'sabzi' },
      { id: 'i5', name: 'Uzum', emoji: '🍇', categoryId: 'meva' },
      { id: 'i6', name: 'Bodring', emoji: '🥒', categoryId: 'sabzi' },
    ],
  },
  2: {
    title: 'Uy va Yovvoyi Hayvonlar',
    instruction: 'Jonivorlarni uyda yashaydigan yoki yovvoyi tabiatdagiga ajrating:',
    categories: [
      { id: 'uy', name: 'Uy hayvonlari', emoji: '🏡', color: 'bg-amber-100 border-amber-300 text-amber-800' },
      { id: 'yovvoyi', name: 'Yovvoyi hayvonlar', emoji: '🌲', color: 'bg-teal-100 border-teal-300 text-teal-800' },
    ],
    items: [
      { id: 'i1', name: 'Sigir', emoji: '🐮', categoryId: 'uy' },
      { id: 'i2', name: 'Bo\'ri', emoji: '🐺', categoryId: 'yovvoyi' },
      { id: 'i3', name: 'Qo\'y', emoji: '🐑', categoryId: 'uy' },
      { id: 'i4', name: 'Sher', emoji: '🦁', categoryId: 'yovvoyi' },
      { id: 'i5', name: 'It', emoji: '🐶', categoryId: 'uy' },
      { id: 'i6', name: 'Ayiq', emoji: '🐻', categoryId: 'yovvoyi' },
    ],
  },
  3: {
    title: 'So\'z Turkumlari: Ot, Sifat, Fe\'l',
    instruction: 'Har bir so\'zni qaysi so\'z turkumiga mansub ekanligiga qarab joylashtiring:',
    categories: [
      { id: 'ot', name: 'Ot (Kim? Nima?)', emoji: '📦', color: 'bg-blue-100 border-blue-300 text-blue-800' },
      { id: 'sifat', name: 'Sifat (Qanday?)', emoji: '🎨', color: 'bg-purple-100 border-purple-300 text-purple-800' },
      { id: 'fel', name: 'Fe\'l (Nima qildi?)', emoji: '⚡', color: 'bg-amber-100 border-amber-300 text-amber-800' },
    ],
    items: [
      { id: 'i1', name: 'Kitob', emoji: '📖', categoryId: 'ot' },
      { id: 'i2', name: 'Shirin', emoji: '🍬', categoryId: 'sifat' },
      { id: 'i3', name: 'Yugurdi', emoji: '🏃', categoryId: 'fel' },
      { id: 'i4', name: 'Quyosh', emoji: '☀️', categoryId: 'ot' },
      { id: 'i5', name: 'Qizil', emoji: '🔴', categoryId: 'sifat' },
      { id: 'i6', name: 'O\'qidi', emoji: '📚', categoryId: 'fel' },
    ],
  },
  4: {
    title: 'Juft va Toq Sonlar',
    instruction: 'Sonlarni juft (2 ga qoldiqsiz bo\'linadigan) va toqlarga ajrating:',
    categories: [
      { id: 'juft', name: 'Juft sonlar', emoji: '✌️', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
      { id: 'toq', name: 'Toq sonlar', emoji: '☝️', color: 'bg-pink-100 border-pink-300 text-pink-800' },
    ],
    items: [
      { id: 'i1', name: '12', emoji: '🔢', categoryId: 'juft' },
      { id: 'i2', name: '15', emoji: '🔢', categoryId: 'toq' },
      { id: 'i3', name: '28', emoji: '🔢', categoryId: 'juft' },
      { id: 'i4', name: '33', emoji: '🔢', categoryId: 'toq' },
      { id: 'i5', name: '50', emoji: '🔢', categoryId: 'juft' },
      { id: 'i6', name: '71', emoji: '🔢', categoryId: 'toq' },
    ],
  },
  5: {
    title: 'Tirik tabiat muhitlari',
    instruction: 'Jonivorlarni yashash muhitiga qarab saralang:',
    categories: [
      { id: 'quruqlik', name: 'Quruqlik', emoji: '⛰️', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
      { id: 'suv', name: 'Suv havzasi', emoji: '🌊', color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
      { id: 'havo', name: 'Havo va parvoz', emoji: '☁️', color: 'bg-violet-100 border-violet-300 text-violet-800' },
    ],
    items: [
      { id: 'i1', name: 'Tog\' echkisi', emoji: '🐐', categoryId: 'quruqlik' },
      { id: 'i2', name: 'Delfin', emoji: '🐬', categoryId: 'suv' },
      { id: 'i3', name: 'Burgut', emoji: '🦅', categoryId: 'havo' },
      { id: 'i4', name: 'Bo\'ri', emoji: '🐺', categoryId: 'quruqlik' },
      { id: 'i5', name: 'Akula', emoji: '🦈', categoryId: 'suv' },
      { id: 'i6', name: 'Qaldirg\'och', emoji: '🐦', categoryId: 'havo' },
    ],
  },
};
