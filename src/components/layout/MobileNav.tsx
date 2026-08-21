import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  Map,
  CheckSquare,
  BarChart3,
  Users,
  FileCheck,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { isAdmin } = useAuth();

  const studentItems = [
    { label: 'Dash', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Learn', path: '/learning', icon: BookOpen },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Roadmap', path: '/roadmap', icon: Map },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Analysis', path: '/analysis', icon: BarChart3 },
  ];

  const adminItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Content', path: '/admin/modules', icon: BookOpen },
    { label: 'Reviews', path: '/admin/submissions', icon: FileCheck },
  ];

  const items = isAdmin ? adminItems : studentItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-lg border-t border-[#1a1a24] px-2 py-2">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-md font-heading text-[10px] tracking-wider uppercase transition-colors ${
                  isActive ? 'text-purple-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
