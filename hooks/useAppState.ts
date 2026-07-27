import { useState, useCallback } from 'react';

export type AppScreen =
  | 'onboarding'
  | 'login'
  | 'assessment'
  | 'main';

export interface AppState {
  screen: AppScreen;
  userName: string;
  level: string;
  goTo: (screen: AppScreen) => void;
  setUserName: (name: string) => void;
  setLevel: (level: string) => void;
}

export function useAppState(): AppState {
  const [screen, setScreen] = useState<AppScreen>('onboarding');
  const [userName, setUserName] = useState('Maria');
  const [level, setLevel] = useState('Beginner');

  const goTo = useCallback((s: AppScreen) => setScreen(s), []);

  return { screen, userName, level, goTo, setUserName, setLevel };
}