import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/auth/Login';

describe('Login Test', () => {
  it('Empty input', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const email = getByTestId('email') as HTMLInputElement;
    const password = getByTestId('password') as HTMLInputElement;
    expect(email.value).toEqual('');
    expect(password.value).toEqual('');
  });

  it('Should change input', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const email = getByTestId('email') as HTMLInputElement;
    const password = getByTestId('password') as HTMLInputElement;

    fireEvent.change(email, { target: { value: 'test@gmail.com' } });
    fireEvent.change(password, { target: { value: 'test123' } });

    expect(email.value).toEqual('test@gmail.com');
    expect(password.value).toEqual('test123');
  });
});
