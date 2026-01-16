import React from 'react';
import { Users, Gamepad2, Activity, Server, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-[#000] dark:border-r-[#000]">
    <div className="flex items-center justify-between p-3 bg-[#e0e0e0] dark:bg-[#3d3d3d] border border-[#808080] dark:border-[#555]">
      <div>
        <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-black font-mono text-black dark:text-white">{value}</p>
      </div>
      <div className={`p-2 ${color} text-white border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#666] dark:border-r-[#666]`}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboardMock = () => {
  return (
    <div className="space-y-6 font-mono p-1">
      
      {/* 1. Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1,284" icon={<Users size={20} />} color="bg-blue-800" />
        <StatCard title="Total Plays" value="85,302" icon={<Gamepad2 size={20} />} color="bg-green-800" />
        <StatCard title="Active Now" value="342" icon={<Activity size={20} />} color="bg-red-800" />
        <StatCard title="Server Load" value="42%" icon={<Server size={20} />} color="bg-purple-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Main Chart Area (Mock) */}
        <div className="lg:col-span-2 bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black">
          <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex justify-between items-center">
            <span>TRAFFIC_ANALYSIS.EXE</span>
            <button className="px-1 bg-[#c0c0c0] text-black text-xs font-bold border border-white border-b-black border-r-black">X</button>
          </div>
          <div className="bg-white dark:bg-black p-4 h-64 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white flex items-end justify-between gap-2">
            {/* Vẽ các cột biểu đồ giả bằng CSS */}
            {[30, 45, 25, 60, 75, 50, 80, 40, 55, 70, 65, 90].map((h, i) => (
              <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                 <div 
                    style={{ height: `${h}%` }} 
                    className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-400 border border-black dark:border-white relative"
                 ></div>
                 <span className="text-[10px] text-center mt-1 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. System Alerts / Hot Games */}
        <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black flex flex-col">
            <div className="bg-[#800000] text-white px-2 py-1 text-sm font-bold">
                TOP_GAMES.TXT
            </div>
            <div className="bg-white dark:bg-black p-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white flex-1">
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center p-1 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-black dark:text-green-400">
                        <span>1. Memory Card</span>
                        <span className="font-bold">45%</span>
                    </li>
                    <li className="flex justify-between items-center p-1 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-black dark:text-green-400">
                        <span>2. Match 3</span>
                        <span className="font-bold">30%</span>
                    </li>
                    <li className="flex justify-between items-center p-1 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-black dark:text-green-400">
                        <span>3. Snake</span>
                        <span className="font-bold">15%</span>
                    </li>
                    <li className="flex justify-between items-center p-1 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-black dark:text-green-400">
                        <span>4. Caro</span>
                        <span className="font-bold">10%</span>
                    </li>
                </ul>
            </div>

            <div className="mt-4 bg-[#ffff00] border-2 border-black p-2 flex items-start gap-2">
                <AlertTriangle size={20} className="text-black shrink-0" />
                <span className="text-xs font-bold text-black leading-tight">
                    SYSTEM ALERT: Database backup overdue by 2 days. Please check config.
                </span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardMock;