import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface StudentLayoutProps {
  children?: React.ReactNode;
}

/**
 * StudentLayout Component
 * Wraps student routes with Student Navigation, Profile info, XP meter, MobileNav & Main content.
 * Only users passing StudentRoute render this layout.
 */
export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col font-sans relative z-10">
      <Navbar />
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 pb-20 md:p-8 md:pb-8 overflow-x-hidden min-h-[calc(100vh-61px)]">
          {children ? children : <Outlet />}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default StudentLayout;
