import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { UserActionsAuditLog } from '../../components/admin/UserActionsAuditLog';
import { Users, UserCheck, UserX, Shield, Zap, Search, Plus, Award, Activity, X } from 'lucide-react';
import { User } from '../../types';

export const StudentMgmt: React.FC = () => {
  const { users, studentProfiles, updateUserStatus, assignStudentXP } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'inactive'>('ALL');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<User | null>(null);

  // Award XP Modal State
  const [xpModalStudent, setXpModalStudent] = useState<User | null>(null);
  const [xpAmount, setXpAmount] = useState<number>(100);

  const studentUsers = users.filter(u => u.role === 'student');

  // Strict single-account safeguard: Deduplicate student users by normalized lowercase email
  const uniqueStudentUsers = Array.from(
    studentUsers.reduce((map, u) => {
      const emailKey = u.email ? u.email.toLowerCase() : '';
      if (!emailKey) return map;

      if (!map.has(emailKey)) {
        map.set(emailKey, u);
      } else {
        const existing = map.get(emailKey)!;
        const existingXp = studentProfiles[existing.id]?.xp || 0;
        const currentXp = studentProfiles[u.id]?.xp || 0;
        // Keep the user record that has accumulated student XP or is Google authenticated
        if (currentXp > existingXp || (currentXp === existingXp && u.authProvider === 'google')) {
          map.set(emailKey, u);
        }
      }
      return map;
    }, new Map<string, User>()).values()
  );

  const filteredStudents = uniqueStudentUsers.filter(s => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleOpenXpModal = (student: User) => {
    setXpModalStudent(student);
    setXpAmount(100);
  };

  const handleConfirmAwardXP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xpModalStudent || !xpAmount) return;
    assignStudentXP(xpModalStudent.id, Number(xpAmount));
    setXpModalStudent(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#2a2224] pb-6">
        <div className="font-inconsolata text-xs text-[#B38F6F] uppercase tracking-widest flex items-center space-x-2">
          <Users className="w-4 h-4 text-[#710014]" />
          <span>NEURA LINKS // STUDENT ACCESS & USER ACTIONS INSPECTOR</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#F2F1ED] tracking-wider uppercase">
          Club Student Roster
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl font-inconsolata">
          Approve or revoke student access, inspect real-time user action logs (logins, completed lessons, submissions), and award XP bonuses.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="max-w-md w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search student name or email..." />
        </div>

        <div className="flex space-x-2 font-inconsolata text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-md uppercase font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-[#710014] text-[#F2F1ED]' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
            }`}
          >
            All ({studentUsers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-md uppercase font-bold transition-all cursor-pointer ${
              statusFilter === 'active' ? 'bg-[#710014] text-[#F2F1ED]' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-md uppercase font-bold transition-all cursor-pointer ${
              statusFilter === 'inactive' ? 'bg-[#710014] text-[#F2F1ED]' : 'bg-[#1e1e1e] text-gray-400 border border-[#2a2224]'
            }`}
          >
            Blocked / Pending
          </button>
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStudents.map((st) => {
            const profile = studentProfiles[st.id];

            return (
              <Card key={st.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={st.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={st.name}
                      className="w-12 h-12 rounded object-cover border border-[#B38F6F]/40"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-heading text-base font-bold text-[#F2F1ED]">{st.name}</h3>
                        {st.authProvider === 'google' ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-inconsolata font-bold bg-blue-950/80 text-blue-300 border border-blue-800 rounded">
                            GOOGLE AUTH
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[9px] font-inconsolata font-bold bg-gray-800 text-gray-300 border border-gray-700 rounded">
                            EMAIL AUTH
                          </span>
                        )}
                      </div>
                      <div className="font-inconsolata text-xs text-gray-400">{st.email}</div>
                    </div>
                  </div>

                  <Badge variant={st.status === 'active' ? 'green' : 'red'}>
                    {st.status === 'active' ? 'Approved Student' : 'Access Revoked'}
                  </Badge>
                </div>

                {/* Profile Details */}
                <div className="p-3 bg-[#161616] border border-[#2a2224] rounded-md grid grid-cols-3 gap-2 text-center font-inconsolata text-xs">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Level</div>
                    <div className="font-bold text-[#B38F6F]">LVL 0{profile?.level || 1}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Total XP</div>
                    <div className="font-bold text-yellow-400">{profile?.xp || 0} XP</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Streak</div>
                    <div className="font-bold text-emerald-400">{profile?.streak || 0} Days</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#2a2224]">
                  <button
                    onClick={() => setSelectedStudentForHistory(st)}
                    className="bg-[#161616] hover:bg-[#262626] border border-[#710014] text-[#F2F1ED] font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#B38F6F]" />
                    <span>Inspect Actions</span>
                  </button>

                  <button
                    onClick={() => handleOpenXpModal(st)}
                    className="bg-[#161616] hover:bg-[#262626] border border-[#2a2224] text-yellow-400 hover:text-yellow-300 font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Award XP</span>
                  </button>

                  {st.status === 'active' ? (
                    <button
                      onClick={() => updateUserStatus(st.id, 'inactive')}
                      className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Block</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserStatus(st.id, 'active')}
                      className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400 font-inconsolata text-sm bg-[#161616] border border-[#2a2224] rounded-md space-y-2">
          <Users className="w-8 h-8 text-[#710014] mx-auto opacity-80" />
          <div className="text-[#F2F1ED] font-bold">No Students Registered Yet</div>
          <p className="text-xs text-gray-500">As new students sign up, their accounts and profiles will automatically populate here.</p>
        </div>
      )}

      {/* AWARD XP MODAL */}
      <Modal
        isOpen={!!xpModalStudent}
        onClose={() => setXpModalStudent(null)}
        title={`Award Bonus XP — ${xpModalStudent?.name}`}
      >
        <form onSubmit={handleConfirmAwardXP} className="space-y-4">
          <div className="p-3 bg-[#161616] border border-[#2a2224] rounded text-xs font-inconsolata space-y-1">
            <div className="text-gray-400">Target Student: <span className="text-[#F2F1ED] font-bold">{xpModalStudent?.name}</span> ({xpModalStudent?.email})</div>
            <div className="text-[#B38F6F]">Current XP: {studentProfiles[xpModalStudent?.id || '']?.xp || 0} XP</div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Bonus XP Amount to Award *</span>
            </label>
            <input
              type="number"
              min={10}
              max={5000}
              step={10}
              required
              value={xpAmount}
              onChange={(e) => setXpAmount(Number(e.target.value))}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] focus:border-[#710014] rounded-md text-xs text-[#F2F1ED] font-inconsolata outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#2a2224]">
            <button
              type="button"
              onClick={() => setXpModalStudent(null)}
              className="px-4 py-2 bg-[#161616] hover:bg-[#252535] text-gray-300 font-heading text-xs uppercase tracking-wider rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#710014] hover:bg-[#90001a] text-white font-heading text-xs uppercase tracking-wider font-bold rounded-md shadow-[0_0_15px_rgba(113,0,20,0.5)] flex items-center space-x-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Grant +{xpAmount} XP</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* STUDENT USER ACTION HISTORY MODAL */}
      {selectedStudentForHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#710014] rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudentForHistory(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-md bg-[#161616] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-[#2a2224] pb-4">
              <img
                src={selectedStudentForHistory.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={selectedStudentForHistory.name}
                className="w-12 h-12 rounded object-cover border border-[#B38F6F]"
              />
              <div>
                <h2 className="font-heading text-xl font-bold text-[#F2F1ED]">
                  {selectedStudentForHistory.name} — User Action Audit
                </h2>
                <div className="font-inconsolata text-xs text-[#B38F6F]">
                  {selectedStudentForHistory.email} • Joined {selectedStudentForHistory.joinedDate}
                </div>
              </div>
            </div>

            <UserActionsAuditLog
              studentIdFilter={selectedStudentForHistory.id}
              title={`Activity History for ${selectedStudentForHistory.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
