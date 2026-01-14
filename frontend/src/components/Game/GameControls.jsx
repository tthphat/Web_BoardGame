import React from 'react';
import { ChevronLeft, ChevronRight, CornerDownLeft, Reply } from 'lucide-react';

const GameButton = ({ label, icon, color = "gray" }) => {
  const baseStyle = "w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 transition-all select-none";
  
  const colorStyles = {
    gray: "bg-gray-300 border-gray-500 active:bg-gray-400 text-gray-800",
    red: "bg-red-500 border-red-700 active:bg-red-600 text-white",
    blue: "bg-blue-500 border-blue-700 active:bg-blue-600 text-white",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button className={`${baseStyle} ${colorStyles[color]} shadow-lg`}>
        {icon}
      </button>
      <span className="font-mono text-[10px] font-bold uppercase text-gray-500 tracking-wider">{label}</span>
    </div>
  );
};

const GameControls = () => {
  return (
    <div className="flex flex-col gap-8 items-center">
      
      {/* Nhóm 1: Điều hướng (Left / Right) */}
      <div className="flex gap-4 p-3 bg-gray-300 dark:bg-gray-600 rounded-xl border-2 border-gray-400 shadow-inner">
        <GameButton label="Left" icon={<ChevronLeft size={28} strokeWidth={3} />} color="gray" />
        <GameButton label="Right" icon={<ChevronRight size={28} strokeWidth={3} />} color="gray" />
      </div>

      {/* Trang trí: Mũi tên chỉ hướng */}
      <div className="flex flex-col gap-1 items-center opacity-30">
          <div className="w-1 h-8 bg-black"></div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-black"></div>
      </div>

      {/* Nhóm 2: Hành động (Back / Enter) */}
      <div className="flex gap-4">
        <GameButton label="Back" icon={<Reply size={24} strokeWidth={3} />} color="red" />
        <GameButton label="Enter" icon={<CornerDownLeft size={24} strokeWidth={3} />} color="blue" />
      </div>

    </div>
  );
};

export default GameControls;