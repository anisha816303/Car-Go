import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <section className="hero">
        <h1 className="hero-title">
          Welcome to <span className="highlight">Car-Go</span>
        </h1>
        <p className="hero-subtitle">
          Your trusted carpooling solution. Save money, reduce emissions, and travel smarter!
        </p>
        <button className="cta-button" onClick={() => navigate('/login')}>
          Get Started
        </button>
      </section>
    </main>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/register')}>Register</button>
      </p>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="register-page">
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;

