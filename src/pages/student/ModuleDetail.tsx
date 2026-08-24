import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ArrowLeft, BookOpen, PlayCircle, CheckCircle2, Zap, Clock, Code2 } from 'lucide-react';

export const ModuleDetail: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { modules, levels, lessons, tasks, studentProfiles } = useData();
  const { currentUser } = useAuth();

  const moduleItem = modules.find(m => m.id === moduleId);
  const levelItem = levels.find(l => l.id === moduleItem?.levelId);
  const moduleLessons = lessons.filter(l => l.moduleId === moduleId && l.published).sort((a, b) => a.order - b.order);
  const moduleTasks = tasks.filter(t => t.moduleId === moduleId && t.published);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const completedLessonCount = moduleLessons.filter(l => profile?.completedLessonIds.includes(l.id)).length;

  // Calculate watching time progress across module lessons
  const watchProgressMap = profile?.lessonWatchProgress || {};
  const totalWatchPercent = moduleLessons.reduce((sum, les) => {
    const isCompleted = profile?.completedLessonIds.includes(les.id);
    const watched = watchProgressMap[les.id] !== undefined ? watchProgressMap[les.id] : (isCompleted ? 100 : 0);
    return sum + Math.min(100, Math.max(0, watched));
  }, 0);

  const progressPercent = moduleLessons.length > 0 ? Math.round(totalWatchPercent / moduleLessons.length) : 0;

  // Extract total hours from duration string (e.g. "4 Hours" -> 4)
  const durationMatch = moduleItem?.duration?.match(/(\d+(\.\d+)?)/);
  const totalHours = durationMatch ? parseFloat(durationMatch[1]) : 4;
  const watchedHours = ((progressPercent / 100) * totalHours).toFixed(1);

  if (!moduleItem) {
    return (
      <div className="p-8 text-center text-gray-400 space-y-4">
        <div>Module not found or unpublished.</div>
        <button onClick={() => navigate('/learning')} className="text-[#EFE9DC] font-mono text-xs underline">
          ← Return to Learning Hub
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/learning')}
        className="font-mono text-xs text-gray-400 hover:text-[#EFE9DC] flex items-center space-x-2 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Hub</span>
      </button>

      {/* Header Banner */}
      <div className="border border-[#706C61]/50 rounded-xl p-6 sm:p-8 bg-[#1c1c19] shadow-2xl space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-[#EFE9DC] uppercase tracking-widest font-bold">
              {levelItem?.title || 'LEVEL'}
            </span>
            <Badge variant="suede">{moduleItem.difficulty}</Badge>
          </div>

          <h1 className="font-bodoni text-2xl sm:text-4xl font-normal text-[#EFE9DC] tracking-wide">
            {moduleItem.title}
          </h1>
          <p className="text-sm text-[#EFE9DC]/90 font-sans leading-relaxed">
            {moduleItem.description}
          </p>

          <div className="pt-4 border-t border-[#706C61]/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Lessons</div>
              <div className="font-mono text-sm font-bold text-[#EFE9DC]">{completedLessonCount} / {moduleLessons.length} Completed</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Estimated Duration</div>
              <div className="font-mono text-sm font-bold text-[#EFE9DC]">
                {moduleItem.duration}
                {progressPercent > 0 && (
                  <span className="text-[#FFF8DC] font-mono text-xs block opacity-90">
                    (Watched: {watchedHours} / {totalHours} Hrs)
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Module Progress</div>
              <ProgressBar progress={progressPercent} color="cornsilk" showPercentage />
            </div>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#1f1f28] pb-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
            Module Lessons ({moduleLessons.length})
          </h2>
        </div>

        <div className="space-y-3">
          {moduleLessons.map((les, index) => {
            const isCompleted = profile?.completedLessonIds.includes(les.id);
            const lesWatchPercent = watchProgressMap[les.id] !== undefined 
              ? watchProgressMap[les.id] 
              : (isCompleted ? 100 : 0);

            return (
              <div
                key={les.id}
                onClick={() => navigate(`/lesson/${les.id}`)}
                className="p-4 bg-[#111116] border border-[#1f1f28] hover:border-purple-500/50 rounded-md cursor-pointer flex items-center justify-between group transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs ${
                    isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-[#181822] text-purple-300 border border-[#252535]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-heading text-sm font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                        {les.title}
                      </h3>
                      {lesWatchPercent > 0 && lesWatchPercent < 100 && (
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/80 rounded-full">
                          {lesWatchPercent}% WATCHED
                        </span>
                      )}
                      {lesWatchPercent === 100 && (
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 rounded-full">
                          100% WATCHED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {les.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-mono text-xs text-yellow-400 font-bold flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>+{les.xpReward} XP</span>
                  </span>

                  <button className="bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-300 font-heading text-xs uppercase tracking-wider py-1.5 px-3 rounded transition-colors flex items-center space-x-1">
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Review' : 'Start'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Related Tasks */}
      {moduleTasks.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 border-b border-[#1f1f28] pb-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <h2 className="font-heading text-base font-bold text-white tracking-wider uppercase">
              Assigned Tasks for this Module
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleTasks.map(t => (
              <Card key={t.id} onClick={() => navigate('/tasks')} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="cyan">{t.difficulty}</Badge>
                  <span className="font-mono text-xs text-yellow-400">+{t.xpReward} XP</span>
                </div>
                <div className="font-heading text-sm font-bold text-white">{t.title}</div>
                <p className="text-xs text-gray-400">{t.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
