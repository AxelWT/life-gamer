# LifeGamer MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gamified diary app runnable on Android, supporting diary recording, mood tracking, mood calendar and basic statistics.

**Architecture:** React Native + Expo (Managed Workflow) + Expo Router file routing + Zustand state management + SQLite local storage

**Tech Stack:** TypeScript, Expo SDK 52+, expo-router, expo-sqlite, zustand

---

## File Structure

```
life-gamer/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── diary.tsx
│   │   ├── mood.tsx
│   │   └── profile.tsx
│   ├── diary/
│   │   └── write.tsx
│   └── +not-found.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── MoodSelector.tsx
│   ├── DiaryCard.tsx
│   └── MoodCalendar.tsx
├── stores/
│   ├── diaryStore.ts
│   └── gameStore.ts
├── database/
│   ├── init.ts
│   ├── diaryQueries.ts
│   └── gameQueries.ts
├── types/
│   └── index.ts
├── constants/
│   ├── colors.ts
│   ├── moods.ts
│   └── achievements.ts
└── assets/
```

---

### Task 1: Environment Setup

**Goal:** Install dev tools, create project, run Hello World on Android

- [ ] **Step 1: Install Node.js**

```bash
brew install node@20
node -v
npm -v
```

- [ ] **Step 2: Install Android Studio and configure emulator**

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → More Actions → Virtual Device Manager → Create Device
3. Select Pixel 7 → download API 34 image → finish creation

Configure environment variables (add to `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

```bash
source ~/.zshrc
```

- [ ] **Step 3: Create Expo project**

```bash
cd /Users/allen/IdeaProjects/explore
npx create-expo-app@latest life-gamer --template tabs
```

- [ ] **Step 4: Start dev server and run**

```bash
cd life-gamer
npx expo start
# Press 'a' to run on Android emulator
# Or press 'd' then scan QR code to run on real device (need Expo Go APP)
```

Expected: See Expo default Tab template page

- [ ] **Step 5: Verify on real device (optional but recommended)**

1. Install "Expo Go" APP on Android phone
2. Phone and computer on same WiFi
3. `npx expo start` → scan QR code

- [ ] **Step 6: Commit initial project**

```bash
cd /Users/allen/IdeaProjects/explore/life-gamer
git init
git add .
git commit -m "chore: init Expo project with tabs template"
```

---

### Task 2: Project Foundation — Types & Constants

**Files:**
- Create: `types/index.ts`
- Create: `constants/colors.ts`
- Create: `constants/moods.ts`
- Create: `constants/achievements.ts`

- [ ] **Step 1: Define types**

Create `types/index.ts`:

```typescript
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
```

- [ ] **Step 2: Define color constants**

Create `constants/colors.ts`:

```typescript
export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    primary: '#6C63FF',
    primaryLight: '#9D97FF',
    tabIconDefault: '#999999',
    tabIconSelected: '#6C63FF',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
    primary: '#9D97FF',
    primaryLight: '#B8B4FF',
    tabIconDefault: '#666666',
    tabIconSelected: '#9D97FF',
  },
  mood: {
    happy: '#FFD700',
    calm: '#87CEEB',
    neutral: '#D3D3D3',
    sad: '#6495ED',
    angry: '#FF6347',
  },
};
```

- [ ] **Step 3: Define mood constants**

Create `constants/moods.ts`:

```typescript
import { MoodType } from '../types';

export const MOODS: Record<MoodType, { label: string; icon: string; color: string; emoji: string }> = {
  happy: { label: '开心', icon: '😊', color: '#FFD700', emoji: '😊' },
  calm: { label: '平静', icon: '😌', color: '#87CEEB', emoji: '😌' },
  neutral: { label: '一般', icon: '😐', color: '#D3D3D3', emoji: '😐' },
  sad: { label: '难过', icon: '😢', color: '#6495ED', emoji: '😢' },
  angry: { label: '生气', icon: '😠', color: '#FF6347', emoji: '😠' },
};

