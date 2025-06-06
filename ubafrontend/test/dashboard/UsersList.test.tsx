import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UsersList from '../../src/pages/dashboard/UsersList';
import { users } from '../../src/types/userdata';

describe('UsersList Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UsersList />
      </BrowserRouter>
    );
  };

  it('renders the users list table', () => {
    renderComponent();
    
    expect(screen.getByText('Users List')).toBeInTheDocument();
    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays all users in the table', () => {
    renderComponent();
    
    users.forEach(user => {
      expect(screen.getByText(`${user.fname} ${user.lname}`)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
      expect(screen.getByTestId(`edit-user-${user.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`delete-user-${user.id}`)).toBeInTheDocument();
    });
  });

  it('has correct links for edit and delete actions', () => {
    renderComponent();
    
    users.forEach(user => {
      const editLink = screen.getByTestId(`edit-user-${user.id}`);
      const deleteLink = screen.getByTestId(`delete-user-${user.id}`);
      
      expect(editLink).toHaveAttribute('href', `/dashboard/edit-user/${user.id}`);
      expect(deleteLink).toHaveAttribute('href', `/dashboard/delete-user/${user.id}`);
    });
  });
}); 