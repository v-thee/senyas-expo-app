import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps { size?: number; color?: string; filled?: boolean; }

export default function ProfileIcon({ size = 24, color = '#9aa3ae', filled = false }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4"
        fill={filled ? color + '30' : 'none'}
        stroke={color} strokeWidth="1.8"
      />
      <Path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
    </Svg>
  );
}