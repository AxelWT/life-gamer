import React from 'react';
import { TextInput, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
  maxLength?: number;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
  maxLength,
}: InputProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textMuted}
      multiline={multiline}
      maxLength={maxLength}
      style={[
        styles.input,
        {
          color: theme.text,
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        multiline && styles.multiline,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  multiline: {
    minHeight: 140,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
});
