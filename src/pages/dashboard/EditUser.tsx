import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { graphQLRequest } from '../../utils/api';
import { GET_USERS } from '../../utils/queries';

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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await graphQLRequest(GET_USERS);
        if (response?.users) {
          console.log('Fetched users:', response.users); // Debug log
          console.log('Looking for user with ID:', id); // Debug log
          const foundUser = response.users.find((u: any) => u.id === id);
          console.log('Found user:', foundUser); // Debug log
          
          if (foundUser) {
            setUser(foundUser);
            setFormData({
              fname: foundUser.fname,
              lname: foundUser.lname,
              email: foundUser.email,
              password: ''
            });
          } else {
            showToast.error(TOAST_MESSAGES.USER_NOT_FOUND);
            navigate('/users');
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err); // Debug log
        setError(err instanceof Error ? err.message : String(err));
        showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
      }
    };
    fetchUser();
  }, [id, setFormData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await graphQLRequest(`
        mutation UpdateUser($id: String!, $input: SignupInput!) {
          updateUser(id: $id, input: $input) {
            id
            email
            fname
            lname
          }
        }
      `, {
        id,
        input: {
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          password: formData.password || 'dummy' // Required by SignupInput type
        }
      });
      
      if (response?.updateUser) {
        showToast.success(TOAST_MESSAGES.USER_UPDATED);
        navigate('/users');
      }
    } catch (err) {
      console.error('Error updating user:', err); // Debug log
      setError(err instanceof Error ? err.message : String(err));
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    }
  };

  if (!user) return null;

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