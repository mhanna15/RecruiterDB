import firebase, {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, db } from '../firebase';

interface User extends firebase.User {
  role?: string;
}

interface Context {
  currentUser: User | undefined;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  sendEmailForVerification: () => Promise<any>;
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
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const addNewUserToDb = async (uid: string, email: string) => {
    await setDoc(doc(db, 'users', uid), { email, templates: [], role: 'user', uid });
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await addNewUserToDb(res.user.uid, email);
      await sendEmailVerification(res.user, { url: window.location.href });
    } catch (e: any) {
      return e.code;
    }
  };

  const sendEmailForVerification = async () => {
    try {
      auth.currentUser && (await sendEmailVerification(auth.currentUser));
      console.log('success');
    } catch (e: any) {
      return e;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e: any) {
      return e.code;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const details = getAdditionalUserInfo(res);
    const email = res.user.email;
    if (details?.isNewUser && email) {
      await addNewUserToDb(res.user.uid, email);
    }
    navigate('/');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      window.location.reload();
    } catch (e: any) {
      return e.code;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      setLoading(true);
      if (!user) {
        setCurrentUser(undefined);
      } else {
        const role = await getUserRoleFromDb(user.uid);
        setCurrentUser({ ...user, role });
      }
      setLoading(false);
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
        sendEmailForVerification,
      }}
    >
      {!loading && children}
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
