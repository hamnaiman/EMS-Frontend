// src/layouts/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen md:flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
};

export default AdminLayout;
