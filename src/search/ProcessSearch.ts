import { ProcessItemData } from '../types';

export class ProcessSearch {
  public static search(processes: ProcessItemData[], pattern: string): ProcessItemData[] {
    if (!pattern || pattern.trim() === '') {
      return processes;
    }

    const trimmed = pattern.trim();

    if (trimmed.startsWith('/') && trimmed.length > 2) {
      try {
        const lastSlash = trimmed.lastIndexOf('/');
        const regexStr = trimmed.slice(1, lastSlash);
        const flags = trimmed.slice(lastSlash + 1) || 'i';
        const rx = new RegExp(regexStr, flags);
        return processes.filter(
          (p) => rx.test(p.name) || rx.test(p.command) || rx.test(p.pid.toString())
        );
      } catch (error) {
        console.warn('Invalid search regex:', error);
        return [];
      }
    }

    const tokens = trimmed.toLowerCase().split(/\s+/);
    return processes.filter((proc) => {
      const targetStr = `${proc.pid} ${proc.name} ${proc.command} ${proc.user}`.toLowerCase();
      return tokens.every((token) => targetStr.includes(token));
    });
  }
}
