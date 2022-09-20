import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Header = (props: { isLoggedIn: boolean }) => {
  const [error, setError] = useState<string>('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/');
    } catch (e: any) {
      setError(JSON.stringify(e));
    }
  };
  
  let buttons;
  if (props.isLoggedIn) {
    buttons = (
      <>
        <button onClick={() => navigate('/profile')}>Profile</button>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button onClick={handleLogout}>Logout</button>
      </>
    );
  } else {
    buttons = (
      <>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </>
    );
  }
  return (
    <div style={{ display: 'flex' }}>
      <h1>Header</h1>
      <button onClick={() => navigate('/')}>Home</button>
      {buttons}
      {error}
    </div>
  );
};

export default Header;
