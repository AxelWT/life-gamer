import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarShowIcon: false,
        tabBarIconStyle: { display: 'none' },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingTop: 0,
          marginTop: 0,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '700',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarLabel: '首页',
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: '日记',
          tabBarLabel: '日记',
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: '心情',
          tabBarLabel: '心情',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarLabel: '我的',
        }}
      />
    </Tabs>
  );
}
