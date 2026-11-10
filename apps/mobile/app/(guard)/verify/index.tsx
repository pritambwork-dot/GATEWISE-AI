import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { useVerification } from '../../../src/providers/VerificationContext';
import { StationTelemetryBar, SurfaceCard, StatusBadge } from '../../../src/components';

export default function VerifyHomeScreen() {
  const router = useRouter();
  const { resetVerification, setMockState, mockState } = useVerification();

  const handleStartCapture = (selectedState?: string) => {
    resetVerification();
    if (selectedState) {
      setMockState(selectedState);
    }
    router.push('/(guard)/verify/camera');
  };

  return (
    <View style={styles.container}>
      <StationTelemetryBar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* START VERIFICATION HERO CTA */}
        <TouchableOpacity
          onPress={() => handleStartCapture()}
          activeOpacity={0.85}
          style={styles.heroCtaCard}
        >
          <View style={styles.heroContentRow}>
            <View style={styles.heroIconWrapper}>
              <Ionicons name="camera" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextColumn}>
              <Text style={styles.heroTitle}>START VERIFICATION</Text>
              <Text style={styles.heroSubtitle}>
                Single-shot manual face scan · Tap to open camera
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.heroFooter}>
            <Ionicons name="shield-checkmark-outline" size={14} color={Colors.mint} />
            <Text style={styles.heroFooterText}>
              Ephemeral RAM processing · Zero video recording · Privacy compliant
            </Text>
          </View>
        </TouchableOpacity>

        {/* SIMULATION & 7-STATE TESTING MODES */}
        <SurfaceCard variant="flat" padding={Spacing.base} style={styles.simCard}>
          <View style={styles.simHeader}>
            <Ionicons name="flask-outline" size={16} color={Colors.deep} />
            <Text style={styles.simTitle}>7-STATE VERIFICATION SIMULATOR</Text>
          </View>
          <Text style={styles.simSubtitle}>
            Select any institutional state to test matching, clearance, and guard decisions:
          </Text>

          <View style={styles.simButtonsGrid}>
            <TouchableOpacity
              style={[styles.simButton, mockState === 'STATE_A' && styles.simButtonActive]}
              onPress={() => handleStartCapture('STATE_A')}
            >
              <StatusBadge status="VERIFIED_AUTHORIZED" size="small" />
              <Text style={styles.simBtnText}>State A: Authorized Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, mockState === 'STATE_B' && styles.simButtonActive]}
              onPress={() => handleStartCapture('STATE_B')}
            >
              <StatusBadge status="AUTHORIZATION_EXPIRED" size="small" />
              <Text style={styles.simBtnText}>State B: Expired Alumni</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, mockState === 'STATE_C' && styles.simButtonActive]}
              onPress={() => handleStartCapture('STATE_C')}
            >
              <StatusBadge status="POTENTIAL_MATCH" size="small" />
              <Text style={styles.simBtnText}>State C: Potential Match 78%</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, mockState === 'STATE_D' && styles.simButtonActive]}
              onPress={() => handleStartCapture('STATE_D')}
            >
              <StatusBadge status="UNKNOWN_PERSON" size="small" />
              <Text style={styles.simBtnText}>State D: Unknown Person</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, mockState === 'STATE_E' && styles.simButtonActive]}
              onPress={() => handleStartCapture('STATE_E')}
            >
              <StatusBadge status="IMAGE_QUALITY_INSUFFICIENT" size="small" />
              <Text style={styles.simBtnText}>State E: Low Quality / Blur</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simButton, mockState === 'STATE_G' && styles.simButtonActive]}
              onPress={() => handleStartCapture('STATE_G')}
            >
              <StatusBadge status="OFFLINE_STANDBY" size="small" />
              <Text style={styles.simBtnText}>State G: Offline Standby</Text>
            </TouchableOpacity>
          </View>
        </SurfaceCard>

        {/* TODAY'S GATE METRICS */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Today's Station Telemetry</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>148</Text>
              <Text style={styles.metricLabel}>Total Scans</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNumber, { color: Colors.primary }]}>139</Text>
              <Text style={styles.metricLabel}>Authorized</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNumber, { color: Colors.error }]}>7</Text>
              <Text style={styles.metricLabel}>Denied</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNumber, { color: Colors.warning }]}>2</Text>
              <Text style={styles.metricLabel}>Referrals</Text>
            </View>
          </View>
        </View>

        {/* INSTITUTIONAL SOP PROTOCOLS */}
        <SurfaceCard variant="elevated" padding={Spacing.base}>
          <View style={styles.sopHeader}>
            <Ionicons name="document-text-outline" size={18} color={Colors.deep} />
            <Text style={styles.sopTitle}>Station Standard Operating Procedures</Text>
          </View>

          <View style={styles.sopItem}>
            <View style={styles.sopBullet} />
            <Text style={styles.sopText}>
              <Text style={styles.bold}>70% – 89% Similarity:</Text> Guard must manually inspect
              physical institutional ID card before granting gate entry.
            </Text>
          </View>

          <View style={styles.sopItem}>
            <View style={styles.sopBullet} />
            <Text style={styles.sopText}>
              <Text style={styles.bold}>Unknown Subjects:</Text> Direct to Visitor Desk A or submit
              an Enrollment Referral for Registrar evaluation.
            </Text>
          </View>

          <View style={styles.sopItem}>
            <View style={styles.sopBullet} />
            <Text style={styles.sopText}>
              <Text style={styles.bold}>Sovereign Guard Authority:</Text> AI matching does not
              automatically unlock barriers. Guard decision is required for every record.
            </Text>
          </View>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  heroCtaCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    shadowColor: Colors.deep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  heroTextColumn: {
    flex: 1,
  },
  heroTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    ...Typography.caption,
    color: Colors.lightGreen,
    fontSize: 12,
    marginTop: 2,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: Spacing.sm,
  },
  heroFooterText: {
    ...Typography.caption,
    color: Colors.mint,
    fontSize: 10,
    marginLeft: 4,
  },
  simCard: {
    marginBottom: Spacing.base,
    backgroundColor: '#F3FAF5',
    borderColor: '#BFE4D1',
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  simTitle: {
    ...Typography.badge,
    color: Colors.deep,
    marginLeft: 6,
    fontSize: 11,
  },
  simSubtitle: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  simButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  simButton: {
    width: '48.5%',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: Spacing.xs,
  },
  simButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E8F5EE',
  },
  simBtnText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  metricsSection: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '23%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  metricNumber: {
    ...Typography.titleMedium,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  metricLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sopTitle: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginLeft: 6,
    fontSize: 13,
  },
  sopItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  sopBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  sopText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
