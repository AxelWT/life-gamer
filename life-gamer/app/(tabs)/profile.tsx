import React from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useGameStore } from '../../stores/gameStore';
import { useDiaryStore } from '../../stores/diaryStore';
import { Colors } from '../../constants/colors';
import { ACHIEVEMENTS } from '../../constants/achievements';
import Card from '../../components/ui/Card';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const profile = useGameStore((s) => s.profile);
  const diaries = useDiaryStore((s) => s.diaries);

  const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
  const expProgress = profile ? profile.exp / profile.expToNextLevel : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {profile && (
        <Card style={styles.profileCard}>
          <Text style={[styles.levelText, { color: theme.primary }]}>
            Lv.{profile.level}
          </Text>
          <Text style={[styles.titleText, { color: theme.text }]}>{profile.title}</Text>
          <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
            <View
              style={[styles.progressBar, { backgroundColor: theme.primary, width: `${expProgress * 100}%` }]}
            />
          </View>
          <Text style={[styles.expText, { color: theme.textSecondary }]}>
            {profile.exp} / {profile.expToNextLevel} EXP
          </Text>
          <View style={styles.streakRow}>
            <Text style={[styles.streakText, { color: theme.primary }]}>
              🔥 连续{profile.streakDays}天
            </Text>
          </View>
        </Card>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>统计</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{diaries.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>日记篇数</Text>
          </Card>
          <Card style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{totalWords}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>总字数</Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>成就</Text>
        <View style={styles.achievementList}>
          {ACHIEVEMENTS.map((def) => {
            const unlocked = profile?.achievements.find((a) => a.id === def.id)?.isUnlocked;
            return (
              <Card key={def.id} style={[styles.achievementCard, !unlocked && styles.lockedCard]}>
                <Text style={styles.achievementIcon}>
                  {unlocked ? def.icon : '🔒'}
                </Text>
                <View style={styles.achievementInfo}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      { color: unlocked ? theme.text : theme.textSecondary },
                    ]}
                  >
                    {def.title}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: theme.textSecondary }]}>
                    {def.description}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>
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
  profileCard: {
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 36,
    fontWeight: '800',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  expText: {
    fontSize: 12,
  },
  streakRow: {
    marginTop: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
  },
  achievementList: {
    gap: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockedCard: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  achievementDesc: {
    fontSize: 13,
  },
});
