import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../../src/theme';
import { useVerification } from '../../../src/providers/VerificationContext';
import { useAuth } from '../../../src/providers/AuthProvider';
import { ProcessingStepper, SecondaryButton, SurfaceCard, PrimaryButton } from '../../../src/components';

export default function VerificationProcessingScreen() {
  const router = useRouter();
  const { assignedGate } = useAuth();
  const { runVerification, processingStep, processingError } = useVerification();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function execute() {
      if (hasTriggered) return;
      setHasTriggered(true);

      try {
        await runVerification(assignedGate?.id || 'gate-post-02');
        if (isMounted) {
          router.replace('/(guard)/verify/result');
        }
      } catch {
        // Handled in processingError state
      }
    }

    execute();

    return () => {
      isMounted = false;
    };
  }, [hasTriggered, runVerification, assignedGate, router]);

  const handleRetry = async () => {
    try {
      await runVerification(assignedGate?.id || 'gate-post-02');
      router.replace('/(guard)/verify/result');
    } catch {}
  };

  const handleAbort = () => {
    router.replace('/(guard)/verify');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.spinnerWrapper}>
          <Ionicons name="scan-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Analyzing Facial Biometrics</Text>
        <Text style={styles.subtitle}>
          Executing on-device & station cluster clearance verification pipeline
        </Text>
      </View>

      <SurfaceCard variant="elevated" padding={Spacing.lg}>
        <ProcessingStepper currentStep={processingStep} error={processingError} />
      </SurfaceCard>

      {processingError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{processingError}</Text>
          <PrimaryButton
            title="Retry Pipeline"
            onPress={handleRetry}
            style={styles.retryButton}
          />
          <SecondaryButton
            title="Abort & Return to Post"
            onPress={handleAbort}
            variant="ghost"
          />
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <SecondaryButton
            title="Cancel Verification"
            onPress={handleAbort}
            variant="ghost"
          />
        </View>
      )}
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
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  spinnerWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.mint,
  },
  title: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 290,
  },
  footerContainer: {
    paddingVertical: Spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
});
