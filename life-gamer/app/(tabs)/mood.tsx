import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useDiaryStore } from '../../stores/diaryStore';
import { useTodoStore } from '../../stores/todoStore';
import { Colors } from '../../constants/colors';
import { MOODS } from '../../constants/moods';
import { MoodStat } from '../../types';
import Card from '../../components/ui/Card';
import MoodCalendar from '../../components/MoodCalendar';
import TodoList from '../../components/TodoList';

export default function MoodScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const diaries = useDiaryStore((s) => s.diaries);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // TODO 相关状态
  const {
    todos,
    selectedDate,
    datesWithTodos,
    isLoading: isTodoLoading,
    initTodoTable,
    setSelectedDate,
    loadTodosByDate,
    loadDatesWithTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodoStore();

  // 初始化 TODO 表
  useEffect(() => {
    initTodoTable();
  }, []);

  // 加载当月的 TODO 标记
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    loadDatesWithTodos(year, month);
  }, [currentMonth]);

  // 加载选中日期的 TODO
  useEffect(() => {
    loadTodosByDate(selectedDate);
  }, [selectedDate]);

  // 处理日期点击
  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

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
      {/* Calendar Card */}
      <Card>
        <MoodCalendar
          diaries={diaries}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayPress={handleDayPress}
          selectedDate={selectedDate}
          datesWithTodos={datesWithTodos}
        />
      </Card>

      {/* Todo Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>TODO</Text>
        <Card>
          <TodoList
            date={selectedDate}
            todos={todos}
            isLoading={isTodoLoading}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={(id, content) => updateTodo(id, { content })}
          />
        </Card>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>ANALYTICS</Text>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>本月心情统计</Text>

        {monthDiaries.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              本月暂无记录
            </Text>
          </Card>
        ) : (
          <>
            {/* Top Mood Card */}
            {topMood && (
              <Card glowing style={styles.topMoodCard}>
                <Text style={[styles.topMoodLabel, { color: theme.textMuted }]}>
                  最多的心情
                </Text>
                <View style={styles.topMoodRow}>
                  <Text style={styles.topMoodEmoji}>
                    {MOODS.find((m) => m.key === topMood.mood)?.emoji}
                  </Text>
                  <View style={styles.topMoodInfo}>
                    <Text style={[styles.topMoodName, { color: theme.text }]}>
                      {MOODS.find((m) => m.key === topMood.mood)?.label}
                    </Text>
                    <Text style={[styles.topMoodCount, { color: theme.textSecondary }]}>
                      {topMood.count}次 · {Math.round(topMood.percentage)}%
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Mood Stats */}
            <View style={styles.statsContainer}>
              {moodStats.map((stat) => {
                const moodDef = MOODS.find((m) => m.key === stat.mood);
                if (!moodDef) return null;
                return (
                  <Card key={stat.mood} style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View style={[styles.statEmojiBg, { backgroundColor: moodDef.color + '18' }]}>
                        <Text style={styles.statEmoji}>{moodDef.emoji}</Text>
                      </View>
                      <Text style={[styles.statLabel, { color: theme.text }]}>{moodDef.label}</Text>
                      <Text style={[styles.statCount, { color: theme.textSecondary }]}>
                        {stat.count}次
                      </Text>
                    </View>
                    <View style={[styles.statBarBg, { backgroundColor: theme.surfaceElevated }]}>
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
    padding: 24,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  topMoodCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  topMoodLabel: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  topMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topMoodEmoji: {
    fontSize: 40,
  },
  topMoodInfo: {
    gap: 2,
  },
  topMoodName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  topMoodCount: {
    fontSize: 14,
  },
  statsContainer: {
    gap: 10,
  },
  statCard: {
    gap: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statEmojiBg: {
    borderRadius: 10,
    padding: 6,
  },
  statEmoji: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.2,
  },
  statCount: {
    fontSize: 14,
    fontWeight: '500',
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
