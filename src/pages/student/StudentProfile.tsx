import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Trophy, Calendar, Mail, Award, Globe, Code2, Edit3, Check, X, User } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser, updateUserName } = useAuth();
  const { studentProfiles, achievements, projects } = useData();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [savingName, setSavingName] = useState(false);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const completedProjects = projects.filter(p => profile?.completedProjectIds.includes(p.id));

  const handleSaveName = async () => {
    if (!editedName.trim()) return;
    setSavingName(true);
    await updateUserName(editedName.trim());
    setSavingName(false);
    setIsEditingName(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Hero Card */}
      <div className="bg-[#111116] border border-[#1f1f28] rounded-lg p-6 md:p-8 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border-2 border-purple-500/60 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          />

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="purple">NEURA LINKS MEMBER</Badge>
              <Badge variant="cyan">{profile?.levelTitle || 'LEVEL 05'}</Badge>
            </div>

            {/* DISPLAY USER NAME / INLINE NAME EDITOR */}
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-1">
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-[#161616] border border-purple-500 text-white text-lg font-heading px-3 py-1 rounded-md outline-none font-bold"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md cursor-pointer transition-all"
                    title="Save Name"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditedName(currentUser?.name || '');
                      setIsEditingName(false);
                    }}
                    className="p-2 bg-[#252535] hover:bg-[#323245] text-gray-400 rounded-md cursor-pointer transition-all"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group">
                  <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-white tracking-wider">
                    {currentUser?.name || 'Club Student'}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedName(currentUser?.name || '');
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-purple-300 hover:bg-purple-950/40 rounded transition-all cursor-pointer"
                    title="Edit Display Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="font-mono text-xs text-gray-400 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>{currentUser?.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Joined {currentUser?.joinedDate}</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-2">
              {currentUser?.githubUrl && (
                <a
                  href={currentUser.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#181824] border border-[#272738] hover:border-purple-500 text-gray-300 hover:text-white rounded-md transition-all flex items-center space-x-2 text-xs font-mono"
                >
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>GitHub Profile</span>
                </a>
              )}
              {currentUser?.linkedinUrl && (
                <a
                  href={currentUser.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#181824] border border-[#272738] hover:border-purple-500 text-gray-300 hover:text-white rounded-md transition-all flex items-center space-x-2 text-xs font-mono"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats Badge */}
          <div className="bg-[#0a0a0e] border border-[#1f1f2a] p-4 rounded-md text-center space-y-2 min-w-[160px]">
            <div className="font-mono text-[10px] text-gray-500 uppercase">Total XP</div>
            <div className="font-mono text-2xl font-bold text-yellow-400">{profile?.xp.toLocaleString()} XP</div>
            <div className="font-mono text-[10px] text-purple-400 font-bold uppercase">{profile?.streak} Day Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#1f1f28] pb-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
            Earned Achievements & Badges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.filter(a => a.published).map((ach) => {
            const isUnlocked = profile?.unlockedAchievementIds.includes(ach.id);

            return (
              <Card
                key={ach.id}
                className={`space-y-2 ${
                  isUnlocked
                    ? 'border-purple-500/40 bg-[#14121d]'
                    : 'border-[#1f1f28] opacity-50 bg-[#0d0d12]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{ach.icon}</span>
                  {isUnlocked ? (
                    <Badge variant="purple">Unlocked ✓</Badge>
                  ) : (
                    <Badge variant="gray">Locked 🔒</Badge>
                  )}
                </div>

                <h3 className="font-heading text-sm font-bold text-white tracking-wide">
                  {ach.title}
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  {ach.description}
                </p>

                <div className="pt-2 font-mono text-[11px] text-yellow-400 font-bold">
                  +{ach.xpBonus} XP Bonus
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Major Projects Showcase */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#1f1f28] pb-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
            Completed Major Projects Showcase
          </h2>
        </div>

        {completedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedProjects.map((p) => (
              <Card key={p.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant="green">Verified Project</Badge>
                  <span className="font-mono text-xs text-yellow-400">+{p.xpReward} XP</span>
                </div>
                <h3 className="font-heading text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-gray-400">{p.description}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#111116] border border-[#1f1f28] rounded-md text-center text-gray-500 font-mono text-xs">
            No completed major projects showcase yet. Submit a project to display your verified build here.
          </div>
        )}
      </div>
    </div>
  );
};
