import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Task, Project } from '../../types';
import {
  CheckSquare,
  Trophy,
  Globe,
  Upload,
  Zap,
  Calendar,
  Code2,
  FileUp,
  FileText,
  X,
} from 'lucide-react';

export const TasksProjects: React.FC = () => {
  const { tasks, projects, submissions, submitTaskOrProject, studentProfiles } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'tasks' | 'projects'>('tasks');
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<{ type: 'task' | 'project'; item: Task | Project } | null>(null);

  // Submission Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Folder File Upload State
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionFileSize, setSubmissionFileSize] = useState('');
  const [submissionFileUrl, setSubmissionFileUrl] = useState('');

  const publishedTasks = tasks.filter(t => t.published);
  const publishedProjects = projects.filter(p => p.published);

  const getSubmissionStatus = (type: 'task' | 'project', targetId: string) => {
    const sub = submissions.find(s => s.studentId === currentUser?.id && s.type === type && s.targetId === targetId);
    return sub;
  };

  const handleOpenSubmit = (type: 'task' | 'project', item: Task | Project) => {
    setSelectedTarget({ type, item });
    setGithubUrl('');
    setLiveDemoUrl('');
    setDocumentation('');
    setSubmissionFile(null);
    setSubmissionFileName('');
    setSubmissionFileSize('');
    setSubmissionFileUrl('');
    setSuccessMsg('');
    setSubmissionModalOpen(true);
  };

  const handleFolderFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmissionFile(file);
    setSubmissionFileName(file.name);
    setSubmissionFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSubmissionFileUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSubmissionFile = () => {
    setSubmissionFile(null);
    setSubmissionFileName('');
    setSubmissionFileSize('');
    setSubmissionFileUrl('');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedTarget) return;

    if (!githubUrl.trim() && !submissionFileName) {
      alert('Please provide a GitHub Repository URL OR upload a solution file from your computer folders.');
      return;
    }

    setSubmitting(true);
    submitTaskOrProject({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      type: selectedTarget.type,
      targetId: selectedTarget.item.id,
      targetTitle: selectedTarget.item.title,
      githubUrl: githubUrl.trim() || undefined,
      uploadedFileUrl: submissionFileUrl || undefined,
      uploadedFileName: submissionFileName || undefined,
      uploadedFileSize: submissionFileSize || undefined,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      documentation: documentation.trim() || undefined,
    });

    setSubmitting(false);
    setSuccessMsg('Submission sent to admin for review!');
    setTimeout(() => {
      setSubmissionModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#706C61]/40 pb-6">
        <div className="font-mono text-xs text-[#EFE9DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
          <CheckSquare className="w-4 h-4 text-[#EFE9DC]" />
          <span>NEURA LINKS // PRACTICAL EVALUATION</span>
        </div>
        <h1 className="font-bodoni text-3xl sm:text-4xl font-normal text-[#EFE9DC] tracking-wide uppercase">
          Tasks & Major Projects
        </h1>
        <p className="text-sm text-[#EFE9DC]/80 max-w-3xl">
          Apply your AI knowledge by building real systems. Submit code repositories and live applications to earn XP and admin endorsement.
        </p>
      </div>

      {/* Dual Tab Switcher */}
      <div className="flex border-b border-[#706C61]/40 space-x-8">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 font-heading text-sm uppercase tracking-wider font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'tasks'
              ? 'border-[#EFE9DC] text-[#EFE9DC]'
              : 'border-transparent text-gray-400 hover:text-[#EFE9DC]'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-[#EFE9DC]" />
          <span>Assigned Tasks ({publishedTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 font-heading text-sm uppercase tracking-wider font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'border-[#EFE9DC] text-[#EFE9DC]'
              : 'border-transparent text-gray-400 hover:text-[#EFE9DC]'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#EFE9DC]" />
          <span>Major Projects ({publishedProjects.length})</span>
        </button>
      </div>

      {/* Tasks Tab Panel */}
      {activeTab === 'tasks' && (
        publishedTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#1c1c19] border border-[#706C61]/40 rounded-md space-y-3">
            <CheckSquare className="w-10 h-10 text-[#706C61] mx-auto" />
            <h3 className="font-bodoni text-xl text-[#EFE9DC] uppercase">No Tasks Assigned Yet</h3>
            <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
              There are currently no tasks assigned. Once administrators create learning tasks, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {publishedTasks.map((t) => {
            const sub = getSubmissionStatus('task', t.id);

            return (
              <Card key={t.id} className="space-y-4 bg-[#1c1c19] border border-[#706C61]/40 hover:border-[#EFE9DC]/60 transition-all p-6 rounded-lg shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#706C61]/30 pb-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="suede">{t.difficulty}</Badge>
                      <span className="font-mono text-xs text-[#EFE9DC] font-bold flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-[#EFE9DC]" />
                        <span>+{t.xpReward} XP</span>
                      </span>
                    </div>
                    <h3 className="font-bodoni text-xl sm:text-2xl font-normal text-[#EFE9DC] tracking-wide mt-1.5">
                      {t.title}
                    </h3>
                  </div>

                  {/* Submission Status Badge */}
                  <div>
                    {sub ? (
                      sub.status === 'approved' ? (
                        <Badge variant="almond">Approved ✓ (+{t.xpReward} XP)</Badge>
                      ) : sub.status === 'rejected' ? (
                        <Badge variant="red">Rejected</Badge>
                      ) : sub.status === 'changes_requested' ? (
                        <Badge variant="yellow">Changes Requested</Badge>
                      ) : (
                        <Badge variant="suede">Under Admin Review ⏳</Badge>
                      )
                    ) : (
                      <Badge variant="gray">Not Submitted</Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#EFE9DC]/90 font-sans leading-relaxed">{t.description}</p>

                <div className="p-3.5 bg-[#141412] border border-[#706C61]/40 rounded-md space-y-2">
                  <div className="font-mono text-[10px] text-[#EFE9DC]/70 uppercase font-bold tracking-wider">Instructions & Requirements</div>
                  <pre className="font-sans text-xs text-[#EFE9DC]/90 whitespace-pre-line leading-relaxed">
                    {t.instructions}
                  </pre>
                </div>

                {sub?.feedback && (
                  <div className="p-3 bg-[#141412] border border-[#706C61]/60 rounded-md text-xs text-[#EFE9DC] space-y-1">
                    <div className="font-mono text-[10px] uppercase font-bold text-[#EFE9DC]/80">Admin Feedback ({sub.reviewedBy})</div>
                    <div>"{sub.feedback}"</div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-xs text-gray-400 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#EFE9DC]/70" />
                    <span>Deadline: {t.deadline}</span>
                  </span>

                  <button
                    onClick={() => handleOpenSubmit('task', t)}
                    disabled={sub?.status === 'approved'}
                    className={`w-full sm:w-auto py-2.5 px-5 rounded-md font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-2 ${
                      sub?.status === 'approved'
                        ? 'bg-[#141412] text-[#EFE9DC]/60 border border-[#706C61]/40 cursor-default'
                        : 'bg-[#706C61] hover:bg-[#858074] text-[#EFE9DC] border border-[#EFE9DC]/40 shadow-[0_0_15px_rgba(112,108,97,0.4)] cursor-pointer'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{sub ? (sub.status === 'approved' ? 'Completed' : 'Resubmit Work') : 'Submit Task'}</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
        )
      )}

      {/* Projects Tab Panel */}
      {activeTab === 'projects' && (
        publishedProjects.length === 0 ? (
          <div className="p-12 text-center bg-[#1c1c19] border border-[#706C61]/40 rounded-md space-y-3">
            <Trophy className="w-10 h-10 text-[#706C61] mx-auto" />
            <h3 className="font-bodoni text-xl text-[#EFE9DC] uppercase">No Major Projects Assigned Yet</h3>
            <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
              There are currently no major projects assigned. Once administrators create projects, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {publishedProjects.map((p) => {
            const sub = getSubmissionStatus('project', p.id);

            return (
              <Card key={p.id} className="space-y-4 border-[#706C61]/40 bg-[#1c1c19] hover:border-[#EFE9DC]/60 transition-all p-6 rounded-lg shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#706C61]/30 pb-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="suede">{p.difficulty}</Badge>
                      <Badge variant="almond">{p.type} Project</Badge>
                      <span className="font-mono text-xs text-[#EFE9DC] font-bold flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-[#EFE9DC]" />
                        <span>+{p.xpReward} XP</span>
                      </span>
                    </div>
                    <h3 className="font-bodoni text-xl sm:text-2xl font-normal text-[#EFE9DC] tracking-wide mt-1.5">
                      {p.title}
                    </h3>
                  </div>

                  <div>
                    {sub ? (
                      sub.status === 'approved' ? (
                        <Badge variant="almond">Approved ✓ (+{p.xpReward} XP)</Badge>
                      ) : sub.status === 'rejected' ? (
                        <Badge variant="red">Rejected</Badge>
                      ) : sub.status === 'changes_requested' ? (
                        <Badge variant="yellow">Changes Requested</Badge>
                      ) : (
                        <Badge variant="suede">Under Admin Review ⏳</Badge>
                      )
                    ) : (
                      <Badge variant="gray">Not Submitted</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-gray-400 uppercase font-bold">Problem Statement</div>
                  <p className="text-xs text-gray-300 italic font-sans leading-relaxed">{p.problemStatement}</p>
                </div>

                <p className="text-xs text-[#EFE9DC]/90 font-sans leading-relaxed">{p.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {p.technologies.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 bg-[#141412] border border-[#706C61]/40 text-[#EFE9DC] text-[11px] font-mono rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#706C61]/30">
                  <span className="font-mono text-xs text-gray-400 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#EFE9DC]/70" />
                    <span>Deadline: {p.deadline}</span>
                  </span>

                  <button
                    onClick={() => handleOpenSubmit('project', p)}
                    disabled={sub?.status === 'approved'}
                    className={`w-full sm:w-auto py-2.5 px-5 rounded-md font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-2 ${
                      sub?.status === 'approved'
                        ? 'bg-[#141412] text-[#EFE9DC]/60 border border-[#706C61]/40 cursor-default'
                        : 'bg-[#706C61] hover:bg-[#858074] text-[#EFE9DC] border border-[#EFE9DC]/40 shadow-[0_0_15px_rgba(112,108,97,0.4)] cursor-pointer'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{sub ? (sub.status === 'approved' ? 'Project Completed' : 'Resubmit Project') : 'Submit Major Project'}</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
        )
      )}

      {/* Submission Modal Drawer */}
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        title={`Submit ${selectedTarget?.type === 'project' ? 'Project' : 'Task'}: ${selectedTarget?.item.title}`}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {/* Option 1: GitHub Repository URL */}
          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>GitHub Repository URL (Optional if file uploaded)</span>
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository-name"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] focus:border-purple-500 rounded-md text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* Option 2: Upload Solution File from Computer Folders */}
          <div className="space-y-2 p-3 bg-[#111118] border border-[#222235] rounded-lg">
            <label className="font-mono text-xs text-purple-300 uppercase font-bold flex items-center space-x-2">
              <FileUp className="w-4 h-4 text-purple-400" />
              <span>Upload Solution File / Code Project from Folders</span>
            </label>

            {submissionFileName ? (
              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-md flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-300 shrink-0" />
                  <div className="text-xs font-mono">
                    <div className="text-purple-200 font-bold truncate max-w-[240px]">{submissionFileName}</div>
                    <div className="text-purple-400 text-[10px]">{submissionFileSize || 'Uploaded'} • Local Solution File</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSubmissionFile}
                  className="p-1 text-gray-400 hover:text-red-400 rounded cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 bg-[#0a0a0e] border-2 border-dashed border-[#222230] hover:border-purple-500/60 rounded-md cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-purple-400 mb-1" />
                <span className="font-mono text-xs text-purple-300 font-bold">Click to select solution file from your folders</span>
                <span className="font-mono text-[10px] text-gray-400">Supports .zip, .ipynb, .py, .pdf, .tar.gz, .png, etc.</span>
                <input
                  type="file"
                  onChange={handleFolderFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Live Demo / App URL (Optional)</span>
            </label>
            <input
              type="text"
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
              placeholder="https://my-ai-app.streamlit.app or Vercel link"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] focus:border-purple-500 rounded-md text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">
              Documentation / Implementation Summary
            </label>
            <textarea
              rows={4}
              value={documentation}
              onChange={(e) => setDocumentation(e.target.value)}
              placeholder="Explain how you built the solution, models used, evaluation metrics achieved, and setup instructions..."
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] focus:border-purple-500 rounded-md text-xs text-white placeholder-gray-600 focus:outline-none font-sans"
            />
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-md">
              {successMsg}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1f1f28]">
            <button
              type="button"
              onClick={() => setSubmissionModalOpen(false)}
              className="px-4 py-2 bg-[#1a1a24] hover:bg-[#252535] text-gray-300 font-heading text-xs uppercase tracking-wider rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold rounded-md shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              {submitting ? 'Submitting...' : 'Send for Admin Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
