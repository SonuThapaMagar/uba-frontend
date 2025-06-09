import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateUser from "../pages/dashboard/CreateUser";
import EditUser from '../pages/dashboard/EditUser';
import DeleteUser from '../pages/dashboard/DeleteUser';
import UsersList from '../pages/dashboard/UsersList';
// import UsersList from '../pages/dashboard/UsersList';

const AppRoutes = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Login />}
      />
      <Route
        path="/users"
        element={token ? <UsersList /> : <Login />}
      />
      <Route
        path="/users/createUser"
        element={token ? <CreateUser /> : <Login />}
      />
      <Route
        path="/users/editUser/:id"
        element={token ? <EditUser /> : <Login />}
      />
      <Route
        path="/users/deleteUser/:id"
        element={token ? <DeleteUser /> : <Login />}
      />
      <Route path="/logout" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;