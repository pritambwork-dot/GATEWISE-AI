import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useAuth } from '../providers/AuthProvider';

interface StationTelemetryBarProps {
  onPressTelemetry?: () => void;
}

export function StationTelemetryBar({ onPressTelemetry }: StationTelemetryBarProps) {
  const { assignedGate, isOffline, demoMode, toggleDemoMode } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPressTelemetry}
        activeOpacity={0.7}
        style={styles.gateInfo}
      >
        <View style={styles.gateIconWrapper}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.gateName} numberOfLines={1}>
            {assignedGate?.name || 'Main Campus Gate · Post 02'}
          </Text>
          <Text style={styles.gateCode}>
            Terminal MCG-02 · {assignedGate?.operatingHours || '24/7 Access'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.telemetryIndicators}>
        {demoMode && (
          <TouchableOpacity onPress={toggleDemoMode} style={styles.demoBadge}>
            <Text style={styles.demoText}>DEMO</Text>
          </TouchableOpacity>
        )}

        <View style={styles.indicatorPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOffline ? Colors.warning : Colors.success },
            ]}
          />
          <Text style={styles.statusText}>{isOffline ? 'Offline' : 'Online'}</Text>
        </View>

        <View style={styles.batteryIndicator}>
          <Ionicons name="battery-charging" size={16} color={Colors.deep} />
          <Text style={styles.batteryText}>88%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  gateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  gateIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  textColumn: {
    flex: 1,
  },
  gateName: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  gateCode: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  telemetryIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoBadge: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FED7E2',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  demoText: {
    ...Typography.badge,
    color: '#B83280',
    fontSize: 9,
  },
  indicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  batteryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  batteryText: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
});
