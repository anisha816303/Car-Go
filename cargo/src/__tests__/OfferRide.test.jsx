import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OfferRide from '../pages/ManageRides/OfferRide.jsx';
import {describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('OfferRide', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'testuserid');
  });

  test('renders OfferRide form', () => {
    render(<OfferRide />);
    expect(screen.getByPlaceholderText(/Enter source/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter destination/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Offer Ride/i })).toBeInTheDocument();
  });

  test('shows error if not logged in', async () => {
    localStorage.removeItem('userId');
    render(<OfferRide />);
    fireEvent.click(screen.getByRole('button', { name: /Offer Ride/i }));
    await waitFor(() => {
      expect(screen.getByText(/'You must be logged in to offer a ride.'/i)).toBeInTheDocument();
    });
  });
});