import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  FileText,
  Code2,
  HelpCircle,
  Zap,
  ExternalLink,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { lessons, modules, studentProfiles, markLessonComplete } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'quiz' | 'resources'>('notes');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [marked, setMarked] = useState(false);

  const lessonItem = lessons.find(l => l.id === lessonId);
  const moduleItem = modules.find(m => m.id === lessonItem?.moduleId);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const isAlreadyCompleted = profile?.completedLessonIds.includes(lessonId || '');

  if (!lessonItem) {
    return (
      <div className="p-8 text-center text-gray-400 space-y-4">
        <div>Lesson not found or unavailable.</div>
        <button onClick={() => navigate('/learning')} className="text-purple-400 font-mono text-xs">
          ← Return to Learning Hub
        </button>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (!currentUser || isAlreadyCompleted || marked) return;
    markLessonComplete(currentUser.id, lessonItem.id, lessonItem.xpReward);
    setMarked(true);
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Nav Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#1f1f28] pb-4">
        <button
          onClick={() => navigate(`/learning/${lessonItem.moduleId}`)}
          className="font-mono text-xs text-gray-400 hover:text-white flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Module: {moduleItem?.title || 'Module'}</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs text-yellow-400 font-bold flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>+{lessonItem.xpReward} XP</span>
          </span>
          {(isAlreadyCompleted || marked) && (
            <Badge variant="green" className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Lesson Title Header */}
      <div className="space-y-2">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest">
          MODULE: {moduleItem?.title} • LESSON 0{lessonItem.order}
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          {lessonItem.title}
        </h1>
        <p className="text-sm text-gray-300 font-sans">{lessonItem.description}</p>
      </div>

      {/* Learning Objectives Box */}
      {lessonItem.objectives && lessonItem.objectives.length > 0 && (
        <div className="p-4 bg-[#111116] border border-purple-900/40 rounded-md space-y-2">
          <div className="font-heading text-xs font-bold text-purple-300 uppercase tracking-wider">
            Learning Objectives
          </div>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {lessonItem.objectives.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Video Player Embed */}
      {lessonItem.videoUrl && (
        <div className="w-full aspect-video bg-black rounded-lg border border-[#1f1f28] overflow-hidden shadow-2xl relative">
          <iframe
            src={lessonItem.videoUrl}
            title={lessonItem.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Tab Navigation for Lesson Content */}
      <div className="border-b border-[#1f1f28] flex space-x-6">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 font-heading text-xs uppercase tracking-wider font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'notes'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes & Theory</span>
        </button>

        {lessonItem.codeSnippet && (
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 font-heading text-xs uppercase tracking-wider font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code Sandbox</span>
          </button>
        )}

        {lessonItem.quiz && lessonItem.quiz.length > 0 && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-3 font-heading text-xs uppercase tracking-wider font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'quiz'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz & Assessment</span>
          </button>
        )}

        {lessonItem.resources && lessonItem.resources.length > 0 && (
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-3 font-heading text-xs uppercase tracking-wider font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'resources'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Resources ({lessonItem.resources.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-[#111116] border border-[#1f1f28] rounded-lg p-6">
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed space-y-4 font-sans">
            <div className="whitespace-pre-line text-gray-300">
              {lessonItem.notesMarkdown}
            </div>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && lessonItem.codeSnippet && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 border-b border-[#1f1f28] pb-2">
              <span>Python Code Snippet</span>
              <span>Interactive Code Sandbox</span>
            </div>
            <pre className="bg-[#08080c] border border-[#1f1f2a] p-4 rounded-md font-mono text-xs text-green-400 overflow-x-auto">
              <code>{lessonItem.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && lessonItem.quiz && (
          <div className="space-y-6">
            {lessonItem.quiz.map((q, idx) => (
              <div key={q.id} className="space-y-3 border-b border-[#1f1f28] pb-6 last:border-0">
                <div className="font-heading text-sm font-bold text-white">
                  Q{idx + 1}. {q.question}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optionIdx) => {
                    const isSelected = selectedQuizAnswers[q.id] === optionIdx;
                    const isCorrect = optionIdx === q.correctIndex;

                    return (
                      <button
                        key={optionIdx}
                        onClick={() => handleSelectAnswer(q.id, optionIdx)}
                        className={`w-full text-left p-3 rounded-md text-xs font-sans transition-all flex items-center justify-between border ${
                          isSelected
                            ? quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                : 'bg-rose-950/80 border-rose-500 text-rose-200'
                              : 'bg-purple-950 border-purple-500 text-white'
                            : 'bg-[#16161f] border-[#222230] text-gray-300 hover:bg-[#1c1c28]'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3 bg-[#0a0a0e] border border-[#1f1f2a] rounded text-xs text-gray-400 font-mono">
                    <span className="text-purple-400 font-bold">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => setQuizSubmitted(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-5 rounded-md transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              Submit Quiz Answers
            </button>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && lessonItem.resources && (
          <div className="space-y-3">
            {lessonItem.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-[#16161f] border border-[#222230] hover:border-purple-500/50 rounded-md flex items-center justify-between group transition-all"
              >
                <div>
                  <div className="font-heading text-xs font-bold text-white group-hover:text-purple-300">
                    {res.title}
                  </div>
                  <div className="font-mono text-[10px] text-gray-500">{res.type}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action: Mark as Complete */}
      <div className="sticky bottom-4 z-20 bg-[#111116]/95 backdrop-blur-md border border-[#252535] p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Ready to complete this lesson?
          </div>
          <div className="font-mono text-xs text-gray-400">
            Earn +{lessonItem.xpReward} XP & advance your learning level
          </div>
        </div>

        <button
          onClick={handleMarkComplete}
          disabled={isAlreadyCompleted || marked}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-md font-heading text-xs font-extrabold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
            isAlreadyCompleted || marked
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transform hover:-translate-y-0.5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isAlreadyCompleted || marked ? 'Lesson Completed ✓' : 'Mark as Complete (+XP)'}</span>
        </button>
      </div>
    </div>
  );
};
