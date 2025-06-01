import React from 'react';
import { render, screen } from '@testing-library/react';
import MyRides from '../pages/ManageRides/MyRides.jsx';
import {describe, test, beforeEach, expect} from 'vitest';

describe('MyRides', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'testuserid');
  });

  test('renders MyRides page', () => {
    render(<MyRides />);
    expect(screen.getByText(/My Rides/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Create Ride/i })).toBeInTheDocument();
  });
});