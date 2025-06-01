import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import FindRide from './pages/ManageRides/FindRide.jsx';
import OfferRide from './pages/ManageRides/OfferRide.jsx';
import MyRoutes from './pages/ManageRides/MyRides.jsx';
import ScheduledRides from './pages/Misc/ScheduledRides.jsx';
import MyProfile from './pages/Profile/MyProfile.jsx';
import MyRatings from './pages/Misc/MyRatings.jsx';
import Payments from './pages/Misc/Payments.jsx';
import RewardPoints from './pages/Misc/RewardPoints.jsx';
import VehicleDetails from './pages/ManageRides/VehicleDetails.jsx';
import Notifications from './pages/Misc/Notifications.jsx';
import Preferences from './pages/Misc/Preferences.jsx';
import HelpSupport from './pages/Misc/HelpSupport.jsx';
import WelcomePage from './pages/Welcome/WelcomePage.jsx';
import './App.css';

function App() {
  return (
    <div className="app-bg-bubbles" style={{ minHeight: '100vh', position: 'relative' }}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-ride" element={<FindRide />} />
        <Route path="/offer-ride" element={<OfferRide />} />
        <Route path="/my-routes" element={<MyRoutes />} />
        <Route path="/scheduled-rides" element={<ScheduledRides />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-ratings" element={<MyRatings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reward-points" element={<RewardPoints />} />
        <Route path="/vehicle-details" element={<VehicleDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

