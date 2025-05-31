import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

function Header({ darkTheme, toggleTheme, sidebarOpen, toggleSidebar }) {
  return (
    <header>
      <nav className="top-nav">
        <div className="logo-container">
         
          <img src="/src/assets/logo.png" alt="Car-Go Logo" className="logo" />
          <h2>Car-Go</h2>
        </div>

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