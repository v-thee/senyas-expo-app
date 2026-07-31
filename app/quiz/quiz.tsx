// app/quiz/quiz.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Images ──
const images = {
  senyasLogo: require('@/assets/images/senyas_logo.png'),
  level1: require('@/assets/images/level_1.png'),
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

// ── Layout math for the bento grid ──
const H_PADDING = 20;
const CONTENT_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const LARGE_GAP = 14;
const SMALL_GAP = 10;
const LARGE_CARD_WIDTH = (CONTENT_WIDTH - LARGE_GAP) / 2;
const SMALL_CARD_WIDTH = (CONTENT_WIDTH - SMALL_GAP * 2) / 3;

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

// ── Quiz Categories ──
interface QuizCategory {
  id: string;
  title: string;
  tag?: string;
  description: string;
  icon: any;
  questionCount: number;
  color: string;
  bgColor: string;
  completed?: boolean;
  variant: 'feature' | 'large' | 'small';
  lessonId: number;
}

// Order matches visual order: featured banner first, then two large cards,
// then a row of three compact cards.
const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Exam',
    tag: 'Final Challenge',
    description: 'Full assessment covering every topic you\'ve learned so far',
    icon: images.multipleChoice,
    questionCount: 30,
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    completed: false,
    variant: 'feature',
    lessonId: 0,
  },
  {
    id: 'alphabet',
    title: 'Alphabet',
    description: 'FSL alphabet letters A–Z',
    icon: images.alphabet,
    questionCount: 26,
    color: C.royal,
    bgColor: C.royal + '22',
    completed: false,
    variant: 'large',
    lessonId: 1,
  },
  {
    id: 'greetings',
    title: 'Greetings',
    description: 'Common greetings & polite phrases',
    icon: images.greet,
    questionCount: 15,
    color: C.goldDeep,
    bgColor: C.goldDeep + '22',
    completed: false,
    variant: 'large',
    lessonId: 4,
  },
  {
    id: 'numbers',
    title: 'Numbers',
    description: 'Numbers 1–10',
    icon: images.numbers,
    questionCount: 10,
    color: '#16A34A',
    bgColor: 'rgba(22, 163, 74, 0.15)',
    completed: false,
    variant: 'small',
    lessonId: 3,
  },
  {
    id: 'introductions',
    title: 'Intros',
    description: 'Introducing yourself',
    icon: images.book,
    questionCount: 12,
    color: C.sky,
    bgColor: C.sky + '22',
    completed: false,
    variant: 'small',
    lessonId: 5,
  },
  {
    id: 'courtesy',
    title: 'Courtesy',
    description: 'Polite signs & responses',
    icon: images.badges,
    questionCount: 10,
    color: C.success,
    bgColor: C.success + '22',
    completed: false,
    variant: 'small',
    lessonId: 6,
  },
];

const TOTAL_QUESTIONS = QUIZ_CATEGORIES.reduce((sum, c) => sum + c.questionCount, 0);
const COMPLETED_COUNT = QUIZ_CATEGORIES.filter((c) => c.completed).length;

