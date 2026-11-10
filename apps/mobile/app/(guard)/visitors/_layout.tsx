import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme';

export default function VisitorsLayout() {
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
          title: 'Visitors',
          headerTitle: 'Visitor Pass Management',
        }}
      />
      <Stack.Screen
        name="[visitorId]"
        options={{
          title: 'Pass Details',
          headerTitle: 'Visitor Pass Clearance',
        }}
      />
      <Stack.Screen
        name="intake"
        options={{
          title: 'Visitor Intake',
          headerTitle: 'Walk-In Registration',
        }}
      />
    </Stack>
  );
}
