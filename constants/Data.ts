/** SEÑAS — App Data Constants */

export type LessonStatus = 'done' | 'active' | 'locked';

export interface LessonItem {
  id: number;
  title: string;
  status: LessonStatus;
  signs: string[];
  emoji: string;
}

export interface Category {
  id: string;
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  lessons: LessonItem[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'alphabet',
    icon: '🤟',
    label: 'Alphabet',
    color: '#2eadad',
    bgColor: '#e0f5f5',
    lessons: [
      { id: 1, title: 'Letters A–E', status: 'done',   signs: ['A','B','C','D','E'],   emoji: '🔤' },
      { id: 2, title: 'Letters F–J', status: 'active', signs: ['F','G','H','I','J'],   emoji: '🔤' },
      { id: 3, title: 'Letters K–O', status: 'locked', signs: ['K','L','M','N','O'],   emoji: '🔤' },
      { id: 4, title: 'Letters P–T', status: 'locked', signs: ['P','Q','R','S','T'],   emoji: '🔤' },
      { id: 5, title: 'Letters U–Z', status: 'locked', signs: ['U','V','W','X','Y','Z'], emoji: '🔤' },
    ],
  },
  {
    id: 'numbers',
    icon: '🔢',
    label: 'Numbers',
    color: '#f5a800',
    bgColor: '#fff9f0',
    lessons: [
      { id: 1, title: 'Numbers 1–5',   status: 'done',   signs: ['1','2','3','4','5'],  emoji: '🔢' },
      { id: 2, title: 'Numbers 6–10',  status: 'active', signs: ['6','7','8','9','10'], emoji: '🔢' },
      { id: 3, title: 'Numbers 11–20', status: 'locked', signs: [],                     emoji: '🔢' },
    ],
  },
  {
    id: 'greetings',
    icon: '👋',
    label: 'Greetings',
    color: '#8b5cf6',
    bgColor: '#f3f0ff',
    lessons: [
      { id: 1, title: 'Hello & Goodbye',   status: 'done',   signs: ['Hello','Goodbye'],         emoji: '👋' },
      { id: 2, title: 'Thank You & Please', status: 'done',   signs: ['Thank You','Please'],       emoji: '🙏' },
      { id: 3, title: 'How Are You?',        status: 'active', signs: ['How are you?','I am fine'], emoji: '😊' },
      { id: 4, title: 'My Name Is...',       status: 'locked', signs: [],                           emoji: '📛' },
    ],
  },
  {
    id: 'classroom',
    icon: '🏫',
    label: 'Classroom',
    color: '#22c55e',
    bgColor: '#f0fff4',
    lessons: [
      { id: 1, title: 'School Objects',    status: 'active', signs: ['Book','Pen','Board'], emoji: '📚' },
      { id: 2, title: 'Classroom Actions', status: 'locked', signs: [],                     emoji: '✏️' },
    ],
  },
];

// ─── Quiz ────────────────────────────────────────────────────

export interface MCQuestion {
  q: string;
  emoji: string;
  options: string[];
  correct: number;
}

export const MC_QUESTIONS: MCQuestion[] = [
  {
    q: 'Which sign represents the letter "A" in FSL?',
    emoji: '🤟',
    options: ['Open palm facing forward', 'Fist with thumb beside fingers', 'Two fingers pointing up', 'Curved fingers downward'],
    correct: 1,
  },
  {
    q: 'How do you sign "Thank You" in FSL?',
    emoji: '🙏',
    options: ['Wave both hands', 'Touch chin then move hand forward', 'Clap twice', 'Point upward'],
    correct: 1,
  },
  {
    q: 'What does the open-hand wave (👋) represent?',
    emoji: '👋',
    options: ['Goodbye', 'Hello / Hi', 'Help me', 'Come here'],
    correct: 1,
  },
  {
    q: 'The number "5" in FSL is signed by:',
    emoji: '✋',
    options: ['Four fingers up', 'All five fingers spread open', 'Thumbs up', 'Three fingers extended'],
    correct: 1,
  },
];

export interface DragItem {
  id: string;
  label: string;
  match: string;
}

export const DRAG_ITEMS: DragItem[] = [
  { id: 'a', label: '✋ Five fingers spread', match: 'Hello' },
  { id: 'b', label: '🤟 I Love You sign',     match: 'I Love You' },
  { id: 'c', label: '☝️ Index finger up',     match: 'One' },
  { id: 'd', label: '✊ Closed fist',          match: 'Zero' },
];
export const DRAG_ZONES = ['Hello', 'I Love You', 'One', 'Zero'];

// ─── Achievements ────────────────────────────────────────────

export interface Badge {
  id: number;
  icon: string;
  label: string;
  desc: string;
  earned: boolean;
  color: string;
}

export const BADGES: Badge[] = [
  { id: 1, icon: '🌱', label: 'First Sign',     desc: 'Completed your very first lesson',  earned: true,  color: '#22c55e' },
  { id: 2, icon: '🔥', label: '7-Day Streak',   desc: 'Practiced 7 days in a row',         earned: true,  color: '#f5a800' },
  { id: 3, icon: '🎓', label: 'Alphabet Hero',  desc: 'Completed all alphabet lessons',    earned: true,  color: '#2eadad' },
  { id: 4, icon: '📚', label: 'Bookworm',       desc: 'Complete 10 lessons',               earned: true,  color: '#06b6d4' },
  { id: 5, icon: '⚡', label: 'Fast Learner',   desc: 'Complete 5 lessons in one day',     earned: false, color: '#8b5cf6' },
  { id: 6, icon: '🏆', label: 'Quiz Master',    desc: 'Score 100% on any quiz',            earned: false, color: '#f5a800' },
  { id: 7, icon: '🤟', label: 'Sign Wizard',    desc: 'Practice 50 gestures',              earned: false, color: '#ff6b8a' },
  { id: 8, icon: '🌟', label: 'Rising Star',    desc: 'Reach Intermediate level',          earned: false, color: '#fbbf24' },
];

