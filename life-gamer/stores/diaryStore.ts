import { create } from 'zustand';
import { Diary, MoodType } from '../types';
import * as diaryQueries from '../database/diaryQueries';

interface DiaryState {
  diaries: Diary[];
  isLoading: boolean;
  loadDiaries: () => Promise<void>;
  addDiary: (title: string, content: string, mood: MoodType, tags?: string[], images?: string[]) => Promise<Diary>;
  updateDiary: (id: string, fields: Partial<Pick<Diary, 'title' | 'content' | 'mood' | 'tags' | 'images' | 'isFavorite'>>) => Promise<Diary | null>;
  deleteDiary: (id: string) => Promise<void>;
  getDiariesByDateRange: (startDate: number, endDate: number) => Promise<Diary[]>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diaries: [],
  isLoading: false,

  loadDiaries: async () => {
    set({ isLoading: true });
    try {
      const diaries = await diaryQueries.getAllDiaries();
      set({ diaries, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addDiary: async (title, content, mood, tags = [], images = []) => {
    const diary = await diaryQueries.createDiary(title, content, mood, tags, images);
    set((state) => ({ diaries: [diary, ...state.diaries] }));
    return diary;
  },

  updateDiary: async (id, fields) => {
    const updated = await diaryQueries.updateDiary(id, fields);
    if (updated) {
      set((state) => ({
        diaries: state.diaries.map((d) => (d.id === id ? updated : d)),
      }));
    }
    return updated;
  },

  deleteDiary: async (id) => {
    await diaryQueries.deleteDiary(id);
    set((state) => ({
      diaries: state.diaries.filter((d) => d.id !== id),
    }));
  },

  getDiariesByDateRange: async (startDate, endDate) => {
    return diaryQueries.getDiariesByDateRange(startDate, endDate);
  },
}));
