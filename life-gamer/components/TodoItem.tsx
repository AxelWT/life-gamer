import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  TextInput,
} from 'react-native';
import { Todo } from '../types';
import { Colors } from '../constants/colors';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);

  const handleDelete = () => {
    Alert.alert(
      '删除待办',
      '确定要删除这个待办事项吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onDelete(todo.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent.trim() !== todo.content) {
      onEdit(todo.id, editContent.trim());
    }
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* 复选框 */}
      <TouchableOpacity
        onPress={() => onToggle(todo.id)}
        style={[
          styles.checkbox,
          {
            borderColor: todo.isCompleted ? theme.primary : theme.textMuted,
            backgroundColor: todo.isCompleted ? theme.primary : 'transparent',
          },
        ]}
      >
        {todo.isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* 内容 */}
      <View style={styles.contentContainer}>
        {isEditing ? (
          <TextInput
            style={[styles.editInput, { color: theme.text, borderColor: theme.primary }]}
            value={editContent}
            onChangeText={setEditContent}
            onBlur={handleEdit}
            onSubmitEditing={handleEdit}
            autoFocus
            multiline
          />
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            onLongPress={handleDelete}
            style={styles.contentTouchable}
          >
            <Text
              style={[
                styles.contentText,
                {
                  color: todo.isCompleted ? theme.textMuted : theme.text,
                  textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
                },
              ]}
            >
              {todo.content}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 删除按钮 */}
      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
        <Text style={[styles.deleteText, { color: theme.textMuted }]}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
  contentTouchable: {
    flex: 1,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  editInput: {
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
    borderBottomWidth: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 22,
    fontWeight: '600',
  },
});
