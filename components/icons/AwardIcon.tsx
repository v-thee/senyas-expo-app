import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps { size?: number; color?: string; filled?: boolean; }

export default function AwardIcon({ size = 24, color = '#9aa3ae', filled = false }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="6"
        fill={filled ? color + '30' : 'none'}
        stroke={color} strokeWidth="1.8"
      />
      <Path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <Path d="M12 6L13.09 8.26L15.5 8.63L13.75 10.34L14.18 12.74L12 11.6L9.82 12.74L10.25 10.34L8.5 8.63L10.91 8.26L12 6Z"
        fill={filled ? color : 'none'}
        stroke={filled ? 'none' : color} strokeWidth="1.5"
      />
    </Svg>
  );
}