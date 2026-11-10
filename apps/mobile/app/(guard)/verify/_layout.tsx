import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme';

export default function VerifyLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.deep,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Verify Station',
          headerTitle: 'Main Campus Gate · Post 02',
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          title: 'Review Capture',
          headerTitle: 'Frame Quality Review',
        }}
      />
      <Stack.Screen
        name="processing"
        options={{
          title: 'Processing',
          headerTitle: 'Verifying Subject Clearance',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Verification Result',
          headerTitle: 'Access Assessment',
        }}
      />
      <Stack.Screen
        name="decision"
        options={{
          title: 'Guard Decision',
          headerTitle: 'Record Entry Decision',
        }}
      />
    </Stack>
  );
}
