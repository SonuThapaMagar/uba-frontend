import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';
import { useQuery } from '@apollo/client';
import { GET_USER, GET_CURRENT_USER } from '../../utils/queries';

const UserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    variables: { id },
    onError: (err) => {
      setError(err.message);
      showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
    }
  });

  const { data: currentUserData } = useQuery(GET_CURRENT_USER);
  const role = currentUserData?.currentUser?.role || 'USER';

  if (userLoading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </DashboardLayout>
  );

  if (userError) return (
    <DashboardLayout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{userError.message}</span>
      </div>
    </DashboardLayout>
  );

  if (!userData?.user) {
    showToast.error(TOAST_MESSAGES.USER_NOT_FOUND);
    navigate('/users');
    return null;
  }

  const user = userData.user;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="space-y-4">
          <p><strong>Name:</strong> {user.fname} {user.lname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
            <div className="space-x-2">
              <button
                onClick={() => navigate(`/users/editUser/${user.id}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Edit
              </button>
              {role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => navigate(`/users/deleteUser/${user.id}`)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails;