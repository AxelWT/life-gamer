import { create } from 'zustand';
import { Todo } from '../types';
import * as todoQueries from '../database/todoQueries';
import { scheduleTodoNotification } from '../utils/notifications';

interface TodoState {
  todos: Todo[];
  selectedDate: string;
  datesWithTodos: Set<string>;
  isLoading: boolean;

  // 初始化
  initTodoTable: () => Promise<void>;

  // 选择日期
  setSelectedDate: (date: string) => void;

  // 加载指定日期的 TODO
  loadTodosByDate: (date: string) => Promise<void>;

  // 加载指定月份的 TODO 标记
  loadDatesWithTodos: (year: number, month: number) => Promise<void>;

  // 添加 TODO
  addTodo: (date: string, content: string) => Promise<Todo>;

  // 更新 TODO
  updateTodo: (id: string, fields: Partial<Pick<Todo, 'content' | 'isCompleted'>>) => Promise<Todo | null>;

  // 删除 TODO
  deleteTodo: (id: string) => Promise<void>;

  // 切换完成状态
  toggleTodo: (id: string) => Promise<void>;

  // 刷新今日通知
  refreshTodayNotification: () => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  selectedDate: new Date().toISOString().split('T')[0],
  datesWithTodos: new Set(),
  isLoading: false,

  initTodoTable: async () => {
    await todoQueries.initTodoTable();
  },

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  loadTodosByDate: async (date: string) => {
    set({ isLoading: true });
    try {
      const todos = await todoQueries.getTodosByDate(date);
      set({ todos, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadDatesWithTodos: async (year: number, month: number) => {
    try {
      const dates = await todoQueries.getDatesWithTodos(year, month);
      set({ datesWithTodos: new Set(dates) });
    } catch (error) {
      console.error('Failed to load dates with todos:', error);
    }
  },

  addTodo: async (date: string, content: string) => {
    const todo = await todoQueries.createTodo(date, content);
    set((state) => ({
      todos: [todo, ...state.todos],
      datesWithTodos: new Set([...state.datesWithTodos, date]),
    }));
    // 刷新今日通知
    await get().refreshTodayNotification();
    return todo;
  },

  updateTodo: async (id: string, fields) => {
    const updated = await todoQueries.updateTodo(id, fields);
    if (updated) {
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t)),
      }));
    }
    return updated;
  },

  deleteTodo: async (id: string) => {
    const { todos, selectedDate } = get();
    const todoToDelete = todos.find((t) => t.id === id);

    await todoQueries.deleteTodo(id);
    set((state) => {
      const newTodos = state.todos.filter((t) => t.id !== id);

      // 如果该日期没有 TODO 了，从标记中移除
      const hasOtherTodos = newTodos.some((t) => t.date === selectedDate);
      const newDatesWithTodos = new Set(state.datesWithTodos);
      if (!hasOtherTodos) {
        newDatesWithTodos.delete(selectedDate);
      }

      return {
        todos: newTodos,
        datesWithTodos: newDatesWithTodos,
      };
    });

    // 刷新今日通知
    await get().refreshTodayNotification();
  },

  toggleTodo: async (id: string) => {
    const updated = await todoQueries.toggleTodo(id);
    if (updated) {
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t)),
      }));
      // 刷新通知（只提醒未完成的）
      await get().refreshTodayNotification();
    }
  },

  refreshTodayNotification: async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTodos = await todoQueries.getTodosByDate(today);
    const uncompletedTodos = todayTodos.filter((t) => !t.isCompleted);

    if (uncompletedTodos.length > 0) {
      await scheduleTodoNotification(uncompletedTodos.map((t) => t.content));
    }
  },
}));
