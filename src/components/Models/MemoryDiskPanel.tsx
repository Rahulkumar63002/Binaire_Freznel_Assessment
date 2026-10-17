import React from 'react';
import { DiskMetrics, MemoryMetrics } from '../../types';
import { MetricFormatters } from '../../utils/formatters';

interface MemoryDiskPanelProps {
  memory: MemoryMetrics;
  disk: DiskMetrics;
}

export const MemoryDiskPanel: React.FC<MemoryDiskPanelProps> = ({ memory, disk }) => {
  const ramPercent = Math.round((memory.usedBytes / memory.totalBytes) * 100);
  const diskUsedPercent = Math.round((disk.usedBytes / disk.totalBytes) * 100);
  const diskFreePercent = 100 - diskUsedPercent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
    
      <div className="flex flex-col justify-between bg-[#0b0d13] border border-[#2b3342] rounded p-2 text-mono text-xs select-none">
        <div className="flex items-center justify-between border-b border-[#1c222d] pb-1">
          <span className="text-cyan-400 font-bold tracking-wider">mem</span>
          <span className="text-gray-400 text-[10px]">
            Total: <span className="text-gray-200 font-semibold">{MetricFormatters.formatBytes(memory.totalBytes, 1)}</span>
          </span>
        </div>

        <div className="my-1.5">
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-gray-400">Used {MetricFormatters.formatBytes(memory.usedBytes, 2)}</span>
            <span className="text-amber-400 font-semibold">{ramPercent}%</span>
          </div>

          <div className="h-4 bg-[#10141d] rounded-sm border border-[#262e3d] flex overflow-hidden">
            <div
              style={{ width: `${ramPercent}%` }}
              className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-emerald-400 relative overflow-hidden"
            >
              
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 3px, #000 3px, #000 6px)',
                }}
              />
            </div>
            <div
              style={{ width: `${100 - ramPercent}%` }}
              className="h-full bg-cyan-950/40 relative"
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, transparent, transparent 3px, #000 3px, #000 6px)',
                }}
              />
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-400">Avail</span>
            <span className="font-semibold text-gray-200">{MetricFormatters.formatBytes(memory.availableBytes, 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cache</span>
            <span className="font-semibold text-gray-200">{MetricFormatters.formatBytes(memory.cachedBytes, 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Commi</span>
            <span className="font-semibold text-amber-300">{MetricFormatters.formatBytes(memory.committedBytes, 1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">GPU Shared</span>
            <span className="font-semibold text-gray-200">{MetricFormatters.formatBytes(memory.gpuSharedTotalBytes, 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Used</span>
            <span className="font-semibold text-gray-200">{MetricFormatters.formatBytes(memory.gpuSharedUsedBytes, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Page+Virt</span>
            <span className="font-semibold text-gray-200">{MetricFormatters.formatBytes(memory.pageVirtTotalBytes, 1)}</span>
          </div>
          <div className="flex justify-between col-span-2 border-t border-[#1a1f29] pt-0.5">
            <span className="text-gray-400">Page Used</span>
            <span className="font-semibold text-emerald-400">{MetricFormatters.formatBytes(memory.pageVirtUsedBytes, 2)}</span>
          </div>
        </div>
      </div>

     
      <div className="flex flex-col justify-between bg-[#0b0d13] border border-[#2b3342] rounded p-2 text-mono text-xs select-none">
        <div className="flex items-center justify-between border-b border-[#1c222d] pb-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-cyan-400 font-bold tracking-wider">disks</span>
            <span className="px-1 text-[9px] bg-[#161a24] text-gray-400 rounded border border-[#242b38]">io</span>
          </div>
          <div className="text-[10px] text-gray-400 flex items-center space-x-1">
            <span className="text-gray-200 font-bold">{disk.mount}</span>
            <span className="text-emerald-400 font-mono">▼▲11M</span>
            <span className="text-gray-300">{MetricFormatters.formatBytes(disk.totalBytes, 0)}</span>
          </div>
        </div>

        <div className="my-1 space-y-2 text-[11px]">
          <div>
            <div className="flex justify-between text-gray-400 mb-0.5">
              <span>Free: {diskFreePercent}%</span>
              <span className="text-gray-200 font-semibold">{MetricFormatters.formatBytes(disk.freeBytes, 0)}</span>
            </div>
            <div className="h-2.5 bg-[#10141d] rounded-sm border border-[#222938] overflow-hidden">
              <div
                style={{ width: `${diskFreePercent}%` }}
                className="h-full bg-emerald-500 rounded-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 mb-0.5">
              <span>Used: {diskUsedPercent}%</span>
              <span className="text-gray-200 font-semibold">{MetricFormatters.formatBytes(disk.usedBytes, 0)}</span>
            </div>
            <div className="h-2.5 bg-[#10141d] rounded-sm border border-[#222938] overflow-hidden">
              <div
                style={{ width: `${diskUsedPercent}%` }}
                className="h-full bg-red-500 rounded-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-1 border-t border-[#191e28] flex justify-between text-[10px] text-gray-400">
          <span>I/O Active: <strong className="text-emerald-400">{disk.ioPercent}%</strong></span>
          <span>Read: <strong className="text-cyan-400">{MetricFormatters.formatBytes(disk.readSpeedBytes, 0)}/s</strong></span>
        </div>
      </div>
    </div>
  );
};
