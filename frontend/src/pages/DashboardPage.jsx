import React from 'react';
import GameMatrix from '../components/Game/GameMatrix';
import GameControls from '../components/Game/GameControls';

const DashboardPage = () => {
  return (
    // CONTAINER CHÍNH: h-full để lấp đầy chiều cao, overflow-hidden để CẤM CUỘN
    <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden">
      
      {/* PANEL CHÍNH: Kéo rộng ra (max-w-6xl) và dùng flex-row (ngang) */}
      <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 
          border-2 
          border-t-white border-l-white 
          border-b-black border-r-black 
          shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        
        {/* NỘI DUNG BÊN TRONG: Chia làm 2 cột Trái - Phải */}
        <div className="flex-1 flex flex-row border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555] p-1 overflow-hidden">
            
            {/* --- CỘT TRÁI: MÀN HÌNH GAME (Chiếm phần lớn) --- */}
            <div className="flex-1 bg-black border-2 border-t-black border-l-black border-b-white border-r-white relative flex flex-col items-center justify-center overflow-hidden p-4">
                 
                 

                 {/* Matrix Game */}
                 <div className="scale-75 md:scale-100 lg:scale-110 transition-transform">
                    <GameMatrix />
                 </div>

            </div>

            {/* --- CỘT PHẢI: BẢNG ĐIỀU KHIỂN (Cố định chiều rộng) --- */}
            <div className="w-64 bg-[#c0c0c0] dark:bg-[#2d2d2d] flex flex-col border-l-2 border-l-gray-400 dark:border-l-gray-700">
                
                {/* Trang trí Header cột phải */}
                <div className="h-12 border-b-2 border-gray-400 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600">
                    <span className="text-white font-bold font-mono tracking-widest">CONTROLS</span>
                </div>

                {/* Khu vực chứa nút bấm (Căn giữa dọc) */}
                <div className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
                    
                    {/* Thông số phụ */}
                    <div className="w-full bg-black border-2 border-gray-500 p-2 text-green-500 font-mono text-xs mb-4">
                        <div className="flex justify-between"><span>SCORE</span><span>0000</span></div>
                        <div className="flex justify-between"><span>HI-SC</span><span>9999</span></div>
                        <div className="flex justify-between mt-2"><span>LEVEL</span><span>01</span></div>
                    </div>

                    {/* Component Nút bấm */}
                    <GameControls />

                </div>

                {/* Footer cột phải */}
                <div className="p-2 text-center border-t-2 border-gray-400">
                     <div className="text-[10px] text-gray-500 font-mono">INSERT COIN</div>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;