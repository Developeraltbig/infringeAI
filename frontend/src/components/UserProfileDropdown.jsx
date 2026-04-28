import React from "react";
import { Link } from "react-router-dom";
import { User, CreditCard, HelpCircle, LogOut } from "lucide-react";

export default function UserProfileDropdown({ user, onLogout, isLoggingOut }) {
  const FrontendUrl = import.meta.env.VITE_PATSERO_FRONTEND_URL;

  return (
    <div
      className="w-[250px] bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden p-2 animate-scale-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-1 py-2">
        <div className="text-[17px] font-bold text-[#1a202c] leading-tight">
          {user?.name || "User"}
        </div>
        <div className="text-[14px] text-gray-400 mt-1 truncate">
          {user?.email || "user@gmail.com"}
        </div>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={(e) => {
              e.preventDefault();
              onLogout(); // This triggers the logout logic in the parent
            }}
            className="flex items-center gap-4 w-full px-4 py-4 text-[16px] font-medium text-[#f56565] hover:bg-red-50 rounded-2xl transition-colors group disabled:opacity-50"
          >
            <LogOut size={20} className="text-[#f56565]" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
