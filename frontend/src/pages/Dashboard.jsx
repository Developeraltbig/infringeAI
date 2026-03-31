import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { toggleSidebar } from '../features/slice/analysisSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex h-screen w-full bg-[#faf9f6] overflow-hidden font-sans">
      {/* Sidebar remains constant */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button onClick={() => dispatch(toggleSidebar())} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-medium text-lg text-gray-800">Infringe</span>
        </div>

        {/* Dynamic Page Content injected here by React Router */}
        <div className="flex-1 px-4 py-8 md:py-12 flex flex-col w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;