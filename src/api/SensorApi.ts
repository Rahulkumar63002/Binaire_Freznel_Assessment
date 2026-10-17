
import type {
  CpuMetrics,
  DiskMetrics,
  GpuMetrics,
  MemoryMetrics,
  NetworkMetrics,
} from "../types";

export class SensorApi {
  private readonly baseUrl = "http://127.0.0.1:3001/api/sensors";

  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${endpoint}: ${response.status}`
      );
    }

    return (await response.json()) as T;
  }

  public async fetchCpuSensors(
    previousHistory: number[] = []
  ): Promise<CpuMetrics> {
    const data = await this.get<
      Omit<CpuMetrics, "history" | "coreHistories">
    >("cpu");

    return {
      ...data,
      history: [...previousHistory, data.totalUsage].slice(-75),
      coreHistories: [],
    };
  }

  public async fetchGpuSensors(): Promise<GpuMetrics> {
    return this.get<GpuMetrics>("gpu");
  }

  public async fetchMemorySensors(): Promise<MemoryMetrics> {
    const data = await this.get<MemoryMetrics>("memory");

    return {
      ...data,
      history: [],
    };
  }

  public async fetchDiskSensors(): Promise<DiskMetrics> {
    return this.get<DiskMetrics>("disk");
  }

  public async fetchNetworkSensors(
    prevDownloadHist: number[] = [],
    prevUploadHist: number[] = []
  ): Promise<NetworkMetrics> {
    const data = await this.get<
      Omit<NetworkMetrics, "downloadHistory" | "uploadHistory">
    >("network");

    return {
      ...data,
      downloadHistory: [
        ...prevDownloadHist,
        data.downloadSpeedBytes,
      ].slice(-45),
      uploadHistory: [
        ...prevUploadHist,
        data.uploadSpeedBytes,
      ].slice(-45),
    };
  }
}
