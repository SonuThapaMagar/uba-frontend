import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateUser from "../pages/dashboard/CreateUser";
import EditUser from '../pages/dashboard/EditUser';
import DeleteUser from '../pages/dashboard/DeleteUser';
import UsersList from '../pages/dashboard/UsersList';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/users/createUser" element={<CreateUser />} />
      <Route path="/users/editUser/:id" element={<EditUser />} />
      <Route path="/users/deleteUser/:id" element={<DeleteUser />} />
      <Route path="/logout" element={<Login />} />
    </Routes>
  )
}

export default AppRoutes
