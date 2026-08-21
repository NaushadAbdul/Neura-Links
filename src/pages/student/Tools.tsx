import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { ToolCategory } from '../../types';
import {
  Wrench,
  ExternalLink,
  MessageSquare,
  Bot,
  Code,
  Globe,
  Cpu,
  Terminal,
  Sparkles,
} from 'lucide-react';

export const ToolsDirectory: React.FC = () => {
  const { tools } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ToolCategory[] = ['AI Tools', 'Development', 'ML/Data', 'AI Engineering'];

  const publishedTools = tools.filter(t => t.published);

  const filteredTools = publishedTools.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.useCase.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return MessageSquare;
      case 'Bot': return Bot;
      case 'Code': return Code;
      case 'Globe': return Globe;
      case 'Cpu': return Cpu;
      case 'Terminal': return Terminal;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <Wrench className="w-4 h-4" />
          <span>NEURA LINKS // AI & ML TOOLS DIRECTORY</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Essential AI Engineering Tools
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Curated industry tools, LLM platforms, frameworks, vector databases, and developer environments recommended for club members.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="max-w-md">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search AI tools, IDEs, frameworks..." />
        </div>

        {/* Category Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'bg-[#111116] text-gray-400 hover:bg-[#1a1a24] border border-[#1f1f28]'
            }`}
          >
            All Categories ({publishedTools.length})
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

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const IconComp = getIconComponent(tool.iconName);

          return (
            <Card key={tool.id} className="space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded bg-[#181824] border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:border-purple-400 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <Badge variant="cyan">{tool.skillLevel}</Badge>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                    {tool.name}
                  </h3>
                  <div className="font-mono text-[10px] text-purple-400 uppercase tracking-widest mt-0.5">
                    {tool.category}
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {tool.description}
                </p>

                <div className="p-3 bg-[#0a0a0e] border border-[#1f1f2a] rounded-md space-y-1">
                  <div className="font-mono text-[10px] text-gray-500 uppercase">Primary Use Case</div>
                  <div className="text-xs text-gray-300 font-sans">{tool.useCase}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1a1a24]">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#181824] hover:bg-purple-900/60 border border-[#272738] text-white font-heading text-xs uppercase tracking-wider py-2.5 px-4 rounded-md transition-all flex items-center justify-center space-x-2 group-hover:border-purple-500/50"
                >
                  <span>Launch Official Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
