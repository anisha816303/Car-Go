import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}


export default App;

