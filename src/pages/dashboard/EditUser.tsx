import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER, GET_CURRENT_USER, UPDATE_USER } from '../../utils/queries';

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, handleChange, setFormData } = useForm({
    fname: '',
    lname: '',
    email: '',
    role: '',
    password: 'Default123!' // Default password for admin edits
  });
  const [error, setError] = useState('');

  // Get current user's role
  const { data: currentUserData } = useQuery(GET_CURRENT_USER);
  const currentUserRole = currentUserData?.currentUser?.role || 'USER';
  const isAdmin = currentUserRole === 'ADMIN';

  // Get user to edit
  const { loading, error: queryError, data } = useQuery(GET_USER, {
    variables: { id },
    onCompleted: (data) => {
      if (data?.user) {
        // Check if admin is trying to edit another admin or super admin
        if (isAdmin && (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN')) {
          showToast.error(TOAST_MESSAGES.UNAUTHORIZED);
          navigate('/users');
          return;
        }
        setFormData({
          fname: data.user.fname,
          lname: data.user.lname,
          email: data.user.email,
          role: data.user.role,
          password: 'Default123!' // Keep default password for admin edits
        });
      }
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_FETCH_ERROR);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      showToast.success(TOAST_MESSAGES.USER_UPDATED);
      navigate('/users');
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fname || !formData.lname || !formData.email) {
      setError('First name, last name, and email are required');
      showToast.error('Please fill in all required fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email format');
      showToast.error('Please enter a valid email');
      return;
    }

    const input = {
      fname: formData.fname.trim(),
      lname: formData.lname.trim(),
      email: formData.email.trim(),
      role: formData.role,
      password: formData.password // Always include the default password for admin edits
    };

    try {
      await updateUser({ 
        variables: { 
          id,
          input 
        }
      });
    } catch (err) {
      setError('Failed to update user');
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Clear error when user starts typing
    handleChange(e);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (queryError) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{queryError.message}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="First Name"
            type="text"
            value={formData.fname}
            onChange={handleInputChange}
            placeholder="Enter first name"
            required
            name="fname"
          />
          <InputField
            label="Last Name"
            type="text"
            value={formData.lname}
            onChange={handleInputChange}
            placeholder="Enter last name"
            required
            name="lname"
          />
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
            name="email"
          />
          {currentUserRole === 'SUPER_ADMIN' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => handleChange(e as any)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;