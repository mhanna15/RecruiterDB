import firebase, {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../firebase';

interface Context {
  currentUser: firebase.User | undefined;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Context | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User>();

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      return e.code;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      return e.code;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider).then((result) => {
        const details = getAdditionalUserInfo(result);
        const email = result.user.email;
        return { email, isNewUser: details?.isNewUser };
      });
    } catch (e: any) {
      return e.code;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e: any) {
      return e.code;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setCurrentUser(undefined);
      } else {
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Context => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be within AuthProvider');
  }
  return context;
};
