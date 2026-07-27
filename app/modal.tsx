import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SenyaMascot from '@/components/SenyaMascot';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Shadow, Spacing, Radius, FontSize, FontWeight } from '@/constants/Theme';

const TUTORIAL_STEPS = [
  {
    id: 0,
    title: 'Welcome to SEÑAS! 👋',
    body: "I'm Senya, your learning guide! I'll be with you every step of the way as you learn Filipino Sign Language.",
    expression: 'excited' as const,
    tip: null,
  },
  {
    id: 1,
    title: 'Start with Lessons 📚',
    body: "Head to the Learn tab to explore lessons organized by category — Alphabet, Numbers, Greetings, and Classroom signs.",
    expression: 'happy' as const,
    tip: '💡 Tip: Start with the Alphabet category first!',
  },
  {
    id: 2,
    title: 'Practice Every Day 🎯',
    body: 'Use the Practice button in the centre of the navigation bar to do quizzes and gesture recognition exercises.',
    expression: 'encouraging' as const,
    tip: '🔥 Daily practice builds a strong streak!',
  },
  {
    id: 3,
    title: 'Earn Achievements 🏆',
    body: 'Complete lessons, keep your streak going, and score well on quizzes to unlock badges and reach new milestones!',
    expression: 'excited' as const,
    tip: '⭐ Check the Awards tab to track your progress.',
  },
  {
    id: 4,
    title: "You're All Set! 🚀",
    body: "Remember — there's no rush. Learn at your own pace and enjoy the journey. I believe in you! 🤟",
    expression: 'happy' as const,
    tip: null,
  },
];

export default function ModalScreen() {
  const router  = useRouter();
  const colors  = useThemeColor();
  const insets  = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  const current = TUTORIAL_STEPS[step];
  const isLast  = step === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) router.back();
    else setStep(s => s + 1);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Close */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.closeBtn, { top: insets.top + 16, backgroundColor: colors.surface, borderColor: colors.border }, Shadow.sm]}
      >
        <Text style={{ fontSize: 18, color: colors.textTertiary }}>✕</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step dots */}
        <View style={styles.dots}>
          {TUTORIAL_STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === step ? 24 : 8,
                  backgroundColor: i === step ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Mascot */}
        <View style={styles.mascotWrap}>
          <View style={[styles.mascotBg, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary + '33' }]}>
            <SenyaMascot size={160} expression={current.expression} animate />
          </View>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, Shadow.md]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{current.title}</Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{current.body}</Text>

          {current.tip && (
            <View style={[styles.tipBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary + '33' }]}>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>{current.tip}</Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          style={[styles.nextBtn, { backgroundColor: colors.primary }, Shadow.teal]}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Start Learning! 🚀' : 'Got it! →'}
          </Text>
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
            <Text style={[styles.skipText, { color: colors.textTertiary }]}>Skip tutorial</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  closeBtn:   { position: 'absolute', right: 20, zIndex: 10, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  content:    { paddingHorizontal: Spacing.lg, alignItems: 'center', gap: Spacing.lg },
  dots:       { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot:        { height: 8, borderRadius: 9999 },
  mascotWrap: { alignItems: 'center' },
  mascotBg:   { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  card:       { width: '100%', borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, gap: Spacing.md },
  cardTitle:  { fontSize: FontSize.xl, fontWeight: FontWeight.black, textAlign: 'center', lineHeight: 30 },
  cardBody:   { fontSize: FontSize.base, lineHeight: 24, textAlign: 'center' },
  tipBox:     { borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1 },
  tipText:    { fontSize: FontSize.sm, lineHeight: 20 },
  nextBtn:    { width: '100%', borderRadius: Radius.full, paddingVertical: 17, alignItems: 'center' },
  nextBtnText:{ fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: '#fff', letterSpacing: 0.3 },
  skipText:   { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});