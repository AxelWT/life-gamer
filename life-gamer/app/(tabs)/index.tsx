import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiaryStore } from '../../stores/diaryStore';
import { useGameStore } from '../../stores/gameStore';
import { Colors } from '../../constants/colors';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DiaryCard from '../../components/DiaryCard';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const router = useRouter();
  const diaries = useDiaryStore((s) => s.diaries);
  const profile = useGameStore((s) => s.profile);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayDiary = diaries.find((d) => {
    const dDate = new Date(d.createdAt).toISOString().split('T')[0];
    return dDate === today;
  });

  const recentDiaries = diaries.slice(0, 3);

  const expProgress = profile
    ? profile.exp / profile.expToNextLevel
    : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.greeting, { color: theme.text }]}>{greeting} 👋</Text>

      {profile && (
        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={[styles.levelTitle, { color: theme.text }]}>
              Lv.{profile.level} {profile.title}
            </Text>
            <Text style={[styles.streak, { color: theme.primary }]}>
              🔥 {profile.streakDays}天
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
            <View
              style={[styles.progressBar, { backgroundColor: theme.primary, width: `${expProgress * 100}%` }]}
            />
          </View>
          <Text style={[styles.expText, { color: theme.textSecondary }]}>
            {profile.exp} / {profile.expToNextLevel} EXP
          </Text>
        </Card>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>今日记录</Text>
        {todayDiary ? (
          <Card>
            <Text style={[styles.completedText, { color: theme.primary }]}>✅ 今日已记录</Text>
          </Card>
        ) : (
          <Button
            title="✏️ 写今日日记"
            onPress={() => router.push('/diary/write')}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>最近记录</Text>
        {recentDiaries.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              还没有日记，开始写一篇吧 ✍️
            </Text>
          </Card>
        ) : (
          <View style={styles.recentList}>
            {recentDiaries.map((diary) => (
              <DiaryCard
                key={diary.id}
                diary={diary}
                onPress={() => {}}
              />
            ))}
          </View>
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  levelCard: {
    gap: 10,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  streak: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  recentList: {
    gap: 12,
  },
});
