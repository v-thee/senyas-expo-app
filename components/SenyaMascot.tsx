import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, {
  Ellipse, Path, Rect, Text as SvgText, Circle,
} from 'react-native-svg';

type Expression = 'happy' | 'excited' | 'thinking' | 'encouraging';

interface Props {
  size?: number;
  expression?: Expression;
  animate?: boolean;
}

const EXPRESSIONS: Record<Expression, {
  leftEye: string; rightEye: string;
  mouth: string; blush: boolean;
}> = {
  happy: {
    leftEye:  'M148,155 Q152,148 156,155',
    rightEye: 'M172,155 Q176,148 180,155',
    mouth:    'M152,170 Q164,182 176,170',
    blush: true,
  },
  excited: {
    leftEye:  'M146,152 Q152,144 158,152',
    rightEye: 'M170,152 Q176,144 182,152',
    mouth:    'M150,168 Q164,184 178,168',
    blush: true,
  },
  thinking: {
    leftEye:  'M148,157 Q152,150 156,157',
    rightEye: 'M172,154 Q178,148 184,154',
    mouth:    'M154,172 Q164,176 174,172',
    blush: false,
  },
  encouraging: {
    leftEye:  'M148,155 Q152,148 156,155',
    rightEye: 'M172,155 Q176,148 180,155',
    mouth:    'M152,170 Q164,180 176,170',
    blush: true,
  },
};

export default function SenyaMascot({
  size = 120,
  expression = 'happy',
  animate = true,
}: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, floatAnim]);

  const expr = EXPRESSIONS[expression];

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <Svg
        width={size}
        height={size}
        viewBox="80 80 160 180"
      >
        {/* Ground shadow */}
        <Ellipse cx="160" cy="255" rx="38" ry="8" fill="rgba(46,173,173,0.12)" />

        {/* Body */}
        <Ellipse cx="160" cy="215" rx="32" ry="28" fill="#2eadad" />

        {/* Outfit */}
        <Path
          d="M132 210 Q140 198 152 195 Q160 193 168 195 Q180 198 188 210 L188 235 Q160 245 132 235 Z"
          fill="#1a9090"
        />
        <Path d="M152,195 Q160,205 168,195" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Badge */}
        <Rect x="154" y="203" width="12" height="8" rx="3" fill="#ffd166" />
        <SvgText x="160" y="210" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#92600a">FSL</SvgText>

        {/* Left arm */}
        <Ellipse cx="124" cy="218" rx="8" ry="14" fill="#2eadad" transform="rotate(-15,124,218)" />
        {/* Right arm raised */}
        <Ellipse cx="196" cy="210" rx="8" ry="14" fill="#2eadad" transform="rotate(25,196,210)" />

        {/* Hands */}
        <Circle cx="116" cy="228" r="9" fill="#f5c5a3" />
        <Circle cx="201" cy="200" r="9" fill="#f5c5a3" />
        <Path d="M197,192 Q199,188 201,192" stroke="#e8a882" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M201,190 Q204,186 205,190" stroke="#e8a882" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M205,192 Q207,188 208,192" stroke="#e8a882" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Neck */}
        <Rect x="153" y="188" width="14" height="10" rx="4" fill="#f5c5a3" />

        {/* Head */}
        <Ellipse cx="160" cy="155" rx="38" ry="36" fill="#f5c5a3" />

        {/* Hair */}
        <Path
          d="M122,148 Q118,118 135,105 Q148,95 160,94 Q172,95 185,105 Q202,118 198,148"
          fill="#4a2c0a"
        />
        <Path d="M138,103 Q148,97 155,98 Q148,105 140,110 Z" fill="#6b4110" />

        {/* Ears */}
        <Ellipse cx="122" cy="158" rx="8" ry="10" fill="#f5c5a3" />
        <Ellipse cx="198" cy="158" rx="8" ry="10" fill="#f5c5a3" />
        <Ellipse cx="122" cy="158" rx="5" ry="7" fill="#f0b090" />
        <Ellipse cx="198" cy="158" rx="5" ry="7" fill="#f0b090" />

        {/* Eyes */}
        <Path d={expr.leftEye}  stroke="#3a2010" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d={expr.rightEye} stroke="#3a2010" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Circle cx="149" cy="153" r="2" fill="white" />
        <Circle cx="173" cy="153" r="2" fill="white" />

        {/* Eyebrows */}
        <Path d="M145,146 Q152,142 158,146" stroke="#4a2c0a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M170,146 Q176,142 183,146" stroke="#4a2c0a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <Ellipse cx="164" cy="163" rx="3" ry="2" fill="#e8a882" />

        {/* Mouth */}
        <Path d={expr.mouth} stroke="#c0715a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Blush */}
        {expr.blush && (
          <>
            <Ellipse cx="135" cy="166" rx="8" ry="5" fill="#ffb3b3" opacity="0.45" />
            <Ellipse cx="185" cy="166" rx="8" ry="5" fill="#ffb3b3" opacity="0.45" />
          </>
        )}

        {/* Hair clip */}
        <Ellipse cx="178" cy="113" rx="7" ry="5" fill="#2eadad" transform="rotate(-20,178,113)" />
        <Ellipse cx="178" cy="113" rx="4" ry="3" fill="#ffd166" transform="rotate(-20,178,113)" />

        {/* Legs */}
        <Rect x="144" y="238" width="12" height="20" rx="6" fill="#1a9090" />
        <Rect x="164" y="238" width="12" height="20" rx="6" fill="#1a9090" />

        {/* Shoes */}
        <Ellipse cx="150" cy="258" rx="9" ry="6" fill="#3a2010" />
        <Ellipse cx="170" cy="258" rx="9" ry="6" fill="#3a2010" />
      </Svg>
    </Animated.View>
  );
}