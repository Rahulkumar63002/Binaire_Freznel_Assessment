import { SensorApi } from '../api/SensorApi';
import { SystemTaskApi } from '../api/SystemTaskApi';
import { CpuMetrics, DiskMetrics, GpuMetrics, MemoryMetrics, NetworkMetrics, ProcessItemData } from '../types';

export type UpdateListener = (state: SystemSnapshot) => void;

export interface SystemSnapshot {
  cpu: CpuMetrics;
  gpu: GpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  network: NetworkMetrics;
  processes: ProcessItemData[];
  totalProcesses: number;
  refreshIntervalMs: number;
  timestamp: string;
}

export class SystemDataManager {
  private static instance: SystemDataManager;

  private taskApi: SystemTaskApi;
  private sensorApi: SensorApi;

  private refreshIntervalMs: number = 1500; 
  private timerId: any = null;
  private isRunning: boolean = false;
  private listeners: Set<UpdateListener> = new Set();

  private lastCpuMetrics?: CpuMetrics;
  private lastNetworkMetrics?: NetworkMetrics;
  private latestSnapshot?: SystemSnapshot;

  private constructor() {
    this.taskApi = new SystemTaskApi();
    this.sensorApi = new SensorApi();
  }

  public static getInstance(): SystemDataManager {
    if (!SystemDataManager.instance) {
      SystemDataManager.instance = new SystemDataManager();
    }
    return SystemDataManager.instance;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
    this.timerId = setInterval(() => {
      this.tick();
    }, this.refreshIntervalMs);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setIntervalMs(interval: number): void {
    this.refreshIntervalMs = Math.max(250, Math.min(10000, interval));
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  public increaseInterval(): number {
    this.setIntervalMs(this.refreshIntervalMs + 250);
    return this.refreshIntervalMs;
  }

  public decreaseInterval(): number {
    this.setIntervalMs(this.refreshIntervalMs - 250);
    return this.refreshIntervalMs;
  }

  public getIntervalMs(): number {
    return this.refreshIntervalMs;
  }


  public subscribe(listener: UpdateListener): () => void {
    this.listeners.add(listener);
    if (this.latestSnapshot) {
      listener(this.latestSnapshot);
    }
    if (!this.isRunning) {
      this.start();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  }


  public async tick(): Promise<void> {
    try {
      const [cpu, gpu, memory, disk, network, processes] = await Promise.all([
        this.sensorApi.fetchCpuSensors(this.lastCpuMetrics?.history || []),
        this.sensorApi.fetchGpuSensors(),
        this.sensorApi.fetchMemorySensors(),
        this.sensorApi.fetchDiskSensors(),
        this.sensorApi.fetchNetworkSensors(
          this.lastNetworkMetrics?.downloadHistory || [],
          this.lastNetworkMetrics?.uploadHistory || []
        ),
        this.taskApi.fetchProcesses(),
      ]);

      this.lastCpuMetrics = cpu;
      this.lastNetworkMetrics = network;

      const snapshot: SystemSnapshot = {
        cpu,
        gpu,
        memory,
        disk,
        network,
        processes,
        totalProcesses: this.taskApi.getTotalCount(),
        refreshIntervalMs: this.refreshIntervalMs,
        timestamp: new Date().toLocaleTimeString(),
      };

      this.latestSnapshot = snapshot;
      this.listeners.forEach((fn) => fn(snapshot));
    } catch (err) {
      console.error('SystemDataManager tick error:', err);
    }
  }

  public async terminateProcess(pid: number, signal: 'SIGTERM' | 'SIGKILL'): Promise<boolean> {
    const success = await this.taskApi.terminateProcess(pid, signal);
    if (success) {
      await this.tick();
    }
    return success;
  }
}
