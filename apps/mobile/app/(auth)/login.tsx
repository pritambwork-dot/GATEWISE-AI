import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme';
import { useAuth } from '../../src/providers/AuthProvider';
import { InputField, PasswordField, PrimaryButton, SurfaceCard } from '../../src/components';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reason?: string }>();
  const { login, isLoading } = useAuth();

  const [employeeId, setEmployeeId] = useState('SEC-G014');
  const [password, setPassword] = useState('guard123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSessionExpired = params.reason === 'session_expired';

  const handleSignIn = async () => {
    try {
      Vibration.vibrate(25);
    } catch {
      // Ignore vibration error
    }

    if (!employeeId.trim() || !password.trim()) {
      setErrorMessage('Please enter both Officer ID and terminal access password.');
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
    try {
      Vibration.vibrate(15);
    } catch {
      // Ignore vibration error
    }
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          {/* Institution Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.shieldIconContainer}>
              <Ionicons name="shield-checkmark" size={34} color={Colors.primary} />
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

          {/* Session Expired Banner if applicable */}
          {isSessionExpired && (
            <View style={styles.sessionExpiredBanner}>
              <Ionicons name="time-outline" size={16} color={Colors.warning} />
              <Text style={styles.sessionExpiredText}>
                Terminal session expired for security. Please sign in again.
              </Text>
            </View>
          )}

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
              autoCorrect={false}
              textContentType="username"
              autoComplete="username"
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
              textContentType="password"
              autoComplete="password"
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
              Officers cannot create or approve permanent identities. Single-shot camera scans
              only. Zero video recording or permanent biometric storage.
            </Text>
          </View>

          {/* Technical Support Footer */}
          <View style={styles.supportFooter}>
            <Text style={styles.supportText}>Need terminal assistance? Contact Command Centre</Text>
            <Text style={styles.supportContact}>Ext: 4401 · security-ops@gatewise.ac.in</Text>
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
    paddingVertical: Spacing['2xl'],
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mint,
    elevation: 2,
    shadowColor: Colors.deep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  brandTitle: {
    ...Typography.titleLarge,
    color: Colors.deep,
    letterSpacing: 0.8,
  },
  brandSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
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
    fontWeight: '700',
  },
  sessionExpiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCBF',
    borderWidth: 1,
    borderColor: '#ECC94B',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  },
  sessionExpiredText: {
    fontSize: 12,
    color: '#744210',
    fontWeight: '600',
    flex: 1,
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
  supportFooter: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  supportText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  supportContact: {
    fontSize: 11,
    color: Colors.deep,
    fontWeight: '700',
    marginTop: 2,
  },
});
