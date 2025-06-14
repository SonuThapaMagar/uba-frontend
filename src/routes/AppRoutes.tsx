import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/dashboard/Dashboard';
import CreateUser from '../pages/dashboard/CreateUser';
import EditUser from '../pages/dashboard/EditUser';
import DeleteUser from '../pages/dashboard/DeleteUser';
import UsersList from '../pages/dashboard/UsersList';
import SignupRequests from '../pages/dashboard/SignupRequests';
import UserDetails from '../pages/dashboard/UserDetails';
import Profile from '../pages/dashboard/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import EditProfile from '../pages/dashboard/EditProfile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'USER']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'USER']}>
            <UsersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/createUser"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/editUser/:id"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/deleteUser/:id"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <DeleteUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'USER']}>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'USER']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'USER']}>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup-requests"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <SignupRequests />
          </ProtectedRoute>
        }
      />
      <Route path="/logout" element={<Login />} />
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;