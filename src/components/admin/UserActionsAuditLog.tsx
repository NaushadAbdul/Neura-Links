import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SearchBar } from '../common/SearchBar';
import { 
  Activity, 
  LogIn, 
  BookOpen, 
  FileCheck, 
  Zap, 
  UserCheck, 
  UserX, 
  Clock, 
  Filter,
  ShieldAlert
} from 'lucide-react';

interface UserActionsAuditLogProps {
  studentIdFilter?: string;
  title?: string;
  maxItems?: number;
}

export const UserActionsAuditLog: React.FC<UserActionsAuditLogProps> = ({
  studentIdFilter,
  title = "Student Activity & User Action Audit Log",
  maxItems,
}) => {
  const { userActions } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Filter actions
  const filteredActions = userActions.filter(action => {
    if (
      action.userId === 'user_student_01' ||
      action.userId === 'user_student_02' ||
      action.userEmail === 'naushad@neuralinks.club' ||
      action.userEmail === 'rahul@neuralinks.club'
    ) return false;

    if (studentIdFilter && action.userId !== studentIdFilter) return false;
    if (typeFilter !== 'ALL' && action.actionType !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = action.userName.toLowerCase().includes(q);
      const matchesEmail = action.userEmail.toLowerCase().includes(q);
      const matchesDesc = action.description.toLowerCase().includes(q);
      return matchesName || matchesEmail || matchesDesc;
    }
    return true;
  });

  const displayList = maxItems ? filteredActions.slice(0, maxItems) : filteredActions;

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'login':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800"><LogIn className="w-3 h-3"/><span>LOGIN</span></span>;
      case 'lesson_completed':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800"><BookOpen className="w-3 h-3"/><span>LESSON</span></span>;
      case 'submission_created':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-800"><FileCheck className="w-3 h-3"/><span>SUBMISSION</span></span>;
      case 'xp_awarded':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800"><Zap className="w-3 h-3"/><span>XP BONUS</span></span>;
      case 'account_status_changed':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800"><ShieldAlert className="w-3 h-3"/><span>STATUS</span></span>;
      default:
        return <Badge variant="purple">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2224] pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-[#B38F6F]" />
          <h2 className="font-heading text-lg font-bold text-[#F2F1ED] tracking-wider uppercase">
            {title}
          </h2>
        </div>
        <div className="font-inconsolata text-xs text-[#B38F6F]">
          Showing {displayList.length} of {userActions.length} recorded actions
        </div>
      </div>

      {!studentIdFilter && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="max-w-xs w-full">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search user name, email, or action..." />
          </div>

          <div className="flex flex-wrap gap-1.5 font-inconsolata text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'ALL' ? 'bg-[#710014] text-[#F2F1ED] font-bold' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('login')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'login' ? 'bg-[#710014] text-[#F2F1ED] font-bold' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
              }`}
            >
              Logins
            </button>
            <button
              onClick={() => setTypeFilter('lesson_completed')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'lesson_completed' ? 'bg-[#710014] text-[#F2F1ED] font-bold' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
              }`}
            >
              Lessons
            </button>
            <button
              onClick={() => setTypeFilter('submission_created')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'submission_created' ? 'bg-[#710014] text-[#F2F1ED] font-bold' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setTypeFilter('xp_awarded')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'xp_awarded' ? 'bg-[#710014] text-[#F2F1ED] font-bold' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
              }`}
            >
              XP Awards
            </button>
          </div>
        </div>
      )}

      {displayList.length === 0 ? (
        <div className="p-8 bg-[#1e1e1e]/60 border border-[#2a2224] rounded-lg text-center font-inconsolata text-sm text-gray-400">
          No user actions recorded yet matching your filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayList.map((act) => (
            <div
              key={act.id}
              className="p-3.5 bg-[#1e1e1e]/90 border border-[#2a2224] hover:border-[#710014] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all backdrop-blur-md"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={act.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={act.userName}
                  className="w-9 h-9 rounded object-cover border border-[#B38F6F]/40"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-heading text-sm font-bold text-[#F2F1ED]">{act.userName}</span>
                    <span className="font-inconsolata text-xs text-gray-400">({act.userEmail})</span>
                  </div>
                  <div className="font-inconsolata text-xs text-[#B38F6F] mt-0.5">
                    {act.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2a2224]">
                {getActionBadge(act.actionType)}
                <div className="flex items-center space-x-1 font-inconsolata text-[11px] text-gray-400">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>{act.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
