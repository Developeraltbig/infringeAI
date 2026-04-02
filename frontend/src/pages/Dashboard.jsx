import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { toggleSidebar } from "../features/slice/analysisSlice";
import logo from "../assets/whiteLogo.png";

const Dashboard = memo(() => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.analysis.isSidebarOpen);

  const handleToggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return (
    <div className="flex h-screen w-full bg-[#faf9f6] overflow-hidden font-sans">
      {/* 1. SIDEBAR COMPONENT */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE HEADER (Matches Patsero Screenshot) */}
        <div className="md:hidden flex items-center h-[64px] px-6 bg-[#000000] border-b border-white/10 shrink-0 z-30">
          <button
            onClick={handleToggle}
            className="text-white p-1 -ml-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className=" w-[100px] ml-5">
            <img src={logo} alt="Logo" />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
});

export default Dashboard;
