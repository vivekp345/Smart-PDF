import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0f1216] text-[#EAE0D5]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      {/* ml-64 pushes content to the right to make room for the fixed sidebar */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {/* This is where the child routes (Summary, History, etc.) render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;