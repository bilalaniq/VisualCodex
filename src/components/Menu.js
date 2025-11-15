import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const [isToggled, setIsToggled] = useState(false);
  // isToggled → stores whether the menu is open (true) or closed (false)

  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };
  // toggleMenu() → switches the menu state on button click

  useEffect(() => {
    // Update body background color and main content visibility when menu is toggled
    if (isToggled) {
      document.body.style.backgroundColor = 'var(--background-dark)';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.backgroundColor = 'var(--background-light)';
      document.body.classList.remove('menu-open');
    }

    return () => {
      // Cleanup function
      document.body.style.backgroundColor = 'var(--background-light)';
      document.body.classList.remove('menu-open');
    };
  }, [isToggled]);

  // Changes background color and adds a CSS class when the menu is open.
  // The dependency array [isToggled] tells React: “Run this effect every time isToggled changes.”

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsToggled(false); // Close menu after navigation
  };

  const menuLinks = [   // An array of menu items.
    { index: '01', label: 'Home', path: '/' },
    { index: '02', label: 'Algorithm List', path: '/algorithms' },
    { index: '03', label: 'About', path: '/about' },
    { index: '04', label: 'Github', external: true, url: 'https://github.com/bilalaniq/VisualCodex' },
  ];

  return (
    <div className="menu-wrapper">
      <div className="social-links">
        <a href="https://github.com/bilalaniq/VisualCodex"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/bilal-aniq"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="mailto:contact@visualcodex.dev"
          className="social-link">
          <i className="fas fa-envelope"></i>
        </a>
      </div>
      <button
        type="button"
        id="menu-toggle"
        onClick={toggleMenu}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
        <div id="menu-toggle-label">
          <span className="word">Visual</span>
          <span className="word">Codex</span>
        </div>
      </button>

      <div id="menu" className={isToggled ? 'menu-toggled' : ''}>
        <div id="menu-gradient"></div>
        <div id="menu-gradient-blur"></div>

        <div id="menu-arcs-wrapper">
          <svg id="menu-arcs">
            <circle className="menu-arc" cx="50%" cy="50%" r="18%"></circle>
            <circle className="menu-arc" cx="50%" cy="50%" r="30%"></circle>
            <circle className="menu-arc" cx="50%" cy="50%" r="42%"></circle>
          </svg>
        </div>

        <div id="menu-links">
          {menuLinks.map((link, index) => (
            // For external links (like GitHub) open in a new tab.
            // For internal links use react-router `navigate`.
            <button
              key={index}
              className="link"
              onClick={() => {
                if (link.external && link.url) {
                  window.open(link.url, '_blank', 'noopener,noreferrer');
                  setIsToggled(false);
                } else {
                  handleNavigation(link.path || '/');
                }
              }}
            >
              <span className="anchor"></span>
              <span className="index">{link.index}</span>
              <span className="label">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;