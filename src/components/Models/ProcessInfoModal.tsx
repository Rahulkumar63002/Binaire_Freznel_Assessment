import React from 'react';
import { ProcessItemData } from '../../types';
import { MetricFormatters } from '../../utils/formatters';

interface ProcessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: ProcessItemData | null;
  onTerminate: (pid: number, signal: 'SIGTERM' | 'SIGKILL') => void;
}

export const ProcessInfoModal: React.FC<ProcessInfoModalProps> = ({
  isOpen,
  onClose,
  process,
  onTerminate,
}) => {
  if (!isOpen || !process) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none font-mono">
      <div className="w-full max-w-xl bg-[#0c0f17] border-2 border-cyan-500/50 rounded shadow-2xl p-5 text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232b38] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-400 font-bold tracking-wider text-sm">
              [ PROCESS INSPECTOR: PID {process.pid} ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#181d28] border border-[#2a3444] text-xs font-bold cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-[#11141e] p-3 rounded border border-[#212836]">
            <div>
              <span className="text-gray-400 block text-[10px]">PROGRAM</span>
              <span className="font-bold text-gray-100 text-sm">{process.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">STATUS</span>
              <span className="font-bold text-emerald-400 uppercase">{process.status}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">USER</span>
              <span className="font-semibold text-gray-200">{process.user}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">THREADS</span>
              <span className="font-semibold text-cyan-300">{process.threads} Active</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">MEMORY (RSS)</span>
              <span className="font-semibold text-emerald-300">
                {MetricFormatters.formatBytes(process.memBytes, 2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">CPU USAGE</span>
              <span className="font-bold text-amber-400">{process.cpuPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-[#11141e] p-3 rounded border border-[#212836]">
            <span className="text-gray-400 block text-[10px] mb-1">COMMAND LINE / EXECUTABLE PATH</span>
            <div className="font-mono text-gray-200 text-xs break-all bg-[#0a0c12] p-2 rounded border border-[#1b212c]">
              {process.command}
            </div>
          </div>

          <div className="bg-[#11141e] p-3 rounded border border-[#212836] space-y-1">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Memory Footprint</span>
              <span className="text-gray-200 font-bold">{MetricFormatters.formatProcessMem(process.memBytes)}</span>
            </div>
            <div className="h-3 bg-[#0a0c12] rounded overflow-hidden border border-[#1d2330]">
              <div
                style={{ width: `${Math.min(100, (process.memBytes / (1024 * 1024 * 1024)) * 100)}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#202734] pt-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onTerminate(process.pid, 'SIGTERM');
                onClose();
              }}
              className="py-1.5 px-3 bg-amber-950/60 hover:bg-amber-900 border border-amber-600 text-amber-200 rounded text-xs font-bold cursor-pointer"
            >
              SIGTERM (15)
            </button>
            <button
              onClick={() => {
                onTerminate(process.pid, 'SIGKILL');
                onClose();
              }}
              className="py-1.5 px-3 bg-red-950/60 hover:bg-red-900 border border-red-600 text-red-200 rounded text-xs font-bold cursor-pointer"
            >
              SIGKILL (9)
            </button>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-[#1b212c] hover:bg-[#252c3b] border border-[#2a3444] text-gray-200 rounded text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
