import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Replace with your actual user context or prop
const getUserId = () => localStorage.getItem('userId'); // Example

function MyRides() {
  const [rides, setRides] = useState([]);
  const [bookedRides, setBookedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'booked'
  const navigate = useNavigate();
  const userId = getUserId();

  const [editingRide, setEditingRide] = useState(null);
  const [editSource, setEditSource] = useState('');
  const [editDestination, setEditDestination] = useState('');

  // Fetch created rides
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

  // Fetch booked rides
  useEffect(() => {
    if (!userId) return;
    setBookingsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}/bookings`)
      .then(res => res.json())
      .then(data => {
        setBookedRides(data);
        setBookingsLoading(false);
      })
      .catch(() => {
        setMessage('Failed to load booked rides.');
        setBookingsLoading(false);
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        setBookedRides(bookedRides.filter(b => b._id !== bookingId));
        setMessage('Booking cancelled.');
      } else {
        const error = await res.json();
        setMessage(error.error || 'Failed to cancel booking.');
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

  const tabStyle = (isActive) => ({
  padding: '10px 20px',
  border: 'none',
  background: isActive ? '#64b5f6' : '#cfd8dc',
  color: isActive ? '#ffffff' : '#333',
  cursor: 'pointer',
  borderRadius: '12px',
  marginRight: '8px',
  fontWeight: isActive ? '600' : '500',
  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
});


  return (
    <div className="page-content" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>My Rides</h2>
      <button
        style={{
  marginBottom: 18,
  borderRadius: 24,
  padding: '10px 24px',
  background: '#4CAF50',
  color: '#fff',
  border: 'none',
  fontWeight: 600,
  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  cursor: 'pointer'
}}
        onClick={() => navigate('/offer-ride')}
      >
        + Create Ride
      </button>

      {/* Tab Navigation */}
      <div style={{ marginBottom: 20 }}>
        <button 
          style={tabStyle(activeTab === 'created')}
          onClick={() => setActiveTab('created')}
        >
          Created Rides ({rides.length})
        </button>
        <button 
          style={tabStyle(activeTab === 'booked')}
          onClick={() => setActiveTab('booked')}
        >
          Booked Rides ({bookedRides.length})
        </button>
      </div>

      {message && <div style={{ color: 'red', marginBottom: 12 }}>{message}</div>}

      {editingRide && (
        <form onSubmit={handleEditSubmit} style={{ background: '#333', padding: 18, borderRadius: 12, marginBottom: 18 }}>
          <h4>Edit Ride</h4>
          <div>
            <label htmlFor="edit-source">Source:</label>
            <input id="edit-source" value={editSource} onChange={e => setEditSource(e.target.value)} required style={{ marginLeft: 8 }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <label htmlFor="edit-destination">Destination:</label>
            <input id="edit-destination" value={editDestination} onChange={e => setEditDestination(e.target.value)} required style={{ marginLeft: 8 }} />
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

      {/* Created Rides Tab */}
      {activeTab === 'created' && (
        <div>
          {loading ? <div>Loading created rides...</div> : null}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rides.map((ride) => {
              const isCurrent = currentRide && ride._id === currentRide._id;
              return (
                <li key={ride._id} style={{
  background: isCurrent ? '#e3f2fd' : '#f5f5f5',
  color: '#333',
  borderRadius: 16,
  marginBottom: 14,
  padding: 18,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: isCurrent ? '2px solid #42a5f5' : '1px solid #ccc',
}}
>
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
          {rides.length === 0 && !loading && <div>No rides created yet. Create your first ride!</div>}
        </div>
      )}

      {/* Booked Rides Tab */}
      {activeTab === 'booked' && (
        <div>
          {bookingsLoading ? <div>Loading booked rides...</div> : null}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookedRides.map((booking) => {
              return (
                <li key={booking._id} style={{
  background: '#e8f5e9',
  color: '#1b5e20',
  borderRadius: 16,
  marginBottom: 14,
  padding: 18,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #a5d6a7',
}}

>
                  <div>
                    <strong>{booking.ride.source}</strong> → <strong>{booking.ride.destination}</strong>
                  </div>
                  <div style={{ fontSize: 13, margin: '6px 0', color: '#333' }}>
                    Driver: {booking.driver.fname} {booking.driver.lname} (@{booking.driver.username})
                  </div>
                  <div style={{ fontSize: 13, margin: '6px 0', color: '#333' }}>
                    Seats Booked: {booking.seatsBooked}
                  </div>
                  <div style={{ fontSize: 13, margin: '6px 0 0 0', color: '#aaa' }}>
                    Booked: {new Date(booking.bookedAt).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <button
                      style={{ borderRadius: 18, padding: '6px 18px', background: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer' }}
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {bookedRides.length === 0 && !bookingsLoading && <div>No rides booked yet. Search and book a ride!</div>}
        </div>
      )}
    </div>
  );
}

export default MyRides;