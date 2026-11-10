import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme';

export default function ProfileLayout() {
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
          title: 'Profile & Station',
          headerTitle: 'Guard Terminal Diagnostics',
        }}
      />
    </Stack>
  );
}
