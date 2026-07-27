/**
 * SEÑAS — Color System
 * Soft, inclusive, accessible palette for FSL learning
 */

const palette = {
  teal50:  '#f0fafa',
  teal100: '#ccf0f0',
  teal200: '#99e0e0',
  teal300: '#5cc8c8',
  teal400: '#2eadad',
  teal500: '#1a9090',
  teal600: '#0f7070',

  amber100: '#fff8e6',
  amber200: '#ffeaaa',
  amber300: '#ffd166',
  amber400: '#ffbf33',
  amber500: '#f5a800',

  rose100: '#fff0f3',
  rose300: '#ffb3c1',
  rose400: '#ff6b8a',

  lavender100: '#f3f0ff',
  lavender300: '#c4b5fd',
  lavender400: '#8b5cf6',

  mint100: '#f0fff4',
  mint300: '#86efac',
  mint400: '#22c55e',

  white:   '#ffffff',
  gray50:  '#f8f9fa',
  gray100: '#f0f2f5',
  gray200: '#e4e8ed',
  gray300: '#cbd2da',
  gray400: '#9aa3ae',
  gray500: '#6b7685',
  gray600: '#4a5568',
  gray700: '#2d3748',
  gray800: '#1a202c',

  dark900: '#0d1117',
  dark800: '#161b22',
  dark700: '#21262d',
};

export const Colors = {
  light: {
    // Brand
    primary:        palette.teal400,
    primaryLight:   palette.teal100,
    primaryDark:    palette.teal600,
    accent:         palette.amber300,
    success:        palette.mint400,
    danger:         palette.rose400,
    warning:        palette.amber500,
    purple:         palette.lavender400,

    // Surfaces
    background:     palette.gray50,
    surface:        palette.white,
    surfaceAlt:     palette.teal50,
    card:           palette.white,
    border:         palette.gray200,
    borderLight:    palette.gray100,

    // Text
    text:           palette.gray800,
    textSecondary:  palette.gray500,
    textTertiary:   palette.gray400,
    textOnPrimary:  palette.white,
    textOnDark:     palette.white,

    // Tab Bar
    tabIconDefault:  palette.gray400,
    tabIconSelected: palette.teal500,
    tabBackground:   palette.white,

    // Category Colors
    categoryAlphabet:  { bg: '#e0f5f5', border: '#99e0e0', text: palette.teal600 },
    categoryNumbers:   { bg: '#fff9f0', border: '#ffd580', text: '#92600a' },
    categoryGreetings: { bg: '#f3f0ff', border: '#c4b5fd', text: palette.lavender400 },
    categoryClassroom: { bg: '#f0fff4', border: '#86efac', text: '#15803d' },
  },
  dark: {
    primary:        palette.teal300,
    primaryLight:   palette.teal600,
    primaryDark:    palette.teal200,
    accent:         palette.amber300,
    success:        palette.mint300,
    danger:         palette.rose300,
    warning:        palette.amber400,
    purple:         palette.lavender300,

    background:     palette.dark900,
    surface:        palette.dark800,
    surfaceAlt:     palette.dark700,
    card:           palette.dark800,
    border:         '#30363d',
    borderLight:    '#21262d',

    text:           '#e6edf3',
    textSecondary:  '#8b949e',
    textTertiary:   '#6e7681',
    textOnPrimary:  palette.white,
    textOnDark:     palette.white,

    tabIconDefault:  '#8b949e',
    tabIconSelected: palette.teal300,
    tabBackground:   palette.dark800,

    categoryAlphabet:  { bg: '#0d2626', border: '#1a4a4a', text: palette.teal300 },
    categoryNumbers:   { bg: '#2a1f00', border: '#4a3500', text: palette.amber300 },
    categoryGreetings: { bg: '#1a1030', border: '#3b2a6e', text: palette.lavender300 },
    categoryClassroom: { bg: '#0d2010', border: '#1a4020', text: palette.mint300 },
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors =
  typeof Colors.light | typeof Colors.dark;