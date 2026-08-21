import React, { createContext, useContext, useState, useEffect } from 'react';
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

import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { isUserAdminCheck } from './AuthContext';
import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILES,
  INITIAL_USER_ACTIONS,
  INITIAL_LEVELS,
  INITIAL_MODULES,
  INITIAL_LESSONS,
  INITIAL_TOOLS,
  INITIAL_RESOURCES,
  INITIAL_ROADMAP_NODES,
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_SUBMISSIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockSeedData';

interface DataContextType {
  users: User[];
  studentProfiles: Record<string, StudentProfile>;
  userActions: UserAction[];
  levels: Level[];
  modules: Module[];
  lessons: Lesson[];
  tools: Tool[];
  resources: Resource[];
  roadmapNodes: RoadmapNode[];
  tasks: Task[];
  projects: Project[];
  submissions: Submission[];
  achievements: Achievement[];
  announcements: Announcement[];
  notifications: AppNotification[];

  // User Actions Audit Logging
  logUserAction: (action: Omit<UserAction, 'id' | 'timestamp'>) => void;
  registerGoogleUser: (googleUser: User) => void;

  // Student Actions
  markLessonComplete: (studentId: string, lessonId: string, xpReward: number) => void;
  submitTaskOrProject: (submission: Omit<Submission, 'id' | 'status' | 'submittedAt'>) => void;
  markNotificationRead: (notificationId: string) => void;

  // Admin Actions - Users
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => void;
  assignStudentXP: (userId: string, xpAmount: number) => void;

  // Admin Actions - Content CMS
  createLevel: (level: Omit<Level, 'id'>) => void;
  updateLevel: (level: Level) => void;
  deleteLevel: (id: string) => void;
  toggleLevelPublish: (id: string) => void;

  createModule: (mod: Omit<Module, 'id'>) => void;
  updateModule: (mod: Module) => void;
  deleteModule: (id: string) => void;
  toggleModulePublish: (id: string) => void;

  createLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (id: string) => void;
  toggleLessonPublish: (id: string) => void;

  createTool: (tool: Omit<Tool, 'id'>) => void;
  updateTool: (tool: Tool) => void;
  deleteTool: (id: string) => void;
  toggleToolPublish: (id: string) => void;

  createResource: (res: Omit<Resource, 'id'>) => void;
  updateResource: (res: Resource) => void;
  deleteResource: (id: string) => void;
  toggleResourcePublish: (id: string) => void;

  createTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskPublish: (id: string) => void;

  createProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (proj: Project) => void;
  deleteProject: (id: string) => void;
  toggleProjectPublish: (id: string) => void;

  reviewSubmission: (submissionId: string, status: 'approved' | 'rejected' | 'changes_requested', feedback: string, adminName: string) => void;

  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;

  createAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (id: string) => void;

