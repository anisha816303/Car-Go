import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OfferRide from '../pages/ManageRides/OfferRide.jsx';
import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('OfferRide', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'testuserid');
  });

  test('renders OfferRide form inputs', () => {
    render(<OfferRide />);
    expect(screen.getByPlaceholderText('Enter source')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter destination')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter number of seats available')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Offer Ride/i })).toBeTruthy();
  });

  // test('shows error if user not logged in', async () => {
  //   localStorage.removeItem('userId');
  //   render(<OfferRide />);

  //   fireEvent.change(screen.getByPlaceholderText('Enter source'), { target: { value: 'A' } });
  //   fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'B' } });
  //   const offerBtn = screen.getByRole('button', { name: /Offer Ride/i });

  //   fireEvent.click(offerBtn);

  //   await waitFor(() => {
  //     expect(screen.getByText('Missing user, source, or destination')).toBeTruthy();
  //   });
  // });

  test('disables button if source or destination is missing', () => {
    render(<OfferRide />);
    const offerBtn = screen.getByRole('button', { name: /Offer Ride/i });
    expect(offerBtn).toBeDisabled();
  });
});
