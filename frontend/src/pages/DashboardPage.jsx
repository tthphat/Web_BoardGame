import React from 'react';
import GameMatrix from '../components/Game/GameMatrix';
import GameControls from '../components/Game/GameControls';

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      
      {/* CASE MÁY GAME: Vỏ nhựa màu kem, bo góc, đổ bóng nổi khối */}
      <div className="bg-[#e8e4d9] dark:bg-[#4a4a4a] p-6 md:p-10 rounded-[30px] border-b-[8px] border-r-[8px] border-black/20 shadow-2xl relative max-w-2xl w-full flex flex-col items-center">
        
        {/* Logo máy game */}
        <div className="w-full flex justify-between items-center mb-4 px-2">
            <h2 className="font-mono font-black italic text-gray-400 text-lg md:text-2xl tracking-tighter">
                <span className="text-blue-700 dark:text-blue-400">NINTENDO</span> 
                <span className="text-red-600 ml-2">GAMEBOY</span>
            </h2>
            {/* Đèn báo pin */}
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_5px_red] animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Battery</span>
            </div>
        </div>

        {/* MÀN HÌNH: Khung viền xám bao quanh Matrix */}
        <div className="bg-gray-500 p-4 md:p-6 rounded-t-[20px] rounded-bl-[40px] rounded-br-[20px] shadow-inner w-full flex justify-center border-4 border-gray-600">
             {/* Component Bảng đèn */}
             <GameMatrix />
        </div>

        {/* THƯƠNG HIỆU */}
        <div className="my-4 italic font-serif font-bold text-blue-800/40 text-lg">
            Stereo Sound
        </div>

        {/* CÁC NÚT BẤM */}
        <GameControls />

      </div>

    </div>
  );
};

export default DashboardPage;