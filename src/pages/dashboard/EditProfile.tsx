import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_USER, UPDATE_PROFILE } from '../../utils/queries';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { formData, handleChange, setFormData } = useForm({
    fname: '',
    lname: '',
    email: '',
  });
  const [error, setError] = useState('');

  const { loading, error: queryError, data } = useQuery(GET_CURRENT_USER, {
    onCompleted: (data) => {
      if (data?.currentUser) {
        setFormData({
          fname: data.currentUser.fname,
          lname: data.currentUser.lname,
          email: data.currentUser.email,
        });
      }
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    }
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      showToast.success(TOAST_MESSAGES.USER_UPDATED);
      navigate('/profile');
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ variables: { input: formData } });
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </DashboardLayout>
  );

  if (queryError) return (
    <DashboardLayout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{queryError.message}</span>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField 
              label="First Name" 
              type="text" 
              value={formData.fname} 
              onChange={handleChange} 
              placeholder="Enter first name" 
              required 
              name="fname" 
            />
            <InputField 
              label="Last Name" 
              type="text" 
              value={formData.lname} 
              onChange={handleChange} 
              placeholder="Enter last name" 
              required 
              name="lname" 
            />
            <InputField 
              label="Email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter email" 
              required 
              name="email" 
            />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
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
    </DashboardLayout>
  );
};

export default EditProfile;