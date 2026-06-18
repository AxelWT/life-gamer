import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Diary } from '../types';
import { MOODS } from '../constants/moods';
import { generateExportJson } from './importDiary';

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function getMoodLabel(mood: string): string {
  return MOODS.find((m) => m.key === mood)?.label ?? mood;
}

function getMoodEmoji(mood: string): string {
  return MOODS.find((m) => m.key === mood)?.emoji ?? '😐';
}

function buildExportText(diaries: Diary[]): string {
  // 按日期降序排列
  const sorted = [...diaries].sort((a, b) => b.createdAt - a.createdAt);

  // 按日期分组
  const grouped: Record<string, Diary[]> = {};
  sorted.forEach((d) => {
    const dateKey = formatDate(d.createdAt);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(d);
  });

  const lines: string[] = [];
  const divider = '─'.repeat(44);
  const thickDivider = '═'.repeat(44);

  // 文件头
  lines.push(thickDivider);
  lines.push('          LifeGamer 日记导出');
  lines.push(thickDivider);
  lines.push('');
  lines.push(`  导出时间：${formatDate(Date.now())} ${formatTime(Date.now())}`);
  lines.push(`  日记总数：${diaries.length} 篇`);
  lines.push('');
  lines.push(thickDivider);
  lines.push('');

  // 按日期输出
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  dates.forEach((date, dateIndex) => {
    const dayDiaries = grouped[date];

    lines.push(`  📅  ${date}`);
    lines.push(`  ${divider}`);

    dayDiaries.forEach((diary, i) => {
      const emoji = getMoodEmoji(diary.mood);
      const moodLabel = getMoodLabel(diary.mood);
      const title = diary.title?.trim() || '无标题';
      const time = formatTime(diary.createdAt);

      lines.push('');
      lines.push(`  ${emoji} ${moodLabel}    ${time}`);
      lines.push('');
      lines.push(`  标题：${title}`);
      lines.push('');

      // 内容按段落缩进
      const contentLines = diary.content.split('\n');
      contentLines.forEach((line) => {
        lines.push(`  ${line}`);
      });

      // 多篇日记之间加分隔
      if (i < dayDiaries.length - 1) {
        lines.push('');
        lines.push('  · · · · · · · · · · · · · · · ·');
      }
    });

    lines.push('');
    lines.push('');

    // 日期之间加分隔线
    if (dateIndex < dates.length - 1) {
      lines.push('  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄');
      lines.push('');
    }
  });

  // 文件尾
  lines.push(thickDivider);
  lines.push('          — End —');
  lines.push(thickDivider);
  lines.push('');

  return lines.join('\n');
}

export async function exportDiaries(diaries: Diary[]): Promise<boolean> {
  if (diaries.length === 0) return false;

  const text = buildExportText(diaries);
  const dateStr = formatDate(Date.now()).replace(/-/g, '');
  const fileName = `LifeGamer_日记_${dateStr}.txt`;
  const filePath = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, text, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'text/plain',
      dialogTitle: '导出日记',
    });
    return true;
  }

  return false;
}

export async function exportDiariesAsJson(diaries: Diary[]): Promise<boolean> {
  if (diaries.length === 0) return false;

  const json = generateExportJson(diaries);
  const dateStr = formatDate(Date.now()).replace(/-/g, '');
  const fileName = `LifeGamer_日记_${dateStr}.json`;
  const filePath = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: '导出日记 (JSON)',
    });
    return true;
  }

  return false;
}
