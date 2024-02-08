import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpForm from '../components/SignUpForm';
import { signUpUser } from '../utils/api';

// Mock the API module and its signUpUser function
jest.mock('../utils/api', () => ({
  signUpUser: jest.fn(),
}));

describe('SignUpForm additional scenarios', () => {
    it('displays validation errors for empty required fields', async () => {
      render(<SignUpForm onSignUp={jest.fn()} />);
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);
  
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        // Add other required fields as needed
      });
    });
  
    it('shows loading indicator when sign up is in progress', async () => {
      // Mock the signUpUser function to delay its response
      signUpUser.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({}), 1000)));
      
      render(<SignUpForm onSignUp={jest.fn()} />);
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
  
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(signUpButton);
  
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
  