// Import necessary libraries and components
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react'; // Import testing utilities
import '@testing-library/jest-dom'; // Import jest-dom for extended assertions
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for simulating routing
import App from '../App'; // Import the component to be tested

// Describe the test suite
describe('App Component', () => {
  // Test if the NewFlight component is the default route
  test('renders NewFlight as the default route', () => {
    // Render the App component within a MemoryRouter to simulate routing
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Expect the text "Search for Flights" to be in the document
    expect(screen.getByText(/Search for Flights/i)).toBeInTheDocument();
  });

  // Test if the FlightList component is rendered when the "/flights" route is accessed
  test('navigates to FlightList when flights route is accessed', () => {
    render(
      <MemoryRouter initialEntries={['/flights']}>
        <App />
      </MemoryRouter>
    );

    // Expect the text "Loading flights..." to be in the document
    expect(screen.getByText(/Loading flights.../i)).toBeInTheDocument();
  });

  // Test if the FlightDetails component is rendered when a specific flight detail route is accessed
  test('navigates to FlightDetails when a specific flight detail route is accessed', () => {
    render(
      <MemoryRouter initialEntries={['/flight-details/123']}>
        <App />
      </MemoryRouter>
    );

    // Expect the text "Flight Details" to be in the document
    expect(screen.getByText(/Flight Details/i)).toBeInTheDocument();
  });

  // Test if the LoginModal is rendered when the login button is clicked
  test('renders LoginModal when login button is clicked', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Simulate a click event on the "Log In" button
    fireEvent.click(screen.getByText(/Log In/i));
    // Wait for the dialog to appear in the document
    const loginModal = await screen.findByRole('dialog');

    // Expect the dialog to contain the text "Login to your account"
    expect(loginModal).toHaveTextContent(/Login to your account/i);
  });

  // Test if the SignUpModal is rendered when the sign up button is clicked
  test('renders SignUpModal when sign up button is clicked', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Simulate a click event on the "Sign Up" button
    fireEvent.click(screen.getByText(/Sign Up/i));
    // Wait for the dialog to appear in the document
    const signUpModal = await screen.findByRole('dialog');

    // Expect the dialog to contain the text "Create your account"
    expect(signUpModal).toHaveTextContent(/Create your account/i);
  });
});