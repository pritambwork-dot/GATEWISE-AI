import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  variant?: 'surface' | 'soft' | 'primary' | 'ghost' | 'overlay';
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  disabled = false,
  size = Spacing.minTouchTarget,
  variant = 'surface',
  style,
}: IconButtonProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'soft':
        return Colors.surfaceSecondary;
      case 'primary':
        return Colors.primary;
      case 'overlay':
        return 'rgba(0, 0, 0, 0.45)';
      case 'ghost':
        return 'transparent';
      case 'surface':
      default:
        return Colors.surface;
    }
  };

  const getBorderColor = () => {
    if (variant === 'surface') return Colors.borderSubtle;
    if (variant === 'soft') return Colors.borderSubtle;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: getBorderColor() !== 'transparent' ? 1 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
