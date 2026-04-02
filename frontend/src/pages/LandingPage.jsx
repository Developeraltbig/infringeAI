// // src/pages/LandingPage.jsx
// import React from "react";
// // import { useNavigate } from "react-router-dom"; // Uncomment if you are routing to a separate local login page

// const LandingPage = () => {
//   // const navigate = useNavigate();

//   const handleLoginClick = () => {
//     // 🚀 ADD YOUR LOGIN LOGIC HERE

//     // Option 1: If you are redirecting to a Central Auth Server (since you mentioned centralAuthUrl earlier)
//     // window.location.href = "http://localhost:3000/user-auth/login?redirect=your-app-url";

//     // Option 2: If you have a separate local login route (e.g., /login)
//     // navigate('/login');

//     // Option 3: If you are opening a Login Modal, dispatch a Redux action to open it here.

//     console.log("Login button clicked! Redirecting to auth...");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
//       {/* Main Card Container */}
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
//         {/* Lock Icon (Visual indicator for authentication) */}
//         <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
//           <svg
//             className="h-8 w-8 text-blue-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//             />
//           </svg>
//         </div>

//         {/* Text Content */}
//         <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//           Welcome to Our Software
//         </h2>

//         <p className="text-base text-gray-500">
//           You are currently not verified or your session has expired. Please log
//           in to securely access the Dashboard and Claims Analysis.
//         </p>

//         {/* Login Button */}
//         <div className="pt-4">
//           <button
//             onClick={handleLoginClick}
//             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:-translate-y-0.5"
//           >
//             Log In to Continue
//           </button>
//         </div>
//       </div>

//       {/* Optional footer text */}
//       <div className="mt-8 text-sm text-gray-400">
//         &copy; {new Date().getFullYear()} Your Company Name. All rights
//         reserved.
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

import React, { memo, useCallback } from "react";
import { Fingerprint, ArrowRight, ShieldCheck } from "lucide-react";

const LandingPage = memo(() => {
  // Use your environment variables for redirection
  const mainSoftwareLoginUrl = `${import.meta.env.VITE_PATSERO_FRONTEND_URL}/login`;

  const handleLoginClick = useCallback(() => {
    // 🚀 REDIRECT: Send user to the Main Software's login page
    // We pass a 'redirect' param so the Main Software knows to send them back here after login
    const currentAppUrl = window.location.origin;
    window.location.href = `${mainSoftwareLoginUrl}?redirect=${currentAppUrl}`;
  }, [mainSoftwareLoginUrl]);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff6b00]"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-30"></div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 flex flex-col items-center text-center">
        {/* Brand Icon Area */}
        <div className="w-20 h-20 bg-[#ff6b00] rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-lg shadow-orange-200 transition-transform hover:rotate-0 duration-300">
          <Fingerprint size={40} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-[#0a0a0a] tracking-tight mb-4">
          Infringe <span className="text-[#ff6b00]">Portal</span>
        </h1>

        {/* Sub-text */}
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          Unlock AI-powered patent analysis and professional claim charts.
          <span className="block mt-2 font-medium text-gray-400 text-sm italic">
            Please log in via the main platform to continue.
          </span>
        </p>

        {/* Action Button */}
        <button
          onClick={handleLoginClick}
          className="group w-full bg-[#0a0a0a] text-white py-5 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-[#1a1a1a] hover:shadow-xl active:scale-95"
        >
          Access Dashboard
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-50 w-full flex items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck size={16} className="text-[#ff6b00]" />
            Secure Entry
          </div>
          <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
          <div className="text-xs font-semibold uppercase tracking-widest">
            Sub-Part 01
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Infringe AI. All rights reserved.
      </p>
    </div>
  );
});

export default LandingPage;
