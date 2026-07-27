/**
 * SEÑAS Theme Color Hook
 * Returns the complete theme color palette
 */

import { Colors, ThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(): ThemeColors {
  const theme = useColorScheme() ?? 'light';

  return Colors[theme];
}