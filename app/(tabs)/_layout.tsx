import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// ── Design Tokens (matching system UI) ──
const C = {
  deepBlue: '#152B6B',
  royal: '#2647B8',
  royalLight: '#3B5FE0',
  sky: '#5EC8FA',
  gold: '#FFC542',
  ink: '#101635',
  slate: '#6B7492',
  slateLight: '#AEB4CE',
  card: '#FFFFFF',
  bg: '#EEF1FB',
  glassBorder: 'rgba(255,255,255,0.5)',
  glassBg: 'rgba(255,255,255,0.85)',
  pill: 'rgba(38, 71, 184, 0.12)',
};

// ── Icons ──────────────────────────────────────────────────────
// Slightly rounder, friendlier line-weights, with a soft filled glow
// state for the active tab instead of a hard duplicate stroke.

function HomeIcon({ size = 26, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled && (
        <Path
          d="M4 11.5L12 4l8 7.5V19a1.2 1.2 0 01-1.2 1.2h-3.3a.7.7 0 01-.7-.7v-4.2a1 1 0 00-1-1h-3.6a1 1 0 00-1 1V19.5a.7.7 0 01-.7.7H5.2A1.2 1.2 0 014 19v-7.5z"
          fill={color}
          fillOpacity={0.18}
        />
      )}
      <Path
        d="M3.2 11.2L12 3.5l8.8 7.7"
        stroke={color}
        strokeWidth={filled ? 2.4 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.2 9.7V19a1 1 0 001 1h3.1a.6.6 0 00.6-.6v-4.6a1.1 1.1 0 011.1-1.1h2a1.1 1.1 0 011.1 1.1v4.6a.6.6 0 00.6.6h3.1a1 1 0 001-1V9.7"
        stroke={color}
        strokeWidth={filled ? 2.4 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LearnIcon({ size = 26, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled && (
        <Path
          d="M12 5.4c-1.4-.9-3.4-1.3-5.4-1.3-1 0-2 .1-2.9.3v13.2c.9-.2 1.9-.3 2.9-.3 2 0 4 .4 5.4 1.3V5.4zM12 5.4c1.4-.9 3.4-1.3 5.4-1.3 1 0 2 .1 2.9.3v13.2c-.9-.2-1.9-.3-2.9-.3-2 0-4 .4-5.4 1.3V5.4z"
          fill={color}
          fillOpacity={0.18}
        />
      )}
      <Path
        d="M12 5.5v13"
        stroke={color}
        strokeWidth={filled ? 2.4 : 2}
        strokeLinecap="round"
      />
      <Path
        d="M12 5.5c-1.35-.85-3.15-1.3-5.05-1.3-1.02 0-2.03.13-2.95.36v12.8c.92-.23 1.93-.36 2.95-.36 1.9 0 3.7.45 5.05 1.3M12 5.5c1.35-.85 3.15-1.3 5.05-1.3 1.02 0 2.03.13 2.95.36v12.8c-.92-.23-1.93-.36-2.95-.36-1.9 0-3.7.45-5.05 1.3"
        stroke={color}
        strokeWidth={filled ? 2.4 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WavingHandIcon({ size = 30, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 12.2V7.6a1.1 1.1 0 012.2 0v3.9M9.2 11.5V6.4a1.1 1.1 0 012.2 0v5.7M11.4 12.1V5.8a1.1 1.1 0 012.2 0v7.7M13.6 13.5v-3a1.1 1.1 0 012.2 0v4.3a4.6 4.6 0 01-4.6 4.6h-1a5.6 5.6 0 01-4.6-2.4L4 15.2a1.15 1.15 0 011.8-1.4l1.4 1.5"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.12)"
      />
      <Path
        d="M6.3 8.8c-1.2 1.1-1.2 2.9 0 4M4 6.3c-2.3 1.9-2.3 5 0 6.9"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.55}
      />
    </Svg>
  );
}

function AwardIcon({ size = 27, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* cup */}
      {filled && (
        <Path
          d="M7.5 3.4h9v4a4.5 4.5 0 01-9 0v-4z"
          fill={C.gold}
          fillOpacity={0.4}
        />
      )}
      <Path
        d="M7.5 3.4h9v4a4.5 4.5 0 01-9 0v-4z"
        stroke={color}
        strokeWidth={filled ? 2.3 : 1.9}
        strokeLinejoin="round"
      />
      {/* handles */}
      <Path
        d="M7.6 5.2H5.8a2 2 0 000 4h1.8"
        stroke={color}
        strokeWidth={filled ? 2.1 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.4 5.2h1.8a2 2 0 010 4h-1.8"
        stroke={color}
        strokeWidth={filled ? 2.1 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* stem + stand */}
      <Path
        d="M12 11.9v3M12 14.9l-2.3 3.1M12 14.9l2.3 3.1"
        stroke={color}
        strokeWidth={filled ? 2.1 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 18h5"
        stroke={color}
        strokeWidth={filled ? 2.3 : 1.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProfileIcon({ size = 26, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled && (
        <>
          <Circle cx="12" cy="8.2" r="4.2" fill={color} fillOpacity={0.18} />
          <Path
            d="M19.5 20.5v-1.3a5 5 0 00-5-5h-5a5 5 0 00-5 5v1.3"
            fill={color}
            fillOpacity={0.18}
          />
        </>
      )}
      <Circle cx="12" cy="8.2" r="4.2" stroke={color} strokeWidth={filled ? 2.4 : 2} />
      <Path
        d="M19.5 20.5v-1.3a5 5 0 00-5-5h-5a5 5 0 00-5 5v1.3"
        stroke={color}
        strokeWidth={filled ? 2.4 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Tab item with animated active "pill" ────────────────────────

function TabIcon({
  Icon,
  label,
  color,
  focused,
  size = 25,
}: {
  Icon: React.ComponentType<any>;
  label: string;
  color: string;
  focused: boolean;
  size?: number;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const pill = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1 : 0.9,
        useNativeDriver: true,
        speed: 18,
        bounciness: 8,
      }),
      Animated.timing(pill, {
        toValue: focused ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.tabItem}>
      <Animated.View
        style={[
          styles.tabPill,
          {
            backgroundColor: C.pill,
            opacity: pill,
            transform: [
              {
                scale: pill.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
             marginTop: 10,
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }],  marginTop: 10  }}>
        <Icon size={size} color={color} filled={focused} />
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          {
            color,
            fontWeight: focused ? '700' : '600',
            opacity: focused ? 1 : 0.75,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

/** Centre "Practice" FAB — enlarged, layered glass, with a glowing accent ring
 *  so it reads as the emphasized, primary action in the bar. */
function PracticeFAB({ onPress }: { onPress: () => void }) {
  const press = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(press, { toValue: 0.93, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  const onPressOut = () =>
    Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  return (
    <View style={styles.fabTouchArea}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.fabWrapper}
      >
        {/* outer glow ring */}
        <View style={styles.fabGlowRing} />

        <Animated.View style={[styles.fabScaler, { transform: [{ scale: press }] }]}>
          <BlurView intensity={40} tint="light" style={styles.fabBlur} />
          <Svg width={78} height={78} style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient id="fabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={C.royalLight} stopOpacity={1} />
                <Stop offset="100%" stopColor={C.deepBlue} stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Circle cx="39" cy="39" r="37" fill="url(#fabGrad)" />
            <Circle cx="39" cy="39" r="37" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} fill="none" />
          </Svg>
          <View style={styles.fabInner}>
            <WavingHandIcon size={30} color="#fff" />
            <Text style={styles.fabLabel}>Practice</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  const activeColor = C.royal;
  const inactiveColor = C.slate;
  const bottomInset = insets.bottom || 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarBackground: () => (
          <View style={styles.tabBarBg}>
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFillObject} />
          </View>
        ),
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: bottomInset,
            height: 68 + bottomInset,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={HomeIcon} label="Home" color={focused ? activeColor : inactiveColor} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={LearnIcon} label="Learn" color={focused ? activeColor : inactiveColor} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '',
          tabBarButton: (props) => <PracticeFAB onPress={props.onPress as () => void} />,
          tabBarLabel: () => null,
          tabBarItemStyle: styles.fabItem,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Awards',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={AwardIcon} label="Awards" color={focused ? activeColor : inactiveColor} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={ProfileIcon} label="Profile" color={focused ? activeColor : inactiveColor} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#0A1240',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
    }),
  },
  // Rounded, blurred backdrop — clipped on its own layer so it never
  // crops the Practice FAB, which intentionally extends above the bar.
  tabBarBg: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
    ...Platform.select({
      android: {
        backgroundColor: 'rgba(255,255,255,0.96)',
        elevation: 12,
      },
    }),
  },
  tabBarItem: {
    // keeps every non-FAB tab perfectly centered, same footprint
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabItem: {
    height: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    width: 64,
    paddingTop: 10,
  },
  tabPill: {
    position: 'absolute',
    top: 0,
    width: 55,
    height: 50,
    borderRadius: 16,
  },
  tabLabel: {
    fontSize: 10.5,
    letterSpacing: 0.2,
  },

  // ── FAB ──
  fabTouchArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -34,
  },
  fabGlowRing: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: 'rgba(94, 200, 250, 0.24)',
  },
  fabScaler: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: C.royal,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 18,
      },
      android: {
        elevation: 14,
      },
    }),
  },
  fabBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 39,
  },
  fabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});