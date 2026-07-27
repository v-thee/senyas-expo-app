import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
  progress: number; // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: number;
}

export default function ProgressBar({
  progress,
  color = '#2eadad',
  trackColor = '#e4e8ed',
  height = 8,
  borderRadius = 9999,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.min(Math.max(progress, 0), 100),
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, height, borderRadius, width },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
  fill:  {},
});