import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { ResourceCategory } from '../../types';
import {
  FolderGit2,
  FileText,
  Video,
  ExternalLink,
  Download,
  BookOpen,
  Calendar,
  User,
  Globe,
} from 'lucide-react';

export const ResourcesCatalog: React.FC = () => {
  const { resources } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ResourceCategory[] = [
    'Notes',
    'PDFs',
    'Study Materials',
    'YouTube Videos',
    'Articles',
    'Documentation',
    'Cheat Sheets',
    'Research Papers',
    'Useful Websites',
  ];

  const publishedResources = resources.filter(r => r.published);

  const filteredResources = publishedResources.filter(r => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#674846]/40 pb-6">
        <div className="font-mono text-xs text-[#FFF8DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
          <FolderGit2 className="w-4 h-4 text-[#FFF8DC]" />
          <span>NEURA LINKS // ADMIN RESOURCE REPOSITORY</span>
        </div>
        <h1 className="font-cornsilk text-3xl sm:text-4xl font-normal text-[#FFF8DC] tracking-wide uppercase">
          Learning & Research Materials
        </h1>
        <p className="text-sm text-[#FFF8DC]/80 max-w-3xl">
          Curated notes, research papers, cheat sheets, video courses, and official documentation published directly by club administrators.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="max-w-md">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search PDFs, cheat sheets, papers..." />
        </div>

        {/* Category Pills Horizontal Scroll */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#674846] text-[#FFF8DC] border border-[#FFF8DC]/40 font-bold shadow-[0_0_15px_rgba(103,72,70,0.5)]'
                : 'bg-[#161616] text-gray-400 hover:text-[#FFF8DC] hover:bg-[#262626] border border-[#674846]/40'
            }`}
          >
            All Resources ({publishedResources.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#674846] text-[#FFF8DC] border border-[#FFF8DC]/40 font-bold shadow-[0_0_15px_rgba(103,72,70,0.5)]'
                  : 'bg-[#161616] text-gray-400 hover:text-[#FFF8DC] hover:bg-[#262626] border border-[#674846]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="p-12 text-center bg-[#161616] border border-[#674846]/40 rounded-md space-y-3">
          <FolderGit2 className="w-10 h-10 text-[#674846] mx-auto" />
          <h3 className="font-cornsilk text-xl text-[#FFF8DC] uppercase">No Materials Published Yet</h3>
          <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
            There are currently no learning resources published. Once administrators upload notes, cheat sheets, papers, or videos, they will appear here.
          </p>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <Card key={res.id} className="space-y-4 flex flex-col justify-between group border-[#674846]/40 bg-[#161616] hover:border-[#FFF8DC]/60">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="rose">{res.category}</Badge>
                <span className="font-mono text-xs text-gray-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FFF8DC]" />
                  <span>{res.uploadedDate}</span>
                </span>
              </div>

              <div>
                <h3 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide group-hover:text-white transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs text-gray-300 font-sans mt-1">
                  {res.description}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-400 pt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-[#FFF8DC]" />
                  <span>By {res.author}</span>
                </span>
                {res.fileType && (
                  <>
                    <span>•</span>
                    <span className="text-[#FFF8DC] font-bold">{res.fileType}</span>
                  </>
                )}
              </div>
            </div>

            {/* Resource Contents Index (Provided by Admin) */}
            <div className="pt-3 border-t border-[#674846]/40 space-y-2">
              <div className="font-mono text-[10px] text-[#FFF8DC] uppercase font-bold tracking-wider flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FFF8DC]" />
                <span>Materials Provided by Admin:</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {/* PDF / Notes Index Item */}
                {(res.url.startsWith('data:') || res.category === 'PDFs' || res.category === 'Notes' || res.category === 'Cheat Sheets' || res.category === 'Research Papers') && (
                  <div className="flex items-center justify-between p-2 bg-[#111116] border border-[#674846]/40 rounded">
                    <span className="flex items-center space-x-2 text-gray-300">
                      <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate max-w-[170px] sm:max-w-[200px]">
                        Notes — PDF Document
                      </span>
                    </span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      download={res.url.startsWith('data:') ? `${res.title.replace(/\s+/g, '_')}.pdf` : undefined}
                      className="px-3 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/80 rounded text-[11px] font-bold flex items-center space-x-1 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Open PDF Notes</span>
                      <Download className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* YouTube Video Index Item */}
                {(res.youtubeUrl || res.category === 'YouTube Videos' || res.url.includes('youtube.com') || res.url.includes('youtu.be')) && (
                  <div className="flex items-center justify-between p-2 bg-[#111116] border border-[#674846]/40 rounded">
                    <span className="flex items-center space-x-2 text-gray-300">
                      <Video className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>YouTube — Video Link</span>
                    </span>
                    <a
                      href={res.youtubeUrl || res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/80 rounded text-[11px] font-bold flex items-center space-x-1 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Watch Video</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Web Link / GitHub / Documentation Index Item */}
                {!res.url.startsWith('data:') && !res.url.includes('youtube.com') && !res.url.includes('youtu.be') && (
                  <div className="flex items-center justify-between p-2 bg-[#111116] border border-[#674846]/40 rounded">
                    <span className="flex items-center space-x-2 text-gray-300">
                      <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {res.url.includes('github.com') ? 'GitHub — Code Repo' : 'Web — Documentation'}
                      </span>
                    </span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-[#674846] hover:bg-[#7e5957] text-[#FFF8DC] border border-[#FFF8DC]/40 rounded text-[11px] font-bold flex items-center space-x-1 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Visit Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
