import './Header.css';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LogoIcon from '../../assets/LogoIcon/LogoIcon';
import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDropDown, setShowDropDown] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
    }
  };

  return (
    <div className="header-root">
      <div onClick={() => navigate('/')} className="header-title">
        <LogoIcon />
        <p style={{ marginLeft: '10px', fontSize: '0.8em' }}>RecruiterDB</p>
      </div>
      <div className="header-linksGroup">
        <div className="dropdown">
          <button className="dropdown-button" onClick={() => setShowDropDown(!showDropDown)}>
            Menu
          </button>
          {showDropDown ? (
            <div className="dropdown-content">
              <a className="dropdown-link" onClick={() => navigate('/')}>
                Home
              </a>
              <a className="dropdown-link" onClick={() => navigate('/templates')}>
                Templates
              </a>
              <a className="dropdown-link" onClick={() => navigate('/faqs')}>
                FAQs
              </a>
              <a className="dropdown-link" onClick={handleLogout}>
                Logout
              </a>
            </div>
          ) : null}
        </div>

        <a className="header-link header-link-left " onClick={() => navigate('/')}>
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
    </div>
  );
};

export default Header;
