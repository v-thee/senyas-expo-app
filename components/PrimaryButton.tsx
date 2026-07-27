import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Shadow, Radius, FontSize, FontWeight } from '@/constants/Theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  color?: string;
  shadowColor?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export default function PrimaryButton({
  label, onPress, variant = 'primary',
  color = '#2eadad', shadowColor = '#2eadad',
  loading = false, disabled = false, style, fullWidth = true,
}: Props) {
  const isPrimary   = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.base,
        fullWidth && styles.full,
        isPrimary && {
          backgroundColor: disabled ? '#ccc' : color,
          ...(disabled ? {} : { ...Shadow.md, shadowColor }),
        },
        isSecondary && {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? '#ccc' : color,
        },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : color} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isPrimary ? '#fff' : color },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  full: { width: '100%' },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.3,
  },
});