import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  PanResponder,
  Switch,
  Pressable,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
  TextInput,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { 
  Rect, 
  Circle, 
  Mask, 
  Defs, 
  Path,
  G,
  Line,
  Polygon
} from "react-native-svg";
import { router } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Images ──
const images = {
  senyaBlue: require('@/assets/images/senya_blue.png'),
  beginner: require('@/assets/images/beginner.png'),
  firstStep: require('@/assets/images/first_step.png'),
  alphabetStar: require('@/assets/images/alphabet_star.png'),
  streak1: require('@/assets/images/streak1.png'),
  greetings: require('@/assets/images/greetings.png'),
  badges: require('@/assets/images/badges.png'),
  lesson: require('@/assets/images/lesson.png'),
  energy: require('@/assets/images/energy.png'),
  streak: require('@/assets/images/streak.png'),
};

/* ---------- design tokens ---------- */
const C = {
  deepBlue: "#152B6B",
  royal: "#2647B8",
  royalLight: "#3B5FE0",
  sky: "#5EC8FA",
  gold: "#FFC542",
  goldDeep: "#F2A400",
  streak: "#FF8A3D",
  ink: "#101635",
  slate: "#6B7492",
  slateLight: "#AEB4CE",
  card: "#FFFFFF",
  bg: "#EEF1FB",
  statsZone: "#E7EEFF",
  danger: "#EF4444",
  border: "#DCE4FA",
};

/* ---------- Icon Components ---------- */
const Star = ({ size = 24, color = "#000", strokeWidth = 2, fill = "none" }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);

const Zap = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Flame = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Award = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15v5m-3 0h6M8 21h8M12 9a4 4 0 100-8 4 4 0 000 8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 9v2a4 4 0 008 0V9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Bell = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21a2 2 0 01-3.46 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Volume2 = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Smartphone = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="12" y1="18" x2="12.01" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

const Type = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 7V4h16v3M9 20h6M12 4v16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LogOut = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 17l5-5-5-5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12H9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Pencil = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const X = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

const Lock = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

const ChevronRight = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Check = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Trophy = ({ size = 24, color = "#000", strokeWidth = 2, fill = "none" }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2v4c0 3.314 2.686 6 6 6s6-2.686 6-6V2H6z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M6 2H4v2c0 1.657 1.343 3 3 3h2M18 2h2v2c0 1.657-1.343 3-3 3h-2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 12v6M9 18h6M12 18v2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

const Sparkles = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 4l.5 2.5L22 7l-2.5.5L19 10l-.5-2.5L16 7l2.5-.5L19 4z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 14l.5 2.5L8 17l-2.5.5L5 20l-.5-2.5L2 17l2.5-.5L5 14z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Rocket = ({ size = 24, color = "#000", strokeWidth = 2 }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Image Icon Components ──
const LessonIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.lesson} style={{ width: size, height: size }} resizeMode="contain" />
);

const EnergyIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.energy} style={{ width: size, height: size }} resizeMode="contain" />
);

const StreakIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.streak} style={{ width: size, height: size }} resizeMode="contain" />
);

const BadgeIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.badges} style={{ width: size, height: size }} resizeMode="contain" />
);

const FirstStepIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.firstStep} style={{ width: size, height: size }} resizeMode="contain" />
);

const AlphabetStarIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.alphabetStar} style={{ width: size, height: size }} resizeMode="contain" />
);

const GreetingsIcon = ({ size = 24 }: { size?: number }) => (
  <Image source={images.greetings} style={{ width: size, height: size }} resizeMode="contain" />
);

/* ---------- Types ---------- */
interface AvatarData {
  uri: string;
  pos: { x: number; y: number };
  scale: number;
  frame: number;
  circle: number;
}

interface Badge {
  id: string;
  label: string;
  Icon: React.ComponentType<any>;
  color: string;
  earned: boolean;
}

interface CropData {
  uri: string;
  pos: { x: number; y: number };
  scale: number;
  frame: number;
  circle: number;
}

