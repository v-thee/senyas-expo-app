// app/quiz/QuizMC.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import SplashScreen from '../screens/LoadingCompute';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Images ──
const images: Record<string, any> = {
  senyaBlue: require('@/assets/images/senya_blue.png'),
  senyaMagnify: require('@/assets/images/senya_magnify.png'),
  senyaTeaching: require('@/assets/images/senya_teaching.png'),
  senyasLogo: require('@/assets/images/senyas_logo.png'),
  alphabet: require('@/assets/images/alphabet.png'),
  greet: require('@/assets/images/greet.png'),
  numbers: require('@/assets/images/numbers.png'),
  multipleChoice: require('@/assets/images/multiple_choice.png'),
  dragNdrop: require('@/assets/images/dragNdrop.png'),
  camera: require('@/assets/images/camera.png'),
  badges: require('@/assets/images/badges.png'),
  streak: require('@/assets/images/streak.png'),
  beginner: require('@/assets/images/beginner.png'),
  book: require('@/assets/images/book.png'),
  // Alphabet images
  a: require('@/assets/images/alphabet/a.jpg'),
  b: require('@/assets/images/alphabet/b.jpg'),
  c: require('@/assets/images/alphabet/c.jpg'),
  d: require('@/assets/images/alphabet/d.jpg'),
  e: require('@/assets/images/alphabet/e.jpg'),
  f: require('@/assets/images/alphabet/f.jpg'),
  g: require('@/assets/images/alphabet/g.jpg'),
  h: require('@/assets/images/alphabet/h.jpg'),
  i: require('@/assets/images/alphabet/i.jpg'),
  j: require('@/assets/images/alphabet/j.jpg'),
  k: require('@/assets/images/alphabet/k.jpg'),
  l: require('@/assets/images/alphabet/l.jpg'),
  m: require('@/assets/images/alphabet/m.jpg'),
  n: require('@/assets/images/alphabet/n.jpg'),
  o: require('@/assets/images/alphabet/o.jpg'),
  p: require('@/assets/images/alphabet/p.jpg'),
  q: require('@/assets/images/alphabet/q.jpg'),
  r: require('@/assets/images/alphabet/r.jpg'),
  s: require('@/assets/images/alphabet/s.jpg'),
  t: require('@/assets/images/alphabet/t.jpg'),
  u: require('@/assets/images/alphabet/u.jpg'),
  v: require('@/assets/images/alphabet/v.jpg'),
  w: require('@/assets/images/alphabet/w.jpg'),
  x: require('@/assets/images/alphabet/x.jpg'),
  y: require('@/assets/images/alphabet/y.jpg'),
  z: require('@/assets/images/alphabet/z.jpg'),
};

// ── Design Tokens ──
const C = {
  deepBlue: '#152B6B',
  royal: '#2647B8',
  royalLight: '#3B5FE0',
  sky: '#5EC8FA',
  gold: '#FFC542',
  goldDeep: '#F2A400',
  streak: '#FF8A3D',
  ink: '#101635',
  slate: '#565E80',
  slateLight: '#AEB4CE',
  card: '#FFFFFF',
  bg: '#EEF1FB',
  statsZone: '#E7EEFF',
  danger: '#EF4444',
  border: '#DCE4FA',
  success: '#10B981',
  needsWork: '#F59E0B',
};

// ── Icons ──
const Star = ({ size = 24, color = "#000", fill = "none" }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);

