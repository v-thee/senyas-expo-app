import { Colors } from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

export function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}