interface Settings {
  reminders: boolean;
  sound: boolean;
  haptics: boolean;
  largeText: boolean;
}

type SettingKey = keyof Settings;

interface StatPillProps {
  Icon: React.ComponentType<any>;
  value: number | string;
  label: string;
  tint: string;
}

interface SettingRowProps {
  Icon: React.ComponentType<any>;
  iconTint?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}

interface AvatarProps {
  data?: AvatarData | null;
  size?: number;
}

interface CropModalProps {
  visible: boolean;
  uri: string | null;
  onCancel: () => void;
  onSave: (data: CropData) => void;
}

interface SignOutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

interface EditProfileModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  avatar: AvatarData | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  showBadges: boolean;
  setShowBadges: (show: boolean) => void;
  pickImage: () => void;
}

interface ProfileData {
  avatar: AvatarData | null;
  displayName: string;
  bio: string;
  showBadges: boolean;
  settings: Settings;
}

/* ---------- Badge Catalog ---------- */
const badgeCatalog: Badge[] = [
  { id: "first-step", label: "First Step", Icon: FirstStepIcon, color: C.gold, earned: true },
  { id: "alphabet-star", label: "Alphabet Star", Icon: AlphabetStarIcon, color: C.sky, earned: true },
  { id: "streak-starter", label: "Streak Starter", Icon: StreakIcon, color: C.streak, earned: true },
  { id: "greeter", label: "Greeter", Icon: GreetingsIcon, color: "#8FD694", earned: true },
  { id: "speed-signer", label: "Speed Signer", Icon: Rocket, color: "#B98CFF", earned: false },
];

/* ---------- Storage Keys ---------- */
const STORAGE_KEYS = {
  PROFILE_DATA: '@senyas_profile_data',
};

/* ---------- small building blocks ---------- */
function StatPill({ Icon, value, label, tint }: StatPillProps) {
  return (
    <View style={styles.statPill}>
      <View style={[styles.statIconWrap, { backgroundColor: tint + "22" }]}>
        <Icon size={20} />
      </View>
      <Text style={styles.statValue}>{String(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({
  Icon,
  iconTint = C.royal,
  title,
  subtitle,
  right,
  onPress,
  danger = false,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, pressed && onPress && { opacity: 0.7 }]}
    >
      <View
        style={[
          styles.settingIconWrap,
          { backgroundColor: (danger ? C.danger : iconTint) + "1A" },
        ]}
      >
        <Icon size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingTitle, danger && { color: C.danger }]}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </Pressable>
  );
}

/* ---------- avatar reflecting the saved crop transform ---------- */
function Avatar({ data, size = 96 }: AvatarProps) {
  if (!data) {
    return (
      <Image 
        source={images.senyaBlue} 
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="contain"
      />
    );
  }
  const scaleRatio = size / data.circle;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: "#0E1230",
      }}
    >
      <Image
        source={{ uri: data.uri }}
        style={{
          position: "absolute",
          width: data.frame * scaleRatio,
          height: data.frame * scaleRatio,
          left: size / 2 - (data.frame * scaleRatio) / 2 + data.pos.x * scaleRatio,
          top: size / 2 - (data.frame * scaleRatio) / 2 + data.pos.y * scaleRatio,
          transform: [{ scale: data.scale }],
        }}
        resizeMode="cover"
      />
    </View>
  );
}

/* ---------- custom in-app circular cropper ---------- */
const FRAME = 260;
const CIRCLE = 220;

