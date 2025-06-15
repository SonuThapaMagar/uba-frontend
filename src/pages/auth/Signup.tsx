import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { SIGNUP } from '../../utils/queries';

const Signup = () => {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const [signup, { loading }] = useMutation(SIGNUP, {
    onCompleted: () => {
      showToast.success('Sign up successful! Await admin approval.');
      navigate('/');
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(err.message || TOAST_MESSAGES.USER_CREATE_ERROR);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signup({ variables: { input: formData } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-20">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Register</h2>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              label="First Name"
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <InputField
              label="Last Name"
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5F69FB] hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;