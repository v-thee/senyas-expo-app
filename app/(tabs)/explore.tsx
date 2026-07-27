// app/(tabs)/explore.tsx
import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
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

// ── Icons (Feather-style outlines from index) ──
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
  id: number;
  category: string;
  title: string;
  desc: string;
  color: string;
  iconBg: string;
  duration: string;
  xp: number;
  done: boolean;
  active?: boolean;
  isExam?: boolean;
  signs: Sign[];
}

// ── Updated Lesson Data with new titles (Chest Challenge removed) ──
export const lessonData: Lesson[] = [
  {
    id: 1,
    category: 'Alphabet',
    title: 'Learn Alphabets A-N',
    desc: 'Master the first half of the FSL alphabet from A to N',
    color: '#2563EB',
    iconBg: '#EFF6FF',
    duration: '8 min',
    xp: 30,
    done: true,
    signs: [
      { letter: 'A', hint: 'Closed fist, thumb resting on the side of the index finger.' },
      { letter: 'B', hint: 'Four fingers held straight up, thumb folded across the palm.' },
      { letter: 'C', hint: 'Curve your hand into a C shape — like holding a can.' },
      { letter: 'D', hint: 'Index finger points up, other fingers and thumb form a circle.' },
      { letter: 'E', hint: 'All fingers curl down toward the palm, thumb tucked under.' },
      { letter: 'F', hint: 'Index finger and thumb touch to form a circle, other fingers up.' },
      { letter: 'G', hint: 'Index finger and thumb point sideways, parallel to the ground.' },
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
    id: 2,
    category: 'Alphabet',
    title: 'Learn Alphabets O-Z',
    desc: 'Complete the FSL alphabet with letters O through Z',
    color: '#2563EB',
    iconBg: '#EFF6FF',
    duration: '8 min',
    xp: 30,
    done: true,
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
  {
    id: 3,
    category: 'Numbers',
    title: 'Learn Numbers',
    desc: 'Count from one to ten in FSL',
    color: '#6B7280',
    iconBg: '#F9FAFB',
    duration: '6 min',
    xp: 25,
    done: false,
    active: true,
    signs: [
      { letter: '1', hint: 'Index finger points straight up.' },
      { letter: '2', hint: 'Index and middle fingers raised in a V shape.' },
      { letter: '3', hint: 'Thumb, index, and middle fingers extended.' },
      { letter: '4', hint: 'Four fingers extended, thumb folded across the palm.' },
      { letter: '5', hint: 'All five fingers spread open wide.' },
      { letter: '6', hint: 'Pinky and thumb touch, other fingers extended up.' },
      { letter: '7', hint: 'Ring, pinky, and thumb touch, other fingers extended up.' },
      { letter: '8', hint: 'Middle, ring, pinky, and thumb touch, index extended up.' },
      { letter: '9', hint: 'All fingers curled except index, which forms a hook.' },
      { letter: '10', hint: 'Thumb touches the palm, other fingers extended up and shake.' },
    ],
  },
  {
    id: 4,
    category: 'Greetings',
    title: 'Basic Greetings',
    desc: 'Learn essential greetings like Hello, Good Morning, and Goodbye',
    color: '#F2A400',
    iconBg: '#FEF3C7',
    duration: '5 min',
    xp: 20,
    done: false,
    signs: [
      { letter: 'Hello', hint: 'Open hand, fingers together, wave gently from the wrist.' },
      { letter: 'Good Morning', hint: 'Flat hand moves from chin level upward like the rising sun.' },
      { letter: 'Good Afternoon', hint: 'Flat hand moves from chin level slightly upward and outward.' },
      { letter: 'Good Evening', hint: 'Flat hand moves from chin level downward and outward.' },
      { letter: 'Goodbye', hint: 'Open hand raised, wave fingers down then back up.' },
    ],
  },
  {
    id: 5,
    category: 'Introductions',
    title: 'Introduction',
    desc: 'Learn to introduce yourself and ask others their name',
    color: '#5EC8FA',
    iconBg: '#E0F2FE',
    duration: '6 min',
    xp: 25,
    done: false,
    signs: [
      { letter: 'My Name', hint: 'Place flat palm on chest for "my" then sign "name".' },
      { letter: 'Your Name', hint: 'Push flat palm forward for "your" then sign "name".' },
      { letter: 'What', hint: 'Hold both hands up, palms facing up, and shake slightly.' },
      { letter: 'Nice', hint: 'Place flat palm over other palm, slide forward smoothly.' },
      { letter: 'Meet', hint: 'Bring index fingers together like two people meeting.' },
      { letter: 'You', hint: 'Point index finger toward the person you are speaking to.' },
      { letter: 'Nice to Meet You', hint: 'Combine Nice + Meet + You in sequence.' },
    ],
  },
  {
    id: 6,
    category: 'Courtesy',
    title: 'Courtesy',
    desc: 'Learn polite phrases like Please, Thank You, and You\'re Welcome',
    color: '#10B981',
    iconBg: '#D1FAE5',
    duration: '5 min',
    xp: 20,
    done: false,
    signs: [
      { letter: 'Please', hint: 'Open palm rubs a small circle on the chest.' },
      { letter: 'Thank You', hint: 'Flat hand moves forward from the chin, like blowing a kiss.' },
      { letter: 'You\'re Welcome', hint: 'Open hand sweeps inward toward the body with a nod.' },
      { letter: 'Yes', hint: 'Make an S fist and tilt it forward at the wrist twice.' },
      { letter: 'No', hint: 'Snap index and middle fingers down against the thumb quickly.' },
      { letter: 'Sorry', hint: 'Closed fist rubs a circle on the chest.' },
    ],
  },
  {
    id: 7,
    category: 'Conversation',
    title: 'Basic Conversation',
    desc: 'Combine greetings, introductions, and courtesy into real conversations',
    color: '#8B5CF6',
    iconBg: '#EDE9FE',
    duration: '10 min',
    xp: 40,
    done: false,
    signs: [
      { letter: 'Greeting', hint: 'Review and combine greeting signs.' },
      { letter: 'Introduction', hint: 'Review and combine introduction signs.' },
      { letter: 'Courtesy', hint: 'Review and combine courtesy signs.' },
      { letter: 'Full Conversation', hint: 'Practice a complete conversation with all signs.' },
    ],
  },
  {
    id: 8,
    category: 'Conversation',
    title: 'Unit Exam',
    desc: 'Prove your mastery and unlock Unit 2',
    color: '#8B5CF6',
    iconBg: '#EDE9FE',
    duration: '12 min',
    xp: 100,
    done: false,
    isExam: true,
    signs: [],
  },
];

// ── Node Positions ──
const NODE_POSITIONS = [
  { cx: 50, cy: 680 },
  { cx: 24, cy: 600 },
  { cx: 74, cy: 510 },
  { cx: 26, cy: 420 },
  { cx: 70, cy: 335 },
  { cx: 28, cy: 248 },
  { cx: 68, cy: 158 },
  { cx: 50, cy: 78 },
];

const ROAD_PATH =
  'M 190 700 C 190 668, 92 648, 92 608 C 92 568, 280 548, 280 508 ' +
  'C 280 468, 98 448, 98 408 C 98 368, 266 348, 266 308 ' +
  'C 266 268, 100 248, 100 208 C 100 168, 258 148, 258 108 ' +
  'C 258 72, 170 52, 170 24';

const SEGMENT_COUNT = NODE_POSITIONS.length - 1;

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

// ── Road length lookup table ──
const NODE_PATH_LENGTHS = [
  0,
  139.8,
  360.54,
  575.95,
  779.05,
  980.4,
  1174.82,
  1301.15,
];
const TOTAL_PATH_LENGTH = NODE_PATH_LENGTHS[NODE_PATH_LENGTHS.length - 1];

const OVERSHOOT_FRACTION = 0.4;

// ── SplitRoad Component ──
function SplitRoad({ activeIdx }: { activeIdx: number }) {
  let progressLength: number;
  if (activeIdx === -1) {
    progressLength = TOTAL_PATH_LENGTH;
  } else {
    const start = NODE_PATH_LENGTHS[activeIdx];
    const end = NODE_PATH_LENGTHS[activeIdx + 1] ?? TOTAL_PATH_LENGTH;
    progressLength = start + OVERSHOOT_FRACTION * (end - start);
  }

  const gap = TOTAL_PATH_LENGTH;

  return (
    <G>
      {/* GRAY BASE */}
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

      {/* BLUE OVERLAY */}
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

// ── Main Component ──
export default function ExploreTab() {
  const insets = useSafeAreaInsets();
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, arrowLeft: 100, arrowDir: 'top' });
  const svgRef = useRef<any>(null);
  const wrapRef = useRef<View>(null);

  const totalDone = lessonData.filter(l => l.done).length;
  const totalLessons = lessonData.length;
  const pct = Math.round((totalDone / totalLessons) * 100);
  const activeIdx = lessonData.findIndex(l => l.active);

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
    const idx = lessonData.findIndex(l => l.id === expandedId);
    const pos = NODE_POSITIONS[idx];
    if (!pos) return;

    const scale = SCREEN_W / 380;
    const nodeX = (pos.cx / 100) * 380 * scale;
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
    // Navigate to the Lessons screen
    router.push('/screens/Lessons');
  };

  // If a lesson is open, navigate to Lessons screen
  if (openLesson) {
    router.push('/screens/Lessons');
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFE0F7" />

      {/* Background Gradient - Updated to match HomeTab */}
      <LinearGradient
        colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Decorative blobs */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
        <View style={[styles.blob, styles.blob4]} />
        <View style={[styles.blob, styles.blob5]} />
      </View>

      {/* ══ HEADER ══ */}
      <View style={styles.header}>
        {/* Top bar - Matches index.tsx exactly */}
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

        {/* Unit banner - With adjusted spacing to match index */}
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

      {/* ══ SCROLLABLE ROAD AREA ══ */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View ref={wrapRef} style={styles.svgWrapper}>
          <Svg viewBox="0 0 380 760" width="100%" height={760}>
            <Defs>
              <Filter id="nshadow" x="-40%" y="-40%" width="180%" height="180%">
                <FeDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(15,49,114,0.20)" />
              </Filter>
              <Filter id="nodeshadow" x="-40%" y="-40%" width="180%" height="180%">
                <FeDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(15,49,114,0.25)" />
              </Filter>
            </Defs>

            <SplitRoad activeIdx={activeIdx} />

            {lessonData.map((lesson, idx) => {
              const pos = NODE_POSITIONS[idx];
              if (!pos) return null;
              const cx = (pos.cx / 100) * 380;
              const cy = pos.cy;
              const isActive = !!lesson.active;
              const isSpecial = !!(lesson.isExam);
              const isDone = lesson.done;
              const isSelected = expandedId === lesson.id;

              const scaleValue = pulseScale as any;
              const opacityValue = pulseOpacity as any;

              return (
                <G
                  key={lesson.id}
                  onPress={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
                >
                  {/* Pulse animation ring for active node */}
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
                  {/* Selection ring */}
                  {isSelected && !isActive && (
                    <Circle cx={cx} cy={cy} r={isSpecial ? 38 : 36} fill="rgba(37, 99, 235, 0.10)" />
                  )}

                  {/* Node shapes */}
                  {isSpecial ? (
                    <>
                      <Rect
                        x={cx - 30}
                        y={cy - 30}
                        width={60}
                        height={60}
                        rx={15}
                        fill={isDone ? '#1E3FAE' : 'rgba(200,220,245,0.85)'}
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
                  ) : (
                    <Circle cx={cx} cy={cy} r={28} fill="rgba(200,220,245,0.85)" filter="url(#nodeshadow)" />
                  )}

                  {/* Node icons */}
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
                  ) : isSpecial ? (
                    <>
                      <Rect
                        x={cx - 9}
                        y={cy - 2}
                        width={18}
                        height={13}
                        rx={3}
                        fill="none"
                        stroke="#6b92cc"
                        strokeWidth="2.2"
                      />
                      <Path
                        d={`M ${cx - 6} ${cy - 2} C ${cx - 6} ${cy - 9}, ${cx + 6} ${cy - 9}, ${cx + 6} ${cy - 2}`}
                        fill="none"
                        stroke="#6b92cc"
                        strokeWidth="2.2"
                      />
                      <Circle cx={cx} cy={cy + 4.5} r={2.2} fill="#6b92cc" />
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

                  {/* NEXT UP badge */}
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

                  {/* Lesson title below node */}
                  {isActive ? (
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

            {/* Senya mascot beside active node - Enhanced */}
            {activeIdx !== -1 &&
              (() => {
                const pos = NODE_POSITIONS[activeIdx];
                const cx = (pos.cx / 100) * 380;
                const onRight = pos.cx > 50;
                return (
                  <G>
                    {/* Glow behind mascot */}
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

          {/* ── Popup card with glassmorphism ── */}
          {expandedId !== null &&
            (() => {
              const lesson = lessonData.find(l => l.id === expandedId);
              if (!lesson) return null;
              const canOpen = lesson.done || lesson.active;
              const { top, left, arrowLeft, arrowDir } = popupPos;

              return (
                <Animated.View
                  style={[
                    styles.popupCard,
                    {
                      top: top,
                      left: left,
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
                          backgroundColor: lesson.iconBg,
                          borderColor: 'rgba(37,99,235,0.10)',
                        },
                      ]}
                    >
                      <CategoryIcon category={lesson.category} size={22} color={lesson.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.popupTitle}>{lesson.title}</Text>
                      <Text style={[styles.popupCategory, { color: lesson.color }]}>{lesson.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.popupDesc}>{lesson.desc}</Text>

                  <View style={styles.popupFooter}>
                    <View style={styles.popupChips}>
                      <View style={styles.popupChip}>
                        <Ionicons name="time-outline" size={10} color="#6B7280" />
                        <Text style={styles.popupChipText}>{lesson.duration}</Text>
                      </View>
                      <View style={[styles.popupChip, styles.popupXpChip]}>
                        <Text style={styles.popupXpText}>+{lesson.xp} XP</Text>
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