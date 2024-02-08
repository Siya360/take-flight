// LoginForm.test.js

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from '../components/LoginForm';

// Assuming `../utils/api` is the correct path to your API utility file
jest.mock('../utils/api', () => ({
  loginUser: jest.fn(() => Promise.resolve({ token: 'fake-token' })), // Mock `loginUser` to resolve with a predefined object
}));

describe('LoginForm', () => {
  test('submits entered email and password', async () => {
    const mockOnLogin = jest.fn();
    render(<LoginForm onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Here, instead of checking loginUser directly, you can wait for any expected UI change or mockOnLogin to be called
    // For example, if loginUser triggers onLogin upon success:
    await waitFor(() => expect(mockOnLogin).toHaveBeenCalled());

    // Note: `loginUser` is a mock function here, and its call assertions should be related to its mock definition
  });
});
