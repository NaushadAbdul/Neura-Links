import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface StudentRouteProps {
  children?: React.ReactNode;
}

/**
 * StudentRoute Guard
 * Responsible for verifying authentication AND role === 'student'.
 * 
 * Logic:
 * Not authenticated -> /login
 * Authenticated & role === 'student' -> Allow route
 * Authenticated & role !== 'student' (e.g. Admin) -> Redirect to /admin
 */
export const StudentRoute: React.FC<StudentRouteProps> = ({ children }) => {
  const { isAuthenticated, role, isStudent, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center text-[#B38F6F] font-mono text-sm">
        Loading student session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect admin users attempting to access student-only view to /admin
  if (!isStudent && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default StudentRoute;
