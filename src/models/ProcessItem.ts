import { ProcessItemData } from '../types';
import { MetricFormatters } from '../utils/formatters';

export class ProcessItem {
  public readonly pid: number;
  public readonly name: string;
  public readonly command: string;
  public readonly threads: number;
  public readonly user: string;
  public memBytes: number;
  public cpuPercent: number;
  public parentPid?: number;
  public status: 'running' | 'sleeping' | 'stopped' | 'zombie';
  public startTime: string;
  public selected: boolean;

  constructor(data: ProcessItemData) {
    this.pid = data.pid;
    this.name = data.name;
    this.command = data.command;
    this.threads = data.threads;
    this.user = data.user;
    this.memBytes = data.memBytes;
    this.cpuPercent = data.cpuPercent;
    this.parentPid = data.parentPid;
    this.status = data.status;
    this.startTime = data.startTime;
    this.selected = !!data.selected;
  }

  public getFormattedMemory(): string {
    return MetricFormatters.formatProcessMem(this.memBytes);
  }

  public getFormattedCpu(): string {
    return this.cpuPercent.toFixed(1);
  }

  public getDisplayCommand(maxLength: number = 36): string {
    return MetricFormatters.truncate(this.command, maxLength);
  }

  public toggleSelect(): void {
    this.selected = !this.selected;
  }

  public toJSON(): ProcessItemData {
    return {
      pid: this.pid,
      name: this.name,
      command: this.command,
      threads: this.threads,
      user: this.user,
      memBytes: this.memBytes,
      cpuPercent: this.cpuPercent,
      parentPid: this.parentPid,
      status: this.status,
      startTime: this.startTime,
      selected: this.selected,
    };
  }
}
