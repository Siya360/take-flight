// Import statement for React, testing utilities, and FlightCard component
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import FlightCard from '../components/FlightCard'; // Update the import path as necessary

// Mock flight data
const mockFlight = {
  id: 1,
  airline: 'Test Airline',
  departureTime: '10:00',
  arrivalTime: '12:00',
  duration: '2h',
  price: 100,
};

describe('FlightCard', () => {
  it('renders correctly', () => {
    // Render FlightCard wrapped in BrowserRouter to simulate routing context
    render(
      <BrowserRouter>
        <FlightCard flight={mockFlight} />
      </BrowserRouter>
    );

    // Assertions to ensure FlightCard renders flight details correctly
    expect(screen.getByText(mockFlight.airline)).toBeInTheDocument();
    expect(screen.getByText(`${mockFlight.departureTime} - ${mockFlight.arrivalTime}`)).toBeInTheDocument();
    expect(screen.getByText(`Duration: ${mockFlight.duration}`)).toBeInTheDocument();
    expect(screen.getByText(`Price: R${mockFlight.price}`)).toBeInTheDocument();
  });

  // More tests can be added here, for example, to simulate interactions or test additional logic
});
