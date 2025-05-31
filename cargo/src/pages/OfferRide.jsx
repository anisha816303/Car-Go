import React, { useState } from 'react';
import './FindRide.css';

const demoLocations = [
  'Nagarbhavi',
  'Malleswaram',
  'Rajajinagar',
  'Indiranagar',
  'Jayanagar',
  'Bangalore',
  'Bangalore East',
  'Bangalore South',
  'Bannergatta Road',  
  'Bangalore North',
  'Bangalore West',
  'Bangalore Central',
  'BTM Layout',
  'Electronic City',
  'Koramangala',
  'Whitefield',
  'Hosur Road',
  'Sarjapur Road',
  'MG Road',
  'Electronic City Phase 1'
];

function OfferRide() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Use only a real userId from localStorage
  const userId = localStorage.getItem('userId');

  // Filtered options for autocomplete
  const filteredSource = demoLocations.filter(
    loc => loc.toLowerCase().includes(source.toLowerCase()) && loc !== destination
  );
  const filteredDest = demoLocations.filter(
    loc => loc.toLowerCase().includes(destination.toLowerCase()) && loc !== source
  );

 const handleOfferRide = async () => {
    setLoading(true);
    setMessage('');
    if (!userId) {
      setMessage('You must be logged in to offer a ride.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, user: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Ride offered successfully!');
        setSource('');
        setDestination('');
        setSeats(1);
      } else {
        setMessage(data.error || 'Failed to offer ride.');
      }
    } catch (err) {
      console.error('Error offering ride:', err);
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };
  return (
    <div className="find-ride-page">
      <div className="find-ride-box">
        <h2>Offer a Ride</h2>
        <label htmlFor="source">Source</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <input
            id="source"
            type="text"
            placeholder="Enter source"
            value={source}
            onChange={e => {
              setSource(e.target.value);
              setShowSourceDropdown(true);
            }}
            onFocus={() => setShowSourceDropdown(true)}
            onBlur={() => setTimeout(() => setShowSourceDropdown(false), 150)}
            style={{ flex: 1 }}
            autoComplete="off"
          />
          {showSourceDropdown && filteredSource.length > 0 && (
            <ul className="autocomplete-dropdown">
              {filteredSource.map(loc => (
                <li key={loc}>
                  <button
                    type="button"
                    className="autocomplete-option"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                    onClick={() => { setSource(loc); setShowSourceDropdown(false); }}
                  >
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label htmlFor="destination">Destination</label>
        <div style={{ position: 'relative' }}>
          <input
            id="destination"
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={e => {
              setDestination(e.target.value);
              setShowDestDropdown(true);
            }}
            onFocus={() => setShowDestDropdown(true)}
            onBlur={() => setTimeout(() => setShowDestDropdown(false), 150)}
            autoComplete="off"
          />
          {showDestDropdown && filteredDest.length > 0 && (
            <ul className="autocomplete-dropdown">
              {filteredDest.map(loc => (
                <li key={loc} onMouseDown={() => { setDestination(loc); setShowDestDropdown(false); }}>
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>
        <label htmlFor="seats">Seats Available</label>
        <input
          id="seats"
          type="number"
          min={1}
          max={8}
          value={seats}
          onChange={e => setSeats(Number(e.target.value))}
          style={{ width: 80, marginBottom: 12 }}
        />
        <button
          type="button"
          style={{ marginTop: 10 }}
          disabled={loading || !source || !destination || seats < 1}
          onClick={handleOfferRide}
        >
          {loading ? 'Offering...' : 'Offer Ride'}
        </button>
        {message && <div style={{ marginTop: 16, color: message.includes('success') ? 'limegreen' : 'red' }}>{message}</div>}
      </div>
    </div>
  );
}

export default OfferRide;
