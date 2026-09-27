// src/pages/JobRoleDetail.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import api from "../api/api";
import CandidateTable from "../components/CandidateTable";

const JobRoleDetail = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [role, setRole] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, candidatesRes] = await Promise.all([
        api.get("/recruitment/roles"),
        api.get(`/recruitment/roles/${id}/candidates`),
      ]);
      const found = (rolesRes.data || []).find((r) => r._id === id);
      setRole(found || null);
      setCandidates(candidatesRes.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load this job role.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type === "application/pdf");
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("cvs", file));

    setScreening(true);
    setError("");
    try {
      await api.post(`/recruitment/roles/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: "success",
        title: "Screening complete",
        text: `${selectedFiles.length} CV(s) processed.`,
        timer: 1600,
        showConfirmButton: false,
      });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (err) {
      setError(err.response?.data?.msg || "Screening failed. Please try again.");
    } finally {
      setScreening(false);
    }
  };

  const handleStatusChange = async (candidateId, status) => {
    setCandidates((prev) => prev.map((c) => (c._id === candidateId ? { ...c, status } : c)));
    try {
      await api.patch(`/recruitment/candidates/${candidateId}`, { status });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Could not update status" });
      fetchData();
    }
  };

  const handleDeleteCandidate = async (candidate) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Remove ${candidate.name || candidate.fileName}?`,
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/recruitment/candidates/${candidate._id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== candidate._id));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Could not remove candidate" });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (!role) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Job role not found."}
        <div className="mt-4">
          <Link to="/recruitment" className="text-gray-700 underline">
            Back to Recruitment
          </Link>
        </div>
      </div>
    );
  }

  const sorted = [...candidates].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Link
        to="/recruitment"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-4"
      >
        <FaArrowLeft /> Back to Recruitment
      </Link>

      <div className="bg-gray-800 text-white rounded-2xl shadow-md p-5 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{role.title}</h2>
        <p className="text-gray-300 text-sm mt-2 whitespace-pre-line">{role.requirements}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Upload CVs</h3>
        <p className="text-sm text-gray-500 mb-4">
          PDF only, up to 20 files at once. Each CV is scored against the requirements above.
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
            className="flex-1 text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 file:text-sm file:font-medium hover:file:bg-gray-200 transition"
          />
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || screening}
            className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-md hover:bg-gray-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <FaUpload />
            {screening
              ? "Screening..."
              : `Screen ${selectedFiles.length || ""} CV${selectedFiles.length === 1 ? "" : "s"}`}
          </button>
        </div>
        {screening && (
          <p className="text-xs text-gray-400 mt-2">
            This can take a minute for larger batches — each CV is read and scored one by one.
          </p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">
          Candidates {candidates.length > 0 && `(${candidates.length})`}
        </h3>
        <CandidateTable
          candidates={sorted}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteCandidate}
        />
      </div>
    </div>
  );
};

export default JobRoleDetail;
