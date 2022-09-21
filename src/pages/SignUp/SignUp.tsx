import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { signup, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    try {
      await signup(email, password);
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
      <h1>sign up page</h1>
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
        <button onClick={handleSignUp}>sign up</button> or
        <button onClick={handleGoogleLogin}> login with google</button>
        {error}
      </div>
    </div>
  );
};

export default SignUp;
