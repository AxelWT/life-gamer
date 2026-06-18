import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Diary, MoodType } from '../types';

interface ExportData {
  version: string;
  exportDate: string;
  count: number;
  diaries: Diary[];
}

// 验证心情类型是否有效
function isValidMood(mood: string): mood is MoodType {
  return ['happy', 'calm', 'neutral', 'sad', 'angry'].includes(mood);
}

// 验证日记数据结构
function validateDiary(data: any): data is Diary {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.mood === 'string' &&
    isValidMood(data.mood) &&
    Array.isArray(data.tags) &&
    Array.isArray(data.images) &&
    typeof data.createdAt === 'number' &&
    typeof data.updatedAt === 'number' &&
    typeof data.isFavorite === 'boolean'
  );
}

// 解析导入的 JSON 数据
function parseImportData(jsonString: string): Diary[] {
  try {
    const data = JSON.parse(jsonString);

    // 检查是否是新格式（带版本号）
    if (data.version && data.diaries && Array.isArray(data.diaries)) {
      const validDiaries = data.diaries.filter(validateDiary);
      if (validDiaries.length === 0) {
        throw new Error('没有找到有效的日记数据');
      }
      return validDiaries;
    }

    // 检查是否是旧格式（直接是数组）
    if (Array.isArray(data)) {
      const validDiaries = data.filter(validateDiary);
      if (validDiaries.length === 0) {
        throw new Error('没有找到有效的日记数据');
      }
      return validDiaries;
    }

    throw new Error('不支持的文件格式');
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('文件格式错误，请确保是有效的 JSON 文件');
    }
    throw error;
  }
}

// 生成导出的 JSON 数据
export function generateExportJson(diaries: Diary[]): string {
  const exportData: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    count: diaries.length,
    diaries: diaries,
  };
  return JSON.stringify(exportData, null, 2);
}

// 选择并导入文件
export async function importDiariesFromFile(): Promise<Diary[] | null> {
  try {
    // 选择文件
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const fileUri = result.assets[0].uri;

    // 读取文件内容
    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 解析并验证数据
    const diaries = parseImportData(content);

    return diaries;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('导入失败，请重试');
  }
}

// 合并导入的日记（避免重复）
export function mergeImportedDiaries(
  existingDiaries: Diary[],
  importedDiaries: Diary[]
): { newDiaries: Diary[]; duplicateCount: number } {
  const existingIds = new Set(existingDiaries.map((d) => d.id));
  const newDiaries = importedDiaries.filter((d) => !existingIds.has(d.id));
  const duplicateCount = importedDiaries.length - newDiaries.length;

  return { newDiaries, duplicateCount };
}
