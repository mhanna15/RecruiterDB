import './Header.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LogoIcon from '../../assets/LogoIcon/LogoIcon';
import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleLogout = async () => {
    const res = await logout();
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
    }
  };

  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      console.log(windowWidth);
    }

    window.addEventListener('resize', resize.bind(this));
    resize();
  });

  return (
    <div className="header-root">
      <div onClick={() => navigate('/')} className="header-title">
        <LogoIcon />
        <p style={{ marginLeft: '10px' }}>RecruiterDB</p>
      </div>
      {windowWidth > 600 ? (
        <div className="header-linksGroup">
          <a className="header-link header-link-left" onClick={() => navigate('/')}>
            Home
          </a>
          <a className="header-link header-link-left" onClick={() => navigate('/templates')}>
            Templates
          </a>
          <a className="header-link header-link-left" onClick={() => navigate('/faqs')}>
            FAQs
          </a>
          <a className="header-link header-link-left" onClick={handleLogout}>
            Logout
          </a>
        </div>
      ) : (
        <h1>asdfasdfads</h1>
      )}
    </div>
  );
};

export default Header;