// ── Main Component ──
export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const cardAnims = useRef(QUIZ_CATEGORIES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.stagger(
        70,
        cardAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 60,
            friction: 9,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const handleStartQuiz = (category: QuizCategory) => {
    setSelectedCategory(category);
    setShowQuiz(true);
  };

  const handleBack = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  const cardAnimStyle = (index: number) => ({
    opacity: cardAnims[index],
    transform: [
      {
        translateY: cardAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
      {
        scale: cardAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1],
        }),
      },
    ],
  });

  // ── Featured banner card ──
  const renderFeatureCard = (category: QuizCategory, index: number) => (
    <Animated.View style={cardAnimStyle(index)} key={category.id}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => handleStartQuiz(category)}>
        <View style={styles.featureCard}>
          <LinearGradient
            colors={['#2B1A63', '#4A2E9C', '#6C3FCF']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.featureRing1} />
          <View style={styles.featureRing2} />

          <View style={styles.featureTopRow}>
            <View style={styles.featureTagPill}>
              <SparkleIcon size={12} color="#FFD86B" />
              <Text style={styles.featureTagText}>{category.tag}</Text>
            </View>
            <View style={styles.featureQPill}>
              <Text style={styles.featureQPillText}>{category.questionCount} Qs</Text>
            </View>
          </View>

          <View style={styles.featureBody}>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>{category.title}</Text>
              <Text style={styles.featureDescription} numberOfLines={2}>
                {category.description}
              </Text>
              <View style={styles.featureCta}>
                <Text style={styles.featureCtaText}>Start now</Text>
                <ArrowRight size={16} color={C.deepBlue} />
              </View>
            </View>
            <View style={styles.featureIconContainer}>
              <Image source={category.icon} style={styles.featureIcon} resizeMode="contain" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // ── Large 2-column card ──
  const renderLargeCard = (category: QuizCategory, index: number) => (
    <Animated.View style={[cardAnimStyle(index), { width: LARGE_CARD_WIDTH }]} key={category.id}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => handleStartQuiz(category)}>
        <GlassCard style={[styles.largeCard, { borderColor: category.color + '55' }]} intensity={30}>
          <LinearGradient
            colors={[category.bgColor, 'rgba(255,255,255,0.25)']}
            style={styles.largeCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {category.completed && (
              <View style={styles.largeCardCheck}>
                <CheckCircle size={18} color={C.success} />
              </View>
            )}
            <View style={[styles.largeIconContainer, { backgroundColor: category.bgColor }]}>
              <Image source={category.icon} style={styles.largeIcon} resizeMode="contain" />
            </View>
            <Text style={[styles.largeCardTitle, { color: category.color }]}>{category.title}</Text>
            <Text style={styles.largeCardDescription} numberOfLines={2}>
              {category.description}
            </Text>
            <View style={styles.largeCardFooter}>
              <View style={styles.largeCardMeta}>
                <Clock size={12} color={C.slate} />
                <Text style={styles.largeCardMetaText}>{category.questionCount} questions</Text>
              </View>
              <View style={[styles.largeCardArrow, { backgroundColor: category.color }]}>
                <ArrowRight size={14} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  // ── Small 3-column card ──
  const renderSmallCard = (category: QuizCategory, index: number) => (
    <Animated.View style={[cardAnimStyle(index), { width: SMALL_CARD_WIDTH }]} key={category.id}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => handleStartQuiz(category)}>
        <GlassCard style={[styles.smallCard, { borderColor: category.color + '40' }]} intensity={30}>
          <View style={styles.smallCardInner}>
            {category.completed && (
              <View style={styles.smallCardCheck}>
                <CheckCircle size={14} color={C.success} />
              </View>
            )}
            <View style={[styles.smallIconContainer, { backgroundColor: category.bgColor }]}>
              <Image source={category.icon} style={styles.smallIcon} resizeMode="contain" />
            </View>
            <Text style={[styles.smallCardTitle, { color: category.color }]} numberOfLines={1}>
              {category.title}
            </Text>
            <Text style={styles.smallCardMetaText}>{category.questionCount} Qs</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  // ── Render Quiz (calls QuizMC component) ──
  const renderQuiz = () => {
    const QuizMC = require('./QuizMC').default;
    const lessonId = selectedCategory?.lessonId || 0;

    return (
      <QuizMC
        lessonIdParam={lessonId}
        onExit={() => {
          setShowQuiz(false);
          setSelectedCategory(null);
        }}
      />
    );
  };

  // ── Render Quiz Selection ──
  const renderQuizSelection = () => {
    const featureCategory = QUIZ_CATEGORIES.find((c) => c.variant === 'feature')!;
    const largeCategories = QUIZ_CATEGORIES.filter((c) => c.variant === 'large');
    const smallCategories = QUIZ_CATEGORIES.filter((c) => c.variant === 'small');

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
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <ArrowLeft size={26} color={C.royal} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Image source={images.senyasLogo} style={styles.headerMascot} resizeMode="contain" />
              <Text style={styles.pageTitle}>Choose a Quiz</Text>
            </View>
          </View>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        >
          <Text style={styles.subtitle}>
            Pick a topic below — every quiz shuffles its questions, so there's always a fresh challenge.
          </Text>

          {/* Stats strip */}
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <BookOpenIcon size={16} color={C.royal} />
              <Text style={styles.statValue}>{QUIZ_CATEGORIES.length}</Text>
              <Text style={styles.statLabel}>Topics</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <TargetIcon size={16} color={C.goldDeep} />
              <Text style={styles.statValue}>{TOTAL_QUESTIONS}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <Trophy size={16} color={C.success} />
              <Text style={styles.statValue}>{COMPLETED_COUNT}/{QUIZ_CATEGORIES.length}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>

          {/* Featured banner */}
          {renderFeatureCard(featureCategory, QUIZ_CATEGORIES.indexOf(featureCategory))}

          {/* Section label */}
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionLabelBar} />
            <Text style={styles.sectionLabelText}>Core Topics</Text>
          </View>

          {/* Large 2-up row */}
          <View style={styles.largeRow}>
            {largeCategories.map((c) => renderLargeCard(c, QUIZ_CATEGORIES.indexOf(c)))}
          </View>

          {/* Section label */}
          <View style={styles.sectionLabelRow}>
            <View style={[styles.sectionLabelBar, { backgroundColor: C.success }]} />
            <Text style={styles.sectionLabelText}>Quick Practice</Text>
          </View>

          {/* Small 3-up row */}
          <View style={styles.smallRow}>
            {smallCategories.map((c) => renderSmallCard(c, QUIZ_CATEGORIES.indexOf(c)))}
          </View>

          <GlassCard style={styles.tipCard} intensity={30}>
            <View style={styles.tipContent}>
              <Trophy size={22} color={C.gold} />
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>Quiz Tip</Text>
                <Text style={styles.tipDescription}>
                  Take your time with each question — you can review answers before submitting.
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.ScrollView>
      </View>
    );
  };

  // ── Main Render ──
  if (showQuiz) {
    return renderQuiz();
  }

  return renderQuizSelection();
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
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  header: { paddingHorizontal: 20, paddingBottom: 12, backgroundColor: 'transparent' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerMascot: { width: 34, height: 34 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: C.ink, flexShrink: 1 },

  scrollContent: { paddingHorizontal: H_PADDING, paddingTop: 8 },

  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: C.slate,
    marginBottom: 18,
    lineHeight: 22,
  },

  // ── Stats strip ──
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

  // ── Section labels ──
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 },
  sectionLabelBar: { width: 4, height: 16, borderRadius: 2, backgroundColor: C.royal },
  sectionLabelText: { fontSize: 13, fontWeight: '800', color: C.slate, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Featured banner card ──
  featureCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#2B1A63',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
    minHeight: 150,
  },
  featureRing1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    top: -60,
    right: -40,
  },
  featureRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -50,
    right: 10,
  },
  featureTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featureTagText: { fontSize: 11, fontWeight: '800', color: '#FFD86B', letterSpacing: 0.3 },
  featureQPill: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featureQPillText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  featureBody: { flexDirection: 'row', alignItems: 'center' },
  featureTextCol: { flex: 1, paddingRight: 12 },
  featureTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  featureDescription: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginBottom: 14 },
  featureCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD86B',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  featureCtaText: { fontSize: 13, fontWeight: '800', color: C.deepBlue },
  featureIconContainer: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { width: 48, height: 48 },

  // ── Large 2-up cards ──
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
  largeCardCheck: { position: 'absolute', top: 12, right: 12, zIndex: 2 },
  largeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  largeIcon: { width: 32, height: 32 },
  largeCardTitle: { fontSize: 17, fontWeight: '900', marginBottom: 4 },
  largeCardDescription: { fontSize: 12.5, fontWeight: '500', color: C.slate, lineHeight: 17, marginBottom: 14, flexGrow: 1 },
  largeCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  largeCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  largeCardMetaText: { fontSize: 11, fontWeight: '700', color: C.slate },
  largeCardArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Small 3-up cards ──
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
  },
  smallCardCheck: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  smallIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  smallIcon: { width: 24, height: 24 },
  smallCardTitle: { fontSize: 12.5, fontWeight: '800', marginBottom: 2, textAlign: 'center' },
  smallCardMetaText: { fontSize: 10.5, fontWeight: '600', color: C.slate },

  // ── Tip card ──
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
});