import { useEffect, useState } from 'react';
import { SystemDataManager, SystemSnapshot } from '../models/SystemDataManager';

export function useSystemMonitor() {
  const manager = SystemDataManager.getInstance();
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);

  useEffect(() => {
    const unsubscribe = manager.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });
    return () => unsubscribe();
  }, [manager]);

  const increaseInterval = () => manager.increaseInterval();
  const decreaseInterval = () => manager.decreaseInterval();
  const terminateProcess = (pid: number, signal: 'SIGTERM' | 'SIGKILL' = 'SIGTERM') =>
    manager.terminateProcess(pid, signal);

  return {
    snapshot,
    intervalMs: snapshot?.refreshIntervalMs ?? manager.getIntervalMs(),
    increaseInterval,
    decreaseInterval,
    terminateProcess,
  };
}
