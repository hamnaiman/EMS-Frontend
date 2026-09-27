// src/pages/Recruitment.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus, FaUsers, FaTrash, FaArrowRight, FaSearch } from "react-icons/fa";
import api from "../api/api";
import JobRoleForm from "../components/JobRoleForm";
import RelevantCandidatesTable from "../components/RelevantCandidatesTable";

const Recruitment = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const [topCandidates, setTopCandidates] = useState([]);
  const [topLoading, setTopLoading] = useState(true);

  const [roleSearch, setRoleSearch] = useState("");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/recruitment/roles");
      setRoles(res.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load job roles.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCandidates = async () => {
    setTopLoading(true);
    try {
      const res = await api.get("/recruitment/candidates/relevant");
      setTopCandidates(res.data || []);
    } catch (err) {
      // Non-critical section — fail quietly and just show nothing.
      setTopCandidates([]);
    } finally {
      setTopLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchTopCandidates();
  }, []);

  const handleDelete = async (role) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete "${role.title}"?`,
      text: "This will also remove all screened candidates for this role.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/recruitment/roles/${role._id}`);
      fetchRoles();
      fetchTopCandidates();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Could not delete", text: err.response?.data?.msg || "" });
    }
  };

  const filteredRoles = roles.filter((role) => {
    const q = roleSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      role.title.toLowerCase().includes(q) ||
      (role.requirements || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Recruitment Screening</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a role, upload CVs, and let AI rank candidates by fit.
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-md hover:bg-gray-800 transition text-sm font-medium"
        >
          <FaPlus /> New Job Role
        </button>
      </div>

      {/* Auto-generated relevant candidates */}
      {!topLoading && <RelevantCandidatesTable candidates={topCandidates} />}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Job roles</h3>
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
            placeholder="Search job roles..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-14 text-gray-500">Loading job roles...</div>
      ) : error ? (
        <div className="text-center py-14 text-red-500">{error}</div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
          No job roles yet. Create one to start screening CVs with AI.
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
          No job roles match "{roleSearch}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <div
              key={role._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{role.title}</h3>
                <button
                  onClick={() => handleDelete(role)}
                  aria-label="Delete role"
                  className="text-gray-300 hover:text-red-500 transition shrink-0"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3 flex-1 mb-4">
                {role.requirements}
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <FaUsers /> {role.candidateCount || 0} candidate
                  {role.candidateCount === 1 ? "" : "s"}
                </span>
                <Link
                  to={`/recruitment/${role._id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Open <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobRoleForm open={formOpen} onClose={() => setFormOpen(false)} onSuccess={() => { fetchRoles(); fetchTopCandidates(); }} />
    </div>
  );
};

export default Recruitment;