import './SignUp.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

import SignInWithGoogle from '../../assets/SignInWithGoogle';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signup, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const handleSignUp = async () => {
    const res = await signup(email, password);
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
      return;
    }
    navigate('/home');
  };

  const handleGoogleLogin = async () => {
    const res = await loginWithGoogle();
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
      return;
    }
    navigate('/home');
  };

  return (
    <div className="signup-content">
      <div className="signup-field">
        <h1 className="signup-title">Sign Up</h1>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="submit-button" onClick={handleSignUp}>
          Sign Up
        </button>
        <h1 style={{ display: 'flex', alignSelf: 'center', marginTop: '1em', marginBottom: '1em' }}>or</h1>
        <SignInWithGoogle onClick={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default SignUp;
