import { Diary, MoodType } from '../types';
import { getDatabase } from './init';

interface DiaryRow {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  images: string;
  created_at: number;
  updated_at: number;
  is_favorite: number;
}

function rowToDiary(row: DiaryRow): Diary {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    mood: row.mood as MoodType,
    tags: JSON.parse(row.tags),
    images: JSON.parse(row.images),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isFavorite: row.is_favorite === 1,
  };
}

export async function createDiary(
  title: string,
  content: string,
  mood: MoodType,
  tags: string[] = [],
  images: string[] = []
): Promise<Diary> {
  const db = await getDatabase();
  const now = Date.now();
  const id = `${now}_${Math.random().toString(36).substring(2, 9)}`;

  await db.runAsync(
    'INSERT INTO diaries (id, title, content, mood, tags, images, created_at, updated_at, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, content, mood, JSON.stringify(tags), JSON.stringify(images), now, now, 0]
  );

  const row = await db.getFirstAsync<DiaryRow>('SELECT * FROM diaries WHERE id = ?', [id]);
  return rowToDiary(row!);
}

export async function getAllDiaries(
  limit: number = 50,
  offset: number = 0
): Promise<Diary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DiaryRow>(
    'SELECT * FROM diaries ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows.map(rowToDiary);
}

export async function getDiaryById(id: string): Promise<Diary | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<DiaryRow>('SELECT * FROM diaries WHERE id = ?', [id]);
  return row ? rowToDiary(row) : null;
}

export async function updateDiary(
  id: string,
  fields: Partial<Pick<Diary, 'title' | 'content' | 'mood' | 'tags' | 'images' | 'isFavorite'>>
): Promise<Diary | null> {
  const db = await getDatabase();
  const sets: string[] = [];
  const values: (string | number)[] = [];

  if (fields.title !== undefined) {
    sets.push('title = ?');
    values.push(fields.title);
  }
  if (fields.content !== undefined) {
    sets.push('content = ?');
    values.push(fields.content);
  }
  if (fields.mood !== undefined) {
    sets.push('mood = ?');
    values.push(fields.mood);
  }
  if (fields.tags !== undefined) {
    sets.push('tags = ?');
    values.push(JSON.stringify(fields.tags));
  }
  if (fields.images !== undefined) {
    sets.push('images = ?');
    values.push(JSON.stringify(fields.images));
  }
  if (fields.isFavorite !== undefined) {
    sets.push('is_favorite = ?');
    values.push(fields.isFavorite ? 1 : 0);
  }

  if (sets.length === 0) return getDiaryById(id);

  sets.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  await db.runAsync(`UPDATE diaries SET ${sets.join(', ')} WHERE id = ?`, values);

  return getDiaryById(id);
}

export async function deleteDiary(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM diaries WHERE id = ?', [id]);
}

export async function getDiariesByDateRange(
  startDate: number,
  endDate: number
): Promise<Diary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DiaryRow>(
    'SELECT * FROM diaries WHERE created_at >= ? AND created_at <= ? ORDER BY created_at DESC',
    [startDate, endDate]
  );
  return rows.map(rowToDiary);
}
