import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  HeartPulse, 
  Lock, 
  User, 
  Mail,
  Phone,
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
  UserPlus,
  LogIn
} from 'lucide-react';

interface AuthPageProps {
  initialTab?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialTab = 'signin' }) => {
  const { login, signup, navigateTo } = useDashboard();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  
  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Sign Up States
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  
  // Common Interaction States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Sign In Handler
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = signInEmail.trim();
    if (!cleanEmail || !signInPassword) {
      setError('Please provide both your email/username and password.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulated terminal handshake delay
    setTimeout(() => {
      const success = login(cleanEmail, signInPassword);
      setIsLoading(false);

      if (!success) {
        setError('Invalid credentials. You can use preset: Email "1" / Password "1" or create a new account.');
        triggerShake();
      }
    }, 450);
  };

  // Sign Up Handler
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = signUpFullName.trim();
    const cleanEmail = signUpEmail.trim();
    const cleanPhone = signUpPhone.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      triggerShake();
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid email address.');
      triggerShake();
      return;
    }

    if (!cleanPhone) {
      setError('Please provide your phone number for emergency escalation.');
      triggerShake();
      return;
    }

    if (!signUpPassword) {
      setError('Please enter a secure password.');
      triggerShake();
      return;
    }

    if (signUpPassword.length < 3) {
      setError('Password should be at least 3 characters long.');
      triggerShake();
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match. Please re-check both fields.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = signup(cleanName, cleanEmail, cleanPhone, signUpPassword);
      setIsLoading(false);

      if (!success) {
        setError('Unable to register account. Please check your information.');
        triggerShake();
      }
    }, 550);
  };

  // Quick Autofill for testing
  const handleQuickFill = () => {
    setSignInEmail('1');
    setSignInPassword('1');
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

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
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
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
              IoT Caregiver Net
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
            AI-Assisted Elderly Fall Prevention & Medication Assurance Command Center
          </p>
        </div>

        {/* Auth Glass Card */}
        <div 
          id="auth-card"
          className={`w-full glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl relative transition-all duration-300 ${
            shake ? 'animate-shake border-red-500/50 shadow-red-500/20' : ''
          }`}
        >
          {/* Subtle top indicator glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* TWO TABS: SIGN IN | SIGN UP */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              id="tab-signin-btn"
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN</span>
            </button>
            <button
              id="tab-signup-btn"
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>SIGN UP</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex justify-between">
                  <span>Email Address</span>
                  <span className="text-[11px] text-cyan-400/80 font-normal">Or Operator ID "1"</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-email-input"
                    type="text"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="caregiver@sentinelcare.io or 1"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition font-mono"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-password-input"
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your security passkey"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                    title={showSignInPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30"
                  />
                  <span>Remember me on this terminal</span>
                </label>

                {/* Quick Autofill 1 / 1 Pill */}
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition"
                  title="Quick fill demo credentials (1 / 1)"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Autofill (1 / 1)</span>
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                id="signin-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-400/40 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AUTHENTICATING OPERATOR...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Below the form: Don't have an account? Sign Up */}
              <div className="pt-3 text-center border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setError(null);
                    }}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition font-mono ml-1"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name-input"
                    type="text"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                    placeholder="e.g. Dr. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-email-input"
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="priya.sharma@healthnet.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-phone-input"
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98765 43210 (For fall alerts & SMS)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              </div>

              {/* Password & Confirm Password in 2 columns on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Password <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="signup-password-input"
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="signup-confirm-password-input"
                      type={showSignUpConfirmPassword ? 'text' : 'password'}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition font-mono ${
                        signUpConfirmPassword && signUpPassword === signUpConfirmPassword
                          ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                          : 'border-slate-700/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                    >
                      {showSignUpConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Next step: You will configure patient elderly telemetry and link IoT devices.</span>
              </div>

              {/* Primary Create Account Button */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-400/40 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>CREATING ACCOUNT & INITIALIZING...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Below the form: Already have an account? Sign In */}
              <div className="pt-3 text-center border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setError(null);
                    }}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition font-mono ml-1"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Preset Credentials info badge for testers */}
          <div className="mt-5 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-center">
            <p className="text-[11px] font-mono text-cyan-300/80">
              Demo Access: <span className="text-white font-bold">username: 1</span> | <span className="text-white font-bold">password: 1</span>
            </p>
          </div>
        </div>

        {/* System Telemetry Badges in Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ESP32-Hub Gateway</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>3D Spatial IMU</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Fall-Risk ML Core</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyan-400" />
              <span>Password Recovery</span>
            </h3>
            
            {resetSent ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recovery instructions and temporary credentials have been sent to <span className="text-cyan-300 font-mono">{resetEmail || 'your email'}</span>.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                  Quick Demo Note: You can immediately log in with Operator ID <span className="text-white font-bold">1</span> and Password <span className="text-white font-bold">1</span>.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered caregiver email address or phone number to receive a secure terminal recovery link.
                </p>
                <div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@sentinelcare.io"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
