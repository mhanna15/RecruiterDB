import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { handleGoogleLogin, handleSignUp } from '../../auth/authFunctions';

import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { signup, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="signup-content">
      <div className="signup-field">
        <h1 className="signup-title">Sign Up</h1>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button
          className="submit-button"
          onClick={async (e) => await handleSignUp(e, signup, email, password, navigate, setError)}
        >
          Sign Up
        </button>
        <h1 style={{ display: 'flex', alignSelf: 'center', marginTop: '1em', marginBottom: '1em' }}>or</h1>
        <button onClick={async (e) => await handleGoogleLogin(e, loginWithGoogle, navigate, setError)}>
          Login with Google
        </button>
        {error}
      </div>
    </div>
  );
};

export default SignUp;
