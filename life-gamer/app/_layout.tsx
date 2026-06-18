import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDiaryStore } from '../stores/diaryStore';
import { useGameStore } from '../stores/gameStore';
import { useTodoStore } from '../stores/todoStore';
import { getDatabase } from '../database/init';
import { Colors } from '../constants/colors';
import { requestNotificationPermission } from '../utils/notifications';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const loadDiaries = useDiaryStore((s) => s.loadDiaries);
  const loadProfile = useGameStore((s) => s.loadProfile);
  const initTodoTable = useTodoStore((s) => s.initTodoTable);
  const refreshTodayNotification = useTodoStore((s) => s.refreshTodayNotification);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        console.log('[LifeGamer] Starting initialization...');
        await getDatabase();
        console.log('[LifeGamer] Database initialized');
        await loadDiaries();
        console.log('[LifeGamer] Diaries loaded');
        await loadProfile();
        console.log('[LifeGamer] Profile loaded');

        // 初始化 TODO 表和通知
        await initTodoTable();
        console.log('[LifeGamer] Todo table initialized');

        // 请求通知权限并调度今日通知
        await requestNotificationPermission();
        await refreshTodayNotification();
        console.log('[LifeGamer] Notifications scheduled');

        setIsReady(true);
      } catch (err) {
        console.error('[LifeGamer] Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>应用启动失败</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="diary/write"
          options={{
            presentation: 'modal',
            title: '写日记',
            headerStyle: { backgroundColor: theme.surface },
            headerTintColor: theme.text,
            headerShadowVisible: false,
            headerTitleStyle: {
              fontWeight: '700',
              letterSpacing: 0.3,
            },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
