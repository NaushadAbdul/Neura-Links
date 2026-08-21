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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Tab-isolated session initial state resolution
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // 1. First check tab-scoped sessionStorage
    const tabSaved = sessionStorage.getItem('nlbc_tab_user');
    if (tabSaved) {
      try { return JSON.parse(tabSaved); } catch (e) {}
    }

    // 2. Check route-based saved session
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      const adminSaved = localStorage.getItem('nlbc_admin_user');
      if (adminSaved) {
        try { return JSON.parse(adminSaved); } catch (e) {}
      }
    } else if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/learning') || currentPath.startsWith('/profile') || currentPath.startsWith('/tasks')) {
      const studentSaved = localStorage.getItem('nlbc_student_user');
      if (studentSaved) {
        try { return JSON.parse(studentSaved); } catch (e) {}
      }
    }

    // 3. Fallback to general saved user
    const saved = localStorage.getItem('nlbc_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  // Sync Firebase Auth state with tab session isolation
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
        if (user.emailVerified || isGoogleUser) {
          const isUserAdmin = isUserAdminCheck(user.uid, user.email || undefined);
          
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

          // TAB ISOLATION CHECK:
          // If this tab is currently on an /admin URL or holds an Admin session, keep Admin in this tab!
          const currentPath = window.location.pathname;
          const tabSession = sessionStorage.getItem('nlbc_tab_user');
          const isTabAdmin = tabSession ? JSON.parse(tabSession)?.role === 'admin' : currentPath.startsWith('/admin');

          if (isTabAdmin && !isUserAdmin) {
            // Do not overwrite an active Admin tab with a student login from another tab
            console.log("Tab Session Guard: Preserving Admin session in Admin tab.");
          } else {
            setCurrentUser(authenticatedUser);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle mobile Google redirect result return
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result && result.user) {
        const user = result.user;
        const isUserAdmin = isUserAdminCheck(user.uid, user.email || undefined);
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
        setCurrentUser(authenticatedUser);
      }
    }).catch((e) => console.warn("Mobile redirect auth result:", e));
  }, []);

  // Save current user to tab-scoped sessionStorage and role-keyed localStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('nlbc_tab_user', JSON.stringify(currentUser));
      if (currentUser.role === 'admin') {
        localStorage.setItem('nlbc_admin_user', JSON.stringify(currentUser));
      } else {
        localStorage.setItem('nlbc_student_user', JSON.stringify(currentUser));
      }
      localStorage.setItem('nlbc_current_user', JSON.stringify(currentUser));
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

  // Firebase Google Sign In with Mobile Redirect Fallback
  const loginWithGoogle = async (): Promise<AuthResponse> => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    if (isMobile) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true };
      } catch (e: any) {
        console.warn("Mobile signInWithRedirect notice:", e);
      }
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isUserAdmin = isUserAdminCheck(user.uid, user.email || undefined);

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

      setCurrentUser(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      console.warn("Firebase Google Auth:", error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/operation-not-supported-in-this-environment') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { success: true };
        } catch (redirectErr: any) {
          return { success: false, message: redirectErr.message || "Mobile sign-in error." };
        }
      }
      if (error.code === 'auth/unauthorized-domain') {
        const simulatedEmail = window.prompt(
          "Firebase Notice: localhost is not yet in Firebase Console -> Auth -> Authorized Domains.\nEnter your Google email to test login:",
          "naushad@neuralinks.club"
        );
        if (simulatedEmail) {
          const isUserAdmin = isUserAdminCheck(undefined, simulatedEmail);
          const fallbackUser: User = {
            id: 'google_user_' + Date.now(),
            name: simulatedEmail.split('@')[0],
            email: simulatedEmail,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            role: isUserAdmin ? 'admin' : 'student',
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
          };
          setCurrentUser(fallbackUser);
          return { success: true };
        }
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      if (!user.emailVerified) {
        try {
          await sendEmailVerification(user);
        } catch (e) {
          console.warn("Email verification resend:", e);
        }
        await signOut(auth);
        setCurrentUser(null);
        setFirebaseUser(null);
        return {
          success: false,
          requiresVerification: true,
          email: user.email || email.trim()
        };
      }
      
      const matchedSeed = INITIAL_USERS.find(u => u.email.toLowerCase() === user.email?.toLowerCase());
      const isUserAdmin = user.uid === ADMIN_USER_ID || user.email?.toLowerCase() === 'admin@neuralinks.club' || matchedSeed?.role === 'admin';

      const authenticatedUser: User = {
        id: user.uid,
        name: user.displayName || matchedSeed?.name || user.email?.split('@')[0] || 'Club Student',
        email: user.email || '',
        avatar: user.photoURL || matchedSeed?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: isUserAdmin ? 'admin' : 'student',
        status: 'active',
        joinedDate: matchedSeed?.joinedDate || new Date().toISOString().split('T')[0],
      };
      setCurrentUser(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: "Email or password is incorrect" 
      };
    }
  };

  // Sign Up with Firebase Email & Password
  const signUpWithEmail = async (email: string, pass: string, name?: string): Promise<AuthResponse> => {
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

      // Sync user profile document into Firestore database
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          name: name?.trim() || user.email?.split('@')[0] || 'Club Student',
          email: user.email || email.trim(),
          role: 'student',
          createdAt: new Date().toISOString().split('T')[0],
          uploadedFilesCount: 0,
        });
      } catch (e) {
        console.warn("Firestore sync user error:", e);
      }

      await sendEmailVerification(user);

      await signOut(auth);
      setCurrentUser(null);
      setFirebaseUser(null);

      return {
        success: false,
        requiresVerification: true,
        email: user.email || email.trim()
      };
    } catch (error: any) {
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
    setCurrentUser(null);
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut notice:", e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    sessionStorage.removeItem('nlbc_tab_user');
    localStorage.removeItem('nlbc_current_user');
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
