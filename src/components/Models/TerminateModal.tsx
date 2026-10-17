import React, { useState } from 'react';
import { ProcessItemData } from '../../types';

interface TerminateModalProps {
  isOpen: boolean;
  onClose: () => void;
  processes: ProcessItemData[];
  onConfirmTerminate: (pids: number[], signal: 'SIGTERM' | 'SIGKILL') => void;
}

export const TerminateModal: React.FC<TerminateModalProps> = ({
  isOpen,
  onClose,
  processes,
  onConfirmTerminate,
}) => {
  const [signal, setSignal] = useState<'SIGTERM' | 'SIGKILL'>('SIGTERM');

  if (!isOpen || processes.length === 0) return null;

  const handleConfirm = () => {
    onConfirmTerminate(
      processes.map((p) => p.pid),
      signal
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none font-mono">
      <div className="w-full max-w-md bg-[#0d0f17] border-2 border-red-500/60 rounded shadow-2xl p-5 text-gray-200">
      
        <div className="flex items-center justify-between border-b border-[#232b38] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 font-bold tracking-wider text-sm">
              [ TERMINATE PROCESS CONFIRMATION ]
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
          <p className="text-gray-300">
            Are you sure you want to terminate the following {processes.length} task(s)?
          </p>

          <div className="max-h-36 overflow-y-auto bg-[#080a10] p-2.5 rounded border border-[#202736] space-y-1">
            {processes.map((p) => (
              <div key={p.pid} className="flex justify-between items-center text-[11px]">
                <span className="text-gray-200 font-bold">
                  {p.name} <span className="text-gray-500 font-normal">({p.pid})</span>
                </span>
                <span className="text-amber-400 font-semibold">{p.cpuPercent}% CPU</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-gray-400 block text-[11px] font-semibold">Select Signal:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSignal('SIGTERM')}
                className={`py-1.5 px-2 rounded border text-center font-bold cursor-pointer ${
                  signal === 'SIGTERM'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                    : 'bg-[#121620] border-[#222a38] text-gray-400'
                }`}
              >
                15 - SIGTERM (Graceful)
              </button>
              <button
                type="button"
                onClick={() => setSignal('SIGKILL')}
                className={`py-1.5 px-2 rounded border text-center font-bold cursor-pointer ${
                  signal === 'SIGKILL'
                    ? 'bg-red-950/70 border-red-500 text-red-200'
                    : 'bg-[#121620] border-[#222a38] text-gray-400'
                }`}
              >
                9 - SIGKILL (Force)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end space-x-2 border-t border-[#202734] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-3 bg-[#181d28] hover:bg-[#222938] border border-[#2a3446] text-gray-300 rounded font-bold cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="py-1.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded font-bold cursor-pointer text-xs transition-colors"
          >
            Send {signal}
          </button>
        </div>
      </div>
    </div>
  );
};
