import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { Colors } from '../../constants/theme';

export default function VerifyScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleStartCapture = async () => {
    if (!permission) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to capture verification photos at this gate.');
        return;
      }
    } else if (!permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permission Denied', 'Camera permission was not granted. Please enable camera access in Android Settings.');
        return;
      }
    }
    
    // In this foundation phase, confirm camera readiness without automatic background execution
    setStatusMessage('Camera ready. Single-shot manual capture will be activated in verification workflow.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.stationBadge}>
        <View style={styles.indicator} />
        <Text style={styles.stationText}>POST 02 · SHIFT A ACTIVE</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.cardTitle}>Identity Verification Post</Text>
        <Text style={styles.cardSubtitle}>
          Manual single-shot verification. The camera captures only when you press the shutter. Zero continuous video surveillance.
        </Text>

        <View style={styles.metaBox}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Assigned Post:</Text>
            <Text style={styles.metaValue}>Main Campus Gate</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Duty Officer:</Text>
            <Text style={styles.metaValue}>Vikram Singh (SEC-G014)</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Institutional Protocol:</Text>
            <Text style={styles.metaValue}>Human Decision Sovereign</Text>
          </View>
        </View>

        {statusMessage && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{statusMessage}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.captureBtn} onPress={handleStartCapture} activeOpacity={0.85}>
          <Text style={styles.captureBtnText}>Initiate Camera Capture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceTitle}>Security Officer SOP</Text>
        <Text style={styles.guidanceItem}>1. Instruct person to stand inside camera frame (1.2m – 1.5m).</Text>
        <Text style={styles.guidanceItem}>2. Confirm live person matches approved reference portrait.</Text>
        <Text style={styles.guidanceItem}>3. Record your explicit decision (Grant / Deny / Escalate).</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
    gap: 16,
  },
  stationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  stationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.deep,
    letterSpacing: 0.5,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  metaBox: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  alertBox: {
    backgroundColor: Colors.mint,
    padding: 10,
    borderRadius: 10,
  },
  alertText: {
    fontSize: 12,
    color: Colors.deep,
    fontWeight: '600',
  },
  captureBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  guidanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  guidanceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  guidanceItem: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
