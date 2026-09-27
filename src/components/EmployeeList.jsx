// src/components/EmployeeList.jsx
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const RoleBadge = ({ role }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
      role === "admin" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
    }`}
  >
    {role}
  </span>
);

const StatusBadge = ({ isActive }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const EmployeeList = ({ employees, currentUserId, onEdit, onDelete }) => {
  if (employees.length === 0) {
    return (
      <div className="text-center py-14 text-gray-500">
        No employees found. Try a different search or add a new employee.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left hidden sm:table-cell">Email</th>
            <th className="py-3 px-4 text-left hidden md:table-cell">Position</th>
            <th className="py-3 px-4 text-left hidden lg:table-cell">Department</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left hidden sm:table-cell">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((emp) => (
            <tr key={emp._id} className="hover:bg-gray-50 transition">
              <td className="py-3 px-4 font-medium text-gray-800">
                {emp.name}
                <div className="text-xs text-gray-400 sm:hidden">{emp.email}</div>
              </td>
              <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{emp.email}</td>
              <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                {emp.position || "—"}
              </td>
              <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">
                {emp.department || "—"}
              </td>
              <td className="py-3 px-4">
                <RoleBadge role={emp.role || "employee"} />
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <StatusBadge isActive={emp.isActive} />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(emp)}
                    aria-label={`Edit ${emp.name}`}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(emp)}
                    disabled={emp._id === currentUserId}
                    title={emp._id === currentUserId ? "You cannot delete your own account" : "Delete"}
                    aria-label={`Delete ${emp.name}`}
                    className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
