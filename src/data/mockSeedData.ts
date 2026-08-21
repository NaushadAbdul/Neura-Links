import {
  User,
  StudentProfile,
  UserAction,
  Level,
  Module,
  Lesson,
  Tool,
  Resource,
  RoadmapNode,
  Task,
  Project,
  Submission,
  Achievement,
  Announcement,
  AppNotification,
} from '../types';

export const INITIAL_USERS: User[] = [];

export const INITIAL_STUDENT_PROFILES: Record<string, StudentProfile> = {};

export const INITIAL_USER_ACTIONS: UserAction[] = [];

export const INITIAL_LEVELS: Level[] = [
  {
    id: 'lvl_01',
    order: 1,
    title: 'LEVEL 01 — Python Foundations',
    description: 'Master modern Python syntax, object-oriented programming, data structures, and algorithmic logic for AI.',
    published: true,
  },
  {
    id: 'lvl_02',
    order: 2,
    title: 'LEVEL 02 — Data Science & Analytics',
    description: 'NumPy arrays, Pandas dataframes, Matplotlib/Seaborn visualization, and exploratory data analysis (EDA).',
    published: true,
  },
  {
    id: 'lvl_03',
    order: 3,
    title: 'LEVEL 03 — Machine Learning',
    description: 'Supervised & unsupervised learning, regression, classification, decision trees, and scikit-learn models.',
    published: true,
  },
  {
    id: 'lvl_04',
    order: 4,
    title: 'LEVEL 04 — Deep Learning',
    description: 'Neural networks from scratch, PyTorch tensors, backpropagation, CNNs, and computer vision architectures.',
    published: true,
  },
  {
    id: 'lvl_05',
    order: 5,
    title: 'LEVEL 05 — Generative AI',
    description: 'Transformers, Attention mechanism, Large Language Models (LLMs), Prompt Engineering, and OpenAI API.',
    published: true,
  },
  {
    id: 'lvl_06',
    order: 6,
    title: 'LEVEL 06 — Agentic AI',
    description: 'Autonomous AI agents, tool calling, LangChain, LangGraph, Multi-Agent orchestration, and memory systems.',
    published: true,
  },
  {
    id: 'lvl_07',
    order: 7,
    title: 'LEVEL 07 — AI Engineering',
    description: 'RAG (Retrieval-Augmented Generation), Vector Databases (Pinecone/Chroma), vLLM deployment, and API systems.',
    published: true,
  },
  {
    id: 'lvl_08',
    order: 8,
    title: 'LEVEL 08 — Real World Projects',
    description: 'Full-stack AI SaaS applications, production ML pipelines, MLOps, CI/CD, and enterprise AI deployment.',
    published: true,
  },
];

export const INITIAL_MODULES: Module[] = [
  // Level 1
  {
    id: 'mod_py_01',
    levelId: 'lvl_01',
    order: 1,
    title: 'Python Essentials & Data Structures',
    description: 'Variables, loops, functions, lists, dictionaries, set operations, and list comprehensions.',
    duration: '4 Hours',
    difficulty: 'Beginner',
    published: true,
  },
  {
    id: 'mod_py_02',
    levelId: 'lvl_01',
    order: 2,
    title: 'Object-Oriented Programming (OOP) for AI',
    description: 'Classes, inheritance, polymorphism, encapsulation, and magic methods used in ML frameworks.',
    duration: '5 Hours',
    difficulty: 'Beginner',
    published: true,
  },
  // Level 2
  {
    id: 'mod_ds_01',
    levelId: 'lvl_02',
    order: 1,
    title: 'NumPy & Vectorized Computing',
    description: 'Multi-dimensional arrays, matrix operations, broadcasting, and numerical performance.',
    duration: '6 Hours',
    difficulty: 'Intermediate',
    published: true,
  },
  {
    id: 'mod_ds_02',
    levelId: 'lvl_02',
    order: 2,
    title: 'Pandas Data Wrangling & Cleaning',
    description: 'Series, DataFrames, merging, grouping, handling missing values, and time-series manipulation.',
    duration: '7 Hours',
    difficulty: 'Intermediate',
    published: true,
  },
  // Level 3
  {
    id: 'mod_ml_01',
    levelId: 'lvl_03',
    order: 1,
    title: 'Supervised Learning: Linear & Logistic Regression',
    description: 'Gradient descent, cost functions, decision boundaries, RMSE, R2 score, and Scikit-Learn.',
    duration: '8 Hours',
    difficulty: 'Intermediate',
    published: true,
  },
  {
    id: 'mod_ml_02',
    levelId: 'lvl_03',
    order: 2,
    title: 'Classification & Model Evaluation',
    description: 'Decision Trees, Random Forests, SVMs, Confusion Matrix, Precision, Recall, F1 Score, and ROC-AUC.',
    duration: '8 Hours',
    difficulty: 'Intermediate',
    published: true,
  },
  // Level 5
  {
    id: 'mod_genai_01',
    levelId: 'lvl_05',
    order: 1,
    title: 'Transformers & Large Language Models',
    description: 'Self-Attention, Encoder-Decoder architecture, tokenization, embeddings, and HuggingFace Transformers.',
    duration: '10 Hours',
    difficulty: 'Advanced',
    published: true,
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les_py_01_01',
    moduleId: 'mod_py_01',
    order: 1,
    title: 'Python High-Performance Data Structures',
    description: 'Master list comprehensions, generator expressions, and dictionary manipulation for AI data streams.',
    objectives: [
      'Understand time complexity of Python built-in lists vs sets',
      'Implement nested dictionary transformations',
      'Use generator functions to process streaming data efficiently',
    ],
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    notesMarkdown: `# Python High-Performance Data Structures

In AI Engineering, clean and efficient data manipulation is critical.

## 1. List Comprehensions vs Generators
List comprehensions create full memory objects, while generator expressions compute values lazily.

\`\`\`python
# List comprehension (Memory intensive)
squares = [x**2 for x in range(1000000)]

# Generator expression (Memory efficient)
gen_squares = (x**2 for x in range(1000000))
\`\`\`

## 2. Dictionary Comprehensions for Metadata Processing
\`\`\`python
raw_scores = {"alice": 95, "bob": 82, "charlie": 90}
normalized = {k: v / 100.0 for k, v in raw_scores.items()}
print(normalized)
\`\`\`
`,
    codeSnippet: `import sys

# Memory usage comparison
list_data = [i for i in range(10000)]
gen_data = (i for i in range(10000))

print(f"List size: {sys.getsizeof(list_data)} bytes")
print(f"Generator size: {sys.getsizeof(gen_data)} bytes")`,
    resources: [
      { title: 'Python Official Docs - Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html', type: 'Documentation' },
      { title: 'Real Python Generator Tutorial', url: 'https://realpython.com/introduction-to-python-generators/', type: 'Article' },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which of the following creates a generator expression in Python?',
        options: ['[x for x in range(10)]', '{x for x in range(10)}', '(x for x in range(10))', 'list(x for x in range(10))'],
        correctIndex: 2,
        explanation: 'Parentheses ( ) create a generator object in Python.',
      },
    ],
    xpReward: 20,
    published: true,
  },
  {
    id: 'les_ml_01_01',
    moduleId: 'mod_ml_01',
    order: 1,
    title: 'Linear Regression from Scratch & Scikit-Learn',
    description: 'Derive cost function J(θ), compute partial derivatives for Gradient Descent, and train your first model.',
    objectives: [
      'Understand Mean Squared Error (MSE) formulation',
      'Implement Gradient Descent update rule in Python',
      'Train linear regression using Scikit-Learn LinearRegression',
    ],
    videoUrl: 'https://www.youtube.com/embed/nk2CQITm_uu',
    notesMarkdown: `# Linear Regression Fundamentals

Linear Regression attempts to model the relationship between scalar dependent variable $y$ and independent variables $X$.

## Cost Function: Mean Squared Error (MSE)
$$J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$

## Gradient Descent Update Rule
$$\\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta)$$
`,
    codeSnippet: `import numpy as np
from sklearn.linear_model import LinearRegression

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Model fit
model = LinearRegression()
model.fit(X, y)

print(f"Slope: {model.coef_[0]}")
print(f"Intercept: {model.intercept_}")`,
    quiz: [
      {
        id: 'q2',
        question: 'What happens when the learning rate alpha is set too high during gradient descent?',
        options: ['Gradient descent converges faster', 'Gradient descent oscillates or diverges', 'The cost function becomes zero immediately', 'No effect on training'],
        correctIndex: 1,
        explanation: 'A learning rate that is too high can overshoot the minimum and cause divergence.',
      },
    ],
    xpReward: 30,
    published: true,
  },
];

export const INITIAL_TOOLS: Tool[] = [
  {
    id: 'tool_01',
    name: 'ChatGPT',
    category: 'AI Tools',
    description: 'OpenAI conversational interface powered by GPT-4o for rapid code generation, reasoning, and ideation.',
    useCase: 'Code debugging, architectural design, prompt experimentation.',
    url: 'https://chatgpt.com',
    skillLevel: 'All Levels',
    iconName: 'MessageSquare',
    published: true,
  },
  {
    id: 'tool_02',
    name: 'Claude 3.5 Sonnet',
    category: 'AI Tools',
    description: 'Anthropic flagship AI model with industry-leading code synthesis, reasoning, and document analysis.',
    useCase: 'Complex system refactoring, technical documentation, complex reasoning.',
    url: 'https://claude.ai',
    skillLevel: 'All Levels',
    iconName: 'Bot',
    published: true,
  },
  {
    id: 'tool_03',
    name: 'Google Colab',
    category: 'ML/Data',
    description: 'Cloud-hosted Jupyter notebook environment with free access to NVIDIA GPUs (T4/V100) and TPUs.',
    useCase: 'Training PyTorch/TensorFlow models, running heavy data processing pipelines.',
    url: 'https://colab.research.google.com',
    skillLevel: 'Beginner',
    iconName: 'Code',
    published: true,
  },
  {
    id: 'tool_04',
    name: 'Hugging Face Hub',
    category: 'AI Engineering',
    description: 'The GitHub of machine learning. Host, discover, and deploy pre-trained open-source AI models and datasets.',
    useCase: 'Downloading Llama 3, DeepSeek, Mistral models, and benchmark datasets.',
    url: 'https://huggingface.co',
    skillLevel: 'Intermediate',
    iconName: 'Globe',
    published: true,
  },
  {
    id: 'tool_05',
    name: 'LangChain & LangGraph',
    category: 'AI Engineering',
    description: 'Framework for developing applications powered by language models with stateful, multi-actor agent networks.',
    useCase: 'Building enterprise RAG pipelines, multi-agent workflows, and memory systems.',
    url: 'https://langchain.com',
    skillLevel: 'Advanced',
    iconName: 'Cpu',
    published: true,
  },
  {
    id: 'tool_06',
    name: 'VS Code & Cursor',
    category: 'Development',
    description: 'Industry-standard IDEs with deep AI extension support, terminal integration, and remote development.',
    useCase: 'Primary code editor for Python, web apps, and AI scripts.',
    url: 'https://code.visualstudio.com',
    skillLevel: 'All Levels',
    iconName: 'Terminal',
    published: true,
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res_01',
    title: 'Python for Data Analysis Cheat Sheet',
    category: 'Cheat Sheets',
    description: 'Quick reference guide covering Pandas operations, NumPy indexing, and Matplotlib syntax.',
    url: 'https://github.com/pandas-dev/pandas',
    fileType: 'PDF',
    uploadedDate: '2026-02-10',
    author: 'Admin // NEURA',
    moduleId: 'mod_py_01',
    published: true,
  },
  {
    id: 'res_02',
    title: 'Attention Is All You Need (Transformer Research Paper)',
    category: 'Research Papers',
    description: 'The landmark 2017 Google paper introducing the Transformer architecture that powered modern GenAI.',
    url: 'https://arxiv.org/abs/1706.03762',
    fileType: 'PDF / ArXiv',
    uploadedDate: '2026-02-14',
    author: 'Vaswani et al.',
    moduleId: 'mod_genai_01',
    published: true,
  },
  {
    id: 'res_03',
    title: 'Scikit-Learn Machine Learning Map',
    category: 'Documentation',
    description: 'Interactive diagram guiding algorithm selection based on dataset size, target type, and features.',
    url: 'https://scikit-learn.org/stable/tutorial/machine_learning_map/index.html',
    fileType: 'Web Link',
    uploadedDate: '2026-02-18',
    author: 'Scikit-Learn Core Team',
    moduleId: 'mod_ml_01',
    published: true,
  },
  {
    id: 'res_04',
    title: 'PyTorch Deep Learning Zero to Mastery Video Course',
    category: 'YouTube Videos',
    description: 'Comprehensive 25-hour video tutorial covering tensor fundamentals to PyTorch model deployment.',
    url: 'https://www.youtube.com/watch?v=Z_ikDlimN6A',
    fileType: 'YouTube Video',
    uploadedDate: '2026-03-01',
    author: 'Daniel Bourke',
    published: true,
  },
];

