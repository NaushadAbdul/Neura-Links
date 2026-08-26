import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, CheckCircle2, Clock, ArrowRight, Lock } from 'lucide-react';

export const LearningHub: React.FC = () => {
  const { levels, modules, lessons, studentProfiles } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedLevelId, setSelectedLevelId] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const profile = currentUser ? studentProfiles[currentUser.id] : null;

  // Filter published levels & modules for student
  const publishedLevels = levels.filter(l => l.published).sort((a, b) => a.order - b.order);
  const publishedModules = modules.filter(m => m.published);

  const filteredModules = publishedModules.filter(mod => {
    const matchesLevel = selectedLevelId === 'ALL' || mod.levelId === selectedLevelId;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#706C61]/40 pb-6">
        <div className="font-mono text-xs text-[#EFE9DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
          <BookOpen className="w-4 h-4 text-[#EFE9DC]" />
          <span>NEURA LINKS // AI ENGINEERING ROADMAP</span>
        </div>
        <h1 className="font-bodoni text-3xl sm:text-5xl font-normal text-[#EFE9DC] tracking-wide uppercase">
          Structured Learning Hub
        </h1>
        <p className="text-sm text-[#EFE9DC]/90 max-w-3xl font-sans leading-relaxed">
          Master the complete AI stack from Python foundations to Deep Learning, Generative AI, RAG systems, and Autonomous Agent Engineering.
        </p>
      </div>

      {/* Search & Level Filter Tabs */}
      <div className="space-y-4">
        <div className="max-w-md">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search learning modules..." />
        </div>

        {/* Level Filters Horizontal Scroll */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedLevelId('ALL')}
            className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedLevelId === 'ALL'
                ? 'bg-[#674846] text-[#FFF8DC] border border-[#FFF8DC]/40 font-bold shadow-[0_0_15px_rgba(103,72,70,0.5)]'
                : 'bg-[#161616] text-gray-400 hover:text-[#FFF8DC] hover:bg-[#262626] border border-[#674846]/40'
            }`}
          >
            All Levels
          </button>
          {publishedLevels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelId(lvl.id)}
              className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedLevelId === lvl.id
                  ? 'bg-[#674846] text-[#FFF8DC] border border-[#FFF8DC]/40 font-bold shadow-[0_0_15px_rgba(103,72,70,0.5)]'
                  : 'bg-[#161616] text-gray-400 hover:text-[#FFF8DC] hover:bg-[#262626] border border-[#674846]/40'
              }`}
            >
              LVL {String(lvl.order).padStart(2, '0')} • {lvl.title.split('—')[1]?.trim() || lvl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {publishedLevels.length === 0 && (
        <div className="p-12 text-center bg-[#161616] border border-[#674846]/40 rounded-md space-y-3">
          <BookOpen className="w-10 h-10 text-[#674846] mx-auto" />
          <h3 className="font-cornsilk text-xl text-[#FFF8DC] uppercase">No Learning Levels Created Yet</h3>
          <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
            There are currently no learning levels published. Once administrators create learning levels and modules, they will appear here.
          </p>
        </div>
      )}

      {/* Modules List Grouped by Level */}
      <div className="space-y-8">
        {publishedLevels
          .filter(lvl => selectedLevelId === 'ALL' || lvl.id === selectedLevelId)
          .map((lvl) => {
            const levelModules = filteredModules.filter(m => m.levelId === lvl.id);
            if (levelModules.length === 0 && searchQuery !== '') return null;

            const isLocked = lvl.isLocked;

            const handleLevelClick = () => {
              if (isLocked) {
                alert(`🔒 Level Locked\n\n"${lvl.title}" is currently locked by the Administrator. Please complete earlier modules or wait for administrator unlock.`);
              } else {
                navigate('/resources');
              }
            };

            return (
              <div key={lvl.id} className={`space-y-4 transition-all ${isLocked ? 'opacity-70' : ''}`}>
                <div
                  onClick={handleLevelClick}
                  className={`flex items-center justify-between border-b pb-2 transition-all ${
                    isLocked
                      ? 'border-rose-900/60 cursor-not-allowed bg-rose-950/20 px-3 py-1.5 rounded-t-md'
                      : 'border-[#674846]/40 cursor-pointer group hover:border-[#FFF8DC]/60'
                  }`}
                  title={isLocked ? 'Level Locked by Admin' : 'Click to view level resources'}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded border flex items-center justify-center font-mono font-bold text-xs shadow-md transition-colors ${
                      isLocked
                        ? 'bg-rose-950 border-rose-700 text-rose-300'
                        : 'bg-[#674846] border-[#FFF8DC]/40 text-[#FFF8DC] group-hover:bg-[#FFF8DC] group-hover:text-[#161616]'
                    }`}>
                      {isLocked ? <Lock className="w-4 h-4 text-rose-300" /> : String(lvl.order).padStart(2, '0')}
                    </div>
                    <div>
                      <h2 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase flex items-center space-x-2">
                        <span>{lvl.title}</span>
                        {isLocked && (
                          <Badge variant="rose" className="font-mono text-[10px] tracking-wider uppercase border border-rose-700 bg-rose-950 text-rose-300 font-bold ml-2">
                            🔒 LOCKED BY ADMIN
                          </Badge>
                        )}
                      </h2>
                      <p className="text-xs text-gray-400">{lvl.description}</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center space-x-1.5 text-xs font-heading uppercase tracking-wider font-bold">
                    {isLocked ? (
                      <span className="text-rose-400 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>LOCKED</span>
                      </span>
                    ) : (
                      <span className="text-[#FFF8DC] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 flex items-center space-x-1.5 transition-all">
                        <span>View Resources</span>
                        <ArrowRight className="w-4 h-4 text-[#FFF8DC]" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {levelModules.map((mod) => {
                    const moduleLessons = lessons.filter(l => l.moduleId === mod.id && l.published);
                    const completedCount = moduleLessons.filter(l => profile?.completedLessonIds.includes(l.id)).length;
                    const isCompleted = profile?.completedModuleIds.includes(mod.id);

                    const watchProgressMap = profile?.lessonWatchProgress || {};
                    const totalWatchPercent = moduleLessons.reduce((sum, les) => {
                      const isCompletedLes = profile?.completedLessonIds.includes(les.id);
                      const watched = watchProgressMap[les.id] !== undefined ? watchProgressMap[les.id] : (isCompletedLes ? 100 : 0);
                      return sum + Math.min(100, Math.max(0, watched));
                    }, 0);
                    const modWatchPercent = moduleLessons.length > 0 ? Math.round(totalWatchPercent / moduleLessons.length) : 0;

                    const handleModuleClick = () => {
                      if (isLocked) {
                        alert(`🔒 Level Locked\n\n"${lvl.title}" is currently locked by the Administrator. Please complete earlier modules or wait for administrator unlock.`);
                      } else {
                        navigate(`/module/${mod.id}`);
                      }
                    };

                    return (
                      <Card
                        key={mod.id}
                        onClick={handleModuleClick}
                        className={`space-y-4 flex flex-col justify-between group transition-all ${
                          isLocked
                            ? 'border-rose-900/40 bg-[#161616]/80 cursor-not-allowed opacity-75'
                            : 'border-[#674846]/40 bg-[#161616] hover:border-[#FFF8DC]/60 cursor-pointer'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant={isLocked ? 'rose' : (isCompleted ? 'cornsilk' : 'rose')}>
                              {isLocked ? '🔒 Level Locked' : (isCompleted ? 'Module Completed' : mod.difficulty)}
                            </Badge>
                            <span className="font-mono text-xs text-gray-400 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-[#FFF8DC]" />
                              <span>{mod.duration}</span>
                            </span>
                          </div>

                          <h3 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide group-hover:text-white transition-colors">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-gray-300 font-sans line-clamp-2">
                            {mod.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#674846]/40 flex items-center justify-end">
                          <span className="font-heading text-xs uppercase tracking-wider text-[#FFF8DC] group-hover:text-white font-bold flex items-center space-x-1">
                            {isLocked ? (
                              <span className="text-rose-400 flex items-center space-x-1">
                                <Lock className="w-3.5 h-3.5 text-rose-400" />
                                <span>Locked</span>
                              </span>
                            ) : (
                              <>
                                <span>Open Resources</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#FFF8DC]" />
                              </>
                            )}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
