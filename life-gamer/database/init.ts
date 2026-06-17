import { Platform } from 'react-native';
import { createWebDatabase, isWeb } from './webDb';

type Database = any;

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    if (isWeb()) {
      db = createWebDatabase();
    } else {
      const SQLite = require('expo-sqlite');
      db = await SQLite.openDatabaseAsync('lifegamer.db');
    }
    await initializeTables(db);
  }
  return db;
}

async function initializeTables(database: SQLite.SQLiteDatabase): Promise<void> {
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
      id INTEGER PRIMARY KEY NOT NULL,
      level INTEGER NOT NULL DEFAULT 1,
      exp INTEGER NOT NULL DEFAULT 0,
      streak_days INTEGER NOT NULL DEFAULT 0,
      last_record_date TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      is_unlocked INTEGER NOT NULL DEFAULT 0,
      unlocked_at INTEGER
    );
  `);

  const profileResult = await database.getFirstAsync<{ id: number }>(
    'SELECT id FROM game_profile WHERE id = 1'
  );

  if (!profileResult) {
    await database.runAsync(
      'INSERT INTO game_profile (id, level, exp, streak_days, last_record_date) VALUES (1, 1, 0, 0, "")'
    );
  }
}
