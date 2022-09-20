import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signup } = useAuth();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signup(email, password);
  };

  return (
    <div>
      <h1>sign up page</h1>
      <Link to="/">sign in</Link>
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
        </div>
      </form>
    </div>
  );
};

export default SignUp;
