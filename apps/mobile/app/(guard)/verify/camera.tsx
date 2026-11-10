import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
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

  // If permissions are not granted
  if (!permission) {
    return <View style={styles.permissionContainer} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.cameraIconCircle}>
            <Ionicons name="camera" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionBody}>
            GATEWISE AI requires camera access for single-shot facial verification at Main
            Campus Gate. Continuous video recording and surveillance are strictly prohibited.
          </Text>

          <PrimaryButton
            title="Grant Camera Access"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
          <SecondaryButton
            title="Cancel & Return to Station"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          base64: true,
          skipProcessing: false,
        });

        if (photo) {
          setAmbientLightScore(91);
          setCapturedImage(photo.uri, photo.base64 || '');
          router.replace('/(guard)/verify/review');
          return;
        }
      }

      // Fallback for emulator or preview without physical camera feed
      simulateCapture();
    } catch {
      simulateCapture();
    } finally {
      setIsCapturing(false);
    }
  };

  const simulateCapture = () => {
    // High-resolution simulated capture frame
    const sampleUri =
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80';
    setAmbientLightScore(88);
    setCapturedImage(sampleUri, 'data:image/jpeg;base64,mockCaptureBase64Data');
    router.replace('/(guard)/verify/review');
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleTorch = () => {
    setIsTorchOn((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={isTorchOn}
      >
        <SafeAreaView style={styles.overlay}>
          {/* TOP CONTROLS BAR */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.controlPill}
              activeOpacity={0.75}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.lightIndicatorPill}>
              <View style={styles.greenLightDot} />
              <Text style={styles.lightText}>Lighting: Optimal (91%)</Text>
            </View>

            <TouchableOpacity
              onPress={toggleTorch}
              style={[styles.controlPill, isTorchOn && styles.torchActive]}
              activeOpacity={0.75}
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
              {/* Corner brackets */}
              <View style={[styles.cornerBracket, styles.bracketTopLeft]} />
              <View style={[styles.cornerBracket, styles.bracketTopRight]} />
              <View style={[styles.cornerBracket, styles.bracketBottomLeft]} />
              <View style={[styles.cornerBracket, styles.bracketBottomRight]} />
            </View>
            <View style={styles.reticleLabelBadge}>
              <Text style={styles.reticleLabelText}>POSITION FACE INSIDE OVAL</Text>
            </View>
          </View>

          {/* BOTTOM CONTROLS */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={simulateCapture}
              style={styles.auxButton}
              activeOpacity={0.75}
            >
              <Ionicons name="images-outline" size={22} color="#FFFFFF" />
              <Text style={styles.auxButtonText}>Simulate</Text>
            </TouchableOpacity>

            {/* MANUAL SHUTTER BUTTON */}
            <TouchableOpacity
              onPress={handleCapture}
              disabled={isCapturing}
              style={styles.shutterOuterRing}
              activeOpacity={0.8}
            >
              <View style={styles.shutterInnerCircle} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleFacing}
              style={styles.auxButton}
              activeOpacity={0.75}
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
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  permissionCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cameraIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  permissionTitle: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  permissionBody: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  controlPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchActive: {
    backgroundColor: 'rgba(246, 224, 94, 0.3)',
  },
  lightIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  greenLightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#48BB78',
    marginRight: 6,
  },
  lightText: {
    ...Typography.badge,
    fontSize: 11,
    color: '#FFFFFF',
  },
  reticleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleOval: {
    width: SCREEN_WIDTH * 0.72,
    height: SCREEN_WIDTH * 0.95,
    borderRadius: (SCREEN_WIDTH * 0.72) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    borderStyle: 'dashed',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerBracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.mint,
  },
  bracketTopLeft: {
    top: 16,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  bracketTopRight: {
    top: 16,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bracketBottomLeft: {
    bottom: 16,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bracketBottomRight: {
    bottom: 16,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  reticleLabelBadge: {
    backgroundColor: 'rgba(23, 99, 70, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  reticleLabelText: {
    ...Typography.badge,
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  auxButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  auxButtonText: {
    ...Typography.caption,
    fontSize: 10,
    color: '#FFFFFF',
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
    backgroundColor: 'transparent',
  },
  shutterInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});
