import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateUser from '../../src/pages/dashboard/CreateUser';
import { users } from '../../src/types/userdata';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateUser Component', () => {
  beforeEach(() => {
    // Clear users array before each test
    users.length = 0;
    jest.clearAllMocks();
  });

  it('renders create user form with empty inputs', () => {
    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    expect(screen.getByTestId('firstname')).toHaveValue('');
    expect(screen.getByTestId('lastname')).toHaveValue('');
    expect(screen.getByTestId('email')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
  });

  it('allows input changes', () => {
    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('firstname'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('lastname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });

    expect(screen.getByTestId('firstname')).toHaveValue('John');
    expect(screen.getByTestId('lastname')).toHaveValue('Doe');
    expect(screen.getByTestId('email')).toHaveValue('john@example.com');
    expect(screen.getByTestId('password')).toHaveValue('password123');
  });

  it('creates a new user successfully', () => {
    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('firstname'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('lastname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      id: 1,
      fname: 'John',
      lname: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/users');
  });

  it('shows error for duplicate email', () => {
    // Add a user with the same email
    users.push({
      id: 1,
      fname: 'Existing',
      lname: 'User',
      email: 'john@example.com',
      password: 'password123'
    });

    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('firstname'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('lastname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(screen.getByText('Email already registered')).toBeInTheDocument();
    expect(users).toHaveLength(1); // Should not add duplicate user
  });
}); 