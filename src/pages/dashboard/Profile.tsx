import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_USER, UPDATE_PROFILE } from '../../utils/queries';
import { PencilIcon } from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
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
      navigate('/profile'); // Return to view mode after saving
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

  const user = data?.currentUser;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          {!isSuperAdmin && (
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
        <div className="flex items-center space-x-6 mb-8">
          <img
            className="h-24 w-24 rounded-full"
            src={`https://ui-avatars.com/api/?name=${user?.fname}+${user?.lname}&background=6366f1&color=fff&size=128`}
            alt="User avatar"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {user?.fname} {user?.lname}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">Role: {user?.role}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">First Name</h4>
            <p className="mt-1 text-gray-900">{user?.fname}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
            <p className="mt-1 text-gray-900">{user?.lname}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Account Status</h4>
            <p className="mt-1">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;