import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './Splash';
import OnboardingSlides from './onboarding';
import Login from '../(auth)/LoginScreen';

type Phase = 'splash' | 'slides' | 'login';

interface Props {
  onLoginSuccess: () => void;
}

/**
 * AppOnboarding — shown only on a brand-new install (first launch).
 *
 * Flow:
 *   SplashScreen (loading animation)
 *     ↓ ~2 s
 *   OnboardingSlides (4 feature-highlight slides)
 *     ↓ "Get Started"
 *   Login (LRN + password)
 *     ↓ success
 *   onLoginSuccess() → Assessment → Dashboard
 *
 * On subsequent launches the app goes straight to Onboarding (Splash → Login).
 */
export default function AppOnboarding({ onLoginSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>('splash');

  return (
    <View style={styles.root}>
      {phase === 'splash' && (
        <SplashScreen onFinish={() => setPhase('slides')} />
      )}
      {phase === 'slides' && (
        <OnboardingSlides onComplete={() => setPhase('login')} />
      )}
      {phase === 'login' && (
        <Login onLogin={onLoginSuccess} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});