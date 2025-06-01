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

function FindRide() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState('');
  // Filtered options for autocomplete
  const filteredSource = demoLocations.filter(
    loc => loc.toLowerCase().includes(source.toLowerCase()) && loc !== destination
  );
  const filteredDest = demoLocations.filter(
    loc => loc.toLowerCase().includes(destination.toLowerCase()) && loc !== source
  );

  // Simulate location detection
  const handleAutoDetect = () => {
    setAutoDetecting(true);
    setTimeout(() => {
      setSource('Current Location');
      setAutoDetecting(false);
    }, 1200);
  };

  // Placeholder for map preview
  const showMap = source && destination;

  const handleFindRide = async () => {
    setMessage('');
    setRides([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rides?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
      const data = await res.json();
      if (res.ok) {
        if (data.length === 0) {
          setMessage('No rides found.');
        } else {
          setRides(data);
        }
      } else {
        setMessage(data.error || 'Failed to fetch rides.');
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="find-ride-page">
      <div className="find-ride-box">
        <h2>Find a Ride</h2>
        <label htmlFor="source">Source</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <input
            id="source"
            type="text"
            placeholder="Enter source or use autodetect"
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
          <button
            type="button"
            style={{ width: 40, height: 40, borderRadius: '50%', padding: 0, fontSize: 18 }}
            onClick={handleAutoDetect}
            disabled={autoDetecting}
            title="Auto-detect location"
          >
            {autoDetecting ? '...' : <span aria-label="locate">📍</span>}
          </button>
          {showSourceDropdown && filteredSource.length > 0 && (
            <ul className="autocomplete-dropdown">
              {filteredSource.map(loc => (
                <li key={loc}>
                  <button
                    type="button"
                    className="autocomplete-option"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                    onMouseDown={() => { setSource(loc); setShowSourceDropdown(false); }}
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
                <li key={loc}>
                  <button
                    type="button"
                    className="autocomplete-option"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                    onMouseDown={() => { setDestination(loc); setShowDestDropdown(false); }}
                  >
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" style={{ marginTop: 10 }} disabled={!showMap}>
          Show Map
        </button>
        <div className="map-preview" style={{ minHeight: 180, marginTop: 18 }}>
          {showMap ? (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Map_of_India_with_states_and_union_territories.svg/400px-Map_of_India_with_states_and_union_territories.svg.png"
              alt="Map Preview"
              style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
            />
          ) : (
            <span>Map preview will appear here</span>
          )}
        </div>
        <button type="button" style={{ marginTop: 18 }} disabled={!showMap} onClick={handleFindRide}>
          Find Ride
        </button>
        {message && <div style={{ marginTop: 16, color: 'red' }}>{message}</div>}
        <ul style={{ marginTop: 16 }}>
          {rides.map(ride => (
            <li key={ride._id}>
              {ride.source} to {ride.destination} offered by {ride.user?.fname} {ride.user?.lname}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FindRide;
