// src/components/EmployeeForm.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api";
import { FaTimes } from "react-icons/fa";

const emptyForm = {
  name: "",
  email: "",
  position: "",
  department: "",
  password: "",
  role: "employee",
  isActive: true,
};

// mode: "add"   -> admin creating a new employee/admin account
//       "edit"  -> admin editing an existing employee (role + active status editable)
//       "self"  -> the logged-in user editing their own profile (no role/status/password)
const EmployeeForm = ({ open, mode = "add", initialData, targetId, onClose, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setForm({
        name: initialData?.name || "",
        email: initialData?.email || "",
        position: initialData?.position || "",
        department: initialData?.department || "",
        password: "",
        role: initialData?.role || "employee",
        isActive: initialData?.isActive ?? true,
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    if (mode === "add" && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "add") {
        await api.post("/employees", {
          name: form.name,
          email: form.email,
          position: form.position,
          department: form.department,
          password: form.password,
          role: form.role,
        });
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          position: form.position,
          department: form.department,
        };
        if (mode === "edit") {
          payload.role = form.role;
          payload.isActive = form.isActive;
        }
        await api.put(`/employees/${targetId}`, payload);
      }

      Swal.fire({
        icon: "success",
        title: mode === "add" ? "Employee added" : "Changes saved",
        timer: 1400,
        showConfirmButton: false,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err.response?.data?.msg || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const title =
    mode === "add" ? "Add Employee" : mode === "edit" ? "Edit Employee" : "Edit My Profile";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <FaTimes />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">{title}</h3>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="e.g. Engineering"
              />
            </div>
          </div>

          {mode === "add" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Min. 6 characters"
                required
              />
            </div>
          )}

          {(mode === "add" || mode === "edit") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-white"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {mode === "edit" && (
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-400"
                  />
                  Active account
                </label>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
