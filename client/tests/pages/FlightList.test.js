import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FlightList from '../../src/pages/FlightList';

test('loads and displays flights', async () => {
  render(<FlightList />);

  // Wait for the flights to be loaded using `screen.getByText`
  await waitFor(() => {
    expect(screen.getByText(/Flight #123/i)).toBeInTheDocument();
  });
});

test('loads more flights on button click', async () => {
  render(<FlightList />);
  
  // Simulate clicking 'Load More' button using `screen.getByText`
  fireEvent.click(screen.getByText(/Load More/i));

  // Wait for more flights to be loaded using `screen.getByText`
  await waitFor(() => {
    expect(screen.getByText(/Flight #456/i)).toBeInTheDocument();
  });
});

