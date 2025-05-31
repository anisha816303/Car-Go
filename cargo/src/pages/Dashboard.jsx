import React, { useState} from 'react';
// import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const cardData = [
  {
    src: '/src/assets/save_money_on_travel.png',
    title: 'Save Money on Travel',
    desc: 'Split costs and reduce your daily commute expenses',
  },
  {
    src: '/src/assets/carbon_footprint.png',
    title: 'Reduce Carbon Footprint',
    desc: 'Help the environment by sharing rides',
  },
  {
    src: '/src/assets/community.png',
    title: 'Build Community',
    desc: 'Connect with people going your way',
  },
];
  const [darkTheme, setDarkTheme] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const nextCard = () => setCurrent((current + 1) % cardData.length);
  const prevCard = () => setCurrent((current - 1 + cardData.length) % cardData.length);

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
        <div className="card-carousel-container">
          <button className="carousel-arrow left" onClick={prevCard}>&lt;</button>
          <div className="carousel-card">
            <img src={cardData[current].src} alt={cardData[current].title} />
            <div className="carousel-card-caption">
              <h3>{cardData[current].title}</h3>
              <p>{cardData[current].desc}</p>
            </div>
          </div>
          <button className="carousel-arrow right" onClick={nextCard}>&gt;</button>
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
