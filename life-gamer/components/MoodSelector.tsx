import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MoodType } from '../../types';
import { MOODS } from '../../constants/moods';
import { Colors } from '../../constants/colors';

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
                  backgroundColor: isSelected ? mood.color + '20' : theme.background,
                  borderColor: isSelected ? mood.color : theme.border,
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
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 10,
    minWidth: 58,
  },
  emoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
