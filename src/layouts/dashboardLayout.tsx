import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../utils/queries';
import {
  HomeIcon,
  UserPlusIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { showToast } from '../utils/toast';
import { TOAST_MESSAGES } from '../constants/constant';
import { removeToken, getCurrentRole } from '../utils/auth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  // Determine user role
  const role = getCurrentRole() || 'USER';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN';

  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
      { name: 'Profile', icon: UserCircleIcon, path: '/profile' },
    ];

    if (isSuperAdmin) {
      return [
        ...commonItems,
        { name: 'User Management', icon: UserGroupIcon, path: '/users' },
        { name: 'Signup Requests', icon: UserPlusIcon, path: '/signup-requests' },
      ];
    } else if (isAdmin) {
      return [
        ...commonItems,
        { name: 'User Management', icon: UserGroupIcon, path: '/users' },
      ];
    }

    return commonItems; // Normal user
  };

  const menuItems = getMenuItems();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    removeToken();
    showToast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
    navigate('/login', { replace: true });
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white lg:hidden"
      >
        {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b">
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold text-indigo-600">Dashboard</h1>
            <span className="text-xs text-gray-500 mt-1">
              {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'} Panel
            </span>
          </div>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
                  isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="h-16 flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${userData?.currentUser?.fname}+${userData?.currentUser?.lname}&background=6366f1&color=fff`}
                    alt="User avatar"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {userData?.currentUser?.fname} {userData?.currentUser?.lname}
                  </span>
                  {isSuperAdmin && (
                    <span className="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                      Super Admin
                    </span>
                  )}
                  {isAdmin && !isSuperAdmin && (
                    <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                      Admin
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;