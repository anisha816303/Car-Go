import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/login`, credentials);
      alert(res.data.message);
      console.log('Login successful:', res.data);
      // Store userId in localStorage for authentication
      if (res.data.user?._id) {
        localStorage.setItem('userId', res.data.user._id);
        console.log('User ID stored:', res.data.user._id);
      }
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={credentials.uname}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don&apos;t have an account?{' '}
          <button type="button" onClick={() => navigate('/register')}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
