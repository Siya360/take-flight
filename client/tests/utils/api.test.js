import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataFetcher from '../components/DataFetcher';
import { fetchData } from '../api'; 

// Mock the API module
jest.mock('../api', () => ({
  fetchData: jest.fn(),
}));

describe('DataFetcher', () => {
  test('displays data when fetch is successful', async () => {
    fetchData.mockResolvedValueOnce({ data: 'Some data' });
    render(<DataFetcher />);

    await waitFor(() => {
      expect(screen.getByText('Some data')).toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    fetchData.mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<DataFetcher />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  // Additional tests for error handling
  test('retries fetching data on button click after initial failure', async () => {
    fetchData.mockRejectedValueOnce(new Error('Failed to fetch')); // First call fails
    fetchData.mockResolvedValueOnce({ data: 'New fetched data' }); // Second call succeeds

    render(<DataFetcher />);

    // Initially, check for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    // Simulate user action to retry fetch
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    // Check if the new data is displayed after retry
    await waitFor(() => {
      expect(screen.getByText('New fetched data')).toBeInTheDocument();
    });
  });

  // You can add more tests here to cover other scenarios, such as testing loading states, handling different types of errors, etc.
});
