import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
function WelcomePage() {
    const navigate = useNavigate();
    const [darkTheme, setDarkTheme] = useState(false);
    const toggleTheme = () => setDarkTheme((prev) => !prev);
  
    return (
      <main className={`welcome-page ${darkTheme ? 'dark' : 'light'}`}>
        <section className="hero">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkTheme ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <h1 className="hero-title">
            Welcome to <p><span className="highlight">Car-Go</span></p>
          </h1>
          <p className="hero-subtitle">
            The future of Carpools is here. Save money, reduce emissions, and travel smarter!
          </p>
          <section className="why-carpool">
            <div className="why-card">
              <strong>🌱 Eco-Friendly:</strong> Carpooling reduces the number of vehicles on the road, cutting down on carbon emissions and helping fight climate change.
            </div>
            <div className="why-card">
              <strong>💸 Save Money:</strong> Share fuel and maintenance costs with others, making your daily commute more affordable.
            </div>
            <div className="why-card">
              <strong>🤝 Build Community:</strong> Meet new people, make friends, and enjoy a more social commute.
            </div>
          </section>

          <button className="cta-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </section>
      </main>
    );
  }

  export default WelcomePage;