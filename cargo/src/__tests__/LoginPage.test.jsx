import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import axios from 'axios';
import { vi, describe, test, expect, beforeAll, beforeEach } from 'vitest';

// MOCK axios using vi
vi.mock('axios');

// Helper to render with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Important to reset mocks between tests
  });

  test('renders login form', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
  });

  test('allows user to type username and password', () => {
    renderWithRouter(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows success alert on successful login', async () => {
    // Arrange: Mock axios POST success
    axios.post.mockResolvedValueOnce({ data: { message: 'Login successful' } });

    renderWithRouter(<LoginPage />);

    // Act: Fill form and submit
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert: Wait for the alert to be called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login successful');
    });
  });

  test('shows error alert on failed login', async () => {
    // Arrange: Mock axios POST failure
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });

    renderWithRouter(<LoginPage />);

    // Act: Fill form and submit
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert: Wait for the alert to be called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});

// Mock window.alert so that we can check what it was called with
beforeAll(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});
