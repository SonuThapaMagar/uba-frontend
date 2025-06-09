import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { graphQLRequest } from '../../utils/api';
import { SIGNUP } from '../../utils/queries';

const Signup = () => {
  const { formData, handleChange } = useForm({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: SIGNUP.loc?.source.body,
          variables: { input: formData }
        })
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      localStorage.setItem('token', result.data.signup.token);
      showToast.success(TOAST_MESSAGES.USER_CREATED);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
      showToast.error(TOAST_MESSAGES.USER_CREATE_ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-20">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Register</h2>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField label="First Name" type="text" value={formData.fname} onChange={handleChange} placeholder="Enter your first name" required name="fname" />
            <InputField label="Last Name" type="text" value={formData.lname} onChange={handleChange} placeholder="Enter your last name" required name="lname" />
            <InputField label="Email address" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required autoComplete="email" name="email" />
            <InputField label="Password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required autoComplete="new-password" name="password" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5F69FB] hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Register
          </button>
          <p className="mt-2 text-center text-sm text-gray-600">Already have an account? <a href="/" className="font-medium text-indigo-400 hover:text-indigo-500 ml-1">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;