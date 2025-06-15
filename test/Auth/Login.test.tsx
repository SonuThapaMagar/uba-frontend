// import React from 'react';
// import { render, fireEvent, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { BrowserRouter } from 'react-router-dom';
// import Login from '../../src/pages/auth/Login';

// // Mock the useNavigate hook
// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => {
//   const actual = jest.requireActual('react-router-dom');
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// describe('Login Component', () => {
//   beforeEach(() => {
//     // Clear all mocks before each test
//     jest.clearAllMocks();
//   });

//   it('renders login form with empty inputs', () => {
//     const { getByTestId } = render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const email = getByTestId('email') as HTMLInputElement;
//     const password = getByTestId('password') as HTMLInputElement;

//     expect(email.value).toBe('');
//     expect(password.value).toBe('');
//   });

//   it('allows input changes', () => {
//     const { getByTestId } = render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const email = getByTestId('email') as HTMLInputElement;
//     const password = getByTestId('password') as HTMLInputElement;

//     fireEvent.change(email, { target: { value: 'test@example.com' } });
//     fireEvent.change(password, { target: { value: 'password123' } });

//     expect(email.value).toEqual('test@example.com');
//     expect(password.value).toEqual('password123');
//   });

//   it('shows error message for invalid credentials', () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const emailInput = screen.getByTestId('email') as HTMLInputElement;
//     const passwordInput = screen.getByTestId('password') as HTMLInputElement;
//     const submitButton = screen.getByRole('button', { name: /login/i });

//     fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
//     fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
//     fireEvent.click(submitButton);

//     expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
//   });

//   it('handles successful login', () => {
//     // Add a test user to the users array
//     const testUser = {
//       id: 1,
//       fname: 'Test',
//       lname: 'User',
//       email: 'test@example.com',
//       password: 'password123'
//     };
//     users.push(testUser);

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const emailInput = screen.getByTestId('email') as HTMLInputElement;
//     const passwordInput = screen.getByTestId('password') as HTMLInputElement;
//     const submitButton = screen.getByRole('button', { name: /login/i });

//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
//     fireEvent.change(passwordInput, { target: { value: 'password123' } });
//     fireEvent.click(submitButton);

//     // Check if alert was called with success message
//     expect(window.alert).toHaveBeenCalledWith('Login successful!');
//   });
// });
