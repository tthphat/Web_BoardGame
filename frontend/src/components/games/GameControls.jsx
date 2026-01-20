import React from 'react';
import { ChevronLeft, ChevronRight, CornerDownLeft, Reply, HelpCircle } from 'lucide-react';

// Nhận thêm props onLeft, onRight, onHelp...
const GameControls = ({ onLeft, onRight, onBack, onEnter, onHelp }) => {
    
  const GameButton = ({ label, icon, color = "gray", onClick }) => {
    const baseStyle = "w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 transition-all select-none cursor-pointer";
    const colorStyles = {
        gray: "bg-gray-300 border-gray-500 active:bg-gray-400 text-gray-800",
        red: "bg-red-500 border-red-700 active:bg-red-600 text-white",
        blue: "bg-blue-500 border-blue-700 active:bg-blue-600 text-white",
        yellow: "bg-yellow-500 border-yellow-700 active:bg-yellow-600 text-white",
    };
    return (
        <div className="flex flex-col items-center gap-1">
            <button 
                className={`${baseStyle} ${colorStyles[color]} shadow-lg`}
                onClick={onClick} // Gắn sự kiện click
            >
                {icon}
            </button>
            <span className="font-mono text-[10px] font-bold uppercase text-gray-500 tracking-wider">{label}</span>
        </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-4 p-3 bg-gray-300 dark:bg-gray-600 rounded-xl border-2 border-gray-400 shadow-inner">
        {/* Gắn hàm onLeft, onRight vào nút */}
        <GameButton label="Left" icon={<ChevronLeft size={28} strokeWidth={3} />} color="gray" onClick={onLeft} />
        <GameButton label="Right" icon={<ChevronRight size={28} strokeWidth={3} />} color="gray" onClick={onRight} />
      </div>

      <div className="flex gap-4">
        <GameButton label="Back" icon={<Reply size={24} strokeWidth={3} />} color="red" onClick={onBack} />
        <GameButton label="Enter" icon={<CornerDownLeft size={24} strokeWidth={3} />} color="blue" onClick={onEnter} />
        <GameButton label="Help" icon={<HelpCircle size={24} strokeWidth={3} />} color="yellow" onClick={onHelp} />
      </div>
    </div>
  );
};

export default GameControls;