import React, { useState, useRef, useEffect } from 'react';
import './FindRide.css';

function FindRide() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [message, setMessage] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState({});
  const mapRef = useRef(null);
  const sourceInputRef = useRef(null);
  const destInputRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const userId = localStorage.getItem('userId');

  // Load Google Maps script asynchronously with defer
  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      initAutocomplete();
      initMap();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initAutocomplete();
      initMap();
    };
    document.body.appendChild(script);
  }, []);

  // Initialize map
  const initMap = () => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore default
        zoom: 12,
      });
      directionsRenderer.current = new window.google.maps.DirectionsRenderer();
      directionsRenderer.current.setMap(mapInstance.current);
    }
  };

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setSource(results[0].formatted_address);
            } else {
              setSource('Current Location');
            }
            setAutoDetecting(false);
          });
        },
        () => {
          // Fallback if geolocation fails
          setSource('Current Location');
          setAutoDetecting(false);
        }
      );
    } else {
      // Fallback for browsers without geolocation
      setTimeout(() => {
        setSource('Current Location');
        setAutoDetecting(false);
      }, 1200);
    }
  };

  // Show map preview and draw route
  useEffect(() => {
    if (mapLoaded && source && destination && mapInstance.current) {
      drawRoute(source, destination);
    }
  }, [mapLoaded, source, destination]);

  const drawRoute = (src, dest) => {
    if (!mapInstance.current || !directionsRenderer.current) return;
    
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

  // Function to book a ride
  const handleBookRide = async (ride) => {
    if (!userId) {
      setMessage('Please log in to book a ride.');
      return;
    }

    if (ride.user._id === userId) {
      setMessage('You cannot book your own ride.');
      return;
    }

    setBookingLoading(prev => ({ ...prev, [ride._id]: true }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/book-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: ride._id,
          userId: userId,
          driverId: ride.user._id,
          seatsBooked: 1 // Default to 1 seat, can be made configurable
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Ride booked successfully! Booking ID: ${data.bookingId}`);
        // Optionally refresh the rides list or mark this ride as booked
        setFilteredRides(prev => 
          prev.map(r => 
            r._id === ride._id 
              ? { ...r, isBooked: true }
              : r
          )
        );
      } else {
        setMessage(data.error || 'Failed to book ride.');
      }
    } catch (err) {
      console.error('Error booking ride:', err);
      setMessage('Server error. Please try again.');
    }

    setBookingLoading(prev => ({ ...prev, [ride._id]: false }));
  };

  // Helper for geocode callback
  function handleGeocodeCallback(results, geocodeStatus, result, thresholdKm, resolve) {
    if (geocodeStatus !== 'OK' || !results[0]) {
      resolve(false);
      return;
    }

    const pointLatLng = results[0].geometry.location;
    const route = result.routes[0];
    const path = route.overview_path;

    // Check if point is within threshold distance of any point on the route
    let minDistance = Infinity;
    for (const pathPoint of path) {
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        pointLatLng,
        pathPoint
      );
      minDistance = Math.min(minDistance, distance);
    }

    // Convert threshold from km to meters
    const thresholdMeters = thresholdKm * 1000;
    resolve(minDistance <= thresholdMeters);
  }

  // Helper for directions callback
  function handleDirectionsCallback(result, status, point, thresholdKm, resolve) {
    if (status !== 'OK') {
      resolve(false);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: point },
      (results, geocodeStatus) => handleGeocodeCallback(results, geocodeStatus, result, thresholdKm, resolve)
    );
  }

  // Function to calculate if a point is along a route within a threshold
  const isPointAlongRoute = async (point, routeStart, routeEnd, thresholdKm = 5) => {
    return new Promise((resolve) => {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: routeStart,
          destination: routeEnd,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => handleDirectionsCallback(result, status, point, thresholdKm, resolve)
      );
    });
  };

  // Helper to check if a ride matches the user's source and destination
  const checkRideMatch = async (ride, source, destination) => {
    // Exact match
    if (ride.source === source && ride.destination === destination) {
      return { isMatch: true, matchType: 'Exact match' };
    }
    // Check if user's source and destination are along the ride's route
    try {
      const sourceAlongRoute = await isPointAlongRoute(source, ride.source, ride.destination);
      const destAlongRoute = await isPointAlongRoute(destination, ride.source, ride.destination);
      if (sourceAlongRoute && destAlongRoute) {
        // Verify that source comes before destination on the route
        const sourceToRideEnd = await getRouteDistance(source, ride.destination);
        const destToRideEnd = await getRouteDistance(destination, ride.destination);
        if (sourceToRideEnd > destToRideEnd) {
          return { isMatch: true, matchType: 'Along route' };
        }
      }
    } catch (error) {
      console.error('Error checking route compatibility:', error);
    }
    return { isMatch: false, matchType: '' };
  };

  // Helper to filter and match rides
  const getMatchingRides = async (rides, source, destination) => {
    const matchingRides = [];
    for (const ride of rides) {
      const { isMatch, matchType } = await checkRideMatch(ride, source, destination);
      if (isMatch) {
        matchingRides.push({ ...ride, matchType });
      }
    }
    return matchingRides;
  };

  // Enhanced ride matching function
  const handleFindRide = async () => {
    if (!source || !destination) {
      setMessage('Please enter both source and destination.');
      return;
    }

    setMessage('');
    setFilteredRides([]);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/rides`);
      const data = await res.json();

      if (res.ok) {
        if (data.length === 0) {
          setMessage('No rides found.');
          setLoading(false);
          return;
        }

        const matchingRides = await getMatchingRides(data, source, destination);

        setFilteredRides(matchingRides);
        if (matchingRides.length === 0) {
          setMessage('No compatible rides found along your route.');
        }
      } else {
        setMessage(data.error || 'Failed to fetch rides.');
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setMessage('Server error. Please try again.');
    }

    setLoading(false);
  };

  // Helper function to get route distance
  const getRouteDistance = (origin, destination) => {
    return new Promise((resolve) => {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            const distance = result.routes[0].legs[0].distance.value; // in meters
            resolve(distance);
          } else {
            resolve(Infinity);
          }
        }
      );
    });
  };

  const handleShowRoute = () => {
    if (source && destination) {
      drawRoute(source, destination);
    }
  };

  const showMap = source && destination;

  return (
    <div className="find-ride-page">
      <div
        className="find-ride-box"
        style={{
          maxWidth: 800,
          margin: 'auto',
          padding: '1rem',
          borderRadius: 8,
          border: '1px solid #ccc',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>Find a Ride</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="source">Source</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
            <input
              id="source"
              ref={sourceInputRef}
              type="text"
              placeholder="Enter source or use autodetect"
              value={source}
              onChange={e => setSource(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              autoComplete="off"
            />
            <button
              type="button"
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                padding: 0, 
                fontSize: 18,
                border: '1px solid #ccc',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer'
              }}
              onClick={handleAutoDetect}
              disabled={autoDetecting}
              title="Auto-detect location"
            >
              {autoDetecting ? '...' : <span aria-label="locate">📍</span>}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            ref={destInputRef}
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          <button 
            type="button" 
            onClick={handleShowRoute}
            disabled={!showMap}
            style={{
              padding: '10px 20px',
              backgroundColor: showMap ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: showMap ? 'pointer' : 'not-allowed'
            }}
          >
            Show Route
          </button>
          
          <button 
            type="button" 
            onClick={handleFindRide}
            disabled={!showMap || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: (!showMap || loading) ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (!showMap || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Find Compatible Rides'}
          </button>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          style={{ 
            width: '100%', 
            height: 400, 
            borderRadius: 8, 
            border: '1px solid #ccc',
            marginBottom: '1rem'
          }}
          alt ="Map Preview"
        />

        {/* Messages */}
        {message && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            color: message.includes('error') || message.includes('No') ? '#dc3545' : '#495057'
          }}>
            {message}
          </div>
        )}

        {/* Ride Results */}
        {filteredRides.length > 0 && (
          <div className='ride-results'>
            <h3>Compatible Rides Found ({filteredRides.length})</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredRides.map(ride => {
                let buttonBgColor;
                if (ride.isBooked) {
                  buttonBgColor = '#6c757d';
                } else if (ride.user._id === userId) {
                  buttonBgColor = '#dc3545';
                } else {
                  buttonBgColor = '#28a745';
                }
                return (
                <div 
                  key={ride._id}
                  style={{
                    padding: '15px',
                    margin: '10px 0',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {ride.source} → {ride.destination}
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <strong>Driver:</strong> {ride.user?.fname} {ride.user?.lname}
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <strong>Username:</strong> @{ride.user?.username}
                  </div>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: ride.matchType === 'Exact match' ? '#d4edda' : '#fff3cd',
                    color: ride.matchType === 'Exact match' ? '#155724' : '#856404',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    {ride.matchType}
                  </div>
                  {(() => {
                    let buttonLabel;
                    if (bookingLoading[ride._id]) {
                      buttonLabel = 'Booking...';
                    } else if (ride.isBooked) {
                      buttonLabel = 'Already Booked';
                    } else if (ride.user._id === userId) {
                      buttonLabel = 'Your Ride';
                    } else {
                      buttonLabel = 'Book Ride';
                    }
                    return (
                      <button
                        onClick={() => handleBookRide(ride)}
                        disabled={bookingLoading[ride._id] || ride.isBooked || ride.user._id === userId}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: buttonBgColor,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: (bookingLoading[ride._id] || ride.isBooked || ride.user._id === userId) 
                            ? 'not-allowed' 
                            : 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {buttonLabel}
                      </button>
                    );
                  })()}
                </div>
              )})}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindRide;