import './Header.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { handleLogout } from '../../auth/authFunctions';

const Header = (props: { isLoggedIn: boolean }) => {
  const [error, setError] = useState<string>('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  let buttons;
  if (props.isLoggedIn) {
    buttons = (
      <>
        <button className="header-link" onClick={() => navigate('/profile')}>
          Profile
        </button>
        <button
          className="header-link"
          onClick={async (e) =>
            await handleLogout(e, logout, navigate, setError)
          }
        >
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
      </div>
    </div>
  );
};

export default Header;
