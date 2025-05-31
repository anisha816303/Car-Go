import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FindRide from './pages/FindRide.jsx';
import OfferRide from './pages/OfferRide.jsx';
import MyRoutes from './pages/MyRoutes.jsx';
import ScheduledRides from './pages/ScheduledRides.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyRatings from './pages/MyRatings.jsx';
import Payments from './pages/Payments.jsx';
import RewardPoints from './pages/RewardPoints.jsx';
import VehicleDetails from './pages/VehicleDetails.jsx';
import Notifications from './pages/Notifications.jsx';
import Preferences from './pages/Preferences.jsx';
import HelpSupport from './pages/HelpSupport.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import './App.css';

function App() {
  return (
    <>
      <Header />
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
    </>
  );
}

export default App;

