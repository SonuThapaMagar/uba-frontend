import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SIGNUP_REQUESTS, APPROVE_USER, DECLINE_USER } from '../../utils/queries';
import DashboardLayout from '../../layouts/dashboardLayout';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';

const SignupRequests = () => {
  const { loading, error, data, refetch } = useQuery(GET_SIGNUP_REQUESTS, {
    fetchPolicy: 'network-only'
  });

  const [approveUser] = useMutation(APPROVE_USER, {
    onCompleted: () => {
      showToast.success('User approved successfully');
      refetch();
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to approve user');
    }
  });

  const [declineUser] = useMutation(DECLINE_USER, {
    onCompleted: () => {
      showToast.success('User declined successfully');
      refetch();
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to decline user');
    }
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

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Signup Requests</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.signupRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No pending signup requests
                    </td>
                  </tr>
                ) : (
                  data?.signupRequests.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.fname} {user.lname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => approveUser({ variables: { id: user.id } })}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineUser({ variables: { id: user.id } })}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SignupRequests;