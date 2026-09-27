// src/components/EmailTemplateModal.jsx
import React, { useEffect, useState } from "react";

export const DEFAULT_TEMPLATE = {
  subject: "Interview Invitation – {{role}} at [Your Company]",
  body: `Hi {{name}},

Thank you for applying for the {{role}} position. Based on our initial screening, we'd like to invite you for an interview.

Could you please share your availability for a call this week?

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Company]`,
};

const STORAGE_KEY = "interviewEmailTemplate";

export const getSavedTemplate = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TEMPLATE;
  } catch {
    return DEFAULT_TEMPLATE;
  }
};

const EmailTemplateModal = ({ open, onClose, onSave }) => {
  const [subject, setSubject] = useState(DEFAULT_TEMPLATE.subject);
  const [body, setBody] = useState(DEFAULT_TEMPLATE.body);

  useEffect(() => {
    if (open) {
      const saved = getSavedTemplate();
      setSubject(saved.subject);
      setBody(saved.body);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    const template = { subject, body };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
    onSave?.(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Interview call email template</h3>
        <p className="text-sm text-gray-500 mb-4">
          Use <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{"{{name}}"}</code>,{" "}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{"{{role}}"}</code>, and{" "}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{"{{score}}"}</code> — they'll
          be filled in per candidate.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm font-mono"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
          >
            Save template
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateModal;