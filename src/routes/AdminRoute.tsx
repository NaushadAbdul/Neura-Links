import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccessDenied } from '../components/common/AccessDenied';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * AdminRoute Guard
 * Responsible for verifying both authentication AND role === 'admin'.
 * 
 * Logic:
 * Not authenticated -> /login
 * Authenticated & role === 'admin' -> Allow route
 * Authenticated & role !== 'admin' -> Display Access Denied UI and redirect to /dashboard
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, role, isAdmin, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center text-[#B38F6F] font-mono text-sm">
        Verifying admin privileges...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Security Check: Block non-admin users with clean Access Denied UI
  if (!isAdmin || role !== 'admin') {
    return (
      <AccessDenied
        message="Access Restricted. Administrator credentials are required to view this area."
        redirectTo="/dashboard"
        autoRedirectSeconds={4}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
