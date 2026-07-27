import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from './context/AuthContext';

// Screens
import SplashScreenComponent from '@/app/screens/Splash';
import LandingScreen from '@/app/screens/Landing';
import LoginScreen from '@/app/(auth)/LoginScreen';
import AssessmentScreen from '@/app/screens/AssessmentScreen';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { authStep, setAuthStep, isLoading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!appReady || isLoading) {
    return null;
  }

  // ── Pre-auth flow ──
  if (authStep !== 'done') {
    return (
      <GestureHandlerRootView style={styles.root}>
        <StatusBar
          style={authStep === 'splash' ? 'light' : 'dark'}
          backgroundColor="transparent"
          translucent
        />

        {authStep === 'splash' && (
          <SplashScreenComponent onFinish={() => setAuthStep('landing')} />
        )}

        {authStep === 'landing' && (
          <LandingScreen onGetStarted={() => setAuthStep('login')} />
        )}

        {authStep === 'login' && (
          <LoginScreen onLogin={() => setAuthStep('assessment')} />
        )}

        {authStep === 'assessment' && (
          <AssessmentScreen
            onComplete={(level) => {
              console.log('Level:', level);
              setAuthStep('done');
            }}
          />
        )}
      </GestureHandlerRootView>
    );
  }

  // ── Authenticated app: Expo Router tab navigator ──
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});