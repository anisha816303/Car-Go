import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`dashboard ${darkTheme ? 'dark' : 'light'}`}>
      <nav className="top-nav">
        <div className="logo-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <img src="/src/assets/logo.png" alt="Car-Go Logo" className="logo" />
          <h2>Car-Go</h2>
        </div>
        <div className="nav-center">
          <input 
            type="text" 
            placeholder="Search rides..." 
            className="search-bar"
          />
        </div>
        <div className="nav-right">
          <button className="nav-button">
            👤 <span>Profile</span>
          </button>
          <button className="nav-button theme-toggle" onClick={toggleTheme}>
            {darkTheme ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <div className="user-section">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <h3>Welcome</h3>
              <p>User Name</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            <h3>Rides</h3>
            <ul>
              <li><button onClick={() => navigate('/find-ride')}>🚗 Find a Ride</button></li>
              <li><button onClick={() => navigate('/offer-ride')}>📍 Offer a Ride</button></li>
              <li><button onClick={() => navigate('/my-routes')}>🗺️ My Routes</button></li>
              <li><button onClick={() => navigate('/scheduled-rides')}>📅 Scheduled Rides</button></li>
            </ul>
            <h3>Account</h3>
            <ul>
              <li><button onClick={() => navigate('/my-profile')}>👤 My Profile</button></li>
              <li><button onClick={() => navigate('/my-ratings')}>⭐ My Ratings</button></li>
              <li><button onClick={() => navigate('/payments')}>💰 Payments</button></li>
              <li><button onClick={() => navigate('/reward-points')}>🎯 Reward Points</button></li>
            </ul>
            <h3>Settings</h3>
            <ul>
              <li><button onClick={() => navigate('/vehicle-details')}>🚗 Vehicle Details</button></li>
              <li><button onClick={() => navigate('/notifications')}>🔔 Notifications</button></li>
              <li><button onClick={() => navigate('/preferences')}>⚙️ Preferences</button></li>
              <li><button onClick={() => navigate('/help-support')}>❓ Help & Support</button></li>
            </ul>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <main className={`main-content ${!sidebarOpen ? 'shifted' : ''}`}>
        <h1 className="welcome-message">Welcome to Car-Go Dashboard</h1>
        <div className="carousel-container">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/src/assets/l1.png"
                alt="Carpooling Benefits"
              />
              <Carousel.Caption>
                <h3>Save Money on Travel</h3>
                <p>Split costs and reduce your daily commute expenses</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/src/assets/l2.png"
                alt="Environmental Impact"
              />
              <Carousel.Caption>
                <h3>Reduce Carbon Footprint</h3>
                <p>Help the environment by sharing rides</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/src/assets/logo.png"
                alt="Community"
              />
              <Carousel.Caption>
                <h3>Build Community</h3>
                <p>Connect with people going your way</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <section className="info-section">
          <div className="info-cards">
            <div className="info-card">
              <h3>Cost Savings</h3>
              <p>Save up to 50% on your daily commute costs by sharing rides with others. Split fuel costs and reduce vehicle maintenance expenses.</p>
            </div>
            <div className="info-card">
              <h3>Environmental Impact</h3>
              <p>Reduce your carbon footprint by sharing rides. Each shared ride helps decrease traffic congestion and lower emissions.</p>
            </div>
            <div className="info-card">
              <h3>Community Building</h3>
              <p>Connect with like-minded people in your area. Build relationships and make your daily commute more enjoyable.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
