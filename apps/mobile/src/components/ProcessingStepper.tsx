import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface ProcessingStepperProps {
  currentStep: number; // 1 to 7
  error?: string | null;
}

const STEPS = [
  { id: 1, title: 'Frame Quality & Blur Analysis', desc: 'Laplacian focus score & exposure' },
  { id: 2, title: 'Face Detection & Geometry', desc: 'Orientation & facial landmarks' },
  { id: 3, title: 'Anti-Spoofing & Liveness', desc: 'Screen reflection & texture check' },
  { id: 4, title: 'Feature Embedding Extraction', desc: '128-dim normalized biometric vector' },
  { id: 5, title: 'Vector Database Comparison', desc: 'Cosine similarity against institutional index' },
  { id: 6, title: 'Access Control & Schedule', desc: 'Active semester clearance & gate schedule' },
  { id: 7, title: 'Verification Record Generation', desc: 'Cryptographic SHA-256 seal creation' },
];

export function ProcessingStepper({ currentStep, error }: ProcessingStepperProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isPending = currentStep < step.id;
        const isFailed = isCurrent && !!error;

        return (
          <View key={step.id} style={styles.stepRow}>
            {/* Step Icon / Indicator */}
            <View style={styles.indicatorColumn}>
              <View
                style={[
                  styles.nodeCircle,
                  isCompleted && styles.nodeCompleted,
                  isCurrent && !isFailed && styles.nodeCurrent,
                  isFailed && styles.nodeFailed,
                  isPending && styles.nodePending,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : isFailed ? (
                  <Ionicons name="close" size={14} color="#FFFFFF" />
                ) : isCurrent ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.pendingNumber}>{step.id}</Text>
                )}
              </View>

              {/* Connecting Line (except last) */}
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    isCompleted ? styles.connectorCompleted : styles.connectorPending,
                  ]}
                />
              )}
            </View>

            {/* Step Labels */}
            <View style={styles.labelColumn}>
              <Text
                style={[
                  styles.stepTitle,
                  isCurrent && styles.stepTitleCurrent,
                  isCompleted && styles.stepTitleCompleted,
                  isFailed && styles.stepTitleFailed,
                ]}
              >
                {step.title}
              </Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.base,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.md,
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: Colors.primary,
  },
  nodeCurrent: {
    backgroundColor: Colors.deep,
    borderWidth: 2,
    borderColor: Colors.mint,
  },
  nodeFailed: {
    backgroundColor: Colors.error,
  },
  nodePending: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  pendingNumber: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.textMuted,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  connectorCompleted: {
    backgroundColor: Colors.primary,
  },
  connectorPending: {
    backgroundColor: Colors.borderSubtle,
  },
  labelColumn: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  stepTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  stepTitleCurrent: {
    color: Colors.deep,
    fontWeight: '700',
  },
  stepTitleCompleted: {
    color: Colors.textPrimary,
  },
  stepTitleFailed: {
    color: Colors.error,
    fontWeight: '700',
  },
  stepDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
});
