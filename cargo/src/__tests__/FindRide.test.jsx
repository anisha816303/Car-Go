import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindRide from '../pages/ManageRides/FindRide.jsx';
import { describe, test, expect } from 'vitest';

describe('FindRide', () => {
  test('renders FindRide form inputs and buttons', () => {
    render(<FindRide />);
    expect(screen.getByPlaceholderText(/Enter source/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter destination/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show Map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Find Ride/i })).toBeInTheDocument();
  });

  test('shows map image preview when source and destination are filled', async () => {
    render(<FindRide />);
    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), { target: { value: 'BTM Layout' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), { target: { value: 'Koramangala' } });

    // Wait for DOM update
    await waitFor(() => {
      const mapImage = screen.getByAltText(/Map Preview/i);
      expect(mapImage).toBeInTheDocument();
    });
  });

  test('disables buttons when source or destination is missing', () => {
    render(<FindRide />);
    const findRideBtn = screen.getByRole('button', { name: /Find Ride/i });
    const mapBtn = screen.getByRole('button', { name: /Show Map/i });

    expect(findRideBtn).toBeDisabled();
    expect(mapBtn).toBeDisabled();
  });
});
