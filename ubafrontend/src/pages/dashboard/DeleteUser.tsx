import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import { showToast } from '../../utils/toast';
import { users } from '../../types/userdata';

const DeleteUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const foundUser = users.find(u => u.id === Number(id));
    if (foundUser) {
      setUser(foundUser);
    } else {
      showToast.error('User not found');
      navigate('/dashboard/users');
    }
  }, [id, navigate]);

  const handleDelete = () => {
    const userIndex = users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      setError('User not found');
      return;
    }

    // Remove user from the array
    users.splice(userIndex, 1);
    showToast.success('User deleted successfully!');
    navigate('/dashboard/users');
  };

  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete User</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the following user?
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">Name: {user.fname} {user.lname}</p>
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              data-testid="delete-button"
            >
              Delete User
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              data-testid="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeleteUser; 