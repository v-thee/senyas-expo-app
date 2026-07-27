import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

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
  glassBorder: 'rgba(255,255,255,0.4)',
  glassBg: 'rgba(255,255,255,0.85)',
};

// ── Enhanced SVG Icons with Glassmorphism ──

function HomeIcon({ size = 24, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
          />
          <Path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <Path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

function LearnIcon({ size = 24, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
          />
          <Path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <Path
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

// ── Waving Hand Icon (Practice) ──
function WavingHandIcon({ size = 24, color = '#fff', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 11V7a1 1 0 0 1 2 0v4M14 11v2a2 2 0 0 0 4 0v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-8 0"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.15 : 0}
      />
      <Path
        d="M8 13V8a1 1 0 0 1 2 0v5M8 13v3a3 3 0 0 0 6 0v-3M8 13V6a1 1 0 0 1 2 0v7"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.15 : 0}
      />
      <Path
        d="M6 10c-1 1-1 2.5 0 3.5M4 8c-2 1.5-2 4 0 5.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
    </Svg>
  );
}

// ── Award Icon (Trophy) ──
function AwardIcon({ size = 24, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Path
            d="M6 2v4c0 3.314 2.686 6 6 6s6-2.686 6-6V2H6z"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
          />
          <Path
            d="M6 2H4v2c0 1.657 1.343 3 3 3h2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M18 2h2v2c0 1.657-1.343 3-3 3h-2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 12v6M9 18h6M12 18v2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M6 2v4c0 3.314 2.686 6 6 6s6-2.686 6-6V2H6z"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M6 2H4v2c0 1.657 1.343 3 3 3h2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M18 2h2v2c0 1.657-1.343 3-3 3h-2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 12v6M9 18h6M12 18v2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <Path
            d="M6 2v4c0 3.314 2.686 6 6 6s6-2.686 6-6V2H6z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M6 2H4v2c0 1.657 1.343 3 3 3h2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M18 2h2v2c0 1.657-1.343 3-3 3h-2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 12v6M9 18h6M12 18v2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}

function ProfileIcon({ size = 24, color = C.slate, filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth={2.5} fill={color} fillOpacity="0.2" />
          <Path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
          />
          <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth={2.5} />
          <Path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth={2} />
          <Path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}

// ── Active Tab Icon with filled color ──
function TabIcon({ Icon, label, color, focused, size = 22 }: { 
  Icon: React.ComponentType<any>;
  label: string;
  color: string;
  focused: boolean;
  size?: number;
}) {
  return (
    <View style={styles.tabItem}>
      <Icon size={size} color={color} filled={focused} />
      <Text style={[styles.tabLabel, { 
        color: color, 
        fontWeight: focused ? '700' : '500',
        opacity: focused ? 1 : 0.7,
      }]}>
        {label}
      </Text>
    </View>
  );
}

/** Centre "Practice" FAB tab button with Glassmorphism */
function PracticeFAB({ onPress, color }: { onPress: () => void; color: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={styles.fabWrapper}
    >
      <BlurView intensity={80} tint="light" style={styles.fabBlur} />
      <View style={[styles.fab, { backgroundColor: 'rgba(38, 71, 184, 0.85)' }]}>
        <View style={styles.fabInner}>
          <WavingHandIcon size={28} color="#fff" filled />
          <Text style={styles.fabLabel}>Practice</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  const activeColor = C.royal;
  const inactiveColor = C.slate;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: insets.bottom || 8,
            height: 70 + (insets.bottom || 0),
          },
        ],
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              Icon={HomeIcon} 
              label="Home" 
              color={focused ? activeColor : inactiveColor} 
              focused={focused} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              Icon={LearnIcon} 
              label="Learn" 
              color={focused ? activeColor : inactiveColor} 
              focused={focused} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '',
          tabBarButton: (props) => (
            <PracticeFAB
              onPress={props.onPress as () => void}
              color={C.royal}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Awards',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              Icon={AwardIcon} 
              label="Awards" 
              color={focused ? activeColor : inactiveColor} 
              focused={focused} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              Icon={ProfileIcon} 
              label="Profile" 
              color={focused ? activeColor : inactiveColor} 
              focused={focused} 
            />
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
    paddingHorizontal: 6,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
    backdropFilter: Platform.OS === 'ios' ? 'blur(25px)' : undefined,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
      },
    }),
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: -4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 9.5,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  fabWrapper: {
    position: 'relative',
    width: 62,
    height: 62,
    borderRadius: 31,
    marginTop: -26,
    marginHorizontal: 4,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: C.royal,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  fabBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  fab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 31,
    backgroundColor: 'rgba(38, 71, 184, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: 1,
  },
});