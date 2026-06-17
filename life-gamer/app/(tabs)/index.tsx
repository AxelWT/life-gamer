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
      {/* Header Badge */}
      <View style={[styles.badge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.badgeDot, { backgroundColor: theme.primary }]} />
        <Text style={[styles.badgeText, { color: theme.primary }]}>LifeGamer · 生活游戏化</Text>
      </View>

      {/* Greeting */}
      <Text style={[styles.greeting, { color: theme.text }]}>{greeting} 👋</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        记录生活，升级人生
      </Text>

      {/* Level Card */}
      {profile && (
        <Card glowing style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelLeft}>
              <Text style={[styles.levelValue, { color: theme.primary }]}>
                Lv.{profile.level}
              </Text>
              <Text style={[styles.levelTitle, { color: theme.text }]}>
                {profile.title}
              </Text>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: theme.primaryGlow }]}>
              <Text style={[styles.streak, { color: theme.primary }]}>
                🔥 {profile.streakDays}天
              </Text>
            </View>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.surfaceElevated }]}>
            <View
              style={[styles.progressBar, { backgroundColor: theme.primary, width: `${expProgress * 100}%` }]}
            />
          </View>
          <View style={styles.expRow}>
            <Text style={[styles.expLabel, { color: theme.textMuted }]}>经验值</Text>
            <Text style={[styles.expText, { color: theme.textSecondary }]}>
              {profile.exp} / {profile.expToNextLevel}
            </Text>
          </View>
        </Card>
      )}

      {/* Today Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>TODAY</Text>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>今日记录</Text>
        {todayDiary ? (
          <Card>
            <View style={styles.completedRow}>
              <Text style={[styles.completedText, { color: theme.primary }]}>✅ 今日已记录</Text>
            </View>
          </Card>
        ) : (
          <Button
            title="✏️ 写今日日记"
            onPress={() => router.push('/diary/write')}
          />
        )}
      </View>

      {/* Recent Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>RECENT</Text>
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
    padding: 24,
    gap: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: -12,
    letterSpacing: 0.3,
  },
  levelCard: {
    gap: 14,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelLeft: {
    gap: 4,
  },
  levelValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  streakBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  streak: {
    fontSize: 15,
    fontWeight: '700',
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
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  expText: {
    fontSize: 12,
    fontWeight: '500',
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
  completedRow: {
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  recentList: {
    gap: 12,
  },
});
