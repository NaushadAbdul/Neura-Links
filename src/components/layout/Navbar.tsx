import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bell, Zap, User as UserIcon, LogOut, Shield, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { currentUser, role, isAdmin, isStudent, logout } = useAuth();
  const { studentProfiles, notifications } = useData();
  const navigate = useNavigate();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const studentProfile = currentUser ? studentProfiles[currentUser.id] : null;
  const unreadCount = notifications.filter(n => !n.read && (isStudent ? n.studentId === currentUser?.id : true)).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#161616]/90 backdrop-blur-md border-b border-[#2a2224] px-4 md:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-[#710014] border border-[#B38F6F]/50 rounded flex items-center justify-center font-heading font-black text-[#F2F1ED] group-hover:border-[#B38F6F] group-hover:shadow-[0_0_15px_rgba(113,0,20,0.5)] transition-all">
            NL
          </div>
          <div>
            <div className="font-heading text-sm md:text-base font-bold tracking-[0.18em] text-[#F2F1ED] uppercase group-hover:text-[#B38F6F] transition-colors">
              NEURA LINKS
            </div>
            <div className="font-mono text-[10px] tracking-widest text-[#B38F6F] uppercase">
              BOTS CLUB // {isAdmin ? 'ADMIN CONSOLE' : 'LEARNING PLATFORM'}
            </div>
          </div>
        </Link>

        {/* Right Action Items */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* XP & Level Meter for Students */}
          {isStudent && studentProfile && (
            <div className="hidden sm:flex items-center space-x-2 bg-[#1e1e1e] border border-[#2a2224] px-3 py-1.5 rounded-md">
              <Zap className="w-4 h-4 text-[#B38F6F] fill-[#B38F6F] animate-pulse" />
              <div className="font-mono text-xs">
                <span className="text-[#B38F6F] font-bold">{studentProfile.xp} XP</span>
                <span className="text-gray-500 mx-1.5">•</span>
                <span className="text-[#F2F1ED] font-semibold">LVL 0{studentProfile.level}</span>
              </div>
            </div>
          )}

          {/* Notifications Bell */}
          {currentUser && (
            <button
              onClick={() => navigate(isAdmin ? '/admin/announcements' : '/notifications')}
              className="relative p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#262626] transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#B38F6F]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#710014] rounded-full ring-2 ring-[#161616] animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#710014] rounded-full ring-2 ring-[#161616]" />
              )}
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2.5 bg-[#1e1e1e] border border-[#2a2224] hover:border-[#710014] p-1.5 pr-3 rounded-md transition-all cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded object-cover border border-[#B38F6F]/40"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#F2F1ED] leading-tight">{currentUser?.name}</div>
                <div className="text-[10px] font-mono text-[#B38F6F] uppercase leading-tight">
                  {role} {isAdmin ? '⚡' : ''}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] border border-[#2a2224] rounded-md shadow-2xl z-50 py-2 text-xs">
                <div className="px-3 py-2 border-b border-[#2a2224]">
                  <div className="font-bold text-[#F2F1ED]">{currentUser?.name}</div>
                  <div className="text-[11px] text-gray-400 font-mono truncate">{currentUser?.email}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setShowRoleMenu(false); navigate(isAdmin ? '/admin' : '/dashboard'); }}
                    className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-[#262626] text-[#F2F1ED] cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#B38F6F]" />
                    <span>{isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}</span>
                  </button>

                  {!isAdmin && (
                    <button
                      onClick={() => { setShowRoleMenu(false); navigate('/profile'); }}
                      className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-[#262626] text-[#F2F1ED] cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#B38F6F]" />
                      <span>My Profile</span>
                    </button>
                  )}
                </div>

                <div className="my-1 border-t border-[#2a2224]" />

                <button
                  onClick={() => { logout(); setShowRoleMenu(false); navigate('/login'); }}
                  className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-[#710014]/20 text-red-400 font-semibold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
