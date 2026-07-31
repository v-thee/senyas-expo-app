import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Images ──
const images = {
  senyasLogo: require('@/assets/images/senyas_logo.png'),
  senyaBlue: require('@/assets/images/senya_blue.png'),
  senyaMagnify: require('@/assets/images/senya_magnify.png'),
  senyaTeaching: require('@/assets/images/senya_teaching.png'),
};

// ── Design Tokens ──
const C = {
  deepBlue: "#152B6B",
  royal: "#2647B8",
  royalLight: "#3B5FE0",
  sky: "#5EC8FA",
  gold: "#FFC542",
  goldDeep: "#F2A400",
  streak: "#FF8A3D",
  ink: "#101635",
  slate: "#6B7492",
  slateLight: "#AEB4CE",
  card: "#FFFFFF",
  bg: "#EEF1FB",
  statsZone: "#E7EEFF",
  danger: "#EF4444",
  border: "#DCE4FA",
  success: "#10B981",
};

/* ---------- Icon Components ---------- */
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

const Sparkle = ({ size = 16, color = "#F59E0B" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.6" />
    <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.4" />
    <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.4" />
  </Svg>
);

const ArrowRight = ({ size = 18, color = "#fff" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronLeft = ({ size = 24, color = "#2647B8" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = ({ size = 24, color = "#2647B8" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Hands = ({ size = 24, color = "#2647B8" }: { size?: number; color?: string }) => (
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

const Heart = ({ size = 24, color = "#FFC542" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color + "22"}
    />
  </Svg>
);

const Users = ({ size = 24, color = "#5EC8FA" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Book = ({ size = 24, color = "#10B981" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 4v12l4-2 4 2V4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Target = ({ size = 24, color = "#FF8A3D" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const Award = ({ size = 24, color = "#FFC542" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15v5m-3 0h6M8 21h8M12 9a4 4 0 100-8 4 4 0 000 8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 9v2a4 4 0 008 0V9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Zap = ({ size = 24, color = "#5EC8FA" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Rocket = ({ size = 24, color = "#2647B8" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Flag = ({ size = 24, color = "#10B981" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 21V3M4 8l16-4v10L4 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Globe = ({ size = 24, color = "#5EC8FA" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth={2} />
  </Svg>
);

/* ---------- Glass Card Component ---------- */
function GlassCard({
  children,
  style,
  intensity = 40,
}: {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
}) {
  return (
    <View style={[styles.glassWrap, style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.glassTint} pointerEvents="none" />
      {children}
    </View>
  );
}

/* ---------- Slide Data ---------- */
interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: any;
  icon: React.ReactNode;
  color: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    title: 'Learn Filipino Sign Language',
    subtitle: 'Break the Barriers',
    description: 'SEÑAS is your friendly AI companion for learning Filipino Sign Language (FSL). With smart camera technology, you can practice signs and get instant feedback - just like having a teacher by your side!',
    image: images.senyaTeaching,
    icon: <Hands size={32} color="#2647B8" />,
    color: C.royal,
  },
  {
    id: '2',
    title: 'Connect, Learn, and Grow',
    subtitle: 'Bridge the Gap',
    description: 'Every sign you learn opens doors to new friendships and understanding with the Deaf community. SEÑAS makes learning FSL fun, interactive, and accessible for everyone - from students to teachers!',
    image: images.senyaBlue,
    icon: <Heart size={32} color="#FFC542" />,
    color: C.goldDeep,
  },
  {
    id: '3',
    title: 'Your FSL Learning Journey',
    subtitle: 'Start Today',
    description: 'From learning the alphabet to having real conversations, SEÑAS guides you every step of the way. Practice anytime, anywhere, and watch your skills grow with every lesson!',
    image: images.senyaMagnify,
    icon: <Book size={32} color="#10B981" />,
    color: C.success,
  },
];

/* ---------- Info Cards Data ---------- */
interface InfoCardData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const infoCards: InfoCardData[] = [
  {
    id: '1',
    icon: <Hands size={28} color="#2647B8" />,
    title: 'What is SEÑAS?',
    description: 'SEÑAS is an AI-powered app that helps you learn Filipino Sign Language (FSL) using your phone\'s camera. It recognizes your hand gestures and gives you instant feedback - making learning fun and interactive!',
    color: C.royal,
  },
  {
    id: '2',
    icon: <Target size={28} color="#FF8A3D" />,
    title: 'Our Mission',
    description: 'We want to make sign language education accessible to everyone! SEÑAS helps break communication barriers and creates bridges between the hearing and Deaf communities through technology.',
    color: C.streak,
  },
  {
    id: '3',
    icon: <Users size={28} color="#5EC8FA" />,
    title: 'Who Can Use It?',
    description: 'Whether you\'re a student, teacher, or just someone who wants to learn FSL - SEÑAS is for you! It\'s especially helpful for SNED students, teachers tracking progress, and anyone passionate about inclusive communication.',
    color: C.sky,
  },
  {
    id: '4',
    icon: <Award size={28} color="#FFC542" />,
    title: 'Why It\'s Special',
    description: 'With smart AI technology, instant feedback, and a teacher dashboard, SEÑAS makes learning FSL more effective than ever. It\'s like having a personal sign language tutor in your pocket!',
    color: C.goldDeep,
  },
];

/* ---------- Main Component ---------- */
interface LandingProps {
  onGetStarted?: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const infoFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate info cards after slides appear
    setTimeout(() => {
      Animated.timing(infoFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Pulsing animation for the button
    Animated.loop(
      Animated.sequence([
        Animated.spring(buttonScale, {
          toValue: 1.02,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();

    // Shimmer animation for the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentSlide + 1,
        animated: true,
      });
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentSlide - 1,
        animated: true,
      });
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  });

  const renderSlide = ({ item }: { item: SlideData }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.slideImageContainer}>
          <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
          <View style={[styles.slideIconBadge, { backgroundColor: item.color + '22' }]}>
            {item.icon}
          </View>
        </View>
        <View style={styles.slideContent}>
          <Text style={[styles.slideSubtitle, { color: item.color }]}>
            {item.subtitle}
          </Text>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          const color = scrollX.interpolate({
            inputRange,
            outputRange: ['#DCE4FA', C.royal, '#DCE4FA'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderInfoCard = ({ item }: { item: InfoCardData }) => {
    return (
      <GlassCard style={[styles.infoCard, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
        <View style={styles.infoCardHeader}>
          <View style={[styles.infoCardIcon, { backgroundColor: item.color + '22' }]}>
            {item.icon}
          </View>
          <Text style={styles.infoCardTitle}>{item.title}</Text>
        </View>
        <Text style={styles.infoCardDescription}>{item.description}</Text>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      <Animated.ScrollView
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Header with Logo */}
        <Animated.View style={[styles.header, { transform: [{ scale: logoScale }] }]}>
          <Image source={images.senyasLogo} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.logoText}>SEÑAS</Text>
          <View style={styles.logoSubtitleContainer}>
            <Sparkle size={14} color="#F59E0B" />
            <Text style={styles.logoSubtitle}>Learn Filipino Sign Language</Text>
            <Sparkle size={14} color="#F59E0B" />
          </View>
        </Animated.View>

        {/* Slides */}
        <View style={styles.slidesWrapper}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
          />

          {/* Navigation Arrows */}
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              style={[styles.arrowButton, currentSlide === 0 && styles.arrowDisabled]}
              onPress={handlePrev}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={20} color={currentSlide === 0 ? '#DCE4FA' : C.royal} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrowButton, currentSlide === slides.length - 1 && styles.arrowDisabled]}
              onPress={handleNext}
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRightIcon size={20} color={currentSlide === slides.length - 1 ? '#DCE4FA' : C.royal} />
            </TouchableOpacity>
          </View>

          {/* Dots */}
          {renderDots()}
        </View>

        {/* Enhanced Shiny Get Started Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: buttonScale }],
            }
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedWrapper}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2F6FE0', '#1E3FAE', '#4B7BE5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.getStartedGradient}
            >
              {/* Shimmer effect overlay - Full width */}
              <Animated.View
                style={[
                  styles.shimmerOverlay,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0)',
                    'rgba(255,255,255,0.35)',
                    'rgba(255,255,255,0)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmerGradient}
                />
              </Animated.View>
              
              {/* Button glow */}
              <View style={styles.buttonGlow} />
              
              {/* Sparkles on the left */}
              <View style={styles.buttonSparklesLeft}>
                <Sparkle size={12} color="#FFC542" />
                <Sparkle size={8} color="#FFC542" />
              </View>
              
              {/* Main content */}
              <View style={styles.buttonContent}>
                <Rocket size={20} color="#FFFFFF" />
                <Text style={styles.getStartedText}>Start Your FSL Journey</Text>
                <ArrowRight size={20} color="#fff" />
              </View>
              
              {/* Sparkles on the right */}
              <View style={styles.buttonSparklesRight}>
                <Sparkle size={8} color="#FFC542" />
                <Sparkle size={12} color="#FFC542" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Subtitle below button */}
          <Text style={styles.buttonSubtitle}>
            Join thousands of learners mastering Filipino Sign Language
          </Text>
        </Animated.View>

        {/* Info Cards Section */}
        <Animated.View style={{ opacity: infoFade }}>
          <View style={styles.infoSectionHeader}>
            <Globe size={24} color={C.goldDeep} />
            <Text style={styles.infoSectionTitle}>Why SEÑAS?</Text>
            <Globe size={24} color={C.goldDeep} />
          </View>
          <Text style={styles.infoSectionSubtitle}>
            Discover how SEÑAS makes learning Filipino Sign Language fun, smart, and accessible for everyone!
          </Text>

          {infoCards.map((item) => (
            <View key={item.id} style={styles.infoCardWrapper}>
              {renderInfoCard({ item })}
            </View>
          ))}

          {/* Impact Section */}
          <GlassCard style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <Flag size={24} color={C.gold} />
              <Text style={styles.impactTitle}>Making a Difference</Text>
            </View>
            <Text style={styles.impactText}>
              SEÑAS is more than just an app - it's a bridge between communities! By combining AI technology with 
              sign language education, we're creating a world where everyone can communicate freely. 
              {'\n\n'}Whether you're a student, teacher, or just curious about FSL, SEÑAS is here to guide you 
              on your learning journey. Together, we can break down barriers and build a more inclusive world, 
              one sign at a time!
            </Text>
          </GlassCard>

          {/* Footer */}
          <View style={styles.footer}>
            <Heart size={16} color="#EF4444" />
            <Text style={styles.footerText}>
              Made for Nasugbu West Central School and beyond
            </Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
  },
  blob2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -80,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  blob3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -50,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },

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
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  // ── Header ──
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: C.deepBlue,
    letterSpacing: 4,
    marginBottom: 2,
  },
  logoSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: C.slate,
    letterSpacing: 0.5,
  },

  // ── Slides ──
  slidesWrapper: {
    marginTop: 8,
    minHeight: 400,
  },
  flatList: {
    flexGrow: 0,
  },
  slideContainer: {
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  slideImageContainer: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideIconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(38, 71, 184, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  slideContent: {
    width: '100%',
    paddingHorizontal: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.royal,
    letterSpacing: 1,
    marginBottom: 4,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.ink,
    marginBottom: 8,
    lineHeight: 30,
  },
  slideDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: C.slate,
    lineHeight: 22,
  },

  // ── Navigation Arrows ──
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    paddingHorizontal: 8,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.deepBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  arrowDisabled: {
    opacity: 0.3,
  },

  // ── Dots ──
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.royal,
  },

  // ── Button ──
  buttonContainer: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  getStartedWrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#1E3FAE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  getStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 60,
    width: '100%',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
    transform: [{ skewX: '-20deg' }],
  },
  buttonGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonSparklesLeft: {
    position: 'absolute',
    left: 12,
    top: 8,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  buttonSparklesRight: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  buttonSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: C.slate,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },

  // ── Info Section ──
  infoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  infoSectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: C.ink,
  },
  infoSectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: C.slate,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoCardWrapper: {
    marginBottom: 12,
  },
  infoCard: {
    padding: 16,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  infoCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
  },
  infoCardDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: C.slate,
    lineHeight: 20,
    paddingLeft: 4,
  },

  // ── Impact Card ──
  impactCard: {
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 197, 66, 0.05)',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
  },
  impactText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.slate,
    lineHeight: 24,
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.slateLight,
    textAlign: 'center',
  },
});