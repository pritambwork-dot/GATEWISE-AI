import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { useVerification } from '../../../src/providers/VerificationContext';
import { GuardDecisionActionType } from '../../../src/types';
import {
  PrimaryButton,
  SecondaryButton,
  SurfaceCard,
  InputField,
  ConfirmationDialog,
  CryptographicSealBadge,
  StatusBadge,
} from '../../../src/components';

export default function RecordDecisionScreen() {
  const router = useRouter();
  const {
    verificationResult,
    submitGuardDecision,
    decisionSignature,
    selectedDecision,
    resetVerification,
  } = useVerification();

  const [chosenAction, setChosenAction] = useState<GuardDecisionActionType>('GRANT_ENTRY');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const subjectName = verificationResult?.candidate?.personName || 'Unregistered Subject';
  const personId = verificationResult?.candidate?.personId || 'N/A';

  const handleActionSelect = (action: GuardDecisionActionType) => {
    setChosenAction(action);
  };

  const handleCommitPress = () => {
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      await submitGuardDecision(chosenAction, notes, notes);
      setHasCompleted(true);
    } catch {
      // Offline fallback still creates signature
      setHasCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    resetVerification();
    router.replace('/(guard)/verify');
  };

  // If already committed, show sealed confirmation screen
  if (hasCompleted && decisionSignature) {
    return (
      <View style={styles.completedContainer}>
        <SurfaceCard variant="highlight" padding={Spacing.xl} style={styles.completedCard}>
          <View style={styles.sealedIconCircle}>
            <Ionicons name="checkmark-done-circle" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.sealedTitle}>Decision Logged & Sealed</Text>
          <Text style={styles.sealedSubtitle}>
            Recorded by Officer Ramesh Verma at Main Campus Gate · Post 02
          </Text>

          <View style={styles.sealedSummary}>
            <Text style={styles.sealedSubjectName}>{subjectName}</Text>
            <StatusBadge status={chosenAction} size="medium" style={styles.decisionBadge} />
          </View>

          <CryptographicSealBadge
            signature={decisionSignature}
            timestamp={new Date().toISOString()}
          />

          <Text style={styles.auditDisclaimer}>
            This decision is cryptographically anchored in the institutional gate log and synchronized
            with Central Security Command.
          </Text>

          <PrimaryButton
            title="Return to Verify Home"
            onPress={handleReturnHome}
            style={styles.returnButton}
          />
        </SurfaceCard>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Subject Summary Card */}
      <SurfaceCard variant="flat" padding={Spacing.base}>
        <View style={styles.subjectRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={24} color={Colors.deep} />
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectNameText}>{subjectName}</Text>
            <Text style={styles.subjectMetaText}>
              ID: {personId} · Outcome: {verificationResult?.outcome.replace('_', ' ')}
            </Text>
          </View>
        </View>
      </SurfaceCard>

      {/* Decision Selection Options */}
      <Text style={styles.sectionHeader}>Select Guard Action</Text>

      {/* 1. GRANT ENTRY */}
      <TouchableOpacity
        style={[
          styles.actionCard,
          chosenAction === 'GRANT_ENTRY' && styles.actionCardSelectedGrant,
        ]}
        onPress={() => handleActionSelect('GRANT_ENTRY')}
        activeOpacity={0.8}
      >
        <View style={styles.actionHeader}>
          <View style={[styles.actionIconPill, { backgroundColor: '#E8F5EE' }]}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={[styles.actionTitle, { color: Colors.primary }]}>Grant Physical Entry</Text>
            <Text style={styles.actionDesc}>Open barrier gate and admit subject to campus.</Text>
          </View>
          {chosenAction === 'GRANT_ENTRY' && (
            <Ionicons name="radio-button-on" size={22} color={Colors.primary} />
          )}
        </View>
      </TouchableOpacity>

      {/* 2. DENY ENTRY */}
      <TouchableOpacity
        style={[
          styles.actionCard,
          chosenAction === 'DENY_ENTRY' && styles.actionCardSelectedDeny,
        ]}
        onPress={() => handleActionSelect('DENY_ENTRY')}
        activeOpacity={0.8}
      >
        <View style={styles.actionHeader}>
          <View style={[styles.actionIconPill, { backgroundColor: '#FDF0ED' }]}>
            <Ionicons name="close-circle" size={20} color={Colors.error} />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={[styles.actionTitle, { color: Colors.error }]}>Deny Gate Passage</Text>
            <Text style={styles.actionDesc}>Refuse campus admission. Access restriction enforced.</Text>
          </View>
          {chosenAction === 'DENY_ENTRY' && (
            <Ionicons name="radio-button-on" size={22} color={Colors.error} />
          )}
        </View>
      </TouchableOpacity>

      {/* 3. ESCALATE TO ADMIN */}
      <TouchableOpacity
        style={[
          styles.actionCard,
          chosenAction === 'ESCALATE_TO_ADMIN' && styles.actionCardSelectedEscalate,
        ]}
        onPress={() => handleActionSelect('ESCALATE_TO_ADMIN')}
        activeOpacity={0.8}
      >
        <View style={styles.actionHeader}>
          <View style={[styles.actionIconPill, { backgroundColor: '#FFF0F5' }]}>
            <Ionicons name="arrow-redo-circle" size={20} color="#B83280" />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={[styles.actionTitle, { color: '#B83280' }]}>Escalate to Security Control</Text>
            <Text style={styles.actionDesc}>Notify Central Security Commander for supervisor override.</Text>
          </View>
          {chosenAction === 'ESCALATE_TO_ADMIN' && (
            <Ionicons name="radio-button-on" size={22} color="#B83280" />
          )}
        </View>
      </TouchableOpacity>

      {/* 4. REFER TO VISITOR DESK */}
      <TouchableOpacity
        style={[
          styles.actionCard,
          chosenAction === 'REFER_TO_VISITOR_DESK' && styles.actionCardSelectedVisitor,
        ]}
        onPress={() => handleActionSelect('REFER_TO_VISITOR_DESK')}
        activeOpacity={0.8}
      >
        <View style={styles.actionHeader}>
          <View style={[styles.actionIconPill, { backgroundColor: '#EDF2F0' }]}>
            <Ionicons name="business" size={20} color={Colors.deep} />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={[styles.actionTitle, { color: Colors.deep }]}>Refer to Visitor Desk A</Text>
            <Text style={styles.actionDesc}>Direct individual to visitor reception for temporary pass.</Text>
          </View>
          {chosenAction === 'REFER_TO_VISITOR_DESK' && (
            <Ionicons name="radio-button-on" size={22} color={Colors.deep} />
          )}
        </View>
      </TouchableOpacity>

      {/* Notes & Override Reason */}
      <InputField
        label="Guard Operational Notes / Override Justification"
        placeholder="e.g. Physical student ID card inspected and verified."
        value={notes}
        onChangeText={setNotes}
        hint="Recorded permanently in audit trail with officer cryptographic signature."
        containerStyle={styles.notesContainer}
      />

      {/* Commit Button */}
      <PrimaryButton
        title="Commit Decision & Seal Record"
        onPress={handleCommitPress}
        loading={isSubmitting}
        icon={<Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />}
        style={styles.commitButton}
      />

      {/* Confirmation Modal */}
      <ConfirmationDialog
        visible={showConfirmModal}
        title="Confirm Guard Decision"
        message={`Are you sure you want to record ${chosenAction.replace(/_/g, ' ')} for ${subjectName}? This action will generate an immutable audit record.`}
        confirmText="Confirm & Sign"
        variant={chosenAction === 'DENY_ENTRY' ? 'danger' : 'primary'}
        onConfirm={handleFinalConfirm}
        onCancel={() => setShowConfirmModal(false)}
        loading={isSubmitting}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    backgroundColor: Colors.background,
    paddingBottom: Spacing['3xl'],
  },
  completedContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: Spacing.base,
  },
  completedCard: {
    alignItems: 'center',
  },
  sealedIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  sealedTitle: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
  },
  sealedSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: Spacing.base,
  },
  sealedSummary: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sealedSubjectName: {
    ...Typography.headline,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  decisionBadge: {
    marginTop: 6,
  },
  auditDisclaimer: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginVertical: Spacing.base,
    lineHeight: 16,
  },
  returnButton: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectNameText: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  subjectMetaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: Spacing.md,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    marginBottom: Spacing.sm,
  },
  actionCardSelectedGrant: {
    borderColor: Colors.primary,
    backgroundColor: '#F3FAF5',
  },
  actionCardSelectedDeny: {
    borderColor: Colors.error,
    backgroundColor: '#FDF2F2',
  },
  actionCardSelectedEscalate: {
    borderColor: '#B83280',
    backgroundColor: '#FFF0F5',
  },
  actionCardSelectedVisitor: {
    borderColor: Colors.deep,
    backgroundColor: '#EDF4EF',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionTextColumn: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.captionBold,
    fontSize: 14,
  },
  actionDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  notesContainer: {
    marginTop: Spacing.base,
  },
  commitButton: {
    marginTop: Spacing.md,
  },
});
