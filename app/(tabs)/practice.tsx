import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Image, Modal, Dimensions, StatusBar, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, {
  Circle,
  Path,
  Rect,
  Line,
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

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

// ── Layout math for the bento grid ──
const H_PADDING = 20;
const CONTENT_WIDTH = width - H_PADDING * 2;
const LARGE_GAP = 14;
const SMALL_GAP = 10;
const LARGE_CARD_WIDTH = (CONTENT_WIDTH - LARGE_GAP) / 2;
const SMALL_CARD_WIDTH = (CONTENT_WIDTH - SMALL_GAP * 2) / 3;

// ── Import assets ──
const images = {
  senyaTeaching: require('@/assets/images/senya_teaching.png'),
  senyaBlue: require('@/assets/images/senya_blue.png'),
  streak: require('@/assets/images/streak.png'),
  scoreTrophy: require('@/assets/images/score_trophy.png'),
  senyasLogo: require('@/assets/images/senyas_logo.png'),
  alphabet: require('@/assets/images/alphabet.png'),
  numbers: require('@/assets/images/numbers.png'),
  greetings: require('@/assets/images/greet.png'),
  words: require('@/assets/images/multiple_choice.png'),
  sentences: require('@/assets/images/dragNdrop.png'),
  badges: require('@/assets/images/badges.png'),
  book: require('@/assets/images/book.png'),
};

// ── Icons ──
function ArrowLeft({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SparkleIcon({ size = 14, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.8" />
      <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.5" />
      <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.5" />
    </Svg>
  );
}

function CheckCircle({ size = 24, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill={color + '18'} />
      <Path d="M7 12l3 3 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Trophy({ size = 24, color = '#FFC542' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h12v4a6 6 0 01-12 0V3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 13v8M8 21h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M18 7a6 6 0 01-12 0M6 3v5a6 6 0 0012 0V3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Clock({ size = 20, color = '#6B7492' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BookOpenIcon({ size = 18, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ArrowRight({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TargetIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}

// ── Glass Card ──
function GlassCard({
  children,
  style,
  intensity = 40,
  tint = 'light',
  glow = false,
  glowColor = '#2563EB',
}: {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  glow?: boolean;
  glowColor?: string;
}) {
  return (
    <View
      style={[
        styles.glassWrap,
        glow && {
          shadowColor: glowColor,
          shadowOpacity: 0.28,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
        style,
      ]}
    >
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={styles.glassTint} pointerEvents="none" />
      <LinearGradient
        colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.glassSheen}
        pointerEvents="none"
      />
      <View style={styles.glassBorderTop} pointerEvents="none" />
      {children}
    </View>
  );
}

// ── Pressy ──
function Pressy({
  children,
  onPress,
  style,
  disabled,
  scaleTo = 0.96,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  scaleTo?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.88}
        disabled={disabled}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Types ──
type ScreenState = 'home' | 'gesture' | 'scoreboard';

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  locked: boolean;
  category: 'Alphabet' | 'Numbers' | 'Words' | 'Sentences';
  icon: any;
  color: string;
  bgColor: string;
  variant: 'large' | 'small';
}

// ── Lesson Data ──
const LESSONS: Lesson[] = [
  { 
    id: 1, 
    title: 'Alphabet', 
    subtitle: 'Fingerspelling A-Z', 
    progress: 20, 
    locked: false, 
    category: 'Alphabet',
    icon: images.alphabet,
    color: '#2647B8',
    bgColor: '#2647B822',
    variant: 'large'
  },
  { 
    id: 2, 
    title: 'Numbers', 
    subtitle: 'Counting 1-100', 
    progress: 1, 
    locked: false, 
    category: 'Numbers',
    icon: images.numbers,
    color: '#16A34A',
    bgColor: 'rgba(22, 163, 74, 0.15)',
    variant: 'large'
  },
  { 
    id: 3, 
    title: 'Basic Words', 
    subtitle: 'Common signs', 
    progress: 0, 
    locked: true, 
    category: 'Words',
    icon: images.words,
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    variant: 'small'
  },
  { 
    id: 4, 
    title: 'Sentences', 
    subtitle: 'Full phrases', 
    progress: 0, 
    locked: true, 
    category: 'Sentences',
    icon: images.sentences,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    variant: 'small'
  },
  { 
    id: 5, 
    title: 'Greetings', 
    subtitle: 'Common greetings', 
    progress: 0, 
    locked: true, 
    category: 'Words',
    icon: images.greetings,
    color: '#5EC8FA',
    bgColor: 'rgba(94, 200, 250, 0.15)',
    variant: 'small'
  },
];

// ── Student Ranking ──
interface StudentRank {
  id: number;
  name: string;
  score: number;
  time: number; // seconds
}

// Sample classmates used to populate the leaderboard alongside the current
// user's live result. In a real build this would come from the same
// getRankings-style API call used in QuizMC.
const SAMPLE_CLASSMATES: Omit<StudentRank, 'id'>[] = [
  { name: 'Mica Danah Paris', score: 5, time: 33 },
  { name: 'Samuel Pascual', score: 5, time: 40 },
];

const buildRankings = (userScore: number, userTime: number): StudentRank[] => {
  const rows: StudentRank[] = [
    ...SAMPLE_CLASSMATES.map((s, i) => ({ id: i + 1, ...s })),
    { id: 999, name: 'You', score: userScore, time: userTime || 1 },
  ];

  return rows.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });
};

// ── Gesture Signs ──
const GESTURE_SIGNS = [
  { sign: 'A', hint: 'Closed fist with thumb resting on the side of the index finger.' },
  { sign: 'B', hint: 'Four fingers held straight up with thumb folded across the palm.' },
  { sign: 'C', hint: 'Curve your hand into a C shape.' },
  { sign: 'D', hint: 'Index finger points up with other fingers forming a circle.' },
  { sign: 'E', hint: 'All fingers curl down toward the palm with thumb tucked under.' },
];

// ── Scoreboard Screen ──
function ScoreboardScreen({
  score,
  total,
  time,
  onContinue,
}: {
  score: number;
  total: number;
  time: number;
  onContinue: () => void;
}) {
  const insets = useSafeAreaInsets();
  const rankings = useMemo(() => buildRankings(score, time), [score, time]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const starAnimations = useRef([...Array(3)].map(() => new Animated.Value(0))).current;
  const trophyPulse = useRef(new Animated.Value(1)).current;

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    const starsToShow = Math.ceil((score / total) * 3);
    starAnimations.forEach((anim, i) => {
      if (i < starsToShow) {
        Animated.sequence([
          Animated.delay(i * 400 + 300),
          Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 10 }),
        ]).start();
      } else {
        Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true }).start();
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyPulse, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(trophyPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const percentage = Math.round((score / total) * 100);
  const tier = percentage >= 90 ? 'gold' : percentage >= 70 ? 'silver' : percentage >= 50 ? 'bronze' : 'beginner';
  const rankColor = tier === 'gold' ? '#F59E0B' : tier === 'silver' ? '#9CA3AF' : tier === 'bronze' ? '#CD7F32' : '#6B7280';
  const rankLabel = tier === 'gold' ? 'Gold' : tier === 'silver' ? 'Silver' : tier === 'bronze' ? 'Bronze' : 'Beginner';

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage / 100,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const getMessage = () => {
    if (percentage >= 90) return '🌟 Excellent Work!';
    if (percentage >= 70) return '👏 Great Job!';
    if (percentage >= 50) return '💪 Keep Going!';
    return '📚 Practice More!';
  };

  const getSubtext = () => {
    if (percentage >= 90) return 'Top of the class! 🏆';
    if (percentage >= 70) return 'Great progress — keep it up! 🚀';
    if (percentage >= 50) return "You're getting there! 💪";
    return 'Keep practicing to improve! 📖';
  };

  return (
    <View style={styles.scoreboardContainer}>
      <LinearGradient
        colors={['#1E3A8A', '#2563EB', '#3B82F6']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.ambientOrb, { top: -60, left: -40, backgroundColor: 'rgba(245,158,11,0.18)' }]} />
      <View style={[styles.ambientOrb, { bottom: -80, right: -60, backgroundColor: 'rgba(255,255,255,0.1)' }]} />

      <ScrollView
        style={styles.scoreboardScrollView}
        contentContainerStyle={[styles.scoreboardContent, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.scoreboardCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <GlassCard style={styles.scoreboardGlass} intensity={30} glow glowColor="#F59E0B">
            <Animated.View style={{ transform: [{ scale: trophyPulse }] }}>
              <Image source={images.senyaTeaching} style={styles.scoreboardSenya} resizeMode="contain" />
            </Animated.View>

            <View style={styles.scoreDisplay}>
              <Image source={images.scoreTrophy} style={styles.scoreTrophyIcon} resizeMode="contain" />
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreTotal}>/{total}</Text>
            </View>

            <View style={styles.starsRow}>
              {[0, 1, 2].map((i) => (
                <Animated.View
                  key={i}
                  style={{
                    transform: [
                      {
                        scale: starAnimations[i].interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 1.3, 1],
                        }),
                      },
                    ],
                  }}
                >
                  <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill={i < Math.ceil((score / total) * 3) ? '#F59E0B' : 'none'}
                      opacity={i < Math.ceil((score / total) * 3) ? 1 : 0.3}
                    />
                  </Svg>
                </Animated.View>
              ))}
            </View>

            <View style={styles.performanceRow}>
              <Text style={styles.performanceMessage}>{getMessage()}</Text>
            </View>

            <View style={styles.rankingContainer}>
              <View style={styles.rankingHeader}>
                <Trophy size={16} color="#FFFFFF" />
                <Text style={styles.rankingTitle}>🏆 Student Rankings</Text>
              </View>
              
              <View style={styles.rankingRow}>
                <View style={[styles.rankingBadge, { backgroundColor: rankColor + '20', borderColor: rankColor }]}>
                  <Text style={[styles.rankingBadgeText, { color: rankColor }]}>{rankLabel}</Text>
                </View>
                <Text style={styles.rankingSubtext}>{getSubtext()}</Text>
              </View>

              <View style={styles.rankProgressContainer}>
                <View style={styles.rankProgressBar}>
                  <Animated.View
                    style={[
                      styles.rankProgressFill,
                      {
                        backgroundColor: rankColor,
                        transform: [{ scaleX: progressAnim }],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.rankProgressText}>{percentage}%</Text>
              </View>

              {/* Leaderboard — ranked by score, then by time answered */}
              <View style={styles.rankListHeader}>
                <Text style={[styles.rankListHeaderText, { width: 50 }]}>#</Text>
                <Text style={[styles.rankListHeaderText, { flex: 1 }]}>Name</Text>
                <Text style={[styles.rankListHeaderText, { width: 60 }]}>Score</Text>
                <Text style={[styles.rankListHeaderText, { width: 70 }]}>Time</Text>
              </View>

              {rankings.slice(0, 10).map((student, index) => {
                const isUser = student.name === 'You';
                const rankNumber = index + 1;
                const medalEmoji = rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : rankNumber === 3 ? '🥉' : `#${rankNumber}`;

                return (
                  <View
                    key={student.id}
                    style={[
                      styles.rankListItem,
                      rankNumber <= 3 && styles.topRankItem,
                      isUser && styles.userRankItem,
                    ]}
                  >
                    <Text style={[styles.rankListPosition, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                      {medalEmoji}
                    </Text>
                    <Text style={[styles.rankListName, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]} numberOfLines={1}>
                      {student.name} {isUser && '(You)'}
                    </Text>
                    <Text style={[styles.rankListScore, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                      {student.score}/{total}
                    </Text>
                    <Text style={[styles.rankListTime, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                      {formatTime(student.time)}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Pressy onPress={onContinue} style={styles.scoreboardContinueBtn}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.scoreboardContinueGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.scoreboardContinueText}>Continue Learning</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </LinearGradient>
            </Pressy>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Main Component ──
export default function PracticeTab() {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<ScreenState>('home');
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'detecting' | 'success' | 'fail'>('ready');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showFullScreenResult, setShowFullScreenResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const practiceStartTime = useRef<number | null>(null);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const senyaFloat = useRef(new Animated.Value(0)).current;
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lessonAnims = useRef(LESSONS.map(() => new Animated.Value(0))).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const ctaGlow = useRef(new Animated.Value(0)).current;

  const sign = GESTURE_SIGNS[currentSignIndex];

  useEffect(() => {
    Animated.timing(heroAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.stagger(
      90,
      lessonAnims.map((av) => Animated.spring(av, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }))
    ).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(senyaFloat, { toValue: -10, duration: 1500, useNativeDriver: true }),
        Animated.timing(senyaFloat, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (phase === 'detecting') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();

      return () => loop.stop();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'ready' && cameraReady) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ctaGlow, { toValue: 1, duration: 1100, useNativeDriver: true }),
          Animated.timing(ctaGlow, { toValue: 0, duration: 1100, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [phase, cameraReady]);

  useEffect(() => {
    if (phase === 'success' || phase === 'fail') {
      setShowFullScreenResult(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
      }

      if (phase === 'success') {
        autoDismissTimer.current = setTimeout(() => {
          if (currentSignIndex >= GESTURE_SIGNS.length - 1) {
            const elapsed = practiceStartTime.current
              ? Math.max(1, Math.round((Date.now() - practiceStartTime.current) / 1000))
              : 0;
            setTimeSpent(elapsed);
            setScreen('scoreboard');
            setShowFullScreenResult(false);
          } else {
            setCurrentSignIndex((prev) => prev + 1);
            setPhase('ready');
            setShowFullScreenResult(false);
            fadeAnim.setValue(0);
            setShowHint(false);
            setFeedbackMessage('');
          }
        }, 2000);
      } else {
        setFeedbackMessage('Almost there! Try again.');
      }

      return () => {
        if (autoDismissTimer.current) {
          clearTimeout(autoDismissTimer.current);
        }
      };
    }
  }, [phase]);

  const startDetection = async () => {
    if (!cameraRef.current) return;

    setPhase('detecting');
    setShowFullScreenResult(false);
    setFeedbackMessage('');

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, skipProcessing: false });

      if (photo) {
        setTimeout(() => {
          const success = Math.random() > 0.3;

          if (success) {
            setScore((s) => s + 1);
            setCorrectCount((c) => c + 1);
            setPhase('success');
            setFeedbackMessage('Perfect! Great job!');
          } else {
            setPhase('fail');
            setFeedbackMessage('Not quite! Try again.');
          }
          setTotalAttempts((t) => t + 1);
        }, 2000);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setPhase('ready');
    }
  };

  const handleRetry = () => {
    setPhase('ready');
    setShowFullScreenResult(false);
    fadeAnim.setValue(0);
    setFeedbackMessage('');
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
    }
    setTimeout(() => {
      startDetection();
    }, 500);
  };

  const resetPractice = () => {
    setCurrentSignIndex(0);
    setScore(0);
    setPhase('ready');
    setShowFullScreenResult(false);
    setCorrectCount(0);
    setTotalAttempts(0);
    setScreen('home');
    setShowTermsModal(false);
    setShowCameraModal(false);
    setShowHint(false);
    setFeedbackMessage('');
    setTimeSpent(0);
    practiceStartTime.current = null;
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (!lesson.locked) {
      setShowTermsModal(true);
    }
  };

  const handleTermsAccept = () => {
    setShowTermsModal(false);
    setShowCameraModal(true);
  };

  const handleCameraAllow = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestPermission();
      if (result.granted) {
        setShowCameraModal(false);
        practiceStartTime.current = Date.now();
        setScreen('gesture');
      }
    } else {
      setShowCameraModal(false);
      practiceStartTime.current = Date.now();
      setScreen('gesture');
    }
  };

  const renderLargeCard = (lesson: Lesson, index: number) => {
    const isLocked = lesson.locked;
    return (
      <Animated.View 
        key={lesson.id}
        style={[
          { width: LARGE_CARD_WIDTH },
          {
            opacity: lessonAnims[index],
            transform: [{ translateY: lessonAnims[index].interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
          }
        ]}
      >
        <Pressy onPress={() => handleLessonSelect(lesson)} disabled={isLocked} scaleTo={0.98}>
          <GlassCard style={[styles.largeCard, { borderColor: isLocked ? '#DCE4FA' : lesson.color + '55' }]} intensity={30}>
            <LinearGradient
              colors={isLocked ? ['rgba(220,228,250,0.1)', 'rgba(255,255,255,0.25)'] : [lesson.bgColor, 'rgba(255,255,255,0.25)']}
              style={styles.largeCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {!isLocked && lesson.progress > 0 && (
                <View style={styles.largeCardCheck}>
                  <Text style={styles.largeCardProgress}>{lesson.progress}%</Text>
                </View>
              )}
              <View style={[styles.largeIconContainer, { backgroundColor: isLocked ? '#DCE4FA' : lesson.bgColor }]}>
                <Image source={lesson.icon} style={[styles.largeIcon, { opacity: isLocked ? 0.4 : 1 }]} resizeMode="contain" />
              </View>
              <Text style={[styles.largeCardTitle, { color: isLocked ? '#AEB4CE' : lesson.color }]}>{lesson.title}</Text>
              <Text style={[styles.largeCardDescription, { color: isLocked ? '#AEB4CE' : '#565E80' }]} numberOfLines={2}>
                {lesson.subtitle}
              </Text>
              <View style={styles.largeCardFooter}>
                <View style={styles.largeCardMeta}>
                  {isLocked ? (
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#AEB4CE" strokeWidth={2} />
                      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#AEB4CE" strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  ) : (
                    <Clock size={12} color="#565E80" />
                  )}
                  <Text style={[styles.largeCardMetaText, { color: isLocked ? '#AEB4CE' : '#565E80' }]}>
                    {isLocked ? 'Locked' : `${lesson.progress}% done`}
                  </Text>
                </View>
                {!isLocked && (
                  <View style={[styles.largeCardArrow, { backgroundColor: lesson.color }]}>
                    <ArrowRight size={14} color="#fff" />
                  </View>
                )}
              </View>
            </LinearGradient>
          </GlassCard>
        </Pressy>
      </Animated.View>
    );
  };

  const renderSmallCard = (lesson: Lesson, index: number) => {
    const isLocked = lesson.locked;
    return (
      <Animated.View 
        key={lesson.id}
        style={[
          { width: SMALL_CARD_WIDTH },
          {
            opacity: lessonAnims[index],
            transform: [{ translateY: lessonAnims[index].interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
          }
        ]}
      >
        <Pressy onPress={() => handleLessonSelect(lesson)} disabled={isLocked} scaleTo={0.98}>
          <GlassCard style={[styles.smallCard, { borderColor: isLocked ? '#DCE4FA' : lesson.color + '40' }]} intensity={30}>
            <View style={styles.smallCardInner}>
              {isLocked && (
                <View style={styles.smallCardLock}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#AEB4CE" strokeWidth={2} />
                    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#AEB4CE" strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                </View>
              )}
              {!isLocked && lesson.progress > 0 && (
                <View style={styles.smallCardProgress}>
                  <Text style={styles.smallCardProgressText}>{lesson.progress}%</Text>
                </View>
              )}
              <View style={[styles.smallIconContainer, { backgroundColor: isLocked ? '#DCE4FA' : lesson.bgColor }]}>
                <Image source={lesson.icon} style={[styles.smallIcon, { opacity: isLocked ? 0.4 : 1 }]} resizeMode="contain" />
              </View>
              <Text style={[styles.smallCardTitle, { color: isLocked ? '#AEB4CE' : lesson.color }]} numberOfLines={1}>
                {lesson.title}
              </Text>
              <Text style={[styles.smallCardMetaText, { color: isLocked ? '#AEB4CE' : '#565E80' }]}>
                {isLocked ? 'Locked' : `${lesson.progress}%`}
              </Text>
            </View>
          </GlassCard>
        </Pressy>
      </Animated.View>
    );
  };

  // ── Home Screen ──
  if (screen === 'home') {
    const largeLessons = LESSONS.filter(l => l.variant === 'large');
    const smallLessons = LESSONS.filter(l => l.variant === 'small');

    return (
      <View style={styles.container}>
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
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Image source={images.senyasLogo} style={styles.headerMascot} resizeMode="contain" />
              <Text style={styles.pageTitle}>Practice</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.streakPill}>
                <Image source={images.streak} style={styles.streakPillIcon} resizeMode="contain" />
                <Text style={styles.streakPillText}>5</Text>
              </View>
            </View>
          </View>

          {/* Hero Section */}
          <Animated.View
            style={{
              opacity: heroAnim,
              transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
            }}
          >
            <GlassCard style={styles.heroCard} intensity={45} glow glowColor="#2563EB">
              <LinearGradient colors={['rgba(37, 99, 235, 0.05)', 'rgba(245, 158, 11, 0.04)']} style={StyleSheet.absoluteFill} />
              <View style={styles.heroContent}>
                <View style={styles.heroText}>
                  <Text style={styles.heroTitle}>Practice your hand signs!</Text>
                  <View style={styles.heroTipRow}>
                    <View style={styles.heroTipIconWrap}>
                      <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
                    <Text style={styles.heroSub}>5 minutes daily beats one long session. Consistency is key!</Text>
                  </View>
                </View>
                <Image source={images.senyaTeaching} style={styles.heroImage} resizeMode="contain" />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Stats Strip */}
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <BookOpenIcon size={16} color={C.royal} />
              <Text style={styles.statValue}>{LESSONS.length}</Text>
              <Text style={styles.statLabel}>Topics</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <TargetIcon size={16} color={C.goldDeep} />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Signs to learn</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <Trophy size={16} color={C.success} />
              <Text style={styles.statValue}>{LESSONS.filter(l => !l.locked).length}/{LESSONS.length}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>

          {/* Large Cards Row */}
          <View style={styles.sectionLabelRow}>
            <View style={[styles.sectionLabelBar, { backgroundColor: C.royal }]} />
            <Text style={styles.sectionLabelText}>Available Lessons</Text>
          </View>

          <View style={styles.largeRow}>
            {largeLessons.map((lesson, idx) => renderLargeCard(lesson, idx))}
          </View>

          {/* Small Cards Row */}
          <View style={styles.sectionLabelRow}>
            <View style={[styles.sectionLabelBar, { backgroundColor: C.success }]} />
            <Text style={styles.sectionLabelText}>More Topics</Text>
          </View>

          <View style={styles.smallRow}>
            {smallLessons.map((lesson, idx) => renderSmallCard(lesson, largeLessons.length + idx))}
          </View>

          {/* Tip Card */}
          <GlassCard style={styles.tipCard} intensity={30}>
            <View style={styles.tipContent}>
              <Trophy size={22} color={C.gold} />
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>Practice Tip</Text>
                <Text style={styles.tipDescription}>
                  Don't rush — focus on getting each sign right before moving to the next one.
                </Text>
              </View>
            </View>
          </GlassCard>
        </ScrollView>

        {/* Terms Modal */}
        <Modal visible={showTermsModal} transparent animationType="fade" onRequestClose={() => setShowTermsModal(false)}>
          <View style={styles.modalOverlay}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.modalContainer}>
              <GlassCard style={styles.modalCard} intensity={55}>
                <Text style={styles.modalTitle}>Terms & Conditions</Text>
                <Text style={styles.modalDescription}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                  We use your camera to analyze hand signs in real time.
                  Your video data is never recorded or stored.
                </Text>
                <View style={styles.modalActions}>
                  <Pressy style={styles.modalCancelButton} onPress={() => setShowTermsModal(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressy>
                  <Pressy style={styles.modalAcceptButton} onPress={handleTermsAccept}>
                    <LinearGradient colors={['#2563EB', '#1E3FAE']} style={styles.modalAcceptGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Text style={styles.modalAcceptText}>Accept</Text>
                    </LinearGradient>
                  </Pressy>
                </View>
              </GlassCard>
            </View>
          </View>
        </Modal>

        {/* Camera Permission Modal */}
        <Modal visible={showCameraModal} transparent animationType="fade" onRequestClose={() => setShowCameraModal(false)}>
          <View style={styles.modalOverlay}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.modalContainer}>
              <GlassCard style={styles.modalCard} intensity={55}>
                <View style={styles.cameraModalIconContainer}>
                  <View style={styles.cameraModalIconCircle}>
                    <Svg width={34} height={34} viewBox="0 0 24 24" fill="none">
                      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      <Circle cx="12" cy="13" r="4" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                </View>
                <Text style={styles.modalTitle}>Camera Access</Text>
                <Text style={styles.modalDescription}>
                  We use your camera to analyze your hand signs in real time.
                  Your video is never recorded or stored.
                </Text>
                <View style={styles.modalActions}>
                  <Pressy style={styles.modalCancelButton} onPress={() => { setShowCameraModal(false); setShowTermsModal(true); }}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressy>
                  <Pressy style={styles.modalAcceptButton} onPress={handleCameraAllow}>
                    <LinearGradient colors={['#2563EB', '#1E3FAE']} style={styles.modalAcceptGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Text style={styles.modalAcceptText}>Allow Camera</Text>
                    </LinearGradient>
                  </Pressy>
                </View>
              </GlassCard>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ── Gesture Screen ──
  if (screen === 'gesture') {
    return (
      <View style={styles.gestureContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#BFE0F7" />

        <LinearGradient
          colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <View style={[styles.gestureTopBar, { paddingTop: insets.top + 12 }]}>
          <Pressy onPress={resetPractice} style={styles.gestureBackBtn} scaleTo={0.88}>
            <Ionicons name="arrow-back" size={22} color="#1E3A8A" />
          </Pressy>

          <View style={styles.gestureProgress}>
            <View style={styles.gestureDots}>
              {GESTURE_SIGNS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.gestureDot,
                    {
                      backgroundColor: i < currentSignIndex ? '#22C55E' : i === currentSignIndex ? '#2563EB' : 'rgba(30,58,138,0.2)',
                      width: i === currentSignIndex ? 20 : 8,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.gestureProgressRow}>
              <Text style={styles.gestureProgressText}>Sign {currentSignIndex + 1} of {GESTURE_SIGNS.length}</Text>
              <Text style={styles.gestureProgressText}>•</Text>
              <Text style={styles.gestureProgressText}>{correctCount} correct</Text>
              <Text style={styles.gestureProgressText}>•</Text>
              <Text style={styles.gestureProgressText}>{totalAttempts}/{GESTURE_SIGNS.length}</Text>
            </View>
          </View>

          <View style={styles.gestureLiveDot}>
            <View style={[styles.gestureLiveDotInner, { backgroundColor: phase === 'detecting' ? '#F59E0B' : '#EF4444' }]} />
            <Text style={styles.gestureLiveText}>{phase === 'detecting' ? 'SCAN' : 'LIVE'}</Text>
          </View>
        </View>

        <View style={styles.gestureFrameWrap}>
          <View style={styles.gestureFrameOuter}>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFillObject}
              facing="front"
              autofocus="on"
              onCameraReady={() => setCameraReady(true)}
              onMountError={() => console.log('Camera mount error')}
            />

            <Animated.View style={[styles.senyaOverlay, { transform: [{ translateY: senyaFloat }] }]}>
              <Image source={images.senyaTeaching} style={styles.senyaOverlayImage} resizeMode="contain" />
            </Animated.View>

            <Animated.View
              style={[
                styles.gestureFrame,
                { borderColor: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : phase === 'detecting' ? '#F59E0B' : '#2563EB' },
                { transform: [{ scale: phase === 'detecting' ? pulseAnim : 1 }] },
              ]}
            >
              <View style={[styles.gestureCorner, styles.gestureCornerTL, { borderColor: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : phase === 'detecting' ? '#F59E0B' : '#2563EB' }]} />
              <View style={[styles.gestureCorner, styles.gestureCornerTR, { borderColor: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : phase === 'detecting' ? '#F59E0B' : '#2563EB' }]} />
              <View style={[styles.gestureCorner, styles.gestureCornerBL, { borderColor: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : phase === 'detecting' ? '#F59E0B' : '#2563EB' }]} />
              <View style={[styles.gestureCorner, styles.gestureCornerBR, { borderColor: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : phase === 'detecting' ? '#F59E0B' : '#2563EB' }]} />

              {phase !== 'ready' && (
                <View style={[styles.gestureFrameLabel, { backgroundColor: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : '#F59E0B' }]}>
                  <Text style={styles.gestureFrameLabelText}>
                    {phase === 'success' ? 'CORRECT!' : phase === 'fail' ? 'NOT QUITE!' : 'SCANNING'}
                  </Text>
                </View>
              )}

              {phase === 'detecting' && (
                <Animated.View
                  style={[
                    styles.gestureScanLine,
                    {
                      backgroundColor: '#F59E0B',
                      transform: [{ translateY: scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [-120, 120] }) }],
                    },
                  ]}
                />
              )}

              <View style={styles.gestureFrameCenter}>
                {phase === 'ready' && (
                  <>
                    <View style={styles.gestureLetterBadge}>
                      <Text style={styles.gestureSignLetter}>{sign.sign}</Text>
                    </View>
                    <Pressy onPress={() => setShowHint(!showHint)} style={styles.hintButton} scaleTo={0.94}>
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          stroke={showHint ? '#F59E0B' : '#94A3B8'}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                      <Text style={[styles.hintButtonText, { color: showHint ? '#F59E0B' : '#94A3B8' }]}>
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </Text>
                    </Pressy>
                    {showHint && (
                      <View style={styles.hintContainer}>
                        <Text style={styles.hintText}>{sign.hint}</Text>
                      </View>
                    )}
                  </>
                )}
                {phase === 'detecting' && (
                  <>
                    <View style={styles.gestureLetterBadge}>
                      <Text style={styles.gestureSignLetter}>{sign.sign}</Text>
                    </View>
                    <Text style={styles.gestureDetectingText}>SCANNING</Text>
                    <Text style={styles.gestureDetectingSub}>Hold still — I'm checking your hand...</Text>
                  </>
                )}
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={[styles.gestureBottomPanel, { paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.gestureSignInfo}>
            <View style={styles.gestureSignEmojiContainer}>
              <Text style={styles.gestureSignEmojiSmall}>{sign.sign}</Text>
            </View>
            <View style={styles.gestureSignText}>
              <Text style={styles.gestureSignName}>Sign {sign.sign}</Text>
              {feedbackMessage ? (
                <Text
                  style={[
                    styles.gestureSignFeedback,
                    { color: phase === 'success' ? '#22C55E' : phase === 'fail' ? '#EF4444' : '#6B7280' },
                  ]}
                >
                  {feedbackMessage}
                </Text>
              ) : (
                <Text style={styles.gestureSignHint}>Show the sign to the camera</Text>
              )}
            </View>
            <Image source={images.senyaBlue} style={styles.gestureMascot} resizeMode="contain" />
          </View>

          {phase === 'ready' && (
            <Animated.View
              style={{
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 16,
                elevation: 8,
                shadowOpacity: ctaGlow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.5] }),
              }}
            >
              <Pressy
                onPress={startDetection}
                disabled={!cameraReady}
                style={[styles.gestureStartBtn, !cameraReady && styles.gestureStartBtnDisabled]}
              >
                <LinearGradient
                  colors={!cameraReady ? ['#94A3B8', '#64748B'] : ['#2563EB', '#1E3FAE']}
                  style={styles.gestureStartGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Circle cx="12" cy="13" r="4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.gestureStartBtnText}>
                    {!cameraReady ? 'Initializing Camera...' : 'Start Detection'}
                  </Text>
                </LinearGradient>
              </Pressy>
            </Animated.View>
          )}

          {phase === 'detecting' && (
            <Pressy style={styles.gestureCancelBtn} onPress={() => setPhase('ready')} scaleTo={0.97}>
              <Text style={styles.gestureCancelBtnText}>Cancel</Text>
            </Pressy>
          )}
        </View>

        {showFullScreenResult && (
          <Animated.View style={[styles.fullScreenResult, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={phase === 'success' ? ['rgba(34,197,94,0.95)', 'rgba(16,185,129,0.95)'] : ['rgba(239,68,68,0.95)', 'rgba(220,38,38,0.95)']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            <View style={styles.fullScreenContent}>
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 0.3, 0.6, 1],
                        outputRange: [0.5, 1.2, 0.9, 1],
                      }),
                    },
                  ],
                }}
              >
                {phase === 'success' ? (
                  <View style={styles.fullScreenIconContainer}>
                    <View style={styles.fullScreenIconCircle}>
                      <CheckCircle size={64} color="#FFFFFF" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.fullScreenIconContainer}>
                    <View style={[styles.fullScreenIconCircle, styles.fullScreenIconCircleFail]}>
                      <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
                        <Line x1="18" y1="6" x2="6" y2="18" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
                        <Line x1="6" y1="6" x2="18" y2="18" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
                      </Svg>
                    </View>
                  </View>
                )}
              </Animated.View>

              <Text style={styles.fullScreenTitle}>{phase === 'success' ? 'Correct!' : 'Not quite — try again!'}</Text>

              {phase === 'success' ? (
                <>
                  <Text style={styles.fullScreenSub}>Great job! Moving to next sign...</Text>
                  <View style={styles.fullScreenProgressBarContainer}>
                    <Animated.View
                      style={[
                        styles.fullScreenProgressFill,
                        {
                          transform: [
                            {
                              scaleX: fadeAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 0.5, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.fullScreenSub}>Try again! You can do this!</Text>
                  <Pressy style={styles.fullScreenRetryButton} onPress={handleRetry}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                      style={styles.fullScreenRetryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path d="M4 4.5v5h5M20 19.5v-5h-5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <Path d="M4.7 14.5A8 8 0 0 0 19 9M19.3 9.5A8 8 0 0 0 5 15" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                      <Text style={styles.fullScreenRetryText}>Try Again</Text>
                    </LinearGradient>
                  </Pressy>
                </>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    );
  }

  // ── Scoreboard Screen ──
  if (screen === 'scoreboard') {
    return (
      <ScoreboardScreen
        score={score}
        total={GESTURE_SIGNS.length}
        time={timeSpent}
        onContinue={resetPractice}
      />
    );
  }

  return null;
}

// ── Styles ──
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#BFE0F7' },

  // ── Blobs ──
  blobContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 9999 },
  blob1: { width: 300, height: 300, top: -100, right: -100, backgroundColor: 'rgba(37, 99, 235, 0.04)' },
  blob2: { width: 200, height: 200, bottom: 100, left: -80, backgroundColor: 'rgba(245, 158, 11, 0.05)' },
  blob3: { width: 150, height: 150, top: '40%', right: -50, backgroundColor: 'rgba(124, 58, 237, 0.04)' },

  // ── Glass Card ──
  glassWrap: {
    borderRadius: 20,
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
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
  },
  glassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    opacity: 0.55,
  },
  glassBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },

  // ── Ambient ──
  ambientOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: H_PADDING,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerMascot: {
    width: 34,
    height: 34,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.ink,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  streakPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },

  // ── Hero ──
  heroCard: {
    padding: 16,
    marginBottom: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  heroTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  heroTipIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(245,158,11,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  heroSub: {
    fontSize: 12,
    color: '#4B7BBB',
    lineHeight: 18,
    flex: 1,
  },
  heroImage: {
    width: 60,
    height: 60,
    marginLeft: 12,
  },

  // ── Stats Row ──
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 14,
    marginBottom: 20,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontSize: 17, fontWeight: '900', color: C.ink, marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: '600', color: C.slate },
  statDivider: { width: 1, height: 30, backgroundColor: C.border },

  // ── Section Labels ──
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionLabelBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  sectionLabelText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Large Cards ──
  largeRow: {
    flexDirection: 'row',
    gap: LARGE_GAP,
    marginBottom: 24,
  },
  largeCard: {
    borderWidth: 2,
    overflow: 'hidden',
  },
  largeCardGradient: {
    padding: 16,
    minHeight: 180,
  },
  largeCardCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  largeCardProgress: {
    fontSize: 11,
    fontWeight: '800',
    color: C.success,
  },
  largeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  largeIcon: { width: 32, height: 32 },
  largeCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  largeCardDescription: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#565E80',
    lineHeight: 17,
    marginBottom: 14,
    flexGrow: 1,
  },
  largeCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  largeCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  largeCardMetaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#565E80',
  },
  largeCardArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Small Cards ──
  smallRow: {
    flexDirection: 'row',
    gap: SMALL_GAP,
    marginBottom: 22,
  },
  smallCard: {
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  smallCardInner: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
  },
  smallCardLock: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  smallCardProgress: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  smallCardProgressText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.success,
  },
  smallIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  smallIcon: { width: 24, height: 24 },
  smallCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
  },
  smallCardMetaText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#565E80',
  },

  // ── Tip Card ──
  tipCard: {
    padding: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipTextContainer: { flex: 1 },
  tipTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.ink,
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: C.slate,
    lineHeight: 19,
  },

  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,22,53,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#4B7BBB',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(17,24,39,0.05)',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  modalAcceptButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalAcceptGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalAcceptText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cameraModalIconContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  cameraModalIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Gesture Screen ──
  gestureContainer: {
    flex: 1,
    backgroundColor: '#BFE0F7',
  },
  gestureTopBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30,58,138,0.08)',
  },
  gestureBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30,58,138,0.1)',
  },
  gestureProgress: {
    flex: 1,
  },
  gestureDots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  gestureDot: {
    height: 8,
    borderRadius: 999,
  },
  gestureProgressRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gestureProgressText: {
    fontSize: 11,
    color: '#4B7BBB',
    fontWeight: '600',
  },
  gestureLiveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  gestureLiveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gestureLiveText: {
    fontSize: 10,
    color: '#4B7BBB',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gestureFrameWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gestureFrameOuter: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 3 / 4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  senyaOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  senyaOverlayImage: {
    width: 50,
    height: 50,
  },
  gestureFrame: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
    borderRadius: 4,
  },
  gestureCornerTL: { top: 12, left: 12, borderBottomWidth: 0, borderRightWidth: 0 },
  gestureCornerTR: { top: 12, right: 12, borderBottomWidth: 0, borderLeftWidth: 0 },
  gestureCornerBL: { bottom: 12, left: 12, borderTopWidth: 0, borderRightWidth: 0 },
  gestureCornerBR: { bottom: 12, right: 12, borderTopWidth: 0, borderLeftWidth: 0 },
  gestureFrameLabel: {
    position: 'absolute',
    top: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 5,
  },
  gestureFrameLabelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  gestureScanLine: {
    position: 'absolute',
    left: 30,
    right: 30,
    height: 3,
    borderRadius: 2,
    opacity: 0.6,
  },
  gestureFrameCenter: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.32)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  gestureLetterBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureSignLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 4,
  },
  hintButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  hintContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxWidth: 280,
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  gestureDetectingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 3,
  },
  gestureDetectingSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  gestureBottomPanel: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(30,58,138,0.08)',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  gestureSignInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(30,58,138,0.05)',
  },
  gestureSignEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30,58,138,0.08)',
  },
  gestureSignEmojiSmall: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  gestureSignText: {
    flex: 1,
  },
  gestureSignName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  gestureSignFeedback: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  gestureSignHint: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
  gestureMascot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,58,138,0.05)',
  },
  gestureStartBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gestureStartBtnDisabled: {
    opacity: 0.6,
  },
  gestureStartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  gestureStartBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  gestureCancelBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(30,58,138,0.1)',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  gestureCancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },

  // ── Full Screen Result ──
  fullScreenResult: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  fullScreenContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  fullScreenTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  fullScreenSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  fullScreenIconContainer: {
    marginBottom: 8,
  },
  fullScreenIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fullScreenIconCircleFail: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  fullScreenProgressBarContainer: {
    width: '100%',
    maxWidth: 200,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 12,
  },
  fullScreenProgressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  fullScreenRetryButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fullScreenRetryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  fullScreenRetryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Scoreboard ──
  scoreboardContainer: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    overflow: 'hidden',
  },
  scoreboardScrollView: {
    flex: 1,
  },
  scoreboardContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  scoreboardCard: {
    width: '100%',
    maxWidth: 400,
  },
  scoreboardGlass: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scoreboardSenya: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreTrophyIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreTotal: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  performanceMessage: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rankingContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  rankingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  rankingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rankingRow: {
    alignItems: 'center',
    gap: 8,
  },
  rankingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 4,
  },
  rankingBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  rankingSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  rankProgressContainer: {
    marginTop: 12,
    width: '100%',
  },
  rankProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  rankProgressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    transformOrigin: 'left',
  },
  rankProgressText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
  rankListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    marginBottom: 6,
  },
  rankListHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  rankListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  topRankItem: {
    backgroundColor: 'rgba(245,158,11,0.14)',
  },
  userRankItem: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  rankListPosition: {
    width: 50,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  rankListName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  rankListScore: {
    width: 60,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  rankListTime: {
    width: 70,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  userRankText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  topRankText: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  scoreboardContinueBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreboardContinueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  scoreboardContinueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});