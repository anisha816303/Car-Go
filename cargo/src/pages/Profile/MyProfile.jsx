import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fname: '', lname: '', username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}`)
      .then(res => {
        setProfile(res.data);
        setForm({
          fname: res.data.fname || '',
          lname: res.data.lname || '',
          username: res.data.username || '',
          email: res.data.email || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, [userId, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}`, form);
      setProfile(res.data.user);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}`);
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Failed to delete account');
    }
  };

  if (loading) return <div className="page-content"><div className="login-box"><p>Loading...</p></div></div>;
  if (error) return <div className="page-content"><div className="login-box"><p style={{ color: 'red' }}>{error}</p></div></div>;
  if (!profile) return null;

  return (
    <div className="page-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-box">
        <h2>My Profile</h2>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {editMode ? (
          <form onSubmit={handleSave} style={{ maxWidth: 400, margin: '0 auto' }}>
            <label>First Name:<input name="fname" value={form.fname} onChange={handleChange} required /></label>
            <label>Last Name:<input name="lname" value={form.lname} onChange={handleChange} required /></label>
            <label>Username:<input name="username" value={form.username} onChange={handleChange} required /></label>
            <label>Email:<input name="email" value={form.email} onChange={handleChange} required type="email" /></label>
            <div style={{ marginTop: 16 }}>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <p><strong>First Name:</strong> {profile.fname}</p>
            <p><strong>Last Name:</strong> {profile.lname}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
              <button onClick={handleDelete} style={{ marginLeft: 8, color: 'red' }}>Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
