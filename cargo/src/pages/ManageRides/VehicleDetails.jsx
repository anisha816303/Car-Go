import React, { useEffect, useState, useRef } from 'react';
import './VehicleDetails.css';

function VehicleDetails() {
  const [vehicles, setVehicles] = useState([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [number, setNumber] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const fileInputRef = useRef();

  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}/vehicles`)
      .then(res => res.json())
      .then(setVehicles)
      .catch(() => setMessage('Failed to load vehicles.'));
  }, [userId, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!make || !model || !number) {
      setMessage('Please fill all fields.');
      return;
    }
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('number', number);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${userId}/vehicles`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setMessage('Vehicle added!');
        setMake('');
        setModel('');
        setNumber('');
        setImage(null);
        fileInputRef.current.value = '';
        // Refresh vehicles
        const data = await res.json();
        setVehicles([data.vehicle, ...vehicles]);
      } else {
        setMessage('Failed to add vehicle.');
      }
    } catch {
      setMessage('Server error.');
    }
  };

  return (
    <div className="vehicle-details-container">
      <h2>Vehicle Details</h2>
      <p>Manage your vehicle information. Add, edit, or remove vehicles.</p>
      <form className="vehicle-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Make (e.g. Honda)"
          value={make}
          onChange={e => setMake(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Model (e.g. City)"
          value={model}
          onChange={e => setModel(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Vehicle Number"
          value={number}
          onChange={e => setNumber(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={e => setImage(e.target.files[0])}
        />
        <button type="submit">Add Vehicle</button>
      </form>
      {message && <div className="vehicle-message">{message}</div>}
      <div className="vehicle-list">
        {vehicles.length === 0 && <div>No vehicles added yet.</div>}
        {vehicles.map(vehicle => (
          <div className="vehicle-card" key={vehicle._id}>
            {vehicle.imageUrl && (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${vehicle.imageUrl}`}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="vehicle-img"
              />
            )}
            <div className="vehicle-info">
              <div><strong>{vehicle.make} {vehicle.model}</strong></div>
              <div className="vehicle-number">{vehicle.number}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleDetails;