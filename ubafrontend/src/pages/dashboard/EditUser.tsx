import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { users } from '../../types/userdata';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, handleChange, setFormData } = useForm({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const user = users.find(u => u.id === Number(id));
    if (user) {
      setFormData({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        password: user.password
      });
    } else {
      showToast.error('User not found');
      navigate('/users');
    }
  }, [id, setFormData, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userIndex = users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      setError('User not found');
      return;
    }

    // Check if email is already taken by another user
    const emailExists = users.some(u => u.email === formData.email && u.id !== Number(id));
    if (emailExists) {
      setError('Email already registered');
      showToast.error('Email already registered');
      return;
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
    };

    showToast.success('User updated successfully!');
    navigate('/users');
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="First Name"
            type="text"
            value={formData.fname}
            onChange={handleChange}
            placeholder="Enter first name"
            required
            data-testid="firstname"
            name="fname"
          />
          <InputField
            label="Last Name"
            type="text"
            value={formData.lname}
            onChange={handleChange}
            placeholder="Enter last name"
            required
            data-testid="lastname"
            name="lname"
          />
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            data-testid="email"
            name="email"
          />
          <button
            type="submit"
            className="w-1/2 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            data-testid="submit-button"
          >
            Update User
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditUser; 