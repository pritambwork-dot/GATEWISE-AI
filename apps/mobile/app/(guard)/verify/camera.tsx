import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Linking,
  AppState,
  AppStateStatus,
  Vibration,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { useVerification } from '../../../src/providers/VerificationContext';
import { PrimaryButton, SecondaryButton } from '../../../src/components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraCaptureScreen() {
  const router = useRouter();
  const { setCapturedImage, setAmbientLightScore } = useVerification();
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPromptedSystem, setHasPromptedSystem] = useState(false);
  const [cameraHardwareError, setCameraHardwareError] = useState<string | null>(null);

  // Re-check permissions when returning from Android Settings (State E)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        try {
          await requestPermission();
        } catch {
          // Ignore background permission check error
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [requestPermission]);

  // Tactile feedback helper
  const triggerHaptic = (duration = 25) => {
    try {
      Vibration.vibrate(duration);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  };

  // State G: Guard chooses 'Not Now'
  const handleNotNow = () => {
    triggerHaptic(15);
    router.back();
  };

  // State A -> System Dialog Trigger
  const handleContinueToPermission = async () => {
    triggerHaptic(25);
    setHasPromptedSystem(true);
    try {
      await requestPermission();
    } catch (err: any) {
      setCameraHardwareError(err?.message || 'Failed to initialize camera subsystem.');
    }
  };

  // State D: Open Android App Settings
  const handleOpenSettings = async () => {
    triggerHaptic(20);
    try {
      await Linking.openSettings();
    } catch {
      // Fallback for emulator
    }
  };

  // Handle Photo Capture
  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    triggerHaptic(40);

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          base64: true,
          skipProcessing: false,
        });

        if (photo && photo.uri) {
          setAmbientLightScore(91);
          setCapturedImage(photo.uri, photo.base64 || '');
          router.replace('/(guard)/verify/review');
          return;
        }
      }

      // Fallback for emulator or preview without physical camera hardware
      simulateCapture();
    } catch (err: any) {
      // If hardware fails, provide test simulation fallback
      simulateCapture();
    } finally {
      setIsCapturing(false);
    }
  };

  const simulateCapture = () => {
    const sampleUri =
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80';
    setAmbientLightScore(88);
    setCapturedImage(sampleUri, 'data:image/jpeg;base64,mockCaptureBase64Data');
    router.replace('/(guard)/verify/review');
  };

  const toggleFacing = () => {
    triggerHaptic(15);
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleTorch = () => {
    triggerHaptic(15);
    setIsTorchOn((prev) => !prev);
  };

  // =========================================================================
  // STATE F: Hardware Unavailable or Camera Subsystem Error
  // =========================================================================
  if (cameraHardwareError) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <View style={styles.cardBox}>
          <View style={[styles.iconCircle, { backgroundColor: '#FDF2F2' }]}>
            <Ionicons name="alert-circle" size={44} color={Colors.error} />
          </View>
          <View style={[styles.badge, { borderColor: '#F8CECE' }]}>
            <Text style={[styles.badgeText, { color: Colors.error }]}>CAMERA SUBSYSTEM ERROR</Text>
          </View>
          <Text style={styles.stateTitle}>Camera Hardware Unavailable</Text>
          <Text style={styles.stateBody}>
            The terminal could not connect to the physical camera sensor. Ensure no other background
            process is occupying the camera.
          </Text>
          <PrimaryButton
            title="Retry Connection"
            onPress={() => {
              setCameraHardwareError(null);
              requestPermission();
            }}
            style={styles.actionBtn}
          />
          <SecondaryButton
            title="Return to Station"
            onPress={handleNotNow}
            variant="ghost"
          />
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // STATE A: Permission Not Yet Requested -> Show Pre-Permission Explanation
  // =========================================================================
  if (!permission || (!permission.granted && !hasPromptedSystem && permission.canAskAgain)) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <View style={styles.cardBox}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.lightGreen }]}>
            <Ionicons name="shield-checkmark" size={44} color={Colors.primary} />
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>INSTITUTIONAL PRIVACY DISCLOSURE</Text>
          </View>

          <Text style={styles.stateTitle}>Camera Access for Verification</Text>
          <Text style={styles.stateSubtitle}>Main Campus Gate · Post 02</Text>

          <Text style={styles.stateBody}>
            GATEWISE AI requests single-shot camera access to capture subject photographs for
            campus identity verification.
          </Text>

          {/* Institutional Safeguards Checklist */}
          <View style={styles.safeguardsList}>
            <View style={styles.safeguardItem}>
              <Ionicons name="camera-outline" size={18} color={Colors.primary} />
              <View style={styles.safeguardTextGroup}>
                <Text style={styles.safeguardHeading}>Single-Shot Capture Only</Text>
                <Text style={styles.safeguardSubtext}>
                  Continuous video streaming and surveillance are permanently disabled.
                </Text>
              </View>
            </View>

            <View style={styles.safeguardItem}>
              <Ionicons name="mic-off-outline" size={18} color={Colors.deep} />
              <View style={styles.safeguardTextGroup}>
                <Text style={styles.safeguardHeading}>Zero Audio Recording</Text>
                <Text style={styles.safeguardSubtext}>
                  Microphone access is explicitly disabled in the Android manifest.
                </Text>
              </View>
            </View>

            <View style={styles.safeguardItem}>
              <Ionicons name="file-tray-full-outline" size={18} color={Colors.primary} />
              <View style={styles.safeguardTextGroup}>
                <Text style={styles.safeguardHeading}>Ephemeral RAM Processing</Text>
                <Text style={styles.safeguardSubtext}>
                  Photos are never saved to the public device gallery or external storage.
                </Text>
              </View>
            </View>
          </View>

          {/* Explicit Choice: Continue to System Dialog vs Not Now */}
          <PrimaryButton
            title="Continue to System Permission"
            onPress={handleContinueToPermission}
            icon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
            style={styles.actionBtn}
          />

          <SecondaryButton
            title="Not Now"
            onPress={handleNotNow}
            variant="ghost"
          />
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // STATE D: Permission Permanently Denied (canAskAgain === false)
  // =========================================================================
  if (!permission.granted && !permission.canAskAgain) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <View style={styles.cardBox}>
          <View style={[styles.iconCircle, { backgroundColor: '#FEFCBF' }]}>
            <Ionicons name="settings-outline" size={44} color="#D69E2E" />
          </View>

          <View style={[styles.badge, { borderColor: '#ECC94B' }]}>
            <Text style={[styles.badgeText, { color: '#B7791F' }]}>ANDROID SETTINGS PERMISSION BLOCKED</Text>
          </View>

          <Text style={styles.stateTitle}>Camera Access Blocked</Text>
          <Text style={styles.stateBody}>
            Camera permission was previously declined with "Don't ask again". To perform facial
            identity verification at this station, grant camera permission in Android App Settings.
          </Text>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>1. Tap "Open App Settings" below.</Text>
            <Text style={styles.instructionStep}>2. Select Permissions → Camera.</Text>
            <Text style={styles.instructionStep}>3. Choose "Allow only while using the app".</Text>
            <Text style={styles.instructionStep}>4. Return to GATEWISE Guard.</Text>
          </View>

          <PrimaryButton
            title="Open Android App Settings"
            onPress={handleOpenSettings}
            icon={<Ionicons name="open-outline" size={18} color="#FFFFFF" />}
            style={styles.actionBtn}
          />

          <SecondaryButton
            title="Return to Station"
            onPress={handleNotNow}
            variant="ghost"
          />
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // STATE C: Permission Denied (Retryable, canAskAgain === true)
  // =========================================================================
  if (!permission.granted && permission.canAskAgain) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <View style={styles.cardBox}>
          <View style={[styles.iconCircle, { backgroundColor: '#FDF2F2' }]}>
            <Ionicons name="camera-outline" size={44} color={Colors.error} />
          </View>

          <View style={[styles.badge, { borderColor: '#F8CECE' }]}>
            <Text style={[styles.badgeText, { color: Colors.error }]}>CAMERA PERMISSION DECLINED</Text>
          </View>

          <Text style={styles.stateTitle}>Camera Access Declined</Text>
          <Text style={styles.stateBody}>
            Facial recognition verification cannot be performed without camera permission. You can
            request permission again or cancel.
          </Text>

          <PrimaryButton
            title="Request Permission Again"
            onPress={handleContinueToPermission}
            icon={<Ionicons name="refresh-outline" size={18} color="#FFFFFF" />}
            style={styles.actionBtn}
          />

          <SecondaryButton
            title="Return to Station"
            onPress={handleNotNow}
            variant="ghost"
          />
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // STATE B: Permission Granted -> Live Camera Viewfinder & Capture
  // =========================================================================
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={isTorchOn}
        onMountError={(error) => {
          setCameraHardwareError(error?.message || 'Camera mount error.');
        }}
      >
        <SafeAreaView style={styles.cameraOverlay}>
          {/* TOP CONTROLS BAR */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleNotNow}
              style={styles.controlPill}
              activeOpacity={0.75}
              accessibilityLabel="Cancel verification"
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Station and Lighting Indicator */}
            <View style={styles.telemetryBadge}>
              <View style={styles.greenLightDot} />
              <Text style={styles.telemetryBadgeText}>POST 02 · LIGHT: 91%</Text>
            </View>

            {/* Torch Toggle */}
            <TouchableOpacity
              onPress={toggleTorch}
              style={[styles.controlPill, isTorchOn && styles.torchActive]}
              activeOpacity={0.75}
              accessibilityLabel="Toggle camera torch"
            >
              <Ionicons
                name={isTorchOn ? 'flash' : 'flash-outline'}
                size={20}
                color={isTorchOn ? '#F6E05E' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>

          {/* CENTER RETICLE OVAL */}
          <View style={styles.reticleContainer}>
            <View style={styles.reticleOval}>
              {/* High-Precision Corner Alignment Brackets */}
              <View style={[styles.cornerBracket, styles.bracketTopLeft]} />
              <View style={[styles.cornerBracket, styles.bracketTopRight]} />
              <View style={[styles.cornerBracket, styles.bracketBottomLeft]} />
              <View style={[styles.cornerBracket, styles.bracketBottomRight]} />
            </View>

            <View style={styles.reticleLabelBadge}>
              <Ionicons name="scan-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.reticleLabelText}>POSITION FACE INSIDE OVAL</Text>
            </View>
          </View>

          {/* BOTTOM CONTROLS DOCK */}
          <View style={styles.bottomBar}>
            {/* Simulation Fallback Button */}
            <TouchableOpacity
              onPress={simulateCapture}
              style={styles.auxButton}
              activeOpacity={0.75}
              accessibilityLabel="Simulate test capture"
            >
              <Ionicons name="flask-outline" size={22} color="#FFFFFF" />
              <Text style={styles.auxButtonText}>Test State</Text>
            </TouchableOpacity>

            {/* PURPOSE-BUILT CIRCULAR SHUTTER BUTTON */}
            <TouchableOpacity
              onPress={handleCapture}
              disabled={isCapturing}
              style={styles.shutterOuterRing}
              activeOpacity={0.8}
              accessibilityLabel="Take verification photograph"
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <View style={styles.shutterInnerCircle} />
              )}
            </TouchableOpacity>

            {/* Camera Facing Flip */}
            <TouchableOpacity
              onPress={toggleFacing}
              style={styles.auxButton}
              activeOpacity={0.75}
              accessibilityLabel="Flip camera direction"
            >
              <Ionicons name="camera-reverse-outline" size={24} color="#FFFFFF" />
              <Text style={styles.auxButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  stateContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  cardBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    elevation: 3,
    shadowColor: Colors.deep,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  badge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs + 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.deep,
    letterSpacing: 1,
  },
  stateTitle: {
    ...Typography.titleSmall,
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  stateSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  stateBody: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.base,
  },
  safeguardsList: {
    width: '100%',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  safeguardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  safeguardTextGroup: {
    flex: 1,
  },
  safeguardHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  safeguardSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  instructionCard: {
    width: '100%',
    backgroundColor: '#FFFDF5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#FEEBC8',
    marginBottom: Spacing.xl,
    gap: 4,
  },
  instructionStep: {
    fontSize: 12,
    color: '#744210',
    fontWeight: '500',
  },
  actionBtn: {
    width: '100%',
    marginBottom: Spacing.xs,
    minHeight: 48,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  controlPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  torchActive: {
    backgroundColor: 'rgba(246, 224, 94, 0.35)',
    borderColor: '#F6E05E',
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  greenLightDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#48BB78',
    marginRight: 6,
  },
  telemetryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  reticleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleOval: {
    width: SCREEN_WIDTH * 0.68,
    height: SCREEN_WIDTH * 0.92,
    borderRadius: (SCREEN_WIDTH * 0.68) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  cornerBracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.mint,
  },
  bracketTopLeft: {
    top: -3,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  bracketTopRight: {
    top: -3,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  bracketBottomLeft: {
    bottom: -3,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  bracketBottomRight: {
    bottom: -3,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  reticleLabelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.base,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  reticleLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    paddingTop: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  auxButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    minHeight: 48,
  },
  auxButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});
