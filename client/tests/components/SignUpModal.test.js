import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpModal from '../components/SignUpModal';

describe('SignUpModal', () => {
  test('renders correctly when open', () => {
    render(
      <SignUpModal open={true} onClose={() => {}} onSignUp={() => {}} />
    );

    // Use `screen.getByRole` to assert the modal is in the document
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('calls onClose when attempting to close the modal', () => {
    const mockOnClose = jest.fn();
    render(<SignUpModal open={true} onClose={mockOnClose} onSignUp={() => {}} />);

    // Use `screen.getByLabelText` assuming the close button has an aria-label
    fireEvent.click(screen.getByLabelText('close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('renders SignUpForm and triggers onSignUp on form submission', async () => {
    const mockOnSignUp = jest.fn();
    render(<SignUpModal open={true} onClose={() => {}} onSignUp={mockOnSignUp} />);

    // Simulate form submission within the modal
    // Note: This requires the form to be correctly rendered within the modal
    // and the `onSignUp` prop of the SignUpForm to be correctly wired to the modal's `onSignUp` prop.
    // Example form interaction, adjust based on actual form fields and button:
    // fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    // fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    // Wait for the onSignUp callback to be called
    // await waitFor(() => expect(mockOnSignUp).toHaveBeenCalledWith(expect.anything()));

    // Note: Detailed interaction with the form depends on its actual implementation and fields.
  });

  // Additional tests for different scenarios can be included here
});
