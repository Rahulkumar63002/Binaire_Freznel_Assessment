import React, { useEffect, useState } from 'react';
import { UserAccount } from '../../types';
import { MetricFormatters } from '../../utils/formatters';

interface TerminalHeaderProps {
  intervalMs: number;
  onIncreaseInterval: () => void;
  onDecreaseInterval: () => void;
  onOpenMenu: () => void;
  onOpenHelp: () => void;
  onOpenAuth: () => void;
  user: UserAccount | null;
  activePreset: number;
  onSelectPreset: (preset: number) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  intervalMs,
  onIncreaseInterval,
  onDecreaseInterval,
  onOpenMenu,
  onOpenHelp,
  onOpenAuth,
  user,
  activePreset,
  onSelectPreset,
  crtEnabled,
  onToggleCrt,
}) => {
  const [clock, setClock] = useState<string>(() => MetricFormatters.formatTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(MetricFormatters.formatTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between px-2.5 py-1 bg-[#090b10] border-b border-[#2a303c] text-xs font-mono text-gray-300 select-none">
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <span className="text-cyan-400 font-bold tracking-wider">cpu</span>
        </div>

        <button
          onClick={onOpenMenu}
          title="Open Settings & Menu (Press Escape)"
          className="hover:text-white px-1 py-0.5 rounded bg-[#161a23] hover:bg-[#222836] border border-[#2a303c] transition-colors cursor-pointer"
        >
          <span className="text-gray-400">m</span>enu
        </button>

        <div className="flex items-center space-x-1 bg-[#12151d] px-1.5 py-0.5 rounded border border-[#232834]">
          <span className="text-gray-400">preset</span>
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              onClick={() => onSelectPreset(p)}
              className={`px-1 rounded text-[11px] cursor-pointer transition-colors ${
                activePreset === p
                  ? 'text-amber-400 font-bold bg-[#262c3b]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {p}
              {activePreset === p ? '*' : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#161b24] hover:bg-[#202734] border border-[#2a303c] text-[11px] text-emerald-400 cursor-pointer"
            title="User Account Details (Press 'u')"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{user ? user.username : 'Sign In / Up'}</span>
            <span className="text-[9px] text-gray-500 font-normal">[{user?.role ?? 'auth'}]</span>
          </button>
          {user && (
            <button
              onClick={onOpenAuth}
              className="px-1.5 py-0.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-[10px] text-red-300 cursor-pointer"
              title="Sign Out to Login Screen"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      <div className="text-center font-bold text-sm tracking-widest text-[#f8fafc] px-3 py-0.5 rounded bg-[#11141c] border border-[#242b38] shadow-inner">
        {clock}
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {/* Battery meter */}
        <div className="flex items-center space-x-1 bg-[#12161f] px-2 py-0.5 rounded border border-[#252c3a]">
          <span className="text-amber-400 font-semibold">BAT</span>
          <span className="text-green-400 font-bold">100%</span>
          <span className="text-green-500 font-mono tracking-tighter">■■■■■■</span>
        </div>

        {/* Interval controls */}
        <div className="flex items-center space-x-1 bg-[#12161f] px-2 py-0.5 rounded border border-[#252c3a]">
          <span className="text-sky-300 font-bold">{intervalMs}ms</span>
          <button
            onClick={onDecreaseInterval}
            className="px-1 text-gray-400 hover:text-white cursor-pointer hover:bg-[#232a38] rounded text-sm font-bold leading-none"
            title="Faster refresh (Press +)"
          >
            +
          </button>
          <button
            onClick={onIncreaseInterval}
            className="px-1 text-gray-400 hover:text-white cursor-pointer hover:bg-[#232a38] rounded text-sm font-bold leading-none"
            title="Slower refresh (Press -)"
          >
            -
          </button>
        </div>

        <button
          onClick={onToggleCrt}
          className={`px-1.5 py-0.5 rounded text-[10px] border cursor-pointer ${
            crtEnabled
              ? 'bg-amber-950/40 border-amber-600 text-amber-300'
              : 'bg-[#151922] border-[#252b38] text-gray-500 hover:text-gray-300'
          }`}
          title="Toggle CRT Scanline Effect"
        >
          CRT
        </button>

        <button
          onClick={onOpenHelp}
          className="px-1.5 py-0.5 rounded bg-[#161a24] hover:bg-[#222938] border border-[#2b3240] text-cyan-400 hover:text-cyan-300 text-xs font-bold cursor-pointer"
          title="Keyboard Shortcuts (Press '?' or 'h')"
        >
          ?
        </button>
      </div>
    </div>
  );
};
