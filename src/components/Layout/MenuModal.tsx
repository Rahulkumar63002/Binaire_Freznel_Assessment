import React from 'react';
import { UserAccount } from '../../types';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePreset: number;
  onSelectPreset: (preset: number) => void;
  intervalMs: number;
  onSetInterval: (ms: number) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenAuth: () => void;
  user: UserAccount | null;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  activePreset,
  onSelectPreset,
  intervalMs,
  onSetInterval,
  crtEnabled,
  onToggleCrt,
  onOpenAuth,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none font-mono">
      <div className="w-full max-w-md bg-[#0c0f17] border-2 border-[#384252] rounded shadow-2xl p-5 text-gray-200">
        
        <div className="flex items-center justify-between border-b border-[#232b38] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-cyan-400 font-bold tracking-wider text-sm">
              [ BTOP TERMINAL MENU & SETTINGS ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#181d28] border border-[#2a3444] text-xs font-bold cursor-pointer"
          >
            ESC
          </button>
        </div>

      
        <div className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="text-gray-400 block text-[11px] font-semibold">LAYOUT PRESET</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 1, name: '1. Standard Full Layout' },
                { id: 2, name: '2. CPU & Thermal Focused' },
                { id: 3, name: '3. Memory & Disks Focused' },
                { id: 4, name: '4. Processes Focused' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className={`py-1.5 px-2 rounded border text-left cursor-pointer transition-colors ${
                    activePreset === p.id
                      ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-bold'
                      : 'bg-[#121620] border-[#222a38] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          
          <div className="space-y-1.5">
            <label className="text-gray-400 block text-[11px] font-semibold">REFRESH INTERVAL</label>
            <div className="flex items-center space-x-2">
              {[500, 1000, 1500, 2500, 5000].map((ms) => (
                <button
                  key={ms}
                  onClick={() => onSetInterval(ms)}
                  className={`flex-1 py-1 rounded border text-center font-bold cursor-pointer ${
                    intervalMs === ms
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                      : 'bg-[#121620] border-[#222a38] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {ms}ms
                </button>
              ))}
            </div>
          </div>

          
          <div className="space-y-1.5">
            <label className="text-gray-400 block text-[11px] font-semibold">TERMINAL EFFECTS</label>
            <button
              onClick={onToggleCrt}
              className={`w-full py-1.5 px-3 rounded border flex justify-between items-center cursor-pointer ${
                crtEnabled
                  ? 'bg-amber-950/50 border-amber-600 text-amber-300 font-bold'
                  : 'bg-[#121620] border-[#222a38] text-gray-400'
              }`}
            >
              <span>CRT Phosphor Scanlines Effect</span>
              <span>{crtEnabled ? '[ ENABLED ]' : '[ DISABLED ]'}</span>
            </button>
          </div>

          <div className="p-3 bg-[#11141e] rounded border border-[#202734] flex justify-between items-center">
            <div>
              <div className="text-gray-300 font-bold">
                User: {user ? user.username : 'Guest / Anonymous'}
              </div>
              <div className="text-[10px] text-gray-500">
                {user ? `Role: ${user.role}` : 'Sign up to register your developer account'}
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="py-1 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold cursor-pointer text-xs"
            >
              {user ? 'Account' : 'Sign Up'}
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-[#202734] pt-3">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-[#1b212c] hover:bg-[#252c3b] border border-[#2a3444] text-gray-200 rounded text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
