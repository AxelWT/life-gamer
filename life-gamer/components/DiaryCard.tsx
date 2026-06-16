import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Diary } from '../types';
import { Colors } from '../constants/colors';
import { MOODS } from '../constants/moods';

interface DiaryCardProps {
  diary: Diary;
  onPress: (diary: Diary) => void;
}

export default function DiaryCard({ diary, onPress }: DiaryCardProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const moodDef = MOODS.find((m) => m.key === diary.mood);
  const date = new Date(diary.createdAt);
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <TouchableOpacity
      onPress={() => onPress(diary)}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderLeftColor: moodDef?.color ?? theme.border,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {diary.title || '无标题'}
        </Text>
        <View style={styles.headerRight}>
          {diary.isFavorite && <Text style={styles.star}>⭐</Text>}
          <Text style={styles.moodEmoji}>{moodDef?.emoji}</Text>
        </View>
      </View>
      <Text style={[styles.content, { color: theme.textSecondary }]} numberOfLines={2}>
        {diary.content}
      </Text>
      <Text style={[styles.date, { color: theme.textSecondary }]}>{dateStr}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    fontSize: 14,
  },
  moodEmoji: {
    fontSize: 20,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
  },
});
