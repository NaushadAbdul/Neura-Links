import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import * as models from './models/schemas.js';

dotenv.config();

if (dns.setServers) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dekuofficiaal734_db_user:So6E27e6vUJJC4LK@cluster0.w9rnqlz.mongodb.net/neura_links_club?retryWrites=true&w=majority';

const INITIAL_USERS = [
  { id: 'user_admin_01', name: 'Naushad Abdul (Admin)', email: 'naushadabdul2006@gmail.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'admin', status: 'active', joinedDate: '2026-01-01', authProvider: 'google' },
  { id: 'user_student_01', name: 'Naushad Abdul', email: 'naushad@neuralinks.club', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'student', status: 'active', joinedDate: '2026-01-15', githubUrl: 'https://github.com', authProvider: 'google' },
  { id: 'user_student_02', name: 'Rahul Kumar', email: 'rahul@neuralinks.club', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', role: 'student', status: 'active', joinedDate: '2026-02-01', githubUrl: 'https://github.com', authProvider: 'email' }
];

const INITIAL_STUDENT_PROFILES = [
  {
    userId: 'user_student_01',
    level: 5,
    levelTitle: 'LEVEL 05 — GENERATIVE AI',
    xp: 1840,
    streak: 12,
    skills: { 'Python': 90, 'Data Science': 85, 'Machine Learning': 78, 'Deep Learning': 70, 'Generative AI': 65, 'Agentic AI': 45 },
    completedModuleIds: ['mod_py_01', 'mod_ds_01', 'mod_ml_01'],
    completedLessonIds: ['les_py_01', 'les_py_02'],
    completedTaskIds: ['task_01'],
    completedProjectIds: ['proj_01'],
    unlockedAchievementIds: ['ach_01']
  }
];

const INITIAL_LEVELS = [
  { id: 'lvl_01', order: 1, title: 'LEVEL 01 — Python Foundations', description: 'Master core Python programming, data structures, and OOP concepts.', published: true },
  { id: 'lvl_02', order: 2, title: 'LEVEL 02 — Data Science & Analytics', description: 'Data manipulation with NumPy, Pandas, and Data Visualization.', published: true },
  { id: 'lvl_03', order: 3, title: 'LEVEL 03 — Machine Learning Engineering', description: 'Supervised and unsupervised ML algorithms with Scikit-Learn.', published: true },
  { id: 'lvl_04', order: 4, title: 'LEVEL 04 — Deep Learning & Neural Networks', description: 'Neural network architectures, CNNs, RNNs, PyTorch & TensorFlow.', published: true },
  { id: 'lvl_05', order: 5, title: 'LEVEL 05 — Generative AI & LLMs', description: 'Transformers, Prompt Engineering, RAG Systems, & Fine-tuning.', published: true },
  { id: 'lvl_06', order: 6, title: 'LEVEL 06 — Agentic AI Systems', description: 'Autonomous AI Agents, Multi-Agent Systems, LangGraph & AutoGen.', published: true }
];

const INITIAL_MODULES = [
  { id: 'mod_py_01', levelId: 'lvl_01', order: 1, title: 'Python Core & Data Structures', description: 'Variables, loops, lists, dicts, functions, and OOP principles.', duration: '3 Hours', difficulty: 'Beginner', published: true },
  { id: 'mod_ds_01', levelId: 'lvl_02', order: 1, title: 'Data Analysis with Pandas & NumPy', description: 'Data wrangling, cleaning, aggregation, and visualization.', duration: '4 Hours', difficulty: 'Intermediate', published: true },
  { id: 'mod_ml_01', levelId: 'lvl_03', order: 1, title: 'Supervised ML Algorithms', description: 'Linear Regression, Decision Trees, Random Forests, & Evaluation.', duration: '5 Hours', difficulty: 'Intermediate', published: true },
  { id: 'mod_genai_01', levelId: 'lvl_05', order: 1, title: 'LangChain & RAG Architectures', description: 'Building Retrieval-Augmented Generation with Vector Databases.', duration: '6 Hours', difficulty: 'Advanced', published: true }
];

const INITIAL_LESSONS = [
  {
    id: 'les_py_01',
    moduleId: 'mod_py_01',
    order: 1,
    title: 'Python Fundamentals & Control Flow',
    description: 'Learn variables, data types, conditional statements, and loops in Python.',
    objectives: ['Understand Python data types', 'Master if/else conditionals', 'Write efficient for/while loops'],
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    notesMarkdown: '# Python Syntax & Core Types\nPython is a dynamically typed, high-level programming language.',
    codeSnippet: 'name = "AI Developer"\nprint(f"Hello, {name}!")',
    xpReward: 50,
    published: true
  },
  {
    id: 'les_py_02',
    moduleId: 'mod_py_01',
    order: 2,
    title: 'Functions, Lambda & Modules',
    description: 'Structure clean code with functions, scope, and import modules.',
    objectives: ['Define functions with def', 'Use lambda functions', 'Import standard libraries'],
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    notesMarkdown: '# Python Functions\nFunctions allow reusable code blocks in Python.',
    codeSnippet: 'def add(a, b):\n    return a + b',
    xpReward: 50,
    published: true
  }
];

const INITIAL_TOOLS = [
  { id: 'tool_01', name: 'ChatGPT & GPT-4o', category: 'AI Tools', description: 'State-of-the-art conversational AI model for coding & reasoning.', useCase: 'Code explanation, debugging, & documentation', url: 'https://chatgpt.com', skillLevel: 'All Levels', iconName: 'Bot', published: true },
  { id: 'tool_02', name: 'Claude 3.5 Sonnet', category: 'AI Tools', description: 'Anthropic high-intelligence AI model specializing in technical code generation.', useCase: 'Advanced programming & systemic architecture', url: 'https://claude.ai', skillLevel: 'All Levels', iconName: 'Sparkles', published: true },
  { id: 'tool_03', name: 'LangChain', category: 'AI Engineering', description: 'Framework for developing applications powered by language models.', useCase: 'Chains, Agents, and RAG pipelines', url: 'https://langchain.com', skillLevel: 'Intermediate', iconName: 'Cpu', published: true }
];

const INITIAL_RESOURCES = [
  { id: 'res_01', title: 'Python Cheat Sheet for AI & Data Science', category: 'Cheat Sheets', description: 'Comprehensive single-page cheat sheet for Python, NumPy, and Pandas.', url: 'https://github.com', uploadedDate: '2026-02-10', author: 'Club Admin', published: true },
  { id: 'res_02', title: 'Generative AI & LLM Architecture Handbook', category: 'PDFs', description: 'Deep-dive PDF guide on Transformers, Attention Mechanisms, & RAG.', url: 'https://github.com', uploadedDate: '2026-02-15', author: 'Club Admin', published: true }
];

const INITIAL_ROADMAP_NODES = [
  { id: 'rm_01', order: 1, title: 'Python Foundations', description: 'Core syntax, data structures, and functional programming.', status: 'completed', prerequisiteIds: [] },
  { id: 'rm_02', order: 2, title: 'Data Science & Math', description: 'NumPy, Pandas, Linear Algebra, and Calculus fundamentals.', status: 'in_progress', prerequisiteIds: ['rm_01'] },
  { id: 'rm_03', order: 3, title: 'Machine Learning', description: 'Scikit-Learn algorithms, model evaluation, & cross-validation.', status: 'available', prerequisiteIds: ['rm_02'] },
  { id: 'rm_04', order: 4, title: 'Deep Learning', description: 'Neural networks, PyTorch, CNNs, and Transformers.', status: 'locked', prerequisiteIds: ['rm_03'] },
  { id: 'rm_05', order: 5, title: 'Agentic AI Systems', description: 'Autonomous agents, multi-agent coordination, and LangGraph.', status: 'locked', prerequisiteIds: ['rm_04'] }
];

const INITIAL_TASKS = [
  { id: 'task_01', title: 'Build a Python CLI Calculator', description: 'Create a command-line tool using Python function definitions.', instructions: 'Create main.py with arithmetic functions and user prompt loop.', moduleId: 'mod_py_01', difficulty: 'Easy', xpReward: 100, deadline: '2026-09-01', requirements: ['Supports +, -, *, /', 'Handles division by zero gracefully'], published: true },
  { id: 'task_02', title: 'Data Analysis Report on Iris Dataset', description: 'Use Pandas & Seaborn to analyze summary metrics.', instructions: 'Submit GitHub link with clean Jupyter Notebook.', moduleId: 'mod_ds_01', difficulty: 'Medium', xpReward: 150, deadline: '2026-09-05', requirements: ['Calculates mean/std', 'Includes pairplot visualization'], published: true }
];

const INITIAL_PROJECTS = [
  { id: 'proj_01', title: 'RAG Knowledge Base Q&A Bot', problemStatement: 'Users need instant accurate answers from PDF documentation.', description: 'Build a LangChain + ChromaDB system to answer user queries over PDFs.', skillsRequired: ['Python', 'LangChain', 'OpenAI API', 'Vector DB'], difficulty: 'Hard', technologies: ['Python', 'LangChain', 'ChromaDB'], deadline: '2026-09-15', type: 'individual', xpReward: 300, requirements: ['Loads PDF docs', 'Uses Vector Search', 'Provides source citations'], published: true }
];

const INITIAL_ACHIEVEMENTS = [
  { id: 'ach_01', title: 'Python Novice', description: 'Complete your first Python lesson.', icon: '🐍', category: 'Learning', xpBonus: 50, conditionType: 'lessons_completed', targetValue: 1, published: true },
  { id: 'ach_02', title: 'Task Crusher', description: 'Complete 2 hands-on tasks.', icon: '⚡', category: 'Tasks', xpBonus: 100, conditionType: 'tasks_completed', targetValue: 2, published: true }
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 'ann_01', title: 'Welcome to NEURA LINKS BOTS CLUB 2026!', content: 'Get ready to master AI Engineering, Generative AI, and Agentic AI Systems. Check out Level 01 to begin!', author: 'Club Administrator', createdAt: '2026-08-20', isImportant: true, published: true }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    console.log('🌱 Seeding collections...');

    for (const item of INITIAL_USERS) {
      await models.User.updateOne({ email: item.email }, { $set: item }, { upsert: true });
    }
    for (const item of INITIAL_STUDENT_PROFILES) {
      await models.StudentProfile.findOneAndUpdate({ userId: item.userId }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_LEVELS) {
      await models.Level.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_MODULES) {
      await models.Module.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_LESSONS) {
      await models.Lesson.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_TOOLS) {
      await models.Tool.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_RESOURCES) {
      await models.Resource.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_ROADMAP_NODES) {
      await models.RoadmapNode.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_TASKS) {
      await models.Task.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_PROJECTS) {
      await models.Project.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_ACHIEVEMENTS) {
      await models.Achievement.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }
    for (const item of INITIAL_ANNOUNCEMENTS) {
      await models.Announcement.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }

    console.log('🎉 SUCCESS! MongoDB Atlas is now fully seeded with Users, Profiles, Levels, Modules, Lessons, Tools, Tasks, and Announcements!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
