import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../src/providers/AuthProvider';
import { Colors, Spacing, Typography, BorderRadius } from '../src/theme';
import { ONBOARDING_COMPLETED_KEY } from './(auth)/onboarding';
import { Ionicons } from '@expo/vector-icons';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    async function determineInitialRoute() {
      if (authLoading) return;

      try {
        const onboardingCompleted = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
        if (!onboardingCompleted) {
          router.replace('/(auth)/onboarding');
          return;
        }

        if (isAuthenticated) {
          router.replace('/(guard)/verify');
        } else {
          router.replace('/(auth)/login');
        }
      } catch {
        // Fallback to login if secure storage read fails
        router.replace('/(auth)/login');
      } finally {
        setCheckingOnboarding(false);
      }
    }

    determineInitialRoute();
  }, [authLoading, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <View style={styles.brandBox}>
        <View style={styles.shieldWrapper}>
          <Ionicons name="shield-checkmark" size={44} color={Colors.primary} />
        </View>
        <Text style={styles.title}>GATEWISE AI</Text>
        <Text style={styles.subtitle}>Institutional Security Guard Terminal</Text>
        <View style={styles.indicatorWrapper}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Initializing secure enclave...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  brandBox: {
    alignItems: 'center',
  },
  shieldWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  title: {
    ...Typography.titleLarge,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
    marginBottom: Spacing.xxs,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing['2xl'],
  },
  indicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
