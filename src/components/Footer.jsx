import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p>
            Copyright 2025 <a href="https://nullsect-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">Bilal Aniq</a>
          </p>
        </div>
        <div className="footer-right">
          <p className="footer-note">
            Crafted with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
