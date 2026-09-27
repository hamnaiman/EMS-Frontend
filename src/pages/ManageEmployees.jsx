// src/pages/ManageEmployees.jsx
import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { FaPlus, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../api/api";
import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";

const currentUser = JSON.parse(localStorage.getItem("user") || "null");

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = useCallback(async (page = 1, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/employees", {
        params: { page, limit: 10, search: searchTerm },
      });
      setEmployees(res.data.employees || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(1, "");
  }, [fetchEmployees]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees(1, search);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchEmployees(newPage, search);
  };

  const openAddForm = () => {
    setFormMode("add");
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const openEditForm = (employee) => {
    setFormMode("edit");
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = async (employee) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete ${employee.name}?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/employees/${employee._id}`);
      Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
      fetchEmployees(pagination.page, search);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Could not delete",
        text: err.response?.data?.msg || "Please try again.",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Employees</h2>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} employee{pagination.total === 1 ? "" : "s"} total
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-md hover:bg-gray-700 transition text-sm font-medium"
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <form onSubmit={handleSearchSubmit} className="mb-5 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or department"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center py-14 text-gray-500">Loading employees...</div>
        ) : error ? (
          <div className="text-center py-14 text-red-500">{error}</div>
        ) : (
          <>
            <EmployeeList
              employees={employees}
              currentUserId={currentUser?.id}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EmployeeForm
        open={formOpen}
        mode={formMode}
        initialData={selectedEmployee}
        targetId={selectedEmployee?._id}
        onClose={() => setFormOpen(false)}
        onSuccess={() => fetchEmployees(pagination.page, search)}
      />
    </div>
  );
};

export default ManageEmployees;
