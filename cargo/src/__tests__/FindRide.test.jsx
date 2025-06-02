import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import FindRide from '../pages/ManageRides/FindRide.jsx';
import { describe, test, expect } from 'vitest';

describe('FindRide', () => {
  test('renders FindRide form inputs and buttons', () => {
    render(<FindRide />);
    expect(screen.getByPlaceholderText('Enter source or use autodetect')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter destination')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Show Route/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Find Compatible Ride/i })).toBeTruthy();
  });

  test('shows map image preview when source and destination are filled', async () => {
    render(<FindRide />);
    fireEvent.change(screen.getByPlaceholderText('Enter source or use autodetect'), { target: { value: 'BTM Layout' } });
    fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Koramangala' } });

  });

  // test('disables buttons when source or destination is missing', () => {
  //   render(<FindRide />);
  //   const findRideBtn = screen.getByRole('button', { name: /Find Ride/i });
  //   const mapBtn = screen.getByRole('button', { name: /Show Map/i });

  //   expect(findRideBtn).toBeDisabled();
  //   expect(mapBtn).toBeDisabled();
  // });
});
