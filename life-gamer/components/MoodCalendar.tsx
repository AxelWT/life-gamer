import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Diary } from '../types';
import { Colors } from '../constants/colors';
import { MOODS } from '../constants/moods';

interface MoodCalendarProps {
  diaries: Diary[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayPress: (date: string) => void;
  selectedDate?: string;
  datesWithTodos?: Set<string>;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const DAY_WIDTH = '14.28%';

export default function MoodCalendar({
  diaries,
  currentMonth,
  onMonthChange,
  onDayPress,
  selectedDate,
  datesWithTodos = new Set(),
}: MoodCalendarProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const year = currentMonth.getFullYear();

  const diaryMap = useMemo(() => {
    const map: Record<string, Diary> = {};
    diaries.forEach((d) => {
      const date = new Date(d.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (!map[key]) map[key] = d;
    });
    return map;
  }, [diaries]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, currentMonth.getMonth(), 1);
    const lastDay = new Date(year, currentMonth.getMonth() + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [year, currentMonth]);

  const handlePrev = () => {
    onMonthChange(new Date(year, currentMonth.getMonth() - 1, 1));
  };

  const handleNext = () => {
    onMonthChange(new Date(year, currentMonth.getMonth() + 1, 1));
  };

  const monthLabel = `${year}年${currentMonth.getMonth() + 1}月`;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handlePrev} style={styles.arrowBtn}>
          <Text style={[styles.arrow, { color: theme.primary }]}>◀</Text>
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.text }]}>{monthLabel}</Text>
        <TouchableOpacity onPress={handleNext} style={styles.arrowBtn}>
          <Text style={[styles.arrow, { color: theme.primary }]}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: theme.textMuted }]}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={[styles.dayCell, { width: DAY_WIDTH }]} />;
          }

          const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const diary = diaryMap[dateStr];
          const moodDef = diary ? MOODS.find((m) => m.key === diary.mood) : null;
          const isSelected = selectedDate === dateStr;
          const hasTodo = datesWithTodos.has(dateStr);

          return (
            <TouchableOpacity
              key={dateStr}
              onPress={() => onDayPress(dateStr)}
              style={[
                styles.dayCell,
                { width: DAY_WIDTH },
                isSelected && styles.selectedCell,
                isSelected && { backgroundColor: theme.primary + '30' },
                moodDef && !isSelected && {
                  backgroundColor: moodDef.color + '18',
                  borderRadius: 10,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isSelected
                      ? theme.primary
                      : moodDef
                      ? moodDef.color
                      : theme.text,
                    fontWeight: isSelected || moodDef ? '700' : '400',
                  },
                ]}
              >
                {day}
              </Text>
              {/* TODO 标记点 */}
              {hasTodo && (
                <View
                  style={[
                    styles.todoDot,
                    { backgroundColor: theme.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  arrowBtn: {
    padding: 10,
  },
  arrow: {
    fontSize: 16,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedCell: {
    borderRadius: 10,
  },
  dayText: {
    fontSize: 15,
  },
  todoDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
