import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  FolderGit2,
  Map,
  CheckSquare,
  User,
  Users,
  BookOpenCheck,
  FolderKanban,
  GitFork,
  ListTodo,
  FileCheck,
  Trophy,
  Megaphone,
  PieChart,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { isAdmin } = useAuth();

  const studentItems = [
    { label: 'Dash', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Learn', path: '/learning', icon: BookOpen },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Resources', path: '/resources', icon: FolderGit2 },
    { label: 'Roadmap', path: '/roadmap', icon: Map },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Content', path: '/admin/modules', icon: BookOpenCheck },
    { label: 'Resources', path: '/admin/resources', icon: FolderKanban },
    { label: 'Roadmap', path: '/admin/roadmap', icon: GitFork },
    { label: 'Tasks', path: '/admin/tasks', icon: ListTodo },
    { label: 'Reviews', path: '/admin/submissions', icon: FileCheck },
    { label: 'Badges', path: '/admin/achievements', icon: Trophy },
    { label: 'Events', path: '/admin/announcements', icon: Megaphone },
    { label: 'Analytics', path: '/admin/analytics', icon: PieChart },
  ];

  const items = isAdmin ? adminItems : studentItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-lg border-t border-[#1a1a24] py-1.5 px-0.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar w-full px-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 min-w-[40px] py-1 px-0.5 rounded-md font-heading text-[8px] sm:text-[9px] tracking-tighter uppercase transition-all ${
                  isActive
                    ? 'text-[#D4C9B3] font-bold bg-[#1c1c19] border border-[#D4C9B3]/40 shadow-[0_0_8px_rgba(212,201,179,0.25)]'
                    : 'text-gray-400 hover:text-gray-200'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5" />
              <span className="truncate w-full text-center leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
