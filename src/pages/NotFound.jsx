// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center px-4">
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
      <p className="text-6xl font-bold text-gray-800">404</p>
      <p className="text-gray-500 mt-2 mb-6">This page doesn't exist.</p>
      <Link
        to="/"
        className="inline-block bg-gray-800 text-white px-5 py-2.5 rounded-md hover:bg-gray-700 transition"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
