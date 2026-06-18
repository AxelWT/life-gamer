import React from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useDiaryStore } from '../../stores/diaryStore';
import { Colors } from '../../constants/colors';
import { MOODS } from '../../constants/moods';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function DiaryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const diaries = useDiaryStore((s) => s.diaries);
  const deleteDiary = useDiaryStore((s) => s.deleteDiary);

  const diary = diaries.find((d) => d.id === id);

  if (!diary) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            日记不存在或已被删除
          </Text>
          <Button title="返回" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const moodDef = MOODS.find((m) => m.key === diary.mood);
  const date = new Date(diary.createdAt);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这篇日记吗？删除后无法恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await deleteDiary(diary.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/diary/write?id=${diary.id}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '日记详情',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Text style={[styles.editText, { color: theme.primary }]}>编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Text style={[styles.deleteText, { color: '#FF6B6B' }]}>删除</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Header Card */}
        <Card glowing style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={[styles.moodBadge, { backgroundColor: (moodDef?.color ?? theme.primary) + '20' }]}>
              <Text style={styles.moodEmoji}>{moodDef?.emoji}</Text>
              <Text style={[styles.moodLabel, { color: moodDef?.color ?? theme.primary }]}>
                {moodDef?.label}
              </Text>
            </View>
            {diary.isFavorite && (
              <View style={styles.favoriteBadge}>
                <Text style={styles.favoriteEmoji}>⭐</Text>
                <Text style={[styles.favoriteText, { color: theme.primary }]}>已收藏</Text>
              </View>
            )}
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{diary.title || '无标题'}</Text>
          <Text style={[styles.date, { color: theme.textMuted }]}>{dateStr}</Text>
        </Card>

        {/* Content Card */}
        <Card style={styles.contentCard}>
          <Text style={[styles.contentText, { color: theme.text }]}>
            {diary.content}
          </Text>
        </Card>

        {/* Tags */}
        {diary.tags.length > 0 && (
          <Card style={styles.tagsCard}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>标签</Text>
            <View style={styles.tagsContainer}>
              {diary.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: theme.primaryGlow }]}
                >
                  <Text style={[styles.tagText, { color: theme.primary }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>日记信息</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>字数</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{diary.content.length} 字</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>创建时间</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{dateStr}</Text>
          </View>
          {diary.updatedAt !== diary.createdAt && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>最后修改</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {new Date(diary.updatedAt).toLocaleString()}
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerCard: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteEmoji: {
    fontSize: 18,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  date: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
  contentCard: {
    paddingVertical: 24,
  },
  contentText: {
    fontSize: 17,
    lineHeight: 30,
    letterSpacing: 0.3,
  },
  tagsCard: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
});
