import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.emoji}>🤔</Text>
      <Text style={[styles.title, { color: theme.text }]}>页面未找到</Text>
      <Link href="/" style={[styles.link, { color: theme.primary }]}>
        返回首页
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
  },
});