function CropModal({ visible, uri, onCancel, onSave }: CropModalProps) {
  const [scale, setScale] = useState<number>(1.3);
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const clamp = useCallback((p: { x: number; y: number }, s: number) => {
    const maxOffset = (FRAME * s - FRAME) / 2 + (FRAME - CIRCLE) / 2;
    return {
      x: Math.max(-maxOffset, Math.min(maxOffset, p.x)),
      y: Math.max(-maxOffset, Math.min(maxOffset, p.y)),
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStart.current = { ...posRef.current };
      },
      onPanResponderMove: (_: GestureResponderEvent, gesture: PanResponderGestureState) => {
        const next = clamp(
          { x: dragStart.current.x + gesture.dx, y: dragStart.current.y + gesture.dy },
          scale
        );
        posRef.current = next;
        setPos(next);
      },
    })
  ).current;

  if (!uri) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.cropCard}>
          <View style={styles.cropHeaderRow}>
            <Text style={styles.cropTitle}>Move and scale</Text>
            <TouchableOpacity onPress={onCancel} style={styles.cropCloseBtn}>
              <X size={16} color={C.slate} />
            </TouchableOpacity>
          </View>

          <View style={styles.cropStageOuter}>
            <View style={styles.cropStage} {...panResponder.panHandlers}>
              <Image
                source={{ uri }}
                style={{
                  position: "absolute",
                  width: FRAME,
                  height: FRAME,
                  left: pos.x,
                  top: pos.y,
                  transform: [{ scale }],
                }}
                resizeMode="cover"
              />
              <Svg width={FRAME} height={FRAME} style={StyleSheet.absoluteFill} pointerEvents="none">
                <Defs>
                  <Mask id="cropMask">
                    <Rect x="0" y="0" width={FRAME} height={FRAME} fill="white" />
                    <Circle cx={FRAME / 2} cy={FRAME / 2} r={CIRCLE / 2} fill="black" />
                  </Mask>
                </Defs>
                <Rect
                  x="0"
                  y="0"
                  width={FRAME}
                  height={FRAME}
                  fill="rgba(14,18,48,0.72)"
                  mask="url(#cropMask)"
                />
                <Circle
                  cx={FRAME / 2}
                  cy={FRAME / 2}
                  r={CIRCLE / 2}
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth={2}
                  fill="none"
                />
              </Svg>
            </View>
          </View>

          <View style={styles.zoomRow}>
            <Text style={{ fontSize: 12, color: C.slate }}>A</Text>
            <View style={styles.customSliderContainer}>
              <View style={styles.customSliderTrack}>
                <View 
                  style={[
                    styles.customSliderFill, 
                    { width: `${((scale - 1) / (2.5 - 1)) * 100}%` }
                  ]} 
                />
                <View 
                  style={[
                    styles.customSliderThumb,
                    { left: `${((scale - 1) / (2.5 - 1)) * 100}%` }
                  ]} 
                />
              </View>
              <View style={styles.customSliderButtons}>
                <TouchableOpacity 
                  style={styles.customSliderButton}
                  onPress={() => {
                    const newScale = Math.max(1, scale - 0.1);
                    setScale(newScale);
                    const next = clamp(posRef.current, newScale);
                    posRef.current = next;
                    setPos(next);
                  }}
                >
                  <Text style={styles.customSliderButtonText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.customSliderButton}
                  onPress={() => {
                    const newScale = Math.min(2.5, scale + 0.1);
                    setScale(newScale);
                    const next = clamp(posRef.current, newScale);
                    posRef.current = next;
                    setPos(next);
                  }}
                >
                  <Text style={styles.customSliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{ fontSize: 16, color: C.slate }}>A</Text>
          </View>

          <View style={styles.cropActionsRow}>
            <TouchableOpacity style={styles.cropCancelBtn} onPress={onCancel}>
              <Text style={styles.cropCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cropSaveBtn}
              onPress={() => onSave({ uri, pos, scale, frame: FRAME, circle: CIRCLE })}
            >
              <Check size={16} color="#fff" />
              <Text style={styles.cropSaveText}>Use photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Edit Profile Modal (Glassmorphism) ---------- */
