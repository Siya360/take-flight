import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FlightDetails from '../FlightDetails';
import { BrowserRouter } from 'react-router-dom';

// Mock the custom hook and its return values
jest.mock('../hooks/useApiCall', () => ({
  __esModule: true, // This line is necessary when mocking a module that has a default export
  default: jest.fn(() => ({
    data: {
      id: 1,
      airline: 'Test Airline',
      departureTime: '2022-01-01T10:00:00Z',
      arrivalTime: '2022-01-01T15:00:00Z',
      duration: '5 hours',
      price: 299,
    },
    isLoading: false,
    error: null,
    execute: jest.fn(),
  })),
}));

describe('FlightDetails', () => {
  test('displays flight details correctly', async () => {
    render(
      <BrowserRouter>
        <FlightDetails />
      </BrowserRouter>
    );

    // Separate waitFor for each assertion to avoid multiple assertions within a single waitFor callback
    await waitFor(() => {
      expect(screen.getByText('Test Airline')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/departure:/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/arrival:/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/duration:/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/price:/i)).toBeInTheDocument();
    });
  });

  // Additional tests can be added here
});
