import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface CryptographicSealBadgeProps {
  signature: string;
  timestamp?: string;
  style?: ViewStyle;
}

export function CryptographicSealBadge({
  signature,
  timestamp,
  style,
}: CryptographicSealBadgeProps) {
  const truncatedSig =
    signature.length > 28
      ? `${signature.substring(0, 14)}••••${signature.substring(signature.length - 10)}`
      : signature;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <Ionicons name="lock-closed" size={14} color={Colors.primary} />
        <Text style={styles.title}>IMMUTABLE AUDIT SEAL</Text>
      </View>
      <Text style={styles.signatureText} numberOfLines={1}>
        {truncatedSig}
      </Text>
      {timestamp && (
        <Text style={styles.timestampText}>
          Sealed: {new Date(timestamp).toLocaleTimeString()} · Station Terminal MCG-02
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3FAF5',
    borderWidth: 1,
    borderColor: '#BFE4D1',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    ...Typography.badge,
    color: Colors.deep,
    fontSize: 10,
    marginLeft: 4,
  },
  signatureText: {
    ...Typography.monoBold,
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  timestampText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
