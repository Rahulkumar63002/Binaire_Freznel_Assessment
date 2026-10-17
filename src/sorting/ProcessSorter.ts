import { ProcessItemData, SortColumn, SortDirection } from '../types';

export class ProcessSorter {
  public static sort(
    processes: ProcessItemData[],
    column: SortColumn,
    direction: SortDirection = 'desc'
  ): ProcessItemData[] {
    const sorted = [...processes].sort((a, b) => {
      let cmp = 0;
      switch (column) {
        case 'cpu':
          cmp = a.cpuPercent - b.cpuPercent;
          break;
        case 'mem':
          cmp = a.memBytes - b.memBytes;
          break;
        case 'pid':
          cmp = a.pid - b.pid;
          break;
        case 'threads':
          cmp = a.threads - b.threads;
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'command':
          cmp = a.command.localeCompare(b.command);
          break;
        case 'user':
          cmp = a.user.localeCompare(b.user);
          break;
        default:
          cmp = 0;
      }

      return direction === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }
}