export const MILESTONES = [
  { label: 'Lessons Completed', value: 8,  max: 20,  color: '#2eadad' },
  { label: 'Signs Practiced',   value: 24, max: 50,  color: '#8b5cf6' },
  { label: 'Quiz Score Avg',    value: 78, max: 100, color: '#22c55e' },
  { label: 'Day Streak',        value: 7,  max: 30,  color: '#f5a800' },
];

// ─── Gesture Signs ───────────────────────────────────────────

export interface GestureSign {
  sign: string;
  emoji: string;
  hint: string;
}

export const GESTURE_SIGNS: GestureSign[] = [
  { sign: 'A',         emoji: '✊', hint: 'Make a fist with your thumb resting beside your fingers' },
  { sign: 'B',         emoji: '✋', hint: 'Hold all four fingers straight up, thumb tucked across palm' },
  { sign: 'C',         emoji: '🤏', hint: 'Curve your hand as if holding a ball — like the letter C' },
  { sign: 'Hello',     emoji: '👋', hint: 'Wave your open hand at eye level, palm facing outward' },
  { sign: 'Thank You', emoji: '🙏', hint: 'Touch fingertips to chin, then bring hand forward' },
  { sign: '1',         emoji: '☝️', hint: 'Extend your index finger upward, fist closed' },
];

// ─── Onboarding ──────────────────────────────────────────────

export const ONBOARDING_SLIDES = [
  {
    id: 0,
    title: 'Welcome to SEÑAS',
    subtitle: 'Your Filipino Sign Language\nJourney Starts Here',
    body: 'Learn FSL in a fun, interactive, and supportive environment designed just for you.',
    bgStart: '#e0f5f5',
    bgEnd: '#b8e8e8',
    accent: '#2eadad',
    icon: '👋',
  },
  {
    id: 1,
    title: 'Learn at Your Pace',
    subtitle: 'Lessons Built\nFor Every Level',
    body: 'From the alphabet to full conversations — step-by-step lessons guide you through every sign.',
    bgStart: '#fff9f0',
    bgEnd: '#ffd580',
    accent: '#f5a800',
    icon: '📚',
  },
  {
    id: 2,
    title: 'Practice & Play',
    subtitle: 'Fun Quizzes and\nReal Gesture Practice',
    body: 'Test your skills with interactive quizzes and use your camera to practice real FSL signs.',
    bgStart: '#f3f0ff',
    bgEnd: '#c4b5fd',
    accent: '#8b5cf6',
    icon: '🎯',
  },
  {
    id: 3,
    title: 'Earn & Celebrate',
    subtitle: 'Collect Badges\nand Milestones',
    body: 'Every lesson completed earns you achievements. Track your growth and celebrate every win!',
    bgStart: '#f0fff4',
    bgEnd: '#86efac',
    accent: '#22c55e',
    icon: '🏆',
  },
];

// ─── Assessment ──────────────────────────────────────────────

export const ASSESSMENT_QUESTIONS = [
  {
    id: 0,
    q: 'Have you ever learned Filipino Sign Language before?',
    options: [
      { label: 'No, I am brand new!',     emoji: '🌱', value: 0 },
      { label: 'I know a little bit',     emoji: '🌿', value: 1 },
      { label: 'I know the basics',       emoji: '🌳', value: 2 },
      { label: 'I am quite familiar',     emoji: '🏆', value: 3 },
    ],
  },
  {
    id: 1,
    q: 'How well do you know the FSL alphabet?',
    options: [
      { label: "I don't know it yet",    emoji: '🙈', value: 0 },
      { label: 'I know a few letters',   emoji: '🔤', value: 1 },
      { label: 'I know most of it',      emoji: '📝', value: 2 },
      { label: 'I know all 26 letters!', emoji: '✅', value: 3 },
    ],
  },
  {
    id: 2,
    q: 'Can you sign basic greetings like "Hello" or "Thank you"?',
    options: [
      { label: 'Not yet',                emoji: '👋', value: 0 },
      { label: 'I think so!',            emoji: '😊', value: 1 },
      { label: 'Yes, I can!',            emoji: '👍', value: 2 },
      { label: 'Yes, and I know more!',  emoji: '⭐', value: 3 },
    ],
  },
  {
    id: 3,
    q: 'How often would you like to practice?',
    options: [
      { label: 'A few times a week',    emoji: '🌙', value: 0 },
      { label: 'Once a day',            emoji: '☀️', value: 1 },
      { label: 'Twice a day',           emoji: '🔥', value: 2 },
      { label: 'Multiple times daily',  emoji: '💪', value: 3 },
    ],
  },
];

export const LEVELS = [
  { label: 'Beginner',     color: '#22c55e', icon: '🌱', desc: "You're just starting! We'll begin from the basics." },
  { label: 'Elementary',   color: '#2eadad', icon: '📘', desc: "You know a little! Let's build on what you know." },
  { label: 'Intermediate', color: '#8b5cf6', icon: '💪', desc: "Nice! You have a solid foundation to work from." },
  { label: 'Advanced',     color: '#f5a800', icon: '🌟', desc: "Impressive! Time to sharpen your skills further." },
];