import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps { size?: number; color?: string; filled?: boolean; }

export default function HomeIcon({ size = 24, color = '#9aa3ae', filled = false }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}