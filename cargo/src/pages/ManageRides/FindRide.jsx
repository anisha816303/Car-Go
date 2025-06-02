import React, { useState, useRef, useEffect } from 'react';
import './FindRide.css';

function FindRide() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [message, setMessage] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filteredRides, setFilteredRides] = useState([]);
  const [rides, setRides] = useState([]); // Ensure `setRides` is properly declared
  const mapRef = useRef(null);
  const sourceInputRef = useRef(null);
  const destInputRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load Google Maps script asynchronously with defer
  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      initAutocomplete();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true; // Ensure script execution is deferred
    script.onload = () => {
      setMapLoaded(true);
      initAutocomplete();
    };
    document.body.appendChild(script);
    // eslint-disable-next-line
  }, []);

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (sourceInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(sourceInputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          setSource(place.formatted_address);
        }
      });
    }
    if (destInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(destInputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          setDestination(place.formatted_address);
        }
      });
    }
  };

  // Simulate location detection
  const handleAutoDetect = () => {
    setAutoDetecting(true);
    setTimeout(() => {
      setSource('Current Location');
      setAutoDetecting(false);
    }, 1200);
  };

  // Show map preview and draw route
  useEffect(() => {
    if (mapLoaded && source && destination) {
      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 12.9716, lng: 77.5946 },
          zoom: 12,
        });
        directionsRenderer.current = new window.google.maps.DirectionsRenderer();
        directionsRenderer.current.setMap(mapInstance.current);
      }
      drawRoute(source, destination);
    }
  }, [mapLoaded, source, destination]);

  const drawRoute = (src, dest) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: src,
        destination: dest,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.current.setDirections(result);
        } else {
          console.error('Directions request failed due to', status);
        }
      }
    );
  };

  // Updated handleFindRide function to match rides using string comparison
  const handleFindRide = async () => {
    setMessage('');
    setRides([]);
    setFilteredRides([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/rides`);
      const data = await res.json();
      if (res.ok) {
        if (data.length === 0) {
          setMessage('No rides found.');
        } else {
          // Filter rides by comparing source and destination addresses as strings
          const filtered = data.filter(
            (ride) => ride.source === source && ride.destination === destination
          );
          setRides(data);
          setFilteredRides(filtered);
          if (filtered.length === 0) setMessage('No matching rides found.');
        }
      } else {
        setMessage(data.error || 'Failed to fetch rides.');
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setMessage('Server error. Please try again.');
    }
  };

  const showMap = source && destination;

  return (
    <div className="find-ride-page">
      <div
        className="find-ride-box"
        style={{
          maxWidth: 600,
          margin: 'auto',
          padding: '1rem',
          borderRadius: 8,
          border: '1px solid #ccc',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>Find a Ride</h2>
        <label htmlFor="source">Source</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <input
            id="source"
            ref={sourceInputRef}
            type="text"
            placeholder="Enter source or use autodetect"
            value={source}
            onChange={e => setSource(e.target.value)}
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
        </div>
        <label htmlFor="destination">Destination</label>
        <div style={{ position: 'relative' }}>
          <input
            id="destination"
            ref={destInputRef}
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            autoComplete="off"
          />
        </div>
        <button type="button" style={{ marginTop: 10 }} disabled={!showMap} onClick={showMap ? () => drawRoute(source, destination) : undefined}>
          Show Map
        </button>
        <div className="map-preview" style={{ minHeight: 180, marginTop: 18 }}>
          <div ref={mapRef} style={{ width: '100%', height: 300, borderRadius: 12, border: '1px solid #ccc' }} />
        </div>
        <button type="button" style={{ marginTop: 18 }} disabled={!showMap} onClick={handleFindRide}>
          Find Ride
        </button>
        {message && <div style={{ marginTop: 16, color: 'red' }}>{message}</div>}
        <ul style={{ marginTop: 16 }}>
          {filteredRides.map(ride => (
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
