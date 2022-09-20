import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const { signin } = useAuth();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signin(email, password);
    navigate('/profile');
  };
  return (
    <div>
      <h1>sign in page</h1>
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
          <button>sign in</button>
        </div>
      </form>
      or <Link to="/signup">signup</Link>
    </div>
  );
};

export default SignIn;
