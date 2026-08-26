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
      <div className="space-y-2 border-b border-[#674846]/40 pb-6">
        <div className="font-mono text-xs text-[#FFF8DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
          <Wrench className="w-4 h-4 text-[#FFF8DC]" />
          <span>NEURA LINKS // AI & ML TOOLS DIRECTORY</span>
        </div>
        <h1 className="font-cornsilk text-3xl sm:text-4xl font-normal text-[#FFF8DC] tracking-wide uppercase">
          Essential AI Engineering Tools
        </h1>
        <p className="text-sm text-[#FFF8DC]/80 max-w-3xl">
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
            className={`px-4 py-2 rounded-md font-heading text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#674846] text-[#FFF8DC] border border-[#FFF8DC]/40 font-bold shadow-[0_0_15px_rgba(103,72,70,0.5)]'
                : 'bg-[#161616] text-gray-400 hover:text-[#FFF8DC] hover:bg-[#262626] border border-[#674846]/40'
            }`}
          >
            All Categories ({publishedTools.length})
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
      {filteredTools.length === 0 && (
        <div className="p-12 text-center bg-[#161616] border border-[#674846]/40 rounded-md space-y-3">
          <Wrench className="w-10 h-10 text-[#674846] mx-auto" />
          <h3 className="font-cornsilk text-xl text-[#FFF8DC] uppercase">No AI Tools Added Yet</h3>
          <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
            There are currently no AI tools listed in the directory. Once administrators publish tool recommendations, they will appear here.
          </p>
        </div>
      )}

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const IconComp = getIconComponent(tool.iconName);

          return (
            <Card key={tool.id} className="space-y-4 flex flex-col justify-between group border-[#674846]/40 bg-[#161616] hover:border-[#FFF8DC]/60">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded bg-[#674846] border border-[#FFF8DC]/40 flex items-center justify-center text-[#FFF8DC] shadow-md">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <Badge variant="cornsilk">{tool.skillLevel}</Badge>
                </div>

                <div>
                  <h3 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide group-hover:text-white transition-colors">
                    {tool.name}
                  </h3>
                  <div className="font-mono text-[10px] text-[#FFF8DC] uppercase tracking-widest mt-0.5 font-bold">
                    {tool.category}
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {tool.description}
                </p>

                <div className="p-3 bg-[#161616] border border-[#674846]/40 rounded-md space-y-1">
                  <div className="font-mono text-[10px] text-gray-400 uppercase">Primary Use Case</div>
                  <div className="text-xs text-[#FFF8DC] font-sans">{tool.useCase}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#674846]/40">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#674846] hover:bg-[#7e5957] border border-[#FFF8DC]/40 text-[#FFF8DC] font-heading text-xs uppercase tracking-wider py-2.5 px-4 rounded-md transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <span>Launch Official Tool</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFF8DC]" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
