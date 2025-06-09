import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeleteUser from '../../src/pages/dashboard/DeleteUser';
import { users } from '../../src/types/userdata';
import { showToast } from '../../src/utils/toast';

// Mock the toast utility
jest.mock('../../../utils/toast', () => ({
  showToast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' })
}));

describe('DeleteUser Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DeleteUser />} />
        </Routes>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the delete user confirmation page', () => {
    renderComponent();
    
    expect(screen.getByText('Delete User')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the following user?/)).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('displays user information', async () => {
    renderComponent();
    
    const user = users[0];
    await waitFor(() => {
      expect(screen.getByText(`Name: ${user.fname} ${user.lname}`)).toBeInTheDocument();
      expect(screen.getByText(`Email: ${user.email}`)).toBeInTheDocument();
    });
  });

  it('handles user deletion successfully', async () => {
    renderComponent();
    
    const initialUserCount = users.length;
    fireEvent.click(screen.getByTestId('delete-button'));

    await waitFor(() => {
      expect(users.length).toBe(initialUserCount - 1);
      expect(showToast.success).toHaveBeenCalledWith('User deleted successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/users');
    });
  });

  it('handles cancellation', () => {
    renderComponent();
    
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/users');
  });

  it('redirects to users list when user is not found', async () => {
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: '999' });
    
    renderComponent();

    await waitFor(() => {
      expect(showToast.error).toHaveBeenCalledWith('User not found');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/users');
    });
  });
}); 