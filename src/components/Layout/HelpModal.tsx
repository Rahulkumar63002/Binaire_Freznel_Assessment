import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '↑ / ↓ or k / j', desc: 'Navigate process list up and down' },
    { key: 'PgUp / PgDn', desc: 'Jump 10 processes' },
    { key: 'Home / End', desc: 'Jump to first or last process' },
    { key: 'Enter / Space', desc: 'Select / multi-select process' },
    { key: 'i', desc: 'Inspect selected process in detail' },
    { key: 't / Delete', desc: 'Terminate selected process (SIGTERM / SIGKILL)' },
    { key: 'f / /', desc: 'Open search / filter input' },
    { key: 'Escape', desc: 'Exit filter or close modals' },
    { key: 'c', desc: 'Sort processes by CPU%' },
    { key: 'm', desc: 'Sort processes by Memory (MemB)' },
    { key: 'p', desc: 'Sort processes by PID' },
    { key: 'n', desc: 'Sort processes by Program Name' },
    { key: 'r', desc: 'Toggle ascending / descending reverse order' },
    { key: 'e', desc: 'Toggle tree hierarchy view' },
    { key: '+ / =', desc: 'Increase refresh rate (faster polling)' },
    { key: '- / _', desc: 'Decrease refresh rate (slower polling)' },
    { key: '1, 2, 3, 4', desc: 'Switch layout presets' },
    { key: 'u', desc: 'Open Authentication / Sign-up dialog' },
    { key: 'h / ?', desc: 'Open this help dialog' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none font-mono">
      <div className="w-full max-w-lg bg-[#0c0f17] border-2 border-cyan-500/50 rounded shadow-2xl p-5 text-gray-200">
        
        <div className="flex items-center justify-between border-b border-[#232b38] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-cyan-400 font-bold tracking-wider text-sm">
              [ BTOP TERMINAL KEYBOARD SHORTCUTS ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#181d28] border border-[#2a3444] text-xs font-bold cursor-pointer"
          >
            ESC
          </button>
        </div>

        
        <div className="max-h-96 overflow-y-auto space-y-1.5 text-xs pr-1">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-1.5 rounded bg-[#11141e] border border-[#1d2330]"
            >
              <kbd className="px-2 py-0.5 rounded bg-[#19202c] border border-[#2d384c] text-cyan-300 font-bold text-[11px]">
                {sc.key}
              </kbd>
              <span className="text-gray-300 text-[11px] text-right">{sc.desc}</span>
            </div>
          ))}
        </div>

        
        <div className="mt-4 pt-3 border-t border-[#202734] flex justify-between items-center text-[11px] text-gray-400">
          <span>Responsive terminal resizing enabled</span>
          <button
            onClick={onClose}
            className="py-1 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold cursor-pointer transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
