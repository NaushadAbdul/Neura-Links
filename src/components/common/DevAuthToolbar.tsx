import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, LogOut, ChevronUp, ChevronDown, Lock } from 'lucide-react';

/**
 * DevAuthToolbar Component
 * Development-only floating bar to quickly switch between Student, Admin, and Unauthenticated states
 * to test route guards, direct URL access, and layout rendering.
 */
export const DevAuthToolbar: React.FC = () => {
  const { role, currentUser, isAuthenticated, switchDemoRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50 font-mono text-xs shadow-2xl">
      <div className="bg-[#161616]/95 border border-[#710014] rounded-lg overflow-hidden backdrop-blur-md">
        {/* Bar Header */}
        <div 
          onClick={() => setCollapsed(!collapsed)}
          className="px-3 py-1.5 bg-[#710014]/40 hover:bg-[#710014]/60 flex items-center justify-between cursor-pointer border-b border-[#710014]/40 select-none"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#F2F1ED]">DEV MOCK AUTH</span>
            <span className="text-[10px] text-[#B38F6F] bg-[#161616] px-1.5 py-0.5 rounded border border-[#2a2224]">
              {isAuthenticated ? role?.toUpperCase() : 'LOGGED_OUT'}
            </span>
          </div>
          <button className="text-[#B38F6F] ml-2">
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Controls */}
        {!collapsed && (
          <div className="p-3 space-y-2 text-[11px]">
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
              Current URL: <span className="text-[#B38F6F]">{location.pathname}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  switchDemoRole('student');
                  navigate('/dashboard');
                }}
                className={`px-2 py-1.5 rounded flex items-center justify-center space-x-1 border transition-all ${
                  role === 'student' && isAuthenticated
                    ? 'bg-[#B38F6F]/20 text-[#B38F6F] border-[#B38F6F] font-bold'
                    : 'bg-[#1e1e1e] text-gray-300 border-[#2a2224] hover:border-[#B38F6F]'
                }`}
                title="Switch to Student Role & Go to /dashboard"
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                onClick={() => {
                  switchDemoRole('admin');
                  navigate('/admin');
                }}
                className={`px-2 py-1.5 rounded flex items-center justify-center space-x-1 border transition-all ${
                  role === 'admin' && isAuthenticated
                    ? 'bg-[#710014]/60 text-white border-[#710014] font-bold'
                    : 'bg-[#1e1e1e] text-gray-300 border-[#2a2224] hover:border-[#710014]'
                }`}
                title="Switch to Admin Role & Go to /admin"
              >
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className={`px-2 py-1.5 rounded flex items-center justify-center space-x-1 border transition-all ${
                  !isAuthenticated
                    ? 'bg-red-950/60 text-red-300 border-red-800 font-bold'
                    : 'bg-[#1e1e1e] text-gray-400 border-[#2a2224] hover:text-red-300'
                }`}
                title="Log Out (Unauthenticated)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            <div className="pt-1 border-t border-[#2a2224] text-[10px] text-gray-400 flex items-center justify-between">
              <span>Test Direct URL:</span>
              <div className="space-x-1">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-1.5 py-0.5 bg-[#1e1e1e] hover:bg-[#710014]/40 border border-[#2a2224] rounded text-gray-300"
                >
                  /admin
                </button>
                <button
                  onClick={() => navigate('/admin/students')}
                  className="px-1.5 py-0.5 bg-[#1e1e1e] hover:bg-[#710014]/40 border border-[#2a2224] rounded text-gray-300"
                >
                  /admin/students
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-1.5 py-0.5 bg-[#1e1e1e] hover:bg-[#B38F6F]/30 border border-[#2a2224] rounded text-gray-300"
                >
                  /dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
