import './Header.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = (props: { isLoggedIn: boolean }) => {
  const navigate = useNavigate();
  const buttons = props.isLoggedIn ? (
    <>
      <a className="header-link" onClick={() => navigate('/templates')}>
        Templates
      </a>
      <a className="header-link" onClick={() => navigate('/profile')}>
        Profile
      </a>
    </>
  ) : (
    <>
      <a className="header-link" onClick={() => navigate('/login')}>
        Login
      </a>
      <a className="header-link" onClick={() => navigate('/signup')}>
        Sign Up
      </a>
    </>
  );

  return (
    <div className="header-root">
      <p className="header-title">RecruiterDB</p>
      <div className="header-linksGroup">
        <a className="header-link" onClick={() => navigate('/')}>
          Home
        </a>
        {buttons}
      </div>
    </div>
  );
};

export default Header;
