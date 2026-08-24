import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
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
  Clock,
  Tv,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

export const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { lessons, modules, studentProfiles, markLessonComplete, updateLessonWatchProgress } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'quiz' | 'resources'>('notes');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [marked, setMarked] = useState(false);
  const [showAntiCheatWarning, setShowAntiCheatWarning] = useState(false);

  const lessonItem = lessons.find(l => l.id === lessonId);
  const moduleItem = modules.find(m => m.id === lessonItem?.moduleId);

  const profile = currentUser ? studentProfiles[currentUser.id] : null;
  const isAlreadyCompleted = profile?.completedLessonIds.includes(lessonId || '');

  // Current lesson watch percentage
  const currentWatchPercent = profile?.lessonWatchProgress?.[lessonItem?.id || ''] !== undefined
    ? profile.lessonWatchProgress[lessonItem?.id || '']
    : (isAlreadyCompleted ? 100 : 0);

  // Extract hours from module duration (default to 4 hours)
  const durationMatch = moduleItem?.duration?.match(/(\d+(\.\d+)?)/);
  const totalModuleHours = durationMatch ? parseFloat(durationMatch[1]) : 4;
  const watchedHours = ((currentWatchPercent / 100) * totalModuleHours).toFixed(1);

  // Anti-cheat YouTube Player State & Refs
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const maxWatchedSecondsRef = useRef<number>(0);
  const intervalRef = useRef<any>(null);

  // Extract YouTube Video ID
  const youtubeVideoId = React.useMemo(() => {
    if (!lessonItem?.videoUrl) return '';
    const embedMatch = lessonItem.videoUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];
    const watchMatch = lessonItem.videoUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];
    const shortMatch = lessonItem.videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];
    return 'rfscVS0vtbw';
  }, [lessonItem?.videoUrl]);

  // Load YouTube Iframe API & Initialize Anti-Cheat Player
  useEffect(() => {
    if (!youtubeVideoId) return;

    maxWatchedSecondsRef.current = 0;

    const initPlayer = () => {
      if (!playerContainerRef.current) return;

      // Clear existing iframe if present
      playerContainerRef.current.innerHTML = '<div id="yt-anti-cheat-player"></div>';

      try {
        ytPlayerRef.current = new window.YT.Player('yt-anti-cheat-player', {
          height: '100%',
          width: '100%',
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
          },
          events: {
            onStateChange: (event: any) => {
              // Playing state (YT.PlayerState.PLAYING === 1)
              if (event.data === 1) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                  if (!ytPlayerRef.current || typeof ytPlayerRef.current.getCurrentTime !== 'function') return;

                  const currentTime = ytPlayerRef.current.getCurrentTime();
                  const duration = ytPlayerRef.current.getDuration() || 1;

                  // ANTI-CHEAT CHECK: User attempted forward seeking beyond maxWatchedSeconds + 2.5s
                  if (currentTime > maxWatchedSecondsRef.current + 2.5) {
                    ytPlayerRef.current.seekTo(maxWatchedSecondsRef.current, true);
                    setShowAntiCheatWarning(true);
                    setTimeout(() => setShowAntiCheatWarning(false), 4500);
                  } else if (currentTime > maxWatchedSecondsRef.current) {
                    maxWatchedSecondsRef.current = currentTime;

                    // Update watch percentage based on actual continuous watch time
                    const calculatedPercent = Math.min(100, Math.round((currentTime / duration) * 100));
                    if (currentUser && lessonItem) {
                      updateLessonWatchProgress(currentUser.id, lessonItem.id, calculatedPercent);
                      if (calculatedPercent >= 98 && !isAlreadyCompleted && !marked) {
                        markLessonComplete(currentUser.id, lessonItem.id, lessonItem.xpReward);
                        setMarked(true);
                      }
                    }
                  }
                }, 500);
              } else {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
              }
            },
          },
        });
      } catch (e) {
        console.warn("YouTube Player Init error:", e);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById('youtube-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try { ytPlayerRef.current.destroy(); } catch (e) {}
      }
    };
  }, [youtubeVideoId, lessonItem?.id, currentUser?.id]);

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
    if (currentUser) {
      updateLessonWatchProgress(currentUser.id, lessonItem.id, 100);
    }
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
          {(isAlreadyCompleted || marked || currentWatchPercent === 100) && (
            <Badge variant="green" className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Lesson Title Header */}
      <div className="space-y-2">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <span>MODULE: {moduleItem?.title} • LESSON 0{lessonItem.order}</span>
          {currentWatchPercent > 0 && (
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/80 rounded-full">
              {currentWatchPercent}% WATCHED
            </span>
          )}
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

      {/* ANTI-CHEAT WARNING BANNER */}
      {showAntiCheatWarning && (
        <div className="p-3 bg-red-950/90 border-2 border-red-600 rounded-lg text-red-200 flex items-center space-x-3 text-xs font-mono font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-bounce">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>Anti-Cheat Protection: Forward video skipping is blocked! Please watch the course continuously to earn progress.</span>
        </div>
      )}

      {/* Video Player Embed & Video Watch Time Tracker */}
      {lessonItem.videoUrl && (
        <div className="space-y-3">
          <div className="w-full aspect-video bg-black rounded-lg border border-[#1f1f28] overflow-hidden shadow-2xl relative">
            <div ref={playerContainerRef} className="w-full h-full" />
          </div>

          {/* Anti-Cheat Realtime Video Watch Progress Controller */}
          <div className="p-4 bg-[#14141a] border border-[#252535] rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#222233] pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                  Anti-Cheat Watch Protection Active
                </span>
              </div>
              <div className="font-mono text-xs text-gray-300 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Watched: <strong className="text-white">{watchedHours}</strong> / {totalModuleHours} Hrs ({currentWatchPercent}%)
                </span>
              </div>
            </div>

            <ProgressBar progress={currentWatchPercent} color="cornsilk" showPercentage={false} />

            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Forward dragging blocked</span>
              </span>
              <span>Progress updates automatically during playback</span>
            </div>
          </div>
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
