import React from 'react';

interface TerminalBorderBoxProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  headerRight?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  className?: string;
  borderColor?: string;
}

export const TerminalBorderBox: React.FC<TerminalBorderBoxProps> = ({
  children,
  title,
  headerRight,
  footerLeft,
  footerRight,
  className = '',
  borderColor = 'border-[#3b4252]',
}) => {
  return (
    <div
      className={`relative flex flex-col bg-[#0c0e14]/90 border rounded-sm ${borderColor} text-[#d8dee9] font-mono text-xs select-none overflow-hidden ${className}`}
    >
  
      {(title || headerRight) && (
        <div className="flex items-center justify-between px-2 py-0.5 border-b border-[#232834] bg-[#10131a] select-none text-[11px] tracking-wide">
          <div className="flex items-center space-x-2 text-gray-300 font-semibold">
            {title}
          </div>
          {headerRight && (
            <div className="flex items-center space-x-2 text-gray-400">
              {headerRight}
            </div>
          )}
        </div>
      )}

      <div className="relative flex-1 p-2 overflow-hidden flex flex-col">
        {children}
      </div>

      {(footerLeft || footerRight) && (
        <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#232834] bg-[#0e1117] text-[10px] text-gray-400">
          <div>{footerLeft}</div>
          <div>{footerRight}</div>
        </div>
      )}
    </div>
  );
};
