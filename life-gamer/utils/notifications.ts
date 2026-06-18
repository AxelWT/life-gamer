import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 配置通知行为
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 请求通知权限
export async function requestNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('通知功能需要在真机上使用');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('未获得通知权限');
    return false;
  }

  // Android 需要设置通知渠道
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('todo-reminders', {
      name: '待办提醒',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00D4AA',
    });
  }

  return true;
}

// 获取北京时间 7:30 的 Date 对象
function getBeijingTime730(): Date {
  const now = new Date();

  // 获取当前北京时间
  const beijingOffset = 8 * 60; // UTC+8
  const localOffset = now.getTimezoneOffset(); // 本地时区偏移（分钟）
  const beijingTime = new Date(now.getTime() + (beijingOffset + localOffset) * 60 * 1000);

  // 设置为今天的 7:30
  beijingTime.setHours(7, 30, 0, 0);

  // 如果今天的 7:30 已过，设置为明天的 7:30
  if (beijingTime <= now) {
    beijingTime.setDate(beijingTime.getDate() + 1);
  }

  return beijingTime;
}

// 调度当天的 TODO 通知
export async function scheduleTodoNotification(todos: string[]): Promise<string | null> {
  if (todos.length === 0) return null;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  // 取消之前的所有待办通知
  await cancelAllTodoNotifications();

  // 构建通知内容
  const todoList = todos.slice(0, 5).map((t, i) => `${i + 1}. ${t}`).join('\n');
  const moreText = todos.length > 5 ? `\n...还有 ${todos.length - 5} 项待办` : '';

  const trigger = getBeijingTime730();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '📋 今日待办提醒',
      body: `你有 ${todos.length} 项待办事项：\n${todoList}${moreText}`,
      data: { type: 'todo-reminder' },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });

  console.log(`已调度通知，将在 ${trigger.toLocaleString()} 发送`);
  return notificationId;
}

// 取消所有待办通知
export async function cancelAllTodoNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// 获取所有已调度的通知（调试用）
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// 测试：立即发送一条通知
export async function sendTestNotification(): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧪 测试通知',
      body: '这是一条测试通知，用于验证通知功能是否正常工作。',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}
