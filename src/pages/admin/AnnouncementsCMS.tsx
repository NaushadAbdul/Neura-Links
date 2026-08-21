import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Megaphone, Plus, Trash2 } from 'lucide-react';

export const AnnouncementsCMS: React.FC = () => {
  const { announcements, createAnnouncement, deleteAnnouncement } = useData();
  const { currentUser } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createAnnouncement({
      title,
      content,
      author: currentUser?.name || 'Admin // NEURA',
      isImportant,
      published: true,
    });
    setModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6 flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
            <Megaphone className="w-4 h-4" />
            <span>NEURA LINKS // ANNOUNCEMENT BROADCAST CENTER</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase mt-1">
            Club Announcements
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2 px-4 rounded-md shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-heading text-base font-bold text-white">{a.title}</span>
                {a.isImportant && <Badge variant="red">Important</Badge>}
              </div>
              <span className="font-mono text-xs text-gray-500">{a.createdAt}</span>
            </div>

            <p className="text-xs text-gray-300 font-sans">{a.content}</p>

            <div className="pt-2 border-t border-[#1a1a24] flex justify-between items-center text-xs font-mono">
              <span className="text-purple-400 font-bold">Author: {a.author}</span>
              <button onClick={() => deleteAnnouncement(a.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Broadcast Announcement">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New GenAI Module Released 🚀"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Content</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md font-sans"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="imp"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
            <label htmlFor="imp" className="font-mono text-xs text-gray-300">Mark as High Priority / Important</label>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1f1f28]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-[#1a1a24] text-gray-300 font-heading text-xs uppercase rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-heading text-xs uppercase font-bold rounded-md">Publish Announcement</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
