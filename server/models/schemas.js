import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  authProvider: { type: String, enum: ['google', 'email'], default: 'google' }
}, { timestamps: true, collection: 'users' });

const StudentProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  levelTitle: { type: String, default: 'LEVEL 01 — Python Foundations' },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 1 },
  skills: { type: Map, of: Number, default: {} },
  completedModuleIds: [{ type: String }],
  completedLessonIds: [{ type: String }],
  completedTaskIds: [{ type: String }],
  completedProjectIds: [{ type: String }],
  unlockedAchievementIds: [{ type: String }],
  lessonWatchProgress: { type: Map, of: Number, default: {} }
}, { timestamps: true, collection: 'studentprofiles' });

const UserActionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  actionType: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  metadata: { type: Object, default: {} }
}, { timestamps: true, collection: 'useractions' });

const LevelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  published: { type: Boolean, default: true },
  isLocked: { type: Boolean, default: false }
}, { timestamps: true, collection: 'levels' });

const ModuleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  levelId: { type: String, required: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, default: '2 Hours' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'modules' });

const LessonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  moduleId: { type: String, required: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  objectives: [{ type: String }],
  videoUrl: { type: String, default: '' },
  notesMarkdown: { type: String, default: '' },
  codeSnippet: { type: String, default: '' },
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  quiz: [{
    id: String,
    question: String,
    options: [String],
    correctIndex: Number,
    explanation: String
  }],
  xpReward: { type: Number, default: 50 },
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'lessons' });

const ToolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  useCase: { type: String, default: '' },
  url: { type: String, default: '' },
  skillLevel: { type: String, default: 'All Levels' },
  iconName: { type: String, default: 'Wrench' },
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'tools' });

const ResourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  fileType: { type: String, default: '' },
  uploadedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  author: { type: String, default: 'Club Admin' },
  moduleId: { type: String, default: '' },
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'resources' });

const RoadmapNodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['locked', 'available', 'in_progress', 'completed'], default: 'available' },
  prerequisiteIds: [{ type: String }],
  relatedModuleId: { type: String, default: '' }
}, { timestamps: true, collection: 'roadmapnodes' });

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  instructions: { type: String, default: '' },
  moduleId: { type: String, default: '' },
  difficulty: { type: String, default: 'Medium' },
  xpReward: { type: Number, default: 100 },
  deadline: { type: String, default: '' },
  requirements: [{ type: String }],
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'tasks' });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  problemStatement: { type: String, default: '' },
  description: { type: String, default: '' },
  skillsRequired: [{ type: String }],
  difficulty: { type: String, default: 'Hard' },
  technologies: [{ type: String }],
  deadline: { type: String, default: '' },
  type: { type: String, enum: ['individual', 'team'], default: 'individual' },
  xpReward: { type: Number, default: 250 },
  requirements: [{ type: String }],
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'projects' });

const SubmissionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  type: { type: String, enum: ['task', 'project'], required: true },
  targetId: { type: String, required: true },
  targetTitle: { type: String, required: true },
  githubUrl: { type: String, default: '' },
  uploadedFileUrl: { type: String, default: '' },
  uploadedFileName: { type: String, default: '' },
  uploadedFileSize: { type: String, default: '' },
  liveDemoUrl: { type: String, default: '' },
  documentation: { type: String, default: '' },
  status: { type: String, enum: ['under_review', 'approved', 'rejected', 'changes_requested'], default: 'under_review' },
  submittedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  feedback: { type: String, default: '' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: String, default: '' }
}, { timestamps: true, collection: 'submissions' });

const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏆' },
  category: { type: String, default: 'General' },
  xpBonus: { type: Number, default: 50 },
  conditionType: { type: String, default: 'lessons_completed' },
  targetValue: { type: Number, default: 1 },
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'achievements' });

const AnnouncementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Club Administrator' },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  isImportant: { type: Boolean, default: false },
  published: { type: Boolean, default: true }
}, { timestamps: true, collection: 'announcements' });

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'system' },
  read: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  link: { type: String, default: '' }
}, { timestamps: true, collection: 'notifications' });

export const User = mongoose.model('User', UserSchema);
export const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);
export const UserAction = mongoose.model('UserAction', UserActionSchema);
export const Level = mongoose.model('Level', LevelSchema);
export const Module = mongoose.model('Module', ModuleSchema);
export const Lesson = mongoose.model('Lesson', LessonSchema);
export const Tool = mongoose.model('Tool', ToolSchema);
export const Resource = mongoose.model('Resource', ResourceSchema);
export const RoadmapNode = mongoose.model('RoadmapNode', RoadmapNodeSchema);
export const Task = mongoose.model('Task', TaskSchema);
export const Project = mongoose.model('Project', ProjectSchema);
export const Submission = mongoose.model('Submission', SubmissionSchema);
export const Achievement = mongoose.model('Achievement', AchievementSchema);
export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);
