import React, { useRef, useEffect } from 'react';
import { FilterOptions, ProcessItemData, SortColumn, SortDirection } from '../../types';
import { MetricFormatters } from '../../utils/formatters';

interface ProcessPanelProps {
  processes: ProcessItemData[];
  totalCount: number;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  selectedPids: Set<number>;
  onToggleSelectPid: (pid: number) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSortChange: (col: SortColumn) => void;
  filterOptions: FilterOptions;
  onToggleFilterFlag: (flag: keyof FilterOptions) => void;
  onOpenFilterInput: () => void;
  isFilterInputActive: boolean;
  filterQuery: string;
  onFilterQueryChange: (q: string) => void;
  onCloseFilterInput: () => void;
  onOpenInfo: () => void;
  onOpenTerminate: () => void;
}

export const ProcessPanel: React.FC<ProcessPanelProps> = ({
  processes,
  totalCount,
  selectedIndex,
  onSelectIndex,
  selectedPids,
  onToggleSelectPid,
  sortColumn,
  sortDirection,
  onSortChange,
  filterOptions,
  onToggleFilterFlag,
  onOpenFilterInput,
  isFilterInputActive,
  filterQuery,
  onFilterQueryChange,
  onCloseFilterInput,
  onOpenInfo,
  onOpenTerminate,
}) => {
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const filterInputRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    if (isFilterInputActive && filterInputRef.current) {
      filterInputRef.current.focus();
    }
  }, [isFilterInputActive]);

  
  useEffect(() => {
    if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="flex flex-col h-full bg-[#0b0d13] border border-[#2b3342] rounded p-2 text-mono text-xs select-none overflow-hidden">
      
      <div className="flex items-center justify-between border-b border-[#1c222d] pb-1.5 mb-1 text-[11px]">
        
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 font-bold tracking-wider">proc</span>

          {isFilterInputActive ? (
            <div className="flex items-center space-x-1 bg-[#121620] px-1.5 py-0.5 rounded border border-cyan-500">
              <span className="text-cyan-400 font-bold">/</span>
              <input
                ref={filterInputRef}
                type="text"
                value={filterQuery}
                onChange={(e) => onFilterQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' || e.key === 'Enter') {
                    onCloseFilterInput();
                  }
                }}
                placeholder="filter by name, pid, user..."
                className="bg-transparent text-gray-100 outline-none text-xs w-36 placeholder-gray-500"
              />
              <button
                onClick={onCloseFilterInput}
                className="text-gray-400 hover:text-white px-1 font-bold text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenFilterInput}
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#13161f] hover:bg-[#1c212e] border border-[#242b38] text-gray-300 hover:text-white cursor-pointer"
              title="Filter processes (Press 'f' or '/')"
            >
              <span className="text-cyan-400 font-bold">f</span>
              <span>ilter</span>
              {filterQuery && (
                <span className="text-amber-400 font-bold truncate max-w-[80px]">
                  : {filterQuery}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
          <button
            onClick={() => onToggleFilterFlag('perCore')}
            className={`px-1 py-0.5 rounded cursor-pointer ${
              filterOptions.perCore ? 'text-cyan-400 bg-[#161f2c] font-bold' : 'hover:text-gray-200'
            }`}
          >
            per-core
          </button>

          <button
            onClick={() => onToggleFilterFlag('reverse')}
            className={`px-1 py-0.5 rounded cursor-pointer ${
              filterOptions.reverse ? 'text-amber-400 bg-[#241f16] font-bold' : 'hover:text-gray-200'
            }`}
            title="Toggle reverse order (Press 'r')"
          >
            <span className="text-amber-300">r</span>everse
          </button>

          <button
            onClick={() => onToggleFilterFlag('showTree')}
            className={`px-1 py-0.5 rounded cursor-pointer ${
              filterOptions.showTree ? 'text-emerald-400 bg-[#15231c] font-bold' : 'hover:text-gray-200'
            }`}
            title="Toggle tree view (Press 'e')"
          >
            <span className="text-emerald-300">t</span>ree
          </button>

          <button
            onClick={() => onToggleFilterFlag('onlyUserProcesses')}
            className={`px-1 py-0.5 rounded cursor-pointer ${
              filterOptions.onlyUserProcesses ? 'text-purple-400 bg-[#22172a] font-bold' : 'hover:text-gray-200'
            }`}
          >
            services
          </button>

          <button
            onClick={() => onToggleFilterFlag('lazyMode')}
            className={`px-1 py-0.5 rounded cursor-pointer flex items-center space-x-0.5 ${
              filterOptions.lazyMode ? 'text-amber-400 bg-[#221a14] font-bold' : 'hover:text-gray-200'
            }`}
            title="Toggle CPU lazy mode"
          >
            <span>&lt; cpu lazy &gt;</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-[#212734] text-gray-400 font-semibold bg-[#0e1118]">
              <th
                onClick={() => onSortChange('pid')}
                className="py-1 px-1.5 w-16 cursor-pointer hover:text-white"
              >
                Pid: {sortColumn === 'pid' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
              <th
                onClick={() => onSortChange('name')}
                className="py-1 px-1.5 w-32 cursor-pointer hover:text-white"
              >
                Program: {sortColumn === 'name' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
              <th
                onClick={() => onSortChange('command')}
                className="py-1 px-1.5 cursor-pointer hover:text-white"
              >
                Command: {sortColumn === 'command' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
              <th
                onClick={() => onSortChange('threads')}
                className="py-1 px-1.5 w-16 text-right cursor-pointer hover:text-white"
              >
                Threads: {sortColumn === 'threads' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
              <th
                onClick={() => onSortChange('user')}
                className="py-1 px-1.5 w-20 cursor-pointer hover:text-white"
              >
                User: {sortColumn === 'user' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
              <th
                onClick={() => onSortChange('mem')}
                className="py-1 px-1.5 w-16 text-right cursor-pointer hover:text-white"
              >
                MemB {sortColumn === 'mem' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
              <th
                onClick={() => onSortChange('cpu')}
                className="py-1 px-1.5 w-20 text-right cursor-pointer hover:text-white"
              >
                Cpu% {sortColumn === 'cpu' && (sortDirection === 'desc' ? '▼' : '▲')}
              </th>
            </tr>
          </thead>
        </table>

        <div className="flex-1 overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse text-[11px]">
            <tbody>
              {processes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No active processes matching filter
                  </td>
                </tr>
              ) : (
                processes.map((proc, idx) => {
                  const isCurrentCursor = idx === selectedIndex;
                  const isMultiSelected = selectedPids.has(proc.pid);

                  const cpuBarWidth = Math.min(100, Math.round(proc.cpuPercent * 10));

                  return (
                    <tr
                      key={proc.pid}
                      ref={(el) => {
                        rowRefs.current[idx] = el;
                      }}
                      onClick={() => onSelectIndex(idx)}
                      onDoubleClick={() => onToggleSelectPid(proc.pid)}
                      className={`cursor-pointer transition-colors border-b border-[#141822] font-mono leading-tight ${
                        isCurrentCursor
                          ? 'bg-[#1b2230] text-cyan-200 font-bold'
                          : isMultiSelected
                          ? 'bg-[#1e1b2e] text-amber-200'
                          : idx % 2 === 0
                          ? 'bg-[#0a0c12] text-gray-300 hover:bg-[#121620]'
                          : 'bg-[#0c0e16] text-gray-300 hover:bg-[#121620]'
                      }`}
                    >
            
                      <td className="py-0.5 px-1.5 w-16 whitespace-nowrap text-gray-400">
                        {isCurrentCursor && <span className="text-cyan-400 mr-1">▶</span>}
                        {proc.pid}
                      </td>

                     
                      <td className="py-0.5 px-1.5 w-32 font-medium truncate text-gray-200">
                        {proc.name}
                      </td>

                     
                      <td className="py-0.5 px-1.5 truncate text-gray-400 max-w-[180px]">
                        {MetricFormatters.truncate(proc.command, 34)}
                      </td>

                      
                      <td className="py-0.5 px-1.5 w-16 text-right text-gray-300">
                        {proc.threads}
                      </td>

                      
                      <td className="py-0.5 px-1.5 w-20 truncate text-gray-400">
                        {proc.user}
                      </td>

                      
                      <td className="py-0.5 px-1.5 w-16 text-right font-medium text-emerald-300">
                        {MetricFormatters.formatProcessMem(proc.memBytes)}
                      </td>

                      
                      <td className="py-0.5 px-1.5 w-20 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span
                            className={`w-7 text-right font-semibold ${
                              proc.cpuPercent > 1.0 ? 'text-amber-400' : 'text-gray-300'
                            }`}
                          >
                            {proc.cpuPercent.toFixed(1)}
                          </span>
                          <div className="w-8 h-2 bg-[#121622] rounded-xs overflow-hidden border border-[#1e2434]">
                            <div
                              style={{ width: `${cpuBarWidth}%` }}
                              className={`h-full ${
                                proc.cpuPercent > 1.5
                                  ? 'bg-red-500'
                                  : proc.cpuPercent > 0.5
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#1c222d] pt-1.5 mt-1 text-[11px] text-gray-400">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (processes[selectedIndex]) {
                onToggleSelectPid(processes[selectedIndex].pid);
              }
            }}
            className="hover:text-white flex items-center space-x-1 cursor-pointer"
            title="Select/multi-select process (Press Space or Enter)"
          >
            <span>select</span>
            <span className="text-cyan-400 font-bold">↵</span>
          </button>

          <button
            onClick={onOpenInfo}
            className="hover:text-white flex items-center space-x-1 cursor-pointer"
            title="Inspect process details (Press 'i')"
          >
            <span>info</span>
            <span className="text-amber-400 font-bold">ℹ</span>
          </button>

          <button
            onClick={onOpenTerminate}
            className="hover:text-red-400 flex items-center space-x-1 cursor-pointer"
            title="Terminate process (Press 't' or Delete)"
          >
            <span>terminate</span>
            <span className="text-red-400 font-bold">⌫</span>
          </button>
        </div>

        <div className="font-mono text-gray-400">
          <span className="text-cyan-400 font-bold">{selectedPids.size}</span>/
          <span>{totalCount}</span>
        </div>
      </div>
    </div>
  );
};
