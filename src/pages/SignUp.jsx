// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api"; // adjust path if your api.js lives elsewhere

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully!",
        timer: 1800,
        showConfirmButton: false,
      });

      setName("");
      setEmail("");
      setPassword("");

      navigate("/signin");
    } catch (err) {
      if (err.response?.data?.message === "Employee already exists") {
        Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Employee already exists. Please sign in.",
        });
      } else {
        const message =
          err.response?.data?.message || "Something went wrong. Please try again later.";
        setError(message);
        Swal.fire({ icon: "error", title: "Error", text: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 relative">
      {/* Top Header */}
      <div className="w-full h-20 bg-gray-800 shadow-md fixed top-0 left-0 z-10 flex items-center justify-center px-4">
        <Link
          to="/"
          className="text-white text-lg sm:text-2xl font-bold tracking-wide text-center hover:text-gray-200 transition"
        >
          Employee Management System
        </Link>
      </div>

      {/* Centered Sign Up Form */}
      <div className="flex justify-center items-center pt-28 pb-10 px-4 min-h-screen">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-300 hover:shadow-gray-500">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
            Sign Up
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                autoComplete="new-password"
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
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link
              to="/signin"
              className="text-gray-800 hover:text-gray-600 font-medium transition"
            >
              Sign In
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

export default SignUp;