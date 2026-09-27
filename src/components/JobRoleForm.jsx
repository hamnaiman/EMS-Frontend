// src/components/JobRoleForm.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api";
import { FaTimes } from "react-icons/fa";

const JobRoleForm = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !requirements.trim()) {
      setError("Both title and requirements are needed — the AI matches CVs against this text.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/recruitment/roles", { title, requirements });
      Swal.fire({ icon: "success", title: "Job role created", timer: 1200, showConfirmButton: false });
      setTitle("");
      setRequirements("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <FaTimes />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">New Job Role</h3>
        <p className="text-sm text-gray-500 mb-5">
          Describe the role clearly — the AI screens every uploaded CV against this text.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="e.g. Senior React Developer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Requirements &amp; Description
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition resize-none"
              placeholder="e.g. 3+ years React & Node.js, experience with MongoDB, strong communication skills, based in Karachi..."
              required
            />
          </div>

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
              {saving ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobRoleForm;
