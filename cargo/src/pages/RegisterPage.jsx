import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    uname: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      alert(res.data.message);
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="fname" type="text" placeholder="First Name" required onChange={handleChange} /> <br />
        <input name="lname" type="text" placeholder="Last Name" required onChange={handleChange} /><br />
        <input name="uname" type="text" placeholder="Username" required onChange={handleChange} /><br />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
