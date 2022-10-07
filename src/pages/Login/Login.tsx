import './Login.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { handleGoogleLogin, handleLogin } from '../../auth/authFunctions';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const { login, loginWithGoogle } = useAuth();

  return (
    <div className="login-content">
      <div className="login-field">
        <h1 className="login-title">Login</h1>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button
          className="submit-button"
          onClick={async (e) => await handleLogin(e, login, email, password, navigate, setError)}
        >
          Login
        </button>
        <h1 style={{ display: 'flex', alignSelf: 'center', marginTop: '1em', marginBottom: '1em' }}>or</h1>
        <button
          onClick={async (e) => {
            await handleGoogleLogin(e, loginWithGoogle, navigate, setError);
          }}
        >
          Login with Google
        </button>
        {error}
      </div>
    </div>
  );
};

export default Login;
