export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'angry';

export interface Diary {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  images: string[];
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

export interface GameProfile {
  level: number;
  exp: number;
  expToNextLevel: number;
  title: string;
  achievements: Achievement[];
  streakDays: number;
  lastRecordDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface MoodStat {
  mood: MoodType;
  count: number;
  percentage: number;
}
