import { setDefaultResultOrder } from 'dns';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (e: any) {
      setError(JSON.stringify(e));
    }
  };
  return (
    <div>
      <h1>sign in page</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit}>
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
          <button>login</button>
          {error}
        </div>
      </form>
    </div>
  );
};

export default Login;
