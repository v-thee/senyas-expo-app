import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Splash from './Splash';
import Login from '../(auth)/LoginScreen';

type Phase = 'splash' | 'login';

interface Props {
  onComplete: () => void;
}

/**
 * Onboarding — the pre-login flow.
 * Phase 1: Splash  (animated logo entry, ~2.4 s)
 * Phase 2: Login   (LRN + password form)
 *
 * Once the user authenticates, onLoginSuccess() is called and the root
 * navigator switches to the main app (Assessment → Dashboard).
 */
export default function Onboarding({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('splash');

  return (
    <View style={styles.root}>
      {phase === 'splash' && (
        <Splash onFinish={() => setPhase('login')} />
      )}
      {phase === 'login' && (
        <Login onLogin={onComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});