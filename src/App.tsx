import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { GradientWaves } from './components/common/GradientWaves';

// Route Guards
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { StudentRoute } from './routes/StudentRoute';

// Layouts
import { StudentLayout } from './components/layout/StudentLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Landing } from './pages/Landing';
import { Unauthorized } from './pages/Unauthorized';

// Student Pages
import { StudentDashboard } from './pages/student/Dashboard';
import { LearningHub } from './pages/student/Learning';
import { ModuleDetail } from './pages/student/ModuleDetail';
import { LessonView } from './pages/student/LessonView';
import { ToolsDirectory } from './pages/student/Tools';
import { ResourcesCatalog } from './pages/student/Resources';
import { VisualRoadmap } from './pages/student/VisualRoadmap';
import { TasksProjects } from './pages/student/TasksProjects';
import { StudentAnalyticsBoard } from './pages/student/AnalyticsBoard';
import { StudentProfileView } from './pages/student/StudentProfile';
import { NotificationsCenter } from './pages/student/Notifications';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentMgmt } from './pages/admin/StudentMgmt';
import { ContentCMS } from './pages/admin/ContentCMS';
import { ResourcesCMS } from './pages/admin/ResourcesCMS';
import { RoadmapCMS } from './pages/admin/RoadmapCMS';
import { TasksProjectsCMS } from './pages/admin/TasksProjectsCMS';
import { SubmissionsReview } from './pages/admin/SubmissionsReview';
import { AchievementsCMS } from './pages/admin/AchievementsCMS';
import { AnnouncementsCMS } from './pages/admin/AnnouncementsCMS';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

import { ErrorBoundary } from './components/common/ErrorBoundary';

/**
 * Default Redirect Component for Catch-All Routes
 */
const RootOrFallbackRedirect: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'student') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
        <div className="relative min-h-screen bg-[#161616] overflow-hidden">
          {/* React Bits GradientWaves 3D Raymarched Canvas Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <GradientWaves
              horizonColor="#710014" // Crimson Depth
              waveColor="#B38F6F" // Warm Sand
              crestColor="#F2F1ED" // Soft Pearl
              speed={0.4}
              amplitude={2.5}
              waveScale={0.6}
              waveRatio={0.9}
              swell={35}
              turbulence={20}
              tilt={1.11}
              zoom={1.0}
              height={5.5}
              fogDepth={15}
              detail="medium"
              brightness={1.2}
              opacity={0.9}
              mouseInteraction={true}
              parallaxStrength={0.5}
              grain={true}
              grainIntensity={0.04}
            />
          </div>

          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Landing />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Student Routes (Require Auth + role === 'student') */}
              <Route element={<ProtectedRoute />}>
                <Route element={<StudentRoute />}>
                  <Route element={<StudentLayout />}>
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/learning" element={<LearningHub />} />
                    <Route path="/learning/:moduleId" element={<Navigate to="/resources" replace />} />
                    <Route path="/learning/:moduleId/:lessonId" element={<LessonView />} />
                    <Route path="/lesson/:lessonId" element={<LessonView />} />
                    <Route path="/tools" element={<ToolsDirectory />} />
                    <Route path="/resources" element={<ResourcesCatalog />} />
                    <Route path="/roadmap" element={<VisualRoadmap />} />
                    <Route path="/tasks" element={<TasksProjects />} />
                    <Route path="/tasks/:taskId" element={<TasksProjects />} />
                    <Route path="/projects" element={<TasksProjects />} />
                    <Route path="/achievements" element={<StudentAnalyticsBoard />} />
                    <Route path="/events" element={<NotificationsCenter />} />
                    <Route path="/announcements" element={<NotificationsCenter />} />
                    <Route path="/profile" element={<StudentProfileView />} />
                  </Route>
                </Route>
              </Route>

              {/* Protected Admin Routes (Require Auth + role === 'admin') */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<StudentMgmt />} />
                    <Route path="/admin/courses" element={<ContentCMS />} />
                    <Route path="/admin/modules" element={<ContentCMS />} />
                    <Route path="/admin/lessons" element={<ContentCMS />} />
                    <Route path="/admin/resources" element={<ResourcesCMS />} />
                    <Route path="/admin/tools" element={<ResourcesCMS />} />
                    <Route path="/admin/roadmap" element={<RoadmapCMS />} />
                    <Route path="/admin/tasks" element={<TasksProjectsCMS />} />
                    <Route path="/admin/projects" element={<TasksProjectsCMS />} />
                    <Route path="/admin/submissions" element={<SubmissionsReview />} />
                    <Route path="/admin/achievements" element={<AchievementsCMS />} />
                    <Route path="/admin/events" element={<AnnouncementsCMS />} />
                    <Route path="/admin/announcements" element={<AnnouncementsCMS />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/settings" element={<AdminDashboard />} />
                  </Route>
                </Route>
              </Route>

              {/* Root & Catch-All Fallback */}
              <Route path="/" element={<RootOrFallbackRedirect />} />
              <Route path="*" element={<RootOrFallbackRedirect />} />
            </Routes>
          </BrowserRouter>
        </div>
      </DataProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
