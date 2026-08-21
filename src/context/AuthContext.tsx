import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../data/mockSeedData';
import { 
  auth, 
  db,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  FirebaseUser
} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const ADMIN_USER_ID = 'nz5qAUHfP2OKIcPF4DqidBz2sQC2';
export const ADMIN_USER_IDS = ['nz5qAUHfP2OKIcPF4DqidBz2sQC2', 'yZzLNGTfEHeGT6cBKkspxb8H1SG3'];
export const ADMIN_EMAILS = ['naushadabdul2006@gmail.com', 'admin@neuralinks.club'];

export const isUserAdminCheck = (uid?: string, email?: string): boolean => {
  if (!uid && !email) return false;
  if (uid && ADMIN_USER_IDS.includes(uid)) return true;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true;
  return false;
};

interface AuthResponse {
  success: boolean;
  requiresVerification?: boolean;
  email?: string;
  message?: string;
}

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loadingAuth: boolean;
  role: Role | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  loginWithGoogle: () => Promise<AuthResponse>;
  signInWithEmail: (email: string, pass: string) => Promise<AuthResponse>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<AuthResponse>;
  updateUserName: (newName: string) => Promise<void>;
  loginAs: (targetRole: 'admin' | 'student') => void;
  switchDemoRole: (targetRole: 'admin' | 'student' | 'unregistered') => void;
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Tab-isolated session initial state resolution
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const tabSaved = sessionStorage.getItem('nlbc_tab_user');
    if (tabSaved) {
      try { return JSON.parse(tabSaved); } catch (e) {}
    }
    return null;
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  // Sync Firebase Auth state with tab session isolation & ID Token Custom Claims verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      let currentTabUser: User | null = null;
      const rawTabSaved = sessionStorage.getItem('nlbc_tab_user');
      if (rawTabSaved) {
        try { currentTabUser = JSON.parse(rawTabSaved); } catch (e) {}
      }

      if (user) {
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');

        // Asynchronously verify Firebase Custom Claims on the ID Token
        let hasAdminClaim = false;
        try {
          const tokenResult = await user.getIdTokenResult(true);
          if (tokenResult.claims && (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin')) {
            hasAdminClaim = true;
          }
        } catch (claimErr) {
          console.warn("Custom claims token verification notice:", claimErr);
        }

        const isUserAdmin = hasAdminClaim || isUserAdminCheck(user.uid, user.email || undefined);
        
        const authenticatedUser: User = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Club User',
          email: user.email || '',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: isUserAdmin ? 'admin' : 'student',
          status: 'active',
          joinedDate: new Date().toISOString().split('T')[0],
          authProvider: isGoogleUser ? 'google' : 'email',
        };

        try {
          setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            name: authenticatedUser.name,
            email: authenticatedUser.email,
            role: authenticatedUser.role,
            avatar: authenticatedUser.avatar,
            authProvider: authenticatedUser.authProvider,
            createdAt: authenticatedUser.joinedDate,
          }, { merge: true });
        } catch (e) {
          console.warn("Firestore user sync notice:", e);
        }

        // Prevent cross-tab auth state contamination
        if (currentTabUser && currentTabUser.id !== user.uid) {
          setCurrentUser(currentTabUser);
        } else {
          setCurrentUser(authenticatedUser);
          sessionStorage.setItem('nlbc_tab_user', JSON.stringify(authenticatedUser));
        }
      } else {
        // Handle global logout vs tab isolation
        if (currentTabUser && !sessionStorage.getItem('nlbc_tab_explicit_logout')) {
          setCurrentUser(currentTabUser);
        } else {
          setCurrentUser(null);
          sessionStorage.removeItem('nlbc_tab_user');
          sessionStorage.removeItem('nlbc_tab_explicit_logout');
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle mobile Google redirect result return
  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        const user = result.user;
        let hasAdminClaim = false;
        try {
          const tokenResult = await user.getIdTokenResult(true);
          if (tokenResult.claims && (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin')) {
            hasAdminClaim = true;
          }
        } catch (e) {}

        const isUserAdmin = hasAdminClaim || isUserAdminCheck(user.uid, user.email || undefined);
        const authenticatedUser: User = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Club User',
          email: user.email || '',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: isUserAdmin ? 'admin' : 'student',
          status: 'active',
          joinedDate: new Date().toISOString().split('T')[0],
          authProvider: 'google',
        };
        try {
          setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            name: authenticatedUser.name,
            email: authenticatedUser.email,
            role: authenticatedUser.role,
            avatar: authenticatedUser.avatar,
            authProvider: 'google',
            createdAt: authenticatedUser.joinedDate,
          }, { merge: true });
        } catch (e) {
          console.warn("Mobile sync doc error:", e);
        }
        sessionStorage.removeItem('nlbc_tab_explicit_logout');
        sessionStorage.setItem('nlbc_tab_user', JSON.stringify(authenticatedUser));
        setCurrentUser(authenticatedUser);
      }
    }).catch((e) => console.warn("Mobile redirect auth result notice:", e));
  }, []);

  // Save current user strictly to tab-scoped sessionStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('nlbc_tab_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('nlbc_tab_user');
    }
  }, [currentUser]);

  const role = currentUser?.role || null;
  const isAuthenticated = currentUser !== null && currentUser.status === 'active';
  const isApproved = currentUser ? currentUser.status === 'active' : false;
  const isAdmin = currentUser ? (isUserAdminCheck(currentUser.id, currentUser.email) || currentUser.role === 'admin') && isApproved : false;
  const isStudent = currentUser ? currentUser.role === 'student' && !isAdmin && isApproved : false;

  const loginAs = (_targetRole: 'admin' | 'student') => {};

  // Firebase Google Sign In handling for Desktop, Mobile Safari/Chrome & In-App WebViews
  const loginWithGoogle = async (): Promise<AuthResponse> => {
    sessionStorage.removeItem('nlbc_tab_explicit_logout');

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isWebView = /wv|WebView|FB_IAB|FB4A|Instagram|LinkedInApp|Snapchat/i.test(userAgent);
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent) || window.innerWidth <= 768;

    if (isWebView) {
      return {
        success: false,
        message: "Google Sign-In is restricted inside in-app webviews (Instagram, Facebook, LinkedIn). Please open this website in Safari or Chrome."
      };
    }

    // Try signInWithPopup first in click event (bypasses Safari ITP cross-origin redirect cookie blocking on mobile)
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let hasAdminClaim = false;
      try {
        const tokenResult = await user.getIdTokenResult(true);
        if (tokenResult.claims && (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin')) {
          hasAdminClaim = true;
        }
      } catch (e) {}

      const isUserAdmin = hasAdminClaim || isUserAdminCheck(user.uid, user.email || undefined);

      const authenticatedUser: User = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Club User',
        email: user.email || '',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: isUserAdmin ? 'admin' : 'student',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        authProvider: 'google',
      };

      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          role: authenticatedUser.role,
          avatar: authenticatedUser.avatar,
          authProvider: 'google',
          createdAt: authenticatedUser.joinedDate,
        }, { merge: true });
      } catch (e) {
        console.warn("Firestore sync google user notice:", e);
      }

      sessionStorage.setItem('nlbc_tab_user', JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      console.warn("Firebase Google Auth Popup error:", error);

      // Fallback to signInWithRedirect if popup is blocked or on mobile error
      if (
        isMobile ||
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { success: true };
        } catch (redirectErr: any) {
          if (redirectErr.code === 'auth/unauthorized-domain') {
            return {
              success: false,
              message: "Firebase Domain Error: Please add 'neura-links.vercel.app' (without https://) in Firebase Console -> Auth -> Settings -> Authorized Domains."
            };
          }
          return { success: false, message: redirectErr.message || "Mobile Google sign-in error." };
        }
      }

      if (error.code === 'auth/unauthorized-domain') {
        return { 
          success: false, 
          message: "Firebase Domain Error: Please add 'neura-links.vercel.app' (without https://) in Firebase Console -> Auth -> Settings -> Authorized Domains." 
        };
      }
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: "Google sign-in popup was closed." };
      }
      return { 
        success: false, 
        message: error.message || "Google sign-in error." 
      };
    }
  };

  // Sign In with Firebase Email & Password
  const signInWithEmail = async (email: string, pass: string): Promise<AuthResponse> => {
    sessionStorage.removeItem('nlbc_tab_explicit_logout');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      const isUserAdmin = isUserAdminCheck(user.uid, user.email || undefined);

      const authenticatedUser: User = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Club Student',
        email: user.email || '',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: isUserAdmin ? 'admin' : 'student',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        authProvider: 'email',
      };

      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          role: authenticatedUser.role,
          avatar: authenticatedUser.avatar,
          authProvider: 'email',
          createdAt: authenticatedUser.joinedDate,
        }, { merge: true });
      } catch (e) {
        console.warn("Firestore user sync notice:", e);
      }

      sessionStorage.setItem('nlbc_tab_user', JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          message: "Firebase Domain Error: Please add 'neura-links.vercel.app' (without https://) in Firebase Console -> Auth -> Settings -> Authorized Domains."
        };
      }
      return { 
        success: false, 
        message: "Email or password is incorrect" 
      };
    }
  };

  // Sign Up with Firebase Email & Password
  const signUpWithEmail = async (email: string, pass: string, name?: string): Promise<AuthResponse> => {
    sessionStorage.removeItem('nlbc_tab_explicit_logout');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      if (name && name.trim()) {
        try {
          await updateProfile(user, { displayName: name.trim() });
        } catch (e) {
          console.warn("Set displayName warning:", e);
        }
      }

      const isUserAdmin = isUserAdminCheck(user.uid, user.email || undefined);

      const authenticatedUser: User = {
        id: user.uid,
        name: name?.trim() || user.displayName || user.email?.split('@')[0] || 'Club Student',
        email: user.email || email.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: isUserAdmin ? 'admin' : 'student',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        authProvider: 'email',
      };

      // Sync user profile document into Firestore database
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          role: authenticatedUser.role,
          avatar: authenticatedUser.avatar,
          createdAt: authenticatedUser.joinedDate,
          uploadedFilesCount: 0,
        }, { merge: true });
      } catch (e) {
        console.warn("Firestore sync user error:", e);
      }

      sessionStorage.setItem('nlbc_tab_user', JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          message: "Firebase Domain Error: Please add 'neura-links.vercel.app' (without https://) in Firebase Console -> Auth -> Settings -> Authorized Domains."
        };
      }
      if (error.code === 'auth/email-already-in-use') {
        return { 
          success: false, 
          message: "User already exists. Please sign in" 
        };
      }
      if (error.code === 'auth/invalid-email' || error.code === 'auth/weak-password') {
        return {
          success: false,
          message: "Email or password is incorrect"
        };
      }
      return {
        success: false,
        message: "Registration failed. Please check details."
      };
    }
  };

  // Update User Display Name
  const updateUserName = async (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch (e) {
        console.warn("Update profile error:", e);
      }
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), { name: trimmed }, { merge: true });
      } catch (e) {
        console.warn("Firestore name update error:", e);
      }
    }

    setCurrentUser(prev => prev ? { ...prev, name: trimmed } : null);
  };

  const switchDemoRole = (_targetRole: 'admin' | 'student' | 'unregistered') => {
    sessionStorage.removeItem('nlbc_tab_user');
    setCurrentUser(null);
  };

  // Sign out
  const logout = async () => {
    sessionStorage.removeItem('nlbc_tab_user');
    sessionStorage.setItem('nlbc_tab_explicit_logout', 'true');
    setCurrentUser(null);
    setFirebaseUser(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut notice:", e);
    }
    localStorage.removeItem('nlbc_current_user');
  };


  // Asynchronously re-evaluate Firebase ID Token custom claims
  const refreshAdminStatus = async (): Promise<boolean> => {
    if (auth.currentUser) {
      try {
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        const claims = tokenResult.claims || {};
        const isUserAdmin = claims.admin === true || claims.role === 'admin' || isUserAdminCheck(auth.currentUser.uid, auth.currentUser.email || undefined);
        setCurrentUser(prev => prev ? { ...prev, role: isUserAdmin ? 'admin' : 'student' } : null);
        return isUserAdmin;
      } catch (e) {
        console.warn("Refresh admin claims error:", e);
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      loadingAuth,
      role,
      isAuthenticated,
      isApproved,
      isAdmin,
      isStudent,
      loginWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      updateUserName,
      loginAs,
      switchDemoRole,
      logout,
      refreshAdminStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
