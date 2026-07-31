import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  Easing,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Import images from assets
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

// ── Icons (Feather-style outlines, no emoji) ──

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

function ArrowRightIcon({ size = 16, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
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

function ZapIcon({ size = 16, color = '#FFD93D' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

function PlayIcon({ size = 16, color = '#1E3FAE' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 3l14 9-14 9V3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function AwardIcon({ size = 16, color = '#7C3AED' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="6" stroke={color} strokeWidth={2} />
      <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UserIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
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

// ── Types ──
interface LearningProgress {
  category_id: string;
  label: string;
  icon: any;
  progress: number;
  status: 'locked' | 'active' | 'done';
  chipColor: string;
  textColor: string;
  bgColor: string;
}

type PracticeItem = {
  img: any;
  label: string;
  gradient: readonly [string, string];
  route?: string;
};

const PRACTICE_ITEMS: PracticeItem[] = [
  { 
    img: images.multipleChoice, 
    label: 'Multiple Choice', 
    gradient: ['#2563EB', '#1E3FAE'] as const,
    route: '/quiz/quiz' 
  },
  { 
    img: images.dragNdrop, 
    label: 'Drag & Drop', 
    gradient: ['#7C3AED', '#5B21B6'] as const, 
    route: '/quiz/DragNDrop'
  },
  { 
    img: images.camera, 
    label: 'Gesture Cam', 
    gradient: ['#EC4899', '#BE185D'] as const 
  },
  { 
    img: images.badges, 
    label: 'My Badges', 
    gradient: ['#F59E0B', '#D97706'] as const 
  },
];

// ── Map category to icon and colors ──
const CATEGORY_MAP: Record<string, { icon: any; chipColor: string; textColor: string; bgColor: string; label: string }> = {
  'alphabet': {
    icon: images.alphabet,
    chipColor: '#DBEAFE',
    textColor: '#2563EB',
    bgColor: 'rgba(37, 99, 235, 0.04)',
    label: 'FSL Alphabet'
  },
  'greetings': {
    icon: images.greet,
    chipColor: '#FCE7F3',
    textColor: '#DB2777',
    bgColor: 'rgba(219, 39, 119, 0.04)',
    label: 'Greetings'
  },
  'numbers': {
    icon: images.numbers,
    chipColor: '#DCFCE7',
    textColor: '#16A34A',
    bgColor: 'rgba(22, 163, 74, 0.04)',
    label: 'Numbers'
  },
  'introductions': {
    icon: images.book,
    chipColor: '#E0F2FE',
    textColor: '#0284C7',
    bgColor: 'rgba(2, 132, 199, 0.04)',
    label: 'Introductions'
  },
  'courtesy': {
    icon: images.book,
    chipColor: '#D1FAE5',
    textColor: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.04)',
    label: 'Courtesy'
  },
};

// ── Daily Challenge Data ──
const DAILY_CHALLENGES = [
  { id: 1, title: 'Practice 5 Alphabet Signs', description: 'Sign A through E and earn your daily streak bonus.', total: 6, completed: 0 },
  { id: 2, title: 'Greeting Practice', description: 'Sign Hello, Good Morning, and Goodbye.', total: 3, completed: 0 },
  { id: 3, title: 'Number Signs', description: 'Sign numbers 1 through 10.', total: 10, completed: 0 },
];

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [userId, setUserId] = useState<number>(1);
  const [userName, setUserName] = useState<string>('Student');
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelProgress, setLevelProgress] = useState<number>(0);
  const [totalLessonsDone, setTotalLessonsDone] = useState<number>(0);
  const [totalLessons, setTotalLessons] = useState<number>(15);
  const [dailyChallenge, setDailyChallenge] = useState(DAILY_CHALLENGES[0]);
  const [streakCount, setStreakCount] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const mascotFloat = useRef(new Animated.Value(0)).current;
  const mascotTilt = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Load user data and progress
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user from storage
        const userJson = await AsyncStorage.getItem('user');
        let currentUserId = 1;
        if (userJson) {
          const user = JSON.parse(userJson);
          currentUserId = user.id || 1;
          setUserId(currentUserId);
          // Set user name - use firstName if available, fallback to 'Student'
          if (user.firstName) {
            setUserName(user.firstName);
          } else if (user.name) {
            setUserName(user.name.split(' ')[0]); // Get first name from full name
          }
        }

        // Fetch lesson progress
        const result = await apiRequest('getLessonProgress', 'GET', { user_id: currentUserId });
        const progressData = result.progress || [];

        // Calculate progress per category
        const categoryProgress: Record<string, { done: number; total: number }> = {};
        let totalDone = 0;
        let totalLessonsCount = 0;

        // Get all categories from the map
        const categories = Object.keys(CATEGORY_MAP);
        
        // Initialize category progress
        categories.forEach(catId => {
          categoryProgress[catId] = { done: 0, total: 0 };
        });

        // Process progress data
        progressData.forEach((p: any) => {
          if (categoryProgress[p.category_id]) {
            if (p.status === 'done') {
              categoryProgress[p.category_id].done++;
              totalDone++;
            }
            categoryProgress[p.category_id].total++;
            totalLessonsCount++;
          }
        });

        setTotalLessonsDone(totalDone);
        setTotalLessons(totalLessonsCount || 15);

        // Calculate level progress (percentage of total lessons done)
        const totalPossible = 15; // Total lessons across all categories
        const pct = Math.round((totalDone / totalPossible) * 100);
        setLevelProgress(pct);

        // Build learning progress items
        const progressItems: LearningProgress[] = [];

        categories.forEach(catId => {
          const catInfo = CATEGORY_MAP[catId];
          if (!catInfo) return;

          const stats = categoryProgress[catId];
          if (stats && stats.total > 0) {
            const pctComplete = Math.round((stats.done / stats.total) * 100);
            const status = pctComplete === 100 ? 'done' : pctComplete > 0 ? 'active' : 'locked';
            
            progressItems.push({
              category_id: catId,
              label: catInfo.label,
              icon: catInfo.icon,
              progress: pctComplete,
              status: status,
              chipColor: catInfo.chipColor,
              textColor: catInfo.textColor,
              bgColor: catInfo.bgColor,
            });
          }
        });

        // If no progress yet, show the first category with 0%
        if (progressItems.length === 0) {
          const firstCat = CATEGORY_MAP['alphabet'];
          progressItems.push({
            category_id: 'alphabet',
            label: firstCat.label,
            icon: firstCat.icon,
            progress: 0,
            status: 'active',
            chipColor: firstCat.chipColor,
            textColor: firstCat.textColor,
            bgColor: firstCat.bgColor,
          });
        }

        setLearningProgress(progressItems);

        // ── Update Daily Challenge based on progress ──
        // Check which lessons are done in the alphabet category
        const alphabetProgress = progressData.filter((p: any) => p.category_id === 'alphabet');
        const alphabetDone = alphabetProgress.filter((p: any) => p.status === 'done').length;
        
        // Update daily challenge completion
        const updatedChallenge = { ...DAILY_CHALLENGES[0] };
        updatedChallenge.completed = Math.min(alphabetDone, updatedChallenge.total);
        setDailyChallenge(updatedChallenge);

        // ── Fetch streak from user stats ──
        try {
          const statsResult = await apiRequest('getUserStats', 'GET', { user_id: currentUserId });
          if (statsResult.stats && statsResult.stats.current_streak) {
            setStreakCount(statsResult.stats.current_streak);
          }
        } catch (statsError) {
          console.error('Error loading stats:', statsError);
        }

      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback: show default categories
        setLearningProgress([
          {
            category_id: 'alphabet',
            label: 'FSL Alphabet',
            icon: images.alphabet,
            progress: 0,
            status: 'active',
            chipColor: '#DBEAFE',
            textColor: '#2563EB',
            bgColor: 'rgba(37, 99, 235, 0.04)',
          },
          {
            category_id: 'greetings',
            label: 'Greetings',
            icon: images.greet,
            progress: 0,
            status: 'locked',
            chipColor: '#FCE7F3',
            textColor: '#DB2777',
            bgColor: 'rgba(219, 39, 119, 0.04)',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Animate level progress bar when it changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: levelProgress,
      duration: 1200,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [levelProgress]);

  useEffect(() => {
    // Gentle continuous float + wiggle loop for the mascot logo
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(mascotFloat, {
            toValue: -8,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(mascotFloat, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
        Animated.sequence([
          Animated.timing(mascotTilt, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(mascotTilt, {
            toValue: -1,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(mascotTilt, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ])
    ).start();

    // Shimmer for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Pulse animation for start button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const mascotRotate = mascotTilt.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-6deg', '6deg'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  // Navigate to quiz when Multiple Choice is clicked
  const handlePracticePress = (item: PracticeItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  // Navigate to lesson when learning card is clicked
  const handleLearningPress = (categoryId: string) => {
    router.push({
      pathname: '../screens/Lessons',
      params: {
        category: categoryId,
      },
    });
  };

  // Navigate to daily challenge
  const handleDailyChallenge = () => {
    router.push('../screens/Lessons');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#1E3A8A' }}>Loading...</Text>
      </View>
    );
  }

  // Determine level title based on progress
  const getLevelTitle = (progress: number) => {
    if (progress >= 80) return 'Advanced Signer';
    if (progress >= 50) return 'Intermediate Signer';
    if (progress >= 25) return 'Novice Signer';
    return 'Beginner Signer';
  };

  const getLevelXP = (progress: number) => {
    const xp = Math.round((progress / 100) * 500);
    return { current: xp, next: 500 };
  };

  const xpData = getLevelXP(levelProgress);
  const xpProgress = Math.round((xpData.current / xpData.next) * 100);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      {/* Vibrant gradient background */}
      <LinearGradient
        colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs with more color */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
        <View style={[styles.blob, styles.blob4]} />
        <View style={[styles.blob, styles.blob5]} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: 120 },
        ]}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SEÑAS</Text>
            <SparkleIcon size={16} color="#F59E0B" />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <InfoIcon size={17} color="#1E3A8A" />
            </TouchableOpacity>
            <View style={styles.streakPill}>
              <Image source={images.streak} style={styles.streakPillIcon} resizeMode="contain" />
              <Text style={styles.streakPillText}>{streakCount}</Text>
            </View>
            <TouchableOpacity style={styles.iconCircle}>
              <BellIcon size={17} color="#1E3A8A" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Greeting + Level combined glass card with more color ── */}
        <GlassCard style={styles.topCard} intensity={45}>
          {/* Gradient overlay for the greeting section */}
          <LinearGradient
            colors={['rgba(37, 99, 235, 0.06)', 'rgba(245, 158, 11, 0.04)', 'rgba(124, 58, 237, 0.04)']}
            style={styles.greetingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={styles.greetingRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.greetingBadge}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.greetingBadgeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <SparkleIcon size={12} color="#FFFFFF" />
                  <Text style={styles.greetingBadgeText}>Good evening!</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.userNameWrapper}>
                <LinearGradient
                  colors={['#1E3A8A', '#2563EB']}
                  style={styles.userNameGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <UserIcon size={18} color="#FFFFFF" />
                  <Text style={styles.userName}>Hello, {userName}!</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.pillRow}>
                <View style={[styles.badgeContainer, { backgroundColor: '#EFF6FF' }]}>
                  <Image
                    source={images.beginner}
                    style={styles.badgeIcon}
                    resizeMode="contain"
                  />
                  <Text style={[styles.badgeText, { color: '#2563EB' }]}>{getLevelTitle(levelProgress)}</Text>
                </View>
                <View style={[styles.badgeContainer, { backgroundColor: '#FFFBEB' }]}>
                  <Image source={images.streak} style={styles.badgeIcon} resizeMode="contain" />
                  <Text style={[styles.badgeText, { color: '#92400E' }]}>{streakCount} day streak</Text>
                </View>
              </View>
            </View>

            {/* Animated mascot logo */}
            <View style={styles.mascotCircle}>
              <Animated.Image
                source={images.senyasLogo}
                style={[
                  styles.mascotImage,
                  {
                    transform: [
                      { translateY: mascotFloat },
                      { rotate: mascotRotate },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.levelContent}>
            <View style={styles.levelIconWrap}>
              <Image source={images.level1} style={styles.levelIcon} resizeMode="contain" />
            </View>
            <View style={styles.levelProgress}>
              <View style={styles.levelHeader}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>LEVEL 1</Text>
                </View>
                <Text style={styles.levelSubtitle}>{getLevelTitle(levelProgress)}</Text>
                <Text style={styles.percentageTextSmall}>{levelProgress}%</Text>
              </View>
              <View style={styles.xpBarWrap}>
                <Animated.View style={{ width: progressWidth, height: '100%' }}>
                  <LinearGradient
                    colors={['#FFD93D', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.xpBarFill}
                  />
                </Animated.View>
              </View>
              <Text style={styles.xpText}>{xpData.current} / {xpData.next} XP · {xpData.next - xpData.current} XP to {getLevelTitle(Math.min(levelProgress + 25, 100))}</Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Daily Challenge ── */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleDailyChallenge}>
          <LinearGradient
            colors={['#2F6FE0', '#1E3FAE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.challengeCard}
          >
            <View style={styles.challengeTopRow}>
              <View style={styles.challengeTag}>
                <ZapIcon size={14} color="#FFD93D" />
                <Text style={styles.challengeTagText}>DAILY CHALLENGE</Text>
              </View>
              <View style={styles.xpPill}>
                <SparkleIcon size={12} color="#FFD93D" />
                <Text style={styles.xpPillText}>+50 XP</Text>
              </View>
            </View>

            <View style={styles.challengeBody}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.challengeDesc}>{dailyChallenge.title}</Text>
                <Text style={styles.challengeSubDesc}>
                  {dailyChallenge.description}
                </Text>
              </View>
              <View style={styles.challengeIconBox}>
                <Image source={images.book} style={styles.challengeIconImage} resizeMode="contain" />
              </View>
            </View>

            <View style={styles.challengeFooterRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.challengeProgressBar}>
                  <View 
                    style={[
                      styles.challengeProgressFill, 
                      { width: `${Math.round((dailyChallenge.completed / dailyChallenge.total) * 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.challengeProgressText}>
                  {dailyChallenge.completed} of {dailyChallenge.total} completed
                </Text>
              </View>
              
              {/* Glassmorphism Start Button with Pulse */}
              <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
                <GlassCard style={styles.glassStartBtn} intensity={60} tint="light">
                  <LinearGradient
                    colors={['#FFD93D', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.startBtnGradient}
                  >
                    <Text style={styles.startBtnText}>
                      {dailyChallenge.completed === dailyChallenge.total ? 'Done!' : 'Start'}
                    </Text>
                    <PlayIcon size={16} color="#1E3FAE" />
                  </LinearGradient>
                </GlassCard>
              </Animated.View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Continue Learning ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <BookOpenIcon size={18} color="#1E3A8A" />
            <Text style={styles.sectionTitle}>Continue Learning</Text>
          </View>
          <TouchableOpacity 
            style={styles.seeAllBtn}
            onPress={() => router.push('../screens/Lessons')}
          >
            <Text style={styles.seeAll}>See All</Text>
            <ArrowRightIcon size={14} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.learningCards}>
          {learningProgress.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => handleLearningPress(item.category_id)}
              activeOpacity={0.8}
            >
              <GlassCard style={[styles.learningCard, { backgroundColor: item.bgColor }]} intensity={35}>
                <View style={styles.learningCardLeft}>
                  <View style={[styles.iconChip, { backgroundColor: item.chipColor }]}>
                    <Image source={item.icon} style={styles.learningIcon} resizeMode="contain" />
                  </View>
                  <View style={styles.learningInfo}>
                    <Text style={styles.learningTitle}>{item.label}</Text>
                    <View style={[styles.statusPill, { 
                      backgroundColor: item.status === 'done' ? '#D1FAE5' : 
                                     item.status === 'active' ? '#FEF3C7' : '#F3F4F6'
                    }]}>
                      <Text style={[styles.learningStatus, {
                        color: item.status === 'done' ? '#065F46' : 
                               item.status === 'active' ? '#92400E' : '#9CA3AF'
                      }]}>
                        {item.status === 'done' ? 'Completed' : 
                         item.status === 'active' ? 'In Progress' : 'Locked'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.learningProgress}>
                  <Text style={[styles.learningPercent, { color: item.textColor }]}>{item.progress}%</Text>
                  <View style={styles.learningProgressBar}>
                    <View style={[styles.learningProgressFill, { width: `${item.progress}%`, backgroundColor: item.textColor }]} />
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Practice with Glassmorphism ── */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <View style={styles.sectionTitleContainer}>
            <SparkleIcon size={18} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Quick Practice</Text>
          </View>
        </View>

        <View style={styles.quickPracticeGrid}>
          {PRACTICE_ITEMS.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              activeOpacity={0.9}
              onPress={() => handlePracticePress(item)}
            >
              <GlassCard style={styles.practiceItem} intensity={40}>
                <View style={[styles.practiceIconContainer, { backgroundColor: item.gradient[0] + '15' }]}>
                  <Image source={item.img} style={styles.practiceIcon} resizeMode="contain" />
                </View>
                <Text style={styles.practiceLabel}>{item.label}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Achievement Banner ── */}
        <GlassCard style={styles.achievementCard} intensity={40}>
          <LinearGradient
            colors={['rgba(124, 58, 237, 0.1)', 'rgba(124, 58, 237, 0.05)']}
            style={styles.achievementGradient}
          >
            <View style={styles.achievementContent}>
              <View style={styles.achievementIconWrap}>
                <AwardIcon size={24} color="#7C3AED" />
              </View>
              <View style={styles.achievementTextWrap}>
                <Text style={styles.achievementTitle}>Almost There!</Text>
                <Text style={styles.achievementDesc}>Complete {Math.max(0, 15 - totalLessonsDone)} more lessons to unlock the</Text>
                <Text style={styles.achievementBadge}>Silver Achiever Badge</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFE0F7',
  },
  scroll: {
    paddingHorizontal: 20,
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
    top: '30%',
    right: -60,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },
  blob4: {
    width: 200,
    height: 200,
    bottom: 200,
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

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E3A8A',
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
  streakPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },

  // ── Top combined card with more color ──
  topCard: {
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  greetingGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingBadge: {
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  greetingBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greetingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  userNameWrapper: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userNameGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeIcon: {
    width: 13,
    height: 13,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mascotCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 217, 61, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    overflow: 'visible',
  },
  mascotImage: {
    width: 150,
    height: 150,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(17,24,39,0.08)',
    marginVertical: 16,
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  levelIcon: {
    width: 36,
    height: 36,
  },
  levelProgress: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#1E3FAE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  levelSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    flex: 1,
  },
  percentageTextSmall: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  xpBarWrap: {
    backgroundColor: 'rgba(17,24,39,0.08)',
    borderRadius: 20,
    height: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 20,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  // ── Daily Challenge ──
  challengeCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    shadowColor: '#1E3FAE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  challengeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  challengeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  challengeTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFD93D',
  },
  challengeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeDesc: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  challengeSubDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  challengeIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeIconImage: {
    width: 28,
    height: 28,
  },
  challengeFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  challengeProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#FFD93D',
    borderRadius: 3,
  },
  challengeProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },

  // ── Glass Start Button ──
  glassStartBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3FAE',
  },

  // ── Section headers ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },

  // ── Learning cards ──
  learningCards: {
    gap: 12,
    marginBottom: 16,
  },
  learningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  learningCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  learningIcon: {
    width: 30,
    height: 30,
  },
  learningInfo: {
    flex: 1,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  learningStatus: {
    fontSize: 11,
    fontWeight: '700',
  },
  learningProgress: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  learningPercent: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  learningProgressBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(17,24,39,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  learningProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ── Quick Practice with Glassmorphism and Original Images ──
  quickPracticeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  practiceItem: {
    width: (width - 52) / 2,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  practiceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  practiceIcon: {
    width: 45,
    height: 45,
  },
  practiceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },

  // ── Achievement Banner ──
  achievementCard: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: 16,
    borderRadius: 24,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  achievementIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTextWrap: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  achievementBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
    marginTop: 1,
  },
});