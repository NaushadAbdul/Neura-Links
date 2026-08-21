import React from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { Map, CheckCircle2, PlayCircle, Lock, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const VisualRoadmap: React.FC = () => {
  const { roadmapNodes } = useData();
  const navigate = useNavigate();

  const sortedNodes = [...roadmapNodes].sort((a, b) => a.order - b.order);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green">Completed ✓</Badge>;
      case 'in_progress':
        return <Badge variant="purple">In Progress</Badge>;
      case 'available':
        return <Badge variant="cyan">Available</Badge>;
      default:
        return <Badge variant="gray">Locked 🔒</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <Map className="w-4 h-4" />
          <span>NEURA LINKS // AI ENGINEERING LEARNING ROADMAP</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Interactive AI/ML Learning Path
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Follow the step-by-step master roadmap to transform from Python beginner to full-stack AI Engineer.
        </p>
      </div>

      {/* Visual Roadmap Path */}
      <div className="max-w-2xl mx-auto space-y-6 relative">
        {/* Connecting central vertical line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-600 via-cyan-500 to-gray-800 -translate-x-1/2 z-0 hidden sm:block" />

        {sortedNodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in_progress';
          const isAvailable = node.status === 'available';
          const isLocked = node.status === 'locked';

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative z-10 space-y-4"
            >
              <Card
                className={`transition-all duration-300 ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-[#0e1713]'
                    : isInProgress
                    ? 'border-purple-500/60 bg-[#161322] shadow-[0_0_25px_rgba(139,92,246,0.2)]'
                    : isAvailable
                    ? 'border-cyan-500/40 bg-[#0d161a]'
                    : 'border-[#1f1f28] opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-gray-500">
                        STEP 0{node.order}
                      </span>
                      {getStatusBadge(node.status)}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white tracking-wider uppercase">
                      {node.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      {node.description}
                    </p>
                  </div>

                  {!isLocked && (
                    <button
                      onClick={() => navigate('/learning')}
                      className="bg-[#1a1a26] hover:bg-purple-900/60 border border-[#2a2a3c] text-white font-heading text-xs uppercase tracking-wider py-2 px-4 rounded-md transition-all self-start sm:self-auto flex items-center space-x-1"
                    >
                      <span>Explore</span>
                      <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  )}
                </div>
              </Card>

              {/* Connecting arrow down */}
              {index < sortedNodes.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-gray-600'}`} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