function EditProfileModal({ 
  visible, 
  onCancel, 
  onSave,
  avatar,
  displayName,
  setDisplayName,
  bio,
  setBio,
  showBadges,
  setShowBadges,
  pickImage,
}: EditProfileModalProps) {
  const modalFade = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(modalFade, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
      ]).start();
    } else {
      modalFade.setValue(0);
      modalScale.setValue(0.9);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: modalFade,
              transform: [{ scale: modalScale }],
            }
          ]}
        >
          <View style={styles.editModalCard}>
            <Text style={styles.editModalTitle}>Edit Profile</Text>
            
            {/* Change Picture */}
            <TouchableOpacity style={styles.editModalImageContainer} onPress={pickImage}>
              <Image 
                source={avatar ? { uri: avatar.uri } : images.senyaBlue} 
                style={styles.editModalProfileImage} 
                resizeMode="cover"
              />
              <View style={styles.editModalCameraButton}>
                <Pencil size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.editModalChangePhoto}>Change Picture</Text>
            </TouchableOpacity>

            {/* Display Name */}
            <View style={styles.editModalField}>
              <Text style={styles.editModalFieldLabel}>Display Name</Text>
              <TextInput
                style={styles.editModalInput}
                placeholder="Enter a nickname"
                placeholderTextColor="#9CA3AF"
                value={displayName}
                onChangeText={setDisplayName}
              />
              <Text style={styles.editModalFieldNote}>Your real name cannot be changed</Text>
            </View>

            {/* Bio */}
            <View style={styles.editModalField}>
              <Text style={styles.editModalFieldLabel}>Bio</Text>
              <TextInput
                style={[styles.editModalInput, styles.editModalTextArea]}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Show Badges Toggle */}
            <View style={styles.editModalToggleRow}>
              <View style={styles.editModalToggleLeft}>
                <Text style={styles.editModalToggleLabel}>Show Badges</Text>
                <Text style={styles.editModalToggleDesc}>Display your earned badges on profile</Text>
              </View>
              <Switch
                value={showBadges}
                onValueChange={setShowBadges}
                trackColor={{ true: C.royal, false: "#D9DCEA" }}
                thumbColor="#fff"
              />
            </View>

            {/* Modal Actions */}
            <View style={styles.editModalActions}>
              <TouchableOpacity 
                style={styles.editModalCancelButton} 
                onPress={onCancel}
              >
                <Text style={styles.editModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editModalSaveButton} 
                onPress={onSave}
              >
                <LinearGradient
                  colors={['#2F6FE0', '#1E3FAE']}
                  style={styles.editModalSaveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.editModalSaveText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------- sign-out confirmation (CENTERED) ---------- */
function SignOutModal({ visible, onCancel, onConfirm }: SignOutModalProps) {
  const modalFade = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(modalFade, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
      ]).start();
    } else {
      modalFade.setValue(0);
      modalScale.setValue(0.9);
    }
  }, [visible]);

  const handleOverlayPress = (e: GestureResponderEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable 
        style={styles.modalOverlay} 
        onPress={handleOverlayPress}
      >
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: modalFade,
              transform: [{ scale: modalScale }],
            }
          ]}
        >
          <Pressable 
            style={styles.signOutCard} 
            onPress={(e: GestureResponderEvent) => e.stopPropagation()}
          >
            <View style={styles.signOutIconWrap}>
              <LogOut size={26} color={C.danger} strokeWidth={2.2} />
            </View>
            <Text style={styles.signOutTitle}>Sign out of FSL Learner?</Text>
            <Text style={styles.signOutSubtitle}>
              You'll need to sign back in to keep tracking your streak and lessons.
            </Text>
            <View style={styles.cropActionsRow}>
              <TouchableOpacity style={styles.cropCancelBtn} onPress={onCancel}>
                <Text style={styles.cropCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signOutConfirmBtn} onPress={onConfirm}>
                <Text style={styles.cropSaveText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/* ---------- main screen ---------- */
interface ProfileSettingsScreenProps {
  onLogout?: () => void;
}

export default function ProfileSettingsScreen({ onLogout }: ProfileSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [rawUri, setRawUri] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<AvatarData | null>(null);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [showSignOut, setShowSignOut] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [isPickingImage, setIsPickingImage] = useState<boolean>(false);

  const [settings, setSettings] = useState<Settings>({
    reminders: true,
    sound: true,
    haptics: false,
    largeText: false,
  });

  // Load profile data from storage
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
      if (savedData) {
        const profile: ProfileData = JSON.parse(savedData);
        setAvatar(profile.avatar);
        setDisplayName(profile.displayName || '');
        setBio(profile.bio || '');
        setShowBadges(profile.showBadges !== undefined ? profile.showBadges : true);
        if (profile.settings) {
          setSettings(profile.settings);
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileData = async () => {
    try {
      const profileData: ProfileData = {
        avatar,
        displayName,
        bio,
        showBadges,
        settings,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(profileData));
      return true;
    } catch (error) {
      console.error('Error saving profile data:', error);
      return false;
    }
  };

  const toggle = (key: SettingKey) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveProfileData();
  };

  // FIXED: Updated for Expo SDK 54 - MediaTypeOptions is now MediaType
  const pickImage = async (): Promise<void> => {
    // Prevent multiple simultaneous pickers
    if (isPickingImage) return;
    setIsPickingImage(true);

    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
        setIsPickingImage(false);
        return;
      }

      // FIXED: Close the EditProfileModal BEFORE opening image picker
      // This ensures the crop modal will be visible on top
      setShowEditModal(false);

      // Small delay to allow the modal to close
      await new Promise(resolve => setTimeout(resolve, 300));

      // UPDATED: Expo SDK 54 uses MediaType (not MediaTypeOptions)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false, // We use our custom cropper
      });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
        setRawUri(result.assets[0].uri);
        setShowCrop(true);
      } else {
        // If user cancelled, reopen edit modal
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      // Reopen edit modal if there was an error
      setShowEditModal(true);
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleCropSave = (data: CropData): void => {
    setAvatar(data);
    setShowCrop(false);
    saveProfileData();
    // Reopen edit modal after crop is saved
    setShowEditModal(true);
  };

  const handleCropCancel = (): void => {
    setShowCrop(false);
    // Reopen edit modal when crop is cancelled
    setShowEditModal(true);
  };

  const handleSignOutConfirm = async (): Promise<void> => {
  try {
    setShowSignOut(false);

    // Clear login data
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('studentName');

    if (onLogout) {
      onLogout();
    }

    // Navigate to LoadingLogout screen
    router.replace('/screens/LoadingLogout');

  } catch (error) {
    console.error('Sign out error:', error);
    Alert.alert('Error', 'Failed to sign out. Please try again.');
  }
};

  const handleEditSave = async (): Promise<void> => {
    try {
      setShowEditModal(false);
      const success = await saveProfileData();
      if (success) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: C.bg }]}>
        <ActivityIndicator size="large" color={C.royal} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <View style={styles.profileCardWrap}>
          <View style={styles.profileCard}>
            <LinearGradient colors={[C.royalLight, C.deepBlue]} style={styles.headerZone}>
              <View style={styles.headerGlowA} />
              <View style={styles.headerGlowB} />
              <View style={{ alignItems: "center" }}>
                <View>
                  <Avatar data={avatar} />
                  <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
                    <Pencil size={13} color={C.ink} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.name}>{displayName || 'Student'}</Text>
                <Text style={styles.subtitle}>FSL Beginner Learner</Text>
                <View style={styles.chipsRow}>
                  <View style={styles.chipGold}>
                    <Zap size={12} color={C.ink} strokeWidth={3} />
                    <Text style={styles.chipGoldText}>Beginner</Text>
                  </View>
                  <View style={styles.chipGhost}>
                    <Text style={styles.chipGhostText}>Member since 2026</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.statsZone}>
              <StatPill Icon={LessonIcon} value={12} label="Lessons Done" tint={C.royal} />
              <StatPill Icon={EnergyIcon} value={340} label="Total XP" tint={C.goldDeep} />
              <StatPill Icon={StreakIcon} value={5} label="Day Streak" tint={C.streak} />
              <StatPill Icon={BadgeIcon} value={4} label="Badges" tint={C.sky} />
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setShowEditModal(true)}
        >
          <LinearGradient
            colors={['rgba(37, 99, 235, 0.08)', 'rgba(37, 99, 235, 0.04)']}
            style={styles.editProfileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Pencil size={16} color="#2563EB" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Badges</Text>
          <View style={styles.badgesCard}>
            {badgeCatalog.slice(0, 4).map((b: Badge) => {
              const { Icon } = b;
              return (
                <View key={b.id} style={styles.badgeItem}>
                  <View
                    style={[
                      styles.badgeIconWrap,
                      { backgroundColor: b.earned ? b.color + "22" : "#F1F2F8" },
                    ]}
                  >
                    <Icon size={22} />
                    {!b.earned && (
                      <View style={styles.badgeLock}>
                        <Lock size={10} color={C.slate} />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[styles.badgeLabel, { color: b.earned ? C.ink : C.slateLight }]}
                    numberOfLines={2}
                  >
                    {b.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <SettingRow
              Icon={Bell}
              iconTint={C.royal}
              title="Daily Reminders"
              subtitle="Get notified to practice"
              right={
                <Switch
                  value={settings.reminders}
                  onValueChange={() => toggle("reminders")}
                  trackColor={{ true: C.royal, false: "#D9DCEA" }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              Icon={Volume2}
              iconTint={C.royal}
              title="Sound Effects"
              subtitle="Play sounds during lessons"
              right={
                <Switch
                  value={settings.sound}
                  onValueChange={() => toggle("sound")}
                  trackColor={{ true: C.royal, false: "#D9DCEA" }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              Icon={Smartphone}
              iconTint={C.royal}
              title="Haptic Feedback"
              subtitle="Vibrate on interactions"
              right={
                <Switch
                  value={settings.haptics}
                  onValueChange={() => toggle("haptics")}
                  trackColor={{ true: C.royal, false: "#D9DCEA" }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              Icon={Type}
              iconTint={C.royal}
              title="Large Text Mode"
              subtitle="Bigger text for readability"
              right={
                <Switch
                  value={settings.largeText}
                  onValueChange={() => toggle("largeText")}
                  trackColor={{ true: C.royal, false: "#D9DCEA" }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              Icon={LogOut}
              danger
              title="Sign Out"
              onPress={() => setShowSignOut(true)}
              right={<ChevronRight size={16} color={C.slateLight} />}
            />
          </View>
        </View>

        <CropModal
          visible={showCrop}
          uri={rawUri}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
        />
        
        <EditProfileModal
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          onSave={handleEditSave}
          avatar={avatar}
          displayName={displayName}
          setDisplayName={setDisplayName}
          bio={bio}
          setBio={setBio}
          showBadges={showBadges}
          setShowBadges={setShowBadges}
          pickImage={pickImage}
        />
        
        <SignOutModal
          visible={showSignOut}
          onCancel={() => setShowSignOut(false)}
          onConfirm={handleSignOutConfirm}
        />
      </ScrollView>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  profileCardWrap: { paddingTop: 0 },
  profileCard: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: C.statsZone,
    shadowColor: C.deepBlue,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  headerZone: { paddingTop: 28, paddingBottom: 22, paddingHorizontal: 20, overflow: "hidden" },
  headerGlowA: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: C.sky,
    opacity: 0.25,
    top: -55,
    right: -45,
  },
  headerGlowB: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.gold,
    opacity: 0.18,
    bottom: -10,
    left: -25,
  },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  editBadge: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    right: -2,
    bottom: -2,
    backgroundColor: C.gold,
    borderWidth: 3,
    borderColor: C.deepBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { marginTop: 10, fontSize: 19, fontWeight: "700", color: "#fff" },
  subtitle: { color: "#C9D3FF", fontSize: 13, marginTop: 2 },
  chipsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  chipGold: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.gold,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipGoldText: { color: C.ink, fontSize: 12, fontWeight: "700" },
  chipGhost: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipGhostText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  statsZone: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  statPill: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  statIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: C.ink },
  statLabel: { fontSize: 11, color: C.slate, textAlign: "center" },

  editProfileButton: {
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  editProfileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },

  section: { marginTop: 24 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: C.ink },
  seeAllRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { color: C.royal, fontSize: 12.5, fontWeight: "600" },

  badgesCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: C.deepBlue,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  badgeItem: { alignItems: "center", gap: 6, width: 60 },
  badgeIconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  badgeLock: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    bottom: -3,
    right: -3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeLabel: { fontSize: 10.5, fontWeight: "600", textAlign: "center" },

  settingsCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    shadowColor: C.deepBlue,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    overflow: "hidden",
  },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  settingIconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  settingTitle: { fontSize: 14.5, fontWeight: "600", color: C.ink },
  settingSubtitle: { fontSize: 12, color: C.slate, marginTop: 1 },
  divider: { height: 1, backgroundColor: C.border, marginLeft: 66 },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(16,22,53,0.55)", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20 
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cropCard: { width: "100%", maxWidth: 340, backgroundColor: C.card, borderRadius: 24, overflow: "hidden" },
  cropHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  cropTitle: { fontSize: 16, fontWeight: "700", color: C.ink },
  cropCloseBtn: { backgroundColor: "#F2F3F9", borderRadius: 999, padding: 6 },
  cropStageOuter: { alignItems: "center", paddingVertical: 12, backgroundColor: "#0E1230" },
  cropStage: { width: FRAME, height: FRAME, overflow: "hidden" },
  zoomRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 8 },
  customSliderContainer: { flex: 1, alignItems: "center" },
  customSliderTrack: { width: "100%", height: 4, backgroundColor: "#D9DCEA", borderRadius: 2, position: "relative" },
  customSliderFill: { height: "100%", backgroundColor: C.royal, borderRadius: 2 },
  customSliderThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.royal,
    marginLeft: -8,
  },
  customSliderButtons: { flexDirection: "row", gap: 16, marginTop: 8 },
  customSliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F3F9",
    alignItems: "center",
    justifyContent: "center",
  },
  customSliderButtonText: { fontSize: 18, fontWeight: "700", color: C.ink },
  cropActionsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 },
  cropCancelBtn: { flex: 1, backgroundColor: "#F2F3F9", borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  cropCancelText: { color: C.ink, fontSize: 14, fontWeight: "600" },
  cropSaveBtn: {
    flex: 1,
    backgroundColor: C.royal,
    borderRadius: 999,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cropSaveText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // Edit Modal Styles
  editModalCard: {
    width: '100%',
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: C.deepBlue,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: C.ink,
    textAlign: 'center',
    marginBottom: 20,
  },
  editModalImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editModalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    marginBottom: 6,
  },
  editModalCameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editModalChangePhoto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
  },
  editModalField: {
    marginBottom: 16,
    width: '100%',
  },
  editModalFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  editModalInput: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
  },
  editModalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editModalFieldNote: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  editModalToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 20,
    width: '100%',
  },
  editModalToggleLeft: {
    flex: 1,
    marginRight: 12,
  },
  editModalToggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  editModalToggleDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  editModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  editModalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(17,24,39,0.05)',
  },
  editModalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  editModalSaveButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  editModalSaveGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  editModalSaveText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Sign Out Modal Styles (CENTERED)
  signOutCard: { 
    width: "100%", 
    maxWidth: 320, 
    backgroundColor: C.card, 
    borderRadius: 24, 
    padding: 24, 
    alignItems: "center",
    alignSelf: 'center',
  },
  signOutIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.danger + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  signOutTitle: { fontSize: 17, fontWeight: "700", color: C.ink, textAlign: "center" },
  signOutSubtitle: { fontSize: 13, color: C.slate, textAlign: "center", marginTop: 6, lineHeight: 18 },
  signOutConfirmBtn: { 
    flex: 1, 
    backgroundColor: C.danger, 
    borderRadius: 999, 
    paddingVertical: 12, 
    alignItems: "center",
  },
});