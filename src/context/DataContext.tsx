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

import { collection, onSnapshot } from 'firebase/firestore';
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

import {
  fetchAllDataFromMongo,
  seedMongoAtlasDatabase,
  syncToMongoAtlas,
  removeFromMongoAtlas,
  subscribeToRealTimeUpdates,
} from '../services/apiService';

const broadcastStateUpdate = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`nlbc_${key}`, JSON.stringify(data));
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('neura_links_live_sync');
      channel.postMessage({ key, data });
      channel.close();
    }
  } catch (e) {}
};

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
  updateLessonWatchProgress: (studentId: string, lessonId: string, watchedPercent: number) => void;
  submitTaskOrProject: (submission: Omit<Submission, 'id' | 'status' | 'submittedAt'>) => void;
  markNotificationRead: (notificationId: string) => void;

  // Admin Actions - Users
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => void;
  assignStudentXP: (userId: string, xpAmount: number) => void;
  deleteUserData: (userId: string) => void;

  // Admin Actions - Content CMS
  createLevel: (level: Omit<Level, 'id'>) => void;
  updateLevel: (level: Level) => void;
  deleteLevel: (id: string) => void;
  toggleLevelPublish: (id: string) => void;
  toggleLevelLock: (id: string) => void;

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
  deleteRoadmapNode: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitial = <T,>(key: string, fallback: T): T => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(`nlbc_${key}`) : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
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

  useEffect(() => { broadcastStateUpdate('users', users); }, [users]);
  useEffect(() => { broadcastStateUpdate('studentProfiles', studentProfiles); }, [studentProfiles]);
  useEffect(() => { broadcastStateUpdate('userActions', userActions); }, [userActions]);
  useEffect(() => { broadcastStateUpdate('levels', levels); }, [levels]);
  useEffect(() => { broadcastStateUpdate('modules', modules); }, [modules]);
  useEffect(() => { broadcastStateUpdate('lessons', lessons); }, [lessons]);
  useEffect(() => { broadcastStateUpdate('tools', tools); }, [tools]);
  useEffect(() => { broadcastStateUpdate('resources', resources); }, [resources]);
  useEffect(() => { broadcastStateUpdate('roadmapNodes', roadmapNodes); }, [roadmapNodes]);
  useEffect(() => { broadcastStateUpdate('tasks', tasks); }, [tasks]);
  useEffect(() => { broadcastStateUpdate('projects', projects); }, [projects]);
  useEffect(() => { broadcastStateUpdate('submissions', submissions); }, [submissions]);
  useEffect(() => { broadcastStateUpdate('achievements', achievements); }, [achievements]);
  useEffect(() => { broadcastStateUpdate('announcements', announcements); }, [announcements]);
  useEffect(() => { broadcastStateUpdate('notifications', notifications); }, [notifications]);

  // INITIAL HYDRATION FROM MONGODB ATLAS & REAL-TIME SOCKET LISTENER
  useEffect(() => {
    const hydrateAndSeed = async () => {
      const dbData = await fetchAllDataFromMongo();
      if (dbData) {
        let hasData = false;
        if (dbData.users && dbData.users.length > 0) { setUsers(dbData.users); hasData = true; }
        if (dbData.studentProfiles && Object.keys(dbData.studentProfiles).length > 0) { setStudentProfiles(dbData.studentProfiles); hasData = true; }
        if (dbData.levels && dbData.levels.length > 0) { setLevels(dbData.levels); hasData = true; }
        if (dbData.modules && dbData.modules.length > 0) { setModules(dbData.modules); hasData = true; }
        if (dbData.lessons && dbData.lessons.length > 0) { setLessons(dbData.lessons); hasData = true; }
        if (dbData.tools && dbData.tools.length > 0) { setTools(dbData.tools); hasData = true; }
        if (dbData.resources && dbData.resources.length > 0) { setResources(dbData.resources); hasData = true; }
        if (dbData.roadmapNodes && dbData.roadmapNodes.length > 0) { setRoadmapNodes(dbData.roadmapNodes); hasData = true; }
        if (dbData.tasks && dbData.tasks.length > 0) { setTasks(dbData.tasks); hasData = true; }
        if (dbData.projects && dbData.projects.length > 0) { setProjects(dbData.projects); hasData = true; }
        if (dbData.submissions && dbData.submissions.length > 0) { setSubmissions(dbData.submissions); hasData = true; }
        if (dbData.achievements && dbData.achievements.length > 0) { setAchievements(dbData.achievements); hasData = true; }
        if (dbData.announcements && dbData.announcements.length > 0) { setAnnouncements(dbData.announcements); hasData = true; }
        if (dbData.notifications && dbData.notifications.length > 0) { setNotifications(dbData.notifications); hasData = true; }
        if (dbData.userActions && dbData.userActions.length > 0) { setUserActions(dbData.userActions); hasData = true; }

        if (!hasData) {
          // Seed database if empty
          await seedMongoAtlasDatabase({
            users: INITIAL_USERS,
            studentProfiles: INITIAL_STUDENT_PROFILES,
            userActions: INITIAL_USER_ACTIONS,
            levels: INITIAL_LEVELS,
            modules: INITIAL_MODULES,
            lessons: INITIAL_LESSONS,
            tools: INITIAL_TOOLS,
            resources: INITIAL_RESOURCES,
            roadmapNodes: INITIAL_ROADMAP_NODES,
            tasks: INITIAL_TASKS,
            projects: INITIAL_PROJECTS,
            submissions: INITIAL_SUBMISSIONS,
            achievements: INITIAL_ACHIEVEMENTS,
            announcements: INITIAL_ANNOUNCEMENTS,
            notifications: INITIAL_NOTIFICATIONS,
          });
        }
      }
    };

    hydrateAndSeed();

    // Subscribe to Socket.io real-time updates from Express/MongoDB server
    const unsubscribeSocket = subscribeToRealTimeUpdates((payload) => {
      const { entity, action, data, id } = payload;

      if (action === 'seeded' || entity === 'all') {
        hydrateAndSeed();
        return;
      }

      if (entity === 'levels') {
        if (action === 'delete') setLevels(prev => prev.filter(item => item.id !== id));
        else if (data) setLevels(prev => [...prev.filter(item => item.id !== data.id), data].sort((a, b) => a.order - b.order));
      } else if (entity === 'modules') {
        if (action === 'delete') setModules(prev => prev.filter(item => item.id !== id));
        else if (data) setModules(prev => [...prev.filter(item => item.id !== data.id), data].sort((a, b) => a.order - b.order));
      } else if (entity === 'lessons') {
        if (action === 'delete') setLessons(prev => prev.filter(item => item.id !== id));
        else if (data) setLessons(prev => [...prev.filter(item => item.id !== data.id), data].sort((a, b) => a.order - b.order));
      } else if (entity === 'tasks') {
        if (action === 'delete') setTasks(prev => prev.filter(item => item.id !== id));
        else if (data) setTasks(prev => [...prev.filter(item => item.id !== data.id), data]);
      } else if (entity === 'projects') {
        if (action === 'delete') setProjects(prev => prev.filter(item => item.id !== id));
        else if (data) setProjects(prev => [...prev.filter(item => item.id !== data.id), data]);
      } else if (entity === 'tools') {
        if (action === 'delete') setTools(prev => prev.filter(item => item.id !== id));
        else if (data) setTools(prev => [...prev.filter(item => item.id !== data.id), data]);
      } else if (entity === 'resources') {
        if (action === 'delete') setResources(prev => prev.filter(item => item.id !== id));
        else if (data) setResources(prev => [...prev.filter(item => item.id !== data.id), data]);
      } else if (entity === 'roadmapNodes') {
        if (action === 'delete') setRoadmapNodes(prev => prev.filter(item => item.id !== id));
        else if (data) setRoadmapNodes(prev => [...prev.filter(item => item.id !== data.id), data].sort((a, b) => a.order - b.order));
      } else if (entity === 'announcements') {
        if (action === 'delete') setAnnouncements(prev => prev.filter(item => item.id !== id));
        else if (data) setAnnouncements(prev => [data, ...prev.filter(item => item.id !== data.id)]);
      } else if (entity === 'achievements') {
        if (action === 'delete') setAchievements(prev => prev.filter(item => item.id !== id));
        else if (data) setAchievements(prev => [...prev.filter(item => item.id !== data.id), data]);
      } else if (entity === 'submissions') {
        if (action === 'delete') setSubmissions(prev => prev.filter(item => item.id !== id));
        else if (data) setSubmissions(prev => [data, ...prev.filter(item => item.id !== data.id)]);
      } else if (entity === 'notifications') {
        if (action === 'delete') setNotifications(prev => prev.filter(item => item.id !== id));
        else if (data) setNotifications(prev => [data, ...prev.filter(item => item.id !== data.id)]);
      } else if (entity === 'userActions') {
        if (action === 'delete') setUserActions(prev => prev.filter(item => item.id !== id));
        else if (data) setUserActions(prev => [data, ...prev.filter(item => item.id !== data.id)]);
      } else if (entity === 'users') {
        if (action === 'delete') setUsers(prev => prev.filter(item => item.id !== id));
        else if (data) setUsers(prev => [...prev.filter(item => item.id !== data.id), data]);
      } else if (entity === 'studentProfiles') {
        if (action === 'delete') {
          setStudentProfiles(prev => {
            const copy = { ...prev };
            delete copy[id!];
            return copy;
          });
        } else if (data && data.userId) {
          setStudentProfiles(prev => ({ ...prev, [data.userId]: data }));
        }
      }
    });

    return () => {
      unsubscribeSocket();
    };
  }, []);

  // REAL-TIME SYNC: Listen to Firestore registered users and save them to MongoDB Atlas
  useEffect(() => {
    try {
      const unsubscribeFirestoreUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedUsers: User[] = snapshot.docs.map(docSnap => {
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
            const emailMap = new Map<string, User>();
            prev.forEach(u => {
              if (u.email) emailMap.set(u.email.toLowerCase(), u);
            });
            fetchedUsers.forEach(u => {
              if (u.email) emailMap.set(u.email.toLowerCase(), u);
              syncToMongoAtlas('users', u);
            });
            return Array.from(emailMap.values());
          });
        }
      });

      return () => unsubscribeFirestoreUsers();
    } catch (e) {
      console.warn("Firestore live users sync notice:", e);
    }
  }, []);

  const logUserAction = (actionData: Omit<UserAction, 'id' | 'timestamp'>) => {
    const newAction: UserAction = {
      ...actionData,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString(),
    };
    setUserActions(prev => [newAction, ...prev]);
    syncToMongoAtlas('userActions', newAction);
  };

  // REGISTER GOOGLE AUTH USER
  const registerGoogleUser = (googleUser: User) => {
    const userEmailLower = googleUser.email.toLowerCase();

    setUsers(prev => {
      const emailMap = new Map<string, User>();
      prev.forEach(u => {
        if (u.email) emailMap.set(u.email.toLowerCase(), u);
      });
      const updatedUser = {
        ...googleUser,
        authProvider: 'google' as const,
      };
      emailMap.set(userEmailLower, updatedUser);
      syncToMongoAtlas('users', updatedUser);
      return Array.from(emailMap.values());
    });

    setStudentProfiles(prev => {
      if (prev[googleUser.id]) return prev;

      const existingKey = Object.keys(prev).find(k => prev[k]?.userId === googleUser.id);
      if (existingKey) return prev;

      const newProfile: StudentProfile = {
        userId: googleUser.id,
        level: 1,
        levelTitle: 'LEVEL 01 — Python Foundations',
        xp: 0,
        streak: 1,
        skills: { 'Python': 50, 'AI Engineering': 30 },
        completedModuleIds: [],
        completedLessonIds: [],
        completedTaskIds: [],
        completedProjectIds: [],
        unlockedAchievementIds: [],
      };

      syncToMongoAtlas('studentProfiles', newProfile);

      return {
        ...prev,
        [googleUser.id]: newProfile,
      };
    });

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
    const targetLesson = lessons.find(l => l.id === lessonId);

    let isCourseCompleted = false;
    let moduleTitle = '';

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
        lessonWatchProgress: {},
      };

      if (profile.completedLessonIds.includes(lessonId)) return prev;

      const updatedCompletedLessons = [...profile.completedLessonIds, lessonId];
      let updatedCompletedModules = [...profile.completedModuleIds];

      if (targetLesson) {
        const moduleLessons = lessons.filter(l => l.moduleId === targetLesson.moduleId && l.published);
        const allCompleted = moduleLessons.every(l => updatedCompletedLessons.includes(l.id));

        if (allCompleted && !updatedCompletedModules.includes(targetLesson.moduleId)) {
          updatedCompletedModules.push(targetLesson.moduleId);
          isCourseCompleted = true;
          const targetModule = modules.find(m => m.id === targetLesson.moduleId);
          if (targetModule) moduleTitle = targetModule.title;
        }
      }

      const newXP = (profile.xp || 0) + xpReward;

      let newLevel = 1;
      let newLevelTitle = 'LEVEL 01 — Python Foundations';

      if (newXP > 500) { newLevel = 6; newLevelTitle = 'LEVEL 06 — AGENTIC AI & AI ENGINEERING'; }
      else if (newXP > 400) { newLevel = 5; newLevelTitle = 'LEVEL 05 — GENERATIVE AI'; }
      else if (newXP > 300) { newLevel = 4; newLevelTitle = 'LEVEL 04 — DEEP LEARNING'; }
      else if (newXP > 200) { newLevel = 3; newLevelTitle = 'LEVEL 03 — MACHINE LEARNING'; }
      else if (newXP > 100) { newLevel = 2; newLevelTitle = 'LEVEL 02 — DATA SCIENCE'; }

      const updatedSkills = { ...(profile.skills || { 'Python': 50 }) };
      updatedSkills['Python'] = Math.min(100, (updatedSkills['Python'] || 50) + 5);

      const updatedProfile: StudentProfile = {
        ...profile,
        xp: newXP,
        level: newLevel,
        levelTitle: newLevelTitle,
        skills: updatedSkills,
        completedLessonIds: updatedCompletedLessons,
        completedModuleIds: updatedCompletedModules,
      };

      syncToMongoAtlas('studentProfiles', updatedProfile);

      return {
        ...prev,
        [studentId]: updatedProfile,
      };
    });

    if (studentUser) {
      logUserAction({
        userId: studentId,
        userName: studentUser.name,
        userEmail: studentUser.email,
        userAvatar: studentUser.avatar,
        actionType: 'lesson_completed',
        description: `Completed lesson "${targetLesson?.title || lessonId}" (+${xpReward} XP)${isCourseCompleted ? ' — Full Course Completed!' : ''}`,
      });
    }

    const now = new Date().toISOString().split('T')[0];
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      studentId,
      title: `Lesson Completed! +${xpReward} XP`,
      message: `You earned +${xpReward} XP for completing lesson "${targetLesson?.title || lessonId}".`,
      type: 'system',
      read: false,
      createdAt: now,
    };
    setNotifications(prev => [newNotif, ...prev]);
    syncToMongoAtlas('notifications', newNotif);

    if (isCourseCompleted) {
      const courseNotif: AppNotification = {
        id: `notif_${Date.now() + 1}`,
        studentId,
        title: `🎉 Course Completed!`,
        message: `Congratulations! You completed the full course "${moduleTitle}".`,
        type: 'achievement',
        read: false,
        createdAt: now,
      };
      setNotifications(prev => [courseNotif, ...prev]);
      syncToMongoAtlas('notifications', courseNotif);
    }
  };

  const updateLessonWatchProgress = (studentId: string, lessonId: string, watchedPercent: number) => {
    const clampedPercent = Math.min(100, Math.max(0, Math.round(watchedPercent)));

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
        lessonWatchProgress: {},
      };

      const existingMap = profile.lessonWatchProgress || {};
      const currentPercent = existingMap[lessonId] || 0;
      if (currentPercent >= clampedPercent) return prev;

      const updatedMap = {
        ...existingMap,
        [lessonId]: clampedPercent,
      };

      const updatedProfile = {
        ...profile,
        lessonWatchProgress: updatedMap,
      };

      syncToMongoAtlas('studentProfiles', updatedProfile);

      return {
        ...prev,
        [studentId]: updatedProfile,
      };
    });
  };

  const submitTaskOrProject = (submissionData: Omit<Submission, 'id' | 'status' | 'submittedAt'>) => {
    const newSub: Submission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      status: 'under_review',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setSubmissions(prev => [newSub, ...prev]);
    syncToMongoAtlas('submissions', newSub);

    logUserAction({
      userId: submissionData.studentId,
      userName: submissionData.studentName,
      userEmail: submissionData.studentEmail,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      actionType: 'submission_created',
      description: `Submitted ${submissionData.type} "${submissionData.targetTitle}" for review`,
    });

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
    syncToMongoAtlas('notifications', notif);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        const updated = { ...n, read: true };
        syncToMongoAtlas('notifications', updated);
        return updated;
      }
      return n;
    }));
  };

  // ADMIN ACTIONS - USERS
  const updateUserStatus = (userId: string, status: 'active' | 'inactive') => {
    const u = users.find(x => x.id === userId);
    setUsers(prev => prev.map(x => {
      if (x.id === userId) {
        const updated = { ...x, status };
        syncToMongoAtlas('users', updated);
        return updated;
      }
      return x;
    }));

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
      const updated = { ...p, xp: p.xp + xpAmount };
      syncToMongoAtlas('studentProfiles', updated);
      return {
        ...prev,
        [userId]: updated,
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

  const deleteUserData = (userId: string) => {
    const u = users.find(x => x.id === userId);
    if (u) {
      logUserAction({
        userId,
        userName: u.name,
        userEmail: u.email,
        userAvatar: u.avatar,
        actionType: 'account_deleted',
        description: `Account permanently deleted for user ${u.email}`,
      });
    }
    setUsers(prev => prev.filter(x => x.id !== userId));
    removeFromMongoAtlas('users', userId);

    setStudentProfiles(prev => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
    removeFromMongoAtlas('studentProfiles', userId);

    setNotifications(prev => prev.filter(n => n.studentId !== userId));
  };

  // ADMIN ACTIONS - CMS (LEVELS)
  const createLevel = (data: Omit<Level, 'id'>) => {
    const newLevel: Level = { ...data, id: `lvl_${Date.now()}` };
    setLevels(prev => [...prev, newLevel]);
    syncToMongoAtlas('levels', newLevel);
  };
  const updateLevel = (data: Level) => {
    setLevels(prev => prev.map(l => l.id === data.id ? data : l));
    syncToMongoAtlas('levels', data);
  };
  const deleteLevel = (id: string) => {
    setLevels(prev => prev.filter(l => l.id !== id));
    removeFromMongoAtlas('levels', id);
  };
  const toggleLevelPublish = (id: string) => {
    setLevels(prev => prev.map(l => {
      if (l.id === id) {
        const updated = { ...l, published: !l.published };
        syncToMongoAtlas('levels', updated);
        return updated;
      }
      return l;
    }));
  };

  const toggleLevelLock = (id: string) => {
    setLevels(prev => prev.map(l => {
      if (l.id === id) {
        const updated = { ...l, isLocked: !Boolean(l.isLocked) };
        syncToMongoAtlas('levels', updated);
        return updated;
      }
      return l;
    }));
  };

  // ADMIN ACTIONS - CMS (MODULES)
  const createModule = (data: Omit<Module, 'id'>) => {
    const newMod: Module = { ...data, id: `mod_${Date.now()}` };
    setModules(prev => [...prev, newMod]);
    syncToMongoAtlas('modules', newMod);
  };
  const updateModule = (data: Module) => {
    setModules(prev => prev.map(m => m.id === data.id ? data : m));
    syncToMongoAtlas('modules', data);
  };
  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
    removeFromMongoAtlas('modules', id);
  };
  const toggleModulePublish = (id: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, published: !m.published };
        syncToMongoAtlas('modules', updated);
        return updated;
      }
      return m;
    }));
  };

  // ADMIN ACTIONS - CMS (LESSONS)
  const createLesson = (data: Omit<Lesson, 'id'>) => {
    const newLes: Lesson = { ...data, id: `les_${Date.now()}` };
    setLessons(prev => [...prev, newLes]);
    syncToMongoAtlas('lessons', newLes);
  };
  const updateLesson = (data: Lesson) => {
    setLessons(prev => prev.map(l => l.id === data.id ? data : l));
    syncToMongoAtlas('lessons', data);
  };
  const deleteLesson = (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
    removeFromMongoAtlas('lessons', id);
  };
  const toggleLessonPublish = (id: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === id) {
        const updated = { ...l, published: !l.published };
        syncToMongoAtlas('lessons', updated);
        return updated;
      }
      return l;
    }));
  };

  // ADMIN ACTIONS - CMS (TOOLS)
  const createTool = (data: Omit<Tool, 'id'>) => {
    const newTool: Tool = { ...data, id: `tool_${Date.now()}` };
    setTools(prev => [...prev, newTool]);
    syncToMongoAtlas('tools', newTool);
  };
  const updateTool = (data: Tool) => {
    setTools(prev => prev.map(t => t.id === data.id ? data : t));
    syncToMongoAtlas('tools', data);
  };
  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
    removeFromMongoAtlas('tools', id);
  };
  const toggleToolPublish = (id: string) => {
    setTools(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, published: !t.published };
        syncToMongoAtlas('tools', updated);
        return updated;
      }
      return t;
    }));
  };

  // ADMIN ACTIONS - CMS (RESOURCES)
  const createResource = (data: Omit<Resource, 'id'>) => {
    const newRes: Resource = { ...data, id: `res_${Date.now()}` };
    setResources(prev => [...prev, newRes]);
    syncToMongoAtlas('resources', newRes);
  };
  const updateResource = (data: Resource) => {
    setResources(prev => prev.map(r => r.id === data.id ? data : r));
    syncToMongoAtlas('resources', data);
  };
  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    removeFromMongoAtlas('resources', id);
  };
  const toggleResourcePublish = (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, published: !r.published };
        syncToMongoAtlas('resources', updated);
        return updated;
      }
      return r;
    }));
  };

  // ADMIN ACTIONS - CMS (TASKS)
  const createTask = (data: Omit<Task, 'id'>) => {
    const newTask: Task = { ...data, id: `task_${Date.now()}` };
    setTasks(prev => [...prev, newTask]);
    syncToMongoAtlas('tasks', newTask);
  };
  const updateTask = (data: Task) => {
    setTasks(prev => prev.map(t => t.id === data.id ? data : t));
    syncToMongoAtlas('tasks', data);
  };
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    removeFromMongoAtlas('tasks', id);
  };
  const toggleTaskPublish = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, published: !t.published };
        syncToMongoAtlas('tasks', updated);
        return updated;
      }
      return t;
    }));
  };

  // ADMIN ACTIONS - CMS (PROJECTS)
  const createProject = (data: Omit<Project, 'id'>) => {
    const newProj: Project = { ...data, id: `proj_${Date.now()}` };
    setProjects(prev => [...prev, newProj]);
    syncToMongoAtlas('projects', newProj);
  };
  const updateProject = (data: Project) => {
    setProjects(prev => prev.map(p => p.id === data.id ? data : p));
    syncToMongoAtlas('projects', data);
  };
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    removeFromMongoAtlas('projects', id);
  };
  const toggleProjectPublish = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, published: !p.published };
        syncToMongoAtlas('projects', updated);
        return updated;
      }
      return p;
    }));
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
    const updatedSub: Submission = {
      ...sub,
      status,
      feedback,
      reviewedBy: adminName,
      reviewedAt: now,
    };

    setSubmissions(prev => prev.map(s => s.id === submissionId ? updatedSub : s));
    syncToMongoAtlas('submissions', updatedSub);

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

        const updatedProfile = {
          ...p,
          xp: newXP,
          skills: updatedSkills,
          completedTaskIds: completedTasks,
          completedProjectIds: completedProjects,
        };

        syncToMongoAtlas('studentProfiles', updatedProfile);

        return {
          ...prev,
          [sub.studentId]: updatedProfile,
        };
      });

      logUserAction({
        userId: sub.studentId,
        userName: sub.studentName,
        userEmail: sub.studentEmail,
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        actionType: 'xp_awarded',
        description: `Submission approved by ${adminName}. Awarded +${xpEarned} XP`,
      });

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
      syncToMongoAtlas('notifications', notif);
    } else {
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
      syncToMongoAtlas('notifications', notif);
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
    syncToMongoAtlas('announcements', newAnn);
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    removeFromMongoAtlas('announcements', id);
  };

  // ADMIN ACTIONS - ROADMAP NODES
  const createRoadmapNode = (data: Omit<RoadmapNode, 'id'>) => {
    const newNode: RoadmapNode = { ...data, id: `rm_${Date.now()}` };
    setRoadmapNodes(prev => [...prev, newNode]);
    syncToMongoAtlas('roadmapNodes', newNode);
  };

  const updateRoadmapNode = (data: RoadmapNode) => {
    setRoadmapNodes(prev => prev.map(n => n.id === data.id ? data : n));
    syncToMongoAtlas('roadmapNodes', data);
  };

  const deleteRoadmapNode = (id: string) => {
    setRoadmapNodes(prev => prev.filter(n => n.id !== id));
    removeFromMongoAtlas('roadmapNodes', id);
  };

  // ADMIN ACTIONS - ACHIEVEMENTS
  const createAchievement = (data: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = { ...data, id: `ach_${Date.now()}` };
    setAchievements(prev => [...prev, newAch]);
    syncToMongoAtlas('achievements', newAch);
  };
  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    removeFromMongoAtlas('achievements', id);
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
      updateLessonWatchProgress,
      submitTaskOrProject,
      markNotificationRead,

      updateUserStatus,
      assignStudentXP,
      deleteUserData,

      createLevel,
      updateLevel,
      deleteLevel,
      toggleLevelPublish,
      toggleLevelLock,

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
      deleteRoadmapNode,
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
