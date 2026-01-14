import React from 'react';
import { ChevronLeft, ChevronRight, CornerDownLeft, Reply } from 'lucide-react';

const GameButton = ({ label, icon, color = "gray" }) => {
  // Style nút bấm vật lý (nhựa cứng)
  const baseStyle = "w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 transition-all select-none";
  
  const colorStyles = {
    gray: "bg-gray-300 border-gray-500 active:bg-gray-400 text-gray-800",
    red: "bg-red-500 border-red-700 active:bg-red-600 text-white",
    blue: "bg-blue-500 border-blue-700 active:bg-blue-600 text-white",
    yellow: "bg-yellow-400 border-yellow-600 active:bg-yellow-500 text-black",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button className={`${baseStyle} ${colorStyles[color]} shadow-lg`}>
        {icon}
      </button>
      <span className="font-mono text-xs font-bold uppercase text-gray-500 tracking-wider">{label}</span>
    </div>
  );
};

const GameControls = () => {
  return (
    <div className="flex items-center justify-between w-full max-w-md px-4 mt-6">
      
      {/* Nhóm trái: Điều hướng */}
      <div className="flex gap-4">
        <GameButton label="Left" icon={<ChevronLeft size={32} strokeWidth={3} />} color="gray" />
        <GameButton label="Right" icon={<ChevronRight size={32} strokeWidth={3} />} color="gray" />
      </div>

      {/* Trang trí: Khe loa ở giữa (giống Gameboy) */}
      <div className="hidden md:flex flex-col gap-1 mx-4 rotate-12 opacity-50">
         <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
         <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
         <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
      </div>

      {/* Nhóm phải: Hành động */}
      <div className="flex gap-4">
        <GameButton label="Back" icon={<Reply size={28} strokeWidth={3} />} color="red" />
        <GameButton label="Enter" icon={<CornerDownLeft size={28} strokeWidth={3} />} color="blue" />
      </div>

    </div>
  );
};

export default GameControls;