export const MOOD_LIST: MoodType[] = ['happy', 'calm', 'neutral', 'sad', 'angry'];
```

- [ ] **Step 4: Define achievement constants**

Create `constants/achievements.ts`:

```typescript
import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_diary', title: '初出茅庐', description: '写下第一篇日记', icon: '📝', isUnlocked: false },
  { id: 'week_streak', title: '坚持不懈', description: '连续记录7天', icon: '🔥', isUnlocked: false },
  { id: 'mood_master', title: '情绪大师', description: '记录所有5种心情', icon: '🎨', isUnlocked: false },
  { id: 'century_writer', title: '百篇作者', description: '写下100篇日记', icon: '📚', isUnlocked: false },
  { id: 'level_10', title: '探险启程', description: '达到10级', icon: '⚔️', isUnlocked: false },
  { id: 'level_30', title: '勇者之路', description: '达到30级', icon: '🛡️', isUnlocked: false },
];
```

- [ ] **Step 5: Commit**

```bash
git add types/ constants/
git commit -m "feat: add type definitions and constants"
```

---

### Task 3: Database Layer — SQLite Init & CRUD

**Files:**
- Create: `database/init.ts`
- Create: `database/diaryQueries.ts`
- Create: `database/gameQueries.ts`

- [ ] **Step 1: Install dependency**

```bash
npx expo install expo-sqlite
```

- [ ] **Step 2: Create database initialization**

Create `database/init.ts`:

```typescript
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('lifegamer.db');
    await initTables(db);
  }
  return db;
}

async function initTables(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS diaries (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      mood TEXT NOT NULL DEFAULT 'neutral',
      tags TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS game_profile (
      id INTEGER PRIMARY KEY NOT NULL DEFAULT 1,
      level INTEGER NOT NULL DEFAULT 1,
      exp INTEGER NOT NULL DEFAULT 0,
      title TEXT NOT NULL DEFAULT '新手村居民',
      streak_days INTEGER NOT NULL DEFAULT 0,
      last_record_date TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      is_unlocked INTEGER NOT NULL DEFAULT 0,
      unlocked_at INTEGER
    );
  `);

  const profileExists = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM game_profile'
  );
  if (profileExists && profileExists.count === 0) {
    await database.runAsync(
      'INSERT INTO game_profile (level, exp, title, streak_days, last_record_date) VALUES (1, 0, ?, 0, ?)',
      ['新手村居民', '']
    );
  }
}
```

- [ ] **Step 3: Create diary CRUD functions**

Create `database/diaryQueries.ts`:

```typescript
import { Diary, MoodType } from '../types';
import { getDatabase } from './init';

export async function createDiary(diary: Omit<Diary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Diary> {
  const db = await getDatabase();
  const now = Date.now();
  const id = `diary_${now}_${Math.random().toString(36).slice(2, 9)}`;

  const newDiary: Diary = {
    ...diary,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    'INSERT INTO diaries (id, title, content, mood, tags, images, created_at, updated_at, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newDiary.id,
      newDiary.title,
      newDiary.content,
      newDiary.mood,
      JSON.stringify(newDiary.tags),
      JSON.stringify(newDiary.images),
      newDiary.createdAt,
      newDiary.updatedAt,
      newDiary.isFavorite ? 1 : 0,
    ]
  );

  return newDiary;
}

export async function getAllDiaries(limit = 50, offset = 0): Promise<Diary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM diaries ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows.map(rowToDiary);
}

export async function getDiaryById(id: string): Promise<Diary | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM diaries WHERE id = ?',
    [id]
  );
  return row ? rowToDiary(row) : null;
}

export async function updateDiary(id: string, updates: Partial<Diary>): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.content !== undefined) { fields.push('content = ?'); values.push(updates.content); }
  if (updates.mood !== undefined) { fields.push('mood = ?'); values.push(updates.mood); }
  if (updates.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(updates.tags)); }
  if (updates.images !== undefined) { fields.push('images = ?'); values.push(JSON.stringify(updates.images)); }
  if (updates.isFavorite !== undefined) { fields.push('is_favorite = ?'); values.push(updates.isFavorite ? 1 : 0); }

  fields.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  await db.runAsync(
    `UPDATE diaries SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteDiary(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM diaries WHERE id = ?', [id]);
}

export async function getDiariesByDateRange(startTime: number, endTime: number): Promise<Diary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM diaries WHERE created_at >= ? AND created_at <= ? ORDER BY created_at DESC',
    [startTime, endTime]
  );
  return rows.map(rowToDiary);
}

function rowToDiary(row: any): Diary {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    mood: row.mood as MoodType,
    tags: JSON.parse(row.tags || '[]'),
    images: JSON.parse(row.images || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isFavorite: row.is_favorite === 1,
  };
}
```

- [ ] **Step 4: Create game queries**

Create `database/gameQueries.ts`:

```typescript
import { GameProfile, Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants/achievements';
import { getDatabase } from './init';

export async function getGameProfile(): Promise<GameProfile> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>('SELECT * FROM game_profile WHERE id = 1');

  const achievements = await getAchievements();

  return {
    level: row.level,
    exp: row.exp,
    expToNextLevel: getExpToNextLevel(row.level),
    title: row.title,
    achievements,
    streakDays: row.streak_days,
    lastRecordDate: row.last_record_date,
  };
}

