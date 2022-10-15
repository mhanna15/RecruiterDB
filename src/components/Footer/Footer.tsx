import './Footer.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-root">
      <div className="footer-linksGroup">
        <a
          className="footer-link footer-link-left"
          onClick={() => window.open('https://forms.gle/wWgUci3vNmvHUrpg7', '_blank')}
        >
          Feedback
        </a>
        <a
          className="footer-link footer-link-left"
          onClick={() => window.open('https://forms.gle/JbFsqVopXGxDTUkd7', '_blank')}
        >
          Report
        </a>
        <a className="footer-link input" onClick={() => window.open('https://forms.gle/UXxrxFp3rrTHBEoV9', '_blank')}>
          Contact
        </a>
      </div>
    </div>
  );
};

export default Footer;
