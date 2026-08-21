import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Level, Module, Lesson } from '../../types';
import {
  BookOpenCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  BookOpen,
  Video,
  FileText,
  Zap,
} from 'lucide-react';

export const ContentCMS: React.FC = () => {
  const {
    levels,
    modules,
    lessons,
    createLevel,
    updateLevel,
    deleteLevel,
    toggleLevelPublish,
    createModule,
    updateModule,
    deleteModule,
    toggleModulePublish,
    createLesson,
    updateLesson,
    deleteLesson,
    toggleLessonPublish,
  } = useData();

  const [activeTab, setActiveTab] = useState<'levels' | 'modules' | 'lessons'>('modules');

  // Modal states for creating/editing
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);

  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form inputs for Module creation
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modLevelId, setModLevelId] = useState(levels[0]?.id || 'lvl_01');
  const [modDuration, setModDuration] = useState('5 Hours');
  const [modDifficulty, setModDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  // Form inputs for Lesson creation
  const [lesTitle, setLesTitle] = useState('');
  const [lesDesc, setLesDesc] = useState('');
  const [lesModId, setLesModId] = useState(modules[0]?.id || 'mod_py_01');
  const [lesVideoUrl, setLesVideoUrl] = useState('');
  const [lesNotes, setLesNotes] = useState('');
  const [lesXp, setLesXp] = useState(20);

  const handleOpenModuleModal = (mod?: Module) => {
    if (mod) {
      setEditingModule(mod);
      setModTitle(mod.title);
      setModDesc(mod.description);
      setModLevelId(mod.levelId);
      setModDuration(mod.duration);
      setModDifficulty(mod.difficulty);
    } else {
      setEditingModule(null);
      setModTitle('');
      setModDesc('');
      setModDuration('5 Hours');
    }
    setModuleModalOpen(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle.trim()) return;

    if (editingModule) {
      updateModule({
        ...editingModule,
        title: modTitle,
        description: modDesc,
        levelId: modLevelId,
        duration: modDuration,
        difficulty: modDifficulty,
      });
    } else {
      createModule({
        levelId: modLevelId,
        order: modules.length + 1,
        title: modTitle,
        description: modDesc,
        duration: modDuration,
        difficulty: modDifficulty,
        published: true,
      });
    }
    setModuleModalOpen(false);
  };

  const handleOpenLessonModal = (les?: Lesson) => {
    if (les) {
      setEditingLesson(les);
      setLesTitle(les.title);
      setLesDesc(les.description);
      setLesModId(les.moduleId);
      setLesVideoUrl(les.videoUrl || '');
      setLesNotes(les.notesMarkdown || '');
      setLesXp(les.xpReward);
    } else {
      setEditingLesson(null);
      setLesTitle('');
      setLesDesc('');
      setLesVideoUrl('');
      setLesNotes('# Lesson Notes\n\nWrite theoretical content here...');
      setLesXp(20);
    }
    setLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesTitle.trim()) return;

    if (editingLesson) {
      updateLesson({
        ...editingLesson,
        title: lesTitle,
        description: lesDesc,
        moduleId: lesModId,
        videoUrl: lesVideoUrl.trim() || undefined,
        notesMarkdown: lesNotes,
        xpReward: Number(lesXp),
      });
    } else {
      createLesson({
        moduleId: lesModId,
        order: lessons.length + 1,
        title: lesTitle,
        description: lesDesc,
        objectives: ['Master lesson topics'],
        videoUrl: lesVideoUrl.trim() || undefined,
        notesMarkdown: lesNotes,
        xpReward: Number(lesXp),
        published: true,
      });
    }
    setLessonModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <BookOpenCheck className="w-4 h-4" />
          <span>NEURA LINKS // ADMIN CONTENT MANAGEMENT SYSTEM</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Learning Content CMS
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Create, edit, publish, or unpublish learning levels, modules, lessons, notes markdown, video embeds, and quizzes.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-between items-center border-b border-[#1f1f28] pb-3">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('modules')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all ${
              activeTab === 'modules' ? 'border-purple-500 text-purple-300' : 'border-transparent text-gray-400'
            }`}
          >
            Modules ({modules.length})
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all ${
              activeTab === 'lessons' ? 'border-purple-500 text-purple-300' : 'border-transparent text-gray-400'
            }`}
          >
            Lessons ({lessons.length})
          </button>
        </div>

        <button
          onClick={() => activeTab === 'modules' ? handleOpenModuleModal() : handleOpenLessonModal()}
          className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New {activeTab === 'modules' ? 'Module' : 'Lesson'}</span>
        </button>
      </div>

      {/* Modules CMS Grid */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => {
            const level = levels.find(l => l.id === m.levelId);
            const mLessons = lessons.filter(l => l.moduleId === m.id);

            return (
              <Card key={m.id} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-purple-400 uppercase font-bold">
                      {level?.title || 'LEVEL'}
                    </span>
                    <h3 className="font-heading text-base font-bold text-white mt-1">{m.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleModulePublish(m.id)}
                    className="flex items-center space-x-1"
                    title={m.published ? 'Published to Students' : 'Unpublished (Hidden)'}
                  >
                    {m.published ? (
                      <Badge variant="green" className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Published</span>
                      </Badge>
                    ) : (
                      <Badge variant="red" className="flex items-center space-x-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </Badge>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 font-sans">{m.description}</p>

                <div className="pt-2 border-t border-[#1a1a24] flex items-center justify-between font-mono text-xs">
                  <span className="text-gray-500">{mLessons.length} Lessons • {m.duration}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModuleModal(m)}
                      className="p-1.5 bg-[#1a1a24] hover:bg-purple-900/60 border border-[#2a2a3a] text-purple-300 rounded"
                      title="Edit Module"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteModule(m.id)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded"
                      title="Delete Module"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lessons CMS List */}
      {activeTab === 'lessons' && (
        <div className="space-y-3">
          {lessons.map((les) => {
            const parentMod = modules.find(m => m.id === les.moduleId);

            return (
              <div key={les.id} className="p-4 bg-[#111116] border border-[#1f1f28] rounded-md flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-heading text-sm font-bold text-white">{les.title}</span>
                    <span className="font-mono text-xs text-yellow-400">+{les.xpReward} XP</span>
                  </div>
                  <div className="font-mono text-xs text-gray-400">
                    Module: <span className="text-purple-300 font-bold">{parentMod?.title || 'Module'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleLessonPublish(les.id)}
                    className="flex items-center space-x-1"
                  >
                    {les.published ? <Badge variant="green">Published</Badge> : <Badge variant="red">Hidden</Badge>}
                  </button>

                  <button
                    onClick={() => handleOpenLessonModal(les)}
                    className="p-1.5 bg-[#1a1a24] hover:bg-purple-900/60 border border-[#2a2a3a] text-purple-300 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteLesson(les.id)}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Module Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Create New Learning Module'}
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Module Title *</label>
            <input
              type="text"
              required
              value={modTitle}
              onChange={(e) => setModTitle(e.target.value)}
              placeholder="e.g. Transformers & Attention Mechanism"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Target Level</label>
            <select
              value={modLevelId}
              onChange={(e) => setModLevelId(e.target.value)}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md focus:outline-none"
            >
              {levels.map(l => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={modDesc}
              onChange={(e) => setModDesc(e.target.value)}
              placeholder="Detailed description of what students will learn..."
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-gray-300 uppercase font-bold">Est Duration</label>
              <input
                type="text"
                value={modDuration}
                onChange={(e) => setModDuration(e.target.value)}
                className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-gray-300 uppercase font-bold">Difficulty</label>
              <select
                value={modDifficulty}
                onChange={(e) => setModDifficulty(e.target.value as any)}
                className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1f1f28]">
            <button
              type="button"
              onClick={() => setModuleModalOpen(false)}
              className="px-4 py-2 bg-[#1a1a24] text-gray-300 font-heading text-xs uppercase rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase font-bold rounded-md"
            >
              Save Module
            </button>
          </div>
        </form>
      </Modal>

      {/* Create/Edit Lesson Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Lesson Title *</label>
            <input
              type="text"
              required
              value={lesTitle}
              onChange={(e) => setLesTitle(e.target.value)}
              placeholder="e.g. Self-Attention Layer Implementation"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Parent Module</label>
            <select
              value={lesModId}
              onChange={(e) => setLesModId(e.target.value)}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            >
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">YouTube Video Embed URL (Optional)</label>
            <input
              type="url"
              value={lesVideoUrl}
              onChange={(e) => setLesVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/video_id"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Notes & Theory (Markdown)</label>
            <textarea
              rows={6}
              value={lesNotes}
              onChange={(e) => setLesNotes(e.target.value)}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white font-mono rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">XP Reward</label>
            <input
              type="number"
              value={lesXp}
              onChange={(e) => setLesXp(Number(e.target.value))}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1f1f28]">
            <button
              type="button"
              onClick={() => setLessonModalOpen(false)}
              className="px-4 py-2 bg-[#1a1a24] text-gray-300 font-heading text-xs uppercase rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase font-bold rounded-md"
            >
              Save Lesson
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
