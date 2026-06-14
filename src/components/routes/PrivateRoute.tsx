
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// PrivateRoute component protects routes that require authentication
const PrivateRoute: React.FC = () => {
  // Retrieve token from localStorage (indicates if user is logged in)
  const token = localStorage.getItem("token");

  // If token exists, render the nested routes (Outlet)
  // Otherwise, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
