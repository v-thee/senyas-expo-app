import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SenyaMascot from '@/components/SenyaMascot';
import ProgressBar from '@/components/ProgressBar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CATEGORIES, Category, LessonItem } from '@/constants/Data';
import { Shadow, Spacing, Radius, FontSize, FontWeight } from '@/constants/Theme';

interface Props {
  onOpenLesson: (category: Category, lesson: LessonItem) => void;
  onBack?: () => void;
}

/**
 * Lessons — browseable list of all FSL lesson categories and their modules.
 * Tapping an unlocked lesson calls onOpenLesson → LessonDetail.
 */
export default function Lessons({ onOpenLesson, onBack }: Props) {
  const colors       = useThemeColor();
  const insets       = useSafeAreaInsets();
  const [activeId, setActiveId] = useState('alphabet');

  const cat = CATEGORIES.find(c => c.id === activeId)!;
  const done = cat.lessons.filter(l => l.status === 'done').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.background },
        ]}
      >
        <View style={styles.headerRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={{ fontSize: 20, color: colors.textTertiary }}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.pageTitle, { color: colors.text }]}>Lessons</Text>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        >
          {CATEGORIES.map(c => {
            const active = activeId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setActiveId(c.id)}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: c.color, borderColor: c.color, ...Shadow.md, shadowColor: c.color }
                    : { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ fontSize: 14 }}>{c.icon}</Text>
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Lesson list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: 110 }]}
      >
        {/* Category hero banner */}
        <LinearGradient
          colors={[cat.color + 'cc', cat.color]}
          style={[styles.catBanner, Shadow.md]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.catBannerTitle}>
              {cat.icon}  {cat.label}
            </Text>
            <Text style={styles.catBannerSub}>
              {cat.lessons.length} lessons · {done} completed
            </Text>
          </View>
          <SenyaMascot size={70} expression="happy" animate />
        </LinearGradient>

        {/* Lesson rows */}
        {cat.lessons.map((lesson, i) => {
          const isDone   = lesson.status === 'done';
          const isActive = lesson.status === 'active';
          const isLocked = lesson.status === 'locked';

          return (
            <TouchableOpacity
              key={lesson.id}
              disabled={isLocked}
              onPress={() => onOpenLesson(cat, lesson)}
              activeOpacity={0.85}
              style={[
                styles.lessonItem,
                {
                  backgroundColor: isLocked ? colors.background : colors.surface,
                  borderColor:     isActive  ? cat.color         : colors.borderLight,
                  borderWidth:     isActive  ? 2                 : 1,
                  opacity:         isLocked  ? 0.58              : 1,
                },
                !isLocked && Shadow.sm,
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.lessonIconWrap,
                  {
                    backgroundColor:
                      isDone   ? cat.bgColor :
                      isActive ? cat.bgColor :
                      colors.background,
                  },
                ]}
              >
                <Text style={{ fontSize: 22 }}>
                  {isDone ? '✅' : isLocked ? '🔒' : cat.icon}
                </Text>
              </View>

              {/* Text */}
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.lessonTitle,
                    { color: isLocked ? colors.textTertiary : colors.text },
                  ]}
                >
                  Lesson {lesson.id}: {lesson.title}
                </Text>
                <Text
                  style={[styles.lessonSub, { color: colors.textTertiary }]}
                  numberOfLines={1}
                >
                  {lesson.signs.length > 0
                    ? lesson.signs.join(', ')
                    : 'Coming soon'}
                </Text>
              </View>

              {/* Status icon */}
              {isDone   && <Text style={{ fontSize: 18, color: '#2eadad' }}>✓</Text>}
              {isActive && <Text style={{ fontSize: 18 }}>▶️</Text>}
              {isLocked && <Text style={{ fontSize: 16, color: colors.textTertiary }}>🔒</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:       { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  headerRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn:      { padding: 4 },
  pageTitle:    { fontSize: FontSize.xl, fontWeight: FontWeight.black },

  chip:         {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 2,
  },
  chipText:     { fontSize: FontSize.sm, fontWeight: FontWeight.bold },

  list:         { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },

  catBanner:    {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.xl, padding: Spacing.lg,
    marginBottom: Spacing.lg, overflow: 'hidden',
  },
  catBannerTitle:{ fontSize: FontSize.lg, fontWeight: FontWeight.black, color: '#fff', marginBottom: 4 },
  catBannerSub:  { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', fontWeight: FontWeight.semibold },

  lessonItem:   {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: Radius.md, padding: 16, marginBottom: 10,
  },
  lessonIconWrap:{ width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  lessonTitle:   { fontSize: FontSize.base, fontWeight: FontWeight.extrabold, marginBottom: 2 },
  lessonSub:     { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});