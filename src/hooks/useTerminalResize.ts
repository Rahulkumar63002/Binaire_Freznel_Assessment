import { useEffect, useState } from 'react';

export interface TerminalDimensions {
  width: number;
  height: number;
  cols: number;
  rows: number;
  isCompact: boolean; 
  isUltraCompact: boolean; 
  maxVisibleProcesses: number;
}

export function useTerminalResize(): TerminalDimensions {
  const [dimensions, setDimensions] = useState<TerminalDimensions>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    const cols = Math.floor(w / 8.5);
    const rows = Math.floor(h / 18);
    
    const maxVisibleProcesses = Math.max(6, Math.floor((h - 320) / 22));

    return {
      width: w,
      height: h,
      cols,
      rows,
      isCompact: w < 900,
      isUltraCompact: w < 640,
      maxVisibleProcesses,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cols = Math.floor(w / 8.5);
      const rows = Math.floor(h / 18);
      const maxVisibleProcesses = Math.max(6, Math.floor((h - 320) / 22));

      setDimensions({
        width: w,
        height: h,
        cols,
        rows,
        isCompact: w < 900,
        isUltraCompact: w < 640,
        maxVisibleProcesses,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}
