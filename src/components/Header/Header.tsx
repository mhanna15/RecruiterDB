import './Header.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../../assets/LogoIcon/LogoIcon';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header-root">
      <div onClick={() => navigate('/')} className="header-title">
        <LogoIcon />
        <p style={{ marginLeft: '10px' }}>recruiter_db</p>
      </div>
      <div className="header-linksGroup">
        <a className="header-link header-link-left" onClick={() => navigate('/')}>
          Home
        </a>
        <a className="header-link header-link-left" onClick={() => navigate('/templates')}>
          Templates
        </a>
        <a className="header-link input" onClick={() => navigate('/profile')}>
          Profile
        </a>
      </div>
    </div>
  );
};

export default Header;
