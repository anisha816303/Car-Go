import React from 'react';
import { render, screen } from '@testing-library/react';
import MyRides from '../pages/ManageRides/MyRides.jsx';
import { describe, test, beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

describe('MyRides', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'testuserid');
  });

  test('renders MyRides page', () => {
    render(
      <MemoryRouter>
        <MyRides />
      </MemoryRouter>
    );
    expect(screen.getByText(/My Rides/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Create Ride/i })).toBeInTheDocument();
  });
});