const Trophy = ({ size = 24, color = "#FFC542" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3h12v4a6 6 0 01-12 0V3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 13v8M8 21h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M18 7a6 6 0 01-12 0M6 3v5a6 6 0 0012 0V3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Clock = ({ size = 24, color = "#6B7492" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircle = ({ size = 24, color = "#10B981" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill={color + '18'} />
    <Path d="M7 12l3 3 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowLeft = ({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRight = ({ size = 24, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Home = ({ size = 24, color = "#2647B8" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Hands = ({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 13V8a1 1 0 0 1 2 0v5M8 13v3a3 3 0 0 0 6 0v-3M8 13V6a1 1 0 0 1 2 0v7M14 11V7a1 1 0 0 1 2 0v4M14 11v2a2 2 0 0 0 4 0v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-8 0"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Lock = ({ size = 24, color = '#6B7492' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ── Types ──
interface QuizQuestion {
  id: number;
  lesson: number;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'arrange_words';
  question: string;
  options?: string[];
  correct: string | number;
  points: number;
  imageKey?: string;
}

interface StudentRank {
  id: number;
  name: string;
  score: number;
  time: number;
}

// ── Helper function to shuffle array ──
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ── Helper to shuffle question options ──
const shuffleQuestionOptions = (q: QuizQuestion): QuizQuestion => {
  // Skip if no options or options is empty
  if (!q.options || q.options.length === 0) return q;
  
  // Skip if correct is not a number (true/false questions)
  if (typeof q.correct !== 'number') return q;
  
  // Skip if correct index is out of bounds
  if (q.correct < 0 || q.correct >= q.options.length) return q;
  
  // Skip if the question already has shuffled options (indicated by imageKey)
  // Alphabet questions already have shuffled options and should not be reshuffled
  if (q.imageKey) return q;
  
  const correctOption = q.options[q.correct];
  const wrongOptions = q.options.filter((_, i) => i !== q.correct);
  const allOptions = shuffleArray([correctOption, ...wrongOptions]);
  const newCorrectIndex = allOptions.indexOf(correctOption);
  
  return {
    ...q,
    options: allOptions,
    correct: newCorrectIndex,
  };
};

// ── All Quiz Questions by Lesson ──
const generateAlphabetQuestions = (lessonId: number, letters: string[]): QuizQuestion[] => {
  return letters.map((letter, index) => {
    const letterCode = letter.charCodeAt(0);
    const correctOption = `Letter ${letter}`;
    const wrongOptions = [
      `Letter ${String.fromCharCode(letterCode + 1)}`,
      `Letter ${String.fromCharCode(letterCode - 1)}`,
      `Letter ${String.fromCharCode(letterCode + 2)}`,
    ];
    const allOptions = shuffleArray([correctOption, ...wrongOptions]);
    const correctIndex = allOptions.indexOf(correctOption);
    
    return {
      id: index + 1 + (lessonId - 1) * 20,
      lesson: lessonId,
      type: 'multiple_choice',
      question: `What sign is this?`,
      options: allOptions,
      correct: correctIndex,
      points: 1,
      imageKey: letter.toLowerCase(),
    };
  });
};

const generateNumberQuestions = (): QuizQuestion[] => {
  const numbers = [
    { num: 1, sign: 'One' },
    { num: 2, sign: 'Two' },
    { num: 3, sign: 'Three' },
    { num: 4, sign: 'Four' },
    { num: 5, sign: 'Five' },
    { num: 6, sign: 'Six' },
    { num: 7, sign: 'Seven' },
    { num: 8, sign: 'Eight' },
    { num: 9, sign: 'Nine' },
    { num: 10, sign: 'Ten' },
  ];
  return numbers.map((item, index) => {
    const correctOption = `${item.sign} (${item.num})`;
    const wrongOptions = [
      `${item.sign} (${item.num + 1})`,
      `${item.sign} (${item.num - 1})`,
      `${item.sign} (${item.num + 2})`,
    ];
    const allOptions = shuffleArray([correctOption, ...wrongOptions]);
    const correctIndex = allOptions.indexOf(correctOption);
    
    return {
      id: index + 50,
      lesson: 3,
      type: 'multiple_choice',
      question: `What number is this sign?`,
      options: allOptions,
      correct: correctIndex,
      points: 1,
    };
  });
};

const greetingQuestions: QuizQuestion[] = [
  {
    id: 60,
    lesson: 4,
    type: 'multiple_choice',
    question: 'How do you sign "Hello"?',
    options: ['Wave hand near forehead', 'Wave hand near chin', 'Wave hand near shoulder', 'Wave hand near chest'],
    correct: 0,
    points: 1,
  },
  {
    id: 61,
    lesson: 4,
    type: 'multiple_choice',
    question: 'How do you sign "Good Morning"?',
    options: ['Hand from chin outward', 'Hand from forehead downward', 'Hand from chest outward', 'Hand from shoulder upward'],
    correct: 1,
    points: 1,
  },
  {
    id: 62,
    lesson: 4,
    type: 'multiple_choice',
    question: 'How do you sign "Good Evening"?',
    options: ['Hand from chin outward', 'Hand from forehead downward', 'Hand from shoulder with palm down', 'Hand from chest outward'],
    correct: 2,
    points: 1,
  },
  {
    id: 63,
    lesson: 4,
    type: 'multiple_choice',
    question: 'How do you sign "Goodbye"?',
    options: ['Wave hand side to side', 'Nod head up and down', 'Hand on chest', 'Point forward'],
    correct: 0,
    points: 1,
  },
];

const introductionQuestions: QuizQuestion[] = [
  {
    id: 64,
    lesson: 5,
    type: 'multiple_choice',
    question: 'How do you sign "My name is"?',
    options: ['Point to self + sign name', 'Point to others + sign name', 'Hand on chest + sign name', 'Wave hand + sign name'],
    correct: 0,
    points: 1,
  },
  {
    id: 65,
    lesson: 5,
    type: 'multiple_choice',
    question: 'How do you sign "What is your name?"',
    options: ['Point to others + question sign', 'Point to self + question sign', 'Hand on chin + question sign', 'Wave hand + question sign'],
    correct: 0,
    points: 1,
  },
  {
    id: 66,
    lesson: 5,
    type: 'multiple_choice',
    question: 'How do you sign "I am a student"?',
    options: ['Point to self + student sign', 'Point to others + student sign', 'Hand on chest + student sign', 'Wave hand + student sign'],
    correct: 0,
    points: 1,
  },
  {
    id: 67,
    lesson: 5,
    type: 'multiple_choice',
    question: 'How do you sign "Nice to meet you"?',
    options: ['Handshake motion + point', 'Wave hand + smile', 'Hand on heart + point', 'Nod head + wave'],
    correct: 0,
    points: 1,
  },
];

const courtesyQuestions: QuizQuestion[] = [
  {
    id: 68,
    lesson: 6,
    type: 'multiple_choice',
    question: 'How do you sign "Thank you"?',
    options: ['Hand from chin outward', 'Hand from forehead downward', 'Hand from chest outward', 'Hand from shoulder upward'],
    correct: 0,
    points: 1,
  },
  {
    id: 69,
    lesson: 6,
    type: 'multiple_choice',
    question: 'How do you sign "Please"?',
    options: ['Circular motion on chest', 'Hand on chin', 'Hand on forehead', 'Hand on shoulder'],
    correct: 0,
    points: 1,
  },
  {
    id: 70,
    lesson: 6,
    type: 'multiple_choice',
    question: 'How do you sign "Sorry"?',
    options: ['Circular motion on chest', 'Hand on chin', 'Hand on forehead', 'Hand on shoulder'],
    correct: 0,
    points: 1,
  },
  {
    id: 71,
    lesson: 6,
    type: 'multiple_choice',
    question: 'How do you sign "You\'re welcome"?',
    options: ['Hand from chin outward', 'Hand from forehead downward', 'Hand from chest outward', 'Hand from shoulder upward'],
    correct: 0,
    points: 1,
  },
];

const conversationQuestions: QuizQuestion[] = [
  {
    id: 72,
    lesson: 7,
    type: 'multiple_choice',
    question: 'How do you sign "How are you?"',
    options: ['Hand on chest + question sign', 'Point to others + question sign', 'Hand on chin + question sign', 'Wave hand + question sign'],
    correct: 0,
    points: 1,
  },
  {
    id: 73,
    lesson: 7,
    type: 'multiple_choice',
    question: 'How do you sign "I am fine"?',
    options: ['Point to self + fine sign', 'Point to others + fine sign', 'Hand on chest + fine sign', 'Wave hand + fine sign'],
    correct: 0,
    points: 1,
  },
  {
    id: 74,
    lesson: 7,
    type: 'multiple_choice',
    question: 'How do you sign "Where is the bathroom?"',
    options: ['Question sign + bathroom sign', 'Point + bathroom sign', 'Hand on chin + bathroom sign', 'Wave + bathroom sign'],
    correct: 0,
    points: 1,
  },
  {
    id: 75,
    lesson: 7,
    type: 'multiple_choice',
    question: 'How do you sign "I need help"?',
    options: ['Point to self + help sign', 'Point to others + help sign', 'Hand on chest + help sign', 'Wave hand + help sign'],
    correct: 0,
    points: 1,
  },
];

// ── Get questions by lesson ──
const getLessonQuestions = (lessonId: number): QuizQuestion[] => {
  if (lessonId === 0) return unitExamQuestions;
  
  const allQuestions: QuizQuestion[] = [
    ...generateAlphabetQuestions(1, ['A', 'B', 'C', 'D', 'E', 'F', 'G']),
    ...generateAlphabetQuestions(2, ['H', 'I', 'J', 'K', 'L', 'M', 'N']),
    ...generateAlphabetQuestions(3, ['O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']),
    ...generateNumberQuestions(),
    ...greetingQuestions.map(shuffleQuestionOptions),
    ...introductionQuestions.map(shuffleQuestionOptions),
    ...courtesyQuestions.map(shuffleQuestionOptions),
    ...conversationQuestions.map(shuffleQuestionOptions),
  ];
  
  return allQuestions.filter(q => q.lesson === lessonId);
};

// ── Unit Exam Questions (30 questions from your assessment) ──
const unitExamQuestions: QuizQuestion[] = [
  // PART I: Multiple Choice (Items 1-15)
  {
    id: 101,
    lesson: 0,
    type: 'multiple_choice',
    question: 'Which letter in the FSL manual alphabet is formed by crossing your index finger over your middle finger?',
    options: ['X', 'R', 'V', 'K'],
    correct: 1,
    points: 1,
  },
  {
    id: 102,
    lesson: 0,
    type: 'multiple_choice',
    question: 'When signing "MY" or "MINE", where do you place your open palm?',
    options: ['On your chin', 'Against the center of your chest', 'On your temple', 'Pushed forward toward the other person'],
    correct: 1,
    points: 1,
  },
  {
    id: 103,
    lesson: 0,
    type: 'multiple_choice',
    question: 'How do you form the sign for "YES" in FSL?',
    options: ['Snapping your fingers quickly', 'Tilting an "S" fist forward twice like a head nod', 'Rubbing your palm in circles on your chest', 'Moving your hand side to side'],
    correct: 1,
    points: 1,
  },
  {
    id: 104,
    lesson: 0,
    type: 'multiple_choice',
    question: 'What facial expression should accompany a question sign like "WHAT" in FSL?',
    options: ['Broad smile', 'Eyebrows raised high', 'Furrowed eyebrows', 'Neutral/blank expression'],
    correct: 2,
    points: 1,
  },
  {
    id: 105,
    lesson: 0,
    type: 'multiple_choice',
    question: 'Which gesture forms the sign for "THANK YOU"?',
    options: ['Flat palm touching lips/chin, then moving outward toward the person', 'Rubbing chest in a clockwise circle', 'Waving fingers up and down near the temple', 'Tapping two "H" handshapes together'],
    correct: 0,
    points: 1,
  },
  {
    id: 106,
    lesson: 0,
    type: 'multiple_choice',
    question: 'Touch the thumb tip to the tips of the middle, ring, and pinky fingers while keeping the index finger pointing straight up forms which letter?',
    options: ['B', 'D', 'F', 'I'],
    correct: 1,
    points: 1,
  },
  {
    id: 107,
    lesson: 0,
    type: 'multiple_choice',
    question: 'Which two signs are combined to say "Good Morning"?',
    options: ['GOOD + HELLO', 'NICE + MORNING', 'GOOD + MORNING', 'HELLO + SUN'],
    correct: 2,
    points: 1,
  },
  {
    id: 108,
    lesson: 0,
    type: 'multiple_choice',
    question: 'Extending the index finger straight up and the thumb straight out at a 90-degree angle forms which letter?',
    options: ['L', 'C', 'G', 'Y'],
    correct: 0,
    points: 1,
  },
  {
    id: 109,
    lesson: 0,
    type: 'multiple_choice',
    question: 'How do you sign "YOUR" or "YOURS" in FSL?',
    options: ['Tapping your chest with a fist', 'Pushing a flat palm forward toward the other person', 'Pointing upward with your pinky', 'Waving both hands'],
    correct: 1,
    points: 1,
  },
  {
    id: 110,
    lesson: 0,
    type: 'multiple_choice',
    question: 'Which letter is signed by forming an "I" handshape and tracing a downward curve in the air?',
    options: ['Z', 'J', 'U', 'X'],
    correct: 1,
    points: 1,
  },
  {
    id: 111,
    lesson: 0,
    type: 'multiple_choice',
    question: 'How do you sign "NO" in FSL?',
    options: ['Shaking your flat palm back and forth', 'Snapping your index and middle fingers down against your thumb', 'Holding a fist against your chin', 'Crossing both arms over your chest'],
    correct: 1,
    points: 1,
  },
  {
    id: 112,
    lesson: 0,
    type: 'multiple_choice',
    question: 'To sign "MEET", what action do you perform with both index fingers?',
    options: ['Cross them in an "X" shape', 'Point them at your eyes', 'Bring them together until they touch in front of you', 'Tap them on your chest'],
    correct: 2,
    points: 1,
  },
  {
    id: 113,
    lesson: 0,
    type: 'multiple_choice',
    question: 'The sign for "PLEASE" involves which hand movement?',
    options: ['Rubbing a flat palm in a circular motion on the chest', 'Sliding one hand across another', 'Flicking the index finger from the temple', 'Waving outward from the mouth'],
    correct: 0,
    points: 1,
  },
  {
    id: 114,
    lesson: 0,
    type: 'multiple_choice',
    question: 'To sign "UNDERSTAND", where do you flick your index finger upward from an "S" fist?',
    options: ['Near your chest', 'Near your temple / forehead', 'Near your chin', 'Next to your waist'],
    correct: 1,
    points: 1,
  },
  {
    id: 115,
    lesson: 0,
    type: 'multiple_choice',
    question: 'What is the hand movement for "GOODBYE"?',
    options: ['Waving an open palm with bending fingers toward the departing person', 'Tapping two thumbs together', 'Sweeping a palm across the table', 'Pointing at the door'],
    correct: 0,
    points: 1,
  },
  // PART II: True or False (Items 16-25)
  {
    id: 116,
    lesson: 0,
    type: 'true_false',
    question: 'Fingerspelling is used to spell out proper names and words that do not have dedicated signs.',
    correct: 'TRUE',
    points: 1,
  },
  {
    id: 117,
    lesson: 0,
    type: 'true_false',
    question: 'In FSL sentence structure, "What is your name?" is signed in the order: WHAT + YOUR + NAME.',
    correct: 'FALSE',
    points: 1,
  },
  {
    id: 118,
    lesson: 0,
    type: 'true_false',
    question: 'The letter "A" is formed by opening all five fingers and spreading them wide.',
    correct: 'FALSE',
    points: 1,
  },
  {
    id: 119,
    lesson: 0,
    type: 'true_false',
    question: 'The sign for "AFTERNOON" uses an arm positioned at an angle to represent the position of the sun.',
    correct: 'TRUE',
    points: 1,
  },
  {
    id: 120,
    lesson: 0,
    type: 'true_false',
    question: 'The sign for "GOOD" starts with fingertips at the chin and lands on the opposite palm.',
    correct: 'TRUE',
    points: 1,
  },
  {
    id: 121,
    lesson: 0,
    type: 'true_false',
    question: 'The letter "V" is formed by extending the index and middle fingers upward in a spread shape.',
    correct: 'TRUE',
    points: 1,
  },
  {
    id: 122,
    lesson: 0,
    type: 'true_false',
    question: 'To sign "DON\'T UNDERSTAND", you execute the sign for UNDERSTAND while nodding your head "yes".',
    correct: 'FALSE',
    points: 1,
  },
  {
    id: 123,
    lesson: 0,
    type: 'true_false',
    question: 'The sign for "EVENING" or "NIGHT" shows the dominant hand curving downward like the sun setting below the horizon.',
    correct: 'TRUE',
    points: 1,
  },
  {
    id: 124,
    lesson: 0,
    type: 'true_false',
    question: 'Placing a flat palm on your chest signifies the concept of "YOU" or "YOURS".',
    correct: 'FALSE',
    points: 1,
  },
  {
    id: 125,
    lesson: 0,
    type: 'true_false',
    question: 'The letter "Z" is signed by using your index finger to trace out a "Z" shape in the air.',
    correct: 'TRUE',
    points: 1,
  },
  // PART III: FSL Grammar & Identification (Items 26-30)
  {
    id: 126,
    lesson: 0,
    type: 'arrange_words',
    question: 'Convert this English sentence into proper FSL Grammar Order:\n\n"What is your name?"\n\n→ FSL Order: ______________ + ______________ + ______________',
    correct: 'YOUR + NAME + WHAT',
    points: 2,
  },
  {
    id: 127,
    lesson: 0,
    type: 'arrange_words',
    question: 'Convert this English sentence into proper FSL Grammar Order:\n\n"My name is Leo."\n\n→ FSL Order: ______________ + ______________ + L-E-O',
    correct: 'MY + NAME',
    points: 2,
  },
  {
    id: 128,
    lesson: 0,
    type: 'arrange_words',
    question: 'Convert this English sentence into proper FSL Grammar Order:\n\n"Nice to meet you."\n\n→ FSL Order: ______________ + ______________ + ______________',
    correct: 'NICE + MEET + YOU',
    points: 2,
  },
  {
    id: 129,
    lesson: 0,
    type: 'fill_blank',
    question: 'What FSL term refers to using handshapes to represent individual letters of the alphabet?\n\n→ Answer: __________________________',
    correct: 'FINGERSPELLING',
    points: 2,
  },
  {
    id: 130,
    lesson: 0,
    type: 'fill_blank',
    question: 'Tapping two "H" handshapes together horizontally twice represents which sign?\n\n→ Answer: __________________________',
    correct: 'NAME',
    points: 2,
  },
];

// ── Confetti Component ──
const Confetti = ({ active }: { active: boolean }) => {
  const [particles] = useState(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: -20 - Math.random() * 100,
      size: 4 + Math.random() * 10,
      color: ['#FFC542', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF8A3D', '#A29BFE', '#FF6B9D', '#00D2FF', '#FFD93D'][Math.floor(Math.random() * 10)],
      speed: 2 + Math.random() * 5,
      angle: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
    }))
  );
  
  const [positions, setPositions] = useState(particles.map(p => ({ ...p, y: p.y })));

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setPositions(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.speed * 1.8,
          x: p.x + Math.sin(p.y / 100) * p.angle * 1.5,
          rotation: p.rotation + 3,
        }))
      );
    }, 16);

    const resetInterval = setInterval(() => {
      setPositions(prev =>
        prev.map(p => ({
          ...p,
          y: p.y > SCREEN_HEIGHT + 50 ? -20 - Math.random() * 100 : p.y,
          x: p.x > SCREEN_WIDTH + 50 ? Math.random() * SCREEN_WIDTH : p.x < -50 ? Math.random() * SCREEN_WIDTH : p.x,
        }))
      );
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {positions.map(p => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            transform: [{ rotate: `${p.rotation}deg` }],
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
};

// ── Category Data with Images ──
interface Category {
  id: number;
  label: string;
  image: any;
  color: string;
  bgColor: string;
  title: string;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    label: 'Alphabet A-G',
    image: images.alphabet,
    color: C.royal,
    bgColor: C.royal + '22',
    title: 'Letters A-G',
    description: 'The first 7 letters of the FSL manual alphabet',
  },
  {
    id: 2,
    label: 'Alphabet H-N',
    image: images.alphabet,
    color: C.royal,
    bgColor: C.royal + '22',
    title: 'Letters H-N',
    description: 'Letters H through N',
  },
  {
    id: 3,
    label: 'Alphabet O-Z',
    image: images.alphabet,
    color: C.royal,
    bgColor: C.royal + '22',
    title: 'Letters O-Z',
    description: 'The remaining letters, O through Z',
  },
  {
    id: 4,
    label: 'Greetings',
    image: images.greet,
    color: C.goldDeep,
    bgColor: C.goldDeep + '22',
    title: 'Basic Greetings',
    description: 'Hello, Good Morning, Good Afternoon, Good Evening',
  },
  {
    id: 5,
    label: 'Introductions',
    image: images.book,
    color: C.sky,
    bgColor: C.sky + '22',
    title: 'Introduction',
    description: 'Introducing yourself and meeting others',
  },
  {
    id: 6,
    label: 'Courtesy',
    image: images.badges,
    color: C.success,
    bgColor: C.success + '22',
    title: 'Courtesy',
    description: 'Polite signs and responses',
  },
  {
    id: 7,
    label: 'Conversation',
    image: images.multipleChoice,
    color: C.royal,
    bgColor: C.royal + '22',
    title: 'Basic Conversation',
    description: 'Everyday conversations and questions',
  },
];

// ── Main Component ──
type QuizMCProps = {
  lessonIdParam?: number;
  onExit: () => void;
};

export default function QuizMC({ lessonIdParam = 0, onExit }: QuizMCProps) {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const lessonId = lessonIdParam || (params.lessonId ? parseInt(params.lessonId as string) : 0);
  
  // State
  const [showExam, setShowExam] = useState(lessonId > 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<string | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [arrangeAnswer, setArrangeAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [examEndTime, setExamEndTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [userRank, setUserRank] = useState<{ rank: number; total: number } | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [studentRankings, setStudentRankings] = useState<StudentRank[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const [confettiActive, setConfettiActive] = useState(false);

  // ── API Functions ──
  const API_URL = 'http://192.168.24.206/api/api.php';

  const getUserName = async (): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return 'Student';

      const response = await fetch(`${API_URL}?action=getUser&id=${userId}`);
      const data = await response.json();
      
      if (data.status === "success" && data.user) {
        return data.user.name || 'Student';
      }
      return 'Student';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Student';
    }
  };

  const getRankings = async (): Promise<StudentRank[]> => {
    try {
      const response = await fetch(`${API_URL}?action=getRankings`);
      const data = await response.json();
      
      if (data.status === "success" && data.rankings) {
        return data.rankings.map((item: any) => ({
          id: item.id,
          name: item.name,
          score: item.score,
          time: item.time,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching rankings:', error);
      return [];
    }
  };

  const saveQuizResult = async (score: number, time: number) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('❌ No userId found, skipping save');
        return;
      }

      console.log('📤 Saving quiz result:', { userId, score, time, lessonId });

      const formData = new FormData();
      formData.append('action', 'saveQuizResult');
      formData.append('user_id', userId);
      formData.append('score', score.toString());
      formData.append('time', time.toString());
      formData.append('lesson_id', lessonId.toString());

      const response = await fetch(`${API_URL}?action=saveQuizResult`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('📥 Quiz result response:', data);
      
      if (data.status === 'success') {
        console.log('✅ Quiz result saved successfully!');
      } else {
        console.log('❌ Failed to save quiz result:', data.message);
      }
    } catch (error) {
      console.error('❌ Error saving quiz result:', error);
    }
  };

  // ── Initialize user name and rankings ──
  useEffect(() => {
    const initUser = async () => {
      const name = await getUserName();
      setStudentName(name);
    };
    initUser();
  }, []);

  // Initialize questions based on lesson
  useEffect(() => {
    const questions = getLessonQuestions(lessonId);
    setCurrentQuestions(questions);
    if (lessonId > 0 && questions.length > 0) {
      startExam();
    }
  }, [lessonId]);

  // Fetch rankings when result is shown
  useEffect(() => {
    if (showResult) {
      fetchRankings();
    }
  }, [showResult]);

  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const rankings = await getRankings();
      
      // Remove any entries with score 0 (they don't have quiz results yet)
      const filteredRankings = rankings.filter(r => r.score > 0);
      
      // Check if current user exists in the filtered rankings
      const userExists = filteredRankings.some(r => r.name === studentName);
      
      // Only add current user if they have a score AND don't already exist
      if (!userExists && examScore > 0) {
        filteredRankings.push({
          id: 999,
          name: studentName,
          score: examScore,
          time: timeSpent,
        });
      }
      
      // Sort by score (descending) then by time (ascending)
      const sorted = filteredRankings.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
      });
      
      setStudentRankings(sorted);
    } catch (error) {
      console.error('Error in fetchRankings:', error);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  const getTotalPoints = () => {
    return currentQuestions.reduce((sum, q) => sum + q.points, 0);
  };

  const startExam = () => {
    setShowExam(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setShowResult(false);
    setExamStartTime(Date.now());
    setTrueFalseAnswer(null);
    setFillBlankAnswer('');
    setArrangeAnswer('');
    setSelectedOption(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleTrueFalseSelect = (value: string) => {
    setTrueFalseAnswer(value);
  };

  const handleNext = () => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    let userAnswer = null;

    if (currentQuestion.type === 'multiple_choice') {
      userAnswer = selectedOption;
      if (selectedOption !== null) {
        isCorrect = selectedOption === currentQuestion.correct;
      }
    } else if (currentQuestion.type === 'true_false') {
      userAnswer = trueFalseAnswer;
      if (trueFalseAnswer !== null) {
        isCorrect = trueFalseAnswer === currentQuestion.correct;
      }
    } else if (currentQuestion.type === 'fill_blank') {
      userAnswer = fillBlankAnswer.toUpperCase().trim();
      if (fillBlankAnswer.trim() !== '') {
        isCorrect = userAnswer === currentQuestion.correct;
      }
    } else if (currentQuestion.type === 'arrange_words') {
      userAnswer = arrangeAnswer.toUpperCase().trim();
      if (arrangeAnswer.trim() !== '') {
        isCorrect = userAnswer === currentQuestion.correct;
      }
    }

    setUserAnswers([...userAnswers, { questionId: currentQuestion.id, answer: userAnswer, correct: isCorrect }]);

    // FIX: compute the up-to-date score locally instead of relying on the
    // `score` state variable, which won't reflect this answer until the
    // *next* render. Previously, on the final question, finishExam() ran
    // immediately after setScore() and read the stale `score` value, so a
    // correct last answer never made it into the final displayed score.
    const updatedScore = isCorrect ? score + currentQuestion.points : score;
    if (isCorrect) {
      setScore(updatedScore);
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setTrueFalseAnswer(null);
      setFillBlankAnswer('');
      setArrangeAnswer('');
    } else {
      finishExam(updatedScore);
    }
  };

  const finishExam = (finalScore: number) => {
    const endTime = Date.now();
    setExamEndTime(endTime);
    const totalTime = Math.floor((endTime - (examStartTime || endTime)) / 1000);
    setTimeSpent(totalTime);
    setExamScore(finalScore);
    setShowResult(true);
    setShowLoading(true);
    
    // Save quiz result to database
    saveQuizResult(finalScore, totalTime);
  };

  const getStars = (score: number) => {
    const total = getTotalPoints();
    const percentage = score / total;
    if (percentage >= 0.9) return 3;
    if (percentage >= 0.7) return 2;
    if (percentage >= 0.5) return 1;
    return 0;
  };

  const getGrade = (score: number) => {
    const total = getTotalPoints();
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeDescription = (score: number) => {
    const total = getTotalPoints();
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! Outstanding performance! 🌟';
    if (percentage >= 80) return 'Very Good! Keep up the great work! 👏';
    if (percentage >= 70) return 'Good! You\'re making progress! 💪';
    if (percentage >= 60) return 'Fair. Keep practicing! 📚';
    return 'Needs improvement. Review the lessons! 🔄';
  };

  const handleExit = () => {
    console.log("EXIT QUIZ");
    setShowConfirmationModal(false);
    onExit();
  };

  // ── Render Loading ──
  const renderLoading = () => {
    return (
      <SplashScreen 
        onFinish={() => {
          setShowLoading(false);
          // FIX: was reading the stale `score` state here instead of the
          // final `examScore`, which could misfire the confetti threshold
          // check right around a passing score.
          if (examScore / getTotalPoints() > 0.5) {
            setConfettiActive(true);
            setTimeout(() => setConfettiActive(false), 6000);
          }
        }} 
      />
    );
  };

  // ── Render Exam ──
  const renderExam = () => {
    if (currentQuestions.length === 0) {
      return (
        <View style={styles.container}>
          <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />
          <View style={styles.centerContent}>
            <Text style={styles.loadingTitle}>No questions available</Text>
          </View>
        </View>
      );
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const totalQuestions = currentQuestions.length;
    const isLast = currentQuestionIndex === totalQuestions - 1;
    const isAnswered = 
      (currentQuestion.type === 'multiple_choice' && selectedOption !== null) ||
      (currentQuestion.type === 'true_false' && trueFalseAnswer !== null) ||
      (currentQuestion.type === 'fill_blank' && fillBlankAnswer.trim() !== '') ||
      (currentQuestion.type === 'arrange_words' && arrangeAnswer.trim() !== '');

    const getQuestionImage = () => {
      if (currentQuestion.imageKey && images[currentQuestion.imageKey]) {
        return images[currentQuestion.imageKey];
      }
      return null;
    };

    const questionImage = getQuestionImage();

    const renderQuestionInput = () => {
      switch (currentQuestion.type) {
        case 'multiple_choice':
          return (
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedOption === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleOptionSelect(index)}
                  >
                    <View style={styles.optionRadio}>
                      {isSelected && <View style={styles.optionRadioSelected} />}
                    </View>
                    <Text style={styles.optionText}>{String.fromCharCode(65 + index)}) {option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );

        case 'true_false':
          return (
            <View style={styles.optionsContainer}>
              {['TRUE', 'FALSE'].map((value, index) => {
                const isSelected = trueFalseAnswer === value;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleTrueFalseSelect(value)}
                  >
                    <View style={styles.optionRadio}>
                      {isSelected && <View style={styles.optionRadioSelected} />}
                    </View>
                    <Text style={styles.optionText}>{value}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );

        case 'fill_blank':
          return (
            <View style={styles.fillBlankContainer}>
              <TextInput
                style={styles.fillBlankInput}
                placeholder="Type your answer here..."
                placeholderTextColor={C.slateLight}
                value={fillBlankAnswer}
                onChangeText={setFillBlankAnswer}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Text style={styles.fillBlankHint}>Type your answer in ALL CAPS</Text>
            </View>
          );

        case 'arrange_words':
          return (
            <View style={styles.fillBlankContainer}>
              <TextInput
                style={styles.fillBlankInput}
                placeholder="Type the FSL order (e.g., YOUR + NAME + WHAT)"
                placeholderTextColor={C.slateLight}
                value={arrangeAnswer}
                onChangeText={setArrangeAnswer}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Text style={styles.fillBlankHint}>Use + between words. Type in ALL CAPS</Text>
            </View>
          );

        default:
          return null;
      }
    };

    const getLessonTitle = () => {
      if (lessonId === 0) return 'Unit Exam';
      const category = CATEGORIES.find(c => c.id === lessonId);
      return category ? category.title : `Lesson ${lessonId}`;
    };

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />

        <View style={styles.blobContainer}>
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />
          <View style={[styles.blob, styles.blob3]} />
        </View>

        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerRow}>
            <BouncyPress onPress={() => setShowConfirmationModal(true)} style={styles.backBtn}>
              <ArrowLeft size={26} color={C.royal} />
            </BouncyPress>
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.pageTitle, { color: C.ink }]} numberOfLines={1}>
                {getLessonTitle()}
              </Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{score}</Text>
                <Text style={styles.scoreTotal}>/{getTotalPoints()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.practiceProgressRow}>
            <View style={styles.practiceProgressTrack}>
              <View
                style={[
                  styles.practiceProgressFill,
                  { width: `${((currentQuestionIndex) / totalQuestions) * 100}%`, backgroundColor: C.royal },
                ]}
              />
            </View>
            <Text style={styles.practiceProgressLabel}>
              {currentQuestionIndex + 1} / {totalQuestions}
            </Text>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.lessonContent, { paddingBottom: 40 }]}
        >
          {lessonId === 0 && (
            <View style={styles.partBadge}>
              <Text style={styles.partBadgeText}>Part {currentQuestion.id < 116 ? 'I' : currentQuestion.id < 126 ? 'II' : 'III'}</Text>
            </View>
          )}

          {questionImage && (
            <View style={styles.imageContainer}>
              <Image 
                source={questionImage} 
                style={styles.questionImage} 
                resizeMode="contain"
              />
            </View>
          )}

          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {renderQuestionInput()}
        </ScrollView>

        <BouncyPress
          style={[
            styles.nextButton,
            !isAnswered && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <LinearGradient
            colors={[C.royal, C.royalLight]}
            style={styles.nextButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.nextButtonText}>
              {isLast ? 'Submit Quiz' : 'Next Question'}
            </Text>
            <ArrowRight size={20} color="#fff" />
          </LinearGradient>
        </BouncyPress>
      </View>
    );
  };

  // ── Render Result ──
  const renderResult = () => {
    const total = getTotalPoints();
    const percentage = (examScore / total) * 100;
    const stars = getStars(examScore);
    const grade = getGrade(examScore);
    const description = getGradeDescription(examScore);
    const userRankIndex = studentRankings.findIndex(s => s.name === studentName) + 1;
    const isInTop5 = userRankIndex <= 5;

    const getLessonTitle = () => {
      if (lessonId === 0) return 'Unit Exam';
      const category = CATEGORIES.find(c => c.id === lessonId);
      return category ? category.title : `Lesson ${lessonId}`;
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    };

    return (
      <View style={styles.resultContainer}>
        <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />
        
        <Confetti active={confettiActive} />
        
        <ScrollView 
          style={styles.examResultScroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🎉 Quiz Complete!</Text>
              <Text style={styles.resultSubtitle}>{getLessonTitle()}</Text>
            </View>

            <View style={styles.resultScoreContainer}>
              <Text style={styles.resultScore}>{examScore}</Text>
              <Text style={styles.resultTotal}>/ {total}</Text>
            </View>

            <View style={styles.resultStars}>
              {[1, 2, 3].map((i) => (
                <Star 
                  key={i} 
                  size={32} 
                  color={i <= stars ? C.gold : '#DCE4FA'} 
                  fill={i <= stars ? C.gold : 'none'} 
                />
              ))}
            </View>

            <View style={styles.resultGrade}>
              <Text style={styles.resultGradeText}>Grade: {grade}</Text>
            </View>

            <Text style={styles.resultDescription}>{description}</Text>

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Correct</Text>
                <Text style={styles.resultStatValue}>{examScore}</Text>
              </View>
              <View style={styles.resultStatDivider} />
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Incorrect</Text>
                <Text style={styles.resultStatValue}>{total - examScore}</Text>
              </View>
              <View style={styles.resultStatDivider} />
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Percentage</Text>
                <Text style={styles.resultStatValue}>{Math.round(percentage)}%</Text>
              </View>
            </View>

            <View style={styles.timeContainer}>
              <Clock size={20} color={C.slate} />
              <Text style={styles.timeText}>Time Spent: {formatTime(timeSpent)}</Text>
            </View>

            {/* Ranking Section */}
            <View style={styles.rankContainer}>
              <Text style={styles.rankTitle}>🏆 Student Rankings</Text>
              
              {isLoadingRankings ? (
                <View style={styles.loadingRankings}>
                  <Text style={styles.loadingRankingsText}>Loading rankings...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.rankHeader}>
                    <Text style={[styles.rankHeaderText, { width: 50 }]}>#</Text>
                    <Text style={[styles.rankHeaderText, { flex: 1 }]}>Name</Text>
                    <Text style={[styles.rankHeaderText, { width: 60 }]}>Score</Text>
                    <Text style={[styles.rankHeaderText, { width: 70 }]}>Time</Text>
                  </View>

                  {studentRankings.slice(0, 10).map((student, index) => {
                    const isUser = student.name === studentName;
                    const rankNumber = index + 1;
                    const medalEmoji = rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : rankNumber === 3 ? '🥉' : `#${rankNumber}`;
                    
                    return (
                      <View 
                        key={`${student.id}-${index}`}
                        style={[
                          styles.rankItem,
                          isUser && styles.userRankItem,
                          rankNumber <= 3 && styles.topRankItem
                        ]}
                      >
                        <Text style={[styles.rankPosition, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {medalEmoji}
                        </Text>
                        <Text style={[styles.rankName, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {student.name} {isUser && '(You)'}
                        </Text>
                        <Text style={[styles.rankScore, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {student.score}/{total}
                        </Text>
                        <Text style={[styles.rankTime, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {formatTime(student.time)}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
            </View>

            {/* Single Exit Button */}
            <View style={styles.resultButtonContainer}>
              <TouchableOpacity
                style={styles.resultButton}
                onPress={() => {
                  console.log("RESULT EXIT PRESSED");
                  setShowConfirmationModal(true);
                }}
              >
                <LinearGradient
                  colors={[C.royal, C.royalLight]}
                  style={styles.resultButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Home size={20} color="#fff" />
                  <Text style={[styles.resultButtonText, { marginLeft: 8 }]}>Exit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Confirmation Modal - MOVED INSIDE renderResult */}
        <Modal visible={showConfirmationModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Exit Quiz?</Text>
                <Text style={styles.modalDescription}>
                  Are you sure you want to exit? Your progress will be saved.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => {
                      console.log("MODAL CANCEL");
                      setShowConfirmationModal(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={handleExit}
                  >
                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>Exit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // ── BouncyPress Component ──
  function BouncyPress({
    onPress,
    disabled,
    style,
    children,
  }: {
    onPress: () => void;
    disabled?: boolean;
    style?: any;
    children: React.ReactNode;
  }) {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
      if (disabled) return;
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
    };
    const pressOut = () => {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 10 }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
      </TouchableOpacity>
    );
  }

  // ── Main Render ──
  if (showLoading) {
    return renderLoading();
  }

  if (showResult) {
    return renderResult();
  }

  if (showExam) {
    return renderExam();
  }

  return null;
}

// ── Styles ──
const styles = StyleSheet.create({
  container: { flex: 1 },
  
  blobContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 9999 },
  blob1: { width: 300, height: 300, top: -100, right: -100, backgroundColor: 'rgba(37, 99, 235, 0.04)' },
  blob2: { width: 200, height: 200, bottom: 100, left: -80, backgroundColor: 'rgba(245, 158, 11, 0.05)' },
  blob3: { width: 150, height: 150, top: '40%', right: -50, backgroundColor: 'rgba(124, 58, 237, 0.04)' },

  glassWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  glassTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.45)' },

  header: { paddingHorizontal: 20, paddingBottom: 12, backgroundColor: 'transparent' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  headerMascot: { width: 34, height: 34 },
  pageTitle: { fontSize: 26, fontWeight: '900', color: C.ink, flexShrink: 1 },

  // Exam styles
  practiceProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  practiceProgressTrack: { flex: 1, height: 8, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden' },
  practiceProgressFill: { height: '100%', borderRadius: 4 },
  practiceProgressLabel: { fontSize: 13, fontWeight: '800', color: C.slate },

  lessonContent: { paddingHorizontal: 20, paddingTop: 16 },

  partBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.royal + '22',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  partBadgeText: { fontSize: 12, fontWeight: '700', color: C.royal },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  questionImage: {
    width: SCREEN_WIDTH - 80,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.border,
  },

  questionText: { fontSize: 18, fontWeight: '600', color: C.ink, marginBottom: 20, lineHeight: 26 },

  optionsContainer: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.border,
    gap: 12,
  },
  optionSelected: { borderColor: C.royal, backgroundColor: C.royal + '11' },
  optionRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  optionRadioSelected: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.royal },
  optionText: { flex: 1, fontSize: 15, fontWeight: '500', color: C.ink },

  fillBlankContainer: { marginTop: 8 },
  fillBlankInput: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.border,
    fontSize: 16,
    fontWeight: '500',
    color: C.ink,
    minHeight: 50,
  },
  fillBlankHint: { fontSize: 12, fontWeight: '500', color: C.slate, marginTop: 8 },

  nextButton: { marginHorizontal: 20, marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  nextButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: C.gold + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.gold + '44',
  },
  scoreText: { fontSize: 18, fontWeight: '700', color: C.goldDeep },
  scoreTotal: { fontSize: 12, fontWeight: '600', color: C.slate },

  // Result styles
  resultContainer: { flex: 1, backgroundColor: '#F7FBFF' },
  examResultScroll: { flex: 1 },
  resultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginTop: 40,
    padding: 24,
    paddingTop: 50,
    borderRadius: 24,
    shadowColor: C.deepBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  resultHeader: { alignItems: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: '900', color: C.ink },
  resultSubtitle: { fontSize: 16, fontWeight: '500', color: C.slate, marginTop: 2 },
  resultScoreContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  resultScore: { fontSize: 64, fontWeight: '900', color: C.royal },
  resultTotal: { fontSize: 24, fontWeight: '600', color: C.slate },
  resultStars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  resultGrade: { alignItems: 'center', marginTop: 8 },
  resultGradeText: { fontSize: 20, fontWeight: '700', color: C.goldDeep },
  resultDescription: { fontSize: 16, fontWeight: '500', color: C.slate, textAlign: 'center', marginTop: 8 },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: C.statsZone,
    borderRadius: 12,
  },
  resultStat: { alignItems: 'center', flex: 1 },
  resultStatDivider: { width: 1, backgroundColor: C.border },
  resultStatLabel: { fontSize: 12, fontWeight: '600', color: C.slate, marginBottom: 2 },
  resultStatValue: { fontSize: 18, fontWeight: '700', color: C.ink },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: C.statsZone,
    borderRadius: 8,
  },
  timeText: { fontSize: 14, fontWeight: '600', color: C.slate },

  // Ranking styles
  rankContainer: { 
    marginTop: 16, 
    paddingTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: C.border,
  },
  rankTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: C.ink, 
    textAlign: 'center', 
    marginBottom: 12 
  },
  loadingRankings: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingRankingsText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.slate,
  },
  rankHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: C.statsZone,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.slate,
    textAlign: 'center',
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  topRankItem: {
    backgroundColor: C.gold + '15',
  },
  userRankItem: {
    backgroundColor: C.royal + '20',
    borderWidth: 2,
    borderColor: C.royal,
  },
  rankPosition: {
    width: 50,
    fontSize: 14,
    fontWeight: '700',
    color: C.slate,
    textAlign: 'center',
  },
  rankName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
  },
  rankScore: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: C.slate,
    textAlign: 'center',
  },
  rankTime: {
    width: 70,
    fontSize: 12,
    fontWeight: '500',
    color: C.slateLight,
    textAlign: 'center',
  },
  userRankText: {
    color: C.royal,
    fontWeight: '700',
  },
  topRankText: {
    color: C.goldDeep,
    fontWeight: '700',
  },

  resultButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultButton: {
    width: '60%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: SCREEN_WIDTH - 48, borderRadius: 24, overflow: 'hidden' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: C.ink, textAlign: 'center', marginBottom: 8 },
  modalDescription: { fontSize: 16, fontWeight: '500', color: C.slate, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: C.statsZone },
  modalButtonConfirm: { backgroundColor: C.danger },
  modalButtonText: { fontSize: 16, fontWeight: '700', color: C.ink },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingTitle: { fontSize: 24, fontWeight: '800', color: C.ink, marginBottom: 8 },
});