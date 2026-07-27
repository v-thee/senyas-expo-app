//referene code for UI, animation, result, etc.
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
  Animated, Easing, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, {
  Path,
  Rect,
  Line,
  Circle,
  Ellipse,
  Defs,
  Stop,
  LinearGradient as SvgGradient,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const images = {
  senyasLogo: require('@/assets/images/senyas_logo.png'),
  beginner: require('@/assets/images/beginner.png'),
  intermediate: require('@/assets/images/intermediate.png'),
  advanced: require('@/assets/images/advanced.png'),
};

interface Props {
  onComplete: (level: string) => void;
}

type Phase = 'preparing' | 'intro' | 'questions' | 'result';

// ── Question data ──
const familiarityOptions = [
  { label: "I've never tried it", value: 'Beginner', icon: require('@/assets/images/never.png') },
  { label: 'I know a few signs', value: 'Beginner', icon: require('@/assets/images/few.png') },
  { label: 'I can hold basic conversations', value: 'Intermediate', icon: require('@/assets/images/conversation.png') },
  { label: 'I am quite experienced', value: 'Advanced', icon: require('@/assets/images/experienced.png') },
];

const goalOptions = [
  { label: 'Alphabet & Numbers', value: 'Alphabet_Numbers', icon: require('@/assets/images/alphabet.png') },
  { label: 'Greetings & Basic Phrases', value: 'Greetings', icon: require('@/assets/images/greet.png') },
  { label: 'Classroom Words', value: 'Classroom_Words', icon: require('@/assets/images/classroom.png') },
  { label: 'Everything', value: 'Everything', icon: require('@/assets/images/everything.png') },
];

const timeOptions = [
  { label: '5–10 minutes', value: '5_10_min', icon: require('@/assets/images/time.png') },
  { label: '15–20 minutes', value: '15_20_min', icon: require('@/assets/images/time.png') },
  { label: '30 minutes', value: '30_min', icon: require('@/assets/images/time.png') },
  { label: '1 hour or more', value: '1_hour_plus', icon: require('@/assets/images/time.png') },
];

const QUESTIONS = [
  { key: 'familiarity', question: 'How familiar are you with Filipino Sign Language?', options: familiarityOptions, accent: '#2563EB', tint: '#DBEAFE', step: 'STEP 1' },
  { key: 'goal', question: 'What would you like to focus on first?', options: goalOptions, accent: '#F59E0B', tint: '#FEF3C7', step: 'STEP 2' },
  { key: 'time', question: 'How much time can you commit each day?', options: timeOptions, accent: '#7C3AED', tint: '#EDE9FE', step: 'STEP 3' },
] as const;

const LEVELS: Record<string, { label: string; color: string; desc: string; badge: string; image: any }> = {
  Beginner: { 
    label: 'Beginner', 
    color: '#2563EB', 
    desc: "Every expert was once a beginner. Let's start your FSL journey from the very beginning!",
    badge: 'STARTING OUT',
    image: images.beginner
  },
  Intermediate: { 
    label: 'Intermediate', 
    color: '#F59E0B', 
    desc: "You've got the basics! Now let's take your signing skills to the next level together!",
    badge: 'GROWING',
    image: images.intermediate
  },
  Advanced: { 
    label: 'Advanced', 
    color: '#7C3AED', 
    desc: "You're already amazing! Let's polish your skills and make you a true FSL master!",
    badge: 'EXCELLING',
    image: images.advanced
  },
};

// ── Icons ──
function ArrowLeftIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon({ size = 18, color = '#2563EB' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ size = 24, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.5 15 9l7 .9-5.1 4.8L18.2 21 12 17.4 5.8 21l1.3-6.3L2 9.9 9 9l3-6.5Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

function SkipIcon({ size = 20, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 4v16l12-8L5 4z" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      <Path d="M19 5v14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function HelpIcon({ size = 28, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M9.5 9a2.5 2.5 0 0 1 4.9.7c0 1.6-2.4 1.8-2.4 3.3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.2" fill={color} />
    </Svg>
  );
}

function TargetIcon({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}

function ClockIcon({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 7v5l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SparkleIcon({ size = 24, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.8" />
      <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.6" />
      <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.6" />
    </Svg>
  );
}

function TrophyIcon({ size = 56, color = '#2563EB' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2v4c0 3.314 2.686 6 6 6s6-2.686 6-6V2H6z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M6 2H4v2c0 1.657 1.343 3 3 3h2M18 2h2v2c0 1.657-1.343 3-3 3h-2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 12v6M9 18h6M12 18v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function RoadmapDotIcon({ size = 24, color = '#2563EB', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} />
      {filled && (
        <Circle cx="12" cy="12" r="3" fill="#fff" />
      )}
    </Svg>
  );
}

function CheckCircleIcon({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Water Ripple Effect ──
function WaterRipple({ size = 60, color = '#2563EB' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <SvgGradient id="rippleGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="50%" stopColor={color} stopOpacity="0.15" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </SvgGradient>
      </Defs>
      <Circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <Circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      <Circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="2" opacity="0.2" />
      <Circle cx="50" cy="50" r="12" fill={color} opacity="0.8" />
    </Svg>
  );
}

// ── Confetti Component (Falling Down) ──
function ConfettiPiece({ 
  color, 
  size, 
  startX, 
  startY,
  duration,
  delay,
  rotationSpeed,
}: { 
  color: string; 
  size: number; 
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  rotationSpeed: number;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 200;
    
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT + 100, duration: duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: randomX, duration: duration * 0.8, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotation, { toValue: rotationSpeed * 360, duration: duration, easing: Easing.linear, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        opacity: opacity,
        transform: [
          { translateX },
          { translateY },
          { rotate: rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
        ],
      }}
    >
      <View style={{ width: size, height: size * 2.5, borderRadius: size / 3, backgroundColor: color }} />
    </Animated.View>
  );
}

function Confetti({ 
  colors = ['#2563EB', '#F59E0B', '#7C3AED', '#EF4444', '#10B981', '#EC4899', '#3B82F6', '#F97316'],
  count = 80,
}: { 
  colors?: string[]; 
  count?: number;
}) {
  const [pieces, setPieces] = useState<Array<{ id: number; color: string; size: number; startX: number; startY: number; duration: number; delay: number; rotationSpeed: number }>>([]);

  useEffect(() => {
    const newPieces = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        startX: Math.random() * SCREEN_WIDTH,
        startY: -50 - Math.random() * 100,
        duration: 3000 + Math.random() * 2000,
        delay: Math.random() * 1500,
        rotationSpeed: 0.5 + Math.random() * 1.5,
      });
    }
    setPieces(newPieces);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
    </View>
  );
}

// ── Glass Card ──
function GlassCard({
  children, style, intensity = 40, blurTint = 'light',
}: { children: React.ReactNode; style?: any; intensity?: number; blurTint?: 'light' | 'dark' | 'default' }) {
  return (
    <View style={[styles.glassWrap, style]}>
      <BlurView intensity={intensity} tint={blurTint} style={StyleSheet.absoluteFill} />
      <View style={styles.glassTint} pointerEvents="none" />
      {children}
    </View>
  );
}

// ── Press Scale ──
function PressScale({
  children, onPress, disabled, style,
}: { children: React.ReactNode; onPress?: () => void; disabled?: boolean; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity activeOpacity={0.9} disabled={disabled} onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Roadmap Component ──
function Roadmap({ currentStep }: { currentStep: number }) {
  const steps = ['Start', 'Question 1', 'Question 2', 'Question 3', 'Result'];
  
  return (
    <View style={styles.roadmapContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View style={styles.roadmapStep}>
            <View style={[
              styles.roadmapDot,
              index <= currentStep && styles.roadmapDotActive,
              index === currentStep && styles.roadmapDotCurrent,
            ]}>
              {index < currentStep ? (
                <CheckCircleIcon size={16} color="#10B981" />
              ) : (
                <Text style={[
                  styles.roadmapDotText,
                  index <= currentStep && styles.roadmapDotTextActive,
                ]}>{index + 1}</Text>
              )}
            </View>
            <Text style={[
              styles.roadmapLabel,
              index <= currentStep && styles.roadmapLabelActive,
            ]}>{step}</Text>
          </View>
          {index < steps.length - 1 && (
            <View style={[
              styles.roadmapLine,
              index < currentStep && styles.roadmapLineActive,
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Preparing Screen: Ring + Water Ripple ──
function PreparingScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  const RADIUS = 72;
  const STROKE = 4;
  const CIRC = 2 * Math.PI * RADIUS;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }),
    ]).start();

    Animated.timing(ringProgress, {
      toValue: 1,
      duration: 1500,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      Animated.parallel([
        Animated.spring(rippleScale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 10 }),
        Animated.timing(rippleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    });

    Animated.timing(progressAnim, { toValue: 100, duration: 5000, easing: Easing.linear, useNativeDriver: false }).start();

    const bounceDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
          Animated.delay(400),
        ])
      );
    Animated.parallel([bounceDot(dot1, 0), bounceDot(dot2, 150), bounceDot(dot3, 300)]).start();

    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, []);

  const dashOffset = ringProgress.interpolate({ inputRange: [0, 1], outputRange: [CIRC, 0] });
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#091186', '#2311c4', '#9cc2e7']} style={StyleSheet.absoluteFill} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} />
      
      {/* Decorative blobs */}
      <View style={[styles.decCircle, styles.decCircle1]} />
      <View style={[styles.decCircle, styles.decCircle2]} />
      <View style={[styles.decCircle, styles.decCircle3]} />
      
      <View style={[styles.centered, { paddingTop: insets.top + 24 }]}>
        <View style={styles.ringStage}>
          <Svg width={168} height={168} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={84} cy={84} r={RADIUS} stroke="rgba(255,255,255,0.15)" strokeWidth={STROKE} fill="none" />
            <AnimatedCircle
              cx={84}
              cy={84}
              r={RADIUS}
              stroke="#FFD93D"
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
            />
          </Svg>

          <Animated.View style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image source={images.senyasLogo} style={styles.prepLogo} resizeMode="contain" />
          </Animated.View>

          <Animated.View style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          }}>
            <WaterRipple size={55} color="#FFD93D" />
          </Animated.View>
        </View>

        <Text style={styles.prepTitle}>Setting things up</Text>
        <Text style={styles.prepBody}>Building your personalized assessment…</Text>

        <View style={styles.progressWrapper}>
          <View style={styles.progressBarTrack}>
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
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }], opacity: 0.4 }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }], opacity: 0.4 }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }], opacity: 0.4 }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Skip Confirmation Modal ──
function SkipModal({ visible, onCancel, onConfirm }: { visible: boolean; onCancel: () => void; onConfirm: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.9);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <Animated.View style={{ opacity: fade, transform: [{ scale }], width: '100%', maxWidth: 380 }}>
        <GlassCard style={styles.modalCard} intensity={60} blurTint="light">
          <View style={styles.modalIconWrap}>
            <HelpIcon size={28} color="#F59E0B" />
          </View>
          <Text style={styles.modalTitle}>Skip this quiz?</Text>
          <Text style={styles.modalBody}>
            This short quiz helps us pick lessons that are just right for you. If you skip, we'll start you at the very beginning.
          </Text>

          <PressScale onPress={onCancel} style={{ width: '100%' }}>
            <LinearGradient colors={['#2F6FE0', '#1E3FAE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalPrimaryBtn}>
              <Text style={styles.modalPrimaryText}>Continue Quiz</Text>
            </LinearGradient>
          </PressScale>

          <PressScale onPress={onConfirm} style={{ width: '100%', marginTop: 10 }}>
            <View style={styles.modalGhostBtn}>
              <Text style={styles.modalGhostText}>Skip Anyway</Text>
            </View>
          </PressScale>
        </GlassCard>
      </Animated.View>
    </View>
  );
}

// ── Main Component ──
export default function Assessment({ onComplete }: Props) {
  const insets = useSafeAreaInsets();
  
  const [phase, setPhase] = useState<Phase>('preparing');
  const [current, setCurrent] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pickedLevel, setPickedLevel] = useState<string>('Beginner');
  const [pickedGoal, setPickedGoal] = useState<string>('');
  const [pickedTime, setPickedTime] = useState<string>('');
  const [skipModalVisible, setSkipModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const enterFade = useRef(new Animated.Value(0)).current;
  const enterSlide = useRef(new Animated.Value(20)).current;
  const blobFloat = useRef(new Animated.Value(0)).current;
  const levelFade = useRef(new Animated.Value(0)).current;
  const levelScale = useRef(new Animated.Value(0.8)).current;
  const descFade = useRef(new Animated.Value(0)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const senyaFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterFade.setValue(0);
    enterSlide.setValue(20);
    Animated.parallel([
      Animated.timing(enterFade, { toValue: 1, duration: 450, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(enterSlide, { toValue: 0, duration: 450, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start();
  }, [phase, current]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobFloat, { toValue: 1, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(blobFloat, { toValue: 0, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (phase === 'result') {
      const animations = [
        Animated.parallel([
          Animated.timing(levelFade, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.spring(levelScale, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }),
        ]),
        Animated.timing(descFade, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
        Animated.timing(statsFade, { toValue: 1, duration: 500, delay: 500, useNativeDriver: true }),
        Animated.timing(senyaFade, { toValue: 1, duration: 500, delay: 700, useNativeDriver: true }),
        Animated.timing(buttonFade, { toValue: 1, duration: 400, delay: 900, useNativeDriver: true }),
      ];
      Animated.parallel(animations).start();
    }
  }, [phase]);

  const blobTranslate = blobFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });

  const handleSelect = (value: string, index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    const key = QUESTIONS[current].key;
    if (key === 'familiarity') setPickedLevel(value);
    if (key === 'goal') setPickedGoal(value);
    if (key === 'time') setPickedTime(value);

    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent(c => c + 1);
        setSelectedIndex(null);
      } else {
        setPhase('result');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 500);
  };

  // ── Preparing Screen ──
  if (phase === 'preparing') {
    return <PreparingScreen onDone={() => setPhase('intro')} />;
  }

  // ── Intro Screen ──
  if (phase === 'intro') {
    return (
      <View style={styles.root}>
        <LinearGradient colors={['#E0F2FE', '#F0F9FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />

        <PressScale onPress={() => setSkipModalVisible(true)} style={[styles.skipIconWrap, { top: insets.top + 16 }]}>
          <GlassCard style={styles.skipIconCircle} intensity={60}>
            <SkipIcon size={18} color="#1E3A8A" />
          </GlassCard>
        </PressScale>

        <View style={[styles.centered, { paddingTop: insets.top + 24 }]}>
          <Animated.View style={[styles.blob, styles.blobA, { transform: [{ translateY: blobTranslate }] }]} />
          <Animated.View style={[styles.blob, styles.blobB, { transform: [{ translateY: Animated.multiply(blobTranslate, -1) }] }]} />

          <Animated.View style={{ opacity: enterFade, transform: [{ translateY: enterSlide }], width: '100%', alignItems: 'center' }}>
            <View style={styles.introLogoGlow}>
              <Image source={images.senyasLogo} style={styles.introLogo} resizeMode="contain" />
            </View>

            <GlassCard style={styles.introCard} intensity={45} blurTint="light">
              <View style={styles.introBadge}>
                <StarIcon size={14} color="#F59E0B" />
                <Text style={styles.introBadgeText}>QUICK CHECK</Text>
              </View>

              <Text style={styles.introTitle}>Let's Find Your Level!</Text>
              <Text style={styles.introBody}>
                Answer 3 short questions so we can build a learning path made just for you. There are no wrong answers — just be honest.
              </Text>

              <View style={styles.introMetaRow}>
                <View style={styles.introMetaItem}>
                  <Text style={styles.introMetaValue}>3</Text>
                  <Text style={styles.introMetaLabel}>Questions</Text>
                </View>
                <View style={styles.introMetaDivider} />
                <View style={styles.introMetaItem}>
                  <Text style={styles.introMetaValue}>1 min</Text>
                  <Text style={styles.introMetaLabel}>Time</Text>
                </View>
              </View>

              <PressScale onPress={() => setPhase('questions')} style={{ width: '100%', marginTop: 18 }}>
                <LinearGradient colors={['#2F6FE0', '#1E3FAE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Start Assessment</Text>
                </LinearGradient>
              </PressScale>
            </GlassCard>
          </Animated.View>
        </View>

        <SkipModal
          visible={skipModalVisible}
          onCancel={() => setSkipModalVisible(false)}
          onConfirm={() => {
            setSkipModalVisible(false);
            onComplete('Beginner');
          }}
        />
      </View>
    );
  }

  // ── Result Screen ──
  if (phase === 'result') {
    const resultLevel = LEVELS[pickedLevel] ?? LEVELS.Beginner;
    const goalLabel = goalOptions.find(g => g.value === pickedGoal)?.label ?? '—';
    const timeLabel = timeOptions.find(t => t.value === pickedTime)?.label ?? '—';

    return (
      <View style={styles.root}>
        <LinearGradient colors={['#E0F2FE', '#F0F9FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        
        {showConfetti && <Confetti colors={[resultLevel.color, '#F59E0B', '#7C3AED', '#EF4444', '#10B981', '#EC4899']} count={80} />}
        
        <View style={styles.particleContainer}>
          {[...Array(12)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  opacity: Math.random() * 0.3 + 0.1,
                  backgroundColor: resultLevel.color,
                },
              ]}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={[styles.resultContainer, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: '100%', alignItems: 'center', gap: 16 }}>
            <Animated.View style={{ opacity: levelFade, transform: [{ scale: levelScale }] }}>
              <View style={[styles.resultImageWrap, { borderColor: `${resultLevel.color}40` }]}>
                <Image source={resultLevel.image} style={styles.resultImage} resizeMode="contain" />
                <View style={[styles.resultBadge, { backgroundColor: resultLevel.color }]}>
                  <Text style={styles.resultBadgeText}>{resultLevel.badge}</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: levelFade }}>
              <Text style={[styles.resultLevel, { color: resultLevel.color }]}>
                {resultLevel.label} Level
              </Text>
            </Animated.View>
            
            <Animated.View style={[styles.resultDescWrap, { opacity: descFade }]}>
              <Text style={styles.resultDesc}>{resultLevel.desc}</Text>
            </Animated.View>

            <Animated.View style={[styles.statsRow, { opacity: statsFade }]}>
              <GlassCard style={[styles.statCard, { flex: 1 }]} intensity={35}>
                <TargetIcon size={20} color="#6B7280" />
                <Text style={styles.statLabel}>Focus</Text>
                <Text style={styles.statValue}>{goalLabel}</Text>
              </GlassCard>
              <GlassCard style={[styles.statCard, { flex: 1 }]} intensity={35}>
                <ClockIcon size={20} color="#6B7280" />
                <Text style={styles.statLabel}>Daily</Text>
                <Text style={styles.statValue}>{timeLabel}</Text>
              </GlassCard>
            </Animated.View>

            <Animated.View style={{ opacity: senyaFade, width: '100%' }}>
              <GlassCard style={styles.resultCard} intensity={45}>
                <View style={styles.senyaRow}>
                  <Image source={images.senyasLogo} style={styles.senyaLogo} resizeMode="contain" />
                  <View style={{ flex: 1 }}>
                    <View style={styles.senyaHeader}>
                      <SparkleIcon size={18} color="#F59E0B" />
                      <Text style={styles.senyaLabel}>Senya says</Text>
                    </View>
                    <Text style={styles.senyaQuote}>
                      "Your path is ready! I'll be right beside you the whole way — let's learn FSL together."
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>

            <Animated.View style={{ opacity: buttonFade, width: '100%' }}>
              <PressScale onPress={() => onComplete(resultLevel.label)} style={{ width: '100%' }}>
                <GlassCard style={[styles.glassBtn, { borderColor: `${resultLevel.color}50` }]} intensity={60}>
                  <LinearGradient 
                    colors={[resultLevel.color + 'CC', resultLevel.color]} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 0 }} 
                    style={styles.glassBtnGradient}
                  >
                    <Text style={[styles.glassBtnText, { color: '#fff' }]}>Start My Journey</Text>
                  </LinearGradient>
                </GlassCard>
              </PressScale>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Questions Screen ──
  const q = QUESTIONS[current];
  const roadmapStep = current + 1; // 1-3 for questions

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#E0F2FE', '#F0F9FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={[styles.qHeader, { paddingTop: insets.top + 12 }]}>
        <PressScale onPress={() => (current > 0 ? setCurrent(c => c - 1) : setPhase('intro'))}>
          <GlassCard style={styles.backCircle} intensity={50}>
            <ArrowLeftIcon size={16} color="#1E3A8A" />
          </GlassCard>
        </PressScale>

        <View style={{ flex: 1 }}>
          <View style={[styles.stepPill, { backgroundColor: q.tint }]}>
            <Text style={[styles.stepPillText, { color: q.accent }]}>{q.step} OF {QUESTIONS.length}</Text>
          </View>
        </View>
      </View>

      {/* Roadmap */}
      <View style={styles.roadmapWrapper}>
        <Roadmap currentStep={roadmapStep} />
      </View>

      <ScrollView contentContainerStyle={[styles.qBody, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: enterFade, transform: [{ translateY: enterSlide }] }}>
          <View style={styles.mascotCenter}>
            <View style={[styles.qLogoGlow, { backgroundColor: q.tint }]}>
              <Image source={images.senyasLogo} style={styles.qLogo} resizeMode="contain" />
            </View>
          </View>

          <Text style={styles.qText}>{q.question}</Text>

          {q.options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            return (
              <PressScale key={i} onPress={() => handleSelect(opt.value, i)} disabled={selectedIndex !== null}>
                <GlassCard
                  style={[
                    styles.optBtn,
                    isSelected && { borderColor: q.accent, borderWidth: 2, backgroundColor: `${q.accent}15` }
                  ]}
                  intensity={isSelected ? 55 : 35}
                  blurTint="light"
                >
                  <View style={[styles.optIconBg, { backgroundColor: q.tint }, isSelected && { backgroundColor: q.accent }]}>
                    <Image source={opt.icon} style={styles.optIconImg} resizeMode="contain" />
                  </View>
                  <Text style={[styles.optLabel, isSelected && { color: q.accent, fontWeight: '800' }]}>{opt.label}</Text>
                  {isSelected && (
                    <View style={[styles.optCheckWrap, { backgroundColor: q.accent }]}>
                      <CheckIcon size={14} color="#fff" />
                    </View>
                  )}
                </GlassCard>
              </PressScale>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },

  // ── Glass ──
  glassWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  glassTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.3)' },

  // ── Decorative ──
  decCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decCircle1: { width: 320, height: 320, top: -80, left: -100 },
  decCircle2: { width: 220, height: 220, bottom: 60, right: -60 },
  decCircle3: { width: 140, height: 140, top: '40%', left: -50 },

  // ── Preparing ──
  ringStage: { width: 168, height: 168, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  prepLogo: { width: 90, height: 90 },
  prepTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 2, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  prepBody: { fontSize: 15, fontWeight: '500', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },

  progressWrapper: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: { 
    height: '100%', 
    borderRadius: 20,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  loadingLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginRight: 4, letterSpacing: 0.5 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.4)' },

  // ── Intro ──
  skipIconWrap: { position: 'absolute', left: 20, zIndex: 10 },
  skipIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', borderRadius: 9999 },
  blobA: { width: 260, height: 260, top: '10%', left: -80, backgroundColor: 'rgba(37,99,235,0.05)' },
  blobB: { width: 200, height: 200, bottom: '20%', right: -70, backgroundColor: 'rgba(245,158,11,0.06)' },

  introLogoGlow: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -35,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  introLogo: { width: 90, height: 90 },
  introCard: {
    width: '100%',
    paddingTop: 48,
    paddingHorizontal: 28,
    paddingBottom: 28,
    alignItems: 'center',
  },
  introBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,251,235,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  introBadgeText: { fontSize: 11, fontWeight: '800', color: '#92400E', letterSpacing: 0.8 },
  introTitle: { fontSize: 26, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 10 },
  introBody: { fontSize: 15, fontWeight: '500', color: '#4B5563', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  introMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(37,99,235,0.04)',
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.06)',
  },
  introMetaItem: { flex: 1, alignItems: 'center' },
  introMetaDivider: { width: 1, height: 32, backgroundColor: 'rgba(30,58,138,0.08)' },
  introMetaValue: { fontSize: 18, fontWeight: '900', color: '#1E3A8A' },
  introMetaLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 2 },

  primaryBtn: {
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#1E3FAE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // ── Modal ──
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 20,
  },
  modalCard: { width: '100%', padding: 28, alignItems: 'center', maxWidth: 400 },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,251,235,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  modalTitle: { fontSize: 21, fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  modalBody: { fontSize: 14, fontWeight: '500', color: '#4B5563', textAlign: 'center', lineHeight: 22, marginBottom: 22 },
  modalPrimaryBtn: { borderRadius: 28, paddingVertical: 16, alignItems: 'center', width: '100%' },
  modalPrimaryText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  modalGhostBtn: { borderRadius: 28, paddingVertical: 16, alignItems: 'center' },
  modalGhostText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },

  // ── Result ──
  resultContainer: { 
    flexGrow: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 24, 
    gap: 16,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 999,
  },
  resultImageWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    position: 'relative',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  resultImage: {
    width: 100,
    height: 100,
  },
  resultBadge: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  resultBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  resultLevel: { 
    fontSize: 32, 
    fontWeight: '900', 
    textAlign: 'center',
    marginTop: 4,
  },
  resultDescWrap: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  resultDesc: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: '#4B5563', 
    textAlign: 'center', 
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginVertical: 4,
  },
  statCard: {
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  resultCard: { 
    width: '100%', 
    padding: 24, 
    gap: 18,
    marginVertical: 4,
  },
  senyaRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 16,
  },
  senyaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  senyaLogo: { 
    width: 60, 
    height: 60, 
    marginTop: 2,
  },
  senyaLabel: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#6B7280', 
    letterSpacing: 0.8,
  },
  senyaQuote: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: '#4B5563', 
    lineHeight: 22,
  },
  glassBtn: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glassBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 32,
    width: '100%',
  },
  glassBtnText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Roadmap ──
  roadmapWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  roadmapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roadmapStep: {
    alignItems: 'center',
    gap: 4,
  },
  roadmapDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(30,58,138,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(30,58,138,0.15)',
  },
  roadmapDotActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roadmapDotCurrent: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  roadmapDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AA3AE',
  },
  roadmapDotTextActive: {
    color: '#FFFFFF',
  },
  roadmapLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: '#9AA3AE',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  roadmapLabelActive: {
    color: '#1E3A8A',
  },
  roadmapLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(30,58,138,0.08)',
    marginHorizontal: 4,
  },
  roadmapLineActive: {
    backgroundColor: '#2563EB',
  },

  // ── Questions ──
  qHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 8 },
  backCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  stepPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  stepPillText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },

  qBody: { paddingHorizontal: 20, paddingTop: 8, gap: 14 },
  mascotCenter: { alignItems: 'center', marginBottom: 12 },
  qLogoGlow: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  qLogo: { width: 64, height: 64 },
  qText: { fontSize: 21, fontWeight: '800', color: '#111827', textAlign: 'center', lineHeight: 28, marginBottom: 14 },

  optBtn: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, marginBottom: 10 },
  optIconBg: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optIconImg: { width: 30, height: 30 },
  optLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111827' },
  optCheckWrap: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});