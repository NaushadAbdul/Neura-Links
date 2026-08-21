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
    <aside className="hidden md:flex flex-col w-64 bg-[#161616]/75 backdrop-blur-md border-r border-[#2a2224] min-h-[calc(100vh-61px)] p-4 flex-shrink-0">
      <div className="mb-4 px-3 py-2 bg-[#1e1e1e]/90 border border-[#2a2224] rounded-md flex items-center justify-between">
        <span className="font-mono text-xs text-[#B38F6F] uppercase tracking-widest">MODE</span>
        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${isAdmin ? 'bg-[#710014] text-[#F2F1ED] border border-[#710014]' : 'bg-[#1e1e1e] text-[#B38F6F] border border-[#B38F6F]/40'}`}>
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
                `flex items-center justify-between px-3.5 py-2.5 rounded-md font-heading text-xs tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-[#710014]/60 text-[#F2F1ED] border-l-2 border-[#B38F6F] font-bold shadow-[0_0_15px_rgba(113,0,20,0.4)]'
                    : 'text-gray-300 hover:text-white hover:bg-[#262626]/80'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-[#B38F6F]" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-[#710014] text-[#F2F1ED] text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info box */}
      <div className="mt-auto pt-4 border-t border-[#2a2224] text-[11px] font-mono text-gray-500">
        <div className="text-[#B38F6F]">NEURA LINKS BOTS CLUB</div>
        <div className="text-gray-500">v2.4.0 • Molten Crimson</div>
      </div>
    </aside>
  );
};
