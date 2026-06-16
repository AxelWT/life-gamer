import { create } from 'zustand';
import { GameProfile, Achievement, MoodType } from '../types';
import * as gameQueries from '../database/gameQueries';
import { ACHIEVEMENTS } from '../constants/achievements';

interface GameState {
  profile: GameProfile | null;
  loadProfile: () => Promise<void>;
  addExp: (amount: number) => Promise<void>;
  recordDailyActivity: () => Promise<void>;
  checkAndUnlockAchievements: () => Promise<string[]>;
}

export const useGameStore = create<GameState>((set, get) => ({
  profile: null,

  loadProfile: async () => {
    const profile = await gameQueries.getGameProfile();
    set({ profile });
  },

  addExp: async (amount) => {
    const profile = await gameQueries.addExp(amount);
    set({ profile });
  },

  recordDailyActivity: async () => {
    await gameQueries.updateStreak();
    const profile = await gameQueries.getGameProfile();
    set({ profile });
  },

  checkAndUnlockAchievements: async () => {
    const { useDiaryStore } = require('./diaryStore');
    const diaries = useDiaryStore.getState().diaries;
    const profile = get().profile;
    if (!profile) return [];

    const newlyUnlocked: string[] = [];

    const firstDiary = profile.achievements.find((a) => a.id === 'first_diary');
    if (firstDiary && !firstDiary.isUnlocked && diaries.length >= 1) {
      await gameQueries.unlockAchievement('first_diary');
      newlyUnlocked.push('first_diary');
    }

    const weekStreak = profile.achievements.find((a) => a.id === 'week_streak');
    if (weekStreak && !weekStreak.isUnlocked && profile.streakDays >= 7) {
      await gameQueries.unlockAchievement('week_streak');
      newlyUnlocked.push('week_streak');
    }

    const moodMaster = profile.achievements.find((a) => a.id === 'mood_master');
    if (moodMaster && !moodMaster.isUnlocked) {
      const moodSet = new Set<MoodType>(diaries.map((d) => d.mood));
      if (moodSet.size >= 5) {
        await gameQueries.unlockAchievement('mood_master');
        newlyUnlocked.push('mood_master');
      }
    }

    const centuryWriter = profile.achievements.find((a) => a.id === 'century_writer');
    if (centuryWriter && !centuryWriter.isUnlocked && diaries.length >= 100) {
      await gameQueries.unlockAchievement('century_writer');
      newlyUnlocked.push('century_writer');
    }

    const level10 = profile.achievements.find((a) => a.id === 'level_10');
    if (level10 && !level10.isUnlocked && profile.level >= 10) {
      await gameQueries.unlockAchievement('level_10');
      newlyUnlocked.push('level_10');
    }

    const level30 = profile.achievements.find((a) => a.id === 'level_30');
    if (level30 && !level30.isUnlocked && profile.level >= 30) {
      await gameQueries.unlockAchievement('level_30');
      newlyUnlocked.push('level_30');
    }

    if (newlyUnlocked.length > 0) {
      const updatedProfile = await gameQueries.getGameProfile();
      set({ profile: updatedProfile });
    }

    return newlyUnlocked;
  },
}));
