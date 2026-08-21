import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Task, Project } from '../../types';
import { ListTodo, Plus, Trash2, Edit2, Zap, Trophy } from 'lucide-react';

export const TasksProjectsCMS: React.FC = () => {
  const {
    tasks,
    projects,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskPublish,
    createProject,
    updateProject,
    deleteProject,
    toggleProjectPublish,
  } = useData();

  const [activeTab, setActiveTab] = useState<'tasks' | 'projects'>('tasks');

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskInst, setTaskInst] = useState('');
  const [taskXp, setTaskXp] = useState(50);
  const [taskDifficulty, setTaskDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Expert'>('Medium');
  const [taskDeadline, setTaskDeadline] = useState('2026-09-01');

  // Project Modal state
  const [projModalOpen, setProjModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('Python, PyTorch, FastAPI, React');
  const [projXp, setProjXp] = useState(300);
  const [projDifficulty, setProjDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Expert'>('Hard');
  const [projDeadline, setProjDeadline] = useState('2026-09-20');

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskDesc(task.description);
      setTaskInst(task.instructions);
      setTaskXp(task.xpReward);
      setTaskDifficulty(task.difficulty);
      setTaskDeadline(task.deadline);
    } else {
      setEditingTask(null);
      setTaskTitle('');
      setTaskDesc('');
      setTaskInst('');
      setTaskXp(50);
      setTaskDifficulty('Medium');
      setTaskDeadline('2026-09-01');
    }
    setTaskModalOpen(true);
  };

  const handleOpenProjModal = (proj?: Project) => {
    if (proj) {
      setEditingProj(proj);
      setProjTitle(proj.title);
      setProjProblem(proj.problemStatement);
      setProjDesc(proj.description);
      setProjTech(proj.technologies.join(', '));
      setProjXp(proj.xpReward);
      setProjDifficulty(proj.difficulty);
      setProjDeadline(proj.deadline);
    } else {
      setEditingProj(null);
      setProjTitle('');
      setProjProblem('');
      setProjDesc('');
      setProjTech('Python, PyTorch, FastAPI, React');
      setProjXp(300);
      setProjDifficulty('Hard');
      setProjDeadline('2026-09-20');
    }
    setProjModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        instructions: taskInst.trim(),
        difficulty: taskDifficulty,
        xpReward: Number(taskXp),
        deadline: taskDeadline,
      });
    } else {
      createTask({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        instructions: taskInst.trim(),
        moduleId: 'mod_ml_01',
        difficulty: taskDifficulty,
        xpReward: Number(taskXp),
        deadline: taskDeadline,
        requirements: ['Clean Code Notebook', 'GitHub Repo Link'],
        published: true,
      });
    }
    setTaskModalOpen(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const techArray = projTech.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProj) {
      updateProject({
        ...editingProj,
        title: projTitle.trim(),
        problemStatement: projProblem.trim(),
        description: projDesc.trim(),
        technologies: techArray,
        difficulty: projDifficulty,
        xpReward: Number(projXp),
        deadline: projDeadline,
      });
    } else {
      createProject({
        title: projTitle.trim(),
        problemStatement: projProblem.trim(),
        description: projDesc.trim(),
        skillsRequired: ['Python', 'AI Engineering', 'Full Stack'],
        difficulty: projDifficulty,
        technologies: techArray,
        deadline: projDeadline,
        type: 'individual',
        xpReward: Number(projXp),
        requirements: ['Complete EDA notebook', 'Saved model artifact', 'Functional Web UI'],
        published: true,
      });
    }
    setProjModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2 border-b border-[#2a2224] pb-6">
        <div className="font-inconsolata text-xs text-[#B38F6F] uppercase tracking-widest flex items-center space-x-2">
          <ListTodo className="w-4 h-4 text-[#710014]" />
          <span>NEURA LINKS // TASKS & PROJECTS SPECIFICATION CMS</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#F2F1ED] tracking-wider uppercase">
          Tasks & Major Projects CMS
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl font-inconsolata">
          Create task specifications, major project specifications, set deadlines, configure XP rewards, and toggle visibility.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2224] pb-3">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'tasks' ? 'border-[#710014] text-[#F2F1ED]' : 'border-transparent text-gray-400'
            }`}
          >
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`font-heading text-sm uppercase tracking-wider font-bold border-b-2 pb-2 transition-all cursor-pointer ${
              activeTab === 'projects' ? 'border-[#710014] text-[#F2F1ED]' : 'border-transparent text-gray-400'
            }`}
          >
            Major Projects ({projects.length})
          </button>
        </div>

        <button
          onClick={() => activeTab === 'tasks' ? handleOpenTaskModal() : handleOpenProjModal()}
          className="bg-[#710014] hover:bg-[#90001a] text-[#F2F1ED] font-heading text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-md shadow-[0_0_15px_rgba(113,0,20,0.5)] flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New {activeTab === 'tasks' ? 'Task Spec' : 'Project Spec'}</span>
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.map((t) => (
            <Card key={t.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Badge variant="cyan">{t.difficulty}</Badge>
                  <span className="font-inconsolata text-xs text-yellow-400 font-bold">+{t.xpReward} XP</span>
                </div>
                <button onClick={() => toggleTaskPublish(t.id)} className="cursor-pointer">
                  {t.published ? <Badge variant="green">Published</Badge> : <Badge variant="red">Hidden</Badge>}
                </button>
              </div>

              <h3 className="font-heading text-base font-bold text-[#F2F1ED] uppercase">{t.title}</h3>
              <p className="text-xs text-gray-400 font-inconsolata">{t.description}</p>

              <div className="pt-2 border-t border-[#2a2224] flex justify-between items-center text-xs font-inconsolata">
                <span className="text-gray-500">Deadline: {t.deadline}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenTaskModal(t)} className="p-1.5 bg-[#161616] hover:bg-[#262626] border border-[#710014] text-[#F2F1ED] rounded cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 text-[#B38F6F]" />
                  </button>
                  <button onClick={() => deleteTask(t.id)} className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {projects.map((p) => (
            <Card key={p.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Badge variant="purple">{p.difficulty}</Badge>
                  <span className="font-inconsolata text-xs text-yellow-400 font-bold">+{p.xpReward} XP</span>
                </div>
                <button onClick={() => toggleProjectPublish(p.id)} className="cursor-pointer">
                  {p.published ? <Badge variant="green">Published</Badge> : <Badge variant="red">Hidden</Badge>}
                </button>
              </div>

              <h3 className="font-heading text-base font-bold text-[#F2F1ED] uppercase">{p.title}</h3>
              <p className="text-xs text-gray-400 font-inconsolata">{p.description}</p>

              <div className="flex flex-wrap gap-1">
                {p.technologies.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#161616] border border-[#2a2224] text-[10px] font-inconsolata text-gray-300 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-[#2a2224] flex justify-between items-center text-xs font-inconsolata">
                <span className="text-gray-500">Deadline: {p.deadline}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenProjModal(p)} className="p-1.5 bg-[#161616] hover:bg-[#262626] border border-[#710014] text-[#F2F1ED] rounded cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 text-[#B38F6F]" />
                  </button>
                  <button onClick={() => deleteProject(p.id)} className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Modal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} title={editingTask ? 'Edit Task Spec' : 'Create New Task Spec'}>
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Task Title *</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Build SMOTE Classification Model"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-[#710014]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Description</label>
            <input
              type="text"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Detailed Instructions</label>
            <textarea
              rows={3}
              value={taskInst}
              onChange={(e) => setTaskInst(e.target.value)}
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">XP Reward</label>
              <input
                type="number"
                value={taskXp}
                onChange={(e) => setTaskXp(Number(e.target.value))}
                className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Deadline Date</label>
              <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#2a2224]">
            <button type="button" onClick={() => setTaskModalOpen(false)} className="px-4 py-2 bg-[#161616] text-gray-300 font-heading text-xs uppercase rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#710014] text-white font-heading text-xs uppercase font-bold rounded-md">Save Task Spec</button>
          </div>
        </form>
      </Modal>

      {/* Project Modal */}
      <Modal isOpen={projModalOpen} onClose={() => setProjModalOpen(false)} title={editingProj ? 'Edit Major Project' : 'Create Major Project Spec'}>
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Project Title *</label>
            <input
              type="text"
              required
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              placeholder="e.g. Autonomous AI Agent Customer Support SaaS"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none focus:border-[#710014]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Problem Statement</label>
            <input
              type="text"
              value={projProblem}
              onChange={(e) => setProjProblem(e.target.value)}
              placeholder="Describe the real-world problem students are solving..."
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Technologies (Comma separated)</label>
            <input
              type="text"
              value={projTech}
              onChange={(e) => setProjTech(e.target.value)}
              placeholder="Python, LangChain, Pinecone, FastAPI"
              className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">XP Reward</label>
              <input
                type="number"
                value={projXp}
                onChange={(e) => setProjXp(Number(e.target.value))}
                className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-[#B38F6F] uppercase font-bold">Deadline Date</label>
              <input
                type="date"
                value={projDeadline}
                onChange={(e) => setProjDeadline(e.target.value)}
                className="w-full p-3 bg-[#161616] border border-[#2a2224] text-xs text-[#F2F1ED] font-inconsolata rounded-md outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#2a2224]">
            <button type="button" onClick={() => setProjModalOpen(false)} className="px-4 py-2 bg-[#161616] text-gray-300 font-heading text-xs uppercase rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#710014] text-white font-heading text-xs uppercase font-bold rounded-md">Save Project Spec</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
