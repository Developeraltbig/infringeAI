import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Menu,
  PanelLeft,
  SquarePen,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import { toggleSidebar } from "../features/slice/analysisSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen, history } = useSelector((state) => state.analysis);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Helper to close sidebar on mobile after clicking a link
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768 && isSidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Mobile Floating Menu Button (Only visible on small screens when sidebar is closed) */}
      {/* {!isSidebarOpen && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#0a0a0a] text-white rounded-md shadow-md focus:outline-none"
        >
          <Menu size={24} />
        </button>
      )} */}

      {/* Backdrop overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden transition-opacity"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-[#0a0a0a] text-white flex flex-col transform transition-all duration-300 ease-in-out border-r border-[#1a1a1a]
          ${
            isSidebarOpen
              ? "w-[260px] translate-x-0"
              : "w-[80px] -translate-x-full md:translate-x-0" // Hidden on mobile, Slim on desktop
          }
        `}
      >
        {/* Header / Toggle Button */}
        <div
          className={`pt-10 pb-8 flex items-center ${isSidebarOpen ? "px-8 justify-between" : "justify-center"}`}
        >
          {isSidebarOpen && (
            <h1 className="text-[32px] font-normal tracking-wide leading-none text-white whitespace-nowrap overflow-hidden">
              Infringe
            </h1>
          )}

          <button
            className="focus:outline-none text-gray-400 hover:text-white transition-colors"
            onClick={() => dispatch(toggleSidebar())}
          >
            {/* Show 'X' on mobile when open, otherwise show the Panel toggle icon */}
            {isSidebarOpen ? <X size={24} className="md:hidden" /> : null}
            <PanelLeft
              size={24}
              className={`${isSidebarOpen ? "hidden md:block" : "block"}`}
            />
          </button>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col w-full">
          {/* New Analysis Link */}
          <div
            onClick={() => handleNavigation("/dashboard")}
            className={`cursor-pointer transition-colors flex items-center overflow-hidden
              ${
                isSidebarOpen
                  ? `px-8 py-4 ${location.pathname === "/dashboard" ? "bg-[#333333]" : "hover:bg-[#1a1a1a]"}`
                  : "justify-center py-4"
              }`}
          >
            {isSidebarOpen ? (
              <span className="text-[15px] font-medium text-gray-100 whitespace-nowrap">
                New Analysis
              </span>
            ) : (
              <div
                className={`p-2 rounded-xl transition-colors ${location.pathname === "/dashboard" ? "bg-[#333333] text-white" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"}`}
              >
                <SquarePen size={22} />
              </div>
            )}
          </div>

          {/* My Project Link */}
          <div
            onClick={() => handleNavigation("/dashboard/projects")}
            className={`cursor-pointer transition-colors flex items-center border-b border-[#222] overflow-hidden
              ${
                isSidebarOpen
                  ? `px-8 py-4 justify-between ${location.pathname === "/dashboard/my-project" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]"}`
                  : "justify-center py-4"
              }`}
          >
            {isSidebarOpen ? (
              <>
                <span className="text-[15px] text-gray-200 whitespace-nowrap">
                  My Project
                </span>
                <span className="text-gray-400 text-sm font-light">
                  <ChevronRight />
                </span>
              </>
            ) : (
              <div
                className={`p-2 rounded-xl transition-colors ${location.pathname === "/dashboard/my-project" ? "bg-[#333333] text-white" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"}`}
              >
                <FolderOpen size={22} />
              </div>
            )}
          </div>
        </div>

        {/* History List (Only visible when expanded) */}
        {isSidebarOpen ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 mt-2">
            {history.map((item, index) => (
              <div
                key={item.id}
                className={`py-5 cursor-pointer group ${
                  index !== history.length - 1
                    ? "border-b border-[#222] border-dashed"
                    : ""
                }`}
              >
                <p className="text-[14px] text-gray-300 group-hover:text-white transition-colors mb-1 truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 text-[12px] text-gray-400 font-light">
                  <span>{item.type}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1" /> // Fills the empty space when collapsed
        )}

        {/* User Profile */}
        <div className="mt-auto relative">
          {/* Invisible overlay to close modal when clicking outside */}
          {isProfileMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileMenuOpen(false)}
            />
          )}

          {/* Google-Style Profile Modal */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-4 w-[230px] bg-black rounded-md shadow-xl border border-gray-200 z-50 flex flex-col items-center pt-6 pb-2 text-gray-800 cursor-default">
              {/* Large Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#00897b] flex items-center justify-center text-white text-3xl font-normal mb-3 uppercase">
                U
              </div>

              {/* User Info */}
              <div className="text-[15px] text-white font-semibold mb-0.5">
                developer altbig
              </div>
              <div className="text-[13px] text-gray-400 mb-5">
                user@gmail.com
              </div>

              <div className="w-full border-t border-gray-200"></div>

              {/* Sign Out Button */}
              <button className="w-full py-3.5 text-[14px] font-medium text-gray-400 hover:bg-gray-50 hover:text-black transition-colors">
                Sign out
              </button>

              <div className="w-full border-t border-gray-200"></div>

              {/* Footer Links */}
              <div className="w-full pt-3 pb-1 flex justify-center items-center gap-2 text-[12px] text-gray-500">
                <span className="hover:text-gray-800 cursor-pointer hover:underline">
                  Privacy Policy
                </span>
                <span>•</span>
                <span className="hover:text-gray-800 cursor-pointer hover:underline">
                  Terms of Service
                </span>
              </div>
            </div>
          )}

          {/* Clickable Profile Button (Your existing code modified slightly) */}
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center transition-colors border-t border-[#111] cursor-pointer hover:bg-[#1a1a1a] overflow-hidden
          ${isSidebarOpen ? "px-4 py-4 gap-2" : "justify-center py-6"}
        `}
          >
            <span className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-gray-700 bg-gray-800 text-gray-200 font-medium text-sm uppercase">
              U
            </span>

            {isSidebarOpen && (
              <span className="text-gray-300 text-[15px] flex items-center gap-2 whitespace-nowrap">
                User{" "}
                <span className="text-gray-500 text-sm">
                  <ChevronRight size={16} />
                </span>
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
