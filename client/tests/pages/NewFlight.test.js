import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewFlight from '../../src/pages/NewFlight';

test('submits the form with flight search details', async () => {
  render(<NewFlight />);

  // Use `screen.getByLabelText` instead of destructuring queries from `render`
  fireEvent.change(screen.getByLabelText(/Enter Departure/i), { target: { value: 'JFK' } });

  // Use `screen.getByLabelText` for the destination input as well
  fireEvent.change(screen.getByLabelText(/Enter Destination/i), { target: { value: 'LAX' } });

  // Use `screen.getByText` for clicking on the search button
  fireEvent.click(screen.getByText(/Search/i));

  // Wait for expected outcome using `screen.getByText`
  await waitFor(() => {
    // Check if "Loading flights..." text is present in the document after form submission
    expect(screen.getByText(/Loading flights.../i)).toBeInTheDocument();
  });
});
