import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Shadow, Radius } from '@/constants/Theme';

// Custom icons — using emoji / SVG-lite approach so no native icon font needed
import HomeIcon     from '@/components/icons/HomeIcon';
import LearnIcon    from '@/components/icons/LearnIcon';
import PracticeIcon from '@/components/icons/PracticeIcon';
import AwardIcon    from '@/components/icons/AwardIcon';
import ProfileIcon  from '@/components/icons/ProfileIcon';

/** Centre "Practice" FAB tab button */
function PracticeFAB({ onPress, color }: { onPress: () => void; color: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[
        styles.fab,
        { backgroundColor: color, ...Shadow.teal },
      ]}
    >
      <PracticeIcon size={26} color="#fff" />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.tabBackground,
            borderTopColor:  colors.borderLight,
            paddingBottom: insets.bottom || 12,
            height: 64 + (insets.bottom || 0),
          },
          Shadow.sm,
        ],
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={24} color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <LearnIcon size={24} color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '',
          tabBarButton: (props) => (
            <PracticeFAB
              onPress={props.onPress as () => void}
              color={colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Awards',
          tabBarIcon: ({ color, focused }) => (
            <AwardIcon size={24} color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon size={24} color={color} filled={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    position: 'absolute',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: -4,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    marginHorizontal: 6,
  },
});