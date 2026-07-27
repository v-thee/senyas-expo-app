import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NotFoundScreen() {
  const colors = useThemeColor();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 52, marginBottom: 16 }}>🤷</Text>
        <Text style={[styles.title, { color: colors.text }]}>Page Not Found</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          This screen doesn't exist in SEÑAS yet.
        </Text>
        <Link href="/" style={[styles.link, { color: colors.primary }]}>
          Go to Home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title:     { fontSize: 24, fontWeight: '800' },
  body:      { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  link:      { marginTop: 16, fontSize: 16, fontWeight: '700', textDecorationLine: 'underline' },
});