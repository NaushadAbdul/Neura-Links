import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Tool, Resource } from '../../types';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  Wrench,
  ExternalLink,
  Upload,
  FileText,
  Link as LinkIcon,
  FileUp,
  X,
  Video,
} from 'lucide-react';

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

  // Resource modal state
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Resource | null>(null);
  const [resTitle, setResTitle] = useState('');
  const [resCat, setResCat] = useState<any>('Notes');
  const [resDesc, setResDesc] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resYoutubeUrl, setResYoutubeUrl] = useState('');

  // PDF File Upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');

  // Tool modal state
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
      setResYoutubeUrl(res.youtubeUrl || '');
      setPdfFile(null);
      setPdfFileName(res.fileType?.includes('.pdf') ? res.fileType : '');
      setPdfFileSize('');
    } else {
      setEditingRes(null);
      setResTitle('');
      setResCat('Notes');
      setResDesc('');
      setResUrl('');
      setResYoutubeUrl('');
      setPdfFile(null);
      setPdfFileName('');
      setPdfFileSize('');
    }
    setResourceModalOpen(true);
  };

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file (.pdf)');
      return;
    }

    setPdfFile(file);
    setPdfFileName(file.name);
    setPdfFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
    setResCat('PDFs');

    if (!resTitle.trim()) {
      setResTitle(file.name.replace(/\.pdf$/i, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setResUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfFileName('');
    setPdfFileSize('');
    setResUrl('');
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

    const finalUrl = resUrl.trim() || '#';
    const finalYoutubeUrl = resYoutubeUrl.trim();
    const fileTypeInfo = pdfFileName ? `PDF (${pdfFileName})` : (resCat === 'PDFs' ? 'PDF Document' : 'Web Resource');

    if (editingRes) {
      updateResource({
        ...editingRes,
        title: resTitle.trim(),
        category: resCat,
        description: resDesc.trim(),
        url: finalUrl,
        youtubeUrl: finalYoutubeUrl,
        fileType: fileTypeInfo,
      });
    } else {
      createResource({
        title: resTitle.trim(),
        category: resCat,
        description: resDesc.trim(),
        url: finalUrl,
        youtubeUrl: finalYoutubeUrl,
        fileType: fileTypeInfo,
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

          <div className="space-y-1.5 p-3 bg-[#111116] border border-[#2a2224] rounded-lg">
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-3.5 h-3.5 text-[#B38F6F]" />
              <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">
                Option 1 — Resource URL / File Link
              </label>
            </div>
            <input
              type="text"
              value={resUrl}
              onChange={(e) => setResUrl(e.target.value)}
              placeholder="https://github.com/pandas-dev/pandas or web link"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-[#710014]"
            />
            <span className="text-[10px] text-gray-500 font-mono block">
              Paste an external web link, GitHub repository, documentation URL, or hosted file link.
            </span>
          </div>

          <div className="space-y-2 p-3 bg-[#111116] border border-[#2a2224] rounded-lg">
            <div className="flex items-center space-x-2">
              <FileUp className="w-3.5 h-3.5 text-purple-400" />
              <label className="font-mono text-xs text-purple-300 uppercase font-bold">
                Option 2 — Upload PDF Document from Folders
              </label>
            </div>

            {pdfFileName ? (
              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-md flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-300 shrink-0" />
                  <div className="text-xs font-mono">
                    <div className="text-purple-200 font-bold truncate max-w-[220px]">{pdfFileName}</div>
                    <div className="text-purple-400 text-[10px]">{pdfFileSize || 'Uploaded'} • PDF File</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="p-1 text-gray-400 hover:text-red-400 rounded cursor-pointer"
                  title="Remove PDF file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 bg-[#161616] border-2 border-dashed border-[#2a2224] hover:border-purple-500/60 rounded-md cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-purple-400 mb-1" />
                <span className="font-mono text-xs text-purple-300 font-bold">Click to select PDF from your folders</span>
                <span className="font-mono text-[10px] text-gray-400">Supports .pdf files directly from your computer</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* SEPARATE OPTION 3: YOUTUBE VIDEO LINK */}
          <div className="space-y-1.5 p-3 bg-[#111116] border border-[#2a2224] rounded-lg">
            <div className="flex items-center space-x-2">
              <Video className="w-3.5 h-3.5 text-red-400" />
              <label className="font-mono text-xs text-red-300 uppercase font-bold">
                Option 3 — YouTube Video Link (Optional)
              </label>
            </div>
            <input
              type="text"
              value={resYoutubeUrl}
              onChange={(e) => setResYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or short link"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-red-600"
            />
            <span className="text-[10px] text-gray-500 font-mono block">
              Add a YouTube video tutorial or lecture link for students.
            </span>
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
