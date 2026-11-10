import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { VisitorService } from '../../../src/services/visitor.service';
import { VisitorPass } from '../../../src/types';
import {
  SurfaceCard,
  StatusBadge,
  PrimaryButton,
  SecondaryButton,
  ConfirmationDialog,
  LoadingState,
  EmptyState,
} from '../../../src/components';

export default function VisitorDetailScreen() {
  const router = useRouter();
  const { visitorId } = useLocalSearchParams<{ visitorId: string }>();
  const [visitor, setVisitor] = useState<VisitorPass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: 'CHECK_IN' | 'CHECK_OUT';
  }>({ visible: false, type: 'CHECK_IN' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPass = async () => {
    if (!visitorId) return;
    try {
      const pass = await VisitorService.getVisitorByPassCode(visitorId);
      setVisitor(pass);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPass();
  }, [visitorId]);

  const handleAction = async () => {
    if (!visitor) return;
    setIsSubmitting(true);
    try {
      if (confirmModal.type === 'CHECK_IN') {
        const updated = await VisitorService.checkInVisitor(visitor.passCode);
        setVisitor(updated);
        Alert.alert('Access Granted', `${visitor.visitorName} is now Checked In.`);
      } else {
        const updated = await VisitorService.checkOutVisitor(visitor.passCode);
        setVisitor(updated);
        Alert.alert('Exit Recorded', `${visitor.visitorName} is now Checked Out.`);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
      setConfirmModal({ visible: false, type: 'CHECK_IN' });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingState message="Retrieving visitor pass details..." />
      </View>
    );
  }

  if (!visitor) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          title="Pass Not Found"
          description={`No visitor record matching Pass ${visitorId} could be found.`}
          actionTitle="Return to Visitors"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Pass Digital Badge */}
      <SurfaceCard variant="highlight" padding={Spacing.lg} style={styles.passHeaderCard}>
        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code" size={64} color={Colors.deep} />
          <Text style={styles.qrCodeLabel}>{visitor.passCode}</Text>
        </View>

        <StatusBadge status={visitor.status} size="large" style={styles.statusBadge} />
        <Text style={styles.visitorName}>{visitor.visitorName}</Text>
        <Text style={styles.visitorPhone}>{visitor.phone}</Text>
      </SurfaceCard>

      {/* Visitor Identity & Government Document */}
      <SurfaceCard variant="elevated" padding={Spacing.base}>
        <Text style={styles.sectionTitle}>Identification & Host Clearance</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Govt ID Document</Text>
          <Text style={styles.detailValue}>
            {visitor.idType} ({visitor.idNumber})
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Institutional Host</Text>
          <Text style={styles.detailValue}>{visitor.hostName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Host Department</Text>
          <Text style={styles.detailValue}>{visitor.hostDepartment}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Visit Purpose</Text>
          <Text style={styles.detailValue}>{visitor.purpose}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Authorized Date</Text>
          <Text style={styles.detailValue}>{visitor.validDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Valid Until Time</Text>
          <Text style={styles.detailValue}>{visitor.validUntilTime} Today</Text>
        </View>

        {visitor.checkInTime && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Checked In At</Text>
            <Text style={[styles.detailValue, { color: Colors.primary }]}>
              {new Date(visitor.checkInTime).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {visitor.checkOutTime && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Checked Out At</Text>
            <Text style={styles.detailValue}>
              {new Date(visitor.checkOutTime).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </SurfaceCard>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {visitor.status === 'EXPECTED' && (
          <PrimaryButton
            title="Admit & Check In Visitor"
            onPress={() => setConfirmModal({ visible: true, type: 'CHECK_IN' })}
            icon={<Ionicons name="log-in-outline" size={20} color="#FFFFFF" />}
            style={styles.actionButton}
          />
        )}

        {visitor.status === 'CHECKED_IN' && (
          <PrimaryButton
            title="Record Departure / Check Out"
            onPress={() => setConfirmModal({ visible: true, type: 'CHECK_OUT' })}
            icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
            style={styles.actionButton}
          />
        )}

        <SecondaryButton
          title="Back to Visitors"
          onPress={() => router.back()}
          variant="soft"
        />
      </View>

      {/* Confirmation Modal */}
      <ConfirmationDialog
        visible={confirmModal.visible}
        title={confirmModal.type === 'CHECK_IN' ? 'Confirm Check In' : 'Confirm Check Out'}
        message={`Confirm ${confirmModal.type === 'CHECK_IN' ? 'arrival and entry' : 'departure and gate exit'} for visitor ${visitor.visitorName}?`}
        confirmText="Confirm"
        onConfirm={handleAction}
        onCancel={() => setConfirmModal({ visible: false, type: 'CHECK_IN' })}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  passHeaderCard: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  qrCodeLabel: {
    ...Typography.monoBold,
    fontSize: 10,
    color: Colors.deep,
    marginTop: 2,
  },
  statusBadge: {
    marginVertical: Spacing.xs,
  },
  visitorName: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  visitorPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  actionsContainer: {
    marginTop: Spacing.base,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});
