import React from 'react';

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

  export default RegisterPage;