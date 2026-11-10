import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme';
import { useAuth } from '../../src/providers/AuthProvider';
import { InputField, PasswordField, PrimaryButton, SurfaceCard } from '../../src/components';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, toggleDemoMode, demoMode } = useAuth();

  const [employeeId, setEmployeeId] = useState('SEC-G014');
  const [password, setPassword] = useState('guard123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!employeeId.trim() || !password.trim()) {
      setErrorMessage('Please enter both Employee ID and station password.');
      return;
    }

    setErrorMessage(null);
    try {
      await login(employeeId.trim(), password);
      router.replace('/(guard)/verify');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmployeeId('SEC-G014');
    setPassword('guard123');
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardWrapper}>
          {/* Institution Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.shieldIconContainer}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.brandTitle}>GATEWISE AI</Text>
            <Text style={styles.brandSubtitle}>
              Institutional Gate Verification · IIM Sambalpur
            </Text>

            <View style={styles.gateLockBadge}>
              <Ionicons name="location-outline" size={13} color={Colors.deep} />
              <Text style={styles.gateLockText}>Main Campus Gate · Post 02</Text>
            </View>
          </View>

          {/* Login Card */}
          <SurfaceCard variant="elevated" padding={Spacing.xl}>
            <Text style={styles.formTitle}>Guard Terminal Sign-In</Text>
            <Text style={styles.formSubtitle}>
              Enter assigned officer credentials to unlock gate terminal.
            </Text>

            {errorMessage && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}

            <InputField
              label="Guard Employee ID"
              placeholder="e.g. SEC-G014"
              value={employeeId}
              onChangeText={(text) => {
                setEmployeeId(text);
                if (errorMessage) setErrorMessage(null);
              }}
              autoCapitalize="characters"
              leftIcon={<Ionicons name="card-outline" size={18} color={Colors.textSecondary} />}
            />

            <PasswordField
              label="Station Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
            />

            <PrimaryButton
              title="Authenticate & Lock Gate"
              onPress={handleSignIn}
              loading={isLoading}
              icon={<Ionicons name="log-in-outline" size={20} color="#FFFFFF" />}
              style={styles.signInButton}
            />

            {/* Quick Demo Fill Helper */}
            <TouchableOpacity
              onPress={handleQuickDemoFill}
              style={styles.demoFillButton}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles-outline" size={14} color={Colors.deep} />
              <Text style={styles.demoFillText}>Quick-Fill Officer Ramesh (SEC-G014)</Text>
            </TouchableOpacity>
          </SurfaceCard>

          {/* Security Compliance Note */}
          <View style={styles.securityNoteCard}>
            <Ionicons name="lock-closed-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.securityNoteText}>
              Security guards cannot create or approve permanent identities. Single-shot camera
              scans only. Zero video recording or permanent biometric storage.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  shieldIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mint,
  },
  brandTitle: {
    ...Typography.titleLarge,
    color: Colors.deep,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  gateLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  gateLockText: {
    ...Typography.badge,
    color: Colors.deep,
    fontSize: 11,
    marginLeft: 4,
  },
  formTitle: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
  },
  formSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.base,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F2',
    borderWidth: 1,
    borderColor: '#F8CECE',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.base,
  },
  errorBannerText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  signInButton: {
    marginTop: Spacing.sm,
  },
  demoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  demoFillText: {
    ...Typography.captionBold,
    color: Colors.deep,
    marginLeft: 4,
  },
  securityNoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.base,
  },
  securityNoteText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});
