import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
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

  export default LoginPage;