export const INITIAL_ROADMAP_NODES: RoadmapNode[] = [
  { id: 'rm_01', order: 1, title: 'PYTHON', description: 'Syntax, OOP, Functions, Modules', status: 'completed', prerequisiteIds: [] },
  { id: 'rm_02', order: 2, title: 'NUMPY', description: 'Vectorization, Arrays, Matrices', status: 'completed', prerequisiteIds: ['rm_01'] },
  { id: 'rm_03', order: 3, title: 'PANDAS', description: 'DataFrames, Wrangling, Aggregation', status: 'completed', prerequisiteIds: ['rm_02'] },
  { id: 'rm_04', order: 4, title: 'DATA VISUALIZATION', description: 'Matplotlib, Seaborn, Plotly', status: 'completed', prerequisiteIds: ['rm_03'] },
  { id: 'rm_05', order: 5, title: 'MATHEMATICS FOR AI', description: 'Linear Algebra, Calculus, Prob & Stats', status: 'in_progress', prerequisiteIds: ['rm_04'] },
  { id: 'rm_06', order: 6, title: 'MACHINE LEARNING', description: 'Regression, Classification, Clustering', status: 'in_progress', prerequisiteIds: ['rm_05'] },
  { id: 'rm_07', order: 7, title: 'DEEP LEARNING', description: 'Neural Networks, PyTorch, CNNs', status: 'available', prerequisiteIds: ['rm_06'] },
  { id: 'rm_08', order: 8, title: 'GENERATIVE AI', description: 'Transformers, Prompt Eng, LLM APIs', status: 'available', prerequisiteIds: ['rm_07'] },
  { id: 'rm_09', order: 9, title: 'LLMs & RAG', description: 'Embeddings, Vector DBs, Context Retrieval', status: 'locked', prerequisiteIds: ['rm_08'] },
  { id: 'rm_10', order: 10, title: 'AI AGENTS', description: 'LangChain, LangGraph, Tool Use', status: 'locked', prerequisiteIds: ['rm_09'] },
  { id: 'rm_11', order: 11, title: 'AI ENGINEERING', description: 'vLLM, Quantization, APIs, MLOps', status: 'locked', prerequisiteIds: ['rm_10'] },
  { id: 'rm_12', order: 12, title: 'REAL-WORLD PROJECTS', description: 'Full-stack AI SaaS Applications', status: 'locked', prerequisiteIds: ['rm_11'] },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_01',
    title: 'Build a Linear Regression Model',
    description: 'Predict house prices using the California Housing Dataset with Scikit-Learn.',
    instructions: '1. Load dataset via sklearn.datasets\n2. Perform EDA & plot feature correlations\n3. Train LinearRegression model\n4. Evaluate RMSE and R2 Score\n5. Push notebook to GitHub repo.',
    moduleId: 'mod_ml_01',
    difficulty: 'Medium',
    xpReward: 50,
    deadline: '2026-08-25',
    requirements: ['Clean Jupyter Notebook', 'RMSE & R2 metric calculation', 'GitHub repo link'],
    published: true,
  },
  {
    id: 'task_02',
    title: 'Customer Churn Classification Task',
    description: 'Build Random Forest & Logistic Regression classifiers to predict telecom customer churn.',
    instructions: '1. Preprocess categorical features using OneHotEncoder\n2. Balance dataset using SMOTE if needed\n3. Plot ROC-AUC curve & confusion matrix\n4. Compare model accuracies.',
    moduleId: 'mod_ml_02',
    difficulty: 'Hard',
    xpReward: 75,
    deadline: '2026-08-30',
    requirements: ['Confusion matrix plot', 'Classification report output', 'Repository with README.md'],
    published: true,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    title: 'Build a Student Performance Prediction System',
    problemStatement: 'Educational institutions need early detection of struggling students to offer timely academic support.',
    description: 'Design and deploy an end-to-end Machine Learning web service that predicts student final exam performance based on study habits, attendance, and quiz scores.',
    skillsRequired: ['Python', 'Pandas', 'Scikit-Learn', 'Machine Learning', 'Data Visualization', 'Streamlit / Flask'],
    difficulty: 'Hard',
    technologies: ['Python', 'Scikit-Learn', 'FastAPI', 'Streamlit', 'Docker'],
    deadline: '2026-09-10',
    type: 'individual',
    xpReward: 300,
    requirements: [
      'Complete EDA notebook with interactive plots',
      'Trained model saved as pickle/joblib file',
      'Functional web UI (Streamlit, Gradio, or React)',
      'GitHub repository with documentation & setup guide',
    ],
    published: true,
  },
  {
    id: 'proj_02',
    title: 'Autonomous RAG Knowledge Base Agent',
    problemStatement: 'Technical teams waste hours searching through scattered PDF documentation and internal wiki notes.',
    description: 'Build an intelligent RAG (Retrieval-Augmented Generation) system using LangChain, ChromaDB, and OpenAI/Claude API that indexes PDF notes and answers technical questions with source citations.',
    skillsRequired: ['Generative AI', 'LangChain', 'Vector DBs', 'Python', 'Streamlit'],
    difficulty: 'Expert',
    technologies: ['Python', 'LangChain', 'ChromaDB', 'OpenAI API', 'FastAPI'],
    deadline: '2026-09-20',
    type: 'individual',
    xpReward: 500,
    requirements: [
      'PDF parser & chunking pipeline',
      'Vector database retrieval logic with top-k similarity',
      'Citation generation for answered queries',
      'Live demo URL (HuggingFace Spaces or Vercel)',
    ],
    published: true,
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_01',
    title: 'Python Starter',
    description: 'Completed Python Fundamentals module.',
    icon: '🐍',
    category: 'Learning',
    xpBonus: 100,
    conditionType: 'lessons_completed',
    targetValue: 1,
    published: true,
  },
  {
    id: 'ach_02',
    title: 'ML Explorer',
    description: 'Completed first ML project or task.',
    icon: '⚡',
    category: 'Projects',
    xpBonus: 150,
    conditionType: 'tasks_completed',
    targetValue: 1,
    published: true,
  },
  {
    id: 'ach_03',
    title: 'AI Builder',
    description: 'Successfully built and delivered 3 AI projects.',
    icon: '🏗️',
    category: 'Projects',
    xpBonus: 300,
    conditionType: 'projects_completed',
    targetValue: 3,
    published: true,
  },
  {
    id: 'ach_04',
    title: 'GenAI Pioneer',
    description: 'Completed Generative AI module and LLM fundamentals.',
    icon: '🤖',
    category: 'GenAI',
    xpBonus: 200,
    conditionType: 'lessons_completed',
    targetValue: 5,
    published: true,
  },
  {
    id: 'ach_05',
    title: 'Consistency Master',
    description: 'Maintained a 14-day consecutive active learning streak.',
    icon: '🔥',
    category: 'Streak',
    xpBonus: 250,
    conditionType: 'streak_days',
    targetValue: 14,
    published: true,
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'New Generative AI & Agentic AI Modules Released 🚀',
    content: 'We have unlocked Level 05 (Generative AI) and Level 06 (Agentic AI) for all active club members. Explore transformer architectures, RAG pipelines, and LangGraph agent networks!',
    author: 'Admin // NEURA',
    createdAt: '2026-08-20',
    isImportant: true,
    published: true,
  },
  {
    id: 'ann_02',
    title: 'Upcoming AI Hackathon & Team Project Review',
    content: 'Submissions for the Student Performance Predictor project are due by Sept 10. Top projects will be selected for demo day and awarded 500 extra XP!',
    author: 'Admin // NEURA',
    createdAt: '2026-08-15',
    isImportant: false,
    published: true,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    studentId: 'user_student_01',
    title: 'Task Approved! +50 XP',
    message: 'Admin reviewed and approved your submission for "Build a Linear Regression Model". You earned 50 XP!',
    type: 'task',
    read: false,
    createdAt: '2026-08-19',
    link: '/tasks',
  },
  {
    id: 'notif_02',
    studentId: 'user_student_01',
    title: 'New Module Available',
    message: 'Level 05 Generative AI modules have been published by the admin team.',
    type: 'announcement',
    read: true,
    createdAt: '2026-08-20',
    link: '/learning',
  },
];
