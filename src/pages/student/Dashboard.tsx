import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import Topography from '../../components/common/Topography';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
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

  // Upcoming tasks
  const pendingTasks = tasks.filter(t => t.published && !profile?.completedTaskIds.includes(t.id));

  return (
    <div className="space-y-8 pb-12 relative z-10">
      {/* Full Screen Topography WebGL Background Effect tuned to Olive Smoke & Chalk Cream */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 overflow-hidden">
        <Topography
          lowColor="#141412"
          midColor="#706C61"
          highColor="#EFE9DC"
          speed={0.25}
          morphAmount={3.0}
          morphSpeed={0.04}
          bands={2.8}
          thickness={0.012}
          scale={1.1}
          glow={0.6}
          colorMode="elevation"
          contrast={2.8}
          brightness={1.1}
          fillBands={false}
          opacity={0.9}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseRadius={0.35}
          mouseStrength={0.5}
        />
      </div>

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1c1c19]/95 via-[#242420]/95 to-[#181816]/95 border border-[#706C61]/50 p-6 sm:p-8 rounded-lg shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#706C61]/20 blur-3xl pointer-events-none rounded-full" />
        <div className="space-y-1.5 z-10">
          <div className="font-mono text-xs text-[#EFE9DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#EFE9DC] animate-ping" />
            <span>NEURA LINKS CLUB • STUDENT DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-normal text-[#EFE9DC] tracking-wide drop-shadow-md flex flex-wrap items-baseline gap-x-2.5">
            <span className="font-italic-serif italic font-normal text-[#EFE9DC] inline-block leading-none">Welcome</span>
            <span className="font-combo-sans font-bold text-[#EFE9DC] inline-block leading-none">back, {currentUser?.name || 'Student'}</span>
          </h1>
          <p className="text-sm text-[#EFE9DC]/90 font-sans max-w-xl">
            Ready to advance your AI engineering skills today?
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto z-10">
          <div className="bg-[#141412] border border-[#706C61]/50 px-4 py-2 rounded-md flex items-center space-x-3">
            <Flame className="w-5 h-5 text-[#EFE9DC] fill-[#EFE9DC]" />
            <div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Streak</div>
              <div className="font-mono text-xs font-bold text-[#EFE9DC]">{profile?.streak || 0} Days</div>
            </div>
          </div>

          <Link
            to="/learning"
            className="bg-[#706C61] hover:bg-[#858074] text-[#EFE9DC] border border-[#EFE9DC]/40 font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md transition-all shadow-[0_0_20px_rgba(112,108,97,0.4)] flex items-center space-x-2 cursor-pointer"
          >
            <span>Learning Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Progress Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Level */}
        <Card className="space-y-3 border-[#674846]/40 bg-[#1e1e1e]/90">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-[#FFF8DC]/70 uppercase tracking-wider">Current Level</span>
            <Layers className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-cornsilk text-2xl font-normal text-[#FFF8DC] tracking-wide uppercase">
            {profile?.levelTitle || 'LEVEL 01 — PYTHON'}
          </div>
          <Badge variant="rose">Level 0{profile?.level || 1}</Badge>
        </Card>

        {/* XP Progress */}
        <Card className="space-y-3 border-[#674846]/40 bg-[#1e1e1e]/90">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-[#FFF8DC]/70 uppercase tracking-wider">XP Earned</span>
            <Zap className="w-4 h-4 text-[#FFF8DC] fill-[#FFF8DC]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#FFF8DC]">
            {currentXP.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ {maxLevelXP.toLocaleString()} XP</span>
          </div>
          <ProgressBar progress={xpPercent} color="cornsilk" showPercentage />
        </Card>

        {/* Completed Modules & Lessons */}
        <Card className="space-y-3 border-[#674846]/40 bg-[#1e1e1e]/90">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-[#FFF8DC]/70 uppercase tracking-wider">Completed Modules</span>
            <BookOpen className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#FFF8DC]">
            {profile?.completedModuleIds.length || 0} <span className="text-xs text-gray-400 font-normal">Modules</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {completedLessons} Lessons finished
          </div>
        </Card>

        {/* Tasks & Projects */}
        <Card className="space-y-3 border-[#674846]/40 bg-[#1e1e1e]/90">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-[#FFF8DC]/70 uppercase tracking-wider">Tasks & Projects</span>
            <Trophy className="w-4 h-4 text-[#FFF8DC]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#FFF8DC]">
            {completedTasks + completedProjects} <span className="text-xs text-gray-400 font-normal">Done</span>
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
            <Card className="border-[#674846]/60 bg-gradient-to-br from-[#1e1718] to-[#1c181a] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#674846]/30 blur-2xl pointer-events-none rounded-full" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#FFF8DC] uppercase tracking-widest font-bold">
                  CURRENT MODULE
                </span>
                <Badge variant="rose">{activeModule.difficulty}</Badge>
              </div>

              <div>
                <h3 className="font-cornsilk text-2xl font-normal text-[#FFF8DC] tracking-wide">
                  "{activeModule.title}"
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {activeModule.description}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <ProgressBar progress={68} color="cornsilk" showPercentage />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-gray-400">Est duration: {activeModule.duration}</span>
                <button
                  onClick={() => navigate(`/learning/${activeModule.id}`)}
                  className="bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 font-heading text-xs uppercase tracking-wider font-bold py-2 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(103,72,70,0.4)] flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue Learning →</span>
                </button>
              </div>
            </Card>
          )}



          {/* Upcoming Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#674846]/40 pb-2">
              <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#FFF8DC]" />
                <span>Upcoming Tasks</span>
              </h2>
              <Link to="/tasks" className="font-mono text-xs text-[#FFF8DC] hover:underline font-bold">
                View All Tasks →
              </Link>
            </div>

            <div className="space-y-3">
              {pendingTasks.slice(0, 2).map((t) => (
                <div key={t.id} className="p-4 bg-[#161616] border border-[#674846]/40 hover:border-[#FFF8DC]/50 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                  <div className="space-y-1">
                    <div className="font-heading text-sm font-bold text-[#FFF8DC] tracking-wide">{t.title}</div>
                    <div className="text-xs text-gray-300">{t.description}</div>
                    <div className="flex items-center space-x-3 pt-1 text-[11px] font-mono text-gray-400">
                      <span className="text-[#FFF8DC] font-bold">+{t.xpReward} XP</span>
                      <span>•</span>
                      <span>Due: {t.deadline}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/tasks')}
                    className="bg-[#674846] hover:bg-[#7e5957] border border-[#FFF8DC]/30 text-[#FFF8DC] font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded-md transition-all self-start sm:self-auto cursor-pointer"
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
            <div className="flex items-center space-x-2 border-b border-[#674846]/40 pb-2">
              <Megaphone className="w-5 h-5 text-[#FFF8DC]" />
              <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase">
                Announcements
              </h2>
            </div>

            <div className="space-y-3">
              {announcements.filter(a => a.published).slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-4 bg-[#161616] border border-[#674846]/40 rounded-md space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-[#FFF8DC] uppercase font-bold">
                      {ann.author}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">{ann.createdAt}</span>
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[#FFF8DC] tracking-wide">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#674846]/40 pb-2">
              <Activity className="w-5 h-5 text-[#FFF8DC]" />
              <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#161616] border border-[#674846]/40 rounded-md flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#FFF8DC]" />
                <div>
                  <div className="text-[#FFF8DC]">Linear Regression Task Approved</div>
                  <div className="text-[10px] text-gray-400">+50 XP Awarded by Admin</div>
                </div>
              </div>

              <div className="p-3 bg-[#161616] border border-[#674846]/40 rounded-md flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#FFF8DC]" />
                <div>
                  <div className="text-[#FFF8DC]">Achievement Unlocked: Python Starter</div>
                  <div className="text-[10px] text-gray-400">+100 XP Bonus</div>
                </div>
              </div>

              <div className="p-3 bg-[#161616] border border-[#674846]/40 rounded-md flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#674846]" />
                <div>
                  <div className="text-[#FFF8DC]">Lesson Completed: NumPy Vectors</div>
                  <div className="text-[10px] text-gray-400">+20 XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
