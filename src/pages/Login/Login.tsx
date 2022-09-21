import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (e: any) {
      setError(JSON.stringify(e));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (e: any) {
      setError(JSON.stringify(e));
    }
  };

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
        <button onClick={handleLogin}>login</button> or
        <button onClick={handleGoogleLogin}> login with google</button>
        {error}
      </div>
    </div>
  );
};

export default Login;
