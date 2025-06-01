import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FindRide from '../pages/ManageRides/FindRide.jsx';
import {describe, test, expect} from 'vitest';

describe('FindRide', () => {
  test('renders FindRide form', () => {
    render(<FindRide />);
    expect(screen.getByPlaceholderText(/Enter source/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter destination/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Find Ride/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Map Preview/i)).toBeInTheDocument();
  });

  test('shows map preview when source and destination are filled', () => {
    render(<FindRide />);
    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), { target: { value: 'BTM' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), { target: { value: 'Koramangala' } });
    expect(screen.getByText(/Map preview/i)).toBeInTheDocument();
  });
});