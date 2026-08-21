import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, ArrowRight, Lock, Sparkles, Code2, BrainCircuit, Mail, KeyRound, UserPlus, LogIn, MailCheck, RotateCcw, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Hyperspeed, { DEFAULT_EFFECT_OPTIONS } from '../components/common/Hyperspeed';

export const Landing: React.FC = () => {
  const { currentUser, isAuthenticated, isAdmin, loginWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (isAdmin || currentUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, isAdmin, navigate]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Email Verification Screen State
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle();
    setGoogleLoading(false);
    if (res.success) {
      const tabSaved = sessionStorage.getItem('nlbc_tab_user');
      const savedUser = tabSaved || localStorage.getItem('nlbc_current_user');
      const userRole = savedUser ? JSON.parse(savedUser)?.role : (isAdmin ? 'admin' : 'student');
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else if (res.message) {
      setErrorMsg(res.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    let res;
    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        setLoading(false);
        return;
      }
      res = await signUpWithEmail(email, password, fullName.trim());
    } else {
      res = await signInWithEmail(email, password);
    }

    setLoading(false);

    if (res.success) {
      const tabSaved = sessionStorage.getItem('nlbc_tab_user');
      const savedUser = tabSaved || localStorage.getItem('nlbc_current_user');
      const userRole = savedUser ? JSON.parse(savedUser)?.role : (isAdmin ? 'admin' : 'student');
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else if (res.requiresVerification) {
      // Show Verification Screen
      setPendingVerificationEmail(res.email || email);
    } else if (res.message) {
      setErrorMsg(res.message);
    }
  };


  // Custom Hyperspeed options matching Cornsilk (#FFF8DC) & Rose Ebony (#674846) theme
  const hyperspeedOptions = {
    ...DEFAULT_EFFECT_OPTIONS,
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    colors: {
      roadColor: 0x161616,
      islandColor: 0x1e1e1e,
      background: 0x161616,
      shoulderLines: 0x674846,
      brokenLines: 0xFFF8DC,
      leftCars: [0x674846, 0x7e5957, 0x946b69],
      rightCars: [0xFFF8DC, 0xf0e6bf, 0xe2d6a3],
      sticks: 0xFFF8DC
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-[#FFF8DC] flex flex-col justify-between relative overflow-hidden">
      {/* React Bits Hyperspeed 3D Canvas Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>

      {/* Cornsilk & Rose Ebony ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#674846]/30 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#FFF8DC]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.jpg"
            alt="Neura Links Logo"
            className="w-10 h-10 object-cover rounded border border-[#EFE9DC] shadow-[0_0_20px_rgba(239,233,220,0.4)]"
          />
          <div>
            <div className="text-lg font-normal tracking-wide uppercase flex items-center space-x-1.5">
              <span className="font-italic-serif italic text-[#EFE9DC] font-normal lowercase capitalize">Neura</span>
              <span className="font-combo-sans font-bold text-[#EFE9DC] tracking-wider">LINKS</span>
            </div>
            <div className="font-mono text-xs tracking-widest text-[#EFE9DC]/70 uppercase">
              BOTS CLUB
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col items-center text-center z-10 my-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-baron text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-wider text-[#EFE9DC] leading-tight uppercase drop-shadow-2xl">
            BUILD. LEARN. <br />
            CREATE.
          </h1>
          <p className="font-italic-serif italic text-2xl sm:text-3xl text-[#EFE9DC]/90 max-w-2xl mx-auto font-normal drop-shadow">
            "Learn AI. Build real systems. Become an AI Engineer."
          </p>
        </motion.div>

        {/* VERIFICATION SCREEN STATE */}
        {pendingVerificationEmail ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#1e1e1e]/95 border border-[#710014] p-8 rounded-lg shadow-2xl backdrop-blur-md text-center space-y-6 z-20"
          >
            <div className="w-14 h-14 bg-[#710014]/40 border border-[#B38F6F] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(113,0,20,0.5)]">
              <MailCheck className="w-7 h-7 text-[#B38F6F]" />
            </div>

            <div className="space-y-3">
              <h2 className="font-heading font-bold text-xl text-[#F2F1ED] uppercase tracking-wider">
                Email Verification Required
              </h2>
              <p className="font-inconsolata text-sm text-[#F2F1ED] bg-[#161616] p-4 rounded-md border border-[#2a2224] leading-relaxed">
                We have sent you a verification email to <span className="text-[#B38F6F] font-bold underline">{pendingVerificationEmail}</span>. Please verify it and log in.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setPendingVerificationEmail(null);
                  setIsSignUp(false);
                  setErrorMsg('');
                }}
                className="w-full bg-[#F2F1ED] hover:bg-[#e0ded8] text-[#161616] font-heading font-bold tracking-wider text-sm py-3 px-6 rounded-md shadow-[0_0_20px_rgba(242,241,237,0.2)] flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#710014]" />
                <span>Login</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* PRIMARY AUTHENTICATION CARD */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md bg-[#1e1e1e]/90 border border-[#2a2224] p-6 rounded-lg shadow-2xl backdrop-blur-md space-y-5 text-left z-20"
          >
            {/* Primary Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-[#FFF8DC] hover:bg-[#f2ebce] text-[#674846] font-heading font-bold tracking-wider text-sm py-3.5 px-6 rounded-md shadow-[0_0_25px_rgba(255,248,220,0.25)] flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Official Google Icon SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-bold">{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center space-x-3 my-2">
              <div className="flex-1 h-px bg-[#674846]/40" />
              <span className="font-inconsolata text-xs text-[#FFF8DC]/70 uppercase">OR EMAIL</span>
              <div className="flex-1 h-px bg-[#674846]/40" />
            </div>

            {/* Mode Switcher Header */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-heading font-bold text-xs text-[#FFF8DC] uppercase tracking-wider flex items-center space-x-2">
                {isSignUp ? <UserPlus className="w-3.5 h-3.5 text-[#FFF8DC]" /> : <LogIn className="w-3.5 h-3.5 text-[#674846]" />}
                <span>{isSignUp ? 'Create Account' : 'Sign In with Email'}</span>
              </h2>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                }}
                className="font-inconsolata text-xs text-[#FFF8DC] hover:text-white underline cursor-pointer"
              >
                {isSignUp ? 'Sign In instead' : 'Sign Up instead'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block font-inconsolata text-xs text-[#EFE9DC]/90 uppercase mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#EFE9DC]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      required={isSignUp}
                      className="w-full bg-[#141412] border border-[#706C61]/50 focus:border-[#EFE9DC] rounded-md py-2.5 pl-9 pr-3 text-sm text-[#EFE9DC] font-inconsolata outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-inconsolata text-xs text-[#EFE9DC]/90 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#EFE9DC]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#141412] border border-[#706C61]/50 focus:border-[#EFE9DC] rounded-md py-2.5 pl-9 pr-3 text-sm text-[#EFE9DC] font-inconsolata outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-inconsolata text-xs text-[#EFE9DC]/90 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#EFE9DC]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#141412] border border-[#706C61]/50 focus:border-[#EFE9DC] rounded-md py-2.5 pl-9 pr-3 text-sm text-[#EFE9DC] font-inconsolata outline-none transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#706C61]/80 border border-[#EFE9DC]/40 text-[#EFE9DC] text-xs rounded-md text-left font-inconsolata font-semibold">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#706C61] hover:bg-[#858074] border border-[#EFE9DC]/40 text-[#EFE9DC] font-heading font-bold tracking-wider text-xs py-3 px-6 rounded-md shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EFE9DC]" />
              </button>
            </form>

          </motion.div>
        )}

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4 text-left z-20">
          <div className="p-5 bg-[#141414]/90 border border-[#D4C9B3]/30 hover:border-[#D4C9B3] rounded-md space-y-2 transition-all backdrop-blur-md">
            <BrainCircuit className="w-6 h-6 text-[#D4C9B3]" />
            <h3 className="font-bodoni text-base font-bold tracking-wider text-[#D4C9B3] uppercase">
              AI Engineering Path
            </h3>
            <p className="text-xs text-gray-300 font-inconsolata">
              Structured modules from Python foundations to Deep Learning, LLMs, RAG, and Autonomous AI Agents.
            </p>
          </div>

          <div className="p-5 bg-[#141414]/90 border border-[#D4C9B3]/30 hover:border-[#D4C9B3] rounded-md space-y-2 transition-all backdrop-blur-md">
            <Code2 className="w-6 h-6 text-[#D4C9B3]" />
            <h3 className="font-bodoni text-base font-bold tracking-wider text-[#D4C9B3] uppercase">
              Real Submissions
            </h3>
            <p className="text-xs text-gray-300 font-inconsolata">
              Submit GitHub repositories & live apps. Receive direct admin code review, feedback, and XP.
            </p>
          </div>

          <div className="p-5 bg-[#141414]/90 border border-[#D4C9B3]/30 hover:border-[#D4C9B3] rounded-md space-y-2 transition-all backdrop-blur-md">
            <Zap className="w-6 h-6 text-[#D4C9B3]" />
            <h3 className="font-bodoni text-base font-bold tracking-wider text-[#D4C9B3] uppercase">
              Gamified Analytics
            </h3>
            <p className="text-xs text-gray-300 font-inconsolata">
              Track skill radars, learning streaks, unlocked achievements, and AI competency scores.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 border-t border-[#2a2224] text-center font-inconsolata text-xs text-gray-400 z-10">
        NEURA LINKS BOTS CLUB © 2026
      </footer>
    </div>
  );
};