export async function addExp(amount: number): Promise<GameProfile> {
  const db = await getDatabase();
  const profile = await getGameProfile();

  let newExp = profile.exp + amount;
  let newLevel = profile.level;
  let newTitle = profile.title;

  while (newExp >= getExpToNextLevel(newLevel)) {
    newExp -= getExpToNextLevel(newLevel);
    newLevel++;
    newTitle = getTitleForLevel(newLevel);
  }

  await db.runAsync(
    'UPDATE game_profile SET level = ?, exp = ?, title = ? WHERE id = 1',
    [newLevel, newExp, newTitle]
  );

  return getGameProfile();
}

export async function updateStreak(today: string): Promise<number> {
  const db = await getDatabase();
  const profile = await getGameProfile();

  let newStreak = profile.streakDays;

  if (profile.lastRecordDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (profile.lastRecordDate === yesterdayStr) {
      newStreak += 1;
    } else if (profile.lastRecordDate !== today) {
      newStreak = 1;
    }

    await db.runAsync(
      'UPDATE game_profile SET streak_days = ?, last_record_date = ? WHERE id = 1',
      [newStreak, today]
    );
  }

  return newStreak;
}

function getExpToNextLevel(level: number): number {
  if (level <= 10) return 50;
  if (level <= 20) return 100;
  if (level <= 30) return 200;
  if (level <= 40) return 300;
  return 500;
}

function getTitleForLevel(level: number): string {
  if (level <= 10) return '新手村居民';
  if (level <= 20) return '探险家';
  if (level <= 30) return '勇者';
  if (level <= 40) return '大师';
  if (level <= 50) return '传奇';
  return '人生赢家';
}

export async function getAchievements(): Promise<Achievement[]> {
  const db = await getDatabase();

  for (const ach of ACHIEVEMENTS) {
    const exists = await db.getFirstAsync<any>(
      'SELECT id FROM achievements WHERE id = ?',
      [ach.id]
    );
    if (!exists) {
      await db.runAsync(
        'INSERT INTO achievements (id, is_unlocked) VALUES (?, 0)',
        [ach.id]
      );
    }
  }

  const rows = await db.getAllAsync<any>('SELECT * FROM achievements');
  return ACHIEVEMENTS.map(ach => {
    const row = rows.find(r => r.id === ach.id);
    return {
      ...ach,
      isUnlocked: row ? row.is_unlocked === 1 : false,
      unlockedAt: row?.unlocked_at ?? undefined,
    };
  });
}

export async function unlockAchievement(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE achievements SET is_unlocked = 1, unlocked_at = ? WHERE id = ?',
    [Date.now(), id]
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add database/
git commit -m "feat: add SQLite database layer with diary and game queries"
```

---

### Task 4: Zustand State Management

**Files:**
- Create: `stores/diaryStore.ts`
- Create: `stores/gameStore.ts`

- [ ] **Step 1: Install Zustand**

```bash
npm install zustand
```

- [ ] **Step 2: Create diary store**

Create `stores/diaryStore.ts`:

```typescript
import { create } from 'zustand';
import { Diary, MoodType } from '../types';
import * as diaryQueries from '../database/diaryQueries';

interface DiaryState {
  diaries: Diary[];
  isLoading: boolean;
  loadDiaries: () => Promise<void>;
  addDiary: (diary: Omit<Diary, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Diary>;
  updateDiary: (id: string, updates: Partial<Diary>) => Promise<void>;
  deleteDiary: (id: string) => Promise<void>;
  getDiariesByDateRange: (start: number, end: number) => Promise<Diary[]>;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  diaries: [],
  isLoading: false,

  loadDiaries: async () => {
    set({ isLoading: true });
    const diaries = await diaryQueries.getAllDiaries();
    set({ diaries, isLoading: false });
  },

  addDiary: async (diary) => {
    const newDiary = await diaryQueries.createDiary(diary);
    set((state) => ({ diaries: [newDiary, ...state.diaries] }));
    return newDiary;
  },

  updateDiary: async (id, updates) => {
    await diaryQueries.updateDiary(id, updates);
    set((state) => ({
      diaries: state.diaries.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d)),
    }));
  },

  deleteDiary: async (id) => {
    await diaryQueries.deleteDiary(id);
    set((state) => ({ diaries: state.diaries.filter((d) => d.id !== id) }));
  },

  getDiariesByDateRange: async (start, end) => {
    return diaryQueries.getDiariesByDateRange(start, end);
  },
}));
```

- [ ] **Step 3: Create game store**

Create `stores/gameStore.ts`:

```typescript
import { create } from 'zustand';
import { GameProfile } from '../types';
import * as gameQueries from '../database/gameQueries';

