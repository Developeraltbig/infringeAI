// src/pages/LandingPage.jsx
import React from "react";
// import { useNavigate } from "react-router-dom"; // Uncomment if you are routing to a separate local login page

const LandingPage = () => {
  // const navigate = useNavigate();

  const handleLoginClick = () => {
    // 🚀 ADD YOUR LOGIN LOGIC HERE

    // Option 1: If you are redirecting to a Central Auth Server (since you mentioned centralAuthUrl earlier)
    // window.location.href = "http://localhost:3000/user-auth/login?redirect=your-app-url";

    // Option 2: If you have a separate local login route (e.g., /login)
    // navigate('/login');

    // Option 3: If you are opening a Login Modal, dispatch a Redux action to open it here.

    console.log("Login button clicked! Redirecting to auth...");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* Main Card Container */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* Lock Icon (Visual indicator for authentication) */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome to Our Software
        </h2>

        <p className="text-base text-gray-500">
          You are currently not verified or your session has expired. Please log
          in to securely access the Dashboard and Claims Analysis.
        </p>

        {/* Login Button */}
        <div className="pt-4">
          <button
            onClick={handleLoginClick}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:-translate-y-0.5"
          >
            Log In to Continue
          </button>
        </div>
      </div>

      {/* Optional footer text */}
      <div className="mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Your Company Name. All rights
        reserved.
      </div>
    </div>
  );
};

export default LandingPage;
