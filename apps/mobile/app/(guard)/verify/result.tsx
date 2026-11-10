import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../../src/theme';
import { useVerification } from '../../../src/providers/VerificationContext';
import {
  VerificationResultCard,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
} from '../../../src/components';

export default function VerificationResultScreen() {
  const router = useRouter();
  const { verificationResult, resetVerification } = useVerification();

  if (!verificationResult) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          title="No Active Verification"
          description="Start a new facial verification scan from the verify station."
          actionTitle="Start Verification"
          onAction={() => router.replace('/(guard)/verify')}
        />
      </View>
    );
  }

  const { outcome } = verificationResult;

  const handleRecordDecision = () => {
    router.push('/(guard)/verify/decision');
  };

  const handleRetake = () => {
    resetVerification();
    router.replace('/(guard)/verify/camera');
  };

  const handleDismiss = () => {
    resetVerification();
    router.replace('/(guard)/verify');
  };

  const getGuidanceNote = () => {
    switch (outcome) {
      case 'VERIFIED_AUTHORIZED':
        return {
          title: 'Clearance Confirmed',
          desc: 'Subject has active institutional credentials. Proceed to log entry decision.',
          color: Colors.primary,
          icon: 'shield-checkmark-outline' as const,
        };
      case 'AUTHORIZATION_EXPIRED':
        return {
          title: 'Authorization Expired',
          desc: 'Physical access expired. Deny passage or direct subject to Visitor Desk.',
          color: Colors.error,
          icon: 'alert-circle-outline' as const,
        };
      case 'POTENTIAL_MATCH':
        return {
          title: 'Physical ID Inspection Required',
          desc: 'Confidence is between 70% and 89%. Inspect official physical IIM-S badge before deciding.',
          color: Colors.warning,
          icon: 'warning-outline' as const,
        };
      case 'UNKNOWN_PERSON':
        return {
          title: 'Unenrolled Individual',
          desc: 'No matching facial vector found. Guard should refer subject to Visitor Desk A.',
          color: Colors.textSecondary,
          icon: 'help-circle-outline' as const,
        };
      case 'IMAGE_QUALITY_INSUFFICIENT':
        return {
          title: 'Retake Recommended',
          desc: 'Lighting or motion blur caused feature extraction failure. Retake frame.',
          color: Colors.warning,
          icon: 'camera-reverse-outline' as const,
        };
      default:
        return {
          title: 'Standby Status',
          desc: 'Log manual entry or offline verification for station ledger.',
          color: Colors.deep,
          icon: 'information-circle-outline' as const,
        };
    }
  };

  const guidance = getGuidanceNote();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Result Card with Photos and Match Details */}
      <VerificationResultCard result={verificationResult} />

      {/* Protocol Guidance Banner */}
      <View style={[styles.guidanceBox, { borderColor: `${guidance.color}40` }]}>
        <Ionicons name={guidance.icon} size={20} color={guidance.color} />
        <View style={styles.guidanceTextColumn}>
          <Text style={[styles.guidanceTitle, { color: guidance.color }]}>
            {guidance.title}
          </Text>
          <Text style={styles.guidanceDesc}>{guidance.desc}</Text>
        </View>
      </View>

      {/* Action Decision Buttons */}
      <View style={styles.actionSection}>
        {outcome === 'IMAGE_QUALITY_INSUFFICIENT' ? (
          <>
            <PrimaryButton
              title="Retake Face Capture"
              onPress={handleRetake}
              icon={<Ionicons name="camera-outline" size={20} color="#FFFFFF" />}
              style={styles.mainActionButton}
            />
            <SecondaryButton
              title="Record Manual ID Inspection"
              onPress={handleRecordDecision}
              variant="soft"
            />
          </>
        ) : (
          <>
            <PrimaryButton
              title="RECORD GUARD DECISION"
              onPress={handleRecordDecision}
              icon={<Ionicons name="checkmark-done" size={20} color="#FFFFFF" />}
              style={styles.mainActionButton}
            />
            <SecondaryButton
              title="Discard & Return to Post"
              onPress={handleDismiss}
              variant="ghost"
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    backgroundColor: Colors.background,
    paddingBottom: Spacing['3xl'],
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  guidanceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  guidanceTextColumn: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  guidanceTitle: {
    ...Typography.captionBold,
    fontSize: 13,
  },
  guidanceDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  actionSection: {
    marginTop: Spacing.base,
  },
  mainActionButton: {
    marginBottom: Spacing.sm,
  },
});
