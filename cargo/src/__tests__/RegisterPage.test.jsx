import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Helper to render with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('RegisterPage', () => {
  beforeAll(() => {
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('renders register form', () => {
    renderWithRouter(<RegisterPage />);

    expect(screen.getByPlaceholderText('First Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Last Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: /register/i })).toBeTruthy();
  });

  test('allows user to type in form fields', () => {
    renderWithRouter(<RegisterPage />);

    const fnameInput = screen.getByPlaceholderText('First Name');
    const lnameInput = screen.getByPlaceholderText('Last Name');
    const unameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(fnameInput, { target: { value: 'John' } });
    fireEvent.change(lnameInput, { target: { value: 'Doe' } });
    fireEvent.change(unameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(fnameInput.value).toBe('John');
    expect(lnameInput.value).toBe('Doe');
    expect(unameInput.value).toBe('johndoe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows success alert on successful registration', async () => {
    // Mock axios POST success
    axios.post.mockResolvedValueOnce({ data: { message: 'Registration successful' } });

    renderWithRouter(<RegisterPage />);

    // Act: Fill form and submit
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Assert: Simulate success alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration successful');
    });
  });

  test('shows error alert on failed registration', async () => {
    // Mock axios POST failure
    axios.post.mockRejectedValueOnce(new Error('Registration failed'));

    renderWithRouter(<RegisterPage />);

    // Act: Fill form and submit
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Assert: Simulate error alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration failed');
    });
  });
});
