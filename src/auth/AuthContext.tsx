import firebase, {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { auth, db } from '../firebase';

interface User extends firebase.User {
  role?: string;
}

interface Context {
  currentUser: User | undefined;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<Context | null>(null);

const getUserRoleFromDb = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role;
  }
};

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User>();

  const addNewUserToDb = async (uid: string, email: string) => {
    await setDoc(doc(db, 'users', uid), { email, templates: [], role: 'user', uid });
  };

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (res) => await addNewUserToDb(res.user.uid, email)
      );
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
    await signInWithPopup(auth, provider).then(async (res) => {
      const details = getAdditionalUserInfo(res);
      const email = res.user.email;
      if (details?.isNewUser && email) {
        await addNewUserToDb(res.user.uid, email);
      }
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e: any) {
      return e.code;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(undefined);
      } else {
        const role = await getUserRoleFromDb(user.uid);
        setCurrentUser({ ...user, role });
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
