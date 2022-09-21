import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { signup } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/');
    } catch (e: any) {
      setError(JSON.stringify(e));
    }
  };

  return (
    <div>
      <h1>sign up page</h1>
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
          <button>sign up</button>
          {error}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
