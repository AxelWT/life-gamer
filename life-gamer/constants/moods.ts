import { MoodType } from '../types';

interface MoodDefinition {
  key: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: MoodDefinition[] = [
  { key: 'happy', label: '开心', emoji: '😊', color: '#FFD700' },
  { key: 'calm', label: '平静', emoji: '😌', color: '#87CEEB' },
  { key: 'neutral', label: '一般', emoji: '😐', color: '#D3D3D3' },
  { key: 'sad', label: '难过', emoji: '😢', color: '#6495ED' },
  { key: 'angry', label: '生气', emoji: '😠', color: '#FF6347' },
];