interface GameState {
  profile: GameProfile | null;
  loadProfile: () => Promise<void>;
  addExp: (amount: number) => Promise<GameProfile>;
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
    return profile;
  },

  recordDailyActivity: async () => {
    const today = new Date().toISOString().split('T')[0];
    await gameQueries.updateStreak(today);
    const profile = await gameQueries.getGameProfile();
    set({ profile });
  },

  checkAndUnlockAchievements: async () => {
    const unlocked: string[] = [];
    const profile = get().profile;
    if (!profile) return unlocked;

    const achievements = profile.achievements;

    for (const ach of achievements) {
      if (ach.isUnlocked) continue;

      let shouldUnlock = false;
      switch (ach.id) {
        case 'first_diary': {
          const { useDiaryStore } = await import('./diaryStore');
          shouldUnlock = useDiaryStore.getState().diaries.length >= 1;
          break;
        }
        case 'week_streak':
          shouldUnlock = profile.streakDays >= 7;
          break;
        case 'mood_master': {
          const { useDiaryStore } = await import('./diaryStore');
          const moods = new Set(useDiaryStore.getState().diaries.map(d => d.mood));
          shouldUnlock = moods.size >= 5;
          break;
        }
        case 'level_10':
          shouldUnlock = profile.level >= 10;
          break;
        case 'level_30':
          shouldUnlock = profile.level >= 30;
          break;
      }

      if (shouldUnlock) {
        await gameQueries.unlockAchievement(ach.id);
        unlocked.push(ach.id);
      }
    }

    if (unlocked.length > 0) {
      const updatedProfile = await gameQueries.getGameProfile();
      set({ profile: updatedProfile });
    }

    return unlocked;
  },
}));
```

- [ ] **Step 4: Commit**

```bash
git add stores/
git commit -m "feat: add Zustand stores for diary and game state"
```

---

### Task 5: Base UI Components

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Input.tsx`
- Create: `components/MoodSelector.tsx`
- Create: `components/DiaryCard.tsx`

- [ ] **Step 1: Create Button component**

Create `components/ui/Button.tsx`:

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', size = 'medium', disabled, loading, style }: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        { backgroundColor: variant === 'primary' ? colors.primary : 'transparent' },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : colors.primary} />
      ) : (
        <Text style={[styles.text, { color: variant === 'primary' ? '#FFF' : colors.primary }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primary: { backgroundColor: '#6C63FF' },
  secondary: { borderWidth: 1.5, borderColor: '#6C63FF' },
  ghost: {},
  small: { paddingVertical: 6, paddingHorizontal: 12 },
  medium: { paddingVertical: 12, paddingHorizontal: 20 },
  large: { paddingVertical: 16, paddingHorizontal: 28 },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '600', fontSize: 15 },
});
```

- [ ] **Step 2: Create Card component**

Create `components/ui/Card.tsx`:

```typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, style }: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
});
```

- [ ] **Step 3: Create Input component**

Create `components/ui/Input.tsx`:

```typescript
import React from 'react';
import { TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
  maxLength?: number;
}

