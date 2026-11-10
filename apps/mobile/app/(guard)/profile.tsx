import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = () => {
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.officerProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VS</Text>
          </View>
          <View style={styles.officerDetails}>
            <Text style={styles.name}>Vikram Singh</Text>
            <Text style={styles.empId}>Security Officer · SEC-G014</Text>
            <Text style={styles.badge}>Post 02 · Shift A (Morning)</Text>
          </View>
        </View>

        <View style={styles.diagnosticsBox}>
          <Text style={styles.sectionHeader}>Terminal Diagnostics</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Device Package:</Text>
            <Text style={styles.value}>com.gatewiseai.guard</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Assigned Gate:</Text>
            <Text style={styles.value}>Main Campus Gate (Post 02)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lock Status:</Text>
            <Text style={[styles.value, { color: Colors.success }]}>Enforced</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Local Buffer:</Text>
            <Text style={styles.value}>0 Pending Sync</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut} activeOpacity={0.8}>
          <Text style={styles.logoutText}>End Shift / Sign Out</Text>
        </TouchableOpacity>
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
    gap: 18,
  },
  officerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.deep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  officerDetails: {
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  empId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  diagnosticsBox: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 13,
  },
});
