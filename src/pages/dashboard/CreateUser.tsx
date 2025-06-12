import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { graphQLRequest } from '../../utils/api';

const CreateUser = () => {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    fname: '',
    lname: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await graphQLRequest(`
        mutation CreateUser($input: SignupInput!) {
          createUser(input: $input) {
            id
            email
            fname
            lname
          }
        }
      `, { input: formData });
      if (response?.createUser) {
        showToast.success(TOAST_MESSAGES.USER_CREATED);
        navigate('/users');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      showToast.error(TOAST_MESSAGES.USER_CREATE_ERROR);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="First Name" type="text" value={formData.fname} onChange={handleChange} placeholder="Enter first name" required name="fname" />
            <InputField label="Last Name" type="text" value={formData.lname} onChange={handleChange} placeholder="Enter last name" required name="lname" />
            <InputField label="Email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required name="email" />
            <InputField label="Password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required name="password" />
            <InputField label="Role" type="text" value={formData.role} onChange={handleChange} placeholder="Enter role (USER/ADMIN)" required name="role" />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Create User</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default CreateUser;