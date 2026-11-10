import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { View, Text, StyleSheet } from 'react-native';

export default function GuardTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.deep,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: Colors.surface,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: Colors.deep,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
        },
      }}
    >
      <Tabs.Screen
        name="verify"
        options={{
          title: 'Verify',
          headerTitle: 'Main Campus Gate · Post 02',
          tabBarLabel: 'Verify',
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerTitle: 'Gate Verification History',
          tabBarLabel: 'Activity',
        }}
      />
      <Tabs.Screen
        name="visitors"
        options={{
          title: 'Visitors',
          headerTitle: 'Visitor Pass Management',
          tabBarLabel: 'Visitors',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Guard Profile & Station Diagnostics',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
