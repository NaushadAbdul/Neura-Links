import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { BarChart3, AlertTriangle, Sparkles, TrendingUp, Zap, CheckCircle2, Flame, Award } from 'lucide-react';

export const StudentAnalyticsBoard: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentProfiles } = useData();

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  const skillsData = profile?.skills || {
    'Python': 85,
    'Data Science': 78,
    'Mathematics': 62,
    'Machine Learning': 70,
    'Deep Learning': 42,
    'GenAI': 65,
    'Agentic AI': 30,
    'AI Engineering': 50,
    'Git/GitHub': 90,
    'Deployment': 45,
  };

  // Find lowest scoring skill (Weakest) & highest scoring skill (Strength)
  const skillsArray = Object.entries(skillsData).map(([skill, score]) => ({ skill, score }));
  skillsArray.sort((a, b) => a.score - b.score);

  const weakestSkill = skillsArray[0] || { skill: 'Deep Learning', score: 42 };
  const strongestSkill = skillsArray[skillsArray.length - 1] || { skill: 'Git/GitHub', score: 90 };

  const weeklyActivity = [
    { day: 'Mon', xp: 120, tasks: 1 },
    { day: 'Tue', xp: 200, tasks: 2 },
    { day: 'Wed', xp: 80, tasks: 0 },
    { day: 'Thu', xp: 350, tasks: 3 },
    { day: 'Fri', xp: 150, tasks: 1 },
    { day: 'Sat', xp: 400, tasks: 2 },
    { day: 'Sun', xp: 240, tasks: 1 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>NEURA LINKS // LEARNING ANALYTICS & SKILL RADAR</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Student Competency Analysis
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Real-time performance metrics, multi-domain skill breakdown, automated weak area recommendations, and activity logs.
        </p>
      </div>

      {/* Top Level Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="font-mono text-[10px] text-gray-500 uppercase">Overall AI Competency</div>
          <div className="font-heading text-2xl font-bold text-white">
            {Math.round(skillsArray.reduce((acc, curr) => acc + curr.score, 0) / skillsArray.length)}%
          </div>
          <ProgressBar progress={Math.round(skillsArray.reduce((acc, curr) => acc + curr.score, 0) / skillsArray.length)} color="purple" />
        </Card>

        <Card className="space-y-2">
          <div className="font-mono text-[10px] text-gray-500 uppercase">Learning Streak</div>
          <div className="font-heading text-2xl font-bold text-amber-400 flex items-center space-x-2">
            <Flame className="w-6 h-6 fill-amber-400" />
            <span>{profile?.streak || 12} Days</span>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">Active consecutive days</div>
        </Card>

        <Card className="space-y-2">
          <div className="font-mono text-[10px] text-gray-500 uppercase">Total XP Accumulated</div>
          <div className="font-heading text-2xl font-bold text-yellow-400 flex items-center space-x-1">
            <Zap className="w-6 h-6 fill-yellow-400" />
            <span>{profile?.xp.toLocaleString() || 1840}</span>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">Level {profile?.level || 5} AI Engineer</div>
        </Card>

        <Card className="space-y-2">
          <div className="font-mono text-[10px] text-gray-500 uppercase">Average Evaluation Score</div>
          <div className="font-heading text-2xl font-bold text-emerald-400">
            94.5%
          </div>
          <div className="text-[11px] text-gray-400 font-mono">Based on admin task reviews</div>
        </Card>
      </div>

      {/* Weakness & Strength Automated Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Area Detection */}
        <div className="p-5 bg-[#140e11] border border-rose-900/50 rounded-lg space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-heading text-sm font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Weakness Identified: {weakestSkill.skill} ({weakestSkill.score}%)</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Your competency in <strong className="text-white">{weakestSkill.skill}</strong> is currently trailing behind your other technical domains.
          </p>
          <div className="p-3 bg-[#0c080a] border border-rose-950 rounded text-xs text-rose-300 font-mono space-y-1">
            <div className="font-bold uppercase text-[10px]">Recommended Action:</div>
            <div>"Complete Neural Networks & PyTorch Tensor Module 2 lessons to boost score."</div>
          </div>
        </div>

        {/* Strengths Highlight */}
        <div className="p-5 bg-[#0e1713] border border-emerald-900/50 rounded-lg space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-heading text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Top Strength: {strongestSkill.skill} ({strongestSkill.score}%)</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Strong performance detected in <strong className="text-white">{strongestSkill.skill}</strong>. You excel at version control, repo setup, and script execution.
          </p>
          <div className="p-3 bg-[#070d0a] border border-emerald-950 rounded text-xs text-emerald-300 font-mono space-y-1">
            <div className="font-bold uppercase text-[10px]">Endorsement Status:</div>
            <div>"Admin Verified • Eligible for Advanced AI Agent Project Assignment."</div>
          </div>
        </div>
      </div>

      {/* 10-Domain Skill Breakdown Bars */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#1f1f28] pb-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
            10-Domain Technical Skill Breakdown
          </h2>
        </div>

        <div className="bg-[#111116] border border-[#1f1f28] rounded-lg p-6 space-y-5">
          {skillsArray.map((item) => (
            <div key={item.skill} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-200 font-bold uppercase">{item.skill}</span>
                <span className={item.score > 70 ? 'text-purple-400 font-bold' : item.score > 50 ? 'text-cyan-400' : 'text-amber-400'}>
                  {item.score}% Competency
                </span>
              </div>
              <ProgressBar
                progress={item.score}
                color={item.score > 70 ? 'purple' : item.score > 50 ? 'cyan' : 'green'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Bar Graph */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#1f1f28] pb-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
            Weekly Learning Activity & XP Distribution
          </h2>
        </div>

        <div className="bg-[#111116] border border-[#1f1f28] rounded-lg p-6">
          <div className="flex items-end justify-between gap-2 h-48 pt-6">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="font-mono text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  +{day.xp} XP
                </div>
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-purple-900 to-purple-500 rounded-t-md transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${(day.xp / 400) * 100}%` }}
                />
                <span className="font-mono text-xs text-gray-400 font-bold uppercase">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
