import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Todo } from '../types';
import { Colors } from '../constants/colors';
import TodoItem from './TodoItem';

interface TodoListProps {
  date: string;
  todos: Todo[];
  isLoading: boolean;
  onAddTodo: (date: string, content: string) => Promise<void>;
  onToggleTodo: (id: string) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onEditTodo: (id: string, content: string) => Promise<void>;
}

export default function TodoList({
  date,
  todos,
  isLoading,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
}: TodoListProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [newTodoContent, setNewTodoContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return `${parseInt(parts[1])}月${parseInt(parts[2])}日`;
  };

  const handleAddTodo = async () => {
    if (!newTodoContent.trim()) return;

    setIsAdding(true);
    try {
      await onAddTodo(date, newTodoContent.trim());
      setNewTodoContent('');
    } finally {
      setIsAdding(false);
    }
  };

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>
            📝 {formatDate(date)}的待办
          </Text>
          {totalCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.primaryGlow }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>
                {completedCount}/{totalCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {totalCount === 0
            ? '暂无待办事项'
            : completedCount === totalCount
            ? '全部完成 🎉'
            : `已完成 ${completedCount} 项`}
        </Text>
      </View>

      {/* 添加 TODO 输入框 */}
      <View style={[styles.inputContainer, { borderColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={newTodoContent}
          onChangeText={setNewTodoContent}
          placeholder="添加新的待办事项..."
          placeholderTextColor={theme.textMuted}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          disabled={isAdding || !newTodoContent.trim()}
          style={[
            styles.addBtn,
            {
              backgroundColor:
                newTodoContent.trim() ? theme.primary : theme.surfaceElevated,
            },
          ]}
        >
          {isAdding ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.addBtnText}>+</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* TODO 列表 */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            点击上方输入框添加待办
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onEdit={onEditTodo}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  addBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    gap: 10,
  },
});
