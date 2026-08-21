import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Trophy, Plus, Trash2 } from 'lucide-react';

export const AchievementsCMS: React.FC = () => {
  const { achievements, createAchievement, deleteAchievement } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [bonus, setBonus] = useState(100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createAchievement({
      title,
      description: desc,
      icon,
      category: 'Custom',
      xpBonus: Number(bonus),
      conditionType: 'lessons_completed',
      targetValue: 1,
      published: true,
    });
    setModalOpen(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6 flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>NEURA LINKS // GAMIFICATION & ACHIEVEMENTS CMS</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase mt-1">
            Achievements Manager
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-heading text-xs uppercase tracking-wider font-bold py-2 px-4 rounded-md shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <Card key={ach.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-3xl">{ach.icon}</span>
              <Badge variant="purple">+{ach.xpBonus} XP</Badge>
            </div>
            <h3 className="font-heading text-base font-bold text-white">{ach.title}</h3>
            <p className="text-xs text-gray-400">{ach.description}</p>
            <div className="pt-2 border-t border-[#1a1a24] flex justify-end">
              <button onClick={() => deleteAchievement(ach.id)} className="p-1 bg-rose-950/60 text-rose-300 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Achievement Badge">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Achievement Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RAG Specialist"
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Emoji Icon</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">XP Bonus</label>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-gray-300 uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-3 bg-[#0a0a0e] border border-[#222230] text-xs text-white rounded-md"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1f1f28]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-[#1a1a24] text-gray-300 font-heading text-xs uppercase rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-heading text-xs uppercase font-bold rounded-md">Save Achievement</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
