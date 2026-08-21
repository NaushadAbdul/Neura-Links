import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Megaphone,
  Flame,
  Trophy,
  Activity,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentProfiles, modules, lessons, tasks, projects, announcements, submissions, achievements } = useData();
  const navigate = useNavigate();

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  // Derive progress stats
  const completedLessons = profile?.completedLessonIds.length || 0;
  const completedTasks = profile?.completedTaskIds.length || 0;
  const completedProjects = profile?.completedProjectIds.length || 0;
  const currentXP = profile?.xp || 0;
  const maxLevelXP = 2000;
  const xpPercent = Math.min(100, Math.round((currentXP / maxLevelXP) * 100));

  // Current learning module resume
  const activeModule = modules.find(m => m.published) || modules[0];

  // Assigned focus items
  const focusItems = [
    { id: 1, text: 'Complete Linear Regression & Scikit-Learn lesson', done: profile?.completedLessonIds.includes('les_ml_01_01') },
    { id: 2, text: 'Finish California Housing ML classification task', done: profile?.completedTaskIds.includes('task_01') },
    { id: 3, text: 'Watch assigned PyTorch video course resource', done: true },
    { id: 4, text: 'Submit Student Performance Prediction Project', done: profile?.completedProjectIds.includes('proj_01') },
  ];

  // Upcoming tasks
  const pendingTasks = tasks.filter(t => t.published && !profile?.completedTaskIds.includes(t.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#111118] via-[#151522] to-[#12121c] border border-[#20202e] p-6 rounded-lg shadow-xl">
        <div className="space-y-1">
          <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>NEURA LINKS CLUB • STUDENT DASHBOARD</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
            Welcome back, {currentUser?.name || 'Student'} 👋
          </h1>
          <p className="text-sm text-gray-400 font-sans">
            Ready to advance your AI engineering skills today?
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="bg-[#0b0b0f] border border-[#252535] px-4 py-2 rounded-md flex items-center space-x-3">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
            <div>
              <div className="font-mono text-[10px] text-gray-500 uppercase">Streak</div>
              <div className="font-mono text-xs font-bold text-white">{profile?.streak || 0} Days</div>
            </div>
          </div>

          <Link
            to="/learning"
            className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-2"
          >
            <span>Learning Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Progress Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Level */}
        <Card className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">Current Level</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-heading text-xl font-bold text-white tracking-widest uppercase">
            {profile?.levelTitle || 'LEVEL 01 — PYTHON'}
          </div>
          <Badge variant="purple">Level 0{profile?.level || 1}</Badge>
        </Card>

        {/* XP Progress */}
        <Card className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">XP Earned</span>
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {currentXP.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ {maxLevelXP.toLocaleString()} XP</span>
          </div>
          <ProgressBar progress={xpPercent} color="purple" showPercentage />
        </Card>

        {/* Completed Modules & Lessons */}
        <Card className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">Completed Modules</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {profile?.completedModuleIds.length || 0} <span className="text-xs text-gray-500 font-normal">Modules</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {completedLessons} Lessons finished
          </div>
        </Card>

        {/* Tasks & Projects */}
        <Card className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">Tasks & Projects</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {completedTasks + completedProjects} <span className="text-xs text-gray-500 font-normal">Done</span>
          </div>
          <div className="text-xs text-gray-400 font-mono flex items-center space-x-2">
            <span>{completedTasks} Tasks</span>
            <span>•</span>
            <span>{completedProjects} Projects</span>
          </div>
        </Card>
      </div>

      {/* Main Content Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width): Resume Learning + Priorities + Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning Resume Card */}
          {activeModule && (
            <Card className="border-purple-500/30 bg-gradient-to-br from-[#111118] to-[#161622] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl pointer-events-none rounded-full" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-purple-400 uppercase tracking-widest font-bold">
                  CURRENT MODULE
                </span>
                <Badge variant="cyan">{activeModule.difficulty}</Badge>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-white tracking-wider">
                  "{activeModule.title}"
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {activeModule.description}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <ProgressBar progress={68} color="purple" showPercentage />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-gray-400">Est duration: {activeModule.duration}</span>
                <button
                  onClick={() => navigate(`/learning/${activeModule.id}`)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-2"
                >
                  <span>Continue Learning →</span>
                </button>
              </div>
            </Card>
          )}

          {/* Today's Focus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f2a] pb-2">
              <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Today's Focus</span>
              </h2>
              <span className="font-mono text-xs text-gray-500">Admin Assigned Priorities</span>
            </div>

            <div className="space-y-2.5">
              {focusItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#111116] border border-[#1f1f28] rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className={`w-5 h-5 ${item.done ? 'text-emerald-400 fill-emerald-950' : 'text-gray-600'}`} />
                    <span className={`text-xs ${item.done ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                      {item.text}
                    </span>
                  </div>
                  {item.done ? (
                    <Badge variant="green">Completed</Badge>
                  ) : (
                    <Badge variant="purple">Priority</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f2a] pb-2">
              <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Upcoming Tasks</span>
              </h2>
              <Link to="/tasks" className="font-mono text-xs text-purple-400 hover:text-purple-300">
                View All Tasks →
              </Link>
            </div>

            <div className="space-y-3">
              {pendingTasks.slice(0, 2).map((t) => (
                <div key={t.id} className="p-4 bg-[#111116] border border-[#1f1f28] hover:border-purple-500/40 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-heading text-sm font-bold text-white tracking-wide">{t.title}</div>
                    <div className="text-xs text-gray-400">{t.description}</div>
                    <div className="flex items-center space-x-3 pt-1 text-[11px] font-mono text-gray-500">
                      <span className="text-yellow-400">+{t.xpReward} XP</span>
                      <span>•</span>
                      <span>Due: {t.deadline}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/tasks')}
                    className="bg-[#1a1a24] hover:bg-purple-900/50 border border-[#2a2a3a] text-white font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded-md transition-all self-start sm:self-auto"
                  >
                    View Task
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Announcements & Activity Stream */}
        <div className="space-y-8">
          {/* Announcements Card */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#1f1f2a] pb-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
                Announcements
              </h2>
            </div>

            <div className="space-y-3">
              {announcements.filter(a => a.published).slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-4 bg-[#111116] border border-[#1f1f28] rounded-md space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-purple-400 uppercase font-bold">
                      {ann.author}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500">{ann.createdAt}</span>
                  </div>
                  <h4 className="font-heading text-xs font-bold text-white tracking-wide">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#1f1f2a] pb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#111116] border border-[#1f1f28] rounded-md flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <div className="text-gray-200">Linear Regression Task Approved</div>
                  <div className="text-[10px] text-gray-500">+50 XP Awarded by Admin</div>
                </div>
              </div>

              <div className="p-3 bg-[#111116] border border-[#1f1f28] rounded-md flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div>
                  <div className="text-gray-200">Achievement Unlocked: Python Starter</div>
                  <div className="text-[10px] text-gray-500">+100 XP Bonus</div>
                </div>
              </div>

              <div className="p-3 bg-[#111116] border border-[#1f1f28] rounded-md flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <div>
                  <div className="text-gray-200">Lesson Completed: NumPy Vectors</div>
                  <div className="text-[10px] text-gray-500">+20 XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
