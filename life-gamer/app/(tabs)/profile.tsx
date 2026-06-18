import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme, Alert } from 'react-native';
import { useGameStore } from '../../stores/gameStore';
import { useDiaryStore } from '../../stores/diaryStore';
import { Colors } from '../../constants/colors';
import { ACHIEVEMENTS } from '../../constants/achievements';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { exportDiaries, exportDiariesAsJson } from '../../utils/exportDiary';
import { importDiariesFromFile, mergeImportedDiaries } from '../../utils/importDiary';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const profile = useGameStore((s) => s.profile);
  const diaries = useDiaryStore((s) => s.diaries);
  const addDiary = useDiaryStore((s) => s.addDiary);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
  const expProgress = profile ? profile.exp / profile.expToNextLevel : 0;

  const handleExport = async () => {
    if (diaries.length === 0) {
      Alert.alert('提示', '还没有日记可以导出');
      return;
    }
    setExporting(true);
    try {
      const success = await exportDiaries(diaries);
      if (!success) {
        Alert.alert('提示', '当前设备不支持分享功能');
      }
    } catch (error) {
      Alert.alert('错误', '导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJson = async () => {
    if (diaries.length === 0) {
      Alert.alert('提示', '还没有日记可以导出');
      return;
    }
    setExporting(true);
    try {
      const success = await exportDiariesAsJson(diaries);
      if (!success) {
        Alert.alert('提示', '当前设备不支持分享功能');
      }
    } catch (error) {
      Alert.alert('错误', '导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const importedDiaries = await importDiariesFromFile();

      if (!importedDiaries) {
        setImporting(false);
        return;
      }

      const { newDiaries, duplicateCount } = mergeImportedDiaries(diaries, importedDiaries);

      if (newDiaries.length === 0) {
        Alert.alert('提示', `所有 ${duplicateCount} 篇日记都已存在，无需导入`);
        setImporting(false);
        return;
      }

      // 确认导入
      Alert.alert(
        '确认导入',
        `找到 ${importedDiaries.length} 篇日记，其中 ${newDiaries.length} 篇为新日记${duplicateCount > 0 ? `，${duplicateCount} 篇已存在` : ''}。是否导入？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '导入',
            onPress: async () => {
              try {
                // 批量导入新日记
                for (const diary of newDiaries) {
                  await addDiary(diary.title, diary.content, diary.mood, diary.tags, diary.images);
                }
                Alert.alert('成功', `成功导入 ${newDiaries.length} 篇日记`);
              } catch (error) {
                Alert.alert('错误', '导入失败，请重试');
              } finally {
                setImporting(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', error instanceof Error ? error.message : '导入失败，请重试');
      setImporting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Card */}
      {profile && (
        <Card glowing style={styles.profileCard}>
          <View style={[styles.avatarBg, { backgroundColor: theme.primaryGlow }]}>
            <Text style={styles.avatarEmoji}>🎮</Text>
          </View>
          <Text style={[styles.levelText, { color: theme.primary }]}>
            Lv.{profile.level}
          </Text>
          <Text style={[styles.titleText, { color: theme.text }]}>{profile.title}</Text>
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
          <View style={[styles.streakBadge, { backgroundColor: theme.primaryGlow }]}>
            <Text style={[styles.streakText, { color: theme.primary }]}>
              🔥 连续{profile.streakDays}天
            </Text>
          </View>
        </Card>
      )}

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>STATS</Text>
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

      {/* Tools Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>TOOLS</Text>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>工具</Text>

        {/* Import Card */}
        <Card style={styles.toolCard}>
          <View style={styles.toolHeader}>
            <View style={[styles.toolIconBg, { backgroundColor: theme.primaryGlow }]}>
              <Text style={styles.toolIcon}>📥</Text>
            </View>
            <View style={styles.toolInfo}>
              <Text style={[styles.toolTitle, { color: theme.text }]}>导入日记</Text>
              <Text style={[styles.toolDesc, { color: theme.textSecondary }]}>
                从 JSON 文件导入日记
              </Text>
            </View>
          </View>
          <Button
            title={importing ? '导入中...' : '导入日记'}
            onPress={handleImport}
            disabled={importing}
            size="small"
            variant="secondary"
          />
        </Card>

        {/* Export TXT Card */}
        <Card style={styles.toolCard}>
          <View style={styles.toolHeader}>
            <View style={[styles.toolIconBg, { backgroundColor: theme.primaryGlow }]}>
              <Text style={styles.toolIcon}>📄</Text>
            </View>
            <View style={styles.toolInfo}>
              <Text style={[styles.toolTitle, { color: theme.text }]}>导出日记 (TXT)</Text>
              <Text style={[styles.toolDesc, { color: theme.textSecondary }]}>
                将 {diaries.length} 篇日记导出为 TXT 文件
              </Text>
            </View>
          </View>
          <Button
            title={exporting ? '导出中...' : '导出 TXT'}
            onPress={handleExport}
            disabled={exporting || diaries.length === 0}
            size="small"
          />
        </Card>

        {/* Export JSON Card */}
        <Card style={styles.toolCard}>
          <View style={styles.toolHeader}>
            <View style={[styles.toolIconBg, { backgroundColor: theme.primaryGlow }]}>
              <Text style={styles.toolIcon}>📋</Text>
            </View>
            <View style={styles.toolInfo}>
              <Text style={[styles.toolTitle, { color: theme.text }]}>导出日记 (JSON)</Text>
              <Text style={[styles.toolDesc, { color: theme.textSecondary }]}>
                将 {diaries.length} 篇日记导出为 JSON 文件（可用于导入）
              </Text>
            </View>
          </View>
          <Button
            title={exporting ? '导出中...' : '导出 JSON'}
            onPress={handleExportJson}
            disabled={exporting || diaries.length === 0}
            size="small"
          />
        </Card>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTag, { color: theme.accent }]}>ACHIEVEMENTS</Text>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>成就</Text>
        <View style={styles.achievementList}>
          {ACHIEVEMENTS.map((def) => {
            const unlocked = profile?.achievements.find((a) => a.id === def.id)?.isUnlocked;
            return (
              <Card
                key={def.id}
                style={[
                  styles.achievementCard,
                  !unlocked && styles.lockedCard,
                  unlocked && { borderColor: theme.primary + '40' },
                ]}
              >
                <View style={[
                  styles.achievementIconBg,
                  { backgroundColor: unlocked ? theme.primaryGlow : theme.surfaceElevated },
                ]}>
                  <Text style={styles.achievementIcon}>
                    {unlocked ? def.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      { color: unlocked ? theme.text : theme.textMuted },
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
    padding: 24,
    gap: 24,
  },
  profileCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  avatarBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  levelText: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  expLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  expText: {
    fontSize: 12,
    fontWeight: '500',
  },
  streakBadge: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700',
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 24,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  toolCard: {
    gap: 16,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toolIconBg: {
    borderRadius: 14,
    padding: 10,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolInfo: {
    flex: 1,
    gap: 2,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  toolDesc: {
    fontSize: 13,
  },
  achievementList: {
    gap: 10,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  lockedCard: {
    opacity: 0.5,
  },
  achievementIconBg: {
    borderRadius: 14,
    padding: 10,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  achievementDesc: {
    fontSize: 13,
    marginTop: 2,
  },
});
