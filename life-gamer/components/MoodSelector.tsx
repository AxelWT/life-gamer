import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MoodType } from '../types';
import { MOODS } from '../constants/moods';
import { Colors } from '../constants/colors';

interface MoodSelectorProps {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>今天的心情</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => {
          const isSelected = selected === mood.key;
          return (
            <TouchableOpacity
              key={mood.key}
              onPress={() => onSelect(mood.key)}
              style={[
                styles.moodOption,
                {
                  backgroundColor: isSelected ? mood.color + '18' : theme.surfaceElevated,
                  borderColor: isSelected ? mood.color : theme.border,
                },
                isSelected && {
                  shadowColor: mood.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 4,
                },
              ]}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, { color: isSelected ? mood.color : theme.textSecondary }]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 60,
  },
  emoji: {
    fontSize: 26,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
