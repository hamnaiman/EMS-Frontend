// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Wrap any page with this to require login, and optionally a specific role.
// Usage: <ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (role && user.role !== role) {
    // Logged in, but wrong role — send them to their own home
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/employee-home"} replace />;
  }

  return children;
};

export default ProtectedRoute;
