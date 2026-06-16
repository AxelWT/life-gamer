import { Achievement, GameProfile, MoodType } from '../types';
import { ACHIEVEMENTS } from '../constants/achievements';
import { getDatabase } from './init';

interface ProfileRow {
  id: number;
  level: number;
  exp: number;
  streak_days: number;
  last_record_date: string;
}

interface AchievementRow {
  id: string;
  is_unlocked: number;
  unlocked_at: number | null;
}

export function getExpToNextLevel(level: number): number {
  if (level <= 10) return 50;
  if (level <= 20) return 100;
  if (level <= 30) return 200;
  if (level <= 40) return 300;
  return 500;
}

export function getTitleForLevel(level: number): string {
  if (level <= 10) return '新手村居民';
  if (level <= 20) return '探险家';
  if (level <= 30) return '勇者';
  if (level <= 40) return '大师';
  if (level <= 50) return '传奇';
  return '人生赢家';
}

export async function getGameProfile(): Promise<GameProfile> {
  const db = await getDatabase();
  const profile = await db.getFirstAsync<ProfileRow>(
    'SELECT * FROM game_profile WHERE id = 1'
  );

  const achievements = await getAchievements();

  return {
    level: profile?.level ?? 1,
    exp: profile?.exp ?? 0,
    expToNextLevel: getExpToNextLevel(profile?.level ?? 1),
    title: getTitleForLevel(profile?.level ?? 1),
    achievements,
    streakDays: profile?.streak_days ?? 0,
    lastRecordDate: profile?.last_record_date ?? '',
  };
}

export async function addExp(amount: number): Promise<GameProfile> {
  const db = await getDatabase();
  const profile = await db.getFirstAsync<ProfileRow>(
    'SELECT * FROM game_profile WHERE id = 1'
  );

  if (!profile) return getGameProfile();

  let newExp = profile.exp + amount;
  let newLevel = profile.level;

  while (newExp >= getExpToNextLevel(newLevel)) {
    newExp -= getExpToNextLevel(newLevel);
    newLevel += 1;
  }

  await db.runAsync(
    'UPDATE game_profile SET exp = ?, level = ? WHERE id = 1',
    [newExp, newLevel]
  );

  return getGameProfile();
}

export async function updateStreak(): Promise<number> {
  const db = await getDatabase();
  const profile = await db.getFirstAsync<ProfileRow>(
    'SELECT * FROM game_profile WHERE id = 1'
  );

  if (!profile) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = profile.streak_days;

  if (profile.last_record_date === today) {
    return newStreak;
  } else if (profile.last_record_date === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  await db.runAsync(
    'UPDATE game_profile SET streak_days = ?, last_record_date = ? WHERE id = 1',
    [newStreak, today]
  );

  return newStreak;
}

export async function getAchievements(): Promise<Achievement[]> {
  const db = await getDatabase();

  for (const def of ACHIEVEMENTS) {
    const existing = await db.getFirstAsync<AchievementRow>(
      'SELECT id FROM achievements WHERE id = ?',
      [def.id]
    );
    if (!existing) {
      await db.runAsync(
        'INSERT INTO achievements (id, is_unlocked, unlocked_at) VALUES (?, 0, NULL)',
        [def.id]
      );
    }
  }

  const rows = await db.getAllAsync<AchievementRow>('SELECT * FROM achievements');

  return ACHIEVEMENTS.map((def) => {
    const row = rows.find((r) => r.id === def.id);
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      isUnlocked: row?.is_unlocked === 1,
      unlockedAt: row?.unlocked_at ?? undefined,
    };
  });
}

export async function unlockAchievement(id: string): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();
  await db.runAsync(
    'UPDATE achievements SET is_unlocked = 1, unlocked_at = ? WHERE id = ?',
    [now, id]
  );
}
