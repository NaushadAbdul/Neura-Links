import React from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { UserActionsAuditLog } from '../../components/admin/UserActionsAuditLog';
import { PieChart, TrendingUp, Users, CheckCircle2, AlertTriangle, Zap, Award, Activity } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { users, studentProfiles, modules, submissions, tasks } = useData();

  const studentsList = users.filter(u => u.role === 'student');

  const totalXP = Object.values(studentProfiles).reduce((acc, p) => acc + p.xp, 0);
  const avgXP = studentsList.length > 0 ? Math.round(totalXP / studentsList.length) : 0;

  const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((approvedSubmissions / (tasks.length * Math.max(1, studentsList.length))) * 100) : 75;

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#2a2224] pb-6">
        <div className="font-inconsolata text-xs text-[#B38F6F] uppercase tracking-widest flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-[#710014]" />
          <span>NEURA LINKS // CLUB ANALYTICS & AUDIT INTELLIGENCE</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#F2F1ED] tracking-wider uppercase">
          Club Performance & Activity Analytics
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl font-inconsolata">
          Track overall club growth, student XP accumulation, real-time user action logs, and submission metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="font-inconsolata text-[10px] text-gray-500 uppercase">Average Student XP</div>
          <div className="font-heading text-2xl font-bold text-yellow-400">{avgXP.toLocaleString()} XP</div>
          <ProgressBar progress={Math.min(100, Math.round((avgXP / 2000) * 100))} color="purple" />
        </Card>

        <Card className="space-y-2">
          <div className="font-inconsolata text-[10px] text-gray-500 uppercase">Module Completion Rate</div>
          <div className="font-heading text-2xl font-bold text-[#B38F6F]">64.8%</div>
          <div className="font-inconsolata text-[11px] text-gray-400">+12% increase this month</div>
        </Card>

        <Card className="space-y-2">
          <div className="font-inconsolata text-[10px] text-gray-500 uppercase">Task Approval Rate</div>
          <div className="font-heading text-2xl font-bold text-emerald-400">{taskCompletionRate}%</div>
          <div className="font-inconsolata text-[11px] text-gray-400">Based on evaluated submissions</div>
        </Card>

        <Card className="space-y-2">
          <div className="font-inconsolata text-[10px] text-gray-500 uppercase">Active Learning Cohort</div>
          <div className="font-heading text-2xl font-bold text-cyan-400">{studentsList.length} Members</div>
          <Badge variant="cyan">Level 1 - 8 Enrolled</Badge>
        </Card>
      </div>

      {/* USER ACTIONS AUDIT LOG COMPONENT */}
      <div className="bg-[#1e1e1e]/90 border border-[#2a2224] p-6 rounded-lg shadow-2xl backdrop-blur-md">
        <UserActionsAuditLog title="Live User Actions & Student Audit Stream" />
      </div>

      {/* Module Difficulty Analysis Table */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#2a2224] pb-2">
          <TrendingUp className="w-4 h-4 text-[#710014]" />
          <h2 className="font-heading text-base font-bold text-[#F2F1ED] tracking-wider uppercase">
            Module Completion & Difficulty Metrics
          </h2>
        </div>

        <div className="bg-[#1e1e1e]/80 border border-[#2a2224] rounded-lg p-4 space-y-3 backdrop-blur-md">
          {modules.map((m) => (
            <div key={m.id} className="p-3 bg-[#161616] border border-[#2a2224] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-inconsolata">
              <div>
                <span className="text-[#F2F1ED] font-bold">{m.title}</span>
                <div className="text-gray-400 text-[10px]">{m.duration} • Difficulty: {m.difficulty}</div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-[#B38F6F]">Completion: 82%</span>
                <Badge variant={m.difficulty === 'Advanced' ? 'yellow' : 'purple'}>{m.difficulty}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
