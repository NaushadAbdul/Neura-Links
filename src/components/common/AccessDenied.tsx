import React, { useEffect, useState } from 'react';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AccessDeniedProps {
  message?: string;
  redirectTo?: string;
  autoRedirectSeconds?: number;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You don't have permission to access this area.",
  redirectTo,
  autoRedirectSeconds = 5,
}) => {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  // Target path logic based on user role
  const targetPath = redirectTo || (role === 'admin' ? '/admin' : isAuthenticated ? '/dashboard' : '/login');
  const targetLabel = role === 'admin' ? 'Return to Admin Console' : isAuthenticated ? 'Return to Dashboard' : 'Return to Login';

  useEffect(() => {
    if (countdown <= 0) {
      navigate(targetPath, { replace: true });
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate, targetPath]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 relative overflow-hidden text-[#F2F1ED]">
      {/* Glow background effects */}
      <div className="absolute w-96 h-96 bg-[#710014]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute w-64 h-64 bg-[#B38F6F]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full bg-[#1e1e1e]/90 border border-[#710014] rounded-lg p-8 text-center space-y-6 shadow-2xl backdrop-blur-md relative z-10">
        <div className="w-16 h-16 bg-[#710014]/40 border border-[#710014] rounded-full flex items-center justify-center mx-auto text-red-400 shadow-[0_0_25px_rgba(113,0,20,0.5)]">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#710014]/50 border border-[#710014] px-3 py-1 rounded-full text-[10px] font-mono text-[#B38F6F] uppercase tracking-widest">
            <Lock className="w-3 h-3 text-[#B38F6F]" />
            <span>SECURITY GUARD ENFORCEMENT</span>
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-wider text-[#F2F1ED] uppercase">
            Access Restricted
          </h2>

          <p className="font-sans text-sm text-gray-300 leading-relaxed bg-[#161616] p-4 rounded-md border border-[#2a2224] text-left border-l-4 border-l-[#710014]">
            {message}
          </p>

          <p className="font-mono text-xs text-gray-400">
            Auto-redirecting in <span className="text-[#B38F6F] font-bold">{countdown}</span> seconds...
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(targetPath, { replace: true })}
            className="flex-1 bg-[#710014] hover:bg-[#8f0019] text-[#F2F1ED] font-heading text-xs tracking-wider uppercase py-3 px-4 rounded-md shadow-[0_0_15px_rgba(113,0,20,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer font-bold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{targetLabel}</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-[#161616] hover:bg-[#262626] border border-[#2a2224] text-gray-300 font-heading text-xs tracking-wider uppercase py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#B38F6F]" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
