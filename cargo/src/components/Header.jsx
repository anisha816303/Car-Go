import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

function Header({ darkTheme, toggleTheme, sidebarOpen, toggleSidebar }) {
  return (
    <header className={darkTheme ? 'header dark' : 'header'}>
      <nav className="top-nav">
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
        <div className="logo-container">
          <img src="/src/assets/logo.png" alt="Car-Go Logo" className="logo" />
          <h2>Car-Go</h2>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={darkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkTheme ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
}

Header.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;