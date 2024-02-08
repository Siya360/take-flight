// LoginModal.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoginModal from '../components/LoginModal';

// Mock the LoginForm to isolate the test to LoginModal functionality
jest.mock('../components/LoginForm', () => () => <div>LoginFormMock</div>);

describe('LoginModal', () => {
  test('renders LoginForm when open', () => {
    render(<LoginModal open={true} onClose={jest.fn()} onLogin={jest.fn()} />);
    // Check if the mocked LoginForm is rendered
    expect(screen.getByText('LoginFormMock')).toBeInTheDocument();
  });

  test('does not render LoginForm when not open', () => {
    render(<LoginModal open={false} onClose={jest.fn()} onLogin={jest.fn()} />);
    // Check that the mocked LoginForm is not in the document
    expect(screen.queryByText('LoginFormMock')).not.toBeInTheDocument();
  });

  test('calls onClose when attempting to close the modal', async () => {
    const handleClose = jest.fn();
    render(<LoginModal open={true} onClose={handleClose} onLogin={jest.fn()} />);
    
    // To later adjust this part based on how the modal can be closed (e.g., clicking a close button)
    await userEvent.click(screen.getByRole('presentation'));
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