export function Input({ value, onChangeText, placeholder, multiline, style, maxLength }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      multiline={multiline}
      maxLength={maxLength}
      style={[
        styles.input,
        { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
        multiline && styles.multiline,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  multiline: { minHeight: 120, textAlignVertical: 'top', paddingTop: 12 },
});
```

- [ ] **Step 4: Create MoodSelector component**

Create `components/MoodSelector.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodType } from '../types';
import { MOODS, MOOD_LIST } from '../constants/moods';
import { Colors } from '../constants/colors';
import { useColorScheme } from 'react-native';

interface MoodSelectorProps {
  selected: MoodType;
  onSelect: (mood: MoodType) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>今天的心情</Text>
      <View style={styles.moodList}>
        {MOOD_LIST.map((mood) => {
          const moodInfo = MOODS[mood];
          const isSelected = selected === mood;
          return (
            <TouchableOpacity
              key={mood}
              style={[styles.moodItem, isSelected && { backgroundColor: moodInfo.color + '20', borderColor: moodInfo.color }]}
              onPress={() => onSelect(mood)}
            >
              <Text style={styles.emoji}>{moodInfo.emoji}</Text>
              <Text style={[styles.moodLabel, { color: isSelected ? moodInfo.color : colors.textSecondary }]}>
                {moodInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 16, fontWeight: '600' },
  moodList: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', minWidth: 56 },
  emoji: { fontSize: 28 },
  moodLabel: { fontSize: 12, marginTop: 4 },
});
```

- [ ] **Step 5: Create DiaryCard component**

Create `components/DiaryCard.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Diary } from '../types';
import { MOODS } from '../constants/moods';
import { Colors } from '../constants/colors';
import { Card } from './ui/Card';
import { useColorScheme } from 'react-native';

interface DiaryCardProps {
  diary: Diary;
  onPress: (id: string) => void;
}

export function DiaryCard({ diary, onPress }: DiaryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const moodInfo = MOODS[diary.mood];
  const date = new Date(diary.createdAt);
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];

  return (
    <TouchableOpacity onPress={() => onPress(diary.id)}>
      <Card style={[styles.card, { borderLeftColor: moodInfo.color }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {diary.title || '无标题'}
          </Text>
          <Text style={styles.emoji}>{moodInfo.emoji}</Text>
        </View>
        <Text style={[styles.content, { color: colors.textSecondary }]} numberOfLines={2}>
          {diary.content || '暂无内容'}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{dateStr} 周{weekDay}</Text>
          {diary.isFavorite && <Text style={styles.favorite}>★</Text>}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderLeftWidth: 4, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '600', flex: 1 },
  emoji: { fontSize: 22 },
  content: { fontSize: 14, lineHeight: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  date: { fontSize: 12 },
  favorite: { fontSize: 14, color: '#FFD700' },
});
```

- [ ] **Step 6: Commit**

```bash
git add components/
git commit -m "feat: add base UI components - Button, Card, Input, MoodSelector, DiaryCard"
```

---

### Task 6: Page Routing — Expo Router Layout

**Files:**
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/(tabs)/index.tsx`
- Create: `app/(tabs)/mood.tsx`

- [ ] **Step 1: Install expo-router dependencies**

```bash
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens
```

> Note: Expo tabs template usually includes expo-router already. This step confirms dependencies are complete.

- [ ] **Step 2: Configure root layout**

Modify `app/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useDiaryStore } from '../stores/diaryStore';
import { useGameStore } from '../stores/gameStore';

export default function RootLayout() {
  const loadDiaries = useDiaryStore((s) => s.loadDiaries);
  const loadProfile = useGameStore((s) => s.loadProfile);

  useEffect(() => {
    loadDiaries();
    loadProfile();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="diary/write" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
```

- [ ] **Step 3: Configure Tab layout**

Modify `app/(tabs)/_layout.tsx`:

```typescript
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '首页', tabBarLabel: '首页' }} />
      <Tabs.Screen name="diary" options={{ title: '日记', tabBarLabel: '日记' }} />
      <Tabs.Screen name="mood" options={{ title: '心情', tabBarLabel: '心情' }} />
      <Tabs.Screen name="profile" options={{ title: '我的', tabBarLabel: '我的' }} />
    </Tabs>
  );
}
```

- [ ] **Step 4: Implement home screen**

Modify `app/(tabs)/index.tsx`:

```typescript
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiaryStore } from '../../stores/diaryStore';
import { useGameStore } from '../../stores/gameStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOODS } from '../../constants/moods';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const diaries = useDiaryStore((s) => s.diaries);
  const profile = useGameStore((s) => s.profile);

  const todayDiary = diaries.find((d) => {
    const today = new Date();
    const created = new Date(d.createdAt);
    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  });

  const recentDiaries = diaries.slice(0, 3);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          {getGreeting()}，冒险者
        </Text>
        {profile && (
          <Card style={styles.levelCard}>
            <Text style={styles.levelText}>Lv.{profile.level} {profile.title}</Text>
            <View style={styles.expBar}>
              <View style={[styles.expFill, { width: `${(profile.exp / profile.expToNextLevel) * 100}%` }]} />
            </View>
            <Text style={styles.expText}>EXP {profile.exp}/{profile.expToNextLevel}</Text>
            {profile.streakDays > 0 && (
              <Text style={styles.streak}>🔥 连续记录 {profile.streakDays} 天</Text>
            )}
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>今日记录</Text>
        {todayDiary ? (
          <Card>
            <View style={styles.row}>
              <Text style={styles.emoji}>{MOODS[todayDiary.mood].emoji}</Text>
              <View style={styles.todayInfo}>
                <Text style={[styles.todayTitle, { color: colors.text }]}>已完成今日记录</Text>
                <Text style={[styles.todayContent, { color: colors.textSecondary }]} numberOfLines={1}>
                  {todayDiary.title || todayDiary.content}
                </Text>
              </View>
            </View>
          </Card>
        ) : (
          <Button title="✏️ 写今日日记" onPress={() => router.push('/diary/write')} size="large" />
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>最近记录</Text>
        {recentDiaries.map((d) => (
          <Card key={d.id} style={styles.recentCard}>
            <View style={styles.row}>
              <Text style={styles.emoji}>{MOODS[d.mood].emoji}</Text>
              <View style={styles.todayInfo}>
                <Text style={[styles.todayTitle, { color: colors.text }]} numberOfLines={1}>
                  {d.title || '无标题'}
                </Text>
                <Text style={[styles.todayContent, { color: colors.textSecondary }]} numberOfLines={1}>
                  {d.content}
                </Text>
              </View>
            </View>
          </Card>
        ))}
        {recentDiaries.length === 0 && (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>还没有记录，开始写第一篇吧！</Text>
        )}
      </View>
    </ScrollView>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '早上好';
  if (h < 18) return '下午好';
  return '晚上好';
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  levelCard: { gap: 8 },
  levelText: { fontSize: 18, fontWeight: '600', color: '#6C63FF' },
  expBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  expFill: { height: '100%', backgroundColor: '#6C63FF', borderRadius: 4 },
  expText: { fontSize: 12, color: '#666' },
  streak: { fontSize: 14, color: '#FF6347', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 32 },
  todayInfo: { flex: 1 },
  todayTitle: { fontSize: 16, fontWeight: '600' },
  todayContent: { fontSize: 14, marginTop: 2 },
  recentCard: { marginBottom: 8 },
  empty: { fontSize: 14, textAlign: 'center', marginTop: 20 },
});
```

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: set up Expo Router layout and home screen"
```

---

### Task 7: Diary List & Write Diary Screens

**Files:**
- Modify: `app/(tabs)/diary.tsx`
- Create: `app/diary/write.tsx`

- [ ] **Step 1: Implement diary list screen**

Modify `app/(tabs)/diary.tsx`:

```typescript
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiaryStore } from '../../stores/diaryStore';
import { DiaryCard } from '../../components/DiaryCard';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

export default function DiaryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { diaries, isLoading } = useDiaryStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={diaries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DiaryCard diary={item} onPress={(id) => {}} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>还没有日记，开始写吧！</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={() => useDiaryStore.getState().loadDiaries()}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/diary/write')} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 80 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 56, height: 56,
    borderRadius: 28, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  fabText: { fontSize: 28, color: '#FFF', fontWeight: '300' },
});
```

- [ ] **Step 2: Implement write diary screen**

Create `app/diary/write.tsx`:

```typescript
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MoodType } from '../../types';
import { useDiaryStore } from '../../stores/diaryStore';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MoodSelector } from '../../components/MoodSelector';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

export default function WriteDiaryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const addDiary = useDiaryStore((s) => s.addDiary);
  const addExp = useGameStore((s) => s.addExp);
  const recordDailyActivity = useGameStore((s) => s.recordDailyActivity);
  const checkAndUnlockAchievements = useGameStore((s) => s.checkAndUnlockAchievements);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('neutral');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim() && !title.trim()) {
      Alert.alert('提示', '请输入日记内容');
      return;
    }

    setSaving(true);
    try {
      await addDiary({ title: title.trim(), content: content.trim(), mood, tags: [], images: [], isFavorite: false });
      await addExp(10);
      await recordDailyActivity();
      const newAchievements = await checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        Alert.alert('🎉 成就解锁！', '你解锁了新成就！');
      }
      router.back();
    } catch (e) {
      Alert.alert('保存失败', '请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Button title="取消" onPress={() => router.back()} variant="ghost" size="small" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>写日记</Text>
        <Button title="保存" onPress={handleSave} size="small" loading={saving} />
      </View>
      <View style={styles.body}>
        <Card style={styles.moodCard}>
          <MoodSelector selected={mood} onSelect={setMood} />
        </Card>
        <Input value={title} onChangeText={setTitle} placeholder="标题（可选）" style={styles.titleInput} />
        <Input value={content} onChangeText={setContent} placeholder="今天发生了什么..." multiline style={styles.contentInput} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  body: { flex: 1, padding: 16, gap: 12 },
  moodCard: { marginBottom: 4 },
  titleInput: { fontWeight: '600' },
  contentInput: { flex: 1 },
});
```

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/diary.tsx app/diary/write.tsx
git commit -m "feat: implement diary list and write diary screens"
```

---

### Task 8: Mood Calendar Screen

**Files:**
- Create: `components/MoodCalendar.tsx`
- Modify: `app/(tabs)/mood.tsx`

