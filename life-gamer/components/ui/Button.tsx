import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const backgroundColor = (() => {
    if (disabled) return theme.surfaceElevated;
    switch (variant) {
      case 'primary': return theme.primary;
      case 'secondary': return theme.surfaceElevated;
      case 'ghost': return 'transparent';
    }
  })();

  const textColor = (() => {
    if (disabled) return theme.textMuted;
    switch (variant) {
      case 'primary': return '#0A0A0F';
      case 'secondary': return theme.text;
      case 'ghost': return theme.primary;
    }
  })();

  const paddingVertical = size === 'small' ? 10 : size === 'medium' ? 14 : 18;
  const fontSize = size === 'small' ? 14 : size === 'medium' ? 16 : 18;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor,
          paddingVertical,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme.border,
        },
        variant === 'primary' && !disabled && {
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
