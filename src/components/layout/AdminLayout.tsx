import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

/**
 * AdminLayout Component
 * Wraps admin routes with Admin Navbar, Admin Sidebar, CMS controls, MobileNav & Main content.
 * Only users passing AdminRoute render this layout.
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col font-sans relative z-10">
      <Navbar />
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 pb-20 md:p-8 md:pb-8 overflow-x-hidden min-h-[calc(100vh-61px)]">
          {/* Admin Header Banner for explicit visual clarity */}
          <div className="mb-4 p-3 bg-[#710014]/20 border border-[#710014]/60 rounded-md flex items-center justify-between text-xs font-mono text-[#F2F1ED]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#710014] animate-ping" />
              <span className="font-bold text-[#B38F6F]">ADMIN CONSOLE ACTIVE</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Strict Role Verification Passed</span>
            </div>
            <span className="text-[10px] text-[#B38F6F] uppercase tracking-wider hidden sm:inline">
              NEURA LINKS MANAGEMENT SYSTEM
            </span>
          </div>

          {children ? children : <Outlet />}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AdminLayout;
