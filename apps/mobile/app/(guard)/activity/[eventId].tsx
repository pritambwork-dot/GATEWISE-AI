import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { ActivityService } from '../../../src/services/activity.service';
import { VerificationEventRecord } from '../../../src/types';
import {
  SurfaceCard,
  StatusBadge,
  CryptographicSealBadge,
  PrimaryButton,
  LoadingState,
  EmptyState,
} from '../../../src/components';

export default function EventDetailScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [eventRecord, setEventRecord] = useState<VerificationEventRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      if (!eventId) return;
      try {
        const data = await ActivityService.getActivityDetail(eventId);
        setEventRecord(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [eventId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingState message="Retrieving immutable audit log..." />
      </View>
    );
  }

  if (!eventRecord) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          title="Event Not Found"
          description={`No audit record matching Event ID ${eventId} could be retrieved.`}
          actionTitle="Return to Activity"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Event Header Card */}
      <SurfaceCard variant="elevated" padding={Spacing.lg}>
        <View style={styles.recordHeader}>
          <View style={styles.idContainer}>
            <Text style={styles.eventLabel}>AUDIT EVENT ID</Text>
            <Text style={styles.eventIdText}>{eventRecord.id}</Text>
          </View>
          <Text style={styles.timestampText}>
            {new Date(eventRecord.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Subject Information */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Subject Name</Text>
          <Text style={styles.infoValue}>{eventRecord.personName || 'Unregistered'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Subject ID / Category</Text>
          <Text style={styles.infoValue}>
            {eventRecord.personId ? `${eventRecord.personId} (${eventRecord.personCategory})` : 'Unregistered'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Biometric Match Outcome</Text>
          <StatusBadge status={eventRecord.outcome} size="small" />
        </View>

        {eventRecord.decision && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guard Action Committed</Text>
            <StatusBadge status={eventRecord.decision} size="small" />
          </View>
        )}

        {eventRecord.similarityScore && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Facial Similarity Score</Text>
            <Text style={styles.infoValue}>
              {(eventRecord.similarityScore * 100).toFixed(1)}% Cosine Match
            </Text>
          </View>
        )}

        {eventRecord.decisionReason && (
          <View style={styles.notesBlock}>
            <Text style={styles.notesTitle}>Guard Notes & Override Justification</Text>
            <Text style={styles.notesBody}>{eventRecord.decisionReason}</Text>
          </View>
        )}
      </SurfaceCard>

      {/* Terminal & Station Card */}
      <SurfaceCard variant="flat" padding={Spacing.base}>
        <View style={styles.stationHeader}>
          <Ionicons name="shield-outline" size={18} color={Colors.deep} />
          <Text style={styles.stationTitle}>Gate Terminal & Chain of Custody</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gate Post</Text>
          <Text style={styles.infoValue}>{eventRecord.gateName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Recording Officer</Text>
          <Text style={styles.infoValue}>{eventRecord.guardName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sync Status</Text>
          <Text style={[styles.infoValue, { color: Colors.primary, fontWeight: '700' }]}>
            Synced to Central Cloud Ledger
          </Text>
        </View>
      </SurfaceCard>

      {/* Cryptographic Seal Badge */}
      <CryptographicSealBadge
        signature={eventRecord.cryptographicSignature}
        timestamp={eventRecord.timestamp}
      />

      <View style={styles.disclaimerBox}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.disclaimerText}>
          Every record generated at Gatewise AI terminals is digitally signed with an immutable HMAC-SHA256
          signature and permanently archived for institutional security audits.
        </Text>
      </View>

      <PrimaryButton
        title="Back to Activity Feed"
        onPress={() => router.back()}
        style={styles.backButton}
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  idContainer: {
    flex: 1,
  },
  eventLabel: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.textMuted,
  },
  eventIdText: {
    ...Typography.monoBold,
    fontSize: 16,
    marginTop: 2,
  },
  timestampText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  notesBlock: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  notesTitle: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  notesBody: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginTop: 2,
    fontSize: 12,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stationTitle: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginLeft: 6,
    fontSize: 13,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.base,
  },
  disclaimerText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  backButton: {
    marginTop: Spacing.sm,
  },
});
