import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/common/InputField";
import { useForm } from "../../hooks/useForm";
import { showToast } from "../../utils/toast";
import { TOAST_MESSAGES } from "../../constants/constant";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CURRENT_USER, UPDATE_PROFILE } from "../../utils/queries";

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { formData, handleChange, setFormData } = useForm({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { loading, error: queryError, data } = useQuery(GET_CURRENT_USER, {
    onCompleted: (data) => {
      if (data?.currentUser) {
        setFormData({
          fname: data.currentUser.fname,
          lname: data.currentUser.lname,
          email: data.currentUser.email,
          password: '',
        });
      }
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    },
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      showToast.success(TOAST_MESSAGES.USER_UPDATED);
      navigate('/profile');
    },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fname || !formData.lname || !formData.email || !formData.password) {
      setError('All fields are required');
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
      password: formData.password.trim(),
      role: undefined
    };
    try {
      await updateProfile({ variables: { input } });
    } catch (err) {
      setError('Failed to update profile');
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
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={() => navigate('/profile')}
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
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
            name="password"
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
  );
};

export default EditProfile;