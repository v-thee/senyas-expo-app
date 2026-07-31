// app/screens/LoadingLogout.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width: W, height: H } = Dimensions.get('window');

const images = {
  senyasLogo: require('@/assets/images/senyas_logo.png'),
};

// Total time the loading screen is shown (3 seconds)
const LOADING_DURATION_MS = 3000;

interface Props {
  onFinish?: () => void;
}

export default function LoadingLogout({ onFinish }: Props) {
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
  
  // Logout-specific animations
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

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

    // Wave animation for goodbye message
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.delay(400),
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

    // Progress bar fills across the whole loading duration
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: LOADING_DURATION_MS,
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

    // Fade out animation at the end
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 500,
      delay: LOADING_DURATION_MS - 500,
      useNativeDriver: true,
    }).start();

    // Navigate to Landing after 3 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        // Navigate to Landing screen
        router.replace('/screens/Landing');
      }
    }, LOADING_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const waveRotation = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeOutAnim }]}>
      {/* Gradient background */}
      <LinearGradient
        colors={['#091186', '#2311c4', '#4A2C8A', '#9cc2e7']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Decorative soft circles */}
      <View style={[styles.decCircle, styles.decCircle1]} />
      <View style={[styles.decCircle, styles.decCircle2]} />
      <View style={[styles.decCircle, styles.decCircle3]} />
      <View style={[styles.decCircle, styles.decCircle4]} />

      {/* Pulse ring behind logo */}
      <Animated.View
        style={[
          styles.pulseRing,
          { transform: [{ scale: ringScale }], opacity: ringOpacity },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrap,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      >
        <View style={styles.mascotCircle}>
          <Animated.Image
            source={images.senyasLogo}
            style={[styles.logoImage, { transform: [{ translateY: logoFloat }] }]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.appName}>SEÑAS</Text>
          <Text style={styles.appSubtitle}>Your FSL Journey</Text>
        </View>
      </Animated.View>

      {/* Logout message */}
      <Animated.View style={[styles.tagWrap, { opacity: tagOpacity }]}>
        <Animated.Text style={[styles.tagline, { transform: [{ rotate: waveRotation }] }]}>
          👋 See You Soon!
        </Animated.Text>
        
        <View style={styles.tagDivider} />
        
        <Text style={styles.tagSub}>We hope you enjoyed learning FSL today!</Text>

        {/* Wave emoji indicator */}
        <View style={styles.waveIndicator}>
          <Text style={styles.waveEmoji}>👋</Text>
          <Text style={styles.waveText}>Come back anytime!</Text>
        </View>
      </Animated.View>

      {/* Progress Bar */}
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
          <Text style={styles.loadingLabel}>Logging Out</Text>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 26,
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

  // Wave indicator
  waveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  waveEmoji: {
    fontSize: 24,
  },
  waveText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
  },

  // Progress Bar
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
});