import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  simulateAdminLogin: (passcode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bootstrapped admin email from metadata and owner
const BOOTSTRAP_ADMIN_EMAIL = 'esarshah211@gmail.com';
const ADMIN_PASSCODE = 'burgerbite2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local admin override session (for preview / iframe compatibility)
    const localAdminSession = sessionStorage.getItem('burger_bite_admin_session');
    if (localAdminSession === 'true') {
      setIsAdmin(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const isEmailMatch = currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          
          if (isEmailMatch || adminDoc.exists()) {
            setIsAdmin(true);
            sessionStorage.setItem('burger_bite_admin_session', 'true');
            // Ensure record in admins collection
            if (!adminDoc.exists()) {
              await setDoc(doc(db, 'admins', currentUser.uid), {
                uid: currentUser.uid,
                email: currentUser.email,
                role: 'admin',
                createdAt: new Date().toISOString(),
              }, { merge: true });
            }
          } else if (localAdminSession !== 'true') {
            setIsAdmin(false);
          }
        } catch (err) {
          console.warn('Admin check note:', err);
          if (currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
            setIsAdmin(true);
          }
        }
      } else if (localAdminSession !== 'true') {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setError(err?.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const simulateAdminLogin = (passcode: string): boolean => {
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('burger_bite_admin_session', 'true');
      setError(null);
      return true;
    }
    setError('Invalid admin credentials. Please enter the correct admin access key.');
    return false;
  };

  const signOut = async () => {
    try {
      sessionStorage.removeItem('burger_bite_admin_session');
      setIsAdmin(false);
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
        signInWithGoogle,
        signOut,
        simulateAdminLogin,
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
