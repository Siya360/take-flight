import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SortFlights from '../../src/pages/SortFlights'; // Adjust the import path as necessary

describe('SortFlights Component', () => {
  test('calls onSort with correct sort option', () => {
    const mockOnSort = jest.fn();
    render(<SortFlights onSort={mockOnSort} />);

    // Simulate user clicking on the sort button
    fireEvent.click(screen.getByText(/Sort by:/i));

    // Simulate user selecting a sort option
    fireEvent.click(screen.getByText('Price Low to High'));

    // Verify the mockOnSort function was called with the correct value
    expect(mockOnSort).toHaveBeenCalledWith('PriceLowToHigh');
  });
});
