// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaUserShield, FaUserCheck, FaArrowRight } from "react-icons/fa";
import api from "../api/api";

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${accent}`}>
      <Icon />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/employees", { params: { page: 1, limit: 100 } });
        setEmployees(res.data.employees || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = employees.length;
  const admins = employees.filter((e) => e.role === "admin").length;
  const active = employees.filter((e) => e.isActive).length;
  const recent = [...employees]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="bg-gray-800 text-white px-6 py-5 rounded-2xl shadow-md mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold">Welcome back, {user?.name || "Admin"}</h1>
        <p className="text-gray-300 text-sm mt-1">Here's what's happening across your team.</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={FaUsers}
          label="Total Accounts"
          value={loading ? "—" : total}
          accent="bg-gray-800 text-white"
        />
        <StatCard
          icon={FaUserShield}
          label="Admins"
          value={loading ? "—" : admins}
          accent="bg-gray-200 text-gray-700"
        />
        <StatCard
          icon={FaUserCheck}
          label="Active Accounts"
          value={loading ? "—" : active}
          accent="bg-green-100 text-green-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recently Added</h3>
          <Link
            to="/manage-employees"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
          >
            Manage all <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No employees yet. Add your first one from Manage Employees.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4 hidden sm:table-cell">Email</th>
                  <th className="text-left py-2 pr-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((emp) => (
                  <tr key={emp._id}>
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{emp.name}</td>
                    <td className="py-2.5 pr-4 text-gray-600 hidden sm:table-cell">{emp.email}</td>
                    <td className="py-2.5 pr-4 capitalize text-gray-600">{emp.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
