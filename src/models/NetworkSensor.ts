import { NetworkMetrics } from '../types';
import { MetricFormatters } from '../utils/formatters';

export class NetworkSensor {
  private metrics: NetworkMetrics;

  constructor(metrics: NetworkMetrics) {
    this.metrics = metrics;
  }

  public update(metrics: NetworkMetrics): void {
    this.metrics = metrics;
  }

  public getMetrics(): NetworkMetrics {
    return this.metrics;
  }

  public getDownloadSpeed(): { bytesStr: string; bitsStr: string } {
    return MetricFormatters.formatSpeedWithBits(this.metrics.downloadSpeedBytes);
  }

  public getUploadSpeed(): { bytesStr: string; bitsStr: string } {
    return MetricFormatters.formatSpeedWithBits(this.metrics.uploadSpeedBytes);
  }

  public getTotalDownload(): string {
    return MetricFormatters.formatBytes(this.metrics.totalDownloadedBytes, 2);
  }

  public getTotalUpload(): string {
    return MetricFormatters.formatBytes(this.metrics.totalUploadedBytes, 1);
  }
}
