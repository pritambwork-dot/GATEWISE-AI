import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/theme';

export default function ActivityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Gate Verification Audit Log</Text>
        <Text style={styles.description}>
          Every decision made at Post 02 is immutably sealed with a SHA-256 cryptographic hash and queued for real-time dispatch to the Central Command Centre.
        </Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No verifications recorded for the current session.</Text>
          <Text style={styles.subText}>Logs will stream here in real time as verifications occur.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
