import React from 'react';
import { NetworkMetrics } from '../../types';
import { MetricFormatters } from '../../utils/formatters';

interface NetworkPanelProps {
  network: NetworkMetrics;
}

export const NetworkPanel: React.FC<NetworkPanelProps> = ({ network }) => {
  const dl = MetricFormatters.formatSpeedWithBits(network.downloadSpeedBytes);
  const ul = MetricFormatters.formatSpeedWithBits(network.uploadSpeedBytes);

  const historyBars = Array.from({ length: 28 }, (_, i) => {
    const hasActivity = i % 3 === 0 || i > 20;
    const heightDownload = hasActivity ? ((i * 17) % 65) + 15 : 8;
    const heightUpload = hasActivity ? ((i * 23) % 55) + 10 : 6;
    return { heightDownload, heightUpload };
  });

  return (
    <div className="flex flex-col h-full bg-[#0b0d13] border border-[#2b3342] rounded p-2 text-mono text-xs select-none">
     
      <div className="flex items-center justify-between border-b border-[#1c222d] pb-1">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 font-bold tracking-wider">net</span>
          <span className="text-gray-200 font-semibold">{network.ipAddress}</span>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-gray-400">
          <span>sync</span>
          <span className="text-emerald-400 font-semibold">{network.syncMode}</span>
          <span>&lt;b {network.interfaceName} n&gt;</span>
        </div>
      </div>

      <div className="flex flex-1 items-stretch gap-3 mt-1.5 overflow-hidden">
       
        <div className="flex-1 flex flex-col justify-between bg-[#08090e] p-1.5 rounded border border-[#1a1f2a] relative overflow-hidden">
          
          <div className="text-[9px] text-gray-500 font-mono">10K</div>

          <div className="flex-1 flex items-center justify-between gap-[2px] my-1">
            {historyBars.map((bar, idx) => (
              <div key={idx} className="flex-1 h-full flex flex-col justify-center gap-[2px]">
                <div className="flex-1 flex items-end">
                  <div
                    style={{ height: `${bar.heightDownload}%` }}
                    className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-[1px] opacity-80"
                  />
                </div>
        
                <div className="flex-1 flex items-start">
                  <div
                    style={{ height: `${bar.heightUpload}%` }}
                    className="w-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-b-[1px] opacity-80"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-gray-500 font-mono">10K</div>
        </div>

        <div className="w-56 flex flex-col justify-between py-0.5 text-[11px]">
         
          <div className="space-y-0.5 border-b border-[#1c222d] pb-1">
            <div className="text-gray-400 font-bold">download</div>
            <div className="flex items-center space-x-1">
              <span className="text-cyan-400 font-bold">▼</span>
              <span className="text-gray-200 font-semibold">{dl.bytesStr}</span>
              <span className="text-gray-400 text-[10px]">{dl.bitsStr}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400 text-[10px]">
              <span className="text-cyan-500">▼</span>
              <span>Total:</span>
              <span className="text-gray-200 font-semibold">{MetricFormatters.formatBytes(network.totalDownloadedBytes, 2)}</span>
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <div className="text-gray-400 font-bold">upload</div>
            <div className="flex items-center space-x-1">
              <span className="text-purple-400 font-bold">▲</span>
              <span className="text-gray-200 font-semibold">{ul.bytesStr}</span>
              <span className="text-gray-400 text-[10px]">{ul.bitsStr}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400 text-[10px]">
              <span className="text-purple-400">▲</span>
              <span>Total:</span>
              <span className="text-gray-200 font-semibold">{MetricFormatters.formatBytes(network.totalUploadedBytes, 1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