- [ ] **Step 1: Create mood calendar component**

Create `components/MoodCalendar.tsx`:

```typescript
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Diary, MoodType } from '../types';
import { MOODS } from '../constants/moods';
import { Colors } from '../constants/colors';
import { useColorScheme } from 'react-native';

interface MoodCalendarProps {
  diaries: Diary[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayPress: (date: string) => void;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export function MoodCalendar({ diaries, currentMonth, onMonthChange, onDayPress }: MoodCalendarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const moodMap = useMemo(() => {
    const map: Record<string, MoodType> = {};
    diaries.forEach((d) => {
      const date = new Date(d.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      map[key] = d.mood;
    });
    return map;
  }, [diaries]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: { date: string; day: number; isCurrentMonth: boolean; mood?: MoodType }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: formatDate(d), day: d.getDate(), isCurrentMonth: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = formatDate(date);
      days.push({ date: dateStr, day: d, isCurrentMonth: true, mood: moodMap[dateStr] });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push({ date: formatDate(date), day: d, isCurrentMonth: false });
    }

    return days;
  }, [currentMonth, moodMap]);

  const monthLabel = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={[styles.navBtn, { color: colors.primary }]}>◀</Text>
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={[styles.navBtn, { color: colors.primary }]}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={[styles.weekday, { color: colors.textSecondary }]}>{w}</Text>
        ))}
      </View>
      <View style={styles.days}>
        {calendarDays.map((day, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dayCell, day.mood && { backgroundColor: MOODS[day.mood].color + '30' }]}
            onPress={() => onDayPress(day.date)}
          >
            <Text style={[
              styles.dayText,
              { color: day.isCurrentMonth ? colors.text : colors.textSecondary },
              day.mood && { color: MOODS[day.mood].color, fontWeight: '700' },
            ]}>
              {day.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  function changeMonth(delta: number) {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + delta);
    onMonthChange(next);
  }
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, padding: 12, borderWidth: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  navBtn: { fontSize: 18, padding: 8 },
  monthLabel: { fontSize: 17, fontWeight: '600' },
  weekdays: { flexDirection: 'row', marginBottom: 8 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '500' },
  days: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayText: { fontSize: 14 },
});
```

- [ ] **Step 2: Implement mood screen**

Modify `app/(tabs)/mood.tsx`:

```typescript
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { useDiaryStore } from '../../stores/diaryStore';
import { MoodCalendar } from '../../components/MoodCalendar';
import { Card } from '../../components/ui/Card';
import { MOODS, MOOD_LIST } from '../../constants/moods';
import { MoodType, MoodStat } from '../../types';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

export default function MoodScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const diaries = useDiaryStore((s) => s.diaries);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const moodStats = useMemo((): MoodStat[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthDiaries = diaries.filter((d) => {
      const date = new Date(d.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const counts: Record<MoodType, number> = { happy: 0, calm: 0, neutral: 0, sad: 0, angry: 0 };
    monthDiaries.forEach((d) => { counts[d.mood]++; });

    const total = monthDiaries.length || 1;
    return MOOD_LIST.map((mood) => ({
      mood,
      count: counts[mood],
      percentage: Math.round((counts[mood] / total) * 100),
    }));
  }, [diaries, currentMonth]);

  const topMood = useMemo(() => {
    const max = moodStats.reduce((a, b) => (a.count > b.count ? a : b), moodStats[0]);
    return max.count > 0 ? max : null;
  }, [moodStats]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <MoodCalendar diaries={diaries} currentMonth={currentMonth} onMonthChange={setCurrentMonth} onDayPress={() => {}} />
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>本月心情统计</Text>
        {topMood && (
          <Card style={styles.topMoodCard}>
            <Text style={styles.topMoodEmoji}>{MOODS[topMood.mood].emoji}</Text>
            <Text style={[styles.topMoodLabel, { color: colors.text }]}>本月心情: {MOODS[topMood.mood].label}最多</Text>
            <Text style={[styles.topMoodDetail, { color: colors.textSecondary }]}>{topMood.count}天 ({topMood.percentage}%)</Text>
          </Card>
        )}
        <View style={styles.statList}>
          {moodStats.map((stat) => (
            <View key={stat.mood} style={styles.statRow}>
              <Text style={styles.statEmoji}>{MOODS[stat.mood].emoji}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>{MOODS[stat.mood].label}</Text>
              <View style={[styles.statBar, { backgroundColor: colors.border }]}>
                <View style={[styles.statBarFill, { width: `${stat.percentage}%`, backgroundColor: MOODS[stat.mood].color }]} />
              </View>
              <Text style={[styles.statPercent, { color: colors.textSecondary }]}>{stat.count}天</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  topMoodCard: { alignItems: 'center', padding: 20, marginBottom: 16 },
  topMoodEmoji: { fontSize: 40 },
  topMoodLabel: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  topMoodDetail: { fontSize: 14, marginTop: 4 },
  statList: { gap: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statEmoji: { fontSize: 20, width: 28 },
  statLabel: { fontSize: 14, width: 40 },
  statBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 4 },
  statPercent: { fontSize: 12, width: 50, textAlign: 'right' },
});
```

