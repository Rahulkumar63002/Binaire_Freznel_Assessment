import React, { useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { firebaseConfig } from '../../auth/firebase';
import { UserAccount } from '../../types';

console.log("Firebase Project:", firebaseConfig.projectId);
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserChanged: (user: UserAccount | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      if (isSignUp) {
        const res = await AuthService.register(username, email, password);
        if (res.success && res.user) {
          setStatusMsg({ text: res.message, error: false });
          onUserChanged(res.user);
          setTimeout(() => onClose(), 1000);
        } else {
          setStatusMsg({ text: res.message, error: true });
        }
      } else {
        const res = await AuthService.login(email, password);
        if (res.success && res.user) {
          setStatusMsg({ text: res.message, error: false });
          onUserChanged(res.user);
          setTimeout(() => onClose(), 800);
        } else {
          setStatusMsg({ text: res.message, error: true });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    onUserChanged(null);
    setStatusMsg({ text: 'Signed out from Firebase.', error: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none font-mono">
      <div className="w-full max-w-md bg-[#0c0f17] border-2 border-cyan-500/70 rounded shadow-2xl p-5 text-gray-200">
        
        <div className="flex items-center justify-between border-b border-[#232b38] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-amber-400 font-bold tracking-wider text-xs sm:text-sm">
              [ FIREBASE AUTH SERVER ONLINE ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#181d28] border border-[#2a3444] text-xs font-bold cursor-pointer"
          >
            ESC
          </button>
        </div>

        
        <div className="mb-3 px-2.5 py-1.5 rounded bg-[#10141d] border border-[#202838] flex justify-between items-center text-[10px] text-gray-400">
          <span>Project: <strong className="text-gray-200">{firebaseConfig.projectId}</strong></span>
          <span className="text-emerald-400 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Firebase Connected</span>
          </span>
        </div>

        
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-3 bg-[#111622] rounded border border-emerald-500/30 text-xs space-y-1.5">
              <div className="text-emerald-400 font-bold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Session: {currentUser.username}</span>
              </div>
              <div className="text-gray-300">
                Email: <span className="text-gray-100 font-semibold">{currentUser.email}</span>
              </div>
              <div className="text-gray-400">
                Role: <span className="text-amber-400 uppercase font-semibold">{currentUser.role}</span>
              </div>
              <div className="text-gray-500 text-[10px] truncate">
                UID: {currentUser.uid}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleLogout}
                className="flex-1 py-1.5 px-3 bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-200 rounded text-xs font-bold cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-1.5 px-3 bg-[#1c2230] hover:bg-[#252e42] border border-[#323d52] text-gray-200 rounded text-xs font-bold cursor-pointer"
              >
                Return to Monitor
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            <div className="flex rounded bg-[#121622] p-1 border border-[#232a3a]">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setStatusMsg(null);
                }}
                className={`flex-1 py-1 rounded text-center font-bold cursor-pointer transition-colors ${
                  !isSignUp ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Sign In with Firebase
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setStatusMsg(null);
                }}
                className={`flex-1 py-1 rounded text-center font-bold cursor-pointer transition-colors ${
                  isSignUp ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Sign Up with Firebase
              </button>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-gray-400 font-semibold block text-[11px]">Developer Name</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. freznel_developer"
                  className="w-full bg-[#121622] border border-[#262f3f] focus:border-cyan-400 px-2.5 py-1.5 rounded text-gray-100 outline-none text-xs"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-gray-400 font-semibold block text-[11px]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. dev@gmail.com"
                className="w-full bg-[#121622] border border-[#262f3f] focus:border-cyan-400 px-2.5 py-1.5 rounded text-gray-100 outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-semibold block text-[11px]">Password (min 6 chars)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121622] border border-[#262f3f] focus:border-cyan-400 px-2.5 py-1.5 rounded text-gray-100 outline-none text-xs"
              />
            </div>

            {statusMsg && (
              <div
                className={`p-2 rounded text-[11px] border ${
                  statusMsg.error
                    ? 'bg-red-950/40 border-red-700 text-red-300'
                    : 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold cursor-pointer transition-colors"
              >
                {loading ? 'Authenticating with Firebase...' : isSignUp ? 'Create Firebase Account' : 'Authenticate with Firebase'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3 bg-[#181d28] hover:bg-[#222938] border border-[#2a3446] text-gray-300 rounded font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
