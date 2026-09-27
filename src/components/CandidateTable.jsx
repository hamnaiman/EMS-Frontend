// src/components/CandidateTable.jsx
import React from "react";
import { FaTrash } from "react-icons/fa";

const scoreColor = (score) => {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-400";
};

const statusStyles = {
  pending: "bg-gray-100 text-gray-700",
  shortlisted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  error: "bg-yellow-100 text-yellow-700",
};

const CandidateTable = ({ candidates, onStatusChange, onDelete }) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-14 text-gray-500">
        No CVs screened yet for this role. Upload some above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {candidates.map((c) => (
        <div
          key={c._id}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800">
                  {c.name || c.fileName}
                </h4>
                {c.status === "error" ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles.error}`}>
                    Couldn't process
                  </span>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.relevant ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.relevant ? "Relevant" : "Not relevant"}
                  </span>
                )}
              </div>

              {c.email && <p className="text-xs text-gray-500 mb-1">{c.email}</p>}

              {c.status === "error" ? (
                <p className="text-sm text-red-500">{c.errorMessage}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">{c.summary}</p>
                  {c.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
              {c.status !== "error" && (
                <div className="flex items-center gap-2 w-28">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${scoreColor(c.matchScore)}`}
                      style={{ width: `${c.matchScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-9 text-right">
                    {c.matchScore}%
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <select
                  value={c.status}
                  onChange={(e) => onStatusChange(c._id, e.target.value)}
                  disabled={c.status === "error"}
                  className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-gray-400 ${statusStyles[c.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => onDelete(c)}
                  aria-label="Remove candidate"
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateTable;