- [ ] **Step 3: Commit**

```bash
git add components/MoodCalendar.tsx app/(tabs)/mood.tsx
git commit -m "feat: implement mood calendar and statistics screen"
```

---

### Task 9: Profile Screen (Level + Achievements + Stats)

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Implement profile screen**

Modify `app/(tabs)/profile.tsx`:

```typescript
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../../stores/gameStore';
import { useDiaryStore } from '../../stores/diaryStore';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const profile = useGameStore((s) => s.profile);
  const diaries = useDiaryStore((s) => s.diaries);

  const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
  const unlockedCount = profile?.achievements.filter((a) => a.isUnlocked).length ?? 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {profile && (
        <>
          <Card style={styles.profileCard}>
            <Text style={styles.levelEmoji}>🎮</Text>
            <Text style={[styles.level, { color: colors.text }]}>Lv.{profile.level} {profile.title}</Text>
            <View style={styles.expBar}>
              <View style={[styles.expFill, { width: `${(profile.exp / profile.expToNextLevel) * 100}%` }]} />
            </View>
            <Text style={[styles.expText, { color: colors.textSecondary }]}>EXP {profile.exp}/{profile.expToNextLevel}</Text>
            {profile.streakDays > 0 && (
              <Text style={styles.streak}>🔥 连续记录 {profile.streakDays} 天</Text>
            )}
          </Card>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>记录统计</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statBox}>
              <Text style={styles.statNumber}>{diaries.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>日记篇数</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={styles.statNumber}>{totalWords > 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>总字数</Text>
            </Card>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>成就 ({unlockedCount}/{profile.achievements.length})</Text>
          {profile.achievements.map((ach) => (
            <Card key={ach.id} style={[styles.achievementCard, !ach.isUnlocked && styles.lockedAchievement]}>
              <Text style={[styles.achIcon, !ach.isUnlocked && styles.lockedIcon]}>
                {ach.isUnlocked ? ach.icon : '🔒'}
              </Text>
              <View style={styles.achInfo}>
                <Text style={[styles.achTitle, { color: ach.isUnlocked ? colors.text : colors.textSecondary }]}>{ach.title}</Text>
                <Text style={[styles.achDesc, { color: colors.textSecondary }]}>{ach.description}</Text>
              </View>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  profileCard: { alignItems: 'center', padding: 24, marginBottom: 20 },
  levelEmoji: { fontSize: 48, marginBottom: 8 },
  level: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  expBar: { width: '100%', height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
  expFill: { height: '100%', backgroundColor: '#6C63FF', borderRadius: 5 },
  expText: { fontSize: 13, marginTop: 6 },
  streak: { fontSize: 15, color: '#FF6347', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#6C63FF' },
  statLabel: { fontSize: 13, marginTop: 4 },
  achievementCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  lockedAchievement: { opacity: 0.5 },
  achIcon: { fontSize: 28 },
  lockedIcon: { fontSize: 22 },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 15, fontWeight: '600' },
  achDesc: { fontSize: 13, marginTop: 2 },
});
```

- [ ] **Step 2: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "feat: implement profile screen with level, stats and achievements"
```

---

### Task 10: Test on Real Device & Fix Issues

- [ ] **Step 1: Start dev server**

```bash
cd /Users/allen/IdeaProjects/explore/life-gamer
npx expo start
```

- [ ] **Step 2: Test on Android device**

1. Make sure Expo Go is installed on phone
2. Scan QR code to connect
3. Test each screen

Test checklist:
- [ ] Home screen shows level, EXP, today's record status
- [ ] Tap "写今日日记" navigates to write screen
- [ ] Write diary: select mood → input title/content → save → returns to list
- [ ] Diary list shows all diaries
- [ ] Mood calendar correctly shows mood colors
- [ ] Profile shows level, stats, achievements

- [ ] **Step 3: Fix discovered issues**

- [ ] **Step 4: Commit fixes**

```bash
git add -A
git commit -m "fix: resolve issues found during device testing"
```
