import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';

export default function VisitorsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Visitor Intake & Passes</Text>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>+ Walk-In Pass</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          Manage expected institutional guests, verify pre-approved pass codes, and register unannounced visitors with government photo ID.
        </Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No visitors currently expected at Post 02.</Text>
          <Text style={styles.subText}>Pre-approved passes issued by the Registrar or Host faculty will appear here.</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
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
