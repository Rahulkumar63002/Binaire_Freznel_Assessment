import { CpuMetrics } from '../types';
import { BrailleGraphRenderer } from '../utils/brailleGraph';

export class CpuSensor {
  private metrics: CpuMetrics;

  constructor(initialMetrics: CpuMetrics) {
    this.metrics = initialMetrics;
  }

  public updateMetrics(newMetrics: CpuMetrics): void {
    this.metrics = newMetrics;
  }

  public getModelName(): string {
    return this.metrics.model;
  }

  public getBaseFreq(): string {
    return `${this.metrics.baseFreqGhz.toFixed(1)} GHz`;
  }

  public getTotalUsage(): number {
    return this.metrics.totalUsage;
  }

  public getLoadAverage(): [number, number, number] {
    return this.metrics.loadAvg;
  }

  public getUptimeSeconds(): number {
    return this.metrics.uptimeSeconds;
  }

  public getCores() {
    return this.metrics.cores;
  }

  public getHistory(): number[] {
    return this.metrics.history;
  }

  public generateBrailleGraph(cols: number = 50): string {
    return BrailleGraphRenderer.renderBrailleSeries(this.metrics.history, cols);
  }

  public isOverheating(): boolean {
    return this.metrics.cores.some((c) => c.temp > 75);
  }
}
