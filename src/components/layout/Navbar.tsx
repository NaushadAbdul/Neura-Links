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
    <header className="sticky top-0 z-40 w-full bg-[#141412]/90 backdrop-blur-md border-b border-[#706C61]/30 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center space-x-3 group">
          <img
            src="/logo.jpg"
            alt="Neura Links Logo"
            className="w-9 h-9 object-cover rounded border border-[#EFE9DC]/60 group-hover:border-[#EFE9DC] group-hover:shadow-[0_0_15px_rgba(239,233,220,0.5)] transition-all"
          />
          <div>
            <div className="text-lg md:text-xl font-normal tracking-wide uppercase transition-colors flex items-center space-x-1.5">
              <span className="font-italic-serif italic text-[#EFE9DC] font-normal lowercase capitalize">Neura</span>
              <span className="font-combo-sans font-bold text-[#EFE9DC] tracking-wider">LINKS</span>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-[#EFE9DC]/70 uppercase">
              BOTS CLUB // {isAdmin ? 'ADMIN CONSOLE' : 'LEARNING PLATFORM'}
            </div>
          </div>
        </Link>

        {/* Right Action Items */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* XP & Level Meter for Students */}
          {isStudent && (
            <div className="hidden sm:flex items-center space-x-2 bg-[#1c1c19] border border-[#706C61]/40 px-3 py-2 rounded-md">
              <Zap className="w-4 h-4 text-[#EFE9DC] fill-[#EFE9DC] animate-pulse" />
              <div className="font-mono text-xs">
                <span className="text-[#EFE9DC] font-bold">{(studentProfile?.xp ?? 0).toLocaleString()} XP</span>
                <span className="text-gray-500 mx-1.5">•</span>
                <span className="text-[#EFE9DC] font-semibold">LVL 0{studentProfile?.level ?? 1}</span>
              </div>
            </div>
          )}

          {/* Notifications Bell */}
          {currentUser && (
            <button
              onClick={() => navigate(isAdmin ? '/admin/announcements' : '/notifications')}
              className="relative p-2.5 rounded-md bg-[#1c1c19] border border-[#706C61]/40 text-[#EFE9DC] hover:text-white hover:border-[#EFE9DC]/60 hover:bg-[#262622] transition-all cursor-pointer flex items-center justify-center group"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#EFE9DC] group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#706C61] border border-[#EFE9DC] text-[9px] font-mono font-bold text-[#EFE9DC] shadow-md animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2.5 bg-[#1c1c19] border border-[#706C61]/40 hover:border-[#EFE9DC]/60 p-1.5 pr-3 rounded-md transition-all cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded object-cover border border-[#EFE9DC]/40"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#EFE9DC] leading-tight">{currentUser?.name}</div>
                <div className="text-[10px] font-mono text-[#EFE9DC]/70 uppercase leading-tight">
                  {role} {isAdmin ? '⚡' : ''}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1c1c19] border border-[#706C61]/40 rounded-md shadow-2xl z-50 py-2 text-xs">
                <div className="px-3 py-2 border-b border-[#706C61]/30">
                  <div className="font-bold text-[#EFE9DC]">{currentUser?.name}</div>
                  <div className="text-[11px] text-gray-400 font-mono truncate">{currentUser?.email}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setShowRoleMenu(false); navigate(isAdmin ? '/admin' : '/dashboard'); }}
                    className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-[#222222] text-[#D4C9B3] cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#D4C9B3]" />
                    <span>{isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}</span>
                  </button>

                  <button
                    onClick={() => { setShowRoleMenu(false); navigate('/profile'); }}
                    className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-[#262626] text-[#EFE9DC] cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#EFE9DC]" />
                    <span>My Profile & Settings</span>
                  </button>
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
