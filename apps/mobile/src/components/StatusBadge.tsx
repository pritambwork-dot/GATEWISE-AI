import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  style?: ViewStyle;
}

export function StatusBadge({
  status,
  size = 'medium',
  showIcon = true,
  style,
}: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      // 1. State A: Verified & Authorized
      case 'VERIFIED_AUTHORIZED':
      case 'GRANT_ENTRY':
      case 'CHECKED_IN':
      case 'ACTIVE':
        return {
          label: status === 'VERIFIED_AUTHORIZED' ? 'VERIFIED · AUTHORIZED' : status.replace('_', ' '),
          bg: '#E8F5EE',
          text: Colors.primary,
          border: '#BFE4D1',
          icon: 'checkmark-circle' as const,
        };

      // 2. State B/F: Expired / Unauthorized
      case 'AUTHORIZATION_EXPIRED':
      case 'EXPIRED':
        return {
          label: 'ACCESS EXPIRED',
          bg: '#FDF0ED',
          text: Colors.error,
          border: '#F8CECE',
          icon: 'alert-circle' as const,
        };

      case 'IDENTIFIED_UNAUTHORIZED':
      case 'DENY_ENTRY':
      case 'DENIED':
        return {
          label: 'UNAUTHORIZED',
          bg: '#FDF0ED',
          text: Colors.error,
          border: '#F8CECE',
          icon: 'close-circle' as const,
        };

      // 3. State C: Potential Match (70–89%)
      case 'POTENTIAL_MATCH':
      case 'MANUAL_ID_CONFIRMED':
        return {
          label: 'REVIEW REQUIRED (70-89%)',
          bg: '#FEF8EB',
          text: Colors.warning,
          border: '#F7E2B4',
          icon: 'warning' as const,
        };

      // 4. State D: Unknown Person (<70%)
      case 'UNKNOWN_PERSON':
      case 'REFER_TO_VISITOR_DESK':
        return {
          label: 'UNKNOWN PERSON (<70%)',
          bg: '#EDF2F0',
          text: Colors.textSecondary,
          border: '#CBD8D2',
          icon: 'help-circle' as const,
        };

      // 5. State E: Image Quality Insufficient
      case 'IMAGE_QUALITY_INSUFFICIENT':
        return {
          label: 'QUALITY LOW · RETAKE',
          bg: '#FFF4E5',
          text: '#C05621',
          border: '#FBD38D',
          icon: 'camera-reverse-outline' as const,
        };

      // 6. State G: Offline Standby
      case 'SERVICE_UNAVAILABLE':
      case 'OFFLINE_STANDBY':
        return {
          label: 'OFFLINE STANDBY',
          bg: '#EAF3F9',
          text: '#2B6CB0',
          border: '#BEE3F8',
          icon: 'cloud-offline-outline' as const,
        };

      // Visitors
      case 'EXPECTED':
        return {
          label: 'EXPECTED TODAY',
          bg: '#E8F4F8',
          text: '#2B6CB0',
          border: '#BEE3F8',
          icon: 'calendar-outline' as const,
        };

      case 'CHECKED_OUT':
        return {
          label: 'CHECKED OUT',
          bg: '#EDF2F0',
          text: Colors.textMuted,
          border: '#D2DDD8',
          icon: 'exit-outline' as const,
        };

      case 'ESCALATE_TO_ADMIN':
      case 'ESCALATED':
        return {
          label: 'ESCALATED TO ADMIN',
          bg: '#FFF0F5',
          text: '#B83280',
          border: '#FED7E2',
          icon: 'arrow-redo-circle-outline' as const,
        };

      default:
        return {
          label: status.replace(/_/g, ' '),
          bg: Colors.surfaceSecondary,
          text: Colors.textSecondary,
          border: Colors.borderSubtle,
          icon: 'information-circle-outline' as const,
        };
    }
  };

  const config = getBadgeConfig();
  const iconSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical: size === 'small' ? 3 : size === 'large' ? 6 : 4,
          paddingHorizontal: size === 'small' ? 8 : size === 'large' ? 14 : 10,
        },
        style,
      ]}
    >
      {showIcon && (
        <Ionicons
          name={config.icon}
          size={iconSize}
          color={config.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: config.text,
            fontSize: size === 'small' ? 10 : size === 'large' ? 13 : 11,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...Typography.badge,
  },
});
