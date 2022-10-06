import './Header.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileIcon from '../../assets/ProfileIcon';

const Header = (props: { isLoggedIn: boolean }) => {
  const navigate = useNavigate();
  const buttons = props.isLoggedIn ? (
    <>
      <a className="header-link" onClick={() => navigate('/home')}>
        Home
      </a>
      <a className="header-link" onClick={() => navigate('/templates')}>
        Templates
      </a>
      <a className="header-link input" onClick={() => navigate('/profile')}>
        Profile
      </a>
    </>
  ) : (
    <>
      <a className="header-link header-link-left" onClick={() => navigate('/login')}>
        Login
      </a>
      <a className="header-link" onClick={() => navigate('/signup')}>
        Sign Up
      </a>
    </>
  );

  return (
    <div className="header-root">
      <p onClick={() => navigate('/home')} className="header-title">
        RecruiterDB
      </p>
      <div className="header-linksGroup">{buttons}</div>
    </div>
  );
};

export default Header;
