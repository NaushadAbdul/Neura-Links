import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  FolderGit2,
  Map,
  CheckSquare,
  BarChart3,
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
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number | null;
}

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();
  const { submissions } = useData();

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'under_review').length;

  const studentNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Learning', path: '/learning', icon: BookOpen },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Resources', path: '/resources', icon: FolderGit2 },
    { label: 'Roadmap', path: '/roadmap', icon: Map },
    { label: 'Tasks & Projects', path: '/tasks', icon: CheckSquare },
    { label: 'Analysis', path: '/analysis', icon: BarChart3 },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Content CMS', path: '/admin/modules', icon: BookOpenCheck },
    { label: 'Resources CMS', path: '/admin/resources', icon: FolderKanban },
    { label: 'Roadmap CMS', path: '/admin/roadmap', icon: GitFork },
    { label: 'Tasks & Projects', path: '/admin/tasks', icon: ListTodo },
    {
      label: 'Submissions',
      path: '/admin/submissions',
      icon: FileCheck,
      badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : null,
    },
    { label: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Club Analytics', path: '/admin/analytics', icon: PieChart },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0D0D0D]/85 backdrop-blur-md border-r border-[#D4C9B3]/20 min-h-[calc(100vh-61px)] p-4 flex-shrink-0">
      <div className="mb-4 px-3 py-2 bg-[#161616] border border-[#D4C9B3]/30 rounded-md flex items-center justify-between">
        <span className="font-mono text-xs text-[#D4C9B3]/70 uppercase tracking-widest">MODE</span>
        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${isAdmin ? 'bg-[#D4C9B3] text-[#0D0D0D] border border-[#D4C9B3]' : 'bg-[#161616] text-[#D4C9B3] border border-[#D4C9B3]/40'}`}>
          {isAdmin ? 'ADMIN CMS' : 'STUDENT'}
        </span>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-md font-bodoni text-sm tracking-wide uppercase transition-all ${
                  isActive
                    ? 'bg-[#1a1a1a] text-[#D4C9B3] border-l-2 border-[#D4C9B3] font-bold shadow-[0_0_15px_rgba(212,201,179,0.2)]'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]/80'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-[#D4C9B3]" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-[#D4C9B3] text-[#0D0D0D] text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-[#D4C9B3]/20 space-y-1 text-[11px] font-mono text-gray-400">
        <div className="flex justify-between">
          <span>Platform:</span>
          <span className="text-[#D4C9B3] font-bold">Neura Links v2.4</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="text-[#D4C9B3] font-bold">Online</span>
        </div>
      </div>
    </aside>
  );
};
