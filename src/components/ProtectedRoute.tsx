import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../utils/queries';
import { showToast } from '../utils/toast';
import { TOAST_MESSAGES } from '../constants/constant';
import { getCurrentRole, getToken, removeToken, validateRoleAndToken } from '../utils/auth';

interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles = [], children }) => {
  const location = useLocation();
  const currentRole = getCurrentRole();
  const token = getToken();

  // If no token or role is present, redirect to login
  if (!token || !currentRole) {
    showToast.error(TOAST_MESSAGES.SESSION_EXPIRED);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const { loading, error, data } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
    onError: () => {
      removeToken();
      showToast.error(TOAST_MESSAGES.SESSION_EXPIRED);
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data?.currentUser) {
    removeToken();
    showToast.error(TOAST_MESSAGES.SESSION_EXPIRED);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userRole = data.currentUser.role;

  // Validate that the current role matches the user's role
  if (!validateRoleAndToken(userRole)) {
    removeToken();
    showToast.error(TOAST_MESSAGES.SESSION_EXPIRED);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If roles array is empty, allow all authenticated users
  if (roles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (!roles.includes(userRole)) {
    showToast.error(TOAST_MESSAGES.ACCESS_DENIED);
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;