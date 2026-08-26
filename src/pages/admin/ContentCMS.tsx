import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'levels' | 'modules' | 'lessons'>('modules');

  useEffect(() => {
    if (location.pathname.includes('/levels')) {
      setActiveTab('levels');
    }
  }, [location]);

  // Modal states for creating/editing
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);

  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form inputs for Level creation/editing
  const [lvlTitle, setLvlTitle] = useState('');
  const [lvlOrder, setLvlOrder] = useState<number>(1);
  const [lvlDesc, setLvlDesc] = useState('');
  const [lvlPublished, setLvlPublished] = useState<boolean>(true);

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

  // Level Handlers
  const handleOpenLevelModal = (lvl?: Level) => {
    if (lvl) {
      setEditingLevel(lvl);
      setLvlTitle(lvl.title);
      setLvlOrder(lvl.order);
      setLvlDesc(lvl.description);
      setLvlPublished(lvl.published);
    } else {
      setEditingLevel(null);
      setLvlTitle('');
      setLvlOrder(levels.length + 1);
      setLvlDesc('');
      setLvlPublished(true);
    }
    setLevelModalOpen(true);
  };

  const handleSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lvlTitle.trim()) return;

    if (editingLevel) {
      updateLevel({
        ...editingLevel,
        title: lvlTitle.trim(),
        order: Number(lvlOrder),
        description: lvlDesc.trim(),
        published: lvlPublished,
      });
    } else {
      createLevel({
        title: lvlTitle.trim(),
        order: Number(lvlOrder),
        description: lvlDesc.trim(),
        published: lvlPublished,
      });
    }
    setLevelModalOpen(false);
  };

  const handleDeleteLevel = (id: string) => {
    if (window.confirm('Are you sure you want to delete this level? Modules under this level may be unassigned.')) {
      deleteLevel(id);
    }
  };

  // Module Handlers
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
      setModLevelId(levels[0]?.id || 'lvl_01');
      setModDuration('5 Hours');
      setModDifficulty('Intermediate');
    }
    setModuleModalOpen(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle.trim()) return;

    if (editingModule) {
      updateModule({
        ...editingModule,
        title: modTitle.trim(),
        description: modDesc.trim(),
        levelId: modLevelId,
        duration: modDuration,
        difficulty: modDifficulty,
      });
    } else {
      createModule({
        levelId: modLevelId,
        order: modules.length + 1,
        title: modTitle.trim(),
        description: modDesc.trim(),
        duration: modDuration,
        difficulty: modDifficulty,
        published: true,
      });
    }
    setModuleModalOpen(false);
  };

  // Lesson Handlers
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
      setLesModId(modules[0]?.id || 'mod_py_01');
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
        title: lesTitle.trim(),
        description: lesDesc.trim(),
        moduleId: lesModId,
        videoUrl: lesVideoUrl.trim() || undefined,
        notesMarkdown: lesNotes,
        xpReward: Number(lesXp),
      });
    } else {
      createLesson({
        moduleId: lesModId,
        order: lessons.length + 1,
        title: lesTitle.trim(),
        description: lesDesc.trim(),
        objectives: ['Master lesson topics'],
        videoUrl: lesVideoUrl.trim() || undefined,
        notesMarkdown: lesNotes,
        xpReward: Number(lesXp),
        published: true,
      });
    }
    setLessonModalOpen(false);
  };

  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#674846]/40 pb-6">
        <div className="font-mono text-xs text-[#FFF8DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
          <BookOpenCheck className="w-4 h-4 text-[#FFF8DC]" />
          <span>NEURA LINKS // ADMIN CONTENT MANAGEMENT SYSTEM</span>
        </div>
        <h1 className="font-cornsilk text-3xl font-normal text-[#FFF8DC] tracking-wide uppercase">
          Learning Content CMS
        </h1>
        <p className="text-sm text-gray-300 max-w-3xl font-sans">
          Create, edit, reorder, publish, or unpublish learning levels, modules, lessons, notes markdown, video embeds, and quizzes.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#674846]/40 pb-3">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('levels')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'levels' ? 'border-[#FFF8DC] text-[#FFF8DC]' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Levels ({levels.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'modules' ? 'border-[#FFF8DC] text-[#FFF8DC]' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Modules ({modules.length})
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'lessons' ? 'border-[#FFF8DC] text-[#FFF8DC]' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Lessons ({lessons.length})
          </button>
        </div>

        <button
          onClick={() =>
            activeTab === 'levels'
              ? handleOpenLevelModal()
              : activeTab === 'modules'
              ? handleOpenModuleModal()
              : handleOpenLessonModal()
          }
          className="bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(103,72,70,0.5)] flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FFF8DC]" />
          <span>
            Create New {activeTab === 'levels' ? 'Level' : activeTab === 'modules' ? 'Module' : 'Lesson'}
          </span>
        </button>
      </div>

      {/* Levels CMS Grid */}
      {activeTab === 'levels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedLevels.map((lvl) => {
            const levelModules = modules.filter((m) => m.levelId === lvl.id);

            return (
              <Card key={lvl.id} className="space-y-4 border-[#674846]/40 bg-[#161616]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded bg-[#674846] border border-[#FFF8DC]/40 flex items-center justify-center font-mono font-bold text-[#FFF8DC] text-xs shadow-md">
                      {String(lvl.order).padStart(2, '0')}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#FFF8DC]/70 uppercase font-bold">
                        ORDER #{lvl.order}
                      </span>
                      <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC] tracking-wide uppercase mt-0.5">
                        {lvl.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLevelPublish(lvl.id)}
                    className="flex items-center space-x-1 cursor-pointer"
                    title={lvl.published ? 'Published to Students' : 'Unpublished (Hidden)'}
                  >
                    {lvl.published ? (
                      <Badge variant="cornsilk" className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Published</span>
                      </Badge>
                    ) : (
                      <Badge variant="rose" className="flex items-center space-x-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </Badge>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-300 font-sans">{lvl.description}</p>

                <div className="pt-2 border-t border-[#674846]/40 flex items-center justify-between font-mono text-xs">
                  <span className="text-gray-400">
                    {levelModules.length} {levelModules.length === 1 ? 'Module' : 'Modules'} Assigned
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenLevelModal(lvl)}
                      className="p-1.5 bg-[#161616] hover:bg-[#674846]/40 border border-[#674846] text-[#FFF8DC] rounded transition-colors cursor-pointer"
                      title="Edit Level"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLevel(lvl.id)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded transition-colors cursor-pointer"
                      title="Delete Level"
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

      {/* Modules CMS Grid */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => {
            const level = levels.find((l) => l.id === m.levelId);
            const mLessons = lessons.filter((l) => l.moduleId === m.id);

            return (
              <Card key={m.id} className="space-y-4 border-[#674846]/40 bg-[#161616]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-[#FFF8DC] uppercase font-bold">
                      {level?.title || 'LEVEL'}
                    </span>
                    <h3 className="font-cornsilk text-lg font-normal text-[#FFF8DC] mt-1">{m.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleModulePublish(m.id)}
                    className="flex items-center space-x-1 cursor-pointer"
                    title={m.published ? 'Published to Students' : 'Unpublished (Hidden)'}
                  >
                    {m.published ? (
                      <Badge variant="cornsilk" className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Published</span>
                      </Badge>
                    ) : (
                      <Badge variant="rose" className="flex items-center space-x-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </Badge>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-300 font-sans">{m.description}</p>

                <div className="pt-2 border-t border-[#674846]/40 flex items-center justify-between font-mono text-xs">
                  <span className="text-gray-400">
                    {mLessons.length} Lessons • {m.duration}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModuleModal(m)}
                      className="p-1.5 bg-[#161616] hover:bg-[#674846]/40 border border-[#674846] text-[#FFF8DC] rounded transition-colors cursor-pointer"
                      title="Edit Module"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteModule(m.id)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded transition-colors cursor-pointer"
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
            const parentMod = modules.find((m) => m.id === les.moduleId);

            return (
              <div
                key={les.id}
                className="p-4 bg-[#161616] border border-[#674846]/40 rounded-md flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-cornsilk text-base font-normal text-[#FFF8DC]">{les.title}</span>
                    <span className="font-mono text-xs text-yellow-400 font-bold">+{les.xpReward} XP</span>
                  </div>
                  <div className="font-mono text-xs text-gray-400">
                    Module: <span className="text-[#FFF8DC] font-bold">{parentMod?.title || 'Module'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button onClick={() => toggleLessonPublish(les.id)} className="flex items-center space-x-1 cursor-pointer">
                    {les.published ? <Badge variant="cornsilk">Published</Badge> : <Badge variant="rose">Hidden</Badge>}
                  </button>

                  <button
                    onClick={() => handleOpenLessonModal(les)}
                    className="p-1.5 bg-[#161616] hover:bg-[#674846]/40 border border-[#674846] text-[#FFF8DC] rounded transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteLesson(les.id)}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Level Modal */}
      <Modal
        isOpen={levelModalOpen}
        onClose={() => setLevelModalOpen(false)}
        title={editingLevel ? 'Edit Learning Level' : 'Create New Learning Level'}
      >
        <form onSubmit={handleSaveLevel} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Level Title *</label>
            <input
              type="text"
              required
              value={lvlTitle}
              onChange={(e) => setLvlTitle(e.target.value)}
              placeholder="e.g. LEVEL 09 — Quantum Computing & AI"
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none focus:border-[#FFF8DC] font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Order Number *</label>
              <input
                type="number"
                required
                min={1}
                value={lvlOrder}
                onChange={(e) => setLvlOrder(Number(e.target.value))}
                className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none focus:border-[#FFF8DC]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Publish Status</label>
              <select
                value={lvlPublished ? 'published' : 'hidden'}
                onChange={(e) => setLvlPublished(e.target.value === 'published')}
                className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none"
              >
                <option value="published">Published (Visible to Students)</option>
                <option value="hidden">Hidden (Draft)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={lvlDesc}
              onChange={(e) => setLvlDesc(e.target.value)}
              placeholder="Overview of concepts covered in this learning level..."
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none font-sans"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#674846]/40">
            <button
              type="button"
              onClick={() => setLevelModalOpen(false)}
              className="px-4 py-2 bg-[#161616] text-gray-300 hover:bg-[#262626] font-heading text-xs uppercase rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 font-heading text-xs uppercase font-bold rounded-md cursor-pointer shadow-md"
            >
              Save Level
            </button>
          </div>
        </form>
      </Modal>

      {/* Create/Edit Module Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Create New Learning Module'}
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Module Title *</label>
            <input
              type="text"
              required
              value={modTitle}
              onChange={(e) => setModTitle(e.target.value)}
              placeholder="e.g. Transformers & Attention Mechanism"
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none focus:border-[#FFF8DC]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Target Level</label>
            <select
              value={modLevelId}
              onChange={(e) => setModLevelId(e.target.value)}
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none"
            >
              {sortedLevels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={modDesc}
              onChange={(e) => setModDesc(e.target.value)}
              placeholder="Detailed description of what students will learn..."
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Est Duration</label>
              <input
                type="text"
                value={modDuration}
                onChange={(e) => setModDuration(e.target.value)}
                className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Difficulty</label>
              <select
                value={modDifficulty}
                onChange={(e) => setModDifficulty(e.target.value as any)}
                className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#674846]/40">
            <button
              type="button"
              onClick={() => setModuleModalOpen(false)}
              className="px-4 py-2 bg-[#161616] text-gray-300 hover:bg-[#262626] font-heading text-xs uppercase rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 font-heading text-xs uppercase font-bold rounded-md cursor-pointer shadow-md"
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
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Lesson Title *</label>
            <input
              type="text"
              required
              value={lesTitle}
              onChange={(e) => setLesTitle(e.target.value)}
              placeholder="e.g. Self-Attention Layer Implementation"
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Parent Module</label>
            <select
              value={lesModId}
              onChange={(e) => setLesModId(e.target.value)}
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">YouTube Video Embed URL (Optional)</label>
            <input
              type="url"
              value={lesVideoUrl}
              onChange={(e) => setLesVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/video_id"
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">Notes & Theory (Markdown)</label>
            <textarea
              rows={6}
              value={lesNotes}
              onChange={(e) => setLesNotes(e.target.value)}
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] font-mono rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#FFF8DC] uppercase font-bold">XP Reward</label>
            <input
              type="number"
              value={lesXp}
              onChange={(e) => setLesXp(Number(e.target.value))}
              className="w-full p-3 bg-[#1e1e1e] border border-[#674846]/40 text-xs text-[#FFF8DC] rounded-md"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#674846]/40">
            <button
              type="button"
              onClick={() => setLessonModalOpen(false)}
              className="px-4 py-2 bg-[#161616] text-gray-300 hover:bg-[#262626] font-heading text-xs uppercase rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 font-heading text-xs uppercase font-bold rounded-md cursor-pointer shadow-md"
            >
              Save Lesson
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
