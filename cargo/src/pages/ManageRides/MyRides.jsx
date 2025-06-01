import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Replace with your actual user context or prop
const getUserId = () => localStorage.getItem('userId'); // Example

function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const userId = getUserId();

  const [editingRide, setEditingRide] = useState(null);
  const [editSource, setEditSource] = useState('');
  const [editDestination, setEditDestination] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}/rides`)
      .then(res => res.json())
      .then(data => {
        setRides(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to load rides.');
        setLoading(false);
      });
  }, [userId]);

  if (!userId) return <div>Please log in to view your rides.</div>;

  // Find the most recent ride within 3 hours
  const now = Date.now();
  const currentRide = rides.find(ride => {
    const created = new Date(ride.createdAt).getTime();
    return now - created <= 3 * 60 * 60 * 1000;
  });

  const handleDelete = async (rideId) => {
    if (!window.confirm('Delete this ride?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/rides/${rideId}`, { method: 'DELETE' });
      if (res.ok) {
        setRides(rides.filter(r => r._id !== rideId));
        setMessage('Ride deleted.');
      } else {
        setMessage('Failed to delete ride.');
      }
    } catch {
      setMessage('Server error.');
    }
  };

    const handleUpdate = (ride) => {
    setEditingRide(ride);
    setEditSource(ride.source);
    setEditDestination(ride.destination);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/rides/${editingRide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: editSource, destination: editDestination }),
      });
      if (res.ok) {
        const data = await res.json();
        setRides(rides.map(r => r._id === editingRide._id ? data.ride : r));
        setMessage('Ride updated.');
        setEditingRide(null);
      } else {
        setMessage('Failed to update ride.');
      }
    } catch {
      setMessage('Server error.');
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>My Rides</h2>
      <button
        style={{ marginBottom: 18, borderRadius: 24, padding: '10px 24px', background: '#4caf50', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}
        onClick={() => navigate('/offer-ride')}
      >
        + Create Ride
      </button>
      {loading ? <div>Loading...</div> : null}
      {message && <div style={{ color: 'red', marginBottom: 12 }}>{message}</div>}
      {editingRide && (
        <form onSubmit={handleEditSubmit} style={{ background: '#333', padding: 18, borderRadius: 12, marginBottom: 18 }}>
          <h4>Edit Ride</h4>
          <div>
            <label>Source:</label>
            <input value={editSource} onChange={e => setEditSource(e.target.value)} required style={{ marginLeft: 8 }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Destination:</label>
            <input value={editDestination} onChange={e => setEditDestination(e.target.value)} required style={{ marginLeft: 8 }} />
          </div>
          <button type="submit" style={{ marginTop: 12, marginRight: 8, borderRadius: 18, padding: '6px 18px', background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Save
          </button>
          <button type="button" style={{ marginTop: 12, borderRadius: 18, padding: '6px 18px', background: '#888', color: '#fff', border: 'none', cursor: 'pointer' }}
            onClick={() => setEditingRide(null)}>
            Cancel
          </button>
        </form>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rides.map((ride) => {
          const isCurrent = currentRide && ride._id === currentRide._id;
          return (
            <li key={ride._id} style={{
              background: isCurrent ? '#e8f5e9' : '#222',
              color: isCurrent ? '#222' : '#fff',
              borderRadius: 16,
              marginBottom: 14,
              padding: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              position: 'relative'
            }}>
              <div>
                <strong>{ride.source}</strong> → <strong>{ride.destination}</strong>
              </div>
              <div style={{ fontSize: 13, margin: '6px 0 0 0' }}>
                Created: {new Date(ride.createdAt).toLocaleString()}
                {isCurrent && <span style={{ color: '#388e3c', fontWeight: 600, marginLeft: 10 }}>(Current Ride)</span>}
              </div>
              {isCurrent && (
                <div style={{ marginTop: 10 }}>
                  <button
                    style={{ marginRight: 10, borderRadius: 18, padding: '6px 18px', background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleUpdate(ride)}
                  >
                    Update
                  </button>
                  <button
                    style={{ borderRadius: 18, padding: '6px 18px', background: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleDelete(ride._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {rides.length === 0 && !loading && <div>No rides found. Create your first ride!</div>}
    </div>
  );
}

export default MyRides;