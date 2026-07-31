import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ── Images ──
const images = {
  senyasLogo: require('@/assets/images/senya_magnify.png'),
  badges: require('@/assets/images/badges.png'),
  locked: require('@/assets/images/locked.png'),
  firstStep: require('@/assets/images/first_step.png'),
  alphabetStar: require('@/assets/images/alphabet_star.png'),
  streak1: require('@/assets/images/streak1.png'),
  greetings: require('@/assets/images/greetings.png'),
  beginner: require('@/assets/images/beginner.png'),
  streak: require('@/assets/images/streak.png'),
};

// ── Icons ──
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

function SparkleIcon({ size = 14, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.8" />
      <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.5" />
      <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.5" />
    </Svg>
  );
}

function StarIcon({ size = 16, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.5L15 9l7 .9-5.1 4.8L18.2 21 12 17.4 5.8 21l1.3-6.3L2 9.9 9 9l3-6.5Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon({ size = 16, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
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

// ── Badge Data ──
const BADGE_DATA = [
  { id: 'first_step', label: 'First Step', desc: 'Complete your first lesson', xp: '+10 XP', icon: images.firstStep, earned: true },
  { id: 'greeter', label: 'The Greeter', desc: 'Learn 5 basic greetings', xp: '+20 XP', icon: images.greetings, earned: true },
  { id: 'streak_starter', label: 'Streak Starter', desc: 'Maintain a 3-day streak', xp: '+30 XP', icon: images.streak1, earned: true },
  { id: 'alphabet_star', label: 'Alphabet Star', desc: 'Learn all 26 FSL alphabet signs', xp: '+50 XP', icon: images.alphabetStar, earned: true },
  { id: 'conversation_pro', label: 'Conversation Pro', desc: 'Complete 10 conversation lessons', xp: '+75 XP', icon: images.locked, earned: false },
  { id: 'daily_champion', label: 'Daily Champion', desc: 'Complete 7 daily challenges', xp: '+100 XP', icon: images.locked, earned: false },
  { id: 'vocab_master', label: 'Vocab Master', desc: 'Learn 100 FSL vocabulary words', xp: '+150 XP', icon: images.locked, earned: false },
  { id: 'fsl_legend', label: 'FSL Legend', desc: 'Complete all lessons and challenges', xp: '+250 XP', icon: images.locked, earned: false },
];

const XP_MILESTONES = [
  { label: '50 XP', value: 50, achieved: true },
  { label: '100 XP', value: 100, achieved: true },
  { label: '250 XP', value: 250, achieved: true },
  { label: '500 XP', value: 500, achieved: false },
  { label: '1000 XP', value: 1000, achieved: false },
];

type TabType = 'all' | 'earned' | 'locked';

// ── Galaxy Stars Component ──
function GalaxyStars() {
  const stars = [
    // Large stars
    { cx: 15, cy: 12, r: 2, opacity: 0.9 },
    { cx: 45, cy: 8, r: 2.5, opacity: 0.8 },
    { cx: 75, cy: 15, r: 2, opacity: 0.9 },
    { cx: 90, cy: 30, r: 2, opacity: 0.7 },
    { cx: 30, cy: 45, r: 2.5, opacity: 0.8 },
    { cx: 65, cy: 50, r: 2, opacity: 0.9 },
    { cx: 10, cy: 65, r: 2, opacity: 0.7 },
    { cx: 85, cy: 70, r: 2.5, opacity: 0.8 },
    { cx: 50, cy: 80, r: 2, opacity: 0.9 },
    
    // Medium stars
    { cx: 8, cy: 25, r: 1.5, opacity: 0.6 },
    { cx: 25, cy: 30, r: 1.5, opacity: 0.7 },
    { cx: 55, cy: 22, r: 1.5, opacity: 0.6 },
    { cx: 82, cy: 45, r: 1.5, opacity: 0.7 },
    { cx: 20, cy: 55, r: 1.5, opacity: 0.6 },
    { cx: 70, cy: 62, r: 1.5, opacity: 0.7 },
    { cx: 40, cy: 72, r: 1.5, opacity: 0.6 },
    { cx: 60, cy: 35, r: 1.5, opacity: 0.7 },
    { cx: 5, cy: 50, r: 1.5, opacity: 0.6 },
    { cx: 95, cy: 55, r: 1.5, opacity: 0.6 },
    
    // Small sparkle stars
    { cx: 12, cy: 5, r: 0.8, opacity: 0.5 },
    { cx: 35, cy: 18, r: 0.8, opacity: 0.4 },
    { cx: 50, cy: 5, r: 0.8, opacity: 0.5 },
    { cx: 68, cy: 28, r: 0.8, opacity: 0.4 },
    { cx: 88, cy: 10, r: 0.8, opacity: 0.5 },
    { cx: 18, cy: 38, r: 0.8, opacity: 0.4 },
    { cx: 42, cy: 35, r: 0.8, opacity: 0.5 },
    { cx: 78, cy: 38, r: 0.8, opacity: 0.4 },
    { cx: 58, cy: 58, r: 0.8, opacity: 0.5 },
    { cx: 25, cy: 68, r: 0.8, opacity: 0.4 },
    { cx: 48, cy: 65, r: 0.8, opacity: 0.5 },
    { cx: 75, cy: 78, r: 0.8, opacity: 0.4 },
    { cx: 35, cy: 82, r: 0.8, opacity: 0.5 },
    { cx: 55, cy: 88, r: 0.8, opacity: 0.4 },
    { cx: 10, cy: 80, r: 0.8, opacity: 0.5 },
    { cx: 90, cy: 85, r: 0.8, opacity: 0.4 },
    
    // Extra tiny sparkles
    { cx: 5, cy: 15, r: 0.5, opacity: 0.3 },
    { cx: 20, cy: 10, r: 0.5, opacity: 0.3 },
    { cx: 40, cy: 12, r: 0.5, opacity: 0.3 },
    { cx: 60, cy: 8, r: 0.5, opacity: 0.3 },
    { cx: 80, cy: 20, r: 0.5, opacity: 0.3 },
    { cx: 15, cy: 28, r: 0.5, opacity: 0.3 },
    { cx: 28, cy: 22, r: 0.5, opacity: 0.3 },
    { cx: 48, cy: 28, r: 0.5, opacity: 0.3 },
    { cx: 72, cy: 25, r: 0.5, opacity: 0.3 },
    { cx: 92, cy: 22, r: 0.5, opacity: 0.3 },
    { cx: 8, cy: 42, r: 0.5, opacity: 0.3 },
    { cx: 22, cy: 48, r: 0.5, opacity: 0.3 },
    { cx: 38, cy: 42, r: 0.5, opacity: 0.3 },
    { cx: 52, cy: 48, r: 0.5, opacity: 0.3 },
    { cx: 68, cy: 42, r: 0.5, opacity: 0.3 },
    { cx: 82, cy: 52, r: 0.5, opacity: 0.3 },
    { cx: 95, cy: 42, r: 0.5, opacity: 0.3 },
    { cx: 12, cy: 58, r: 0.5, opacity: 0.3 },
    { cx: 28, cy: 62, r: 0.5, opacity: 0.3 },
    { cx: 45, cy: 58, r: 0.5, opacity: 0.3 },
    { cx: 62, cy: 68, r: 0.5, opacity: 0.3 },
    { cx: 78, cy: 58, r: 0.5, opacity: 0.3 },
    { cx: 92, cy: 65, r: 0.5, opacity: 0.3 },
    { cx: 18, cy: 75, r: 0.5, opacity: 0.3 },
    { cx: 35, cy: 78, r: 0.5, opacity: 0.3 },
    { cx: 55, cy: 75, r: 0.5, opacity: 0.3 },
    { cx: 72, cy: 85, r: 0.5, opacity: 0.3 },
    { cx: 88, cy: 78, r: 0.5, opacity: 0.3 },
  ];

  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      {stars.map((star, index) => (
        <Circle
          key={index}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#FFFFFF"
          opacity={star.opacity}
        />
      ))}
    </Svg>
  );
}

export default function AchievementsTab() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    Animated.timing(progressAnim, {
      toValue: 68,
      duration: 1200,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Glow animation for level card - subtle pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Pulse animation for XP
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
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const glowIntensity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const earnedCount = BADGE_DATA.filter(b => b.earned).length;
  const lockedCount = BADGE_DATA.filter(b => !b.earned).length;

  const getFilteredBadges = () => {
    if (activeTab === 'earned') return BADGE_DATA.filter(b => b.earned);
    if (activeTab === 'locked') return BADGE_DATA.filter(b => !b.earned);
    return BADGE_DATA;
  };

  const filteredBadges = getFilteredBadges();

  // Calculate next milestone
  const currentXP = 465;
  const nextMilestone = XP_MILESTONES.find(m => m.value > currentXP);
  const xpToNext = nextMilestone ? nextMilestone.value - currentXP : 0;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        contentContainerStyle={[
          styles.scroll,
          { 
            paddingTop: insets.top + 16, 
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        {/* ── Header with Streak and Notification ── */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Achievements</Text>
          <View style={styles.headerRight}>
            <View style={styles.streakPill}>
              <Image source={images.streak} style={styles.streakPillIcon} resizeMode="contain" />
              <Text style={styles.streakPillText}>1</Text>
            </View>
            <TouchableOpacity style={styles.iconCircle}>
              <BellIcon size={17} color="#1E3A8A" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Summary Banner with Logo ── */}
        <View style={styles.summaryCard}>
          <GlassCard style={styles.summaryGlassCard} intensity={45}>
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.08)', 'rgba(37, 99, 235, 0.04)']}
              style={styles.summaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <View style={styles.logoBadgeContainer}>
                    <Image source={images.senyasLogo} style={styles.logoBadge} resizeMode="contain" />
                  </View>
                  <View style={styles.summaryBadge}>
                    <Image source={images.badges} style={styles.summaryIcon} resizeMode="contain" />
                    <Text style={styles.summaryTitle}>{earnedCount} / {BADGE_DATA.length} Badges</Text>
                  </View>
                  <Text style={styles.summarySub}>{lockedCount} badges left to unlock!</Text>
                </View>
                <View style={styles.xpContainer}>
                  <Text style={styles.xpLabel}>XP</Text>
                  <Animated.Text style={[styles.xpValue, { transform: [{ scale: pulseScale }] }]}>465</Animated.Text>
                  <Text style={styles.xpNext}>{xpToNext} XP to next</Text>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>
        </View>

        {/* ── Galaxy Level Indicator with Glow ── */}
        <Animated.View style={[
          styles.levelContainer,
          {
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowIntensity.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.3, 0.7]
            }),
            shadowRadius: glowIntensity.interpolate({
              inputRange: [0.5, 1],
              outputRange: [12, 25]
            }),
            elevation: glowIntensity.interpolate({
              inputRange: [0.5, 1],
              outputRange: [4, 10]
            }),
          }
        ]}>
          <View style={styles.galaxyCard}>
            <LinearGradient
              colors={['#0B0B2A', '#1A0A3E', '#2D1B69', '#0B0B2A']}
              style={styles.galaxyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <GalaxyStars />
            <View style={styles.galaxyBorder} />
            <View style={styles.levelContent}>
              <View style={styles.levelBadgeContainer}>
                <Image source={images.beginner} style={styles.levelIcon} resizeMode="contain" />
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>Current Level</Text>
                <Text style={styles.levelName}>Beginner</Text>
              </View>
              <View style={styles.levelXp}>
                <StarIcon size={14} color="#F59E0B" />
                <Text style={styles.levelXpText}>465 XP</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── XP Milestones - Horizontal Roadmap ── */}
        <View style={styles.milestoneSection}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneTitle}>XP Milestones</Text>
            <Text style={styles.milestoneXpNext}>{xpToNext} XP to next</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.milestoneRoadmap}
          >
            {XP_MILESTONES.map((m, index) => (
              <View key={index} style={styles.milestoneStep}>
                {/* Checkbox / Circle with icon */}
                <View style={[
                  styles.milestoneCheckbox,
                  m.achieved && styles.milestoneCheckboxAchieved,
                ]}>
                  {m.achieved ? (
                    <CheckIcon size={14} color="#FFFFFF" />
                  ) : (
                    <View style={styles.milestoneDotInner} />
                  )}
                </View>
                
                {/* Label */}
                <Text style={[
                  styles.milestoneLabel,
                  m.achieved && styles.milestoneLabelAchieved,
                ]}>
                  {m.label}
                </Text>
                
                {/* Connector line between steps */}
                {index < XP_MILESTONES.length - 1 && (
                  <View style={[
                    styles.milestoneConnector,
                    m.achieved && styles.milestoneConnectorAchieved,
                  ]} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Current Progress ── */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Current Progress</Text>
            <Text style={styles.progressValue}>465 / 500 XP</Text>
          </View>
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
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabsContainer}>
          {(['all', 'earned', 'locked'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabItem,
                activeTab === tab && styles.tabItemActive,
              ]}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}>
                {tab === 'all' ? 'All' : tab === 'earned' ? 'Earned' : 'Locked'}
                {tab === 'all' && ` (${BADGE_DATA.length})`}
                {tab === 'earned' && ` (${earnedCount})`}
                {tab === 'locked' && ` (${lockedCount})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Badges Grid ── */}
        <View style={styles.badgeGrid}>
          {filteredBadges.map((badge) => (
            <GlassCard key={badge.id} style={styles.badgeCard} intensity={35}>
              <View style={styles.badgeContent}>
                <View style={[styles.badgeIconContainer, badge.earned && styles.badgeIconEarned]}>
                  <Image 
                    source={badge.icon} 
                    style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]} 
                    resizeMode="contain" 
                  />
                </View>
                <Text style={[styles.badgeLabel, !badge.earned && styles.badgeLabelLocked]}>
                  {badge.label}
                </Text>
                <Text style={[styles.badgeDesc, !badge.earned && styles.badgeDescLocked]}>
                  {badge.desc}
                </Text>
                <Text style={[styles.badgeXp, !badge.earned && styles.badgeXpLocked]}>
                  {badge.xp}
                </Text>
                {!badge.earned && (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>Locked</Text>
                  </View>
                )}
              </View>
            </GlassCard>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Glass ──
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
    backgroundColor: 'rgba(255,255,255,0.35)',
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
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    backgroundColor: 'rgba(37, 99, 235, 0.03)',
  },
  blob2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -80,
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  blob3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -50,
    backgroundColor: 'rgba(124, 58, 237, 0.03)',
  },

  scroll: {
    paddingHorizontal: 20,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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

  // ── Summary Card ──
  summaryCard: {
    marginBottom: 12,
    overflow: 'visible',
  },
  summaryGlassCard: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  summaryGradient: {
    padding: 16,
    borderRadius: 24,
    overflow: 'visible',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flex: 1,
  },
  logoBadgeContainer: {
    marginBottom: -18,
    marginTop: -28,
    marginLeft: -8,
    overflow: 'visible',
  },
  logoBadge: {
    width: 110,
    height: 110,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  summaryIcon: {
    width: 28,
    height: 28,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  summarySub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  xpContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 10,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  xpValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  xpNext: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
  },

  // ── Galaxy Level Indicator ──
  levelContainer: {
    marginBottom: 16,
  },
  galaxyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(124, 58, 237, 0.3)',
    minHeight: 80,
  },
  galaxyGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  galaxyBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    minHeight: 80,
  },
  levelBadgeContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelIcon: {
    width: 34,
    height: 34,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.3,
  },
  levelName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  levelXp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  levelXpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },

  // ── Milestones - Horizontal Roadmap ──
  milestoneSection: {
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.5,
  },
  milestoneXpNext: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  milestoneRoadmap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  milestoneStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  milestoneCheckboxAchieved: {
    borderColor: '#6535c0',
    backgroundColor: '#4915aa',
  },
  milestoneDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  milestoneLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginRight: 4,
  },
  milestoneLabelAchieved: {
    color: '#111827',
    fontWeight: '700',
  },
  milestoneConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
    marginHorizontal: 4,
  },
  milestoneConnectorAchieved: {
    backgroundColor: '#6535c0',
  },

  // ── Progress ──
  progressSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 0.3,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(17,24,39,0.08)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 20,
  },

  // ── Tabs ──
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  tabItemActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // ── Badges ──
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  badgeCard: {
    width: (width - 52) / 2,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badgeContent: {
    alignItems: 'center',
    gap: 4,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeIconEarned: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  badgeIcon: {
    width: 32,
    height: 32,
  },
  badgeIconLocked: {
    opacity: 0.4,
  },
  badgeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  badgeLabelLocked: {
    color: '#9CA3AF',
  },
  badgeDesc: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 15,
  },
  badgeDescLocked: {
    color: '#9CA3AF',
  },
  badgeXp: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  badgeXpLocked: {
    color: '#9CA3AF',
  },
  lockedBadge: {
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  lockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
});