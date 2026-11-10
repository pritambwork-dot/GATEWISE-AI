import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme';

export default function ActivityLayout() {
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
          title: 'Activity Feed',
          headerTitle: 'Gate Verification History',
        }}
      />
      <Stack.Screen
        name="[eventId]"
        options={{
          title: 'Event Details',
          headerTitle: 'Audit Record Sheet',
        }}
      />
    </Stack>
  );
}
