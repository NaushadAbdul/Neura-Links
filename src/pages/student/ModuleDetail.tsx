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
  const progressPercent = moduleLessons.length > 0 ? Math.round((completedLessonCount / moduleLessons.length) * 100) : 0;

  if (!moduleItem) {
    return (
      <div className="p-8 text-center text-gray-400 space-y-4">
        <div>Module not found or unpublished.</div>
        <button onClick={() => navigate('/learning')} className="text-purple-400 font-mono text-xs">
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
        className="font-mono text-xs text-gray-400 hover:text-white flex items-center space-x-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Hub</span>
      </button>

      {/* Header Banner */}
      <div className="bg-[#111116] border border-[#1f1f28] p-6 rounded-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-purple-400 uppercase tracking-widest font-bold">
            {levelItem?.title || 'LEVEL'}
          </span>
          <Badge variant="purple">{moduleItem.difficulty}</Badge>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
          {moduleItem.title}
        </h1>
        <p className="text-sm text-gray-300 font-sans leading-relaxed">
          {moduleItem.description}
        </p>

        <div className="pt-4 border-t border-[#1f1f28] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="font-mono text-[10px] text-gray-500 uppercase">Lessons</div>
            <div className="font-mono text-sm font-bold text-white">{completedLessonCount} / {moduleLessons.length} Completed</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-gray-500 uppercase">Estimated Duration</div>
            <div className="font-mono text-sm font-bold text-white">{moduleItem.duration}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-gray-500 uppercase">Module Progress</div>
            <ProgressBar progress={progressPercent} color="purple" showPercentage />
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
                    <h3 className="font-heading text-sm font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                      {les.title}
                    </h3>
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
