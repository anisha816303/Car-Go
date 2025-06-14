import React, { useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const cardData = [
  {
    src: '/assets/save_money_on_travel.png',
    title: 'Save Money on Travel',
    desc: 'Split costs and reduce your daily commute expenses',
  },
  {
    src: '/assets/carbon_footprint.png',
    title: 'Reduce Carbon Footprint',
    desc: 'Help the environment by sharing rides',
  },
  {
    src: '/assets/community.png',
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

  // --- Real backend integration for offered and booked rides ---
  const [offeredRides, setOfferedRides] = useState([]);
  const [bookedRides, setBookedRides] = useState([]);
  const userId = localStorage.getItem('userId');

  React.useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}/rides`)
      .then(res => res.json())
      .then(data => {
        setOfferedRides(data);
      })
      .catch(() => {});
  }, [userId]);

  React.useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}/bookings`)
      .then(res => res.json())
      .then(data => {
        setBookedRides(data);
      })
      .catch(() => {});
  }, [userId]);

  // --- End real backend integration ---

  return (
    <div className={`dashboard ${darkTheme ? 'dark' : 'light'}`}>
      <nav className="top-nav">
        <div className="logo-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <img src="/assets/logo.png" alt="Car-Go Logo" className="logo" />
          <h2>Car-Go</h2>
        </div>
       
        <div className="nav-right">
          <div className="nav-center nav-links">
  <button className="nav-button" onClick={() => navigate('/find-ride')}>🚗 Find Rides</button>
  <button className="nav-button" onClick={() => navigate('/offer-ride')}>📍 Offer Rides</button>
          <button  onClick={() => navigate('/my-profile')} className="nav-button">
            👤 <span>Profile</span>
          </button>
          <button className="nav-button theme-toggle" onClick={toggleTheme}>
            {darkTheme ? '🌞' : '🌙'}
          </button>
        </div>
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
              <li><button onClick={() => navigate('/my-routes')}>🗺️ My Rides</button></li>
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
      
<div className="bubble bubble-green-1"></div>
<div className="bubble bubble-green-2"></div>
<div className="bubble bubble-blue-1"></div>
<div className="bubble bubble-blue-2"></div>
<div className="bubble bubble-yellow-1"></div>



        <h1 className="welcome-message">Welcome to Car-Go Dashboard</h1>
        {/* --- Recent Rides Section --- */}
        <div className="dashboard-recent-ride-box wide">
          <h2 className="recent-ride-title">Recent Rides</h2>
          {(!offeredRides.length && !bookedRides.length) ? (
            <div className="empty-box">No rides offered or booked yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
              {offeredRides.length > 0 && (
                <li className="dashboard-ride-card dashboard-ride-offered">
                  <div className="recent-ride-main-row">
                    <span><strong>{offeredRides[0].source}</strong> → <strong>{offeredRides[0].destination}</strong></span>
                    <span className="recent-ride-label">Offered</span>
                  </div>
                </li>
              )}
              {bookedRides.length > 0 && (
                <li className="dashboard-ride-card dashboard-ride-booked">
                  <div className="recent-ride-main-row">
                    <span><strong>{bookedRides[0].ride?.source}</strong> → <strong>{bookedRides[0].ride?.destination}</strong></span>
                    <span className="recent-ride-label">Booked</span>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
        {/* --- End Recent Rides Section --- */}
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
        {/* Info Section */}
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
