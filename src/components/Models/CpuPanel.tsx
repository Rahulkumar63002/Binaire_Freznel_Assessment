import React, { useMemo } from 'react';
import { CpuMetrics, GpuMetrics } from '../../types';
import { MetricFormatters } from '../../utils/formatters';

interface CpuPanelProps {
  cpu: CpuMetrics;
  gpu: GpuMetrics;
}

export const CpuPanel: React.FC<CpuPanelProps> = ({ cpu, gpu }) => {

  const graphBars = useMemo(() => {

    const history = cpu.history;
    const barCount = 55;
    const padded = [...history];
    while (padded.length < barCount) {
      
      padded.unshift(Math.floor(20 + Math.random() * 30));
    }
    return padded.slice(-barCount);
  }, [cpu.history]);

  const subBarHistory = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const isPeak = (i * 7) % 11 > 6;
      return isPeak ? 'peak' : (i * 3) % 5 === 0 ? 'mid' : 'low';
    });
  }, []);

  return (
    <div className="relative flex flex-col h-full bg-[#0b0d13] border border-[#2b3342] rounded text-mono text-xs select-none p-2.5">

      <div className="flex items-center justify-between text-[11px] border-b border-[#1c222d] pb-1 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 font-bold tracking-wider">cpu</span>
        </div>
        <div className="text-gray-400 text-[10px]">
          Uptime: <span className="text-gray-200 font-semibold">{MetricFormatters.formatUptime(cpu.uptimeSeconds)}</span>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">

        <div className="flex-1 flex flex-col justify-between min-w-0 pr-2 border-r border-[#1e2430]">

          <div className="relative flex-1 w-full flex items-end gap-[3px] bg-[#08090e]/80 p-2 rounded border border-[#181d26] overflow-hidden">

            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />

            {graphBars.map((val, idx) => {
              const pct = Math.max(8, Math.min(100, val));
              const heightStyle = `${pct}%`;

              return (
                <div
                  key={idx}
                  className="flex-1 min-w-[4px] max-w-[14px] flex flex-col justify-end h-full z-10 transition-all duration-300"
                >
                  <div
                    style={{ height: heightStyle }}
                    className="w-full rounded-t-[1px] flex flex-col overflow-hidden shadow-sm"
                  >
                  
                    {pct > 65 && (
                      <div
                        style={{ height: `${Math.min(100, (pct - 65) * 2.8)}%` }}
                        className="w-full bg-[#f87171] opacity-95"
                      />
                    )}
                  
                    {pct > 35 && (
                      <div
                        style={{ height: `${Math.min(100, (pct - 35) * 2.2)}%` }}
                        className="w-full bg-[#eab308] opacity-90"
                      />
                    )}
                  
                    <div className="w-full flex-1 bg-[#4ade80] opacity-90" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex items-center space-x-2 text-[10px]">
            <span className="text-gray-400 font-semibold flex items-center space-x-1">
              <span className="text-cyan-400">cpu</span>
              <span className="text-amber-400">▲</span>
              <span className="text-emerald-400">gpu</span>
            </span>

            <div className="flex-1 flex items-center gap-[2px] h-3 bg-[#0a0c12] p-0.5 rounded border border-[#1a1f29] overflow-hidden">
              {subBarHistory.map((type, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full rounded-[1px] ${
                    type === 'peak'
                      ? 'bg-amber-500'
                      : type === 'mid'
                      ? 'bg-lime-500'
                      : 'bg-emerald-600/70'
                  }`}
                />
              ))}
            </div>

            <div className="text-[10px] text-gray-500 whitespace-nowrap">
              {MetricFormatters.formatUptime(cpu.uptimeSeconds)}
            </div>
          </div>
        </div>

        <div className="w-64 flex flex-col justify-between text-xs space-y-2">
    
          <div className="flex items-center justify-between border-b border-[#202734] pb-1">
            <span className="font-bold text-gray-200 tracking-wide">{cpu.model}</span>
            <span className="text-cyan-400 font-semibold">{cpu.baseFreqGhz.toFixed(1)} GHz</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {cpu.cores.map((core) => {
              const barWidth = `${Math.min(100, core.usage)}%`;
              return (
                <div key={core.id} className="flex items-center justify-between space-x-2">
                  <span className="text-gray-400 w-5 font-bold">{core.label}</span>

                  <div className="flex-1 h-3 bg-[#11141c] rounded-sm border border-[#232a38] overflow-hidden relative">
                    <div
                      style={{ width: barWidth }}
                      className={`h-full transition-all duration-300 ${
                        core.usage > 75
                          ? 'bg-red-500'
                          : core.usage > 50
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  <span className="w-9 text-right font-bold text-gray-200">{core.usage}%</span>
                  <span className="w-11 text-right text-cyan-400 font-semibold">{core.temp}°C</span>
                </div>
              );
            })}
          </div>

          <div className="pt-1 border-t border-[#1e2432] space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Load AVG:</span>
              <span className="text-gray-200 font-bold space-x-1">
                <span>{cpu.loadAvg[0].toFixed(2)}</span>
                <span>{cpu.loadAvg[1].toFixed(2)}</span>
                <span className="text-amber-400">{cpu.loadAvg[2].toFixed(2)}</span>
              </span>
            </div>

            {/* GPU Telemetry */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">GPU</span>
                <span className="text-emerald-500">■</span>
                <span className="text-gray-200 font-bold">{gpu.usage}%</span>
                <span className="text-cyan-400">{gpu.temp}°C</span>
              </div>
              <span className="text-[10px] text-gray-400 truncate max-w-[100px] text-right">
                {gpu.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
