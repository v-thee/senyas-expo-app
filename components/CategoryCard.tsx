import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';
import { Shadow, Radius, Spacing, FontSize, FontWeight } from '@/constants/Theme';
import { Category } from '@/constants/Data';

interface Props {
  category: Category;
  progress: number; // 0–100
  onPress: () => void;
}

export default function CategoryCard({ category, progress, onPress }: Props) {
  const done    = category.lessons.filter(l => l.status === 'done').length;
  const total   = category.lessons.length;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[
        styles.card,
        { backgroundColor: category.bgColor, borderColor: category.color + '55' },
        Shadow.sm,
      ]}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.label, { color: '#1a202c' }]}>{category.label}</Text>
      <Text style={styles.sub}>{total} lessons</Text>
      <ProgressBar
        progress={progress}
        color={category.color}
        trackColor={category.color + '30'}
        height={6}
      />
      <Text style={[styles.pct, { color: category.color }]}>{progress}% done</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    gap: 4,
  },
  icon:  { fontSize: 28, marginBottom: 4 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, marginBottom: 2 },
  sub:   { fontSize: FontSize.xs, color: '#9aa3ae', fontWeight: FontWeight.semibold, marginBottom: 8 },
  pct:   { fontSize: FontSize.xs, fontWeight: FontWeight.bold, marginTop: 4 },
});