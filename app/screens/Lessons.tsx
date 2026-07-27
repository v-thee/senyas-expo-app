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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
};

// ── Design Tokens ──
// Brighter, higher-contrast palette tuned for 7–11 year-olds: bigger color
// jumps between states, warmer gold for "in progress", clear green for done.
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

const SPARKLE_COLORS = [C.gold, C.sky, C.success, C.streak];

/* ---------- Custom Icon Components (replacing emojis) ---------- */
const AlphabetIcon = ({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth={2} />
    <Path d="M9 18V6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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
}

/* ---------- FSL Lesson Data ---------- */
const makeCards = (labels: string[], hint: (l: string) => string): SignCard[] =>
  labels.map((label, i) => ({
    id: `${label}-${i}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
    label,
    cue: hint(label),
    imageKey: label.toLowerCase(),
  }));

export const CATEGORIES: Category[] = [
  {
    id: 'alphabet',
    label: 'Alphabet',
    icon: 'alphabet',
    iconComponent: <AlphabetIcon size={24} color={C.royal} />,
    color: C.royal,
    bgColor: C.royal + '22',
    lessons: [
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
  },
  {
    id: 'greetings',
    label: 'Greetings',
    icon: 'greeting',
    iconComponent: <GreetingIcon size={24} color={C.goldDeep} />,
    color: C.goldDeep,
    bgColor: C.goldDeep + '22',
    lessons: [
      {
        id: 'greet-1',
        title: 'Basic Greetings',
        description: 'Hello, Good Morning, Good Afternoon, Good Evening',
        status: 'done',
        intro: 'Greeting signs come with a warm, friendly face — that\'s part of the sign, not just decoration!',
        cards: makeCards(['Hello', 'Good', 'Morning', 'Afternoon', 'Evening'], (l) =>
          `Watch the picture for "${l}" closely, then copy the motion at a natural, relaxed pace.`
        ),
      },
      {
        id: 'greet-2',
        title: 'Saying Goodbye',
        description: 'Goodbye, See You Later, Take Care',
        status: 'active',
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
  },
  {
    id: 'introductions',
    label: 'Introductions',
    icon: 'user',
    iconComponent: <UserIcon size={24} color={C.sky} />,
    color: C.sky,
    bgColor: C.sky + '22',
    lessons: [
      {
        id: 'intro-1',
        title: 'Introducing Yourself',
        description: 'Name, My, Your, What',
        status: 'done',
        intro: 'You\'ll usually fingerspell your name after signing "name" — so this lesson connects right back to the alphabet.',
        cards: makeCards(['Name', 'My', 'Your', 'What'], (l) =>
          `Practice "${l}" using the picture, then try combining it with your fingerspelled name.`
        ),
      },
      {
        id: 'intro-2',
        title: 'Meeting People',
        description: 'Nice, Meet, You, and the full phrase "Nice to Meet You"',
        status: 'active',
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
  },
  {
    id: 'courtesy',
    label: 'Courtesy',
    icon: 'heart',
    iconComponent: <HeartIcon size={24} color={C.success} />,
    color: C.success,
    bgColor: C.success + '22',
    lessons: [
      {
        id: 'courtesy-1',
        title: 'Everyday Courtesy',
        description: 'Yes, No, Please, Thank You',
        status: 'active',
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
  },
];

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
// Every important tap gets a little "squish" so kids get instant physical
// feedback that their tap registered, even before anything else changes.
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

/* ---------- Mastery state for a lesson's cards ---------- */
type Mastery = 'unseen' | 'got-it' | 'needs-practice';

/* ---------- Main Component ---------- */
export default function Lessons() {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [activeId, setActiveId] = useState('alphabet');
  const [selected, setSelected] = useState<{ categoryId: string; lessonId: string } | null>(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mastery, setMastery] = useState<Record<string, Mastery>>({});
  const [finished, setFinished] = useState(false);

  // Friendly, temporary message shown when a kid taps a locked lesson —
  // replaces the old silent no-op with a clear reason + what to do next.
  const [lockedTip, setLockedTip] = useState<string | null>(null);
  const lockedTipOpacity = useRef(new Animated.Value(0)).current;
  const lockedTipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardPop = useRef(new Animated.Value(0)).current;
  const cueFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const cat = categories.find((c) => c.id === activeId)!;
  const done = cat.lessons.filter((l) => l.status === 'done').length;
  const total = cat.lessons.length;

  const selectedLesson = useMemo(() => {
    if (!selected) return null;
    const category = categories.find((c) => c.id === selected.categoryId)!;
    const lesson = category.lessons.find((l) => l.id === selected.lessonId)!;
    return { category, lesson };
  }, [selected, categories]);

  // Animate the category progress bar whenever it changes, instead of
  // snapping instantly — small, calm motion that still reads as "alive".
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: total > 0 ? done / total : 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [done, total, activeId]);

  // Pop the flashcard in when moving to a new card.
  useEffect(() => {
    cardPop.setValue(0);
    Animated.spring(cardPop, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 8 }).start();
  }, [cardIndex, selected]);

  // Fade the cue text in only after the card is revealed.
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

  const handleOpenLesson = (categoryId: string, lesson: LessonItem, previousTitle?: string) => {
    if (lesson.status === 'locked') {
      // Better logic: tell the kid exactly what's blocking them instead of
      // nothing happening at all.
      showLockedTip(
        previousTitle
          ? `Finish "${previousTitle}" first to unlock this!`
          : 'Finish the lesson before this one to unlock it!'
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

  const completeLesson = (categoryId: string, lessonId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        const idx = c.lessons.findIndex((l) => l.id === lessonId);
        const lessons = c.lessons.map((l, i) => {
          if (l.id === lessonId) return { ...l, status: 'done' as const };
          if (i === idx + 1 && l.status === 'locked') return { ...l, status: 'active' as const };
          return l;
        });
        return { ...c, lessons };
      })
    );
    closePractice();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle size={22} color={C.success} />;
      case 'active':
        return <View style={styles.activeDot} />;
      case 'locked':
        return <Lock size={18} color={C.slateLight} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Done!';
      case 'active':
        return 'Keep going';
      case 'locked':
        return 'Locked';
      default:
        return '';
    }
  };

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

            {cardIndex === 0 && !revealed && (
              <View style={styles.introRow}>
                <Image source={images.senyaTeaching} style={styles.introMascot} resizeMode="contain" />
                <View style={styles.introBubble}>
                  <Text style={styles.lessonIntro}>{lesson.intro}</Text>
                </View>
              </View>
            )}

            {/* Flashcard */}
            <Animated.View
              style={{
                transform: [
                  {
                    scale: cardPop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }),
                  },
                ],
                opacity: cardPop,
              }}
            >
              <BouncyPress onPress={() => setRevealed((r) => !r)} style={[styles.flashcard, { borderColor: category.color }]}>
                <View style={[styles.flashcardImageWrap, { backgroundColor: category.bgColor }]}>
                  {referenceImage ? (
                    <Image source={referenceImage} style={styles.flashcardImage} resizeMode="contain" />
                  ) : (
                    <View style={[styles.flashcardPlaceholder, { backgroundColor: category.color + '22' }]}>
                      {category.iconComponent}
                    </View>
                  )}
                </View>

                <Text style={[styles.flashcardLabel, { color: category.color }]}>{current.label}</Text>

                {!revealed ? (
                  <View style={styles.flashcardTapHint}>
                    <Image source={images.senyaMagnify} style={styles.tapHintMascot} resizeMode="contain" />
                    <Text style={styles.flashcardTapHintText}>Tap the card to see a tip!</Text>
                  </View>
                ) : (
                  <Animated.Text style={[styles.flashcardCue, { opacity: cueFade }]}>{current.cue}</Animated.Text>
                )}
              </BouncyPress>
            </Animated.View>

            {/* Self-assessment — big, thumb-friendly, clearly labeled */}
            {revealed && (
              <View style={styles.assessRow}>
                <BouncyPress
                  style={[styles.assessBtn, { backgroundColor: C.needsWork }]}
                  onPress={() => {
                    markCard(current.id, 'needs-practice');
                    goNext(cards);
                  }}
                >
                  <RotateCw size={20} color="#fff" />
                  <Text style={styles.assessBtnText}>Practice More</Text>
                </BouncyPress>
                <BouncyPress
                  style={[styles.assessBtn, { backgroundColor: C.success }]}
                  onPress={() => {
                    markCard(current.id, 'got-it');
                    goNext(cards);
                  }}
                >
                  <ThumbsUp size={20} color="#fff" />
                  <Text style={styles.assessBtnText}>I Got It!</Text>
                </BouncyPress>
              </View>
            )}

            {!revealed && (
              <Text style={styles.helperNudge}>Look at the picture, try the sign, then tap the card 👆</Text>
            )}

            {/* Dot indicators for all cards in this lesson */}
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
          /* ---------- Lesson complete summary ---------- */
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
            return (
              <BouncyPress
                key={c.id}
                onPress={() => setActiveId(c.id)}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: c.color, borderColor: c.color }
                    : { backgroundColor: 'rgba(255,255,255,0.7)', borderColor: C.border },
                ]}
              >
                <View style={styles.chipIconWrap}>{c.iconComponent}</View>
                <Text style={[styles.chipText, { color: active ? '#fff' : C.slate }]}>{c.label}</Text>
              </BouncyPress>
            );
          })}
        </ScrollView>
      </View>

      {/* Friendly locked-lesson tip, replaces the old "nothing happens" tap */}
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

        {cat.lessons.map((lesson, i) => {
          const isDone = lesson.status === 'done';
          const isActive = lesson.status === 'active';
          const isLocked = lesson.status === 'locked';
          const previousTitle = i > 0 ? cat.lessons[i - 1].title : undefined;

          return (
            <BouncyPress
              key={lesson.id}
              disabled={false}
              onPress={() => handleOpenLesson(cat.id, lesson, previousTitle)}
              style={[
                styles.lessonItem,
                {
                  backgroundColor: isLocked ? 'rgba(255,255,255,0.5)' : '#fff',
                  borderColor: isActive ? cat.color : C.border,
                  borderWidth: isActive ? 2 : 1,
                  opacity: isLocked ? 0.65 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.lessonIconWrap,
                  { backgroundColor: isDone || isActive ? cat.bgColor : 'rgba(255,255,255,0.5)' },
                ]}
              >
                {isDone ? (
                  <CheckCircle size={26} color={C.success} />
                ) : isLocked ? (
                  <Lock size={22} color={C.slateLight} />
                ) : (
                  cat.iconComponent
                )}
              </View>

              <View style={styles.lessonText}>
                <Text style={[styles.lessonTitle, { color: isLocked ? C.slateLight : C.ink }]}>
                  {lesson.title}
                </Text>
                <Text style={[styles.lessonSub, { color: C.slate }]} numberOfLines={1}>
                  {lesson.cards.length} signs · {lesson.description}
                </Text>
              </View>

              <View style={styles.statusContainer}>
                {getStatusIcon(lesson.status)}
                <Text style={[styles.statusText, { color: isLocked ? C.slateLight : C.slate }]}>
                  {getStatusText(lesson.status)}
                </Text>
              </View>
            </BouncyPress>
          );
        })}

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

  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    minHeight: 76,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonIconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lessonText: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 3 },
  lessonSub: { fontSize: 12.5, fontWeight: '500', color: C.slate },
  statusContainer: { alignItems: 'flex-end', gap: 3 },
  statusText: { fontSize: 11, fontWeight: '700', color: C.slate, letterSpacing: 0.2 },
  activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.goldDeep },

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

  // ── Lesson practice screen ──
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

  flashcard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    borderWidth: 2.5,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    minHeight: 280,
    justifyContent: 'center',
  },
  flashcardImageWrap: {
    width: 150,
    height: 150,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  flashcardImage: { width: '100%', height: '100%', borderRadius: 18 },
  flashcardPlaceholder: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  flashcardLabel: { fontSize: 30, fontWeight: '900', marginBottom: 14, textAlign: 'center' },
  flashcardTapHint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tapHintMascot: { width: 26, height: 26 },
  flashcardTapHintText: { fontSize: 14, fontWeight: '700', color: C.slate },
  flashcardCue: { fontSize: 15, fontWeight: '500', color: C.ink, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },

  helperNudge: { fontSize: 12.5, fontWeight: '600', color: C.slate, textAlign: 'center', marginBottom: 16 },

  assessRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  assessBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  assessBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  dotsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 10 },
  dot: { height: 9, borderRadius: 5 },

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