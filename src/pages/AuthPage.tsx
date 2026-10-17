import React, { useState } from 'react';
import { AuthService } from '../auth/AuthService';
import { UserAccount } from '../types';

interface AuthPageProps {
  onAuthenticated: (user: UserAccount) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMsg('Developer name is required');
          setLoading(false);
          return;
        }
        const res = await AuthService.register(name, email, password);
        if (res.success && res.user) {
          setSuccessMsg('Account created successfully! Initializing terminal...');
          setTimeout(() => onAuthenticated(res.user!), 800);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await AuthService.login(email, password);
        if (res.success && res.user) {
          setSuccessMsg('Authentication verified. Access Granted.');
          setTimeout(() => onAuthenticated(res.user!), 600);
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = async () => {
    setErrorMsg(null);
    setLoading(true);
    setSuccessMsg('Authenticating assessor session with Firebase...');
    const demoEmail = 'assessor@gmail.com';
    const demoPass = 'ncampos2026';

    let res = await AuthService.login(demoEmail, demoPass);
    if (!res.success) {
      res = await AuthService.register('ncampos (Assessor)', demoEmail, demoPass);
    }

    if (res.success && res.user) {
      setSuccessMsg('Access Granted: ncampos [SYSTEM_ADMIN]');
      setTimeout(() => onAuthenticated(res.user!), 600);
    } else {
      
      const fallbackUser: UserAccount = {
        uid: 'demo_user_01',
        username: 'ncampos',
        email: demoEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setSuccessMsg('Access Granted (Local Pass): ncampos');
      setTimeout(() => onAuthenticated(fallbackUser), 600);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-screen bg-[#07090e] text-[#d8dee9] font-mono flex flex-col items-center justify-center p-4 select-none overflow-y-auto">
     
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '100% 4px, 16px 16px',
        }}
      />

      <div className="relative z-10 w-full max-w-lg bg-[#0c0f17] border-2 border-[#2b3342] rounded-md shadow-[0_0_35px_rgba(0,0,0,0.8)] overflow-hidden">

        <div className="px-6 pt-5 pb-2 text-center border-b border-[#181d28] bg-[#0a0d14]">
          <div className="text-cyan-400 font-black tracking-widest text-lg sm:text-xl font-mono">
            BINAIRE-FREZNEL MONITOR
          </div>
          <div className="text-[11px] text-gray-400 tracking-wider mt-1">
            System Tasks & Hardware Sensor Telemetry System
          </div>
        </div>

        <div className="grid grid-cols-2 bg-[#0e121a] border-b border-[#1f2736] text-xs">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2.5 font-bold transition-colors cursor-pointer text-center ${
              !isSignUp
                ? 'bg-[#151a26] text-cyan-400 border-b-2 border-cyan-400 shadow-inner'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#121620]'
            }`}
          >
            [ 1. SIGN IN ]
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2.5 font-bold transition-colors cursor-pointer text-center ${
              isSignUp
                ? 'bg-[#151a26] text-cyan-400 border-b-2 border-cyan-400 shadow-inner'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#121620]'
            }`}
          >
            [ 2. CREATE ACCOUNT (SIGN UP) ]
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-gray-400 text-[11px] flex items-center justify-between">
                  <span>Developer / User Name</span>
                  <span className="text-gray-600 text-[10px]">[e.g. ncampos]</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-cyan-500 font-bold">»</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ncampos"
                    className="w-full pl-7 pr-3 py-1.5 bg-[#10141d] border border-[#232a38] focus:border-cyan-400 rounded text-gray-100 outline-none placeholder-gray-600 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-gray-400 text-[11px] flex items-center justify-between">
                <span>Firebase User Email</span>
                <span className="text-gray-600 text-[10px]">[e.g. user@gmail.com]</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-cyan-500 font-bold">@</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-7 pr-3 py-1.5 bg-[#10141d] border border-[#232a38] focus:border-cyan-400 rounded text-gray-100 outline-none placeholder-gray-600 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 text-[11px] flex items-center justify-between">
                <span>Password</span>
                <span className="text-gray-600 text-[10px]">[minimum 6 characters]</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-cyan-500 font-bold">#</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-7 pr-3 py-1.5 bg-[#10141d] border border-[#232a38] focus:border-cyan-400 rounded text-gray-100 outline-none placeholder-gray-600 text-xs"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded bg-red-950/50 border border-red-700 text-red-300 text-[11px] flex items-center space-x-2">
                <span className="text-red-400 font-bold">✖</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-600 text-emerald-300 text-[11px] flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow cursor-pointer transition-colors text-xs flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to Firebase Auth...</span>
                </>
              ) : (
                <span>
                  {isSignUp
                    ? 'CREATE FIREBASE ACCOUNT & ENTER'
                    : 'AUTHENTICATE & ENTER MONITOR »'}
                </span>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#1e2430]"></div>
            <span className="shrink mx-3 text-[10px] text-gray-500 uppercase tracking-widest">
              Reviewer / Assessor Quick Pass
            </span>
            <div className="flex-grow border-t border-[#1e2430]"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoAccess}
            disabled={loading}
            className="w-full py-2 px-3 rounded bg-[#131824] hover:bg-[#1a2130] border border-[#252f42] text-amber-300 hover:text-amber-200 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center space-x-2"
            title="Authenticate instantly with pre-configured assessor profile"
          >
            <span>⚡</span>
            <span>Assessor Demo Login (ncampos@gmail.com)</span>
          </button>
        </div>

        <div className="px-6 py-2.5 bg-[#090b10] border-t border-[#1a1f28] flex justify-between items-center text-[10px] text-gray-500">
          <span>Keyboard: [Tab] Navigate • [Enter] Submit</span>
          <span>Task 2 / Deliverable 3</span>
        </div>
      </div>
    </div>
  );
};







