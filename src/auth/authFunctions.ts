import React, { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';

export const handleSignUp = async (
  e: any,
  signup: any,
  email: string,
  password: string,
  navigate: NavigateFunction,
  setError: Dispatch<SetStateAction<string>>
) => {
  e.preventDefault();
  try {
    await signup(email, password);
    navigate('/');
  } catch (e: any) {
    setError(JSON.stringify(e));
  }
};

export const handleLogin = async (
  e: any,
  login: any,
  email: string,
  password: string,
  navigate: NavigateFunction,
  setError: Dispatch<SetStateAction<string>>
) => {
  e.preventDefault();
  try {
    await login(email, password);
    navigate('/');
  } catch (e: any) {
    setError(JSON.stringify(e));
  }
};

export const handleGoogleLogin = async (
  e: any,
  loginWithGoogle: any,
  navigate: NavigateFunction,
  setError: Dispatch<SetStateAction<string>>
) => {
  e.preventDefault();
  try {
    await loginWithGoogle();
    navigate('/');
  } catch (e: any) {
    setError(JSON.stringify(e));
  }
};

export const handleLogout = async (
  e: any,
  logout: any,
  navigate: NavigateFunction,
  setError: Dispatch<SetStateAction<string>>
) => {
  e.preventDefault();
  try {
    await logout();
    navigate('/login');
  } catch (e: any) {
    setError(JSON.stringify(e));
  }
};
