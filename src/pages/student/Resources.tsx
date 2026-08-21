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
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <FolderGit2 className="w-4 h-4" />
          <span>NEURA LINKS // ADMIN RESOURCE REPOSITORY</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Learning & Research Materials
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
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
            className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'bg-[#111116] text-gray-400 hover:bg-[#1a1a24] border border-[#1f1f28]'
            }`}
          >
            All Resources ({publishedResources.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'bg-[#111116] text-gray-400 hover:bg-[#1a1a24] border border-[#1f1f28]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <Card key={res.id} className="space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="purple">{res.category}</Badge>
                <span className="font-mono text-xs text-gray-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{res.uploadedDate}</span>
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs text-gray-300 font-sans mt-1">
                  {res.description}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-500 pt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>By {res.author}</span>
                </span>
                {res.fileType && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">{res.fileType}</span>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1a24]">
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#181824] hover:bg-purple-900/60 border border-[#272738] text-white font-heading text-xs uppercase tracking-wider py-2.5 px-4 rounded-md transition-all flex items-center justify-center space-x-2 group-hover:border-purple-500/50"
              >
                <span>Access Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
