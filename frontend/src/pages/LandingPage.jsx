import React, { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fingerprint, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

// 🚀 IMPORTS UNCOMMENTED (Ensure these paths match your actual folder structure)
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";

const LandingPage = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🚀 RTK QUERY HOOK UNCOMMENTED
  const [login, { isLoading }] = useLoginMutation();

  // Local State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      const { accessToken, user } = response.data;

      // Save user and token to Redux store
      dispatch(setCredentials({ accessToken, user }));

      // 🚀 UPDATE THIS LINE: Use replace: true
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // 5. Handle errors (e.g., 401 Invalid email or password)
      setErrorMsg(
        err?.data?.message ||
          err.message ||
          "Failed to login. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff6b00]"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 flex flex-col items-center text-center z-10">
        {/* Brand Icon Area */}
        <div className="w-16 h-16 bg-[#ff6b00] rounded-2xl flex items-center justify-center mb-6 rotate-3 shadow-lg shadow-orange-200 transition-transform hover:rotate-0 duration-300">
          <Fingerprint size={32} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#0a0a0a] tracking-tight mb-2">
          Infringement <span className="text-[#ff6b00]">Detection</span>
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to access your claims analysis.
        </p>

        {/* Error Message Display */}
        {errorMsg && (
          <div className="w-full bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 text-left border border-red-100 animate-pulse">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 focus:border-[#ff6b00] transition-colors"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 focus:border-[#ff6b00] transition-colors"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full bg-[#0a0a0a] text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-[#1a1a1a] hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <Loader2 size={22} className="animate-spin text-[#ff6b00]" />
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 text-[#ff6b00]"
                />
              </>
            )}
          </button>
        </form>

        {/* Trust Indicators */}
        <div className="mt-10 pt-6 border-t border-gray-50 w-full flex items-center justify-center gap-4 text-gray-400">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-[#ff6b00]" />
            Encrypted
          </div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <div className="text-[11px] font-semibold uppercase tracking-widest">
            Secure Entry
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-400 text-xs font-medium">
        &copy; {new Date().getFullYear()} Infringement Detection. All rights
        reserved.
      </p>
    </div>
  );
});

export default LandingPage;
