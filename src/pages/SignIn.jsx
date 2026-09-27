// src/pages/SignIn.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api"; // adjust path if your api.js lives elsewhere

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/signin", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: `Welcome back, ${user?.name || "there"}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(user.role === "admin" ? "/dashboard" : "/employee-home");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid credentials or something went wrong.";
      setError(message);
      Swal.fire({ icon: "error", title: "Sign In Failed", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 relative">
      {/* Top Header */}
      <div className="w-full h-20 sm:h-24 bg-gray-800 shadow-md fixed top-0 left-0 z-10 flex items-center justify-center px-4">
        <Link
          to="/"
          className="text-white text-lg sm:text-2xl font-bold tracking-wide text-center hover:text-gray-200 transition"
        >
          Employee Management System
        </Link>
      </div>

      {/* Centered Form */}
      <div className="flex justify-center items-center min-h-screen pt-28 sm:pt-32 pb-10 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-300 hover:shadow-gray-500">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
            Sign In
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-gray-800 hover:text-gray-600 font-medium transition"
            >
              Sign Up
            </Link>
          </div>

          <div className="mt-3 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;