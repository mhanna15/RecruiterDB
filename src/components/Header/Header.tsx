import './Header.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import LogoIcon from '../../assets/LogoIcon/LogoIcon';
import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
        <p style={{ marginLeft: '10px' }}>RecruiterDB</p>
      </div>
      <div className="header-linksGroup">
        <a className="header-link header-link-left" onClick={() => navigate('/')}>
          Home
        </a>
        <a className="header-link header-link-left" onClick={() => navigate('/templates')}>
          Templates
        </a>
        {/* <a className="header-link input" onClick={() => navigate('/profile')}>
          Profile
        </a> */}
        <a className="header-link input" onClick={() => navigate('/faqs')}>
          FAQs
        </a>
        <a className="header-link input" onClick={handleLogout}>
          Logout
        </a>
      </div>
    </div>
  );
};

export default Header;
