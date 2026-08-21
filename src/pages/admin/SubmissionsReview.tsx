import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import type { Submission } from '../../types';
import {
  FileCheck,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  User,
  Code2,
} from 'lucide-react';

export const SubmissionsReview: React.FC = () => {
  const { submissions, reviewSubmission } = useData();
  const { currentUser } = useAuth();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'under_review' | 'approved' | 'rejected'>('under_review');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const filteredSubs = submissions.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  const handleOpenReview = (sub: Submission) => {
    setSelectedSub(sub);
    setFeedbackText(sub.feedback || '');
    setReviewModalOpen(true);
  };

  const handleAction = (status: 'approved' | 'rejected' | 'changes_requested') => {
    if (!selectedSub || !currentUser) return;
    reviewSubmission(
      selectedSub.id,
      status,
      feedbackText.trim() || (status === 'approved' ? 'Great implementation! Code approved.' : 'Please revise submission.'),
      currentUser.name
    );
    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <FileCheck className="w-4 h-4" />
          <span>NEURA LINKS // ADMIN SUBMISSION EVALUATION QUEUE</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Task & Project Code Review
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Inspect student GitHub code repositories and live application deployments. Approve submissions to automatically grant XP and update competency analytics.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 font-mono text-xs">
        <button
          onClick={() => setFilterStatus('under_review')}
          className={`px-4 py-2 rounded-md uppercase font-bold transition-all ${
            filterStatus === 'under_review' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-[#111116] text-gray-400 border border-[#1f1f28]'
          }`}
        >
          Pending Review ({submissions.filter(s => s.status === 'under_review').length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 rounded-md uppercase font-bold transition-all ${
            filterStatus === 'approved' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-[#111116] text-gray-400 border border-[#1f1f28]'
          }`}
        >
          Approved ({submissions.filter(s => s.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 rounded-md uppercase font-bold transition-all ${
            filterStatus === 'ALL' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-[#111116] text-gray-400 border border-[#1f1f28]'
          }`}
        >
          All Submissions ({submissions.length})
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubs.length > 0 ? (
          filteredSubs.map((sub) => (
            <Card key={sub.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f1f28] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-heading text-lg font-bold text-white">{sub.targetTitle}</span>
                    <Badge variant={sub.type === 'project' ? 'purple' : 'cyan'}>{sub.type}</Badge>
                  </div>
                  <div className="font-mono text-xs text-gray-400 flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Student: <strong className="text-white">{sub.studentName}</strong> ({sub.studentEmail})</span>
                  </div>
                </div>

                <Badge
                  variant={
                    sub.status === 'approved'
                      ? 'green'
                      : sub.status === 'rejected'
                      ? 'red'
                      : sub.status === 'changes_requested'
                      ? 'yellow'
                      : 'purple'
                  }
                >
                  {sub.status === 'under_review' ? 'Pending Review' : sub.status}
                </Badge>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={sub.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#181824] border border-[#272738] hover:border-purple-500 text-xs font-mono text-gray-200 hover:text-white rounded-md transition-all flex items-center space-x-2"
                >
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Inspect GitHub Repository</span>
                </a>

                {sub.liveDemoUrl && (
                  <a
                    href={sub.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-[#181824] border border-[#272738] hover:border-cyan-500 text-xs font-mono text-gray-200 hover:text-white rounded-md transition-all flex items-center space-x-2"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Open Live Application Demo</span>
                  </a>
                )}
              </div>

              {sub.documentation && (
                <div className="p-3 bg-[#0a0a0e] border border-[#1f1f2a] rounded text-xs text-gray-300 font-sans">
                  <span className="font-mono text-[10px] text-gray-500 uppercase block mb-1">Student Documentation Notes:</span>
                  {sub.documentation}
                </div>
              )}

              {sub.feedback && (
                <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded text-xs text-purple-200 font-mono">
                  <span className="font-bold text-purple-400 uppercase text-[10px] block">Previous Feedback by {sub.reviewedBy}:</span>
                  "{sub.feedback}"
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-[#1a1a24]">
                <span className="font-mono text-[11px] text-gray-500">Submitted: {sub.submittedAt}</span>

                <button
                  onClick={() => handleOpenReview(sub)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2 px-5 rounded-md transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-1"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Evaluate Submission</span>
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 font-mono text-xs bg-[#111116] border border-[#1f1f28] rounded-md">
            No submissions in this filter status.
          </div>
        )}
      </div>

      {/* Review Drawer Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review Submission: ${selectedSub?.targetTitle}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#0a0a0e] border border-[#1f1f2a] rounded space-y-1 font-mono text-xs">
            <div>Student: <span className="text-white font-bold">{selectedSub?.studentName}</span> ({selectedSub?.studentEmail})</div>
            <div>GitHub: <a href={selectedSub?.githubUrl} target="_blank" rel="noreferrer" className="text-purple-400 underline">{selectedSub?.githubUrl}</a></div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Admin Feedback & Code Review Notes</span>
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. Your model works well! Improve data visualization plots and add README documentation before final approval."
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>

          {/* Action Buttons: APPROVE / REJECT / REQUEST CHANGES */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#1f1f28]">
            <button
              type="button"
              onClick={() => handleAction('approved')}
              className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-xs uppercase font-extrabold tracking-wider rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>[ APPROVE (+XP) ]</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('changes_requested')}
              className="py-3 bg-amber-600 hover:bg-amber-500 text-white font-heading text-xs uppercase font-bold tracking-wider rounded-md flex items-center justify-center space-x-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>[ REQUEST CHANGES ]</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('rejected')}
              className="py-3 bg-rose-700 hover:bg-rose-600 text-white font-heading text-xs uppercase font-bold tracking-wider rounded-md flex items-center justify-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>[ REJECT ]</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
