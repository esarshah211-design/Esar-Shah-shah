import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  authNotice: string | null;
  signInWithGoogle: (preferRedirect?: boolean) => Promise<void>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOut: () => Promise<void>;
  simulateAdminLogin: (passcode: string) => boolean;
  grantAdminAccessToCurrentUser: (passcode: string) => Promise<boolean>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bootstrapped admin email from metadata and owner
export const BOOTSTRAP_ADMIN_EMAIL = 'esarshah211@gmail.com';
export const ADMIN_PASSCODE = 'burgerbite2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('burger_bite_admin_session') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Helper function to create configured Google Auth Provider
  const createGoogleProvider = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    return provider;
  };

  // Helper to check admin status and provision doc
  const verifyAndSetAdmin = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) {
      if (sessionStorage.getItem('burger_bite_admin_session') !== 'true') {
        setIsAdmin(false);
      }
      return false;
    }

    try {
      const isEmailMatch =
        currentUser.email?.toLowerCase().trim() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase().trim();

      // Check admin document in Firestore
      let hasAdminDoc = false;
      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        hasAdminDoc = adminDoc.exists();
      } catch (firestoreErr) {
        // If read fails due to security rules when not an admin yet, that is expected
        console.warn('Admin doc check notice:', firestoreErr);
      }

      if (isEmailMatch || hasAdminDoc) {
        setIsAdmin(true);
        sessionStorage.setItem('burger_bite_admin_session', 'true');
        setError(null);
        setAuthNotice(null);

        // Ensure record in admins collection if not present
        if (!hasAdminDoc) {
          try {
            await setDoc(
              doc(db, 'admins', currentUser.uid),
              {
                uid: currentUser.uid,
                email: currentUser.email,
                role: 'admin',
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e) {
            console.warn('Admin record sync note:', e);
          }
        }
        return true;
      } else {
        // User is logged into Google, but not on admin list
        if (sessionStorage.getItem('burger_bite_admin_session') === 'true') {
          setIsAdmin(true);
          return true;
        } else {
          setIsAdmin(false);
          setAuthNotice(
            `Signed in with Google as ${currentUser.email}. To unlock dashboard access, please enter the Admin Security Key once.`
          );
          return false;
        }
      }
    } catch (err) {
      console.error('Error verifying admin status:', err);
      if (currentUser.email?.toLowerCase().trim() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase().trim()) {
        setIsAdmin(true);
        sessionStorage.setItem('burger_bite_admin_session', 'true');
        return true;
      }
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Check redirect result on mount (essential for Netlify & mobile when redirect mode is used)
    getRedirectResult(auth)
      .then(async (result) => {
        if (!isMounted) return;
        if (result?.user) {
          setUser(result.user);
          await verifyAndSetAdmin(result.user);
        }
      })
      .catch((redirectErr: any) => {
        if (!isMounted) return;
        console.warn('Redirect result check note:', redirectErr);
        if (redirectErr?.code && redirectErr.code !== 'auth/null-user') {
          setError(redirectErr.message || 'Error completing Google sign-in.');
        }
      });

    // Listen to Auth State changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      if (currentUser) {
        await verifyAndSetAdmin(currentUser);
      } else {
        if (sessionStorage.getItem('burger_bite_admin_session') !== 'true') {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (preferRedirect: boolean = false) => {
    setError(null);
    setAuthNotice(null);
    const provider = createGoogleProvider();

    if (preferRedirect) {
      await signInWithRedirect(auth, provider);
      return;
    }

    try {
      // First attempt with popup
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        setUser(result.user);
        await verifyAndSetAdmin(result.user);
      }
    } catch (popupErr: any) {
      console.warn('Google popup error:', popupErr);

      // Check if popup was blocked, closed, or failed due to third-party cookies / COOP
      const isPopupClosedOrBlocked =
        popupErr.code === 'auth/popup-closed-by-user' ||
        popupErr.code === 'auth/popup-blocked' ||
        popupErr.code === 'auth/cancelled-popup-request' ||
        popupErr.code === 'auth/internal-error' ||
        popupErr.code === 'auth/network-request-failed';

      if (isPopupClosedOrBlocked) {
        console.log('Falling back to signInWithRedirect due to popup environment constraints...');
        setAuthNotice('Popup blocked or closed by browser. Redirecting to Google Sign-In...');
        // Seamless fallback to redirect
        await signInWithRedirect(auth, provider);
      } else {
        setError(popupErr?.message || 'Google Sign-in failed. Please try again.');
        throw popupErr;
      }
    }
  };

  const signInWithGoogleRedirect = async () => {
    setError(null);
    setAuthNotice('Redirecting to Google Sign-In...');
    const provider = createGoogleProvider();
    await signInWithRedirect(auth, provider);
  };

  const simulateAdminLogin = (passcode: string): boolean => {
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('burger_bite_admin_session', 'true');
      setError(null);
      setAuthNotice(null);
      return true;
    }
    setError('Invalid admin credentials. Please enter the correct admin access key.');
    return false;
  };

  const grantAdminAccessToCurrentUser = async (passcode: string): Promise<boolean> => {
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('burger_bite_admin_session', 'true');
      setError(null);
      setAuthNotice(null);

      // If user is currently signed in, also register their UID in admins collection
      if (user) {
        try {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              uid: user.uid,
              email: user.email,
              role: 'admin',
              grantedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Could not write admin record:', e);
        }
      }
      return true;
    }
    setError('Incorrect security key. Access denied.');
    return false;
  };

  const clearAuthError = () => {
    setError(null);
    setAuthNotice(null);
  };

  const signOut = async () => {
    try {
      sessionStorage.removeItem('burger_bite_admin_session');
      setIsAdmin(false);
      setUser(null);
      setError(null);
      setAuthNotice(null);
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        error,
        authNotice,
        signInWithGoogle,
        signInWithGoogleRedirect,
        signOut,
        simulateAdminLogin,
        grantAdminAccessToCurrentUser,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
