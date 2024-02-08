// Login.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../src/pages/Login'; // Adjust the import path as necessary

describe('Login Component', () => {
  test('initially displays the login form and can toggle to sign-up form', () => {
    render(<Login />);
    
    // Initially, the login form should be visible
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
    
    // Click the "Sign Up" button to toggle to the sign-up form
    fireEvent.click(screen.getByText(/Sign Up/i));
    
    // Now, the sign-up form should be visible
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
  });

  test('can toggle back to login form from sign-up form', () => {
    render(<Login />);
    
    // First, toggle to the sign-up form
    fireEvent.click(screen.getByText(/Sign Up/i));
    
    // Then, click the "Log In" button to toggle back to the login form
    fireEvent.click(screen.getByText(/Log In/i));
    
    // Verify the login form is displayed again
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  // Additional tests to simulate form submissions and validate callbacks can be similarly structured
  // Note: To test form submission handling, you'd typically mock loginUser and signUpUser functions
  // and assert they were called with expected arguments. This requires setting up jest.fn() mocks
  // and providing them as props to your LoginForm and SignUpForm components.
});
