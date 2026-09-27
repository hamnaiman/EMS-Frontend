// src/pages/EmployeeHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaEdit, FaBriefcase, FaBuilding, FaCircle } from "react-icons/fa";
import api from "../api/api";
import EmployeeForm from "../components/EmployeeForm";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await api.get("/employees/me");
      setEmployee(res.data.employee);
    } catch (err) {
      setError("Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-400 text-gray-700">
        Loading...
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-400 text-red-500">
        {error || "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400">
      <div className="w-full bg-gray-800 shadow-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <h1 className="text-white text-lg sm:text-xl font-bold tracking-wide">
          Employee Management System
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <div className="bg-gray-800 text-white py-6 px-6 sm:px-8 rounded-2xl shadow-md mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Welcome, {employee.name}!</h2>
          <p className="mt-2 text-gray-300 capitalize">Role: {employee.role}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">My Profile</h3>
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
            >
              <FaEdit /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <FaBriefcase className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Position</p>
                <p className="text-gray-800 font-medium">{employee.position || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaBuilding className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                <p className="text-gray-800 font-medium">{employee.department || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCircle
                className={`mt-1.5 text-[10px] ${
                  employee.isActive ? "text-green-500" : "text-red-500"
                }`}
              />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                <p className="text-gray-800 font-medium">
                  {employee.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCircle className="mt-1.5 text-[10px] text-gray-300" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-gray-800 font-medium">{employee.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmployeeForm
        open={editOpen}
        mode="self"
        initialData={employee}
        targetId={employee._id}
        onClose={() => setEditOpen(false)}
        onSuccess={loadProfile}
      />
    </div>
  );
};

export default EmployeeHome;
