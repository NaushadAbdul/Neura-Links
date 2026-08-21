export type Role = 'student' | 'admin';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: UserStatus;
  joinedDate: string;
  githubUrl?: string;
  linkedinUrl?: string;
  authProvider?: 'google' | 'email';
}

export interface StudentProfile {
  userId: string;
  level: number;
  levelTitle: string;
  xp: number;
  streak: number;
  skills: Record<string, number>; // e.g. { "Python": 85, "ML": 70 }
  completedModuleIds: string[];
  completedLessonIds: string[];
  completedTaskIds: string[];
  completedProjectIds: string[];
  unlockedAchievementIds: string[];
}

export interface UserAction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  actionType: 'login' | 'lesson_completed' | 'submission_created' | 'xp_awarded' | 'profile_updated' | 'account_status_changed';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Level {
  id: string;
  order: number;
  title: string;
  description: string;
  published: boolean;
}

export interface Module {
  id: string;
  levelId: string;
  order: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  published: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonResource {
  title: string;
  url: string;
  type: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  description: string;
  objectives: string[];
  videoUrl?: string;
  notesMarkdown: string;
  codeSnippet?: string;
  resources?: LessonResource[];
  quiz?: QuizQuestion[];
  xpReward: number;
  published: boolean;
}

export type ToolCategory = 'AI Tools' | 'Development' | 'ML/Data' | 'AI Engineering';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  useCase: string;
  url: string;
  skillLevel: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  iconName: string;
  published: boolean;
}

export type ResourceCategory = 
  | 'Notes'
  | 'PDFs'
  | 'Study Materials'
  | 'YouTube Videos'
  | 'Articles'
  | 'Documentation'
  | 'Cheat Sheets'
  | 'Research Papers'
  | 'Useful Websites';

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  url: string;
  fileType?: string;
  uploadedDate: string;
  author: string;
  moduleId?: string;
  published: boolean;
}

export interface RoadmapNode {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisiteIds: string[];
  relatedModuleId?: string;
}

export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  moduleId: string;
  difficulty: TaskDifficulty;
  xpReward: number;
  deadline: string;
  requirements: string[];
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  problemStatement: string;
  description: string;
  skillsRequired: string[];
  difficulty: TaskDifficulty;
  technologies: string[];
  deadline: string;
  type: 'individual' | 'team';
  xpReward: number;
  requirements: string[];
  published: boolean;
}

export type SubmissionStatus = 'under_review' | 'approved' | 'rejected' | 'changes_requested';

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  type: 'task' | 'project';
  targetId: string;
  targetTitle: string;
  githubUrl: string;
  liveDemoUrl?: string;
  documentation?: string;
  status: SubmissionStatus;
  submittedAt: string;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  category: string;
  xpBonus: number;
  conditionType: 'lessons_completed' | 'tasks_completed' | 'projects_completed' | 'streak_days' | 'level_reached';
  targetValue: number;
  published: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isImportant: boolean;
  published: boolean;
}

export interface AppNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  type: 'task' | 'project' | 'announcement' | 'achievement' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SkillScore {
  skill: string;
  score: number;
}

export interface UserUploadedFile {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize?: string;
  fileType?: string;
  storagePath?: string;
  description?: string;
}

export interface FirestoreUserData {
  id: string;
  email: string;
  name?: string;
  role?: Role;
  createdAt: string; // Account creation date
  uploadedFilesCount: number;
  avatar?: string;
  uploadedFiles?: UserUploadedFile[];
}

