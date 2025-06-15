import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/dashboard/Dashboard';
import CreateUser from '../pages/dashboard/CreateUser';
import EditUser from '../pages/dashboard/EditUser';
import DeleteUser from '../pages/dashboard/DeleteUser';
import UserList from '../pages/dashboard/UsersList';
import SignupRequests from '../pages/dashboard/SignupRequests';
import UserDetails from '../pages/dashboard/UserDetails';
import Profile from '../pages/dashboard/Profile';
import EditProfile from '../pages/dashboard/EditProfile';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/dashboardLayout';

// Layout wrapper component
const DashboardLayoutWrapper = () => {
  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'USER']}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes with dashboard layout */}
      <Route element={<DashboardLayoutWrapper />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/createUser" element={<CreateUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/users/deleteUser/:id" element={<DeleteUser />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/signup-requests" element={<SignupRequests />} />
      </Route>

      <Route path="/logout" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;