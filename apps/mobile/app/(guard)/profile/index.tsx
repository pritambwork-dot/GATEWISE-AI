import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { useAuth } from '../../../src/providers/AuthProvider';
import { ProfileService } from '../../../src/services/profile.service';
import { TerminalHealth } from '../../../src/types';
import {
  StationTelemetryBar,
  SurfaceCard,
  PrimaryButton,
  ConfirmationDialog,
  InputField,
} from '../../../src/components';

export default function GuardProfileScreen() {
  const router = useRouter();
  const { user, assignedGate, logout, demoMode, toggleDemoMode } = useAuth();

  const [diagnostics, setDiagnostics] = useState<TerminalHealth | null>(null);
  const [sopQuery, setSopQuery] = useState('');
  const [sopAnswer, setSopAnswer] = useState<string | null>(null);
  const [isQueryingSop, setIsQueryingSop] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function loadHealth() {
      const data = await ProfileService.getTerminalHealth();
      setDiagnostics(data);
    }
    loadHealth();
  }, []);

  const handleAskSop = async (queryText?: string) => {
    const q = (queryText || sopQuery).trim();
    if (!q) return;

    setIsQueryingSop(true);
    setSopAnswer(null);
    try {
      const answer = await ProfileService.querySopAssistant(q);
      setSopAnswer(answer);
    } catch {
      setSopAnswer('Unable to query SOP assistant. Refer to station manual binder.');
    } finally {
      setIsQueryingSop(false);
    }
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.replace('/(auth)/login');
    } finally {
      setIsSigningOut(false);
      setShowSignOutModal(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StationTelemetryBar />

      <View style={styles.content}>
        {/* Guard Credentials Card */}
        <SurfaceCard variant="elevated" padding={Spacing.lg}>
          <View style={styles.officerRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>RV</Text>
            </View>
            <View style={styles.officerDetails}>
              <Text style={styles.officerName}>{user?.fullName || 'Officer Ramesh Verma'}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.role || 'SECURITY_GUARD'}</Text>
                </View>
                <View style={styles.empBadge}>
                  <Text style={styles.empText}>{user?.employeeId || 'SEC-G014'}</Text>
                </View>
              </View>
              <Text style={styles.stationLocation}>
                {assignedGate?.name || 'Main Campus Gate · Post 02'}
              </Text>
            </View>
          </View>

          <View style={styles.shiftDivider} />

          <View style={styles.shiftInfoRow}>
            <View style={styles.shiftColumn}>
              <Text style={styles.shiftLabel}>Active Shift</Text>
              <Text style={styles.shiftValue}>Morning (06:00 – 14:00)</Text>
            </View>
            <View style={styles.shiftColumn}>
              <Text style={styles.shiftLabel}>Post Status</Text>
              <Text style={[styles.shiftValue, { color: Colors.primary }]}>Locked & Active</Text>
            </View>
          </View>
        </SurfaceCard>

        {/* Terminal Health & Station Diagnostics */}
        <SurfaceCard variant="flat" padding={Spacing.base}>
          <View style={styles.diagHeader}>
            <Ionicons name="hardware-chip-outline" size={18} color={Colors.deep} />
            <Text style={styles.diagTitle}>Terminal Diagnostics & Hardware Telemetry</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>Battery & Power</Text>
            <Text style={styles.diagValue}>
              {diagnostics?.batteryPercent ?? 88}% · Charging via Post DC Dock
            </Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>Network Latency</Text>
            <Text style={styles.diagValue}>{diagnostics?.latencyMs ?? 42} ms to Cluster</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>Offline Sync Buffer</Text>
            <Text style={styles.diagValue}>0 Pending · Live Connected</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>Inference Model</Text>
            <Text style={styles.diagValue}>MobileFaceNet-V2.1-INT8 (Edge)</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>App Build</Text>
            <Text style={styles.diagValue}>v1.0.0-rc3 (Build 104 · Android)</Text>
          </View>

          {/* Demo Mode Toggle for Guard */}
          <TouchableOpacity
            style={styles.demoToggleRow}
            onPress={toggleDemoMode}
            activeOpacity={0.7}
          >
            <View style={styles.demoToggleTextCol}>
              <Text style={styles.demoToggleTitle}>Offline Demonstration Mode</Text>
              <Text style={styles.demoToggleSubtitle}>
                Forces local deterministic fixtures for audit presentations
              </Text>
            </View>
            <Ionicons
              name={demoMode ? 'toggle' : 'toggle-outline'}
              size={28}
              color={demoMode ? Colors.primary : Colors.textMuted}
            />
          </TouchableOpacity>
        </SurfaceCard>

        {/* AI SOP Operational Assistant */}
        <SurfaceCard variant="elevated" padding={Spacing.base}>
          <View style={styles.sopHeader}>
            <Ionicons name="chatbubbles-outline" size={18} color={Colors.deep} />
            <Text style={styles.sopTitle}>AI SOP Operational Assistant</Text>
          </View>
          <Text style={styles.sopSubtitle}>
            Instant guidance on institutional protocols, unregistered vehicles, and exceptions.
          </Text>

          {/* Quick preset questions */}
          <View style={styles.quickQuestionsRow}>
            <TouchableOpacity
              style={styles.quickQ}
              onPress={() => {
                setSopQuery('Unregistered vehicle arrival');
                handleAskSop('Unregistered vehicle arrival');
              }}
            >
              <Text style={styles.quickQText}>Vehicle Protocol</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickQ}
              onPress={() => {
                setSopQuery('VIP convoy arrival');
                handleAskSop('VIP convoy arrival');
              }}
            >
              <Text style={styles.quickQText}>VIP Arrival</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickQ}
              onPress={() => {
                setSopQuery('Expired card presented');
                handleAskSop('Expired card presented');
              }}
            >
              <Text style={styles.quickQText}>Expired Card</Text>
            </TouchableOpacity>
          </View>

          <InputField
            placeholder="Ask question (e.g. VIP escort, contractor pass)..."
            value={sopQuery}
            onChangeText={setSopQuery}
            rightIcon={
              <TouchableOpacity onPress={() => handleAskSop()} disabled={isQueryingSop}>
                {isQueryingSop ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Ionicons name="send" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            }
          />

          {sopAnswer && (
            <View style={styles.answerBox}>
              <View style={styles.answerHeader}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                <Text style={styles.answerTitle}>IIM Sambalpur SOP Guidance</Text>
              </View>
              <Text style={styles.answerText}>{sopAnswer}</Text>
            </View>
          )}
        </SurfaceCard>

        {/* Sign Out Button */}
        <PrimaryButton
          title="Sign Out & Relieve Station"
          onPress={() => setShowSignOutModal(true)}
          variant="danger"
          icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
          style={styles.signOutButton}
        />
      </View>

      {/* Sign Out Confirmation Modal */}
      <ConfirmationDialog
        visible={showSignOutModal}
        title="Sign Out of Station?"
        message="This will unlock Post 02 and conclude your operational shift. The relieving guard must sign in with their credentials."
        confirmText="Confirm Sign Out"
        variant="danger"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setShowSignOutModal(false)}
        loading={isSigningOut}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingBottom: Spacing['3xl'],
  },
  content: {
    padding: Spacing.base,
  },
  officerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mint,
  },
  avatarInitials: {
    ...Typography.titleSmall,
    color: Colors.deep,
    fontWeight: '800',
  },
  officerDetails: {
    flex: 1,
  },
  officerName: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: 6,
  },
  roleText: {
    ...Typography.badge,
    fontSize: 9,
    color: Colors.deep,
  },
  empBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  empText: {
    ...Typography.monoBold,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  stationLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
  },
  shiftDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.md,
  },
  shiftInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shiftColumn: {
    flex: 1,
  },
  shiftLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  shiftValue: {
    ...Typography.captionBold,
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  diagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  diagTitle: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginLeft: 6,
    fontSize: 13,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  diagLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  diagValue: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    fontSize: 12,
  },
  demoToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  demoToggleTextCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  demoToggleTitle: {
    ...Typography.captionBold,
    fontSize: 12,
    color: Colors.deep,
  },
  demoToggleSubtitle: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sopTitle: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginLeft: 6,
    fontSize: 13,
  },
  sopSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: Spacing.sm,
  },
  quickQuestionsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  quickQ: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  quickQText: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.deep,
  },
  answerBox: {
    backgroundColor: '#F3FAF5',
    borderWidth: 1,
    borderColor: '#BFE4D1',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  answerTitle: {
    ...Typography.badge,
    color: Colors.deep,
    fontSize: 10,
    marginLeft: 4,
  },
  answerText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  signOutButton: {
    marginTop: Spacing.base,
  },
});