  createRoadmapNode: (node: Omit<RoadmapNode, 'id'>) => void;
  updateRoadmapNode: (node: RoadmapNode) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper for localStorage state initialization with legacy mock user filter
  const getInitial = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(`nlbc_${key}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (key === 'users' && Array.isArray(parsed)) {
          const cleanedUsers = parsed.filter((u: any) =>
            u.id !== 'user_admin_01' &&
            u.id !== 'user_student_01' &&
            u.id !== 'user_student_02' &&
            u.email !== 'admin@neuralinks.club' &&
            u.email !== 'naushad@neuralinks.club' &&
            u.email !== 'rahul@neuralinks.club'
          );
          localStorage.setItem('nlbc_users', JSON.stringify(cleanedUsers));
          return cleanedUsers as unknown as T;
        }
        if (key === 'studentProfiles' && typeof parsed === 'object' && parsed !== null) {
          delete parsed['user_student_01'];
          delete parsed['user_student_02'];
          localStorage.setItem('nlbc_studentProfiles', JSON.stringify(parsed));
          return parsed as unknown as T;
        }
        if (key === 'userActions' && Array.isArray(parsed)) {
          const cleanedActions = parsed.filter((a: any) =>
            a.userId !== 'user_student_01' &&
            a.userId !== 'user_student_02' &&
            a.userEmail !== 'naushad@neuralinks.club' &&
            a.userEmail !== 'rahul@neuralinks.club'
          );
          localStorage.setItem('nlbc_userActions', JSON.stringify(cleanedActions));
          return cleanedActions as unknown as T;
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return fallback;
  };

  const [users, setUsers] = useState<User[]>(() => getInitial('users', INITIAL_USERS));
  const [studentProfiles, setStudentProfiles] = useState<Record<string, StudentProfile>>(() => getInitial('studentProfiles', INITIAL_STUDENT_PROFILES));
  const [userActions, setUserActions] = useState<UserAction[]>(() => getInitial('userActions', INITIAL_USER_ACTIONS));
  const [levels, setLevels] = useState<Level[]>(() => getInitial('levels', INITIAL_LEVELS));
  const [modules, setModules] = useState<Module[]>(() => getInitial('modules', INITIAL_MODULES));
  const [lessons, setLessons] = useState<Lesson[]>(() => getInitial('lessons', INITIAL_LESSONS));
  const [tools, setTools] = useState<Tool[]>(() => getInitial('tools', INITIAL_TOOLS));
  const [resources, setResources] = useState<Resource[]>(() => getInitial('resources', INITIAL_RESOURCES));
  const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>(() => getInitial('roadmapNodes', INITIAL_ROADMAP_NODES));
  const [tasks, setTasks] = useState<Task[]>(() => getInitial('tasks', INITIAL_TASKS));
  const [projects, setProjects] = useState<Project[]>(() => getInitial('projects', INITIAL_PROJECTS));
  const [submissions, setSubmissions] = useState<Submission[]>(() => getInitial('submissions', INITIAL_SUBMISSIONS));
  const [achievements, setAchievements] = useState<Achievement[]>(() => getInitial('achievements', INITIAL_ACHIEVEMENTS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getInitial('announcements', INITIAL_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getInitial('notifications', INITIAL_NOTIFICATIONS));

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('nlbc_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nlbc_studentProfiles', JSON.stringify(studentProfiles)); }, [studentProfiles]);
  useEffect(() => { localStorage.setItem('nlbc_userActions', JSON.stringify(userActions)); }, [userActions]);
  useEffect(() => { localStorage.setItem('nlbc_levels', JSON.stringify(levels)); }, [levels]);
  useEffect(() => { localStorage.setItem('nlbc_modules', JSON.stringify(modules)); }, [modules]);
  useEffect(() => { localStorage.setItem('nlbc_lessons', JSON.stringify(lessons)); }, [lessons]);
  useEffect(() => { localStorage.setItem('nlbc_tools', JSON.stringify(tools)); }, [tools]);
  useEffect(() => { localStorage.setItem('nlbc_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('nlbc_roadmapNodes', JSON.stringify(roadmapNodes)); }, [roadmapNodes]);
  useEffect(() => { localStorage.setItem('nlbc_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('nlbc_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('nlbc_submissions', JSON.stringify(submissions)); }, [submissions]);
  useEffect(() => { localStorage.setItem('nlbc_achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('nlbc_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('nlbc_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Live Firestore Realtime Snapshot Listeners for Registered Users
  useEffect(() => {
    try {
      const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedUsers: User[] = snapshot.docs
            .filter(docSnap => docSnap.id !== 'user_admin_01' && docSnap.data().email !== 'admin@neuralinks.club')
            .map(docSnap => {
              const data = docSnap.data();
              const isAdmin = isUserAdminCheck(docSnap.id, data.email) || data.role === 'admin';
              return {
                id: docSnap.id,
                name: data.name || data.displayName || data.email?.split('@')[0] || 'Club Student',
                email: data.email || '',
                avatar: data.avatar || data.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                role: isAdmin ? 'admin' : 'student',
                status: data.status || 'active',
                joinedDate: data.createdAt || data.joinedDate || new Date().toISOString().split('T')[0],
                authProvider: data.authProvider || 'google',
              };
            });

          setUsers(prev => {
            const userMap = new Map<string, User>();
            INITIAL_USERS.forEach(u => userMap.set(u.id, u));
            prev.forEach(u => userMap.set(u.id, u));
            fetchedUsers.forEach(u => userMap.set(u.id, u));
            return Array.from(userMap.values());
          });
        }
      });
      return () => unsubUsers();
    } catch (e) {
      console.warn("Live Firestore users listener notice:", e);
    }
  }, []);

  // LOG USER ACTION
  const logUserAction = (actionData: Omit<UserAction, 'id' | 'timestamp'>) => {
    const newAction: UserAction = {
      ...actionData,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString(),
    };
    setUserActions(prev => [newAction, ...prev]);
  };

  // REGISTER GOOGLE AUTH USER
  const registerGoogleUser = (googleUser: User) => {
    // Add user if not exists
    setUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === googleUser.email.toLowerCase());
      if (exists) return prev;
      return [...prev, { ...googleUser, authProvider: 'google' }];
    });

    // Add profile if not exists
    setStudentProfiles(prev => {
      if (prev[googleUser.id]) return prev;
      return {
        ...prev,
        [googleUser.id]: {
          userId: googleUser.id,
          level: 1,
          levelTitle: 'LEVEL 01 — Python Foundations',
          xp: 100,
          streak: 1,
          skills: { 'Python': 50, 'AI Engineering': 30 },
          completedModuleIds: [],
          completedLessonIds: [],
          completedTaskIds: [],
          completedProjectIds: [],
          unlockedAchievementIds: ['ach_01'],
        }
      };
    });

    // Log Login Action
    logUserAction({
      userId: googleUser.id,
      userName: googleUser.name,
      userEmail: googleUser.email,
      userAvatar: googleUser.avatar,
      actionType: 'login',
      description: `Student logged in via Google Authentication (${googleUser.email})`,
    });
  };

  // STUDENT ACTIONS
  const markLessonComplete = (studentId: string, lessonId: string, xpReward: number) => {
    const studentUser = users.find(u => u.id === studentId);

    setStudentProfiles(prev => {
      const profile = prev[studentId] || {
        userId: studentId,
        level: 1,
        levelTitle: 'LEVEL 01 — Python Foundations',
        xp: 0,
        streak: 1,
        skills: { 'Python': 50 },
        completedModuleIds: [],
        completedLessonIds: [],
        completedTaskIds: [],
        completedProjectIds: [],
        unlockedAchievementIds: [],
      };

      if (profile.completedLessonIds.includes(lessonId)) return prev;

      const newXP = profile.xp + xpReward;
      let newLevel = profile.level;
      let newLevelTitle = profile.levelTitle;

      if (newXP >= 2000) { newLevel = 5; newLevelTitle = 'LEVEL 05 — GENERATIVE AI'; }
      else if (newXP >= 1000) { newLevel = 4; newLevelTitle = 'LEVEL 04 — DEEP LEARNING'; }
      else if (newXP >= 500) { newLevel = 3; newLevelTitle = 'LEVEL 03 — MACHINE LEARNING'; }
      else if (newXP >= 200) { newLevel = 2; newLevelTitle = 'LEVEL 02 — DATA SCIENCE'; }

      // Increase skills
      const updatedSkills = { ...profile.skills };
      updatedSkills['Python'] = Math.min(100, (updatedSkills['Python'] || 50) + 5);

      return {
        ...prev,
        [studentId]: {
          ...profile,
          xp: newXP,
          level: newLevel,
          levelTitle: newLevelTitle,
          skills: updatedSkills,
          completedLessonIds: [...profile.completedLessonIds, lessonId],
        },
      };
    });

    // Log Action
    if (studentUser) {
      logUserAction({
        userId: studentId,
        userName: studentUser.name,
        userEmail: studentUser.email,
        userAvatar: studentUser.avatar,
        actionType: 'lesson_completed',
        description: `Completed lesson ${lessonId} (+${xpReward} XP)`,
      });
    }

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      studentId,
      title: `Lesson Completed! +${xpReward} XP`,
      message: `You earned ${xpReward} XP for completing the lesson. Keep going!`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const submitTaskOrProject = (submissionData: Omit<Submission, 'id' | 'status' | 'submittedAt'>) => {
    const newSub: Submission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      status: 'under_review',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setSubmissions(prev => [newSub, ...prev]);

    // Log Action
    logUserAction({
      userId: submissionData.studentId,
      userName: submissionData.studentName,
      userEmail: submissionData.studentEmail,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      actionType: 'submission_created',
      description: `Submitted ${submissionData.type} "${submissionData.targetTitle}" for review`,
    });

    // Add notification to student
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      studentId: submissionData.studentId,
      title: 'Submission Received',
      message: `Your submission for "${submissionData.targetTitle}" has been sent to admin for review.`,
      type: submissionData.type,
      read: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  // ADMIN ACTIONS - USERS
  const updateUserStatus = (userId: string, status: 'active' | 'inactive') => {
    const u = users.find(x => x.id === userId);
    setUsers(prev => prev.map(x => x.id === userId ? { ...x, status } : x));

    if (u) {
      logUserAction({
        userId,
        userName: u.name,
        userEmail: u.email,
        userAvatar: u.avatar,
        actionType: 'account_status_changed',
        description: `Admin changed account status to ${status.toUpperCase()}`,
      });
    }
  };

  const assignStudentXP = (userId: string, xpAmount: number) => {
    const u = users.find(x => x.id === userId);
    setStudentProfiles(prev => {
      const p = prev[userId];
      if (!p) return prev;
      return {
        ...prev,
        [userId]: { ...p, xp: p.xp + xpAmount }
      };
    });

    if (u) {
      logUserAction({
        userId,
        userName: u.name,
        userEmail: u.email,
        userAvatar: u.avatar,
        actionType: 'xp_awarded',
        description: `Admin awarded +${xpAmount} bonus XP`,
      });
    }
  };

  // ADMIN ACTIONS - CMS (LEVELS)
  const createLevel = (data: Omit<Level, 'id'>) => {
    const newLevel: Level = { ...data, id: `lvl_${Date.now()}` };
    setLevels(prev => [...prev, newLevel]);
  };
  const updateLevel = (data: Level) => {
    setLevels(prev => prev.map(l => l.id === data.id ? data : l));
  };
  const deleteLevel = (id: string) => {
    setLevels(prev => prev.filter(l => l.id !== id));
  };
  const toggleLevelPublish = (id: string) => {
    setLevels(prev => prev.map(l => l.id === id ? { ...l, published: !l.published } : l));
  };

  // ADMIN ACTIONS - CMS (MODULES)
  const createModule = (data: Omit<Module, 'id'>) => {
    const newMod: Module = { ...data, id: `mod_${Date.now()}` };
    setModules(prev => [...prev, newMod]);
  };
  const updateModule = (data: Module) => {
    setModules(prev => prev.map(m => m.id === data.id ? data : m));
  };
  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };
  const toggleModulePublish = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, published: !m.published } : m));
  };

  // ADMIN ACTIONS - CMS (LESSONS)
  const createLesson = (data: Omit<Lesson, 'id'>) => {
    const newLes: Lesson = { ...data, id: `les_${Date.now()}` };
    setLessons(prev => [...prev, newLes]);
  };
  const updateLesson = (data: Lesson) => {
    setLessons(prev => prev.map(l => l.id === data.id ? data : l));
  };
  const deleteLesson = (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
  };
  const toggleLessonPublish = (id: string) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, published: !l.published } : l));
  };

  // ADMIN ACTIONS - CMS (TOOLS)
  const createTool = (data: Omit<Tool, 'id'>) => {
    const newTool: Tool = { ...data, id: `tool_${Date.now()}` };
    setTools(prev => [...prev, newTool]);
  };
  const updateTool = (data: Tool) => {
    setTools(prev => prev.map(t => t.id === data.id ? data : t));
  };
  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
  };
  const toggleToolPublish = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, published: !t.published } : t));
  };

  // ADMIN ACTIONS - CMS (RESOURCES)
  const createResource = (data: Omit<Resource, 'id'>) => {
    const newRes: Resource = { ...data, id: `res_${Date.now()}` };
    setResources(prev => [...prev, newRes]);
  };
  const updateResource = (data: Resource) => {
    setResources(prev => prev.map(r => r.id === data.id ? data : r));
  };
  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };
  const toggleResourcePublish = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, published: !r.published } : r));
  };

  // ADMIN ACTIONS - CMS (TASKS)
  const createTask = (data: Omit<Task, 'id'>) => {
    const newTask: Task = { ...data, id: `task_${Date.now()}` };
    setTasks(prev => [...prev, newTask]);
  };
  const updateTask = (data: Task) => {
    setTasks(prev => prev.map(t => t.id === data.id ? data : t));
  };
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  const toggleTaskPublish = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, published: !t.published } : t));
  };

  // ADMIN ACTIONS - CMS (PROJECTS)
  const createProject = (data: Omit<Project, 'id'>) => {
    const newProj: Project = { ...data, id: `proj_${Date.now()}` };
    setProjects(prev => [...prev, newProj]);
  };
  const updateProject = (data: Project) => {
    setProjects(prev => prev.map(p => p.id === data.id ? data : p));
  };
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };
  const toggleProjectPublish = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  // ADMIN SUBMISSION REVIEW
  const reviewSubmission = (
    submissionId: string,
    status: 'approved' | 'rejected' | 'changes_requested',
    feedback: string,
    adminName: string
  ) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const now = new Date().toISOString().split('T')[0];

    setSubmissions(prev =>
      prev.map(s => s.id === submissionId ? {
        ...s,
        status,
        feedback,
        reviewedBy: adminName,
        reviewedAt: now,
      } : s)
    );

    // If approved, award XP and mark task/project completed
    if (status === 'approved') {
      let xpEarned = 50;
      if (sub.type === 'task') {
        const t = tasks.find(x => x.id === sub.targetId);
        if (t) xpEarned = t.xpReward;
      } else {
        const p = projects.find(x => x.id === sub.targetId);
        if (p) xpEarned = p.xpReward;
      }

      setStudentProfiles(prev => {
        const p = prev[sub.studentId];
        if (!p) return prev;
        const newXP = p.xp + xpEarned;
        const completedTasks = sub.type === 'task' ? [...p.completedTaskIds, sub.targetId] : p.completedTaskIds;
        const completedProjects = sub.type === 'project' ? [...p.completedProjectIds, sub.targetId] : p.completedProjectIds;

        const updatedSkills = { ...p.skills };
        updatedSkills['Machine Learning'] = Math.min(100, (updatedSkills['Machine Learning'] || 50) + 10);
        updatedSkills['AI Engineering'] = Math.min(100, (updatedSkills['AI Engineering'] || 40) + 10);

        return {
          ...prev,
          [sub.studentId]: {
            ...p,
            xp: newXP,
            skills: updatedSkills,
            completedTaskIds: completedTasks,
            completedProjectIds: completedProjects,
          },
        };
      });

      // Log Action
      logUserAction({
        userId: sub.studentId,
        userName: sub.studentName,
        userEmail: sub.studentEmail,
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        actionType: 'xp_awarded',
        description: `Submission approved by ${adminName}. Awarded +${xpEarned} XP`,
      });

      // Notify Student
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        studentId: sub.studentId,
        title: `Submission Approved! +${xpEarned} XP 🎉`,
        message: `Your submission for "${sub.targetTitle}" was approved by ${adminName}. Feedback: "${feedback}"`,
        type: sub.type,
        read: false,
        createdAt: now,
      };
      setNotifications(prev => [notif, ...prev]);
    } else {
      // Notify Student for revision/rejection
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        studentId: sub.studentId,
        title: `Submission Update: ${status === 'changes_requested' ? 'Changes Requested' : 'Rejected'}`,
        message: `Feedback from ${adminName}: "${feedback}"`,
        type: sub.type,
        read: false,
        createdAt: now,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // ADMIN ACTIONS - ANNOUNCEMENTS
  const createAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // ADMIN ACTIONS - ROADMAP NODES
  const createRoadmapNode = (data: Omit<RoadmapNode, 'id'>) => {
    const newNode: RoadmapNode = { ...data, id: `rm_${Date.now()}` };
    setRoadmapNodes(prev => [...prev, newNode]);
  };

  const updateRoadmapNode = (data: RoadmapNode) => {
    setRoadmapNodes(prev => prev.map(n => n.id === data.id ? data : n));
  };

  // ADMIN ACTIONS - ACHIEVEMENTS
  const createAchievement = (data: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = { ...data, id: `ach_${Date.now()}` };
    setAchievements(prev => [...prev, newAch]);
  };
  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider value={{
      users,
      studentProfiles,
      userActions,
      levels,
      modules,
      lessons,
      tools,
      resources,
      roadmapNodes,
      tasks,
      projects,
      submissions,
      achievements,
      announcements,
      notifications,

      logUserAction,
      registerGoogleUser,

      markLessonComplete,
      submitTaskOrProject,
      markNotificationRead,

      updateUserStatus,
      assignStudentXP,

      createLevel,
      updateLevel,
      deleteLevel,
      toggleLevelPublish,

      createModule,
      updateModule,
      deleteModule,
      toggleModulePublish,

      createLesson,
      updateLesson,
      deleteLesson,
      toggleLessonPublish,

      createTool,
      updateTool,
      deleteTool,
      toggleToolPublish,

      createResource,
      updateResource,
      deleteResource,
      toggleResourcePublish,

      createTask,
      updateTask,
      deleteTask,
      toggleTaskPublish,

      createProject,
      updateProject,
      deleteProject,
      toggleProjectPublish,

      reviewSubmission,
      createAnnouncement,
      deleteAnnouncement,
      createAchievement,
      deleteAchievement,

      createRoadmapNode,
      updateRoadmapNode,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
