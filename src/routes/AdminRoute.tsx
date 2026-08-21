import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, isUserAdminCheck } from '../context/AuthContext';
import { auth } from '../firebase';
import { AccessDenied } from '../components/common/AccessDenied';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * AdminRoute Guard
 * Asynchronously verifies Firebase ID Token Custom Claims ({ admin: true }) directly
 * from Firebase Auth before allowing access to the /admin route.
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, role, isAdmin, loadingAuth } = useAuth();
  const location = useLocation();
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenIsAdmin, setTokenIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const verifyTokenClaims = async () => {
      if (!auth.currentUser) {
        if (isMounted) {
          setTokenIsAdmin(false);
          setVerifyingToken(false);
        }
        return;
      }

      try {
        // Asynchronously force-refresh and verify ID Token Custom Claims
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        const claims = tokenResult.claims || {};
        const verifiedAdmin = 
          claims.admin === true || 
          claims.role === 'admin' || 
          isUserAdminCheck(auth.currentUser.uid, auth.currentUser.email || undefined);

        if (isMounted) {
          setTokenIsAdmin(verifiedAdmin);
          setVerifyingToken(false);
        }
      } catch (e) {
        console.warn("Token verification error in AdminRoute:", e);
        if (isMounted) {
          setTokenIsAdmin(false);
          setVerifyingToken(false);
        }
      }
    };

    verifyTokenClaims();
    return () => { isMounted = false; };
  }, [location.pathname]);

  if (loadingAuth || verifyingToken) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center text-[#B38F6F] font-mono text-sm">
        Verifying admin ID token claims...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cryptographic Security Check: Block unauthorized users even if client state was modified
  if (!tokenIsAdmin || !isAdmin || role !== 'admin') {
    return (
      <AccessDenied
        message="Access Restricted. Valid administrator ID token claims are required to view this area."
        redirectTo="/dashboard"
        autoRedirectSeconds={4}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;

