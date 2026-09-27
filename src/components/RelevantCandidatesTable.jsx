// src/components/RelevantCandidatesTable.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileExcel, FaFilePdf, FaEnvelope, FaEdit } from "react-icons/fa";
import EmailTemplateModal, { getSavedTemplate } from "./EmailTemplateModal";

const fillTemplate = (template, candidate) => {
  const replace = (str) =>
    str
      .replaceAll("{{name}}", candidate.name || "there")
      .replaceAll("{{role}}", candidate.jobRole?.title || "the role")
      .replaceAll("{{score}}", `${candidate.matchScore ?? ""}`);

  return { subject: replace(template.subject), body: replace(template.body) };
};

const RelevantCandidatesTable = ({ candidates }) => {
  const [templateOpen, setTemplateOpen] = useState(false);

  const handleEmail = (candidate) => {
    if (!candidate.email) return;
    const template = getSavedTemplate();
    const { subject, body } = fillTemplate(template, candidate);
    const mailto = `mailto:${candidate.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const exportToExcel = () => {
    const rows = candidates.map((c) => ({
      Name: c.name || c.fileName,
      Email: c.email || "",
      Phone: c.phone || "",
      Role: c.jobRole?.title || "",
      "Match Score": c.matchScore,
      Skills: (c.skills || []).join(", "),
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Relevant Candidates");
    XLSX.writeFile(workbook, "relevant-candidates.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relevant Candidates", 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [["Name", "Email", "Role", "Score", "Skills"]],
      body: candidates.map((c) => [
        c.name || c.fileName,
        c.email || "—",
        c.jobRole?.title || "—",
        `${c.matchScore}%`,
        (c.skills || []).slice(0, 4).join(", "),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [17, 24, 39] }, // gray-900
    });

    doc.save("relevant-candidates.pdf");
  };

  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Relevant candidates across your open roles
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplateOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md transition"
          >
            <FaEdit /> Edit email template
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md transition"
          >
            <FaFileExcel /> Excel
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md transition"
          >
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Skills</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{c.name || c.fileName}</div>
                  <div className="text-xs text-gray-500">{c.email || "No email found"}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.jobRole?.title || "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                    {c.matchScore}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.skills || []).slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleEmail(c)}
                    disabled={!c.email}
                    title={c.email ? "Send interview email" : "No email found for this candidate"}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-md transition"
                  >
                    <FaEnvelope /> Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmailTemplateModal open={templateOpen} onClose={() => setTemplateOpen(false)} />
    </div>
  );
};

export default RelevantCandidatesTable;