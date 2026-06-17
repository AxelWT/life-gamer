import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiaryStore } from '../../stores/diaryStore';
import { Colors } from '../../constants/colors';
import DiaryCard from '../../components/DiaryCard';
import { Diary } from '../../types';

export default function DiaryScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const router = useRouter();
  const diaries = useDiaryStore((s) => s.diaries);
  const loadDiaries = useDiaryStore((s) => s.loadDiaries);

  const renderItem = ({ item }: { item: Diary }) => (
    <DiaryCard diary={item} onPress={() => {}} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {diaries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconBg, { backgroundColor: theme.primaryGlow }]}>
            <Text style={styles.emptyEmoji}>📝</Text>
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>还没有日记</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            点击右下角按钮，开始记录你的生活
          </Text>
        </View>
      ) : (
        <FlatList
          data={diaries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={false}
          onRefresh={loadDiaries}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/diary/write')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: '#0A0A0F',
    fontWeight: '700',
  },
});
