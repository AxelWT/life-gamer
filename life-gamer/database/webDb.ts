import { Platform } from 'react-native';

interface WebRow {
  [key: string]: string | number | null;
}

class WebDatabase {
  private storageKey = 'lifegamer_db';

  private getStore(table: string): WebRow[] {
    const data = localStorage.getItem(`${this.storageKey}_${table}`);
    return data ? JSON.parse(data) : [];
  }

  private saveStore(table: string, rows: WebRow[]): void {
    localStorage.setItem(`${this.storageKey}_${table}`, JSON.stringify(rows));
  }

  async execAsync(sql: string): Promise<void> {
    // Initialize tables in localStorage
    if (sql.includes('CREATE TABLE')) {
      if (!localStorage.getItem(`${this.storageKey}_diaries`)) {
        this.saveStore('diaries', []);
      }
      if (!localStorage.getItem(`${this.storageKey}_game_profile`)) {
        this.saveStore('game_profile', []);
      }
      if (!localStorage.getItem(`${this.storageKey}_achievements`)) {
        this.saveStore('achievements', []);
      }
    }
  }

  async getFirstAsync<T extends WebRow>(sql: string, params: (string | number)[] = []): Promise<T | null> {
    const rows = await this.getAllAsync<T>(sql, params);
    return rows[0] || null;
  }

  async getAllAsync<T extends WebRow>(sql: string, params: (string | number)[] = []): Promise<T[]> {
    const table = this.extractTable(sql);
    if (!table) return [];

    let rows = this.getStore(table) as T[];

    // Handle WHERE conditions
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s*$)/i);
    if (whereMatch) {
      const conditions = whereMatch[1];
      rows = this.filterRows(rows, conditions, params);
    }

    // Handle ORDER BY
    const orderMatch = sql.match(/ORDER BY\s+(\w+)\s+(ASC|DESC)/i);
    if (orderMatch) {
      const field = orderMatch[1];
      const direction = orderMatch[2].toUpperCase() === 'DESC' ? -1 : 1;
      rows.sort((a, b) => {
        const aVal = a[field] ?? 0;
        const bVal = b[field] ?? 0;
        return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * direction;
      });
    }

    // Handle LIMIT and OFFSET
    const limitMatch = sql.match(/LIMIT\s+\?/i);
    const offsetMatch = sql.match(/OFFSET\s+\?/i);
    if (limitMatch) {
      const limitIdx = this.getParamIndex(sql, 'LIMIT');
      const limit = params[limitIdx] as number;
      const offset = offsetMatch ? (params[this.getParamIndex(sql, 'OFFSET')] as number) : 0;
      rows = rows.slice(offset, offset + limit);
    }

    return rows;
  }

  async runAsync(sql: string, params: (string | number | null)[] = []): Promise<void> {
    const table = this.extractTable(sql);
    if (!table) return;

    if (sql.toUpperCase().startsWith('INSERT')) {
      const rows = this.getStore(table);
      const newRow: WebRow = {};
      const columns = this.extractInsertColumns(sql);
      columns.forEach((col, i) => {
        newRow[col] = params[i] ?? null;
      });
      rows.push(newRow);
      this.saveStore(table, rows);
    } else if (sql.toUpperCase().startsWith('UPDATE')) {
      const rows = this.getStore(table);
      const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
      const whereMatch = sql.match(/WHERE\s+(.+?)$/i);

      if (setMatch && whereMatch) {
        const setClauses = setMatch[1].split(',').map(s => s.trim());
        const setParamStart = 0;
        const whereParamIdx = params.length - 1;

        const updatedRows = rows.map(row => {
          if (this.matchesWhere(row, whereMatch[1], [params[whereParamIdx]])) {
            const updated = { ...row };
            setClauses.forEach((clause, i) => {
              const col = clause.split('=')[0].trim();
              updated[col] = params[setParamStart + i] ?? null;
            });
            return updated;
          }
          return row;
        });
        this.saveStore(table, updatedRows);
      }
    } else if (sql.toUpperCase().startsWith('DELETE')) {
      const rows = this.getStore(table);
      const whereMatch = sql.match(/WHERE\s+(.+?)$/i);
      if (whereMatch) {
        const filtered = rows.filter(row => !this.matchesWhere(row, whereMatch[1], params));
        this.saveStore(table, filtered);
      }
    }
  }

  private extractTable(sql: string): string | null {
    const match = sql.match(/(?:FROM|INTO|UPDATE|TABLE)\s+(\w+)/i);
    return match ? match[1] : null;
  }

  private extractInsertColumns(sql: string): string[] {
    const match = sql.match(/\(([^)]+)\)\s+VALUES/i);
    return match ? match[1].split(',').map(s => s.trim()) : [];
  }

  private getParamIndex(sql: string, keyword: string): number {
    const beforeKeyword = sql.split(new RegExp(keyword, 'i'))[0];
    return (beforeKeyword.match(/\?/g) || []).length;
  }

  private filterRows<T extends WebRow>(rows: T[], conditions: string, params: (string | number)[]): T[] {
    return rows.filter(row => this.matchesWhere(row, conditions, params));
  }

  private matchesWhere(row: WebRow, conditions: string, params: (string | number | null)[]): boolean {
    // Simple condition parsing: "field = ?" or "field >= ? AND field <= ?"
    const parts = conditions.split(/\s+AND\s+/i);
    let paramIdx = 0;

    for (const part of parts) {
      const match = part.match(/(\w+)\s*(=|>=|<=|>|<)\s*\?/);
      if (match) {
        const field = match[1];
        const op = match[2];
        const value = params[paramIdx++];
        const rowValue = row[field];

        switch (op) {
          case '=': if (rowValue !== value) return false; break;
          case '>=': if ((rowValue ?? 0) < (value ?? 0)) return false; break;
          case '<=': if ((rowValue ?? 0) > (value ?? 0)) return false; break;
          case '>': if ((rowValue ?? 0) <= (value ?? 0)) return false; break;
          case '<': if ((rowValue ?? 0) >= (value ?? 0)) return false; break;
        }
      }
    }
    return true;
  }
}

export function isWeb(): boolean {
  return Platform.OS === 'web';
}

export function createWebDatabase(): WebDatabase {
  return new WebDatabase();
}
