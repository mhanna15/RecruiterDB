import './SignUp.css';

import React, { useState } from 'react';

import SignInWithGoogle from '../../components/SignInWithGoogle/SignInWithGoogle';
import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signup, loginWithGoogle } = useAuth();

  const handleSignUp = async () => {
    const res = await signup(email, password);
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
