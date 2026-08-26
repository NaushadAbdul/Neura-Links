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
        return <Badge variant="cornsilk">Completed ✓</Badge>;
      case 'in_progress':
        return <Badge variant="rose">In Progress</Badge>;
      case 'available':
        return <Badge variant="cornsilk">Available</Badge>;
      default:
        return <Badge variant="gray">Locked 🔒</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#674846]/40 pb-6">
        <div className="font-mono text-xs text-[#FFF8DC] uppercase tracking-widest flex items-center space-x-2 font-bold">
          <Map className="w-4 h-4 text-[#FFF8DC]" />
          <span>NEURA LINKS // AI ENGINEERING LEARNING ROADMAP</span>
        </div>
        <h1 className="font-cornsilk text-3xl sm:text-4xl font-normal text-[#FFF8DC] tracking-wide uppercase">
          Interactive AI/ML Learning Path
        </h1>
        <p className="text-sm text-[#FFF8DC]/80 max-w-3xl">
          Follow the step-by-step master roadmap to transform from Python beginner to full-stack AI Engineer.
        </p>
      </div>

      {/* Empty State */}
      {sortedNodes.length === 0 && (
        <div className="p-12 text-center bg-[#161616] border border-[#674846]/40 rounded-md space-y-3 max-w-2xl mx-auto">
          <Map className="w-10 h-10 text-[#674846] mx-auto" />
          <h3 className="font-cornsilk text-xl text-[#FFF8DC] uppercase">No Roadmap Steps Configured Yet</h3>
          <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
            There are currently no visual roadmap steps created. Once administrators define roadmap steps, they will appear here.
          </p>
        </div>
      )}

      {/* Visual Roadmap Path */}
      <div className="max-w-2xl mx-auto space-y-6 relative">
        {/* Connecting central vertical line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#674846] via-[#FFF8DC] to-[#674846] -translate-x-1/2 z-0 hidden sm:block" />

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
                    ? 'border-[#FFF8DC]/60 bg-[#1c1817]'
                    : isInProgress
                    ? 'border-[#674846] bg-[#1e1516] shadow-[0_0_25px_rgba(103,72,70,0.4)]'
                    : isAvailable
                    ? 'border-[#674846]/40 bg-[#161616]'
                    : 'border-[#3b2827] opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-gray-400">
                        STEP 0{node.order}
                      </span>
                      {getStatusBadge(node.status)}
                    </div>

                    <h3 className="font-cornsilk text-xl font-normal text-[#FFF8DC] tracking-wide uppercase">
                      {node.title}
                    </h3>
                    <p className="text-xs text-gray-300 font-sans">
                      {node.description}
                    </p>
                  </div>

                  {!isLocked && (
                    <button
                      onClick={() => navigate('/learning')}
                      className="bg-[#674846] hover:bg-[#7e5957] border border-[#FFF8DC]/40 text-[#FFF8DC] font-heading text-xs uppercase tracking-wider py-2 px-4 rounded-md transition-all self-start sm:self-auto flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <PlayCircle className="w-3.5 h-3.5 text-[#FFF8DC]" />
                    </button>
                  )}
                </div>
              </Card>

              {/* Connecting arrow down */}
              {index < sortedNodes.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown className={`w-4 h-4 ${isCompleted ? 'text-[#FFF8DC]' : 'text-gray-600'}`} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
