import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'; // Import CSS for animations

function App() {
  return (
    <div>
      <Header />

      <main className="welcome-page">
        <section className="hero">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Car-Go</span>
          </h1>
          <p className="hero-subtitle">
            Your trusted carpooling solution. Save money, reduce emissions, and travel smarter!
          </p>
          <button className="cta-button">Get Started</button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

