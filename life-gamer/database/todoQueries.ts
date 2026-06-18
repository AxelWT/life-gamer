import { Todo } from '../types';
import { getDatabase } from './init';

interface TodoRow {
  id: string;
  date: string;
  content: string;
  is_completed: number;
  created_at: number;
  updated_at: number;
}

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    date: row.date,
    content: row.content,
    isCompleted: row.is_completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 初始化 TODO 表
export async function initTodoTable(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_todos_date ON todos(date);
  `);
}

// 创建 TODO
export async function createTodo(
  date: string,
  content: string
): Promise<Todo> {
  const db = await getDatabase();
  const now = Date.now();
  const id = `todo_${now}_${Math.random().toString(36).substring(2, 9)}`;

  await db.runAsync(
    'INSERT INTO todos (id, date, content, is_completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, date, content, 0, now, now]
  );

  const row = await db.getFirstAsync<TodoRow>('SELECT * FROM todos WHERE id = ?', [id]);
  return rowToTodo(row!);
}

// 获取指定日期的 TODO 列表
export async function getTodosByDate(date: string): Promise<Todo[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<TodoRow>(
    'SELECT * FROM todos WHERE date = ? ORDER BY is_completed ASC, created_at DESC',
    [date]
  );
  return rows.map(rowToTodo);
}

// 获取指定月份的 TODO（用于日历标记）
export async function getTodosByMonth(year: number, month: number): Promise<Todo[]> {
  const db = await getDatabase();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const rows = await db.getAllAsync<TodoRow>(
    'SELECT * FROM todos WHERE date >= ? AND date <= ?',
    [startDate, endDate]
  );
  return rows.map(rowToTodo);
}

// 更新 TODO
export async function updateTodo(
  id: string,
  fields: Partial<Pick<Todo, 'content' | 'isCompleted'>>
): Promise<Todo | null> {
  const db = await getDatabase();
  const sets: string[] = [];
  const values: (string | number)[] = [];

  if (fields.content !== undefined) {
    sets.push('content = ?');
    values.push(fields.content);
  }
  if (fields.isCompleted !== undefined) {
    sets.push('is_completed = ?');
    values.push(fields.isCompleted ? 1 : 0);
  }

  if (sets.length === 0) return getTodoById(id);

  sets.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  await db.runAsync(`UPDATE todos SET ${sets.join(', ')} WHERE id = ?`, values);

  return getTodoById(id);
}

// 获取单个 TODO
export async function getTodoById(id: string): Promise<Todo | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<TodoRow>('SELECT * FROM todos WHERE id = ?', [id]);
  return row ? rowToTodo(row) : null;
}

// 删除 TODO
export async function deleteTodo(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
}

// 切换 TODO 完成状态
export async function toggleTodo(id: string): Promise<Todo | null> {
  const todo = await getTodoById(id);
  if (!todo) return null;

  return updateTodo(id, { isCompleted: !todo.isCompleted });
}

// 获取有 TODO 的日期列表（用于日历标记）
export async function getDatesWithTodos(year: number, month: number): Promise<string[]> {
  const db = await getDatabase();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const rows = await db.getAllAsync<{ date: string }>(
    'SELECT DISTINCT date FROM todos WHERE date >= ? AND date <= ?',
    [startDate, endDate]
  );
  return rows.map((r) => r.date);
}
