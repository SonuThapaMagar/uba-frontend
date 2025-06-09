import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, DELETE_USER } from '../../utils/queries';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/dashboardLayout';
import { showToast } from '../../utils/toast';
import { TOAST_MESSAGES } from '../../constants/constant';

interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
}

const USERS_PER_PAGE = 5;

const UsersList: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    // ensures always get fresh data
    fetchPolicy: 'network-only' 
  });
  
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      showToast.success(TOAST_MESSAGES.USER_DELETED);
      // Refetch after deletion
      refetch(); 
    },
    onError: (error) => {
      showToast.error(TOAST_MESSAGES.USER_DELETE_ERROR);
      console.error('Error deleting user:', error);
    }
  });

  // State for search, sort, filter, and pagination
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterDomain, setFilterDomain] = useState('');
  const [page, setPage] = useState(1);

  // Extract unique email domains for filtering
  const emailDomains = useMemo(() => {
    if (!data?.users) return [] as string[];
    const domains = Array.from(new Set(data.users.map((u: User) => u.email.split('@')[1])));
    return domains.filter((d): d is string => typeof d === 'string');
  }, [data]);

  // Filter, search, and sort users
  const filteredUsers = useMemo(() => {
    let users = data?.users || [];
    if (search) {
      users = users.filter((u: User) =>
        `${u.fname} ${u.lname}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Filter by email domain
    if (filterDomain) {
      users = users.filter((u: User) => u.email.endsWith(`@${filterDomain}`));
    }
    // Sort
    users = users.slice().sort((a: User, b: User) => {
      let aValue = sortBy === 'name' ? `${a.fname} ${a.lname}` : a.email;
      let bValue = sortBy === 'name' ? `${b.fname} ${b.lname}` : b.email;
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    return users;
  }, [data, search, sortBy, sortOrder, filterDomain]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  // Handlers
  const handleSort = (field: 'name' | 'email') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDomain(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) return (
    <DashboardLayout>
      <div className="p-4">Loading...</div>
    </DashboardLayout>
  );
  
  if (error) return (
    <DashboardLayout>
      <div className="p-4 text-red-500">Error: {error.message}</div>
    </DashboardLayout>
  );

  console.log('Users data:', data); 

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
              onChange={handleSearchChange}
              className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={filterDomain}
              onChange={handleFilterChange}
              className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Domains</option>
              {emailDomains.map((domain) =>
                typeof domain === 'string' ? (
                  <option key={domain} value={domain}>{domain}</option>
                ) : null
              )}
            </select>
            <Link
              to="/users/createUser"
              className="bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create New User
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('email')}
                  >
                    Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  paginatedUsers.map((user: User) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.fname} {user.lname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <Link
                          to={`/users/editUser/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/users/deleteUser/${user.id}`}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
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