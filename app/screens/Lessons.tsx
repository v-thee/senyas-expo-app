import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── API Configuration ──
const API_URL = Platform.OS === 'android' 
  ? 'http://192.168.24.206/api/api.php' // Android emulator
  : 'http://192.168.24.206/api/api.php'; // iOS or web

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

// ── Images ──
const images: Record<string, any> = {
  senyaBlue: require('@/assets/images/senya_blue.png'),
  senyaMagnify: require('@/assets/images/senya_magnify.png'),
  senyaTeaching: require('@/assets/images/senya_teaching.png'),
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
  // Number images
  1: require('@/assets/images/numbers/1.jpg'),
  2: require('@/assets/images/numbers/2.jpg'),
  3: require('@/assets/images/numbers/3.jpg'),
  4: require('@/assets/images/numbers/4.jpg'),
  5: require('@/assets/images/numbers/5.jpg'),
  6: require('@/assets/images/numbers/6.jpg'),
  7: require('@/assets/images/numbers/7.jpg'),
  8: require('@/assets/images/numbers/8.jpg'),
  9: require('@/assets/images/numbers/9.jpg'),
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
  numberColor: '#6B7280',
};

const SPARKLE_COLORS = [C.gold, C.sky, C.success, C.streak];

// ── Lesson card grid geometry ──
const GRID_H_PADDING = 20;
const GRID_GAP = 14;
const GRID_CONTENT_WIDTH = SCREEN_WIDTH - GRID_H_PADDING * 2;
const LESSON_CARD_WIDTH = (GRID_CONTENT_WIDTH - GRID_GAP) / 2;

