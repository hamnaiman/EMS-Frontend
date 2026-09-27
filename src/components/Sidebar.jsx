// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/manage-employees", label: "Manage Employees", icon: FaUsers },
  { to: "/recruitment", label: "Recruitment (AI)", icon: FaFileAlt },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-white">
          E
        </div>
        <span className="font-semibold text-gray-800 text-lg">EMS Admin</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active =
            location.pathname === to || location.pathname.startsWith(`${to}/`);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="text-base" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center gap-2 px-1 mb-3 text-sm text-gray-500">
          <FaUserCircle className="text-lg" />
          <span className="truncate">{user?.name || "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">
            E
          </div>
          <span className="font-semibold">EMS Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-md hover:bg-white/10"
        >
          <FaBars />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-gray-200 text-gray-700 flex-col p-5 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 max-w-[80%] bg-white text-gray-700 flex flex-col p-5 h-full shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
