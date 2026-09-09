import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  HeartPulse, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  KeyRound, 
  Sparkles,
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useDashboard();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulated terminal handshake delay for high-tech experience
    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);

      if (!success) {
        setError('Invalid username or password. Please use credentials: username 1 / password 1');
        triggerShake();
      }
    }, 450);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleQuickFill = () => {
    setUsername('1');
    setPassword('1');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Glows & Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
        
        {/* Subtle high-tech grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/30 border border-cyan-400/50 mb-3 group transition-transform hover:scale-105">
            <HeartPulse className="w-8 h-8 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white">
              SENTINEL<span className="text-cyan-400">CARE</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              v2.4
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs font-mono">
            AI-Assisted Elderly Healthcare IoT Telemetry & Emergency Command Portal
          </p>
        </div>

        {/* Login Card */}
        <div 
          className={`w-full rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/90 shadow-2xl p-6 sm:p-8 transition-all ${
            shake ? 'animate-shake border-red-500/60 shadow-red-500/20' : 'border-slate-800 hover:border-slate-700/80'
          }`}
        >
          {/* Card Header & Security Badge */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-300">
                Operator Terminal Login
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-cyan-400">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>TLS 1.3</span>
            </div>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-slate-400 font-mono">Demo Login: </span>
                <span className="text-cyan-300 font-bold font-mono">User: 1</span>
                <span className="text-slate-500 mx-1">•</span>
                <span className="text-cyan-300 font-bold font-mono">Pass: 1</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-semibold transition active:scale-95 shrink-0"
              title="Autofill username 1 and password 1"
            >
              Autofill (1 / 1)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-mono text-[11px] leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Username / Caregiver ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (1)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[10px] font-mono text-slate-500">Key: 1</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (1)"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Terminal State */}
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0 transition"
                />
                <span>Remember terminal</span>
              </label>

              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                Mesh Ready
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold font-mono tracking-wide shadow-lg shadow-cyan-600/30 border border-cyan-400/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AUTHENTICATING MESH KEY...</span>
                </>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* System Telemetry Badges */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="text-[9px] text-slate-500 uppercase">Gateway</div>
              <div className="text-[11px] font-bold text-emerald-400 mt-0.5">ESP32-Hub</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="text-[9px] text-slate-500 uppercase">3D Engine</div>
              <div className="text-[11px] font-bold text-cyan-400 mt-0.5">Three.js</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="text-[9px] text-slate-500 uppercase">AI Fall Net</div>
              <div className="text-[11px] font-bold text-indigo-400 mt-0.5">50Hz IMU</div>
            </div>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="mt-6 text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          <span>Protected Healthcare Command Network • SentinelCare AI</span>
        </div>
      </div>
    </div>
  );
};
