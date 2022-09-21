import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';

import { useAuth } from '../../context/AuthContext';

import './Header.css';

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
        <button className="header-link" onClick={() => navigate('/profile')}>
          Profile
        </button>
        <button className="header-link" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  } else {
    buttons = (
      <>
        <button className="header-link" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="header-link" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </>
    );
  }
  return (
    <div className="header-root">
      <p className="title">Header</p>
      <div className="header-linksGroup">
        <button className="header-link" onClick={() => navigate('/')}>
          Home
        </button>
        {buttons}
        {error}
        <button
          className="header-link header-link-primary"
          onClick={() => navigate('/')}
        >
          Add Recruiter
        </button>
      </div>
      
    </div>
  );
};

export default Header;
