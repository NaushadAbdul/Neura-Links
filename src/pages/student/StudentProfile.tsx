import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Silk } from '../../components/common/Silk';
import { Modal } from '../../components/common/Modal';
import { 
  Trophy, 
  Calendar, 
  Mail, 
  Award, 
  Globe, 
  Code2, 
  Edit3, 
  Check, 
  X, 
  Camera, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2 
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserName, updateUserAvatar, deleteAccount } = useAuth();
  const { studentProfiles, achievements, projects, deleteUserData } = useData();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileRaw = currentUser ? studentProfiles[currentUser.id] : null;
  const profile = profileRaw || {
    userId: currentUser?.id || '',
    level: 1,
    levelTitle: 'LEVEL 01 — Python Foundations',
    xp: 0,
    streak: 1,
    skills: { 'Python': 50 },
    completedModuleIds: [],
    completedLessonIds: [],
    completedTaskIds: [],
    completedProjectIds: [],
    unlockedAchievementIds: [],
  };
  const completedProjects = projects.filter(p => profile?.completedProjectIds?.includes(p.id));

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

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput.trim().toUpperCase() !== 'DELETE' || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    const currentId = currentUser?.id;
    const res = await deleteAccount();

    if (res.success) {
      if (currentId) {
        deleteUserData(currentId);
      }
      setShowDeleteModal(false);
      navigate('/login', { replace: true });
    } else {
      setDeleteError(res.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
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
            <div className="font-mono text-2xl font-bold text-[#FFF8DC]">{(profile?.xp ?? 0).toLocaleString()} XP</div>
            <div className="font-mono text-[10px] text-[#FFF8DC] font-bold uppercase">{(profile?.streak ?? 1)} Day Streak 🔥</div>
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

      {/* DANGER ZONE / ACCOUNT SETTINGS SECTION */}
      <div className="space-y-4 pt-4 border-t border-[#710014]/50">
        <div className="flex items-center space-x-2 pb-1">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h2 className="font-cornsilk text-xl font-normal text-red-400 tracking-wide uppercase">
            Danger Zone & Account Settings
          </h2>
        </div>

        <div className="bg-[#1c1214] border border-red-900/60 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-red-200 flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Delete Your Neura Links Account</span>
            </h3>
            <p className="text-xs text-gray-300 max-w-2xl font-sans">
              Permanently delete your user account, authentication profile, earned XP, achievements, and submitted project data. This action is irreversible and cannot be undone.
            </p>
          </div>

          <button
            onClick={() => {
              setConfirmInput('');
              setDeleteError(null);
              setShowDeleteModal(true);
            }}
            className="px-5 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white border border-red-700 hover:border-red-500 rounded-md font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 shrink-0 shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Danger: Confirm Account Deletion"
      >
        <form onSubmit={handleDeleteAccountSubmit} className="space-y-5">
          <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-md space-y-2">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Warning: This action is permanent!</span>
            </div>
            <p className="text-xs text-red-200/90 leading-relaxed font-sans">
              Deleting your account (<span className="font-mono font-bold text-white">{currentUser?.email}</span>) will immediately log you out and permanently remove your user record, earned XP, badges, and learning history.
            </p>
          </div>

          {deleteError && (
            <div className="p-3 bg-red-900/60 border border-red-500 text-red-100 rounded-md text-xs font-mono">
              {deleteError}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-300 font-bold uppercase">
              To confirm, type <span className="text-red-400 font-extrabold underline">DELETE</span> below:
            </label>
            <input
              type="text"
              required
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              disabled={isDeleting}
              className="w-full p-3 bg-[#141414] border border-red-900/80 focus:border-red-500 rounded-md text-sm text-white font-mono outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#2a2224]">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#282828] text-gray-300 font-mono text-xs uppercase tracking-wider rounded-md cursor-pointer transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmInput.trim().toUpperCase() !== 'DELETE' || isDeleting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Deleting Account...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete My Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

