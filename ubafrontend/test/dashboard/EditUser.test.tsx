import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditUser from '../../src/pages/dashboard/EditUser';
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

describe('EditUser Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the edit user form', () => {
    renderComponent();
    
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByTestId('firstname')).toBeInTheDocument();
    expect(screen.getByTestId('lastname')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('loads user data and populates the form', async () => {
    renderComponent();
    
    const user = users[0];
    await waitFor(() => {
      expect(screen.getByTestId('firstname')).toHaveValue(user.fname);
      expect(screen.getByTestId('lastname')).toHaveValue(user.lname);
      expect(screen.getByTestId('email')).toHaveValue(user.email);
      expect(screen.getByTestId('password')).toHaveValue(user.password);
    });
  });

  it('handles form submission successfully', async () => {
    renderComponent();
    
    const user = users[0];
    await waitFor(() => {
      expect(screen.getByTestId('firstname')).toHaveValue(user.fname);
    });

    fireEvent.change(screen.getByTestId('firstname'), {
      target: { value: 'Updated First Name' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(showToast.success).toHaveBeenCalledWith('User updated successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/users');
    });
  });

  it('shows error when email is already taken by another user', async () => {
    renderComponent();
    
    const user = users[0];
    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveValue(user.email);
    });

    // Try to update with another user's email
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: users[1].email }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(showToast.error).toHaveBeenCalledWith('Email already registered');
    });
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