import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useDiaryStore } from '../../stores/diaryStore';
import { Colors } from '../../constants/colors';
import { MOODS } from '../../constants/moods';
import { MoodType, MoodStat } from '../../types';
import Card from '../../components/ui/Card';
import MoodCalendar from '../../components/MoodCalendar';

export default function MoodScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const diaries = useDiaryStore((s) => s.diaries);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthDiaries = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = new Date(year, month, 1).getTime();
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
    return diaries.filter((d) => d.createdAt >= start && d.createdAt <= end);
  }, [diaries, currentMonth]);

  const moodStats: MoodStat[] = useMemo(() => {
    if (monthDiaries.length === 0) return [];
    const counts: Record<string, number> = {};
    monthDiaries.forEach((d) => {
      counts[d.mood] = (counts[d.mood] || 0) + 1;
    });
    return MOODS.map((m) => ({
      mood: m.key,
      count: counts[m.key] || 0,
      percentage: ((counts[m.key] || 0) / monthDiaries.length) * 100,
    })).filter((s) => s.count > 0);
  }, [monthDiaries]);

  const topMood = useMemo(() => {
    if (moodStats.length === 0) return null;
    return moodStats.reduce((a, b) => (a.count > b.count ? a : b));
  }, [moodStats]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Card>
        <MoodCalendar
          diaries={diaries}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayPress={() => {}}
        />
      </Card>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>本月心情统计</Text>

        {monthDiaries.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              本月暂无记录
            </Text>
          </Card>
        ) : (
          <>
            {topMood && (
              <Card style={styles.topMoodCard}>
                <Text style={[styles.topMoodLabel, { color: theme.textSecondary }]}>
                  最多的心情
                </Text>
                <View style={styles.topMoodRow}>
                  <Text style={styles.topMoodEmoji}>
                    {MOODS.find((m) => m.key === topMood.mood)?.emoji}
                  </Text>
                  <Text style={[styles.topMoodName, { color: theme.text }]}>
                    {MOODS.find((m) => m.key === topMood.mood)?.label}
                  </Text>
                  <Text style={[styles.topMoodCount, { color: theme.textSecondary }]}>
                    {topMood.count}次
                  </Text>
                </View>
              </Card>
            )}

            <View style={styles.statsContainer}>
              {moodStats.map((stat) => {
                const moodDef = MOODS.find((m) => m.key === stat.mood);
                if (!moodDef) return null;
                return (
                  <Card key={stat.mood} style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Text style={styles.statEmoji}>{moodDef.emoji}</Text>
                      <Text style={[styles.statLabel, { color: theme.text }]}>{moodDef.label}</Text>
                      <Text style={[styles.statCount, { color: theme.textSecondary }]}>
                        {stat.count}次
                      </Text>
                    </View>
                    <View style={[styles.statBarBg, { backgroundColor: theme.border }]}>
                      <View
                        style={[
                          styles.statBar,
                          { backgroundColor: moodDef.color, width: `${stat.percentage}%` },
                        ]}
                      />
                    </View>
                  </Card>
                );
              })}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  topMoodCard: {
    alignItems: 'center',
    gap: 8,
  },
  topMoodLabel: {
    fontSize: 14,
  },
  topMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topMoodEmoji: {
    fontSize: 32,
  },
  topMoodName: {
    fontSize: 20,
    fontWeight: '700',
  },
  topMoodCount: {
    fontSize: 14,
  },
  statsContainer: {
    gap: 8,
  },
  statCard: {
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statEmoji: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  statCount: {
    fontSize: 13,
  },
  statBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 3,
  },
});
