import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export const ACCENT = '#2F6BFF';
export const ACCENT_DARK = '#1E3FAE';

export function GlassCard({
  children,
  style,
  intensity = 40,
  tint = 'light',
}: {
  children?: React.ReactNode;
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

export function PressScale({
  children,
  onPress,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export function GlassButton({
  label,
  onPress,
  disabled,
  color = ACCENT,
  colorDark = ACCENT_DARK,
  variant = 'filled',
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  colorDark?: string;
  variant?: 'filled' | 'ghost';
  icon?: React.ReactNode;
  style?: any;
}) {
  return (
    <PressScale onPress={onPress} disabled={disabled} style={style}>
      <GlassCard style={[styles.btnGlass, disabled && styles.btnDisabled]} intensity={variant === 'filled' ? 55 : 40}>
        {variant === 'filled' ? (
          <LinearGradient colors={[color + 'E6', colorDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnFill}>
            {icon}
            <Text style={styles.btnFilledText}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.btnGhostFill}>
            {icon}
            <Text style={[styles.btnGhostText, { color }]}>{label}</Text>
          </View>
        )}
      </GlassCard>
    </PressScale>
  );
}

export function MiniProgressBar({
  progress,
  color = ACCENT,
  trackColor = 'rgba(30,58,138,0.08)',
  height = 8,
}: {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  return (
    <View style={[styles.trackOuter, { height, backgroundColor: trackColor }]}>
      <View style={[styles.trackFill, { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  glassWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.32)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  glassTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.28)' },

  btnGlass: { borderRadius: 30 },
  btnDisabled: { opacity: 0.5 },
  btnFill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, paddingHorizontal: 22 },
  btnFilledText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  btnGhostFill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, paddingHorizontal: 22 },
  btnGhostText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },

  trackOuter: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  trackFill: { borderRadius: 20 },
});