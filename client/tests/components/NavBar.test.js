// NavBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../components/NavBar';

describe('NavBar', () => {
  test('renders Login and Sign Up buttons and allows clicking', async () => {
    const mockOnLoginClick = jest.fn();
    const mockOnSignUpClick = jest.fn();

    render(<NavBar onLoginClick={mockOnLoginClick} onSignUpClick={mockOnSignUpClick} />);

    // Assert that the Login button is rendered
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    // Assert that the Sign Up button is rendered
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();

    // Simulate user clicking the Login button
    fireEvent.click(loginButton);
    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);

    // Simulate user clicking the Sign Up button
    fireEvent.click(signUpButton);
    expect(mockOnSignUpClick).toHaveBeenCalledTimes(1);
  });
});
