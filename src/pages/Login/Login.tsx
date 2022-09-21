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
    <div>
      <h1>Login page</h1>
      <div>
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={async (e) =>
            await handleLogin(e, login, email, password, navigate, setError)
          }
        >
          login
        </button>{' '}
        or
        <button
          onClick={async (e) => {
            await handleGoogleLogin(e, loginWithGoogle, navigate, setError);
          }}
        >
          {' '}
          login with google
        </button>
        {error}
      </div>
    </div>
  );
};

export default Login;
