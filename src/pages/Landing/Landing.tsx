import './Landing.css';

import { Alert, Collapse } from '@mui/material';
import React, { useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';
import SignInWithGoogle from '../../components/SignInWithGoogle/SignInWithGoogle';

const Landing = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { login, signup, loginWithGoogle, currentUser } = useAuth();

  const handleSignUp = async () => {
    try {
      const res = await signup(email, password);
      const authResult = AuthResults(res);
      if (authResult) {
        alert(`${authResult.title}: ${authResult.errorMessage}`);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleLogin = async () => {
    const res = await login(email, password);
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
    }
  };

  const handleGoogleLogin = async () => {
    const res = await loginWithGoogle();
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
    }
  };

  return (
    <div className="login-content">
      <div className="login-field">
        <h1 className="login-title">Login</h1>
        {currentUser?.emailVerified === false && (
          <Alert severity="info">
            An account verification email has been sent to {currentUser.email}. Please click the link in the email and
            then login using your new account (may be in spam)
          </Alert>
        )}
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="submit-button" onClick={handleLogin}>
          Login
        </button>
        or
        <button className="submit-button" onClick={handleSignUp}>
          Create new account
        </button>
        <h1 style={{ display: 'flex', alignSelf: 'center', marginTop: '1em', marginBottom: '1em' }}>or</h1>
        <SignInWithGoogle onClick={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default Landing;
