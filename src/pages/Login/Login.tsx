import './Login.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    const res = await login(email, password);
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
    <div className="login-content">
      <div className="login-field">
        <h1 className="login-title">Login</h1>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="submit-button" onClick={handleLogin}>
          Login
        </button>
        <h1 style={{ display: 'flex', alignSelf: 'center', marginTop: '1em', marginBottom: '1em' }}>or</h1>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </div>
  );
};

export default Login;
