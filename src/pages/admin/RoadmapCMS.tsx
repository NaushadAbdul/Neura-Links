import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { RoadmapNode } from '../../types';
import { GitFork, Plus, Edit2, Trash2 } from 'lucide-react';

export const RoadmapCMS: React.FC = () => {
  const { roadmapNodes, createRoadmapNode, updateRoadmapNode, deleteRoadmapNode } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<RoadmapNode | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'locked' | 'available' | 'in_progress' | 'completed'>('available');

  const handleOpenModal = (node?: RoadmapNode) => {
    if (node) {
      setEditingNode(node);
      setTitle(node.title);
      setDescription(node.description);
      setStatus(node.status);
    } else {
      setEditingNode(null);
      setTitle('');
      setDescription('');
      setStatus('available');
    }
    setModalOpen(true);
  };

  const handleDeleteNode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this roadmap step?')) {
      deleteRoadmapNode(id);
      if (editingNode?.id === id) {
        setModalOpen(false);
      }
    }
  };

  const handleCycleStatus = (node: RoadmapNode) => {
    const nextStatusMap: Record<RoadmapNode['status'], RoadmapNode['status']> = {
      'locked': 'available',
      'available': 'in_progress',
      'in_progress': 'completed',
      'completed': 'locked',
    };
    updateRoadmapNode({
      ...node,
      status: nextStatusMap[node.status],
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingNode) {
      updateRoadmapNode({
        ...editingNode,
        title: title.trim(),
        description: description.trim(),
        status,
      });
    } else {
      createRoadmapNode({
        order: roadmapNodes.length + 1,
        title: title.trim(),
        description: description.trim(),
        status,
        prerequisiteIds: roadmapNodes.length > 0 ? [roadmapNodes[roadmapNodes.length - 1].id] : [],
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2224] pb-6">
        <div className="space-y-1">
          <div className="font-inconsolata text-xs text-[#B38F6F] uppercase tracking-widest flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-[#710014]" />
            <span>NEURA LINKS // LEARNING PATH NODE EDITOR</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-[#F2F1ED] tracking-wider uppercase">
            Roadmap Path Editor
          </h1>
          <p className="text-sm text-gray-400 max-w-3xl font-inconsolata">
            Configure visual roadmap steps from Python foundations to AI Agents and enterprise deployment. Click status badges to cycle node availability.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#710014] hover:bg-[#90001a] text-[#F2F1ED] font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md shadow-[0_0_15px_rgba(113,0,20,0.5)] flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Roadmap Step</span>
        </button>
      </div>

      {/* Nodes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmapNodes.map((node) => (
          <Card key={node.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-inconsolata text-xs text-[#B38F6F] font-bold">STEP 0{node.order}</span>
              
              <button
                onClick={() => handleCycleStatus(node)}
                title="Click to cycle status (Locked -> Available -> In Progress -> Completed)"
                className="cursor-pointer"
              >
                <Badge
                  variant={
                    node.status === 'completed'
                      ? 'green'
                      : node.status === 'in_progress'
                      ? 'yellow'
                      : node.status === 'available'
                      ? 'purple'
                      : 'gray'
                  }
                >
                  {node.status.toUpperCase()} ⚡
                </Badge>
              </button>
            </div>

            <h3 className="font-heading text-base font-bold text-[#F2F1ED] uppercase tracking-wide">
              {node.title}
            </h3>

            <p className="text-xs text-gray-400 font-inconsolata">{node.description}</p>

            <div className="pt-2 border-t border-[#2a2224] flex justify-end space-x-2">
              <button
                onClick={() => handleDeleteNode(node.id)}
                className="p-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 font-heading text-xs uppercase rounded flex items-center space-x-1 cursor-pointer transition-colors"
                title="Delete Roadmap Step"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => handleOpenModal(node)}
                className="p-1.5 bg-[#161616] hover:bg-[#262626] border border-[#710014] text-[#F2F1ED] font-heading text-xs uppercase rounded flex items-center space-x-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#B38F6F]" />
                <span>Edit Node</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNode ? `Edit Roadmap Step 0${editingNode.order}` : 'Add New Roadmap Step'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Step Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MULTI-AGENT SWARMS"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-[#710014]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Node Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            >
              <option value="locked">Locked</option>
              <option value="available">Available</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of skills and concepts taught in this step..."
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#2a2224]">
            {editingNode ? (
              <button
                type="button"
                onClick={() => handleDeleteNode(editingNode.id)}
                className="px-3 py-2 bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 font-heading text-xs uppercase rounded-md flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete Node</span>
              </button>
            ) : <div />}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-[#161616] hover:bg-[#252535] text-gray-300 font-heading text-xs uppercase rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#710014] hover:bg-[#90001a] text-white font-heading text-xs uppercase font-bold rounded-md shadow-[0_0_15px_rgba(113,0,20,0.5)] cursor-pointer"
              >
                Save Roadmap Node
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
