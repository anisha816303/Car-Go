import React from 'react';
import './Header.css';
import logo from '../assets/l2.png'; // Import your logo image

function Header() {
  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="Car-Go Logo" className="logo" />
        <h1>Car-Go</h1>
      </div>
    </header>
  );
}

export default Header;