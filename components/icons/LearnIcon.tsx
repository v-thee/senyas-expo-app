import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps { size?: number; color?: string; filled?: boolean; }

export default function LearnIcon({ size = 24, color = '#9aa3ae', filled = false }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5C4 18.12 5.12 17 6.5 17H20"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
      <Path
        d="M6.5 2H20V22H6.5C5.12 22 4 20.88 4 19.5V4.5C4 3.12 5.12 2 6.5 2Z"
        fill={filled ? color + '30' : 'none'}
        stroke={color} strokeWidth="1.8"
      />
      <Path d="M8 7H16M8 11H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}