import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_USERS, GET_CURRENT_USER } from "../../utils/queries";
import DashboardLayout from "../../layouts/dashboardLayout";

interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  isVerified: boolean;
}

const Dashboard: React.FC = () => {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER);
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
  });

  const role = userData?.currentUser?.role || "USER";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const isNormalUser = !isSuperAdmin && !isAdmin;

  if (userLoading || usersLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (userError || usersError) {
    return (
      <DashboardLayout>
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {userError?.message || usersError?.message}
          </span>
        </div>
      </DashboardLayout>
    );
  }

  const users = usersData?.users || [];
  const previewUsers = users.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
          {(isSuperAdmin || isAdmin) && (
            <Link
              to="/users"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              View All Users
            </Link>
          )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSuperAdmin || isAdmin ? 5 : 4}
                    className="text-center py-4 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                previewUsers.map((user: User) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.fname} {user.lname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "SUPER_ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "ADMIN"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
