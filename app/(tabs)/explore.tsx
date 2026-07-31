import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
  Platform,
  Alert,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {
  Path,
  Circle,
  Rect,
  Polyline,
  Polygon,
  G,
  Defs,
  Filter,
  FeDropShadow,
  Image as SvgImage,
  Text as SvgText,
} from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Import assets ──
const senya_logo = require('@/assets/images/senyas_logo.png');
const streakIcon = require('@/assets/images/streak.png');
const lockedIcon = require('@/assets/images/locked.png');

// ── API Configuration ──
const API_URL = Platform.OS === 'android' 
  ? 'http://192.168.24.206/api/api.php'
  : 'http://192.168.24.206/api/api.php';

// ── API Helper Functions ──
async function apiRequest(action: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<any> {
  let url = `${API_URL}?action=${action}`;
  const options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (method === 'POST' && data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, String(data[key]));
        }
      }
    });
    options.body = formData.toString();
  } else if (method === 'GET' && data) {
    const params = new URLSearchParams(data);
    url += `&${params.toString()}`;
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (result.status === 'error') {
      throw new Error(result.message || 'API request failed');
    }
    
    return result;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// ── Icons ──
function SparkleIcon({ size = 14, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.8" />
      <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.5" />
      <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.5" />
    </Svg>
  );
}

function BellIcon({ size = 18, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InfoIcon({ size = 18, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// ── Glass Card Component ──
function GlassCard({
  children,
  style,
  intensity = 40,
  tint = 'light',
}: {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}) {
  return (
    <View style={[styles.glassWrap, style]}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={styles.glassTint} pointerEvents="none" />
      {children}
    </View>
  );
}

// ── Icons ──
const AlphabetIcon = ({ size = 22, color = '#fff' }: { size?: number; color?: string }) => (
  <Ionicons name="text-outline" size={size} color={color} />
);
const NumbersIcon = ({ size = 22, color = '#fff' }: { size?: number; color?: string }) => (
  <Ionicons name="calculator-outline" size={size} color={color} />
);
const GreetingIcon = ({ size = 22, color = '#fff' }: { size?: number; color?: string }) => (
  <Ionicons name="hand-left-outline" size={size} color={color} />
);
const ConversationIcon = ({ size = 22, color = '#fff' }: { size?: number; color?: string }) => (
  <Ionicons name="chatbubbles-outline" size={size} color={color} />
);

// ── Types ──
interface Sign {
  letter: string;
  hint: string;
}

interface Lesson {
  id: string;
  category: string;
  categoryId: string;
  title: string;
  desc: string;
  color: string;
  iconBg: string;
  duration: string;
  xp: number;
  done: boolean;
  active?: boolean;
  locked?: boolean;
  isExam?: boolean;
  signs: Sign[];
  requiredLessonId?: string;
}

// ── Base Lesson Data matching Lessons.tsx structure ──
const BASE_LESSONS: Lesson[] = [
  // Alphabet category - matches Lessons.tsx alphabet lessons
  {
    id: 'a',
    category: 'Alphabet',
    categoryId: 'alphabet',
    title: 'Letters A-G',
    desc: 'The first 7 letters of the FSL manual alphabet',
    color: '#2563EB',
    iconBg: '#EFF6FF',
    duration: '8 min',
    xp: 30,
    done: false,
    active: true,
    signs: [
      { letter: 'A', hint: 'Closed fist, thumb resting on the side of the index finger.' },
      { letter: 'B', hint: 'Four fingers held straight up, thumb folded across the palm.' },
      { letter: 'C', hint: 'Curve your hand into a C shape — like holding a can.' },
      { letter: 'D', hint: 'Index finger points up, other fingers and thumb form a circle.' },
      { letter: 'E', hint: 'All fingers curl down toward the palm, thumb tucked under.' },
      { letter: 'F', hint: 'Index finger and thumb touch to form a circle, other fingers up.' },
      { letter: 'G', hint: 'Index finger and thumb point sideways, parallel to the ground.' },
    ],
  },
  {
    id: 'b',
    category: 'Alphabet',
    categoryId: 'alphabet',
    title: 'Letters H-N',
    desc: 'Letters H through N',
    color: '#2563EB',
    iconBg: '#EFF6FF',
    duration: '8 min',
    xp: 30,
    done: false,
    locked: true,
    requiredLessonId: 'a',
    signs: [
      { letter: 'H', hint: 'Index and middle finger point sideways together, palm facing you.' },
      { letter: 'I', hint: 'Pinky finger points up, all other fingers folded into a fist.' },
      { letter: 'J', hint: 'Like I but trace a J shape in the air with your pinky.' },
      { letter: 'K', hint: 'Index and middle fingers point up, thumb between them.' },
      { letter: 'L', hint: 'Index finger points up, thumb points sideways — like an L.' },
      { letter: 'M', hint: 'Three fingers fold over the thumb — like a fist with thumb tucked.' },
      { letter: 'N', hint: 'Two fingers fold over the thumb — like a fist with thumb tucked.' },
    ],
  },
  {
    id: 'c',
    category: 'Alphabet',
    categoryId: 'alphabet',
    title: 'Letters O-Z',
    desc: 'The remaining letters, O through Z',
    color: '#2563EB',
    iconBg: '#EFF6FF',
    duration: '8 min',
    xp: 30,
    done: false,
    locked: true,
    requiredLessonId: 'b',
    signs: [
      { letter: 'O', hint: 'Form a full circle with all fingertips touching the thumb.' },
      { letter: 'P', hint: 'Like K but point the index finger downward.' },
      { letter: 'Q', hint: 'Like G but point both fingers downward.' },
      { letter: 'R', hint: 'Cross the index finger over the middle finger.' },
      { letter: 'S', hint: 'Tight fist with thumb folded across the front of the fingers.' },
      { letter: 'T', hint: 'Tuck the thumb between index and middle fingers in a fist.' },
      { letter: 'U', hint: 'Index and middle fingers point up, held close together.' },
      { letter: 'V', hint: 'Index and middle fingers point up, spread apart in a V.' },
      { letter: 'W', hint: 'Index, middle, and ring fingers point up, spread apart.' },
      { letter: 'X', hint: 'Hook the index finger into a claw shape.' },
      { letter: 'Y', hint: 'Pinky and thumb point out, middle three fingers tucked in.' },
      { letter: 'Z', hint: 'Use the index finger to trace a Z in the air.' },
    ],
  },
  // Numbers category - matches Lessons.tsx numbers lessons
  {
    id: 'num-1',
    category: 'Numbers',
    categoryId: 'numbers',
    title: 'Single Digits 0-9',
    desc: 'Learn to sign numbers 0 through 9 in FSL',
    color: '#6B7280',
    iconBg: '#F9FAFB',
    duration: '6 min',
    xp: 25,
    done: false,
    locked: true,
    requiredLessonId: 'c',
    signs: [
      { letter: '0', hint: 'Form an O shape with all fingers touching thumb.' },
      { letter: '1', hint: 'Index finger points straight up.' },
      { letter: '2', hint: 'Index and middle fingers raised in a V shape.' },
      { letter: '3', hint: 'Thumb, index, and middle fingers extended.' },
      { letter: '4', hint: 'Four fingers extended, thumb folded across the palm.' },
      { letter: '5', hint: 'All five fingers spread open wide.' },
      { letter: '6', hint: 'Pinky and thumb touch, other fingers extended up.' },
      { letter: '7', hint: 'Ring, pinky, and thumb touch, other fingers extended up.' },
      { letter: '8', hint: 'Middle, ring, pinky, and thumb touch, index extended up.' },
      { letter: '9', hint: 'All fingers curled except index, which forms a hook.' },
    ],
  },
  {
    id: 'num-2',
    category: 'Numbers',
    categoryId: 'numbers',
    title: 'Two-Digit Numbers 10-99',
    desc: 'Learn to sign numbers 10 through 99',
    color: '#6B7280',
    iconBg: '#F9FAFB',
    duration: '6 min',
    xp: 25,
    done: false,
    locked: true,
    requiredLessonId: 'num-1',
    signs: [
      { letter: '10', hint: 'Thumb touches the palm, other fingers extended up and shake.' },
      { letter: '20', hint: 'Index and middle fingers extended, shake slightly.' },
      { letter: '30', hint: 'Thumb, index, and middle extended, shake slightly.' },
      { letter: '40', hint: 'Four fingers extended, shake slightly.' },
      { letter: '50', hint: 'All five fingers spread, shake slightly.' },
      { letter: '60', hint: 'Pinky and thumb touch, other fingers extended up, shake.' },
      { letter: '70', hint: 'Ring, pinky, and thumb touch, other fingers extended up, shake.' },
      { letter: '80', hint: 'Middle, ring, pinky, and thumb touch, index extended up, shake.' },
      { letter: '90', hint: 'All fingers curled except index hook, shake.' },
      { letter: '25', hint: 'Combine 2 and 5 in sequence.' },
      { letter: '47', hint: 'Combine 4 and 7 in sequence.' },
      { letter: '82', hint: 'Combine 8 and 2 in sequence.' },
    ],
  },
  {
    id: 'num-3',
    category: 'Numbers',
    categoryId: 'numbers',
    title: 'Three-Digit Numbers 100-999',
    desc: 'Learn to sign numbers 100 through 999',
    color: '#6B7280',
    iconBg: '#F9FAFB',
    duration: '6 min',
    xp: 25,
    done: false,
    locked: true,
    requiredLessonId: 'num-2',
    signs: [
      { letter: '100', hint: 'Sign 1 then HUNDRED marker.' },
      { letter: '200', hint: 'Sign 2 then HUNDRED marker.' },
      { letter: '500', hint: 'Sign 5 then HUNDRED marker.' },
      { letter: '125', hint: 'Sign 1, HUNDRED, then 25.' },
      { letter: '308', hint: 'Sign 3, HUNDRED, then 8.' },
      { letter: '742', hint: 'Sign 7, HUNDRED, then 42.' },
    ],
  },
  // Greetings category - matches Lessons.tsx greetings lessons
  {
    id: 'greet-1',
    category: 'Greetings',
    categoryId: 'greetings',
    title: 'Basic Greetings',
    desc: 'Hello, Good Morning, Good Afternoon, Good Evening',
    color: '#F2A400',
    iconBg: '#FEF3C7',
    duration: '5 min',
    xp: 20,
    done: false,
    locked: true,
    requiredLessonId: 'num-3',
    signs: [
      { letter: 'Hello', hint: 'Open hand, fingers together, wave gently from the wrist.' },
      { letter: 'Good', hint: 'Flat hand moves from chin level upward.' },
      { letter: 'Morning', hint: 'Flat hand moves from chin level upward like the rising sun.' },
      { letter: 'Afternoon', hint: 'Flat hand moves from chin level slightly upward and outward.' },
      { letter: 'Evening', hint: 'Flat hand moves from chin level downward and outward.' },
    ],
  },
  {
    id: 'greet-2',
    category: 'Greetings',
    categoryId: 'greetings',
    title: 'Saying Goodbye',
    desc: 'Goodbye, See You Later, Take Care',
    color: '#F2A400',
    iconBg: '#FEF3C7',
    duration: '5 min',
    xp: 20,
    done: false,
    locked: true,
    requiredLessonId: 'greet-1',
    signs: [
      { letter: 'Goodbye', hint: 'Open hand raised, wave fingers down then back up.' },
      { letter: 'See You Later', hint: 'Point to eyes, then point forward with a sweeping motion.' },
      { letter: 'Take Care', hint: 'Open palm moves in a circular motion over the other palm.' },
    ],
  },
  {
    id: 'greet-3',
    category: 'Greetings',
    categoryId: 'greetings',
    title: 'Polite Phrases',
    desc: "Please, Thank You, You're Welcome",
    color: '#F2A400',
    iconBg: '#FEF3C7',
    duration: '5 min',
    xp: 20,
    done: false,
    locked: true,
    requiredLessonId: 'greet-2',
    signs: [
      { letter: 'Please', hint: 'Open palm rubs a small circle on the chest.' },
      { letter: 'Thank You', hint: 'Flat hand moves forward from the chin, like blowing a kiss.' },
      { letter: "You're Welcome", hint: 'Open hand sweeps inward toward the body with a nod.' },
    ],
  },
  // Introductions category - matches Lessons.tsx introductions lessons
  {
    id: 'intro-1',
    category: 'Introductions',
    categoryId: 'introductions',
    title: 'Introducing Yourself',
    desc: 'Name, My, Your, What',
    color: '#5EC8FA',
    iconBg: '#E0F2FE',
    duration: '6 min',
    xp: 25,
    done: false,
    locked: true,
    requiredLessonId: 'greet-3',
    signs: [
      { letter: 'Name', hint: 'Tap the index and middle fingers of one hand against the other.' },
      { letter: 'My', hint: 'Place flat palm on chest.' },
      { letter: 'Your', hint: 'Push flat palm forward.' },
      { letter: 'What', hint: 'Hold both hands up, palms facing up, and shake slightly.' },
    ],
  },
  {
    id: 'intro-2',
    category: 'Introductions',
    categoryId: 'introductions',
    title: 'Meeting People',
    desc: 'Nice, Meet, You, and the full phrase "Nice to Meet You"',
    color: '#5EC8FA',
    iconBg: '#E0F2FE',
    duration: '6 min',
    xp: 25,
    done: false,
    locked: true,
    requiredLessonId: 'intro-1',
    signs: [
      { letter: 'Nice', hint: 'Place flat palm over other palm, slide forward smoothly.' },
      { letter: 'Meet', hint: 'Bring index fingers together like two people meeting.' },
      { letter: 'You', hint: 'Point index finger toward the person you are speaking to.' },
      { letter: 'Nice to Meet You', hint: 'Combine Nice + Meet + You in sequence.' },
    ],
  },
  {
    id: 'intro-3',
    category: 'Introductions',
    categoryId: 'introductions',
    title: 'Asking Questions',
    desc: 'What, Who, Where, When, Why',
    color: '#5EC8FA',
    iconBg: '#E0F2FE',
    duration: '6 min',
    xp: 25,
    done: false,
    locked: true,
    requiredLessonId: 'intro-2',
    signs: [
      { letter: 'What', hint: 'Hold both hands up, palms facing up, and shake slightly.' },
      { letter: 'Who', hint: 'Circle the thumb around the mouth area.' },
      { letter: 'Where', hint: 'Move the index finger in a small circle while pointing.' },
      { letter: 'When', hint: 'Tap the index finger against the opposite palm.' },
      { letter: 'Why', hint: 'Touch the forehead with the index finger then move outward.' },
    ],
  },
  // Courtesy category - matches Lessons.tsx courtesy lessons
  {
    id: 'courtesy-1',
    category: 'Courtesy',
    categoryId: 'courtesy',
    title: 'Everyday Courtesy',
    desc: 'Yes, No, Please, Thank You',
    color: '#10B981',
    iconBg: '#D1FAE5',
    duration: '5 min',
    xp: 20,
    done: false,
    locked: true,
    requiredLessonId: 'intro-3',
    signs: [
      { letter: 'Yes', hint: 'Make an S fist and tilt it forward at the wrist twice.' },
      { letter: 'No', hint: 'Snap index and middle fingers down against the thumb quickly.' },
      { letter: 'Please', hint: 'Open palm rubs a small circle on the chest.' },
      { letter: 'Thank You', hint: 'Flat hand moves forward from the chin, like blowing a kiss.' },
    ],
  },
  {
    id: 'courtesy-2',
    category: 'Courtesy',
    categoryId: 'courtesy',
    title: 'Understanding Responses',
    desc: "Understand, Don't Know, Don't Understand",
    color: '#10B981',
    iconBg: '#D1FAE5',
    duration: '5 min',
    xp: 20,
    done: false,
    locked: true,
    requiredLessonId: 'courtesy-1',
    signs: [
      { letter: 'Understand', hint: 'Tap the forehead with the index finger then move outward.' },
      { letter: "Don't Know", hint: 'Wipe the forehead with the back of the hand.' },
      { letter: "Don't Understand", hint: 'Combines "Don\'t" and "Understand" in sequence.' },
    ],
  },
  {
    id: 'courtesy-3',
    category: 'Courtesy',
    categoryId: 'courtesy',
    title: 'Conversation Flow',
    desc: 'Combining greetings, introductions, and courtesy',
    color: '#10B981',
    iconBg: '#D1FAE5',
    duration: '5 min',
    xp: 20,
    done: false,
    locked: true,
    requiredLessonId: 'courtesy-2',
    signs: [
      { letter: 'Greeting', hint: 'Review and combine greeting signs.' },
      { letter: 'Introduction', hint: 'Review and combine introduction signs.' },
      { letter: 'Courtesy', hint: 'Review and combine courtesy signs.' },
    ],
  },
];

// ── Layout constants ──
const NODE_COUNT = BASE_LESSONS.length;
const LEFT_X = 22;
const RIGHT_X = 78;
const NODE_DY = 85;
const TOP_PAD = 60;
const BOTTOM_PAD = 70;

const VIEW_W = 380;
const VIEW_H = TOP_PAD + (NODE_COUNT - 1) * NODE_DY + BOTTOM_PAD;

// ── Node Positions ──
const NODE_POSITIONS = Array.from({ length: NODE_COUNT }, (_, i) => ({
  cx: i % 2 === 0 ? LEFT_X : RIGHT_X,
  cy: VIEW_H - BOTTOM_PAD - i * NODE_DY,
}));

// ── Road Path ──
function buildRoadPath(positions: { cx: number; cy: number }[]): string {
  const px = (cxPercent: number) => (cxPercent / 100) * VIEW_W;
  const pts = positions.map((p) => ({ x: px(p.cx), y: p.cy }));
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const h = p0.y - p1.y;
    const c1x = p0.x;
    const c1y = p0.y - h / 3;
    const c2x = p1.x;
    const c2y = p0.y - (2 * h) / 3;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

const ROAD_PATH = buildRoadPath(NODE_POSITIONS);

function cubicPoint(
  p0: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
  p1: { x: number; y: number },
  t: number
) {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * c1.x + 3 * mt * t ** 2 * c2.x + t ** 3 * p1.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * c1.y + 3 * mt * t ** 2 * c2.y + t ** 3 * p1.y,
  };
}

function buildNodePathLengths(positions: { cx: number; cy: number }[]): number[] {
  const px = (cxPercent: number) => (cxPercent / 100) * VIEW_W;
  const pts = positions.map((p) => ({ x: px(p.cx), y: p.cy }));
  const SAMPLES = 200;
  const lengths = [0];
  let cumulative = 0;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const h = p0.y - p1.y;
    const c1 = { x: p0.x, y: p0.y - h / 3 };
    const c2 = { x: p1.x, y: p0.y - (2 * h) / 3 };

    let prev = cubicPoint(p0, c1, c2, p1, 0);
    let segLen = 0;
    for (let s = 1; s <= SAMPLES; s++) {
      const t = s / SAMPLES;
      const pt = cubicPoint(p0, c1, c2, p1, t);
      segLen += Math.hypot(pt.x - prev.x, pt.y - prev.y);
      prev = pt;
    }
    cumulative += segLen;
    lengths.push(cumulative);
  }
  return lengths;
}

const NODE_PATH_LENGTHS = buildNodePathLengths(NODE_POSITIONS);
const TOTAL_PATH_LENGTH = NODE_PATH_LENGTHS[NODE_PATH_LENGTHS.length - 1];

// ── Category Icon Component ──
function CategoryIcon({ category, size = 22, color = '#fff' }: { category: string; size?: number; color?: string }) {
  switch (category) {
    case 'Alphabet':
      return <AlphabetIcon size={size} color={color} />;
    case 'Numbers':
      return <NumbersIcon size={size} color={color} />;
    case 'Greetings':
      return <GreetingIcon size={size} color={color} />;
    case 'Introductions':
      return <Ionicons name="person-outline" size={size} color={color} />;
    case 'Courtesy':
      return <Ionicons name="heart-outline" size={size} color={color} />;
    case 'Conversation':
      return <ConversationIcon size={size} color={color} />;
    default:
      return null;
  }
}

// ── SplitRoad Component ──
function SplitRoad({ activeIdx }: { activeIdx: number }) {
  const progressLength =
    activeIdx === -1 ? TOTAL_PATH_LENGTH : NODE_PATH_LENGTHS[activeIdx];

  const gap = TOTAL_PATH_LENGTH;

  return (
    <G>
      <Path
        d={ROAD_PATH}
        stroke="rgba(15,49,114,0.12)"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={ROAD_PATH}
        stroke="#c5d9e8"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={ROAD_PATH}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="12,9"
      />

      {progressLength > 0 && (
        <>
          <Path
            d={ROAD_PATH}
            stroke="#1E3FAE"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${progressLength} ${gap}`}
          />
          <Path
            d={ROAD_PATH}
            stroke="#2563EB"
            strokeWidth="24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${progressLength} ${gap}`}
          />
          <Path
            d={ROAD_PATH}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`3 ${gap}`}
            strokeDashoffset={-(progressLength - 3)}
          />
        </>
      )}
    </G>
  );
}

// ── Loading Screen Component ──
function LoadingScreen() {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse ring behind the logo
    Animated.loop(
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 1.3, duration: 1200, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Gentle continuous float for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -8,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Loading dots, staggered bounce
    const bounceDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -7,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
          Animated.delay(300),
        ])
      );

    Animated.parallel([
      bounceDot(dot1, 0),
      bounceDot(dot2, 120),
      bounceDot(dot3, 240),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();

    // Logo + tagline entrance
    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(150),
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={['#091186', '#2311c4', '#4A2C8A', '#9cc2e7']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <View style={[styles.decCircle, styles.decCircle1]} />
      <View style={[styles.decCircle, styles.decCircle2]} />
      <View style={[styles.decCircle, styles.decCircle3]} />
      <View style={[styles.decCircle, styles.decCircle4]} />

      <Animated.View
        style={[
          styles.pulseRing,
          { transform: [{ scale: ringScale }], opacity: ringOpacity },
        ]}
      />

      <Animated.View
        style={[
          styles.logoWrap,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      >
        <View style={styles.mascotCircle}>
          <Animated.Image
            source={senya_logo}
            style={[styles.logoImage, { transform: [{ translateY: logoFloat }] }]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.appName}>SEÑAS</Text>
          <Text style={styles.appSubtitle}>Your FSL Journey</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.tagWrap, { opacity: tagOpacity }]}>
        <Text style={styles.tagline}>Loading Your Roadmap</Text>
        <View style={styles.tagDivider} />
        <Text style={styles.tagSub}>Preparing your learning path...</Text>
      </Animated.View>

      <View style={styles.progressWrapper}>
        <View style={styles.progressBarWrap}>
          <Animated.View style={{ width: progressWidth, height: '100%' }}>
            <LinearGradient
              colors={['#FFD93D', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarFill}
            />
          </Animated.View>
        </View>

        <View style={styles.dotsRow}>
          <Text style={styles.loadingLabel}>Loading</Text>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
      </View>
    </View>
  );
}

// ── Main Component ──
export default function ExploreTab() {
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState<number>(1);
  const [lessons, setLessons] = useState<Lesson[]>(BASE_LESSONS);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, arrowLeft: 100, arrowDir: 'top' });
  const wrapRef = useRef<View>(null);

  // Load user ID from storage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserId(user.id || 1);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // ── Load progress from the database ──
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);

      const result = await apiRequest('getLessonProgress', 'GET', { user_id: userId });
      const progressData = result.progress || [];

      const doneMap: Record<string, boolean> = {};
      progressData.forEach((p: any) => {
        doneMap[p.lesson_id] = p.status === 'done';
      });

      const withDone = BASE_LESSONS.map((lesson) => ({
        ...lesson,
        done: !!doneMap[lesson.id],
        active: false,
        locked: false,
      }));

      let foundActive = false;
      const processedLessons = withDone.map((lesson) => {
        if (lesson.done) {
          return { ...lesson, active: false, locked: false };
        }

        const prereqDone =
          !lesson.requiredLessonId ||
          withDone.find((l) => l.id === lesson.requiredLessonId)?.done;

        if (!prereqDone) {
          return { ...lesson, active: false, locked: true };
        }

        if (!foundActive) {
          foundActive = true;
          return { ...lesson, active: true, locked: false };
        }

        return { ...lesson, active: false, locked: true };
      });

      setLessons(processedLessons);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load progress on mount and when screen comes into focus
  useEffect(() => {
    if (userId) {
      loadProgress();
    }
  }, [userId, loadProgress]);

  // Reload progress when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadProgress();
      }
    }, [userId, loadProgress])
  );

  const totalDone = lessons.filter(l => l.done).length;
  const totalLessons = lessons.length;
  const pct = Math.round((totalDone / totalLessons) * 100);
  
  const activeIdx = lessons.findIndex(l => l.active && !l.done);
  let effectiveActiveIdx = activeIdx;
  if (activeIdx === -1) {
    effectiveActiveIdx = lessons.findIndex(l => !l.done);
  }

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0.2] });

  // Recompute popup position
  useEffect(() => {
    if (expandedId === null) return;
    const idx = lessons.findIndex(l => l.id === expandedId);
    const pos = NODE_POSITIONS[idx];
    if (!pos) return;

    const scale = SCREEN_W / VIEW_W;
    const nodeX = (pos.cx / 100) * VIEW_W * scale;
    const nodeY = pos.cy;

    const CARD_WIDTH = 220;
    const CARD_HEIGHT_EST = 150;
    const MARGIN = 12;

    let left = nodeX - CARD_WIDTH / 2;
    left = Math.max(MARGIN, Math.min(left, SCREEN_W - CARD_WIDTH - MARGIN));

    const showBelow = nodeY < CARD_HEIGHT_EST + 40;
    const top = showBelow ? nodeY + 40 : nodeY - CARD_HEIGHT_EST - 40;
    const arrowLeft = nodeX - left;

    setPopupPos({ top, left, arrowLeft, arrowDir: showBelow ? 'top' : 'bottom' });
  }, [expandedId]);

  // ── Handle Start Lesson ──
  const handleStartLesson = (lesson: Lesson) => {
    if (lesson.locked) {
      const required = lessons.find(l => l.id === lesson.requiredLessonId);
      Alert.alert(
        'Lesson Locked',
        required 
          ? `Complete "${required.title}" first to unlock this lesson!`
          : 'Complete the previous lesson first to unlock this one!'
      );
      return;
    }
    router.push({
      pathname: '../screens/Lessons',
      params: {
        lessonId: lesson.id,
        category: lesson.categoryId,
        title: lesson.title,
      },
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFE0F7" />

      <LinearGradient
        colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
        <View style={[styles.blob, styles.blob4]} />
        <View style={[styles.blob, styles.blob5]} />
      </View>

      <View style={styles.header}>
        <View style={styles.topBar}>
          <View style={styles.logoContainer}>
            <Text style={styles.brandText}>SEÑAS</Text>
            <SparkleIcon size={16} color="#F59E0B" />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <InfoIcon size={17} color="#1E3A8A" />
            </TouchableOpacity>
            <View style={styles.streakPill}>
              <Image source={streakIcon} style={styles.streakPillIcon} resizeMode="contain" />
              <Text style={styles.streakText}>12</Text>
            </View>
            <TouchableOpacity style={styles.iconCircle}>
              <BellIcon size={17} color="#1E3A8A" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        <GlassCard style={styles.unitBanner} intensity={45}>
          <LinearGradient
            colors={['rgba(37, 99, 235, 0.04)', 'rgba(245, 158, 11, 0.03)']}
            style={styles.bannerGradient}
          />
          <View style={styles.bannerTopRow}>
            <View>
              <Text style={styles.unitTitle}>Unit 1: Basics</Text>
              <Text style={styles.unitSub}>Master the alphabet and essential greetings</Text>
            </View>
            <View style={styles.unitBadge}>
              <Text style={styles.unitBadgeText}>{pct}%</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#FFD93D', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${pct}%` }]}
            />
          </View>
          <View style={styles.unitFooter}>
            <Text style={styles.unitFooterText}>{totalDone} of {totalLessons} lessons done</Text>
            <Text style={styles.unitFooterText}>• {pct}% complete</Text>
          </View>
        </GlassCard>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View ref={wrapRef} style={styles.svgWrapper}>
          <Svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" height={VIEW_H}>
            <Defs>
              <Filter id="nshadow" x="-40%" y="-40%" width="180%" height="180%">
                <FeDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(15,49,114,0.20)" />
              </Filter>
              <Filter id="nodeshadow" x="-40%" y="-40%" width="180%" height="180%">
                <FeDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(15,49,114,0.25)" />
              </Filter>
              <Filter id="lockedshadow" x="-40%" y="-40%" width="180%" height="180%">
                <FeDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.10)" />
              </Filter>
            </Defs>

            <SplitRoad activeIdx={effectiveActiveIdx} />

            {lessons.map((lesson, idx) => {
              const pos = NODE_POSITIONS[idx];
              if (!pos) return null;
              const cx = (pos.cx / 100) * VIEW_W;
              const cy = pos.cy;
              const isActive = !!lesson.active && !lesson.locked && !lesson.done;
              const isSpecial = !!(lesson.isExam);
              const isDone = lesson.done;
              const isLocked = lesson.locked || false;
              const isSelected = expandedId === lesson.id;

              const scaleValue = pulseScale as any;
              const opacityValue = pulseOpacity as any;

              return (
                <G
                  key={lesson.id}
                  onPress={() => {
                    setExpandedId(expandedId === lesson.id ? null : lesson.id);
                  }}
                >
                  {isActive && (
                    <Circle
                      cx={cx}
                      cy={cy}
                      r={44}
                      fill="rgba(37, 99, 235, 0.12)"
                      scale={scaleValue}
                      opacity={opacityValue}
                    />
                  )}
                  
                  {isSelected && !isActive && (
                    <Circle cx={cx} cy={cy} r={isSpecial ? 38 : 36} fill="rgba(37, 99, 235, 0.08)" />
                  )}

                  {isLocked && (
                    <Circle
                      cx={cx}
                      cy={cy}
                      r={34}
                      fill="rgba(200,210,220,0.3)"
                      filter="url(#lockedshadow)"
                    />
                  )}

                  {isSpecial ? (
                    <>
                      <Rect
                        x={cx - 30}
                        y={cy - 30}
                        width={60}
                        height={60}
                        rx={15}
                        fill={isDone ? '#1E3FAE' : isLocked ? 'rgba(200,210,220,0.6)' : 'rgba(200,220,245,0.85)'}
                        filter="url(#nodeshadow)"
                      />
                      {isDone && <Rect x={cx - 24} y={cy - 24} width={48} height={48} rx={11} fill="#2563EB" />}
                    </>
                  ) : isDone ? (
                    <>
                      <Circle cx={cx} cy={cy} r={32} fill="#1E3FAE" filter="url(#nodeshadow)" />
                      <Circle cx={cx} cy={cy} r={26} fill="#2563EB" />
                    </>
                  ) : isActive ? (
                    <>
                      <Circle cx={cx} cy={cy} r={34} fill="#1E3FAE" filter="url(#nodeshadow)" />
                      <Circle cx={cx} cy={cy} r={28} fill="#2563EB" />
                    </>
                  ) : isLocked ? (
                    <Circle cx={cx} cy={cy} r={28} fill="rgba(200,210,220,0.7)" filter="url(#lockedshadow)" />
                  ) : (
                    <Circle cx={cx} cy={cy} r={28} fill="rgba(200,220,245,0.85)" filter="url(#nodeshadow)" />
                  )}

                  {isDone ? (
                    <Polyline
                      points={`${cx - 10},${cy} ${cx - 2},${cy + 9} ${cx + 11},${cy - 9}`}
                      stroke="#fff"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : isActive ? (
                    <>
                      <Circle cx={cx} cy={cy} r={14} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                      <Polygon points={`${cx - 6},${cy - 10} ${cx + 12},${cy} ${cx - 6},${cy + 10}`} fill="#93c5fd" />
                    </>
                  ) : isLocked ? (
                    <>
                      <Rect
                        x={cx - 8}
                        y={cy - 2}
                        width={16}
                        height={12}
                        rx={3}
                        fill="none"
                        stroke="#9aaabc"
                        strokeWidth="2"
                      />
                      <Path
                        d={`M ${cx - 5} ${cy - 2} C ${cx - 5} ${cy - 8}, ${cx + 5} ${cy - 8}, ${cx + 5} ${cy - 2}`}
                        fill="none"
                        stroke="#9aaabc"
                        strokeWidth="2"
                      />
                      <Circle cx={cx} cy={cy + 4} r={2} fill="#9aaabc" />
                      <SvgImage
                        href={lockedIcon}
                        x={cx - 12}
                        y={cy - 12}
                        width={24}
                        height={24}
                        preserveAspectRatio="xMidYMid meet"
                      />
                    </>
                  ) : (
                    <>
                      <Rect
                        x={cx - 8}
                        y={cy - 2}
                        width={16}
                        height={12}
                        rx={3}
                        fill="none"
                        stroke="#8aaad6"
                        strokeWidth="2"
                      />
                      <Path
                        d={`M ${cx - 5} ${cy - 2} C ${cx - 5} ${cy - 8}, ${cx + 5} ${cy - 8}, ${cx + 5} ${cy - 2}`}
                        fill="none"
                        stroke="#8aaad6"
                        strokeWidth="2"
                      />
                      <Circle cx={cx} cy={cy + 4} r={2} fill="#8aaad6" />
                    </>
                  )}

                  {isActive && (
                    <>
                      <Rect x={cx - 33} y={cy - 54} width={66} height={19} rx={9.5} fill="#F59E0B" />
                      <SvgText
                        x={cx}
                        y={cy - 40}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontWeight="800"
                        fill="#78350F"
                        letterSpacing={0.6}
                      >
                        NEXT UP
                      </SvgText>
                    </>
                  )}

                  {isLocked ? (
                    <SvgText
                      x={cx}
                      y={isSpecial ? cy + 46 : cy + 44}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontWeight="700"
                      letterSpacing={0.4}
                      fill="#9aaabc"
                    >
                      {lesson.title.toUpperCase()}
                    </SvgText>
                  ) : isActive ? (
                    <>
                      <Rect x={cx - 44} y={cy + 36} width={88} height={19} rx={9.5} fill="#1E3FAE" />
                      <SvgText
                        x={cx}
                        y={cy + 49}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontWeight="800"
                        fill="#fff"
                        letterSpacing={0.5}
                      >
                        {lesson.title.toUpperCase()}
                      </SvgText>
                    </>
                  ) : (
                    <SvgText
                      x={cx}
                      y={isSpecial ? cy + 46 : cy + 44}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight="700"
                      letterSpacing={0.4}
                      fill={isDone ? '#1E3FAE' : '#5b82b8'}
                    >
                      {lesson.title.toUpperCase()}
                    </SvgText>
                  )}
                </G>
              );
            })}

            {effectiveActiveIdx !== -1 &&
              (() => {
                const pos = NODE_POSITIONS[effectiveActiveIdx];
                const cx = (pos.cx / 100) * VIEW_W;
                const onRight = pos.cx > 50;
                return (
                  <G>
                    <Circle
                      cx={onRight ? cx + 90 : cx - 90}
                      cy={pos.cy}
                      r={40}
                      fill="rgba(255, 217, 61, 0.15)"
                    />
                    <SvgImage
                      href={senya_logo}
                      x={onRight ? cx + 42 : cx - 94}
                      y={pos.cy - 50}
                      width={100}
                      height={100}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </G>
                );
              })()}
          </Svg>

          {expandedId !== null &&
            (() => {
              const lesson = lessons.find(l => l.id === expandedId);
              if (!lesson) return null;
              const canOpen = lesson.done || (lesson.active && !lesson.locked);
              const isLocked = lesson.locked || false;
              const { top, left } = popupPos;

              return (
                <Animated.View
                  style={[
                    styles.popupCard,
                    {
                      top: top,
                      left: left,
                      opacity: isLocked ? 0.8 : 1,
                    },
                  ]}
                >
                  <TouchableOpacity style={styles.popupClose} onPress={() => setExpandedId(null)}>
                    <Ionicons name="close" size={14} color="#9CA3AF" />
                  </TouchableOpacity>

                  <View style={styles.popupHeader}>
                    <View
                      style={[
                        styles.popupIcon,
                        {
                          backgroundColor: isLocked ? '#F3F4F6' : lesson.iconBg,
                          borderColor: isLocked ? 'rgba(0,0,0,0.05)' : 'rgba(37,99,235,0.10)',
                        },
                      ]}
                    >
                      <CategoryIcon category={lesson.category} size={22} color={isLocked ? '#9CA3AF' : lesson.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.popupTitle, isLocked && { color: '#9CA3AF' }]}>
                        {lesson.title}
                        {isLocked && ' 🔒'}
                      </Text>
                      <Text style={[styles.popupCategory, { color: isLocked ? '#9CA3AF' : lesson.color }]}>
                        {lesson.category}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.popupDesc, isLocked && { color: '#9CA3AF' }]}>
                    {isLocked 
                      ? `Complete "${lessons.find(l => l.id === lesson.requiredLessonId)?.title || 'the previous lesson'}" to unlock this lesson!`
                      : lesson.desc}
                  </Text>

                  <View style={styles.popupFooter}>
                    <View style={styles.popupChips}>
                      <View style={styles.popupChip}>
                        <Ionicons name="time-outline" size={10} color={isLocked ? '#9CA3AF' : '#6B7280'} />
                        <Text style={[styles.popupChipText, isLocked && { color: '#9CA3AF' }]}>
                          {lesson.duration}
                        </Text>
                      </View>
                      <View style={[styles.popupChip, styles.popupXpChip]}>
                        <Text style={[styles.popupXpText, isLocked && { color: '#9CA3AF' }]}>
                          +{lesson.xp} XP
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.popupButton, !canOpen && styles.popupButtonLocked]}
                      disabled={!canOpen}
                      onPress={() => canOpen && handleStartLesson(lesson)}
                    >
                      <Text style={[styles.popupButtonText, !canOpen && styles.popupButtonTextLocked]}>
                        {lesson.done ? 'Review' : canOpen ? 'Start' : 'Locked'}
                      </Text>
                      {canOpen ? (
                        <Ionicons name="arrow-forward" size={12} color="#fff" />
                      ) : (
                        <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })()}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFE0F7',
  },
  
  // ── Loading Screen Styles ──
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#091186',
  },
  decCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decCircle1: { width: 320, height: 320, top: -80, left: -100 },
  decCircle2: { width: 220, height: 220, bottom: 60, right: -60 },
  decCircle3: { width: 140, height: 140, top: '40%', left: -50 },
  decCircle4: { width: 180, height: 180, bottom: '30%', right: -80 },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  logoWrap: { alignItems: 'center', gap: 12 },
  mascotCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  nameRow: {
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD93D',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tagWrap: {
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 9999,
  },
  tagSub: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD93D',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  progressWrapper: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  progressBarWrap: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  loadingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    marginRight: 4,
    letterSpacing: 0.5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  // ── Decorative blobs ──
  blobContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blob1: {
    width: 350,
    height: 350,
    top: -120,
    right: -120,
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
  },
  blob2: {
    width: 250,
    height: 250,
    bottom: 80,
    left: -100,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  blob3: {
    width: 180,
    height: 180,
    top: '40%',
    right: -60,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },
  blob4: {
    width: 200,
    height: 200,
    bottom: 300,
    left: -80,
    backgroundColor: 'rgba(236, 72, 153, 0.03)',
  },
  blob5: {
    width: 150,
    height: 150,
    top: '60%',
    right: -40,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },

  // ── Glass primitive ──
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
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      Platform.OS === 'android' ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
  },

  header: {
    flexShrink: 0,
    zIndex: 20,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: '#1E3A8A',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  streakPillIcon: {
    width: 15,
    height: 15,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  
  // ── Unit Banner ──
  unitBanner: {
    marginBottom: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  unitTitle: {
    color: '#1E3A8A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  unitSub: {
    color: '#4B7BBB',
    fontSize: 12,
  },
  unitBadge: {
    backgroundColor: '#1E3FAE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  unitBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  progressTrack: {
    backgroundColor: 'rgba(15,49,114,0.10)',
    borderRadius: 10,
    height: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  unitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitFooterText: {
    color: '#4B7BBB',
    fontSize: 11,
    fontWeight: '600',
  },
  
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 72,
  },
  svgWrapper: {
    position: 'relative',
    width: '100%',
  },
  
  // ── Popup Card ──
  popupCard: {
    position: 'absolute',
    width: 220,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    shadowColor: 'rgba(15,49,114,0.22)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
    zIndex: 30,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backdropFilter: Platform.OS === 'ios' ? 'blur(20px)' : undefined,
  },
  popupClose: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 5,
    padding: 2,
  },
  popupHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  popupIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    flexShrink: 0,
  },
  popupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f1f4a',
    lineHeight: 17,
  },
  popupCategory: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  popupDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16.5,
    marginBottom: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  popupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  popupChips: {
    flexDirection: 'row',
    gap: 5,
  },
  popupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  popupChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  popupXpChip: {
    backgroundColor: '#EEF2FF',
  },
  popupXpText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4338CA',
  },
  popupButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popupButtonLocked: {
    backgroundColor: '#E5E7EB',
  },
  popupButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  popupButtonTextLocked: {
    color: '#9CA3AF',
  },
});