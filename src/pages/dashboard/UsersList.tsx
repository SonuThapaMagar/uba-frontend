import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS, GET_CURRENT_USER } from "../../utils/queries";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboardLayout";

interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const USERS_PER_PAGE = 5;

const UsersList: React.FC = () => {
  const { data: userData } = useQuery(GET_CURRENT_USER);
  const role = userData?.currentUser?.role || "USER";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
  });

  // State for search, sort, filter, and pagination
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDomain, setFilterDomain] = useState("");
  const [page, setPage] = useState(1);

  // Extract unique email domains for filtering
  const emailDomains = useMemo(() => {
    if (!data?.users) return [] as string[];
    const domains = Array.from(
      new Set(data.users.map((u: User) => u.email.split("@")[1]))
    );
    return domains.filter((d): d is string => typeof d === "string");
  }, [data]);

  // Filter, search, and sort users
  const filteredUsers = useMemo(() => {
    let users = data?.users || [];
    if (search) {
      users = users.filter(
        (u: User) =>
          `${u.fname} ${u.lname}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterDomain) {
      users = users.filter((u: User) => u.email.endsWith(`@${filterDomain}`));
    }
    users = users.slice().sort((a: User, b: User) => {
      let aValue = sortBy === "name" ? `${a.fname} ${a.lname}` : a.email;
      let bValue = sortBy === "name" ? `${b.fname} ${b.lname}` : b.email;
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    return users;
  }, [data, search, sortBy, sortOrder, filterDomain]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-4">Loading...</div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="p-4 text-red-500">Error: {error.message}</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Users List</h2>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Domains</option>
              {emailDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            {isSuperAdmin && (
              <Link
                to="/users/createUser"
                className="bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create New User
              </Link>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => {
                      setSortBy("name");
                      setSortOrder(
                        sortBy === "name" && sortOrder === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => {
                      setSortBy("email");
                      setSortOrder(
                        sortBy === "email" && sortOrder === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
                    Email{" "}
                    {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user: User) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.fname} {user.lname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "SUPER_ADMIN"
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
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        {user.role !== "SUPER_ADMIN" && (isSuperAdmin || (isAdmin && user.role === "USER")) && (
                          <Link
                            to={`/users/edit/${user.id}`}
                            className="text-indigo-600 hover:text-indigo-900 ml-4"
                          >
                            Edit
                          </Link>
                        )}
                        {isSuperAdmin && user.role !== "SUPER_ADMIN" && (
                          <Link
                            to={`/users/deleteUser/${user.id}`}
                            className="text-red-600 hover:text-red-900 ml-4"
                          >
                            Delete
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersList;