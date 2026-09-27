// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShieldAlt,
  FaSearch,
  FaChartLine,
  FaLock,
  FaMagic,
} from "react-icons/fa";

const features = [
  {
    icon: FaMagic,
    title: "AI-powered CV screening",
    text: "Upload 10–20 resumes at once. AI scores, ranks and summarizes every candidate against your job requirements in minutes, not hours.",
  },
  {
    icon: FaUsers,
    title: "One employee directory",
    text: "Every profile, role, department and status lives in a single searchable place — no more scattered spreadsheets.",
  },
  {
    icon: FaShieldAlt,
    title: "Role-based access",
    text: "Admins manage the whole team. Employees see and edit only their own profile. Nothing more, nothing less.",
  },
  {
    icon: FaLock,
    title: "Secure by default",
    text: "JWT authentication, hashed passwords, rate-limited login and validated input on every single request.",
  },
  {
    icon: FaSearch,
    title: "Search that keeps up",
    text: "Find anyone by name, email or department in seconds, even as your team grows past a hundred people.",
  },
  {
    icon: FaChartLine,
    title: "A dashboard worth checking",
    text: "Headcount, admin/employee split and recently added accounts, at a glance, the moment you sign in.",
  },
];

const stats = [
  { value: "20", label: "resumes screened per batch" },
  { value: "<2 min", label: "average screening time" },
  { value: "100%", label: "of profiles in one place" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav */}
      <header className="bg-gray-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-gray-800">
              E
            </div>
            <span className="text-white font-bold text-lg tracking-wide">EMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="text-sm font-medium text-gray-200 hover:text-white transition px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Hiring and HR, run from one calm dashboard
          </h1>
          <p className="mt-4 text-gray-300 text-base max-w-2xl mx-auto leading-relaxed">
            EMS screens resumes with AI, keeps every employee record in one place, and gives
            admins and staff exactly the access they need.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/signin"
              className="w-full sm:w-auto border border-gray-500 hover:border-gray-300 text-gray-100 px-6 py-3 rounded-md font-medium transition"
            >
              Sign In
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg mx-auto border-t border-white/10 pt-6">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
                <div className="mt-1 text-xs text-gray-400 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Everything your team needs
          </h2>
          <p className="text-gray-500 mt-2">Built for small teams and growing companies alike.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Your team is worth organizing properly
          </h2>
          <p className="text-gray-300 mt-3">
            Set up your workspace in minutes — no credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-block mt-6 bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium transition"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} EMS — Employee Management System</span>
          <span>All employee data stays private to your organization.</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;