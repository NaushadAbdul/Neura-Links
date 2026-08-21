import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Tool, Resource } from '../../types';
import { FolderKanban, Plus, Trash2, Edit2, Wrench, ExternalLink } from 'lucide-react';

export const ResourcesCMS: React.FC = () => {
  const {
    tools,
    resources,
    createTool,
    updateTool,
    deleteTool,
    toggleToolPublish,
    createResource,
    updateResource,
    deleteResource,
    toggleResourcePublish,
  } = useData();

  const [activeTab, setActiveTab] = useState<'resources' | 'tools'>('resources');

  // Resource modal
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Resource | null>(null);
  const [resTitle, setResTitle] = useState('');
  const [resCat, setResCat] = useState<any>('Notes');
  const [resDesc, setResDesc] = useState('');
  const [resUrl, setResUrl] = useState('');

  // Tool modal
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolName, setToolName] = useState('');
  const [toolCat, setToolCat] = useState<any>('AI Tools');
  const [toolDesc, setToolDesc] = useState('');
  const [toolUseCase, setToolUseCase] = useState('');
  const [toolUrl, setToolUrl] = useState('');

  const handleOpenResModal = (res?: Resource) => {
    if (res) {
      setEditingRes(res);
      setResTitle(res.title);
      setResCat(res.category);
      setResDesc(res.description);
      setResUrl(res.url);
    } else {
      setEditingRes(null);
      setResTitle('');
      setResCat('Notes');
      setResDesc('');
      setResUrl('');
    }
    setResourceModalOpen(true);
  };

  const handleOpenToolModal = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setToolName(tool.name);
      setToolCat(tool.category);
      setToolDesc(tool.description);
      setToolUseCase(tool.useCase);
      setToolUrl(tool.url);
    } else {
      setEditingTool(null);
      setToolName('');
      setToolCat('AI Tools');
      setToolDesc('');
      setToolUseCase('');
      setToolUrl('');
    }
    setToolModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    if (editingRes) {
      updateResource({
        ...editingRes,
        title: resTitle.trim(),
        category: resCat,
        description: resDesc.trim(),
        url: resUrl.trim(),
      });
    } else {
      createResource({
        title: resTitle.trim(),
        category: resCat,
        description: resDesc.trim(),
        url: resUrl.trim(),
        fileType: 'PDF / Web Resource',
        uploadedDate: new Date().toISOString().split('T')[0],
        author: 'Admin // NEURA',
        published: true,
      });
    }
    setResourceModalOpen(false);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;

    if (editingTool) {
      updateTool({
        ...editingTool,
        name: toolName.trim(),
        category: toolCat,
        description: toolDesc.trim(),
        useCase: toolUseCase.trim(),
        url: toolUrl.trim(),
      });
    } else {
      createTool({
        name: toolName.trim(),
        category: toolCat,
        description: toolDesc.trim(),
        useCase: toolUseCase.trim(),
        url: toolUrl.trim(),
        skillLevel: 'All Levels',
        iconName: 'Wrench',
        published: true,
      });
    }
    setToolModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#2a2224] pb-6">
        <div className="font-inconsolata text-xs text-[#B38F6F] uppercase tracking-widest flex items-center space-x-2">
          <FolderKanban className="w-4 h-4 text-[#710014]" />
          <span>NEURA LINKS // RESOURCES & TOOLS CMS</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#F2F1ED] tracking-wider uppercase">
          Resources & Tools CMS
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl font-inconsolata">
          Publish study resources, PDFs, research papers, YouTube videos, and recommend AI/ML engineering tools.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2224] pb-3">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('resources')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'resources' ? 'border-[#710014] text-[#F2F1ED]' : 'border-transparent text-gray-400'
            }`}
          >
            Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'tools' ? 'border-[#710014] text-[#F2F1ED]' : 'border-transparent text-gray-400'
            }`}
          >
            Tools Directory ({tools.length})
          </button>
        </div>

        <button
          onClick={() => activeTab === 'resources' ? handleOpenResModal() : handleOpenToolModal()}
          className="bg-[#710014] hover:bg-[#90001a] text-[#F2F1ED] font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md shadow-[0_0_15px_rgba(113,0,20,0.5)] flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab === 'resources' ? 'Resource' : 'Tool'}</span>
        </button>
      </div>

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r) => (
            <Card key={r.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="purple">{r.category}</Badge>
                <button onClick={() => toggleResourcePublish(r.id)} className="cursor-pointer">
                  {r.published ? <Badge variant="green">Published</Badge> : <Badge variant="red">Hidden</Badge>}
                </button>
              </div>

              <h3 className="font-heading text-base font-bold text-[#F2F1ED]">{r.title}</h3>
              <p className="text-xs text-gray-400 font-inconsolata">{r.description}</p>

              <div className="pt-2 border-t border-[#2a2224] flex justify-between items-center text-xs font-inconsolata">
                <span className="text-gray-500">By {r.author}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenResModal(r)} className="p-1.5 bg-[#161616] hover:bg-[#262626] border border-[#710014] text-[#F2F1ED] rounded cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 text-[#B38F6F]" />
                  </button>
                  <button onClick={() => deleteResource(r.id)} className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Card key={t.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="cyan">{t.category}</Badge>
                <button onClick={() => toggleToolPublish(t.id)} className="cursor-pointer">
                  {t.published ? <Badge variant="green">Published</Badge> : <Badge variant="red">Hidden</Badge>}
                </button>
              </div>

              <h3 className="font-heading text-base font-bold text-[#F2F1ED]">{t.name}</h3>
              <p className="text-xs text-gray-400 font-inconsolata">{t.description}</p>
              <div className="text-xs text-[#B38F6F] font-inconsolata">Use Case: {t.useCase}</div>

              <div className="pt-2 border-t border-[#2a2224] flex justify-between items-center text-xs font-inconsolata">
                <span className="text-gray-500">{t.skillLevel}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenToolModal(t)} className="p-1.5 bg-[#161616] hover:bg-[#262626] border border-[#710014] text-[#F2F1ED] rounded cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 text-[#B38F6F]" />
                  </button>
                  <button onClick={() => deleteTool(t.id)} className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Resource Modal */}
      <Modal isOpen={resourceModalOpen} onClose={() => setResourceModalOpen(false)} title={editingRes ? 'Edit Resource' : 'Add Study Resource'}>
        <form onSubmit={handleSaveResource} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Resource Title *</label>
            <input
              type="text"
              required
              value={resTitle}
              onChange={(e) => setResTitle(e.target.value)}
              placeholder="e.g. Scikit-Learn Cheatsheet PDF"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-[#710014]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Category</label>
            <select
              value={resCat}
              onChange={(e) => setResCat(e.target.value as any)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            >
              <option value="Notes">Notes</option>
              <option value="PDFs">PDFs</option>
              <option value="Cheat Sheets">Cheat Sheets</option>
              <option value="Research Papers">Research Papers</option>
              <option value="YouTube Videos">YouTube Videos</option>
              <option value="Documentation">Documentation</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Resource URL / File Link *</label>
            <input
              type="url"
              required
              value={resUrl}
              onChange={(e) => setResUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={resDesc}
              onChange={(e) => setResDesc(e.target.value)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#2a2224]">
            <button type="button" onClick={() => setResourceModalOpen(false)} className="px-4 py-2 bg-[#161616] text-gray-300 font-heading text-xs uppercase rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#710014] text-white font-heading text-xs uppercase font-bold rounded-md">Save Resource</button>
          </div>
        </form>
      </Modal>

      {/* Tool Modal */}
      <Modal isOpen={toolModalOpen} onClose={() => setToolModalOpen(false)} title={editingTool ? 'Edit Tool Entry' : 'Add AI Tool Entry'}>
        <form onSubmit={handleSaveTool} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Tool Name *</label>
            <input
              type="text"
              required
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. LangChain & LangGraph"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-[#710014]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Tool Category</label>
            <select
              value={toolCat}
              onChange={(e) => setToolCat(e.target.value as any)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            >
              <option value="AI Tools">AI Tools</option>
              <option value="Development">Development</option>
              <option value="ML/Data">ML/Data</option>
              <option value="AI Engineering">AI Engineering</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Tool URL *</label>
            <input
              type="url"
              required
              value={toolUrl}
              onChange={(e) => setToolUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Use Case Summary</label>
            <input
              type="text"
              value={toolUseCase}
              onChange={(e) => setToolUseCase(e.target.value)}
              placeholder="e.g. Multi-agent orchestration, tool calling..."
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Description</label>
            <textarea
              rows={3}
              value={toolDesc}
              onChange={(e) => setToolDesc(e.target.value)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#2a2224]">
            <button type="button" onClick={() => setToolModalOpen(false)} className="px-4 py-2 bg-[#161616] text-gray-300 font-heading text-xs uppercase rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#710014] text-white font-heading text-xs uppercase font-bold rounded-md">Save Tool Entry</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
