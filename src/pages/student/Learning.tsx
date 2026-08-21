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
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>NEURA LINKS // AI ENGINEERING ROADMAP</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Structured Learning Hub
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
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
            className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedLevelId === 'ALL'
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'bg-[#111116] text-gray-400 hover:bg-[#1a1a24] border border-[#1f1f28]'
            }`}
          >
            All Levels
          </button>
          {publishedLevels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelId(lvl.id)}
              className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedLevelId === lvl.id
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'bg-[#111116] text-gray-400 hover:bg-[#1a1a24] border border-[#1f1f28]'
              }`}
            >
              LVL 0{lvl.order} • {lvl.title.split('—')[1] || lvl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List Grouped by Level */}
      <div className="space-y-8">
        {publishedLevels
          .filter(lvl => selectedLevelId === 'ALL' || lvl.id === selectedLevelId)
          .map((lvl) => {
            const levelModules = filteredModules.filter(m => m.levelId === lvl.id);
            if (levelModules.length === 0 && searchQuery !== '') return null;

            return (
              <div key={lvl.id} className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-[#1f1f28] pb-2">
                  <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-800 flex items-center justify-center font-mono font-bold text-purple-300 text-xs">
                    0{lvl.order}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white tracking-wider uppercase">
                      {lvl.title}
                    </h2>
                    <p className="text-xs text-gray-400">{lvl.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {levelModules.map((mod) => {
                    const moduleLessons = lessons.filter(l => l.moduleId === mod.id && l.published);
                    const completedCount = moduleLessons.filter(l => profile?.completedLessonIds.includes(l.id)).length;
                    const isCompleted = profile?.completedModuleIds.includes(mod.id);

                    return (
                      <Card
                        key={mod.id}
                        onClick={() => navigate(`/learning/${mod.id}`)}
                        className="space-y-4 flex flex-col justify-between group"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant={isCompleted ? 'green' : 'purple'}>
                              {isCompleted ? 'Module Completed' : mod.difficulty}
                            </Badge>
                            <span className="font-mono text-xs text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{mod.duration}</span>
                            </span>
                          </div>

                          <h3 className="font-heading text-base font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-sans line-clamp-2">
                            {mod.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#1a1a24] flex items-center justify-between">
                          <div className="font-mono text-xs text-gray-400 flex items-center space-x-2">
                            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                            <span>{completedCount} / {moduleLessons.length} Lessons</span>
                          </div>

                          <span className="font-heading text-xs uppercase tracking-wider text-purple-400 group-hover:text-purple-300 font-bold flex items-center space-x-1">
                            <span>Open Module</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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
