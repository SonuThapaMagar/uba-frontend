import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import bg from '../../assets/bg.png';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../utils/queries';
import { storeToken, getCurrentRole } from '../../utils/auth';

const Login = () => {
  const { formData, handleChange } = useForm({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.login) {
        const { token, user } = data.login;
        if (!user.role) {
          setError('User role not found');
          return;
        }
        storeToken(token, user.role);
        showToast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
        navigate('/dashboard', { replace: true });
      }
    },
    onError: (error) => {
      setError(error.message);
      showToast.error(error.message || TOAST_MESSAGES.LOGIN_ERROR);
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const currentRole = getCurrentRole();
    if (currentRole) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    login({ variables: { input: formData } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <img
        src={bg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none opacity-100"
      />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Login</h2>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              data-testid="email"
              name="email"
            />
            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              data-testid="password"
              name="password"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-violet-400 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5F69fb] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-500 ml-1">
                create a new account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;