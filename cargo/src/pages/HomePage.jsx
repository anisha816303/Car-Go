import React, { useState } from 'react';
import './HomePage.css';
import Carousel from 'react-bootstrap/Carousel';

function HomePage() {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className={`home-page ${darkTheme ? 'dark' : 'light'}`}>
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <h1>Car-Go</h1>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
        <button onClick={toggleTheme} className="theme-toggle">
          {darkTheme ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>

      {/* Side Navigation Bar */}
      <aside className="side-nav">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </aside>

      {/* Carousel */}
      <section className="carousel-section">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/src/assets/l1.png"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Save Money</h3>
              <p>Carpooling helps you save on fuel costs.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/src/assets/l2.png"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Reduce Traffic</h3>
              <p>Fewer cars on the road mean less congestion.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/src/assets/logo.png"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Eco-Friendly</h3>
              <p>Carpooling reduces your carbon footprint.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Information Section */}
      <section className="info-section">
        <h2>Why Carpool with Car-Go?</h2>
        <div className="info-cards">
          <div className="card">
            <h3>Convenience</h3>
            <p>Share rides with people going your way.</p>
          </div>
          <div className="card">
            <h3>Cost-Effective</h3>
            <p>Split the cost of fuel and save money.</p>
          </div>
          <div className="card">
            <h3>Environmentally Friendly</h3>
            <p>Reduce emissions and help the planet.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
