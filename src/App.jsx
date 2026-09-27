import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ManageEmployees from "./pages/ManageEmployees";
import Recruitment from "./pages/Recruitment";
import JobRoleDetail from "./pages/JobRoleDetail";
import EmployeeHome from "./pages/EmployeeHome";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-employees"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <ManageEmployees />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruitment"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Recruitment />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruitment/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <JobRoleDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Employee only */}
        <Route
          path="/employee-home"
          element={
            <ProtectedRoute role="employee">
              <EmployeeHome />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
