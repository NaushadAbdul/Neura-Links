import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Silk } from '../../components/common/Silk';
import { Trophy, Calendar, Mail, Award, Globe, Code2, Edit3, Check, X, User, Camera, Upload } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser, updateUserName, updateUserAvatar } = useAuth();
  const { studentProfiles, achievements, projects } = useData();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const completedProjects = projects.filter(p => profile?.completedProjectIds.includes(p.id));

  const handleSaveName = async () => {
    if (!editedName.trim()) return;
    setSavingName(true);
    await updateUserName(editedName.trim());
    setSavingName(false);
    setIsEditingName(false);
  };

  const handleAvatarFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Url = e.target?.result as string;
      if (base64Url) {
        await updateUserAvatar(base64Url);
      }
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hidden File Input for PC Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Header Hero Card with Animated Silk Shader */}
      <div className="bg-[#1c1c19] border border-[#706C61]/40 rounded-lg p-6 md:p-8 relative overflow-hidden space-y-6 shadow-2xl">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <Silk
            speed={4}
            scale={1.2}
            color="#706C61"
            noiseIntensity={1.2}
            rotation={0.4}
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Picture with Hoverable Upload Camera Button */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Click to upload profile picture from your PC">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border-2 border-[#EFE9DC] shadow-xl group-hover:opacity-85 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center text-[#EFE9DC] text-xs font-mono font-bold space-y-1">
              <Camera className="w-6 h-6 text-[#EFE9DC]" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 bg-[#706C61] border border-[#EFE9DC] text-[#EFE9DC] p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="rose">NEURA LINKS MEMBER</Badge>
              <Badge variant="cornsilk">{profile?.levelTitle || 'LEVEL 05'}</Badge>
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
                    className="bg-[#161616] border border-[#FFF8DC] text-[#FFF8DC] text-lg font-cornsilk px-3 py-1 rounded-md outline-none"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="p-2 bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 rounded-md cursor-pointer transition-all"
                    title="Save Name"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditedName(currentUser?.name || '');
                      setIsEditingName(false);
                    }}
                    className="p-2 bg-[#1e1e1e] hover:bg-[#262626] text-gray-400 rounded-md cursor-pointer transition-all"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group">
                  <h1 className="font-cornsilk text-3xl md:text-5xl font-normal text-[#FFF8DC] tracking-wide">
                    {currentUser?.name || 'Club Student'}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedName(currentUser?.name || '');
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-[#FFF8DC] rounded transition-all cursor-pointer"
                    title="Edit Display Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="font-mono text-xs text-gray-400 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-[#FFF8DC]" />
                <span>{currentUser?.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#FFF8DC]" />
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
                  className="p-2 bg-[#161616] border border-[#674846]/50 hover:border-[#FFF8DC] text-[#FFF8DC] rounded-md transition-all flex items-center space-x-2 text-xs font-mono"
                >
                  <Code2 className="w-4 h-4 text-[#FFF8DC]" />
                  <span>GitHub Profile</span>
                </a>
              )}
              {currentUser?.linkedinUrl && (
                <a
                  href={currentUser.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#161616] border border-[#674846]/50 hover:border-[#FFF8DC] text-[#FFF8DC] rounded-md transition-all flex items-center space-x-2 text-xs font-mono"
                >
                  <Globe className="w-4 h-4 text-[#FFF8DC]" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats Badge */}
          <div className="bg-[#161616] border border-[#674846]/50 p-4 rounded-md text-center space-y-2 min-w-[160px]">
            <div className="font-mono text-[10px] text-gray-400 uppercase">Total XP</div>
            <div className="font-mono text-2xl font-bold text-[#FFF8DC]">{profile?.xp.toLocaleString()} XP</div>
            <div className="font-mono text-[10px] text-[#FFF8DC] font-bold uppercase">{profile?.streak} Day Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#674846]/40 pb-2">
          <Trophy className="w-5 h-5 text-[#FFF8DC]" />
          <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase">
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
                    ? 'border-[#FFF8DC]/60 bg-[#1c1817]'
                    : 'border-[#3b2827] opacity-50 bg-[#161616]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{ach.icon}</span>
                  {isUnlocked ? (
                    <Badge variant="cornsilk">Unlocked ✓</Badge>
                  ) : (
                    <Badge variant="gray">Locked 🔒</Badge>
                  )}
                </div>

                <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC] tracking-wide">
                  {ach.title}
                </h3>
                <p className="text-xs text-gray-300 font-sans">
                  {ach.description}
                </p>

                <div className="pt-2 font-mono text-[11px] text-[#FFF8DC] font-bold">
                  +{ach.xpBonus} XP Bonus
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Major Projects Showcase */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#674846]/40 pb-2">
          <Award className="w-5 h-5 text-[#FFF8DC]" />
          <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase">
            Completed Major Projects Showcase
          </h2>
        </div>

        {completedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedProjects.map((p) => (
              <Card key={p.id} className="space-y-3 border-[#674846]/40 bg-[#161616]">
                <div className="flex justify-between items-center">
                  <Badge variant="cornsilk">Verified Project</Badge>
                  <span className="font-mono text-xs text-[#FFF8DC]">+{p.xpReward} XP</span>
                </div>
                <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC]">{p.title}</h3>
                <p className="text-xs text-gray-300">{p.description}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#161616] border border-[#674846]/40 rounded-md text-center text-gray-400 font-mono text-xs">
            No completed major projects showcase yet. Submit a project to display your verified build here.
          </div>
        )}
      </div>
    </div>
  );
};
