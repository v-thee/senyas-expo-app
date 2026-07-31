// app/quiz/QuizDND.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  Modal,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import SplashScreen from '../screens/LoadingCompute';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Images ──
const images: Record<string, any> = {
  a: require('@/assets/images/alphabet/a.jpg'),
  b: require('@/assets/images/alphabet/b.jpg'),
  c: require('@/assets/images/alphabet/c.jpg'),
  d: require('@/assets/images/alphabet/d.jpg'),
  e: require('@/assets/images/alphabet/e.jpg'),
  f: require('@/assets/images/alphabet/f.jpg'),
  g: require('@/assets/images/alphabet/g.jpg'),
  h: require('@/assets/images/alphabet/h.jpg'),
  i: require('@/assets/images/alphabet/i.jpg'),
  j: require('@/assets/images/alphabet/j.jpg'),
  k: require('@/assets/images/alphabet/k.jpg'),
  l: require('@/assets/images/alphabet/l.jpg'),
  m: require('@/assets/images/alphabet/m.jpg'),
  n: require('@/assets/images/alphabet/n.jpg'),
  o: require('@/assets/images/alphabet/o.jpg'),
  p: require('@/assets/images/alphabet/p.jpg'),
  q: require('@/assets/images/alphabet/q.jpg'),
  r: require('@/assets/images/alphabet/r.jpg'),
  s: require('@/assets/images/alphabet/s.jpg'),
  t: require('@/assets/images/alphabet/t.jpg'),
  u: require('@/assets/images/alphabet/u.jpg'),
  v: require('@/assets/images/alphabet/v.jpg'),
  w: require('@/assets/images/alphabet/w.jpg'),
  x: require('@/assets/images/alphabet/x.jpg'),
  y: require('@/assets/images/alphabet/y.jpg'),
  z: require('@/assets/images/alphabet/z.jpg'),
};

// ── Design Tokens ──
const C = {
  deepBlue: '#152B6B',
  royal: '#2647B8',
  royalLight: '#3B5FE0',
  sky: '#5EC8FA',
  gold: '#FFC542',
  goldDeep: '#F2A400',
  streak: '#FF8A3D',
  ink: '#101635',
  slate: '#565E80',
  slateLight: '#AEB4CE',
  card: '#FFFFFF',
  bg: '#EEF1FB',
  statsZone: '#E7EEFF',
  danger: '#EF4444',
  border: '#DCE4FA',
  success: '#10B981',
  needsWork: '#F59E0B',
};

