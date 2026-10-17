import React, { useState, useMemo, useCallback } from 'react';
import { useSystemMonitor } from './hooks/useSystemMonitor';
import { useTerminalResize } from './hooks/useTerminalResize';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { TerminalHeader } from './components/Layout/TerminalHeader';
import { CpuPanel } from './components/Models/CpuPanel';
import { MemoryDiskPanel } from './components/Models/MemoryDiskPanel';
import { NetworkPanel } from './components/Models/NetworkPanel';
import { ProcessPanel } from './components/Models/ProcessPanel';
import { HelpModal } from './components/Layout/HelpModal';
import { MenuModal } from './components/Layout/MenuModal';
import { AuthModal } from './components/Auth/AuthModal';
import { ProcessInfoModal } from './components/Models/ProcessInfoModal';
import { TerminateModal } from './components/Models/TerminateModal';
import { AuthService } from './auth/AuthService';
import { ProcessFilter } from './filters/ProcessFilter';
import { ProcessSorter } from './sorting/ProcessSorter';
import { ProcessSearch } from './search/ProcessSearch';
import { AuthPage } from './pages/AuthPage';
import { FilterOptions, ProcessItemData, SortColumn, SortDirection, UserAccount } from './types';

export default function App() {
  const { snapshot, intervalMs, increaseInterval, decreaseInterval, terminateProcess } =
    useSystemMonitor();
  const dimensions = useTerminalResize();

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    AuthService.getCurrentUser()
  );

  React.useEffect(() => {
    const unsubscribe = AuthService.init((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  
  const [activePreset, setActivePreset] = useState<number>(1);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedPids, setSelectedPids] = useState<Set<number>>(new Set());

  const [sortColumn, setSortColumn] = useState<SortColumn>('cpu');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [isFilterInputActive, setIsFilterInputActive] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    query: '',
    onlyUserProcesses: false,
    showTree: false,
    perCore: false,
    reverse: false,
    lazyMode: false,
  });

  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState<boolean>(false);

  const processedList = useMemo(() => {
    if (!snapshot) return [];

    let list = [...snapshot.processes];

    if (filterQuery.trim()) {
      list = ProcessSearch.search(list, filterQuery);
    }

    list = ProcessFilter.apply(list, { ...filterOptions, query: filterQuery });

    const effectiveDirection = filterOptions.reverse
      ? sortDirection === 'desc'
        ? 'asc'
        : 'desc'
      : sortDirection;
    list = ProcessSorter.sort(list, sortColumn, effectiveDirection);

    return list;
  }, [snapshot, filterQuery, filterOptions, sortColumn, sortDirection]);

  const safeSelectedIndex = useMemo(() => {
    if (processedList.length === 0) return 0;
    return Math.max(0, Math.min(processedList.length - 1, selectedIndex));
  }, [processedList.length, selectedIndex]);

  const toggleSelectPid = useCallback((pid: number) => {
    setSelectedPids((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) {
        next.delete(pid);
      } else {
        next.add(pid);
      }
      return next;
    });
  }, []);

  const handleSortChange = useCallback((col: SortColumn) => {
    setSortColumn((prevCol) => {
      if (prevCol === col) {
        setSortDirection((prevDir) => (prevDir === 'desc' ? 'asc' : 'desc'));
        return col;
      } else {
        setSortDirection('desc');
        return col;
      }
    });
  }, []);

  const toggleFilterFlag = useCallback((flag: keyof FilterOptions) => {
    setFilterOptions((prev) => ({
      ...prev,
      [flag]: !prev[flag],
    }));
  }, []);

  const keyboardActions = useMemo(
    () => ({
      onUp: () => setSelectedIndex((prev) => Math.max(0, prev - 1)),
      onDown: () => setSelectedIndex((prev) => Math.min(processedList.length - 1, prev + 1)),
      onPageUp: () => setSelectedIndex((prev) => Math.max(0, prev - 10)),
      onPageDown: () =>
        setSelectedIndex((prev) => Math.min(processedList.length - 1, prev + 10)),
      onHome: () => setSelectedIndex(0),
      onEnd: () => setSelectedIndex(Math.max(0, processedList.length - 1)),
      onSelect: () => {
        const item = processedList[safeSelectedIndex];
        if (item) toggleSelectPid(item.pid);
      },
      onInfo: () => {
        if (processedList[safeSelectedIndex]) setIsInfoOpen(true);
      },
      onTerminate: () => {
        if (processedList[safeSelectedIndex] || selectedPids.size > 0) {
          setIsTerminateOpen(true);
        }
      },
      onFilter: () => setIsFilterInputActive(true),
      onClearOrEscape: () => {
        if (isFilterInputActive) {
          setIsFilterInputActive(false);
        } else if (filterQuery) {
          setFilterQuery('');
        } else if (isHelpOpen || isMenuOpen || isAuthOpen || isInfoOpen || isTerminateOpen) {
          setIsHelpOpen(false);
          setIsMenuOpen(false);
          setIsAuthOpen(false);
          setIsInfoOpen(false);
          setIsTerminateOpen(false);
        } else {
          setIsMenuOpen(true);
        }
      },
      onSortCpu: () => handleSortChange('cpu'),
      onSortMem: () => handleSortChange('mem'),
      onSortPid: () => handleSortChange('pid'),
      onSortName: () => handleSortChange('name'),
      onToggleReverse: () => toggleFilterFlag('reverse'),
      onToggleTree: () => toggleFilterFlag('showTree'),
      onFaster: () => decreaseInterval(),
      onSlower: () => increaseInterval(),
      onHelp: () => setIsHelpOpen((prev) => !prev),
      onMenu: () => setIsMenuOpen((prev) => !prev),
      onAuth: () => setIsAuthOpen((prev) => !prev),
      onPreset: (num: number) => setActivePreset(num),
    }),
    [
      processedList,
      safeSelectedIndex,
      selectedPids.size,
      toggleSelectPid,
      isFilterInputActive,
      filterQuery,
      isHelpOpen,
      isMenuOpen,
      isAuthOpen,
      isInfoOpen,
      isTerminateOpen,
      handleSortChange,
      toggleFilterFlag,
      decreaseInterval,
      increaseInterval,
    ]
  );

  useKeyboardNav(keyboardActions, isFilterInputActive);

  const targetProcessesToTerminate = useMemo(() => {
    if (selectedPids.size > 0) {
      return processedList.filter((p) => selectedPids.has(p.pid));
    }
    const current = processedList[safeSelectedIndex];
    return current ? [current] : [];
  }, [processedList, safeSelectedIndex, selectedPids]);

  const handleConfirmTerminate = async (pids: number[], signal: 'SIGTERM' | 'SIGKILL') => {
    for (const pid of pids) {
      await terminateProcess(pid, signal);
    }
    setSelectedPids(new Set());
  };

  if (!currentUser) {
    return <AuthPage onAuthenticated={(user) => setCurrentUser(user)} />;
  }

  if (!snapshot) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0c10] text-cyan-400 font-mono text-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest">INITIALIZING BTOP MONITOR SENSORS...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col h-screen w-screen bg-[#090b10] text-[#d8dee9] font-mono select-none overflow-hidden ${
        crtEnabled ? 'crt-overlay' : ''
      }`}
    >
      <TerminalHeader
        intervalMs={intervalMs}
        onIncreaseInterval={increaseInterval}
        onDecreaseInterval={decreaseInterval}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={currentUser}
        activePreset={activePreset}
        onSelectPreset={setActivePreset}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled((prev) => !prev)}
      />

      <main className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
    
        {activePreset === 1 && (
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <div className="h-[38%] min-h-[170px] shrink-0">
              <CpuPanel cpu={snapshot.cpu} gpu={snapshot.gpu} />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-2 overflow-hidden min-h-0">
              <div className="w-full lg:w-[42%] flex flex-col gap-2 overflow-hidden shrink-0">
                <div className="h-[52%] min-h-[140px]">
                  <MemoryDiskPanel memory={snapshot.memory} disk={snapshot.disk} />
                </div>
                <div className="flex-1 min-h-[120px]">
                  <NetworkPanel network={snapshot.network} />
                </div>
              </div>

              <div className="flex-1 min-w-0 h-full overflow-hidden">
                <ProcessPanel
                  processes={processedList}
                  totalCount={snapshot.totalProcesses}
                  selectedIndex={safeSelectedIndex}
                  onSelectIndex={setSelectedIndex}
                  selectedPids={selectedPids}
                  onToggleSelectPid={toggleSelectPid}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  filterOptions={filterOptions}
                  onToggleFilterFlag={toggleFilterFlag}
                  onOpenFilterInput={() => setIsFilterInputActive(true)}
                  isFilterInputActive={isFilterInputActive}
                  filterQuery={filterQuery}
                  onFilterQueryChange={setFilterQuery}
                  onCloseFilterInput={() => setIsFilterInputActive(false)}
                  onOpenInfo={() => setIsInfoOpen(true)}
                  onOpenTerminate={() => setIsTerminateOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {activePreset === 2 && (
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <div className="flex-1">
              <CpuPanel cpu={snapshot.cpu} gpu={snapshot.gpu} />
            </div>
            <div className="h-48 grid grid-cols-2 gap-2">
              <MemoryDiskPanel memory={snapshot.memory} disk={snapshot.disk} />
              <NetworkPanel network={snapshot.network} />
            </div>
          </div>
        )}

        {activePreset === 3 && (
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <div className="flex-1">
              <MemoryDiskPanel memory={snapshot.memory} disk={snapshot.disk} />
            </div>
            <div className="h-48">
              <NetworkPanel network={snapshot.network} />
            </div>
          </div>
        )}

        {activePreset === 4 && (
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <div className="h-28">
              <CpuPanel cpu={snapshot.cpu} gpu={snapshot.gpu} />
            </div>
            <div className="flex-1">
              <ProcessPanel
                processes={processedList}
                totalCount={snapshot.totalProcesses}
                selectedIndex={safeSelectedIndex}
                onSelectIndex={setSelectedIndex}
                selectedPids={selectedPids}
                onToggleSelectPid={toggleSelectPid}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                filterOptions={filterOptions}
                onToggleFilterFlag={toggleFilterFlag}
                onOpenFilterInput={() => setIsFilterInputActive(true)}
                isFilterInputActive={isFilterInputActive}
                filterQuery={filterQuery}
                onFilterQueryChange={setFilterQuery}
                onCloseFilterInput={() => setIsFilterInputActive(false)}
                onOpenInfo={() => setIsInfoOpen(true)}
                onOpenTerminate={() => setIsTerminateOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activePreset={activePreset}
        onSelectPreset={setActivePreset}
        intervalMs={intervalMs}
        onSetInterval={(ms) => {
          if (ms > intervalMs) increaseInterval();
          else decreaseInterval();
        }}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled((p) => !p)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={currentUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          if (!user) {
            setIsAuthOpen(false);
          }
        }}
      />

      <ProcessInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        process={processedList[safeSelectedIndex] || null}
        onTerminate={(pid, sig) => handleConfirmTerminate([pid], sig)}
      />

      <TerminateModal
        isOpen={isTerminateOpen}
        onClose={() => setIsTerminateOpen(false)}
        processes={targetProcessesToTerminate}
        onConfirmTerminate={handleConfirmTerminate}
      />
    </div>
  );
}
