import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const images = {
  senyasLogo: require('@/assets/images/senyas_logo.png'),
  senyaMagnify: require('@/assets/images/senya_magnify.png'),
};

const API_URL = "http://192.168.109.206/api/api.php?action=login";

interface Props {
  onLogin: () => void;
}

// ── Real icons (Feather-style outlines), no emoji ──
function IdCardIcon({ size = 18, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth={2} />
      <Line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function LockIcon({ size = 18, color = '#1E3A8A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function EyeIcon({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function EyeOffIcon({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function AlertIcon({ size = 16, color = '#BE123C' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="17" r="1" fill={color} />
    </Svg>
  );
}

function SparkleIcon({ size = 16, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} opacity="0.6" />
      <Path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z" fill={color} opacity="0.4" />
      <Path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z" fill={color} opacity="0.4" />
    </Svg>
  );
}

function ArrowRightIcon({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 40, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M7 12L10 15L17 8" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XCircleIcon({ size = 40, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M8 8L16 16M16 8L8 16" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

// Glass surface
function GlassCard({
  children,
  style,
  intensity = 40,
}: {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
}) {
  return (
    <View style={[styles.glassWrap, style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.glassTint} pointerEvents="none" />
      {children}
    </View>
  );
}

/**
 * Login — Student sign-in form with elevated UI
 */
export default function Login({ onLogin }: Props) {
  const insets = useSafeAreaInsets();
  const [lrn,      setLrn]      = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  // Modal animation refs
  const modalFadeAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalSlideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  const isValid = lrn.trim().length >= 6 && password.length >= 4;

  // Modal show/hide functions
  const showModal = (type: 'success' | 'error', message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
    
    // Reset animations
    modalFadeAnim.setValue(0);
    modalScaleAnim.setValue(0.8);
    modalSlideAnim.setValue(50);
    progressAnim.setValue(0);
    progressWidth.setValue(0);

    // Animate modal in
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // If success, auto-dismiss after 3 seconds
    if (type === 'success') {
      // Animate progress bar
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      // Animate progress fill
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        dismissModal();
      }, 3000);
    }
  };

  const dismissModal = () => {
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
      Animated.timing(modalScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start(() => {
      setModalVisible(false);
      // If success, trigger onLogin
      if (modalType === 'success') {
        onLogin();
      }
    });
  };

  const handleLogin = async () => {
    if (!isValid) {
      showModal('error', 'Please enter a valid LRN and password.');
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentNumber: lrn,
          password: password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.status === "success") {
        showModal('success', 'Login successful! Welcome back! 🎉');
      } else {
        showModal('error', data.message || 'Check LRN and password, and try again.');
      }
    } catch (error) {
      setLoading(false);
      showModal('error', 'Unable to connect to the server. Please check your connection.');
      console.log(error);
    }
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  // Progress bar width interpolation
  const progressBarWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={['#BFE0F7', '#E4F1FB', '#F7FBFF']}
            style={StyleSheet.absoluteFill}
          />

          {/* Decorative floating blobs */}
          <View style={styles.blobContainer}>
            <View style={[styles.blob, styles.blob1]} />
            <View style={[styles.blob, styles.blob2]} />
            <View style={[styles.blob, styles.blob3]} />
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.bodyContent,
              { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              style={[
                styles.headerContainer,
                { 
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                }
              ]}
            >
              {/* ── Logo with enhanced visual ── */}
              <View style={styles.logoWrapper}>
                <View style={styles.logoGlow}>
                  <Image source={images.senyasLogo} style={styles.logoImage} resizeMode="contain" />
                </View>
                <Text style={styles.logoText}>SEÑAS</Text>
                <View style={styles.logoSubtitleContainer}>
                  <SparkleIcon size={14} color="#F59E0B" />
                  <Text style={styles.logoSubtitle}>Learn Filipino Sign Language</Text>
                  <SparkleIcon size={14} color="#F59E0B" />
                </View>
              </View>
            </Animated.View>

            {/* ── Form with card animation ── */}
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <GlassCard style={styles.formCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderIcon}>
                    <SparkleIcon size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.heading}>Welcome Back! 👋</Text>
                </View>
                <Text style={styles.subheading}>
                  Sign in with your Student LRN to continue your FSL journey
                </Text>

                {/* LRN field */}
                <View style={styles.fieldWrap}>
                  <View style={styles.fieldLabelRow}>
                    <IdCardIcon size={14} color="#1E3A8A" />
                    <Text style={styles.fieldLabel}>STUDENT LRN</Text>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your 12-digit LRN"
                      placeholderTextColor="#9AA3AE"
                      keyboardType="number-pad"
                      maxLength={12}
                      returnKeyType="next"
                      value={lrn}
                      onChangeText={t => { setLrn(t); setError(''); }}
                    />
                  </View>
                </View>

                {/* Password field */}
                <View style={styles.fieldWrap}>
                  <View style={styles.fieldLabelRow}>
                    <LockIcon size={14} color="#1E3A8A" />
                    <Text style={styles.fieldLabel}>PASSWORD</Text>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Enter your password"
                      placeholderTextColor="#9AA3AE"
                      secureTextEntry={!showPw}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      value={password}
                      onChangeText={t => { setPassword(t); setError(''); }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPw(v => !v)}
                      style={styles.eyeBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Inline error (kept for backward compatibility, but we use modal now) */}
                {error !== '' && (
                  <Animated.View style={[styles.errorBox, { 
                    opacity: fadeAnim,
                    transform: [{ scale: fadeAnim }],
                  }]}>
                    <AlertIcon size={16} color="#BE123C" />
                    <Text style={styles.errorText}>{error}</Text>
                  </Animated.View>
                )}

                {/* Sign In button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  activeOpacity={0.88}
                  disabled={loading}
                  style={{ marginTop: 8 }}
                >
                  <LinearGradient
                    colors={isValid ? ['#2F6FE0', '#1E3FAE'] : ['#B8C7EA', '#A7B8E0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.signInBtn, !isValid && styles.signInBtnDisabled]}
                  >
                    {loading
                      ? <ActivityIndicator color="#fff" size="small" />
                      : (
                        <View style={styles.btnContent}>
                          <Text style={styles.signInText}>Sign In</Text>
                          <ArrowRightIcon size={18} color="#fff" />
                        </View>
                      )}
                  </LinearGradient>
                </TouchableOpacity>
              </GlassCard>
            </Animated.View>

            {/* Senya helper note - Enhanced */}
            <Animated.View style={[styles.helperRow, { opacity: fadeAnim }]}>
              <View style={styles.helperAvatarWrapper}>
                <Image source={images.senyaMagnify} style={styles.helperLogo} resizeMode="contain" />
              </View>
              <GlassCard style={styles.helperBubble} intensity={30}>
                <Text style={styles.helperText}>
                  Your LRN is the 12-digit number on your school ID or report card. Ask your teacher if you need help!
                </Text>
              </GlassCard>
            </Animated.View>

            {/* Contact admin */}
            <Text style={styles.adminNote}>
              Having trouble logging in? Reach out to your teacher or admin
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={dismissModal}
      >
        <TouchableWithoutFeedback onPress={dismissModal}>
          <Animated.View 
            style={[
              styles.modalOverlay,
              {
                opacity: modalFadeAnim,
              }
            ]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [
                      { scale: modalScaleAnim },
                      { translateY: modalSlideAnim }
                    ],
                    opacity: modalFadeAnim,
                  }
                ]}
              >
                <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.modalInner}>
                  {/* Icon */}
                  <View style={styles.modalIconContainer}>
                    {modalType === 'success' ? (
                      <CheckCircleIcon size={48} color="#10B981" />
                    ) : (
                      <XCircleIcon size={48} color="#EF4444" />
                    )}
                  </View>

                  {/* Title */}
                  <Text style={styles.modalTitle}>
                    {modalType === 'success' ? 'Success!' : 'Oops!'}
                  </Text>

                  {/* Message */}
                  <Text style={styles.modalMessage}>
                    {modalMessage}
                  </Text>

                  {/* Progress bar (only for success) */}
                  {modalType === 'success' && (
                    <View style={styles.progressBarContainer}>
                      <Animated.View 
                        style={[
                          styles.progressBarFill,
                          { width: progressBarWidth }
                        ]}
                      />
                    </View>
                  )}

                  {/* Close button (only for error) */}
                  {modalType === 'error' && (
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={dismissModal}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#2F6FE0', '#1E3FAE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalButtonGradient}
                      >
                        <Text style={styles.modalButtonText}>Try Again</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bodyContent: {
    paddingHorizontal: 24,
  },

  // ── Glass primitive ──
  glassWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  // ── Decorative blobs ──
  blobContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blob1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
  },
  blob2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -80,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  blob3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -50,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },

  // ── Logo header ──
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 12,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 4,
    marginBottom: 4,
  },
  logoSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    letterSpacing: 0.5,
  },

  // ── Form card ──
  formCard: {
    padding: 24,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  subheading: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 24,
    paddingLeft: 42,
  },

  // ── Fields ──
  fieldWrap: { marginBottom: 18 },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(30,58,138,0.12)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 13,
    fontWeight: '500',
  },
  eyeBtn: { paddingLeft: 4 },

  // ── Error ──
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0F3',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFB3C1',
    padding: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#BE123C',
    fontWeight: '700',
    flexShrink: 1,
  },

  // ── Sign in button ──
  signInBtn: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1E3FAE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  signInBtnDisabled: {
    shadowOpacity: 0.1,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },

  // ── Helper bubble ──
  helperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  helperAvatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  helperLogo: {
    width: 60,
    height: 60,
  },
  helperBubble: {
    flex: 1,
    padding: 14,
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 18,
  },

  // ── Admin note ──
  adminNote: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 18,
  },

  // ── Modal styles ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 28,
    overflow: 'hidden',
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 380,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalInner: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  modalButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 8,
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
});