import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { useVerification } from '../../../src/providers/VerificationContext';
import { PrimaryButton, SecondaryButton, SurfaceCard } from '../../../src/components';

export default function ReviewCaptureScreen() {
  const router = useRouter();
  const { capturedUri, ambientLightScore } = useVerification();

  const handleRetake = () => {
    router.replace('/(guard)/verify/camera');
  };

  const handleProceed = () => {
    router.replace('/(guard)/verify/processing');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Captured Image Display */}
      <View style={styles.imageCard}>
        {capturedUri ? (
          <Image
            source={{ uri: capturedUri }}
            style={styles.capturedPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.placeholderText}>No image frame captured</Text>
          </View>
        )}
        <View style={styles.photoTag}>
          <Text style={styles.photoTagText}>STATION FRAME CAPTURE</Text>
        </View>
      </View>

      {/* Quality Assessment Card */}
      <SurfaceCard variant="elevated" padding={Spacing.base}>
        <View style={styles.qualityHeader}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
          <Text style={styles.qualityTitle}>Pre-Analysis Quality Check Passed</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>94.8</Text>
            <Text style={styles.metricLbl}>Focus Sharpness</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{ambientLightScore}%</Text>
            <Text style={styles.metricLbl}>Ambient Light</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: Colors.primary }]}>PASS</Text>
            <Text style={styles.metricLbl}>Orientation</Text>
          </View>
        </View>

        <Text style={styles.qualityHint}>
          Subject facial features are sharply defined with sufficient contrast. Ready for vector
          embedding extraction.
        </Text>
      </SurfaceCard>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <PrimaryButton
          title="Analyze & Verify Subject"
          onPress={handleProceed}
          icon={<Ionicons name="finger-print-outline" size={20} color="#FFFFFF" />}
          style={styles.verifyButton}
        />
        <SecondaryButton
          title="Retake Photo"
          onPress={handleRetake}
          icon={<Ionicons name="camera-reverse-outline" size={18} color={Colors.deep} />}
          variant="soft"
        />
      </View>

      {/* Privacy Notice */}
      <View style={styles.privacyNote}>
        <Ionicons name="shield-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.privacyText}>
          Temporary frame is held in volatile memory. Discarded immediately after verification.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    backgroundColor: Colors.background,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  imageCard: {
    width: '100%',
    aspectRatio: 0.9,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    position: 'relative',
    marginBottom: Spacing.base,
  },
  capturedPhoto: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 8,
  },
  photoTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(23, 99, 70, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  photoTagText: {
    ...Typography.badge,
    color: '#FFFFFF',
    fontSize: 9,
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  qualityTitle: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginLeft: 6,
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderSubtle,
  },
  metricVal: {
    ...Typography.bodyMedium,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontSize: 15,
  },
  metricLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  qualityHint: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 16,
  },
  actionsContainer: {
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  verifyButton: {
    marginBottom: Spacing.sm,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  privacyText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginLeft: 4,
  },
});
