import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../../src/pages/auth/Signup';

describe('Signup Test', () => {
  it('Empty input', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const fname = getByTestId('first name') as HTMLInputElement;
    const lname = getByTestId('last name') as HTMLInputElement;
    const email = getByTestId('email address') as HTMLInputElement;
    const password = getByTestId('password') as HTMLInputElement;

    expect(fname.value).toEqual('');
    expect(lname.value).toEqual('');
    expect(email.value).toEqual('');
    expect(password.value).toEqual('');
  });

  it('Should change input', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const fname = getByTestId('first name') as HTMLInputElement;
    const lname = getByTestId('last name') as HTMLInputElement;
    const email = getByTestId('email address') as HTMLInputElement;
    const password = getByTestId('password') as HTMLInputElement;

    fireEvent.change(fname, { target: { value: 'John' } });
    fireEvent.change(lname, { target: { value: 'Doe' } });
    fireEvent.change(email, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(password, { target: { value: 'password123' } });

    expect(fname.value).toEqual('John');
    expect(lname.value).toEqual('Doe');
    expect(email.value).toEqual('john.doe@example.com');
    expect(password.value).toEqual('password123');
  });
});
