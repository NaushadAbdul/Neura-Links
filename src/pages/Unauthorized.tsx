import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-red-950/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#111116] border border-red-900/40 rounded-lg p-8 text-center space-y-6 shadow-2xl relative z-10">
        <div className="w-16 h-16 bg-red-950/80 border border-red-800 rounded-full flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold tracking-wider text-red-400 uppercase">
            Access Denied
          </h2>
          <p className="text-gray-200 font-sans text-sm leading-relaxed border-l-2 border-red-500 pl-4 text-left py-1 bg-red-950/20">
            "You are not registered with NEURA LINKS BOTS CLUB. Contact your club administrator."
          </p>
          <p className="text-xs text-gray-400 text-left">
            Students must be invited and verified by the club administrator before gaining platform access.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full bg-[#1a1a24] hover:bg-[#252535] border border-[#2e2e40] text-white font-heading text-xs tracking-wider uppercase py-3 rounded-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
