import React, { useState } from 'react';
import { TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from './InputField';
import { Colors } from '../theme';

interface PasswordFieldProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export function PasswordField({
  label = 'Password',
  value,
  onChangeText,
  placeholder = '••••••••',
  error,
  ...props
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!isVisible}
      error={error}
      autoCapitalize="none"
      autoCorrect={false}
      leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} />}
      rightIcon={
        <TouchableOpacity
          onPress={() => setIsVisible(!isVisible)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      }
      {...props}
    />
  );
}
