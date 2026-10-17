import { DiskMetrics, MemoryMetrics } from '../types';
import { MetricFormatters } from '../utils/formatters';

export class MemorySensor {
  private memMetrics: MemoryMetrics;
  private diskMetrics: DiskMetrics;

  constructor(mem: MemoryMetrics, disk: DiskMetrics) {
    this.memMetrics = mem;
    this.diskMetrics = disk;
  }

  public update(mem: MemoryMetrics, disk: DiskMetrics): void {
    this.memMetrics = mem;
    this.diskMetrics = disk;
  }

  public getMem(): MemoryMetrics {
    return this.memMetrics;
  }

  public getDisk(): DiskMetrics {
    return this.diskMetrics;
  }

  public getRamUsedPercent(): number {
    return Math.round((this.memMetrics.usedBytes / this.memMetrics.totalBytes) * 100);
  }

  public getDiskUsedPercent(): number {
    return Math.round((this.diskMetrics.usedBytes / this.diskMetrics.totalBytes) * 100);
  }

  public getFormattedRamTotal(): string {
    return MetricFormatters.formatBytes(this.memMetrics.totalBytes, 1);
  }

  public getFormattedRamUsed(): string {
    return MetricFormatters.formatBytes(this.memMetrics.usedBytes, 2);
  }

  public getFormattedRamAvail(): string {
    return MetricFormatters.formatBytes(this.memMetrics.availableBytes, 2);
  }

  public getFormattedCache(): string {
    return MetricFormatters.formatBytes(this.memMetrics.cachedBytes, 2);
  }

  public getFormattedCommitted(): string {
    return MetricFormatters.formatBytes(this.memMetrics.committedBytes, 1);
  }

  public getFormattedDiskTotal(): string {
    return MetricFormatters.formatBytes(this.diskMetrics.totalBytes, 0);
  }

  public getFormattedDiskUsed(): string {
    return MetricFormatters.formatBytes(this.diskMetrics.usedBytes, 0);
  }

  public getFormattedDiskFree(): string {
    return MetricFormatters.formatBytes(this.diskMetrics.freeBytes, 0);
  }
}
