import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme';
import { PrimaryButton, SecondaryButton } from '../../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'intro',
    badge: 'INSTITUTIONAL ACCESS',
    iconName: 'shield-checkmark',
    iconColor: Colors.primary,
    iconBg: Colors.lightGreen,
    title: 'GATEWISE Guard Terminal',
    subtitle: 'Institutional Security & Facial Verification',
    description:
      'Engineered for campus security personnel, GATEWISE Guard provides sovereign, high-precision access verification at physical gate posts.',
    keyPoints: [
      'Individual officer authentication with shift audit trails',
      'Direct gate lock pairing preventing unauthorized station takeover',
      'Sovereign human-in-the-loop decision authority at all times',
    ],
  },
  {
    id: 'gate-ops',
    badge: 'STATION CONTEXT',
    iconName: 'business',
    iconColor: Colors.deep,
    iconBg: '#E8F5EE',
    title: 'Assigned Gate Operations',
    subtitle: 'Main Campus Gate · Post 02',
    description:
      'Every verification event is cryptographically sealed to your active station and shift schedule, ensuring institutional non-repudiation.',
    keyPoints: [
      'Real-time connection with Central Security Command Centre',
      'Instant pass/fail telemetry and anomaly alerts',
      'Automatic fallback to offline local cache if network degrades',
    ],
  },
  {
    id: 'verification',
    badge: 'COMPUTER VISION',
    iconName: 'scan-circle',
    iconColor: '#2B6CB0',
    iconBg: '#EBF8FF',
    title: 'Manual Still-Image Verification',
    subtitle: 'Single-Shot High Precision Matching',
    description:
      'GATEWISE uses single-shot manual captures rather than continuous video streams. Face detection and cosine similarity matching run server-side.',
    keyPoints: [
      'Subject positions face within the high-contrast oval guide',
      'Dual YuNet 300x300 detection + SFace 128D embedding models',
      'Strict decoupling: Identity match score vs. institutional clearance',
    ],
  },
  {
    id: 'visitors',
    badge: 'INTAKE PROTOCOL',
    iconName: 'people',
    iconColor: '#D69E2E',
    iconBg: '#FEFCBF',
    title: 'Visitor & Escort Registry',
    subtitle: 'Rapid Walk-in Intake & Departure Logging',
    description:
      'Process guest admissions effortlessly with government ID recording, host department verification, and unique cryptographic visitor passes.',
    keyPoints: [
      'Sub-minute visitor intake with phone & photo capture',
      'Host officer verification and purpose categorization',
      'Single-tap departure checkout at any exit terminal',
    ],
  },
  {
    id: 'privacy',
    badge: 'PRIVACY & INTEGRITY',
    iconName: 'lock-closed',
    iconColor: Colors.primary,
    iconBg: Colors.mint,
    title: 'Privacy Safeguards & Security',
    subtitle: 'Zero Public Storage · Ephemeral RAM Processing',
    description:
      'Institutional biometrics are strictly protected. Photos are never saved to the device camera roll and audio recording is permanently disabled.',
    keyPoints: [
      'No microphone or location permissions required',
      'Biometric captures are deleted immediately after verification',
      'HMAC-SHA256 digital signature seals every guard decision',
    ],
  },
];

export const ONBOARDING_COMPLETED_KEY = 'gatewise_onboarding_completed';

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = SLIDES[currentIndex];
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleNext = () => {
    try {
      Vibration.vibrate(20);
    } catch {
      // Ignore vibration error on unsupported platforms
    }

    if (isLastSlide) {
      handleComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      try {
        Vibration.vibrate(15);
      } catch {
        // Ignore vibration error
      }
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // SecureStore fallback
    }
    router.replace('/(auth)/login');
  };

  const handleSkip = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // SecureStore fallback
    }
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            STEP {currentIndex + 1} OF {SLIDES.length}
          </Text>
        </View>

        {!isLastSlide ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={styles.skipButtonText}>Skip Orientation</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Main Slide Card */}
      <View style={styles.contentContainer}>
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: currentSlide.iconBg }]}>
          <Ionicons name={currentSlide.iconName} size={48} color={currentSlide.iconColor} />
        </View>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{currentSlide.badge}</Text>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

        {/* Description */}
        <Text style={styles.description}>{currentSlide.description}</Text>

        {/* Key Points Checklist */}
        <View style={styles.keyPointsList}>
          {currentSlide.keyPoints.map((point, index) => (
            <View key={index} style={styles.keyPointRow}>
              <View style={styles.checkIconWrapper}>
                <Ionicons name="checkmark" size={14} color={Colors.primary} />
              </View>
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer Navigation Bar */}
      <View style={styles.footerContainer}>
        {/* Dot Indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsRow}>
          {currentIndex > 0 ? (
            <SecondaryButton
              title="Back"
              onPress={handleBack}
              style={styles.backButton}
              variant="outline"
            />
          ) : (
            <View style={styles.backButtonPlaceholder} />
          )}

          <PrimaryButton
            title={isLastSlide ? 'Complete & Sign In' : 'Continue'}
            onPress={handleNext}
            style={styles.nextButton}
            icon={
              <Ionicons
                name={isLastSlide ? 'checkmark-circle-outline' : 'arrow-forward-outline'}
                size={18}
                color="#FFFFFF"
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  stepBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.deep,
    letterSpacing: 0.8,
  },
  skipButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    elevation: 2,
    shadowColor: Colors.deep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  categoryBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs + 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.deep,
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.titleMedium,
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
    maxWidth: 360,
  },
  keyPointsList: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checkIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  keyPointText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    fontWeight: '500',
  },
  footerContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.base,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: Colors.borderMedium,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
    minHeight: 48,
  },
  backButtonPlaceholder: {
    flex: 0,
    width: 0,
  },
  nextButton: {
    flex: 2,
    minHeight: 48,
  },
});
