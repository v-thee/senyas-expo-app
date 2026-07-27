import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps { size?: number; color?: string; }

export default function PracticeIcon({ size = 24, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 11.5C7 9.01 9.01 7 11.5 7C13.99 7 16 9.01 16 11.5"
        stroke={color} strokeWidth="2" strokeLinecap="round"
      />
      <Path
        d="M5 17C5 14.24 7.24 12 10 12H14C16.76 12 19 14.24 19 17"
        stroke={color} strokeWidth="2" strokeLinecap="round"
      />
      <Path d="M8 7V5M12 6V4M16 7V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}