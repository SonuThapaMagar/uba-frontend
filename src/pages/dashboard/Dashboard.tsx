import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_USERS } from '../../utils/queries';
import DashboardLayout from '../../layouts/dashboardLayout';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';

interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
}

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USERS, {
    fetchPolicy: 'network-only'
  });

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    </DashboardLayout>
  );

  const users: User[] = data?.users || [];
  const previewUsers = users.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
          <Link
            to="/users"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            View All Users
          </Link>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.fname} {user.lname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;