import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../theme';

interface SurfaceCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'highlight' | 'warning' | 'error';
  padding?: number;
}

export function SurfaceCard({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = Spacing.base,
}: SurfaceCardProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.borderSubtle,
        };
      case 'highlight':
        return {
          backgroundColor: '#F3FAF5',
          borderWidth: 1.5,
          borderColor: '#BFE4D1',
        };
      case 'warning':
        return {
          backgroundColor: '#FEFAF0',
          borderWidth: 1.5,
          borderColor: '#F7E2B4',
        };
      case 'error':
        return {
          backgroundColor: '#FDF2F2',
          borderWidth: 1.5,
          borderColor: '#F8CECE',
        };
      case 'elevated':
      default:
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.borderSubtle,
          ...Shadows.card,
        };
    }
  };

  const content = (
    <View
      style={[
        styles.card,
        getContainerStyle(),
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.78}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
});
