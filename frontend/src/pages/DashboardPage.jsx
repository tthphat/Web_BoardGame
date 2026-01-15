import React, { useState } from 'react';
import GameMatrix from '../components/games/GameMatrix';
import GameControls from '../components/games/GameControls';
import { useMemoryGame } from '../hooks/useMemoryGame';

const DashboardPage = () => {
  // Danh sách các màn hình
  const screens = ['HEART', 'SNAKE', 'CARO5', 'CARO4', 'TICTACTOE', 'MATCH3', 'MEMORY'];
  // State lưu chỉ số màn hình hiện tại (0 là HEART)
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const memoryGame = useMemoryGame();
  // Hàm chuyển màn hình sang TRÁI
  const handlePrevScreen = () => {
    setIsPlaying(false); // Reset game logic khi đổi màn
    setScore(0);
    setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  // Hàm chuyển màn hình sang PHẢI
  const handleNextScreen = () => {
    setIsPlaying(false); // Reset game logic khi đổi màn
    setScore(0);
    setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
  };

  const currentScreenName = screens[currentScreenIndex];

  const handleEnter = () => {
    if (currentScreenName === 'MATCH3') {
      setIsPlaying(true);
      setScore(0);
    } 
    else if (currentScreenName === 'MEMORY') {
      if (!isPlaying) {
        // Bắt đầu game:
        setIsPlaying(true);
        setScore(0);
        memoryGame.initGame(); // <-- QUAN TRỌNG: Tạo bộ bài mới
      }
    }
    else {
      alert("Enter pressed");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">

        <div className="flex-1 flex flex-row border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555] p-1 overflow-hidden">


          <div className="flex-1 bg-black border-2 border-t-black border-l-black border-b-white border-r-white relative flex flex-col items-center justify-center overflow-hidden p-4">
            <div className="absolute top-4 left-4 text-green-500 font-mono text-xs z-10 opacity-70">
              {/* Hiển thị tên màn hình hiện tại */}
              <div>GAME:</div>
              <div>{currentScreenName} {isPlaying ? '(PLAYING)' : ''}</div>
            </div>

            <div className="scale-75 md:scale-100 lg:scale-110 transition-transform">
              {/* Truyền tên màn hình hiện tại vào Matrix */}
              <GameMatrix
                screen={currentScreenName}
                isPlaying={isPlaying}
                onScoreUpdate={setScore}
                onCardClick={memoryGame.handleCardClick}
                activeGameState={memoryGame} 
              />
            </div>
          </div>

          {/* CỘT PHẢI: ĐIỀU KHIỂN */}
          <div className="w-64 bg-[#c0c0c0] dark:bg-[#2d2d2d] flex flex-col border-l-2 border-l-gray-400 dark:border-l-gray-700">
            <div className="h-12 border-b-2 border-gray-400 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600">
              <span className="text-white font-bold font-mono tracking-widest">CONTROLS</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
              <div className="w-full bg-black border-2 border-gray-500 p-2 text-green-500 font-mono text-xs mb-4">
                <div className="flex justify-between"><span>SCORE</span><span>{score.toString().padStart(4, '0')}</span></div>
                <div className="flex justify-between"><span>HI-SC</span><span>9999</span></div>
                <div className="flex justify-between mt-2"><span>LEVEL</span><span>01</span></div>
              </div>

              {/* Truyền hàm xử lý bấm nút vào GameControls */}
              <GameControls
                onLeft={handlePrevScreen}
                onRight={handleNextScreen}
                onBack={() => alert("Back pressed")}
                onEnter={handleEnter}
              />
            </div>

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