export interface CpuCoreData {
  id: number;
  label: string;
  usage: number; 
  temp: number; 
  freqGhz: number;
}

export interface CpuMetrics {
  model: string;
  baseFreqGhz: number;
  totalUsage: number;
  cores: CpuCoreData[];
  loadAvg: [number, number, number];
  uptimeSeconds: number;
  history: number[]; 
  coreHistories: number[][]; 
}

export interface GpuMetrics {
  name: string;
  usage: number;
  temp: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
}

export interface MemoryMetrics {
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  cachedBytes: number;
  committedBytes: number;
  gpuSharedTotalBytes: number;
  gpuSharedUsedBytes: number;
  pageVirtTotalBytes: number;
  pageVirtUsedBytes: number;
  history: number[];
}

export interface DiskMetrics {
  mount: string;
  label: string;
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  readSpeedBytes: number;
  writeSpeedBytes: number;
  ioPercent: number;
}

export interface NetworkMetrics {
  interfaceName: string;
  ipAddress: string;
  downloadSpeedBytes: number;
  uploadSpeedBytes: number;
  totalDownloadedBytes: number;
  totalUploadedBytes: number;
  downloadHistory: number[];
  uploadHistory: number[];
  syncMode: string;
}

export interface ProcessItemData {
  pid: number;
  name: string;
  command: string;
  threads: number;
  user: string;
  memBytes: number;
  cpuPercent: number;
  parentPid?: number;
  status: 'running' | 'sleeping' | 'stopped' | 'zombie';
  startTime: string;
  selected?: boolean;
}

export type SortColumn = 'pid' | 'name' | 'command' | 'threads' | 'user' | 'mem' | 'cpu';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  query: string;
  onlyUserProcesses: boolean;
  minCpuPercent?: number;
  minMemMb?: number;
  showTree: boolean;
  perCore: boolean;
  reverse: boolean;
  lazyMode: boolean;
}

export interface UserAccount {
  uid: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'guest';
  createdAt: string;
}

export interface TerminalTheme {
  id: string;
  name: string;
  bg: string;
  panelBg: string;
  borderColor: string;
  borderGlow: string;
  primaryAccent: string;
  secondaryAccent: string;
  cpuHigh: string;
  cpuMid: string;
  cpuLow: string;
  memUsed: string;
  netDownload: string;
  netUpload: string;
}