// ── Icons ──
function ArrowLeft({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckCircle({ size = 24, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill={color + '18'} />
      <Path d="M7 12l3 3 7-7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XCircle({ size = 24, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill={color + '18'} />
      <Path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Clock({ size = 20, color = '#6B7492' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Hand({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 12V6a2 2 0 114 0v5m0-4a2 2 0 114 0v4m0-2a2 2 0 114 0v3.5c0 3.6-2.4 6.5-8 6.5s-6.5-2.7-7.4-5.2c-.5-1.4.2-2.6 1.3-2.9 1-.3 1.9.2 2.4 1.1"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Trophy({ size = 24, color = '#FFC542' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h12v4a6 6 0 01-12 0V3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 13v8M8 21h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M18 7a6 6 0 01-12 0M6 3v5a6 6 0 0012 0V3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Home({ size = 24, color = '#2647B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Confetti Component ──
const Confetti = ({ active }: { active: boolean }) => {
  const [particles] = useState(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: -20 - Math.random() * 100,
      size: 4 + Math.random() * 10,
      color: ['#FFC542', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF8A3D', '#A29BFE', '#FF6B9D', '#00D2FF', '#FFD93D'][Math.floor(Math.random() * 10)],
      speed: 2 + Math.random() * 5,
      angle: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
    }))
  );
  
  const [positions, setPositions] = useState(particles.map(p => ({ ...p, y: p.y })));

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setPositions(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.speed * 1.8,
          x: p.x + Math.sin(p.y / 100) * p.angle * 1.5,
          rotation: p.rotation + 3,
        }))
      );
    }, 16);

    const resetInterval = setInterval(() => {
      setPositions(prev =>
        prev.map(p => ({
          ...p,
          y: p.y > SCREEN_HEIGHT + 50 ? -20 - Math.random() * 100 : p.y,
          x: p.x > SCREEN_WIDTH + 50 ? Math.random() * SCREEN_WIDTH : p.x < -50 ? Math.random() * SCREEN_WIDTH : p.x,
        }))
      );
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {positions.map(p => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            transform: [{ rotate: `${p.rotation}deg` }],
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
};

// ── Types ──
interface DragItem {
  id: string;
  letter: string;
  description: string;
  imageKey: string;
}

interface DropZone {
  id: string;
  letter: string;
  correctItemId: string;
}

interface StudentRank {
  id: number;
  name: string;
  score: number;
  time: number;
}

interface DragDropGameProps {
  lessonId: number;
  onExit: () => void;
}

type Layout = { x: number; y: number; width: number; height: number };

// ── Activity Data - Grouped by Sets ──
const SETS = [
  {
    name: 'Set 1',
    items: [
      { id: 'item-a', letter: 'A', description: 'Fist with thumb on side', imageKey: 'a' },
      { id: 'item-b', letter: 'B', description: 'Open palm, thumb across', imageKey: 'b' },
      { id: 'item-c', letter: 'C', description: 'Curved "C" shape', imageKey: 'c' },
    ],
    zones: [
      { id: 'zone-a', letter: 'A', correctItemId: 'item-a' },
      { id: 'zone-b', letter: 'B', correctItemId: 'item-b' },
      { id: 'zone-c', letter: 'C', correctItemId: 'item-c' },
    ],
  },
  {
    name: 'Set 2',
    items: [
      { id: 'item-d', letter: 'D', description: 'Index up, thumb touches fingers', imageKey: 'd' },
      { id: 'item-i', letter: 'I', description: 'Pinky finger straight up', imageKey: 'i' },
      { id: 'item-l', letter: 'L', description: 'Index up, thumb to side', imageKey: 'l' },
    ],
    zones: [
      { id: 'zone-d', letter: 'D', correctItemId: 'item-d' },
      { id: 'zone-i', letter: 'I', correctItemId: 'item-i' },
      { id: 'zone-l', letter: 'L', correctItemId: 'item-l' },
    ],
  },
  {
    name: 'Set 3',
    items: [
      { id: 'item-r', letter: 'R', description: 'Index crossed over middle', imageKey: 'r' },
      { id: 'item-v', letter: 'V', description: 'Index & middle in "V" shape', imageKey: 'v' },
      { id: 'item-y', letter: 'Y', description: 'Thumb & pinky extended (hang loose)', imageKey: 'y' },
      { id: 'item-z', letter: 'Z', description: 'Index finger tracing "Z" in air', imageKey: 'z' },
    ],
    zones: [
      { id: 'zone-r', letter: 'R', correctItemId: 'item-r' },
      { id: 'zone-v', letter: 'V', correctItemId: 'item-v' },
      { id: 'zone-y', letter: 'Y', correctItemId: 'item-y' },
      { id: 'zone-z', letter: 'Z', correctItemId: 'item-z' },
    ],
  },
];

const CARD_GAP = 12;
const CARD_SIZE = (SCREEN_WIDTH - 20 * 2 - CARD_GAP * 2) / 3;
const ACTIVE_CARD_SIZE = Math.min(SCREEN_WIDTH * 0.48, 190);

// ── Main Component ──
export default function QuizDND({ lessonId, onExit }: DragDropGameProps) {
  const insets = useSafeAreaInsets();

  // State
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [placedItems, setPlacedItems] = useState<Map<string, string>>(new Map());
  const [placedWrongItems, setPlacedWrongItems] = useState<Map<string, string>>(new Map());
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [studentRankings, setStudentRankings] = useState<StudentRank[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Refs for measuring drop zones & cards in page (absolute) coordinates
  const zoneRefs = useRef<Map<string, View>>(new Map());
  const zoneLayouts = useRef<Map<string, Layout>>(new Map());

  // Animation refs — only one card is ever being dragged at a time
  const pan = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayScale = useRef(new Animated.Value(1)).current;
  const overlayRotate = useRef(new Animated.Value(0)).current;

  // ── API Functions ──
  const API_URL = 'http://192.168.24.206/api/api.php';

  const getUserId = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userId');
    } catch (error) {
      console.error('Error getting userId:', error);
      return null;
    }
  };

  const getUserName = async (): Promise<string> => {
    try {
      const userId = await getUserId();
      if (!userId) return 'Student';

      const response = await fetch(`${API_URL}?action=getUser&id=${userId}`);
      const data = await response.json();

      if (data.status === 'success' && data.user) {
        return data.user.name || 'Student';
      }
      return 'Student';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Student';
    }
  };

  const getDragDropRankings = async (): Promise<StudentRank[]> => {
    try {
      const response = await fetch(`${API_URL}?action=getDragDropRankings&lesson_id=${lessonId}`);
      const data = await response.json();

      if (data.status === 'success' && data.rankings) {
        return data.rankings.map((item: any) => ({
          id: item.id,
          name: item.name,
          score: item.score,
          time: item.time,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching drag & drop rankings:', error);
      return [];
    }
  };

  const saveDragDropResult = async (score: number, time: number) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('❌ No userId found, skipping save');
        return;
      }

      console.log('📤 Saving DND result:', { userId, score, time, lessonId });

      const formData = new FormData();
      formData.append('action', 'saveDragDropResult');
      formData.append('user_id', userId);
      formData.append('score', score.toString());
      formData.append('total_items', totalAllItems.toString());
      formData.append('time', time.toString());
      formData.append('attempts', attempts.toString());
      formData.append('lesson_id', lessonId.toString());

      const response = await fetch(`${API_URL}?action=saveDragDropResult`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('📥 DND result response:', data);

      if (data.status === 'success') {
        console.log('✅ Drag & drop result saved successfully!');
      } else {
        console.log('❌ Failed to save drag & drop result:', data.message);
      }
    } catch (error) {
      console.error('❌ Error saving drag & drop result:', error);
    }
  };

  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const rankings = await getDragDropRankings();
      const filteredRankings = rankings.filter(r => r.score > 0);
      
      const userExists = filteredRankings.some(r => r.name === studentName);
      if (!userExists && score > 0) {
        filteredRankings.push({
          id: 999,
          name: studentName,
          score: score,
          time: timeSpent,
        });
      }

      const sorted = filteredRankings.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
      });

      setStudentRankings(sorted);
    } catch (error) {
      console.error('Error in fetchRankings:', error);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // ── Get current set ──
  const currentSet = SETS[currentSetIndex];
  const currentItems = currentSet?.items || [];
  const currentZones = currentSet?.zones || [];
  const totalAllItems = SETS.reduce((sum, set) => sum + set.items.length, 0);

  const availableItems = currentItems.filter(
    (item) => !placedItems.has(item.id) && !placedWrongItems.has(item.id)
  );

  // ── Reset on new lesson ──
  useEffect(() => {
    setPlacedItems(new Map());
    setPlacedWrongItems(new Map());
    setScore(0);
    setAttempts(0);
    setShowResult(false);
    setCurrentSetIndex(0);
    setHoveredZoneId(null);
    setDraggedItem(null);
    setStartTime(Date.now());
    setConfettiActive(false);

    const initUser = async () => {
      const name = await getUserName();
      setStudentName(name);
    };
    initUser();

    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [lessonId]);

  // ── Re-measure all drop zones ──
  const remeasureZones = useCallback(() => {
    for (const zone of currentZones) {
      const ref = zoneRefs.current.get(zone.id);
      if (ref) {
        ref.measureInWindow((x, y, width, height) => {
          zoneLayouts.current.set(zone.id, { x, y, width, height });
        });
      }
    }
  }, [currentZones]);

  // ── Hit test using page coordinates ──
  const getZoneAtPoint = useCallback(
    (pageX: number, pageY: number): string | null => {
      for (const zone of currentZones) {
        const filled =
          Array.from(placedItems.values()).includes(zone.id) ||
          Array.from(placedWrongItems.values()).includes(zone.id);
        if (filled) continue;

        const layout = zoneLayouts.current.get(zone.id);
        if (!layout) continue;

        const isOver =
          pageX >= layout.x &&
          pageX <= layout.x + layout.width &&
          pageY >= layout.y &&
          pageY <= layout.y + layout.height;

        if (isOver) return zone.id;
      }
      return null;
    },
    [currentZones, placedItems, placedWrongItems]
  );

  // ── Handle drop on zone ──
  const handleDropOnZone = useCallback(
    (item: DragItem, zone: DropZone) => {
      const isCorrect = item.id === zone.correctItemId;
      setAttempts((prev) => prev + 1);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setPlacedItems((prev) => new Map(prev).set(item.id, zone.id));
      } else {
        setPlacedWrongItems((prev) => new Map(prev).set(item.id, zone.id));
      }

      const answeredInSet =
        currentItems.filter((it) => it.id === item.id || placedItems.has(it.id) || placedWrongItems.has(it.id))
          .length;
      const totalPlacedOverall =
        placedItems.size + placedWrongItems.size + 1;

      if (answeredInSet >= currentItems.length) {
        if (totalPlacedOverall >= totalAllItems) {
          // All done - save result and show loading
          const endTime = Date.now();
          const totalTime = Math.floor((endTime - startTime) / 1000);
          setTimeSpent(totalTime);
          saveDragDropResult(score + (isCorrect ? 1 : 0), totalTime);

          setTimeout(() => {
            setShowLoading(true);
          }, 400);
        } else {
          setTimeout(() => {
            setCurrentSetIndex((prev) => prev + 1);
          }, 400);
        }
      }
    },
    [currentItems, placedItems, placedWrongItems, totalAllItems, score, startTime, lessonId]
  );

  // ── Build a PanResponder bound to a specific card ──
  const createPanResponderFor = (item: DragItem) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
      onPanResponderGrant: () => {
        pan.setValue({ x: 0, y: 0 });
        overlayScale.setValue(1.08);
        overlayRotate.setValue(0);
        setDraggedItem(item);
        setHoveredZoneId(null);
      },
      onPanResponderMove: (evt, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        overlayRotate.setValue(gesture.dx * 0.15);
        const zoneId = getZoneAtPoint(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        setHoveredZoneId(zoneId);
      },
      onPanResponderRelease: (evt) => {
        const zoneId = getZoneAtPoint(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        const zone = zoneId ? currentZones.find((z) => z.id === zoneId) : null;

        if (zone) {
          handleDropOnZone(item, zone);
          pan.setValue({ x: 0, y: 0 });
          setDraggedItem(null);
          setHoveredZoneId(null);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true, tension: 60, friction: 8 }).start(
            () => {
              setDraggedItem(null);
              setHoveredZoneId(null);
            }
          );
        }
      },
      onPanResponderTerminate: () => {
        pan.setValue({ x: 0, y: 0 });
        setDraggedItem(null);
        setHoveredZoneId(null);
      },
    });

  // ── Render draggable card ──
  const renderDragItem = (item: DragItem, size: number = CARD_SIZE) => {
    const isDragging = draggedItem?.id === item.id;
    const imageSource = images[item.imageKey];
    const responder = createPanResponderFor(item);

    const rotateInterpolation = overlayRotate.interpolate({
      inputRange: [-20, 20],
      outputRange: ['-4deg', '4deg'],
      extrapolate: 'clamp',
    });

    const slotStyle = { width: size, height: size + 34 };
    const imageStyle = { width: size * 0.56, height: size * 0.56, borderRadius: 12, backgroundColor: C.statsZone };
    const isLarge = size > CARD_SIZE;

    const cardBody = (
      <View style={[styles.card, isDragging && styles.cardActive]}>
        {isLarge && <View style={styles.cardGlow} pointerEvents="none" />}
        <View style={styles.cardImageWrap}>
          <Image source={imageSource} style={imageStyle} resizeMode="contain" />
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    );

    return (
      <View key={item.id} style={[styles.dragItemSlot, slotStyle]}>
        <View style={[styles.card, isDragging && styles.cardGhost]}>
          {!isDragging && (
            <>
              {isLarge && <View style={styles.cardGlow} pointerEvents="none" />}
              <View style={styles.cardImageWrap}>
                <Image source={imageSource} style={imageStyle} resizeMode="contain" />
              </View>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </>
          )}
        </View>

        <Animated.View
          {...responder.panHandlers}
          style={[
            styles.dragFloating,
            slotStyle,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: isDragging ? overlayScale : 1 },
                { rotate: isDragging ? rotateInterpolation : '0deg' },
              ],
              zIndex: isDragging ? 999 : 1,
              elevation: isDragging ? 12 : 1,
            },
          ]}
        >
          {cardBody}
        </Animated.View>
      </View>
    );
  };

  // ── Render drop zone ──
  const renderDropZone = (zone: DropZone) => {
    const correctPlacedItemId = Array.from(placedItems.entries()).find(([_, z]) => z === zone.id)?.[0];
    const wrongPlacedItemId = Array.from(placedWrongItems.entries()).find(([_, z]) => z === zone.id)?.[0];
    const placedItemId = correctPlacedItemId || wrongPlacedItemId;
    const placedItem = placedItemId ? currentItems.find((item) => item.id === placedItemId) : null;
    const isCorrect = !!correctPlacedItemId;
    const isWrong = !!wrongPlacedItemId;
    const isHovered = hoveredZoneId === zone.id && !placedItemId;

    return (
      <View
        key={zone.id}
        ref={(ref) => {
          if (ref) {
            zoneRefs.current.set(zone.id, ref);
            ref.measureInWindow((x, y, width, height) => {
              zoneLayouts.current.set(zone.id, { x, y, width, height });
            });
          }
        }}
        onLayout={() => {
          const ref = zoneRefs.current.get(zone.id);
          if (ref) {
            ref.measureInWindow((x, y, width, height) => {
              zoneLayouts.current.set(zone.id, { x, y, width, height });
            });
          }
        }}
        style={[
          styles.dropZone,
          placedItemId && styles.dropZoneFilled,
          isCorrect && styles.dropZoneCorrect,
          isWrong && styles.dropZoneWrong,
          isHovered && styles.dropZoneHovered,
        ]}
      >
        <Text style={styles.dropZoneWatermark} pointerEvents="none">
          {zone.letter}
        </Text>

        <LinearGradient
          colors={isCorrect ? [C.success, '#0D9A6E'] : isWrong ? [C.danger, '#C63838'] : [C.royal, C.royalLight]}
          style={styles.dropZoneLetterBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.dropZoneLetterText}>{zone.letter}</Text>
        </LinearGradient>

        {placedItem ? (
          <View style={styles.dropZoneFilledContent}>
            <Image source={images[placedItem.imageKey]} style={styles.dropZoneImage} resizeMode="contain" />
            {isCorrect ? <CheckCircle size={22} color={C.success} /> : <XCircle size={22} color={C.danger} />}
          </View>
        ) : (
          <Text style={[styles.dropZoneHint, isHovered && styles.dropZoneHintHovered]}>
            {isHovered ? 'Release to drop' : 'Place card here'}
          </Text>
        )}
      </View>
    );
  };

  // ── Render Loading ──
  const renderLoading = () => (
    <SplashScreen
      onFinish={() => {
        setShowLoading(false);
        setShowResult(true);
        fetchRankings();
        // Trigger confetti if score is above 50%
        if (score > totalAllItems / 2) {
          setConfettiActive(true);
          setTimeout(() => setConfettiActive(false), 5000);
        }
      }}
    />
  );

  // ── Render Result ──
  const renderResult = () => {
    const total = totalAllItems;
    const percentage = (score / total) * 100;
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    const grade = percentage >= 90 ? 'A' : percentage >= 70 ? 'B' : percentage >= 50 ? 'C' : 'D';
    const description = percentage >= 90
      ? 'Excellent! Outstanding performance! 🌟'
      : percentage >= 70
      ? 'Very Good! Keep up the great work! 👏'
      : percentage >= 50
      ? "Good! You're making progress! 💪"
      : 'Keep practicing! Review the lessons! 📚';

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    };

    const getLessonTitle = () => {
      return `FSL Alphabet Matching - ${currentSet?.name || 'Drag & Drop'}`;
    };

    return (
      <View style={styles.resultContainer}>
        <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />
        
        <Confetti active={confettiActive} />
        
        <ScrollView 
          style={styles.examResultScroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🎉 Activity Complete!</Text>
              <Text style={styles.resultSubtitle}>{getLessonTitle()}</Text>
            </View>

            <View style={styles.resultScoreContainer}>
              <Text style={styles.resultScore}>{score}</Text>
              <Text style={styles.resultTotal}>/ {total}</Text>
            </View>

            <View style={styles.resultStars}>
              {[1, 2, 3].map((i) => (
                <Text key={i} style={[styles.starIcon, { color: i <= stars ? C.gold : '#DCE4FA' }]}>★</Text>
              ))}
            </View>

            <View style={styles.resultGrade}>
              <Text style={styles.resultGradeText}>Grade: {grade}</Text>
            </View>

            <Text style={styles.resultDescription}>{description}</Text>

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Correct</Text>
                <Text style={styles.resultStatValue}>{score}</Text>
              </View>
              <View style={styles.resultStatDivider} />
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Wrong</Text>
                <Text style={styles.resultStatValue}>{total - score}</Text>
              </View>
              <View style={styles.resultStatDivider} />
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Percentage</Text>
                <Text style={styles.resultStatValue}>{Math.round(percentage)}%</Text>
              </View>
            </View>

            <View style={styles.timeContainer}>
              <Clock size={20} color={C.slate} />
              <Text style={styles.timeText}>Time Spent: {formatTime(timeSpent)}</Text>
            </View>

            {/* Ranking Section */}
            <View style={styles.rankContainer}>
              <Text style={styles.rankTitle}>🏆 Student Rankings</Text>
              
              {isLoadingRankings ? (
                <View style={styles.loadingRankings}>
                  <Text style={styles.loadingRankingsText}>Loading rankings...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.rankHeader}>
                    <Text style={[styles.rankHeaderText, { width: 50 }]}>#</Text>
                    <Text style={[styles.rankHeaderText, { flex: 1 }]}>Name</Text>
                    <Text style={[styles.rankHeaderText, { width: 60 }]}>Score</Text>
                    <Text style={[styles.rankHeaderText, { width: 70 }]}>Time</Text>
                  </View>

                  {studentRankings.slice(0, 10).map((student, index) => {
                    const isUser = student.name === studentName;
                    const rankNumber = index + 1;
                    const medalEmoji = rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : rankNumber === 3 ? '🥉' : `#${rankNumber}`;
                    
                    return (
                      <View 
                        key={student.id}
                        style={[
                          styles.rankItem,
                          isUser && styles.userRankItem,
                          rankNumber <= 3 && styles.topRankItem
                        ]}
                      >
                        <Text style={[styles.rankPosition, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {medalEmoji}
                        </Text>
                        <Text style={[styles.rankName, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {student.name} {isUser && '(You)'}
                        </Text>
                        <Text style={[styles.rankScore, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {student.score}/{total}
                        </Text>
                        <Text style={[styles.rankTime, isUser && styles.userRankText, rankNumber <= 3 && styles.topRankText]}>
                          {formatTime(student.time)}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
            </View>

            {/* Exit Button */}
            <View style={styles.resultButtonContainer}>
              <TouchableOpacity
                style={styles.resultButton}
                onPress={() => {
                  console.log("RESULT EXIT PRESSED");
                  setShowConfirmationModal(true);
                }}
              >
                <LinearGradient
                  colors={[C.royal, C.royalLight]}
                  style={styles.resultButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Home size={20} color="#fff" />
                  <Text style={[styles.resultButtonText, { marginLeft: 8 }]}>Exit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal visible={showConfirmationModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Exit Activity?</Text>
                <Text style={styles.modalDescription}>
                  Are you sure you want to exit? Your progress will be saved.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => {
                      console.log("MODAL CANCEL");
                      setShowConfirmationModal(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={() => {
                      setShowConfirmationModal(false);
                      onExit();
                    }}
                  >
                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>Exit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // ── Render Exit Modal ──
  const renderExitModal = () => (
    <Modal visible={showExitModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exit Activity?</Text>
            <Text style={styles.modalDescription}>Are you sure you want to exit? Your progress will be lost.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setShowExitModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={onExit}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ── Main Render ──
  if (showLoading) return renderLoading();
  if (showResult) return renderResult();

  const totalSets = SETS.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setShowExitModal(true)} style={styles.backBtn}>
            <ArrowLeft size={26} color={C.royal} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.pageTitle}>Match the Signs</Text>
            <Text style={styles.lessonTitle}>{currentSet?.name} · FSL Alphabet</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>
                {score}/{totalAllItems}
              </Text>
            </View>
            {attempts > 0 && (
              <Text style={styles.accuracyText}>{Math.round((score / attempts) * 100)}% accurate</Text>
            )}
          </View>
        </View>

        {/* Set progress bar */}
        <View style={styles.progressTrack}>
          {Array.from({ length: totalSets }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                index < currentSetIndex && styles.progressSegmentDone,
                index === currentSetIndex && styles.progressSegmentActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.instructionPill}>
          <Hand size={16} color={C.royal} />
          <Text style={styles.instructionText}>Drag this card onto its matching letter</Text>
        </View>
      </View>

      <Animated.View style={[styles.gameContainer, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!draggedItem}
          onScrollEndDrag={remeasureZones}
          onMomentumScrollEnd={remeasureZones}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <View style={styles.boardRow}>
            {/* Current card, one at a time */}
            <View style={styles.boardColumn}>
              <View style={styles.cardsHeaderRow}>
                <Text style={styles.columnLabel}>Current Card</Text>
                {availableItems.length > 0 && (
                  <Text style={styles.cardsCounter}>
                    {currentItems.length - availableItems.length + 1} of {currentItems.length}
                  </Text>
                )}
              </View>
              <View style={styles.cardStage}>
                {availableItems.length > 0 ? (
                  <>
                    {renderDragItem(availableItems[0], ACTIVE_CARD_SIZE)}
                    {availableItems.length > 1 && (
                      <View style={styles.upNextRow}>
                        <Text style={styles.upNextLabel}>Up next:</Text>
                        {availableItems.slice(1).map((item, idx) => (
                          <View
                            key={item.id}
                            style={[styles.upNextThumb, { transform: [{ rotate: `${idx % 2 === 0 ? -6 : 6}deg` }] }]}
                          >
                            <Image source={images[item.imageKey]} style={styles.upNextImage} resizeMode="contain" />
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.emptyItems}>
                    <CheckCircle size={28} color={C.success} />
                    <Text style={styles.emptyItemsText}>All placed!</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Drop zones */}
          <View style={styles.zonesSection}>
            <Text style={styles.columnLabel}>Letters</Text>
            <View style={styles.zonesGrid}>{currentZones.map((zone) => renderDropZone(zone))}</View>
          </View>
        </ScrollView>
      </Animated.View>

      {renderExitModal()}
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: { flex: 1 },

  blobContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 9999 },
  blob1: { width: 300, height: 300, top: -100, right: -100, backgroundColor: 'rgba(37, 99, 235, 0.04)' },
  blob2: { width: 200, height: 200, bottom: 100, left: -80, backgroundColor: 'rgba(245, 158, 11, 0.05)' },
  blob3: { width: 150, height: 150, top: '40%', right: -50, backgroundColor: 'rgba(124, 58, 237, 0.04)' },

  header: { paddingHorizontal: 20, paddingBottom: 14, backgroundColor: 'transparent' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { flex: 1 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: C.ink },
  lessonTitle: { fontSize: 13, fontWeight: '600', color: C.slate, marginTop: 1 },
  headerStats: { alignItems: 'flex-end', gap: 3 },
  scoreBadge: {
    backgroundColor: C.royal + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.royal + '44',
  },
  scoreBadgeText: { fontSize: 16, fontWeight: '700', color: C.royal },
  accuracyText: { fontSize: 10.5, fontWeight: '700', color: C.slate },

  progressTrack: { flexDirection: 'row', gap: 6, marginTop: 14 },
  progressSegment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.border },
  progressSegmentDone: { backgroundColor: C.success },
  progressSegmentActive: { backgroundColor: C.royal },

  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: C.royal,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 14,
    shadowColor: C.royal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionText: { fontSize: 12.5, fontWeight: '600', color: '#fff' },

  gameContainer: { flex: 1, paddingHorizontal: 20 },

  columnLabel: { fontSize: 13, fontWeight: '800', color: C.slate, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },

  boardRow: { marginTop: 6 },
  boardColumn: {},

  cardsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardsCounter: { fontSize: 13, fontWeight: '700', color: C.royal, marginBottom: 10 },
  cardStage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ACTIVE_CARD_SIZE + 20,
  },
  upNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  upNextLabel: { fontSize: 12, fontWeight: '600', color: C.slateLight, marginRight: 2 },
  upNextThumb: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  upNextImage: { width: 22, height: 22, borderRadius: 5 },
  dragItemSlot: {
    width: CARD_SIZE,
    height: CARD_SIZE + 34,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: C.deepBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGhost: {
    borderStyle: 'dashed',
    borderColor: C.slateLight,
    backgroundColor: C.bg,
  },
  cardActive: {
    borderColor: C.royal,
    borderWidth: 2,
    shadowColor: C.royal,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
  },
  cardImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cardGlow: {
    position: 'absolute',
    top: '8%',
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: C.sky + '33',
  },
  cardDesc: {
    fontSize: 9.5,
    fontWeight: '600',
    color: C.slate,
    textAlign: 'center',
    marginTop: 4,
  },
  dragFloating: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_SIZE,
    height: CARD_SIZE + 34,
  },
  emptyItems: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    gap: 6,
  },
  emptyItemsText: { fontSize: 15, fontWeight: '700', color: C.success },

  zonesSection: { marginTop: 20 },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    paddingBottom: 24,
  },
  dropZone: {
    width: CARD_SIZE,
    minHeight: CARD_SIZE * 0.85,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    overflow: 'hidden',
  },
  dropZoneWatermark: {
    position: 'absolute',
    fontSize: CARD_SIZE * 0.95,
    fontWeight: '900',
    color: C.ink,
    opacity: 0.04,
    top: -CARD_SIZE * 0.18,
  },
  dropZoneFilled: { borderStyle: 'solid' },
  dropZoneCorrect: { borderColor: C.success, backgroundColor: C.success + '11' },
  dropZoneWrong: { borderColor: C.danger, backgroundColor: C.danger + '11' },
  dropZoneHovered: { borderColor: C.royal, backgroundColor: C.royal + '14', borderStyle: 'solid', transform: [{ scale: 1.04 }] },
  dropZoneLetterBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: C.deepBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  dropZoneLetterText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  dropZoneFilledContent: { alignItems: 'center', gap: 4 },
  dropZoneImage: { width: CARD_SIZE * 0.5, height: CARD_SIZE * 0.5, borderRadius: 8, backgroundColor: C.statsZone },
  dropZoneHint: { fontSize: 10.5, fontWeight: '600', color: C.slateLight, textAlign: 'center' },
  dropZoneHintHovered: { color: C.royal, fontWeight: '700' },

  // ── Result Styles ──
  resultContainer: { flex: 1, backgroundColor: '#F7FBFF' },
  examResultScroll: { flex: 1 },
  resultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginTop: 40,
    padding: 24,
    paddingTop: 50,
    borderRadius: 24,
    shadowColor: C.deepBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  resultHeader: { alignItems: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: '900', color: C.ink },
  resultSubtitle: { fontSize: 16, fontWeight: '500', color: C.slate, marginTop: 2 },
  resultScoreContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  resultScore: { fontSize: 64, fontWeight: '900', color: C.royal },
  resultTotal: { fontSize: 24, fontWeight: '600', color: C.slate },
  resultStars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  starIcon: { fontSize: 32 },
  resultGrade: { alignItems: 'center', marginTop: 8 },
  resultGradeText: { fontSize: 20, fontWeight: '700', color: C.goldDeep },
  resultDescription: { fontSize: 16, fontWeight: '500', color: C.slate, textAlign: 'center', marginTop: 8 },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: C.statsZone,
    borderRadius: 12,
  },
  resultStat: { alignItems: 'center', flex: 1 },
  resultStatDivider: { width: 1, backgroundColor: C.border },
  resultStatLabel: { fontSize: 12, fontWeight: '600', color: C.slate, marginBottom: 2 },
  resultStatValue: { fontSize: 18, fontWeight: '700', color: C.ink },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: C.statsZone,
    borderRadius: 8,
  },
  timeText: { fontSize: 14, fontWeight: '600', color: C.slate },

  // ── Ranking styles ──
  rankContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingRankings: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingRankingsText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.slate,
  },
  rankHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: C.statsZone,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.slate,
    textAlign: 'center',
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  topRankItem: {
    backgroundColor: C.gold + '15',
  },
  userRankItem: {
    backgroundColor: C.royal + '20',
    borderWidth: 2,
    borderColor: C.royal,
  },
  rankPosition: {
    width: 50,
    fontSize: 14,
    fontWeight: '700',
    color: C.slate,
    textAlign: 'center',
  },
  rankName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
  },
  rankScore: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: C.slate,
    textAlign: 'center',
  },
  rankTime: {
    width: 70,
    fontSize: 12,
    fontWeight: '500',
    color: C.slateLight,
    textAlign: 'center',
  },
  userRankText: {
    color: C.royal,
    fontWeight: '700',
  },
  topRankText: {
    color: C.goldDeep,
    fontWeight: '700',
  },

  resultButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultButton: {
    width: '60%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Modal styles ──
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: SCREEN_WIDTH - 48, borderRadius: 24, overflow: 'hidden' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: C.ink, textAlign: 'center', marginBottom: 8 },
  modalDescription: { fontSize: 16, fontWeight: '500', color: C.slate, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: C.statsZone },
  modalButtonConfirm: { backgroundColor: C.danger },
  modalButtonText: { fontSize: 16, fontWeight: '700', color: C.ink },
});