/* ---------- Custom Icon Components ---------- */
const AlphabetIcon = ({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M9 18V6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NumbersIcon = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth={2} />
    <SvgText
      fontSize={14}
      fontWeight="bold"
      fill={color}
      textAnchor="middle"
      x={12}
      y={17}
    >
      123
    </SvgText>
  </Svg>
);

const GreetingIcon = ({ size = 24, color = '#F2A400' }: { size?: number; color?: string }) => (
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

const UserIcon = ({ size = 24, color = '#5EC8FA' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const HeartIcon = ({ size = 24, color = '#10B981' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color + '22'}
    />
  </Svg>
);

const Sparkle = ({ size = 16, color = '#F59E0B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.6" />
    <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.4" />
    <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.4" />
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

const CheckCircle = ({ size = 24, color = '#10B981' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill={color + '18'} />
    <Path d="M7 12l3 3 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Lock = ({ size = 24, color = '#6B7492' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ArrowLeft = ({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RotateCw = ({ size = 20, color = '#2647B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ThumbsUp = ({ size = 20, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 22V11m0 11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3m3 0h7.31a2 2 0 0 1 1.98 2.3l-1.1 7A2 2 0 0 1 16.2 22H10a2 2 0 0 1-2-2v-9z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* ---------- Types ---------- */
type Mastery = 'unseen' | 'got-it' | 'needs-practice';

export interface SignCard {
  id: string;
  label: string;
  cue: string;
  imageKey?: string;
}

export interface LessonItem {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'done';
  intro: string;
  cards: SignCard[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  iconComponent: React.ReactNode;
  color: string;
  bgColor: string;
  lessons: LessonItem[];
  requiredCategoryId?: string;
}

/* ---------- FSL Lesson Data ---------- */
const makeCards = (labels: string[], hint: (l: string) => string): SignCard[] =>
  labels.map((label, i) => ({
    id: `${label}-${i}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
    label,
    cue: hint(label),
    imageKey: label.toLowerCase(),
  }));

// Base lesson data (without statuses - will be merged with API data)
const BASE_CATEGORIES: Omit<Category, 'lessons'>[] = [
  {
    id: 'alphabet',
    label: 'Alphabet',
    icon: 'alphabet',
    iconComponent: <AlphabetIcon size={24} color={C.royal} />,
    color: C.royal,
    bgColor: C.royal + '22',
  },
  {
    id: 'numbers',
    label: 'Numbers',
    icon: 'numbers',
    iconComponent: <NumbersIcon size={24} color={C.numberColor} />,
    color: C.numberColor,
    bgColor: C.numberColor + '22',
    requiredCategoryId: 'alphabet',
  },
  {
    id: 'greetings',
    label: 'Greetings',
    icon: 'greeting',
    iconComponent: <GreetingIcon size={24} color={C.goldDeep} />,
    color: C.goldDeep,
    bgColor: C.goldDeep + '22',
    requiredCategoryId: 'numbers',
  },
  {
    id: 'introductions',
    label: 'Introductions',
    icon: 'user',
    iconComponent: <UserIcon size={24} color={C.sky} />,
    color: C.sky,
    bgColor: C.sky + '22',
    requiredCategoryId: 'greetings',
  },
  {
    id: 'courtesy',
    label: 'Courtesy',
    icon: 'heart',
    iconComponent: <HeartIcon size={24} color={C.success} />,
    color: C.success,
    bgColor: C.success + '22',
    requiredCategoryId: 'introductions',
  },
];

// Default lessons for each category (default statuses, will be overridden by API)
const DEFAULT_LESSONS: Record<string, LessonItem[]> = {
  alphabet: [
    {
      id: 'a',
      title: 'Letters A-G',
      description: 'The first 7 letters of the FSL manual alphabet',
      status: 'done',
      intro: 'Fingerspelling is used for names, places, and words without a dedicated sign. Go letter by letter — check the picture, hold the handshape, then try it from memory.',
      cards: makeCards(['A', 'B', 'C', 'D', 'E', 'F', 'G'], (l) =>
        `Match your hand to the picture for "${l}". Hold it steady for a second before moving to the next letter.`
      ),
    },
    {
      id: 'b',
      title: 'Letters H-N',
      description: 'Letters H through N',
      status: 'done',
      intro: 'Keep your hand at shoulder height and steady — most mix-ups between letters come from rushing, not the handshape itself.',
      cards: makeCards(['H', 'I', 'J', 'K', 'L', 'M', 'N'], (l) =>
        `Compare your handshape for "${l}" against the picture. Notice which fingers are out and which are tucked in.`
      ),
    },
    {
      id: 'c',
      title: 'Letters O-Z',
      description: 'The remaining letters, O through Z',
      status: 'active',
      intro: 'The last stretch of the alphabet! A few of these letters use a small movement instead of one still shape — watch closely for that.',
      cards: makeCards(
        ['O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        (l) => `Study the picture for "${l}" and practice holding it cleanly before speeding up.`
      ),
    },
  ],
  numbers: [
    {
      id: 'num-1',
      title: 'Single Digits 0-9',
      description: 'Learn to sign numbers 0 through 9 in FSL',
      status: 'locked',
      intro: 'Single-digit numbers in FSL are executed using one hand with the palm facing inward or outward depending on context.',
      cards: makeCards(
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        (l) => `Form the ${l} handshape as shown in the picture. Practice holding it steady.`
      ),
    },
    {
      id: 'num-2',
      title: 'Two-Digit Numbers 10-99',
      description: 'Learn to sign numbers 10 through 99',
      status: 'locked',
      intro: 'Two-digit numbers are divided into two main categories: base multiples of 10 and compound numbers.',
      cards: makeCards(
        ['10', '20', '30', '40', '50', '60', '70', '80', '90', '25', '47', '82'],
        (l) => `Practice signing ${l} with the correct movement pattern.`
      ),
    },
    {
      id: 'num-3',
      title: 'Three-Digit Numbers 100-999',
      description: 'Learn to sign numbers 100 through 999',
      status: 'locked',
      intro: 'Three-digit numbers introduce the concept sign for "HUNDRED". Numbers are built sequentially.',
      cards: makeCards(
        ['100', '200', '500', '125', '308', '742'],
        (l) => `Sign ${l} using the HUNDRED marker after the first digit.`
      ),
    },
  ],
  greetings: [
    {
      id: 'greet-1',
      title: 'Basic Greetings',
      description: 'Hello, Good Morning, Good Afternoon, Good Evening',
      status: 'locked',
      intro: 'Greeting signs come with a warm, friendly face — that\'s part of the sign, not just decoration!',
      cards: makeCards(['Hello', 'Good', 'Morning', 'Afternoon', 'Evening'], (l) =>
        `Watch the picture for "${l}" closely, then copy the motion at a natural, relaxed pace.`
      ),
    },
    {
      id: 'greet-2',
      title: 'Saying Goodbye',
      description: 'Goodbye, See You Later, Take Care',
      status: 'locked',
      intro: 'Goodbye signs often reuse handshapes from greetings but move in a different direction — watch where the sign travels.',
      cards: makeCards(['Goodbye', 'See You Later', 'Take Care'], (l) =>
        `Break "${l}" into its motion path using the picture, then repeat it smoothly three times.`
      ),
    },
    {
      id: 'greet-3',
      title: 'Polite Phrases',
      description: "Please, Thank You, You're Welcome",
      status: 'locked',
      intro: 'These three come up in almost every conversation — worth practicing until they feel automatic.',
      cards: makeCards(['Please', 'Thank You', "You're Welcome"], (l) =>
        `Practice "${l}" alongside its picture and pair it with a friendly nod, like you would in real life.`
      ),
    },
  ],
  introductions: [
    {
      id: 'intro-1',
      title: 'Introducing Yourself',
      description: 'Name, My, Your, What',
      status: 'locked',
      intro: 'You\'ll usually fingerspell your name after signing "name" — so this lesson connects right back to the alphabet.',
      cards: makeCards(['Name', 'My', 'Your', 'What'], (l) =>
        `Practice "${l}" using the picture, then try combining it with your fingerspelled name.`
      ),
    },
    {
      id: 'intro-2',
      title: 'Meeting People',
      description: 'Nice, Meet, You, and the full phrase "Nice to Meet You"',
      status: 'locked',
      intro: 'Once you know the single signs, chain them together at a normal talking pace instead of pausing between each one.',
      cards: makeCards(['Nice', 'Meet', 'You', 'Nice to Meet You'], (l) =>
        `Learn "${l}" from the picture, then practice it as part of the full phrase.`
      ),
    },
    {
      id: 'intro-3',
      title: 'Asking Questions',
      description: 'What, Who, Where, When, Why',
      status: 'locked',
      intro: 'Question signs come with a special eyebrow face in FSL — look for that in the picture, not just the hands.',
      cards: makeCards(['What', 'Who', 'Where', 'When', 'Why'], (l) =>
        `Practice "${l}" and notice the face shown in the picture — it changes the meaning.`
      ),
    },
  ],
  courtesy: [
    {
      id: 'courtesy-1',
      title: 'Everyday Courtesy',
      description: 'Yes, No, Please, Thank You',
      status: 'locked',
      intro: 'These four signs cover a huge share of everyday talking — a great place to build real speed and confidence.',
      cards: makeCards(['Yes', 'No', 'Please', 'Thank You'], (l) =>
        `Drill "${l}" against the picture until you can do it without stopping to think.`
      ),
    },
    {
      id: 'courtesy-2',
      title: 'Understanding Responses',
      description: "Understand, Don't Know, Don't Understand",
      status: 'locked',
      intro: 'These signs let you answer honestly in a conversation instead of guessing — super useful for real chats.',
      cards: makeCards(['Understand', "Don't Know", "Don't Understand"], (l) =>
        `Practice "${l}" from the picture, paying attention to the direction the sign moves.`
      ),
    },
    {
      id: 'courtesy-3',
      title: 'Conversation Flow',
      description: 'Combining greetings, introductions, and courtesy',
      status: 'locked',
      intro: 'This lesson is a review — chain together signs from earlier lessons into short, natural exchanges.',
      cards: makeCards(['Greeting', 'Introduction', 'Courtesy'], (l) =>
        `Review the signs you've learned under "${l}" and practice using them together in a short exchange.`
      ),
    },
  ],
};

/* ---------- Glass Card Component ---------- */
function GlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.glassWrap, style]}>
      <View style={styles.glassTint} />
      {children}
    </View>
  );
}

/* ---------- A big, bouncy, kid-friendly pressable ---------- */
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

/* ---------- A few gentle sparkles that pop in with a stagger ---------- */
function CelebrationSparkles() {
  const anims = useRef(SPARKLE_COLORS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = anims.map((v, i) =>
      Animated.sequence([
        Animated.delay(i * 120),
        Animated.spring(v, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 12 }),
      ])
    );
    Animated.stagger(0, animations).start();
  }, []);

  const positions = [
    { top: -6, left: 12 },
    { top: 4, right: 10 },
    { top: 40, left: -8 },
    { bottom: 0, right: -6 },
  ];

  return (
    <View pointerEvents="none" style={styles.sparkleLayer}>
      {SPARKLE_COLORS.map((color, i) => (
        <Animated.View
          key={color}
          style={[
            styles.sparkleItem,
            positions[i % positions.length],
            {
              opacity: anims[i],
              transform: [
                { scale: anims[i] },
                {
                  rotate: anims[i].interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] }),
                },
              ],
            },
          ]}
        >
          <Sparkle size={22} color={color} />
        </Animated.View>
      ))}
    </View>
  );
}

