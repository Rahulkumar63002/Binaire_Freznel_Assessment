import { FilterOptions, ProcessItemData } from '../types';

export class ProcessFilter {
  
  public static apply(processes: ProcessItemData[], options: FilterOptions): ProcessItemData[] {
    let result = [...processes];

    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.command.toLowerCase().includes(q) ||
          p.pid.toString().includes(q) ||
          p.user.toLowerCase().includes(q)
      );
    }

    if (options.onlyUserProcesses) {
      result = result.filter((p) => p.user !== 'SYSTEM' && p.user !== 'root');
    }

    if (options.minCpuPercent !== undefined && options.minCpuPercent > 0) {
      result = result.filter((p) => p.cpuPercent >= (options.minCpuPercent ?? 0));
    }

    if (options.minMemMb !== undefined && options.minMemMb > 0) {
      const minBytes = options.minMemMb * 1024 * 1024;
      result = result.filter((p) => p.memBytes >= minBytes);
    }

    if (options.lazyMode) {
      result = result.filter((p) => p.cpuPercent > 0.05);
    }

    return result;
  }
}
