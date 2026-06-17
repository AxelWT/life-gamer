import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDiaryStore } from '../../stores/diaryStore';
import { useGameStore } from '../../stores/gameStore';
import { Colors } from '../../constants/colors';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { MoodType } from '../../types';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import MoodSelector from '../../components/MoodSelector';

export default function WriteDiaryScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const router = useRouter();

  const [mood, setMood] = useState<MoodType>('neutral');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const addDiary = useDiaryStore((s) => s.addDiary);
  const addExp = useGameStore((s) => s.addExp);
  const recordDailyActivity = useGameStore((s) => s.recordDailyActivity);
  const checkAndUnlockAchievements = useGameStore((s) => s.checkAndUnlockAchievements);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('提示', '请写点什么吧 ✍️');
      return;
    }

    setSaving(true);
    try {
      await addDiary(title.trim(), content.trim(), mood);
      await addExp(10);
      await recordDailyActivity();
      const newAchievements = await checkAndUnlockAchievements();

      if (newAchievements.length > 0) {
        const names = newAchievements
          .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.title)
          .filter(Boolean)
          .join('、');
        Alert.alert('🎉 解锁成就', `恭喜解锁：${names}`, [
          { text: '太棒了！', onPress: () => router.back() },
        ]);
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      flex={1}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={[styles.cancelText, { color: theme.textSecondary }]}>取消</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>写日记</Text>
          <Text style={[styles.headerSub, { color: theme.textMuted }]}>记录今天</Text>
        </View>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.headerBtn}>
          <Text style={[styles.saveText, { color: theme.primary }]}>
            {saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Mood Selector */}
        <Card>
          <MoodSelector selected={mood} onSelect={setMood} />
        </Card>

        {/* Title Input */}
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="标题（可选）"
        />

        {/* Content Input */}
        <Input
          value={content}
          onChangeText={setContent}
          placeholder="今天发生了什么？"
          multiline
          maxLength={5000}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerBtn: {
    minWidth: 60,
  },
  headerCenter: {
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 24,
    gap: 16,
  },
});
