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

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:5000/user/${userId}/rides`)
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
      const res = await fetch(`http://localhost:5000/rides/${rideId}`, { method: 'DELETE' });
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

  const handleUpdate = (rideId) => {
    // Navigate to OfferRide page with rideId as param or state
    navigate(`/offer-ride/${rideId}`);
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
                    onClick={() => handleUpdate(ride._id)}
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