/* ---------- Helper function to check if category is unlocked ---------- */
function isCategoryUnlocked(category: Category, allCategories: Category[]): boolean {
  if (!category.requiredCategoryId) return true;
  const requiredCategory = allCategories.find(c => c.id === category.requiredCategoryId);
  if (!requiredCategory) return true;
  return requiredCategory.lessons.every(lesson => lesson.status === 'done');
}

/* ---------- Main Component ---------- */
export default function Lessons() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ lessonId?: string; category?: string; title?: string }>();
  const [userId, setUserId] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState('alphabet');
  const [selected, setSelected] = useState<{ categoryId: string; lessonId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mastery, setMastery] = useState<Record<string, Mastery>>({});
  const [finished, setFinished] = useState(false);

  const [lockedTip, setLockedTip] = useState<string | null>(null);
  const lockedTipOpacity = useRef(new Animated.Value(0)).current;
  const lockedTipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardPop = useRef(new Animated.Value(0)).current;
  const cueFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // Load progress from API
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiRequest('getLessonProgress', 'GET', { user_id: userId });
      const progressData = result.progress || [];

      const categoriesWithProgress: Category[] = BASE_CATEGORIES.map((baseCat) => {
        const defaultLessons = DEFAULT_LESSONS[baseCat.id] || [];
        
        const lessonsWithProgress = defaultLessons.map((lesson) => {
          const progress = progressData.find(
            (p: any) => p.category_id === baseCat.id && p.lesson_id === lesson.id
          );
          
          if (progress) {
            return {
              ...lesson,
              status: progress.status as 'locked' | 'active' | 'done',
            };
          }
          return lesson;
        });

        return {
          ...baseCat,
          lessons: lessonsWithProgress,
        };
      });

      setCategories(categoriesWithProgress);
      
      // If we have route params, try to select that category/lesson
      if (params.category && params.lessonId) {
        const targetCategory = categoriesWithProgress.find(c => c.id === params.category);
        if (targetCategory) {
          setActiveId(targetCategory.id);
          const targetLesson = targetCategory.lessons.find(l => l.id === params.lessonId);
          if (targetLesson && targetLesson.status !== 'locked') {
            // Auto-open the lesson
            setSelected({ categoryId: targetCategory.id, lessonId: targetLesson.id });
            setCardIndex(0);
            setRevealed(false);
            setMastery({});
            setFinished(false);
          }
        }
      } else {
        // Fall back to first active category
        const firstActiveCategory = categoriesWithProgress.find(cat => 
          cat.lessons.some(l => l.status === 'active' || l.status === 'done')
        );
        if (firstActiveCategory) {
          setActiveId(firstActiveCategory.id);
        }
      }

    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load lesson progress. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, params.category, params.lessonId]);

  // Load progress on mount
  useEffect(() => {
    if (userId) {
      loadProgress();
    }
  }, [userId, loadProgress]);

  // ── MOVED: All calculations and useMemo hooks BEFORE early return ──
  const cat = categories.find((c) => c.id === activeId);
  
  const activeIndex = cat?.lessons.findIndex((l) => l.status === 'active') ?? -1;
  const done = cat?.lessons.filter((l) => l.status === 'done').length ?? 0;
  const total = cat?.lessons.length ?? 0;
  const activeLesson = activeIndex >= 0 && cat ? cat.lessons[activeIndex] : null;

  const selectedLesson = useMemo(() => {
    if (!selected) return null;
    const category = categories.find((c) => c.id === selected.categoryId);
    if (!category) return null;
    const lesson = category.lessons.find((l) => l.id === selected.lessonId);
    if (!lesson) return null;
    return { category, lesson };
  }, [selected, categories]);

  // Animate the category progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: total > 0 ? done / total : 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [done, total, activeId]);

  // Gentle pulsing glow on the "Continue Lesson" card's icon
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [activeId]);

  // Pop the flashcard in when moving to a new card
  useEffect(() => {
    cardPop.setValue(0);
    Animated.spring(cardPop, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 8 }).start();
  }, [cardIndex, selected]);

  // Fade the cue text in only after the card is revealed
  useEffect(() => {
    if (revealed) {
      cueFade.setValue(0);
      Animated.timing(cueFade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }
  }, [revealed, cardIndex]);

  const handleBack = () => {
    if (selected) {
      closePractice();
    } else {
      router.back();
    }
  };

  const closePractice = () => {
    setSelected(null);
    setCardIndex(0);
    setRevealed(false);
    setMastery({});
    setFinished(false);
  };

  const showLockedTip = (message: string) => {
    if (lockedTipTimer.current) clearTimeout(lockedTipTimer.current);
    setLockedTip(message);
    lockedTipOpacity.setValue(0);
    Animated.timing(lockedTipOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    lockedTipTimer.current = setTimeout(() => {
      Animated.timing(lockedTipOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() =>
        setLockedTip(null)
      );
    }, 2400);
  };

  const handleOpenLesson = (categoryId: string, lesson: LessonItem) => {
    if (lesson.status === 'locked') {
      const category = categories.find(c => c.id === categoryId);
      const lessonIndex = category?.lessons.findIndex(l => l.id === lesson.id) || 0;
      const previousLesson = lessonIndex > 0 ? category?.lessons[lessonIndex - 1] : null;
      
      if (category?.requiredCategoryId) {
        const requiredCat = categories.find(c => c.id === category.requiredCategoryId);
        if (requiredCat && !requiredCat.lessons.every(l => l.status === 'done')) {
          showLockedTip(
            `Complete all lessons in "${requiredCat.label}" first to unlock this category!`
          );
          return;
        }
      }
      
      showLockedTip(
        previousLesson 
          ? `Finish "${previousLesson.title}" first to unlock this lesson!` 
          : 'Complete the previous lesson to unlock this one!'
      );
      return;
    }
    setSelected({ categoryId, lessonId: lesson.id });
    setCardIndex(0);
    setRevealed(false);
    setMastery({});
    setFinished(false);
  };

  const markCard = (id: string, result: Mastery) => {
    setMastery((prev) => ({ ...prev, [id]: result }));
  };

  const goNext = (cards: SignCard[]) => {
    if (cardIndex + 1 < cards.length) {
      setCardIndex(cardIndex + 1);
      setRevealed(false);
    } else {
      setFinished(true);
    }
  };

  // Complete lesson and save to API
  const completeLesson = async (categoryId: string, lessonId: string) => {
    try {
      await apiRequest('saveLessonProgress', 'POST', {
        user_id: userId,
        category_id: categoryId,
        lesson_id: lessonId,
        status: 'done',
        cards_mastery: mastery,
      });

      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      const lessonIndex = category.lessons.findIndex(l => l.id === lessonId);
      const nextLesson = category.lessons[lessonIndex + 1];

      if (nextLesson && nextLesson.status === 'locked') {
        await apiRequest('saveLessonProgress', 'POST', {
          user_id: userId,
          category_id: categoryId,
          lesson_id: nextLesson.id,
          status: 'active',
          cards_mastery: {},
        });
      }

      const allLessonsDone = category.lessons.every(l => 
        l.id === lessonId ? true : l.status === 'done'
      );

      if (allLessonsDone) {
        const nextCategory = categories.find(c => c.requiredCategoryId === categoryId);
        if (nextCategory) {
          const firstLesson = nextCategory.lessons[0];
          if (firstLesson && firstLesson.status === 'locked') {
            await apiRequest('saveLessonProgress', 'POST', {
              user_id: userId,
              category_id: nextCategory.id,
              lesson_id: firstLesson.id,
              status: 'active',
              cards_mastery: {},
            });
          }
        }
      }

      await loadProgress();
      closePractice();

    } catch (error) {
      console.error('Error completing lesson:', error);
      Alert.alert('Error', 'Failed to save lesson progress. Please try again.');
    }
  };

  // ── EARLY RETURN AFTER ALL HOOKS ──
  if (!cat || loading) {
    return (
      <View style={[styles.container, { backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: C.ink }}>Loading lessons...</Text>
      </View>
    );
  }

  /* ---------- Lesson practice screen ---------- */
  if (selectedLesson) {
    const { category, lesson } = selectedLesson;
    const cards = lesson.cards;
    const current = cards[Math.min(cardIndex, cards.length - 1)];
    const gotItCount = Object.values(mastery).filter((m) => m === 'got-it').length;
    const needsPracticeCount = Object.values(mastery).filter((m) => m === 'needs-practice').length;
    const referenceImage = current.imageKey ? images[current.imageKey] : undefined;

    return (
      <View style={[styles.container, { backgroundColor: C.bg }]}>
        <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />

        <View style={styles.blobContainer}>
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />
          <View style={[styles.blob, styles.blob3]} />
        </View>

        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerRow}>
            <BouncyPress onPress={handleBack} style={styles.backBtn}>
              <ArrowLeft size={26} color={C.royal} />
            </BouncyPress>
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.pageTitle, { color: C.ink }]} numberOfLines={1}>
                {lesson.title}
              </Text>
              <Sparkle size={16} color={C.goldDeep} />
            </View>
          </View>

          {!finished && (
            <View style={styles.practiceProgressRow}>
              <View style={styles.practiceProgressTrack}>
                <View
                  style={[
                    styles.practiceProgressFill,
                    { width: `${((cardIndex + 1) / cards.length) * 100}%`, backgroundColor: category.color },
                  ]}
                />
              </View>
              <Text style={styles.practiceProgressLabel}>
                {cardIndex + 1} / {cards.length}
              </Text>
            </View>
          )}
        </View>

        {!finished ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.lessonContent, { paddingBottom: 40 }]}>
            <View style={[styles.lessonCategoryBadge, { backgroundColor: category.bgColor }]}>
              <View style={[styles.lessonCategoryIcon, { backgroundColor: category.color + '22' }]}>
                {category.iconComponent}
              </View>
              <Text style={[styles.lessonCategoryText, { color: category.color }]}>{category.label}</Text>
            </View>

            {cardIndex === 0 && (
              <View style={styles.introRow}>
                <Image source={images.senyaTeaching} style={styles.introMascot} resizeMode="contain" />
                <View style={styles.introBubble}>
                  <Text style={styles.lessonIntro}>{lesson.intro}</Text>
                </View>
              </View>
            )}

            {/* ── Main Lesson Card ── */}
            <Animated.View
              style={[
                styles.lessonCardContainer,
                {
                  transform: [
                    {
                      scale: cardPop.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }),
                    },
                  ],
                  opacity: cardPop,
                },
              ]}
            >
              <LinearGradient
                colors={[category.color + '15', category.color + '08', '#ffffff']}
                style={styles.lessonCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              
              {/* Decorative top bar */}
              <View style={[styles.lessonCardTopBar, { backgroundColor: category.color }]} />

              <View style={styles.lessonCardContent}>
                {/* Sign Label with badge */}
                <View style={styles.signLabelContainer}>
                  <View style={[styles.signNumberBadge, { backgroundColor: category.color }]}>
                    <Text style={styles.signNumberText}>{cardIndex + 1}</Text>
                  </View>
                  <Text style={[styles.signLabel, { color: category.color }]}>
                    {current.label}
                  </Text>
                </View>

                {/* Image */}
                <View style={[styles.signImageContainer, { backgroundColor: category.bgColor }]}>
                  {referenceImage ? (
                    <Image source={referenceImage} style={styles.signImage} resizeMode="contain" />
                  ) : (
                    <View style={[styles.signImagePlaceholder, { backgroundColor: category.color + '22' }]}>
                      {category.iconComponent}
                    </View>
                  )}
                </View>

                {/* Description / How to do it with Senya beside it */}
                <View style={styles.descriptionWrapper}>
                  <Image source={images.senyaTeaching} style={styles.descriptionSenya} resizeMode="contain" />
                  <View style={[styles.descriptionContainer, { borderColor: category.color + '44' }]}>
                    <View style={styles.descriptionHeader}>
                      <Hands size={18} color={category.color} />
                      <Text style={[styles.descriptionTitle, { color: category.color }]}>
                        How to sign
                      </Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {current.cue}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* ── Action Buttons ── */}
            <View style={styles.actionButtonsContainer}>
              <BouncyPress
                style={[styles.actionButton, styles.practiceButton]}
                onPress={() => {
                  markCard(current.id, 'needs-practice');
                  goNext(cards);
                }}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <RotateCw size={22} color="#fff" />
                <Text style={styles.actionButtonText}>Practice More</Text>
              </BouncyPress>

              <BouncyPress
                style={[styles.actionButton, styles.gotItButton]}
                onPress={() => {
                  markCard(current.id, 'got-it');
                  goNext(cards);
                }}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <ThumbsUp size={22} color="#fff" />
                <Text style={styles.actionButtonText}>I Got It!</Text>
              </BouncyPress>
            </View>

            {/* ── Progress Dots ── */}
            <View style={styles.dotsRow}>
              {cards.map((c, i) => {
                const state = mastery[c.id];
                const dotColor =
                  state === 'got-it' ? C.success : state === 'needs-practice' ? C.needsWork : C.border;
                return (
                  <View
                    key={c.id}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: i <= cardIndex ? dotColor : C.border,
                        width: i === cardIndex ? 20 : 9,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </ScrollView>
        ) : (
          // ── Lesson Complete Summary ──
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.lessonContent, { paddingBottom: 40 }]}>
            <GlassCard style={styles.summaryCard}>
              <CelebrationSparkles />
              <Image source={images.senyaBlue} style={styles.summaryMascot} resizeMode="contain" />
              <Text style={styles.summaryTitle}>You did it! 🎉</Text>
              <Text style={styles.summarySub}>
                You practiced all {cards.length} signs in "{lesson.title}."
              </Text>

              <View style={styles.summaryStatsRow}>
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatValue, { color: C.success }]}>{gotItCount}</Text>
                  <Text style={styles.summaryStatLabel}>Got It</Text>
                </View>
                <View style={styles.progressCardDivider} />
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatValue, { color: C.needsWork }]}>{needsPracticeCount}</Text>
                  <Text style={styles.summaryStatLabel}>Practice More</Text>
                </View>
              </View>

              {needsPracticeCount > 0 && (
                <Text style={styles.summaryTip}>
                  Tip: try this lesson again and focus on the signs marked "Practice More."
                </Text>
              )}
            </GlassCard>

            <View style={styles.lessonDetailActions}>
              <BouncyPress
                style={[styles.lessonDetailButton, { backgroundColor: category.color }]}
                onPress={() => completeLesson(category.id, lesson.id)}
              >
                <Text style={styles.lessonDetailButtonText}>Continue</Text>
              </BouncyPress>

              <BouncyPress
                style={styles.lessonDetailButtonSecondary}
                onPress={() => {
                  setCardIndex(0);
                  setRevealed(false);
                  setMastery({});
                  setFinished(false);
                }}
              >
                <Text style={[styles.lessonDetailButtonTextSecondary, { color: C.slate }]}>Practice Again</Text>
              </BouncyPress>

              <BouncyPress style={styles.lessonDetailButtonSecondary} onPress={closePractice}>
                <Text style={[styles.lessonDetailButtonTextSecondary, { color: C.slate }]}>Back to Lessons</Text>
              </BouncyPress>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  /* ---------- Main Lessons List ---------- */
  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <BouncyPress onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={26} color={C.royal} />
          </BouncyPress>
          <View style={styles.headerTitleContainer}>
            <Image source={images.senyaBlue} style={styles.headerMascot} resizeMode="contain" />
            <Text style={[styles.pageTitle, { color: C.ink }]}>Lessons</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContainer}
        >
          {categories.map((c) => {
            const active = activeId === c.id;
            const isUnlocked = isCategoryUnlocked(c, categories);
            return (
              <BouncyPress
                key={c.id}
                onPress={() => {
                  if (isUnlocked || c.id === 'alphabet') {
                    setActiveId(c.id);
                  } else {
                    const requiredCat = categories.find(cat => cat.id === c.requiredCategoryId);
                    showLockedTip(
                      `Complete "${requiredCat?.label || 'previous'}" first to unlock this category!`
                    );
                  }
                }}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: c.color, borderColor: c.color }
                    : { 
                        backgroundColor: isUnlocked ? 'rgba(255,255,255,0.7)' : 'rgba(200,200,200,0.5)',
                        borderColor: isUnlocked ? C.border : '#ddd',
                      },
                ]}
              >
                <View style={styles.chipIconWrap}>{c.iconComponent}</View>
                <Text style={[styles.chipText, { color: active ? '#fff' : isUnlocked ? C.slate : '#aaa' }]}>
                  {c.label}
                </Text>
                {!isUnlocked && c.id !== 'alphabet' && (
                  <Lock size={14} color="#aaa" />
                )}
              </BouncyPress>
            );
          })}
        </ScrollView>
      </View>

      {lockedTip && (
        <Animated.View style={[styles.lockedTipWrap, { opacity: lockedTipOpacity }]}>
          <Image source={images.senyaMagnify} style={styles.lockedTipMascot} resizeMode="contain" />
          <Text style={styles.lockedTipText}>{lockedTip}</Text>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.list, { paddingBottom: 110 }]}>
        <LinearGradient
          colors={[cat.color + 'cc', cat.color]}
          style={styles.catBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.catBannerContent}>
            <View style={[styles.catBannerIconWrap, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              {cat.iconComponent}
            </View>
            <View style={styles.catBannerText}>
              <Text style={styles.catBannerTitle}>{cat.label}</Text>
              <Text style={styles.catBannerSub}>
                {done} of {total} lessons done
              </Text>
            </View>
          </View>
          <View style={styles.catBannerProgress}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  },
                ]}
              />
            </View>
            <Text style={styles.catBannerPercent}>{Math.round((done / total) * 100)}%</Text>
          </View>
        </LinearGradient>

        {/* ── Continue Lesson hero card ── */}
        {activeLesson && (
          <BouncyPress onPress={() => handleOpenLesson(cat.id, activeLesson)}>
            <View style={styles.continueCard}>
              <LinearGradient
                colors={[cat.color, cat.color + 'CC']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.continueTopRow}>
                <View style={styles.continueTagPill}>
                  <Sparkle size={12} color="#fff" />
                  <Text style={styles.continueTagText}>Continue</Text>
                </View>
                <Text style={styles.continueQPillText}>{activeLesson.cards.length} signs</Text>
              </View>
              <View style={styles.continueBody}>
                <Animated.View style={[styles.continueIconWrap, { transform: [{ scale: pulseAnim }] }]}>
                  {cat.iconComponent}
                </Animated.View>
                <View style={styles.continueTextCol}>
                  <Text style={styles.continueTitle} numberOfLines={1}>{activeLesson.title}</Text>
                  <Text style={styles.continueDescription} numberOfLines={2}>{activeLesson.description}</Text>
                </View>
              </View>
              <View style={styles.continueCta}>
                <Text style={[styles.continueCtaText, { color: cat.color }]}>Start lesson</Text>
              </View>
            </View>
          </BouncyPress>
        )}

        {/* ── Section label ── */}
        <View style={styles.sectionLabelRow}>
          <View style={[styles.sectionLabelBar, { backgroundColor: cat.color }]} />
          <Text style={styles.sectionLabelText}>All Lessons</Text>
        </View>

        {/* ── Lesson card grid with dynamic status ── */}
        <View style={styles.lessonGrid}>
          {cat.lessons.map((lesson, i) => {
            const isDone = lesson.status === 'done';
            const isActive = lesson.status === 'active';
            const isLocked = lesson.status === 'locked';
            
            const showBlueBar = isActive || isDone;

            return (
              <BouncyPress
                key={lesson.id}
                style={{ width: LESSON_CARD_WIDTH }}
                onPress={() => handleOpenLesson(cat.id, lesson)}
              >
                <GlassCard
                  style={[
                    styles.lessonCard,
                    { 
                      borderColor: isActive 
                        ? cat.color 
                        : isDone 
                          ? C.success + '55' 
                          : C.border 
                    },
                    isLocked && styles.lessonCardLocked,
                  ]}
                >
                  {showBlueBar && (
                    <View style={[styles.blueBar, { backgroundColor: isActive ? cat.color : C.success }]} />
                  )}

                  <View style={styles.lessonCardTopRow}>
                    <View
                      style={[
                        styles.lessonCardIconWrap,
                        {
                          backgroundColor: isDone
                            ? C.success + '22'
                            : isActive
                            ? cat.bgColor
                            : 'rgba(120,130,160,0.12)',
                        },
                      ]}
                    >
                      {isDone ? (
                        <CheckCircle size={22} color={C.success} />
                      ) : isLocked ? (
                        <Lock size={20} color={C.slateLight} />
                      ) : (
                        cat.iconComponent
                      )}
                    </View>
                    {isActive && (
                      <View style={[styles.lessonCardBadge, { backgroundColor: cat.color }]}>
                        <Text style={styles.lessonCardBadgeText}>ACTIVE</Text>
                      </View>
                    )}
                    {isDone && (
                      <View style={[styles.lessonCardBadge, { backgroundColor: C.success }]}>
                        <Text style={styles.lessonCardBadgeText}>DONE</Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[styles.lessonCardTitle, { color: isLocked ? C.slateLight : C.ink }]}
                    numberOfLines={2}
                  >
                    {lesson.title}
                  </Text>
                  <Text style={styles.lessonCardDescription} numberOfLines={2}>
                    {lesson.description}
                  </Text>

                  <View style={styles.lessonCardFooter}>
                    <Text style={styles.lessonCardMetaText}>{lesson.cards.length} signs</Text>
                  </View>
                </GlassCard>
              </BouncyPress>
            );
          })}
        </View>

        <GlassCard style={styles.progressCard}>
          <View style={styles.progressCardHeader}>
            <Hands size={26} color={C.royal} />
            <Text style={styles.progressCardTitle}>Your Learning Journey</Text>
          </View>
          <Text style={styles.progressCardText}>
            Keep going! You've completed {done} out of {total} lessons in this category. Every lesson
            brings you closer to speaking Filipino Sign Language.
          </Text>
          <View style={styles.progressCardFooter}>
            <View style={styles.progressCardStats}>
              <View style={styles.progressCardStat}>
                <Text style={styles.progressCardStatValue}>{done}</Text>
                <Text style={styles.progressCardStatLabel}>Done</Text>
              </View>
              <View style={styles.progressCardDivider} />
              <View style={styles.progressCardStat}>
                <Text style={styles.progressCardStatValue}>{total - done}</Text>
                <Text style={styles.progressCardStatLabel}>To Go</Text>
              </View>
            </View>
            <View style={styles.progressCardMiniProgress}>
              <View style={styles.progressCardMiniTrack}>
                <View style={[styles.progressCardMiniFill, { width: `${(done / total) * 100}%` }]} />
              </View>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

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
  chipScroll: { marginTop: 14 },
  chipContainer: { gap: 10, paddingBottom: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.5,
    minHeight: 48,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chipIconWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  lockedTipWrap: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.gold,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lockedTipMascot: { width: 28, height: 28 },
  lockedTipText: { flex: 1, fontSize: 13, fontWeight: '700', color: C.ink },

  list: { paddingHorizontal: 20, paddingTop: 16 },

  catBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  catBannerContent: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  catBannerIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  catBannerText: { flex: 1 },
  catBannerTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 2 },
  catBannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '700' },
  catBannerProgress: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  catBannerPercent: { fontSize: 15, fontWeight: '800', color: '#fff' },

  continueCard: {
    borderRadius: 22,
    padding: 18,
    overflow: 'hidden',
    marginBottom: 22,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  continueTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  continueTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  continueTagText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  continueQPillText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  continueBody: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  continueIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueTextCol: { flex: 1 },
  continueTitle: { fontSize: 19, fontWeight: '900', color: '#fff', marginBottom: 3 },
  continueDescription: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
  continueCta: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  continueCtaText: { fontSize: 14, fontWeight: '800' },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLabelBar: { width: 4, height: 16, borderRadius: 2 },
  sectionLabelText: { fontSize: 13, fontWeight: '800', color: C.slate, textTransform: 'uppercase', letterSpacing: 0.5 },

  lessonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, marginBottom: 8 },
  lessonCard: {
    borderWidth: 2,
    padding: 14,
    minHeight: 158,
    position: 'relative',
  },
  lessonCardLocked: { opacity: 0.65 },
  blueBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  lessonCardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  lessonCardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCardBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  lessonCardBadgeText: { fontSize: 9.5, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
  lessonCardTitle: { fontSize: 14.5, fontWeight: '800', marginBottom: 4, lineHeight: 18 },
  lessonCardDescription: { fontSize: 11.5, fontWeight: '500', color: C.slate, lineHeight: 15, flexGrow: 1 },
  lessonCardFooter: { marginTop: 10 },
  lessonCardMetaText: { fontSize: 11, fontWeight: '700', color: C.slate },

  progressCard: { padding: 18, marginTop: 6, marginBottom: 20 },
  progressCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  progressCardTitle: { fontSize: 17, fontWeight: '800', color: C.ink },
  progressCardText: { fontSize: 13.5, fontWeight: '500', color: C.slate, lineHeight: 20, marginBottom: 12 },
  progressCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressCardStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressCardStat: { alignItems: 'center' },
  progressCardStatValue: { fontSize: 22, fontWeight: '900', color: C.ink },
  progressCardStatLabel: { fontSize: 11, fontWeight: '700', color: C.slate, letterSpacing: 0.2 },
  progressCardDivider: { width: 1, height: 24, backgroundColor: C.border },
  progressCardMiniProgress: { flex: 1, maxWidth: 80 },
  progressCardMiniTrack: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  progressCardMiniFill: { height: '100%', backgroundColor: C.success, borderRadius: 3 },

  // ── Practice screen styles ──
  lessonContent: { paddingHorizontal: 20, paddingTop: 8 },
  practiceProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  practiceProgressTrack: { flex: 1, height: 8, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden' },
  practiceProgressFill: { height: '100%', borderRadius: 4 },
  practiceProgressLabel: { fontSize: 13, fontWeight: '800', color: C.slate },

  lessonCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  lessonCategoryIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lessonCategoryText: { fontSize: 13.5, fontWeight: '700' },

  introRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 18 },
  introMascot: { width: 56, height: 56, marginTop: -6 },
  introBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 14,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  lessonIntro: { fontSize: 14.5, fontWeight: '500', color: C.ink, lineHeight: 21 },

  // ── Lesson Card ──
  lessonCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  lessonCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  lessonCardTopBar: {
    height: 6,
    width: '100%',
  },
  lessonCardContent: {
    padding: 20,
  },
  signLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  signNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  signLabel: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  signImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  signImage: {
    width: '100%',
    height: '100%',
  },
  signImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  descriptionSenya: {
    width: 56,
    height: 56,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  descriptionContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: C.ink,
    lineHeight: 22,
  },

  // ── Action Buttons ──
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  practiceButton: {
    shadowColor: '#F59E0B',
  },
  gotItButton: {
    shadowColor: '#10B981',
  },

  dotsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 10 },
  dot: { height: 9, borderRadius: 5 },

  // ── Summary Card ──
  summaryCard: { padding: 24, alignItems: 'center', marginBottom: 20, position: 'relative' },
  sparkleLayer: { ...StyleSheet.absoluteFillObject },
  sparkleItem: { position: 'absolute' },
  summaryMascot: { width: 96, height: 96, marginBottom: 10 },
  summaryTitle: { fontSize: 24, fontWeight: '900', color: C.ink, marginBottom: 6 },
  summarySub: { fontSize: 14.5, fontWeight: '500', color: C.slate, textAlign: 'center', marginBottom: 18 },
  summaryStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 14 },
  summaryStat: { alignItems: 'center' },
  summaryStatValue: { fontSize: 26, fontWeight: '900' },
  summaryStatLabel: { fontSize: 12, fontWeight: '700', color: C.slate, letterSpacing: 0.2 },
  summaryTip: { fontSize: 12.5, fontWeight: '500', color: C.slate, textAlign: 'center', fontStyle: 'italic' },

  lessonDetailActions: { gap: 12, marginTop: 4 },
  lessonDetailButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonDetailButtonText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  lessonDetailButtonSecondary: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  lessonDetailButtonTextSecondary: { fontSize: 15.5, fontWeight: '700' },
});