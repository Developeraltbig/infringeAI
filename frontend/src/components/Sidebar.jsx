import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Crown,
  PanelLeft,
  X,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";

import logo from "../assets/whiteLogo.png";
import { toggleSidebar } from "../features/slice/analysisSlice";
import { selectCurrentUser, logOut } from "../features/auth/authSlice";
import { apiSlice } from "../features/api/apiSlice";
import { useGetProjectsQuery } from "../features/api/projectApiSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import UserProfileDropdown from "./UserProfileDropdown";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileAreaRef = useRef(null);

  const { isSidebarOpen } = useSelector((state) => state.analysis);
  const user = useSelector(selectCurrentUser);

  const { data: projectsData } = useGetProjectsQuery();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // API Hooks
  const [logoutApi] = useLogoutMutation();

  // 🟢 Logic: Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileAreaRef.current &&
        !profileAreaRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 Logic: Sign out (Server + Client Cleanup)
  const handleSignOut = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Server logout failed, clearing local state anyway", err);
    } finally {
      // Reset RTK Query cache
      dispatch(apiSlice.util.resetApiState());
      // Clear Redux & Storage
      dispatch(logOut());
      localStorage.clear();
      sessionStorage.clear();
      setIsProfileOpen(false);
      setIsLoggingOut(false);
      navigate("/");
    }
  }, [dispatch, logoutApi, navigate]);

  // 🟢 Logic: Regex cleaning for Recent Analysis
  const recentProjects = useMemo(() => {
    if (!projectsData?.projects) return [];
    return projectsData.projects
      .map((item) => ({
        ...item,
        displayId: item.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A",
        displayDate: item.createdAt?.replace(/T.*/, "") || "N/A",
      }))
      .slice(0, 5);
  }, [projectsData]);

  // 🟢 Logic: Navigation helper
  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      // Only close sidebar on mobile (less than 768px)
      if (window.innerWidth < 768 && isSidebarOpen) {
        dispatch(toggleSidebar());
      }
    },
    [navigate, isSidebarOpen, dispatch],
  );

  // 🟢 Logic: Resumable Workflow View Helper
  const handleViewProject = useCallback(
    (item) => {
      if (!item || !item._id) return;
      const { _id, status } = item;

      if (status === "completed") {
        navigate(`/dashboard/report-view/${_id}`);
      } else if (status === "processing" || status === "created") {
        navigate(`/dashboard/processing/${_id}`);
      } else if (status === "failed") {
        // This is handled by the FailureModal in MyProject.jsx
        navigate(`/dashboard/projects`);
      }
    },
    [navigate],
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden transition-opacity"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* 🚀 MAIN SIDEBAR: Toggles between 280px and 80px on Desktop */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-[#0a0a0a] text-white flex flex-col transition-all duration-300 ease-in-out border-r border-white/5
          ${isSidebarOpen ? "w-[280px] translate-x-0" : "w-[80px] -translate-x-full md:translate-x-0"}
        `}
      >
        {/* LOGO HEADER */}
        <div
          className={`h-[90px] flex items-center shrink-0 ${isSidebarOpen ? "px-8 justify-between" : "justify-center"}`}
        >
          {isSidebarOpen && (
            <div className="w-[130px] animate-fade-in">
              <img src={logo} alt="Logo" />
            </div>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={`text-gray-500 hover:text-white transition-colors ${!isSidebarOpen ? "p-2" : ""}`}
          >
            {/* Show X on Mobile when open, otherwise show PanelLeft */}
            {isSidebarOpen ? <X size={20} className="md:hidden" /> : null}
            <PanelLeft
              size={22}
              className={`${isSidebarOpen ? "hidden md:block" : "block"}`}
            />
          </button>
        </div>

        {/* PRIMARY NAVIGATION */}
        <div className="flex flex-col w-full mt-4">
          <NavItem
            isActive={location.pathname === "/dashboard"}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation("/dashboard")}
            icon={<LayoutDashboard size={20} />}
            label="New Analysis"
          />
          <NavItem
            isActive={location.pathname.includes("projects")}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation("/dashboard/projects")}
            icon={<FolderOpen size={20} />}
            label="My Projects"
          />
        </div>

        {/* COLLAPSIBLE HISTORY SECTION */}
        {isSidebarOpen && (
          <div className="mt-8 flex-1 flex flex-col overflow-hidden animate-fade-in">
            <div
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="px-8 flex items-center justify-between cursor-pointer group mb-4"
            >
              <h3 className="text-[10px] uppercase tracking-[2px] text-gray-500 font-extrabold group-hover:text-gray-300 transition-colors">
                Recent Analysis
              </h3>
              <ChevronDown
                size={14}
                className={`text-gray-600 transition-transform ${isHistoryOpen ? "" : "-rotate-90"}`}
              />
            </div>
            <div
              className={`flex-1 overflow-y-auto hide-scrollbar transition-all duration-500 ${isHistoryOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {recentProjects.map((item) => (
                <div
                  key={item._id}
                  onClick={() =>
                    handleNavigation(
                      item.status === "completed"
                        ? `/dashboard/report-view/${item._id}`
                        : `/dashboard/processing/${item._id}`,
                    )
                  }
                  className="px-8 py-5 cursor-pointer group hover:bg-white/[0.02] border-b border-white/[0.04]"
                >
                  <p className="text-[14px] font-bold text-gray-100 group-hover:text-[#ff6b00] truncate mb-1">
                    {item.displayId}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                    <span
                      className={
                        item.status === "failed"
                          ? "text-red-500"
                          : "text-[#ff6b00]/80"
                      }
                    >
                      {item.mode}
                    </span>
                    <span className="opacity-30">•</span>
                    <span>{item.displayDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isSidebarOpen && <div className="flex-1" />}

        {/* UPGRADE PLAN BANNER */}
        {isSidebarOpen && (
          <div className="mx-4 mb-8 p-6 bg-[#0e1117] border border-white/5 rounded-[24px] flex flex-col gap-6 shadow-xl animate-fade-in">
            {/* Top Row: Credits Count + Shield Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-white text-xl font-black tracking-tight">
                  40/50
                </span>
                <span className="text-gray-400 text-sm font-bold">
                  Credits Left
                </span>
              </div>

              {/* The Shield Icon Box */}
              <div className="w-10 h-10 bg-[#1a1410] rounded-2xl flex items-center justify-center border border-white/5">
                <ShieldCheck
                  className="text-[#ff6b00]"
                  size={20}
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* 📊 The Glowing Progress Bar */}
            <div className="w-full h-2.5 bg-[#1a1f26] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                // style={{ width: `${Math.min(percentage, 100)}%` }}
                style={{ width: "90%" }}
              />
            </div>
          </div>
        )}

        {/* PROFILE SECTION */}
        <div
          className={`relative border-t border-white/5 py-3 bg-[#0a0a0a] z-[70] ${isSidebarOpen ? "px-4" : "px-0"}`}
          ref={profileAreaRef}
        >
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 mb-4 animate-scale-up">
              <UserProfileDropdown
                user={user}
                onLogout={handleSignOut}
                isLoggingOut={isLoggingOut}
              />
            </div>
          )}
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 p-2 rounded-2xl cursor-pointer hover:bg-white/5 transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <div className="w-11 h-11 rounded-full bg-[#f47b20] border-2 border-[#1a1a1a] flex items-center justify-center text-white font-bold text-lg uppercase shadow-lg shrink-0 transition-colors">
              {user?.name?.charAt(0) || "U"}
            </div>
            {isSidebarOpen && (
              <>
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-[15px] font-bold text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    Free Plan
                  </p>
                </div>
                {isProfileOpen ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronUp size={16} className="text-gray-500" />
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ isActive, isSidebarOpen, onClick, icon, label }) => (
  <div
    onClick={onClick}
    className={`flex items-center h-[56px] cursor-pointer transition-all 
      ${isActive ? "bg-[#1c2431] text-white border-l-4 border-[#ff6b00]" : "text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"} 
      ${!isSidebarOpen ? "justify-center px-0 w-12 mx-auto" : "px-8"}`}
  >
    <div className={isActive ? "text-[#ff6b00]" : "text-gray-400"}>{icon}</div>
    {isSidebarOpen && (
      <span className="ml-4 text-[14px] font-bold tracking-tight animate-fade-in">
        {label}
      </span>
    )}
  </div>
);

export default React.memo(Sidebar);
