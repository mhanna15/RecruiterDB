import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { handleGoogleLogin, handleSignUp } from '../../auth/authFunctions';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { signup, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  return (
    <div>
      <h1>Sign Up</h1>
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
            await handleSignUp(e, signup, email, password, navigate, setError)
          }
        >
          Sign Up
        </button>
        or
        <button
          onClick={async (e) =>
            await handleGoogleLogin(e, loginWithGoogle, navigate, setError)
          }
        >
          Login with Google
        </button>
        {error}
      </div>
    </div>
  );
};

export default SignUp;
