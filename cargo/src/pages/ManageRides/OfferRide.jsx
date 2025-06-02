import React, { useEffect, useRef, useState } from 'react';
import './OfferRide.css'; // Optional styling

function OfferRide() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const sourceInputRef = useRef(null);
  const destInputRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);

  const userId = localStorage.getItem('userId');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
        initAutocomplete();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true; // Ensure script execution is deferred
        script.onload = () => {
          initMap();
          initAutocomplete();
        };
        document.body.appendChild(script);
      }
    };

    loadGoogleMaps();
  }, []);

  const initMap = () => {
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 12.9716, lng: 77.5946 }, // Bangalore default
      zoom: 12,
    });

    directionsRenderer.current = new window.google.maps.DirectionsRenderer();
    directionsRenderer.current.setMap(mapInstance.current);
  };

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

  useEffect(() => {
    if (source && destination) {
      drawRoute(source, destination);
    }
  }, [source, destination]);

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

  const handleOfferRide = async () => {
    if (!userId || !source || !destination) {
      setMessage('Missing user, source, or destination.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          destination,
          user: userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Ride offered successfully!');
        setSeats(1);
        sourceInputRef.current.value = '';
        destInputRef.current.value = '';
        setSource(null);
        setDestination(null);
        directionsRenderer.current.set('directions', null); // clear map
      } else {
        setMessage(data.error || 'Failed to offer ride.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Try again.');
    }

    setLoading(false);
  };

  return (
    <div className="offer-ride-container" style={{ maxWidth: 600, margin: 'auto', padding: '1rem' }}>
      <h2>Offer a Ride</h2>

      <label htmlFor="source-input">Source</label>
      <input
        id="source-input"
        ref={sourceInputRef}
        type="text"
        placeholder="Enter source"
        style={{ width: '100%', height: 40, marginBottom: 10, padding: '0 10px' }}
      />

      <label htmlFor="destination-input">Destination</label>
      <input
        id="destination-input"
        ref={destInputRef}
        type="text"
        placeholder="Enter destination"
        style={{ width: '100%', height: 40, marginBottom: 10, padding: '0 10px' }}
      />

      <label htmlFor="seats-input">Seats Available</label>
      <input
        id="seats-input"
        type="number"
        min={1}
        max={8}
        value={seats}
        placeholder="Enter number of seats available"
        onChange={e => setSeats(Number(e.target.value))}
        style={{ width: '100%', height: 40, marginBottom: 16, padding: '0 10px' }}
      />

      <button
        onClick={handleOfferRide}
        disabled={loading || !source || !destination}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        {loading ? 'Offering...' : 'Offer Ride'}
      </button>

      {message && (
        <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: 20 }}>{message}</div>
      )}

      <div
        ref={mapRef}
        style={{ width: '100%', height: 400, borderRadius: 8, border: '1px solid #ccc' }}
      />
    </div>
  );
}

export default OfferRide;
