import React from 'react';
import { useNavigate } from 'react-router-dom';
function WelcomePage() {
    const navigate = useNavigate();
  
    return (
      <main className="welcome-page">
        <section className="hero">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Car-Go</span>
          </h1>
          <p className="hero-subtitle">
            The future of Carpools is here. Save money, reduce emissions, and travel smarter!
          </p>
          <button className="cta-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </section>
      </main>
    );
  }

  export default WelcomePage;