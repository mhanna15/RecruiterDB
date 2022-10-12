import './Landing.css';

import { Alert, Collapse, Dialog } from '@mui/material';
import React, { useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';
import SignInWithGoogle from '../../components/SignInWithGoogle/SignInWithGoogle';

const Landing = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [signUpPopup, setSignUpPopup] = useState<boolean>(false);
  const [forgotPasswordPopup, setForgotPasswordPopup] = useState<boolean>(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');
  const [forgotPasswordLinkSent, setForgotPasswordLinkSent] = useState<boolean>(false);

  const { login, signup, loginWithGoogle, resetPassword, currentUser } = useAuth();

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

  const handleForgotPassword = async () => {
    const res = await resetPassword(forgotPasswordEmail);
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
    }
    setForgotPasswordPopup(false);
    setForgotPasswordLinkSent(true);
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
        <a
          style={{ display: 'flex', alignSelf: 'flex-end', marginBottom: '1em', fontSize: '1rem' }}
          onClick={() => setForgotPasswordPopup(true)}
        >
          Forgot Password?
        </a>
        <button className="submit-button login-button" onClick={handleLogin}>
          Login
        </button>
        <SignInWithGoogle onClick={handleGoogleLogin} />
        <p className="login-signup-text">
          Don&apos;t have an account?&nbsp;
          <a className="login-signup-link" onClick={() => setSignUpPopup(true)}>
            Sign Up
          </a>
        </p>
        <Collapse in={forgotPasswordLinkSent}>
          <Alert severity="info">A password reset email has been sent to {forgotPasswordEmail}. (may be in spam)</Alert>
        </Collapse>
        <Dialog open={forgotPasswordPopup} onClose={() => setForgotPasswordPopup(false)} fullWidth={true}>
          <input
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            value={forgotPasswordEmail}
            placeholder="Email"
            type="email"
          />
          <button onClick={handleForgotPassword}>send link</button>
        </Dialog>
        <Dialog open={signUpPopup} onClose={() => setSignUpPopup(false)} fullWidth={true}>
          <input
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            value={forgotPasswordEmail}
            placeholder="Email"
            type="email"
          />
          <button onClick={handleSignUp}>Create Account</button>
        </Dialog>
      </div>
    </div>
  );
};

export default Landing;
