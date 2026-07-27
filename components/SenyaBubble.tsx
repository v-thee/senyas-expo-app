import React from 'react';
import { View, StyleSheet } from 'react-native';
import SenyaMascot from './SenyaMascot';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Radius, Shadow, Spacing } from '@/constants/Theme';

interface Props {
  message: string;
  expression?: 'happy' | 'excited' | 'thinking' | 'encouraging';
  mascotSize?: number;
}

export default function SenyaBubble({
  message,
  expression = 'encouraging',
  mascotSize = 60,
}: Props) {
  const colors = useThemeColor();

  return (
    <View style={styles.row}>
      <SenyaMascot size={mascotSize} expression={expression} animate={false} />
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            ...Shadow.sm,
          },
        ]}
      >
        {/* Tail */}
        <View
          style={[styles.tail, { borderRightColor: colors.surface }]}
        />
        <ThemedText type="default" style={{ lineHeight: 18 }}>
            {message}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bubble: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    position: 'relative',
  },
  tail: {
    position: 'absolute',
    left: -8,
    top: 12,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});