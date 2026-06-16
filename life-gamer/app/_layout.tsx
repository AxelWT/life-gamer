import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useDiaryStore } from '../stores/diaryStore';
import { useGameStore } from '../stores/gameStore';
import { getDatabase } from '../database/init';

export default function RootLayout() {
  const loadDiaries = useDiaryStore((s) => s.loadDiaries);
  const loadProfile = useGameStore((s) => s.loadProfile);

  useEffect(() => {
    async function init() {
      await getDatabase();
      await loadDiaries();
      await loadProfile();
    }
    init();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="diary/write"
        options={{ presentation: 'modal', title: '写日记' }}
      />
    </Stack>
  );
}
