import { Achievement } from '../types';

interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first_diary', title: '初出茅庐', description: '写下第一篇日记', icon: '📝' },
  { id: 'week_streak', title: '坚持不懈', description: '连续记录7天', icon: '🔥' },
  { id: 'mood_master', title: '情绪大师', description: '记录过所有5种心情', icon: '🎨' },
  { id: 'century_writer', title: '百篇作者', description: '累计写下100篇日记', icon: '📚' },
  { id: 'level_10', title: '探险启程', description: '等级达到10级', icon: '⚔️' },
  { id: 'level_30', title: '勇者之路', description: '等级达到30级', icon: '🛡️' },
];
