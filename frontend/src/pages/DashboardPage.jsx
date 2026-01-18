import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameMatrix from '../components/games/GameMatrix';
import GameControls from '../components/games/GameControls';
import ColorPalette from '../components/games/ColorPalette';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { useDrawing } from '../hooks/useDrawing';
import { toast } from 'sonner';
import { GAME_SCREENS, getGameConfig } from '../config/gameRegistry';

const DashboardPage = () => {
  // Danh sách các màn hình từ registry
  const screens = GAME_SCREENS;
  
  // State lưu chỉ số màn hình hiện tại
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  
  // Game state chung cho tất cả games (thay vì nhiều state riêng lẻ)
  const [gameState, setGameState] = useState({});
  
  // Hooks cho games cần quản lý ở Dashboard level
  const memoryGame = useMemoryGame();
  
  const currentScreenName = screens[currentScreenIndex];
  const currentConfig = getGameConfig(currentScreenName);
  
  // Drawing hook - cần screen name
  const drawingGame = useDrawing(isPlaying && currentScreenName === 'DRAWING');

  // Reset game state khi đổi màn
  const resetGameState = () => {
    const config = getGameConfig(screens[currentScreenIndex]);
    setGameState(config?.initialState || {});
    setIsPlaying(false);
    setScore(0);
  };

  // Hàm chuyển màn hình sang TRÁI
  const handlePrevScreen = () => {
    resetGameState();
    setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  // Hàm chuyển màn hình sang PHẢI
  const handleNextScreen = () => {
    resetGameState();
    setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
  };

  // Xử lý nút Enter (bắt đầu/reset game)
  const handleEnter = () => {
    const config = currentConfig;
    
    if (!config) {
      toast.error("Game chưa được implement!");
      return;
    }

    // Nếu game đã kết thúc và có resetGame -> reset
    if (gameState.winner && gameState.resetGame) {
      gameState.resetGame();
      setGameState({ ...config.initialState, resetGame: gameState.resetGame });
      return;
    }

    // Snake game - restart logic
    if (currentScreenName === 'SNAKE') {
      if (gameState.isGameOver && gameState.resetGame) {
        // Đã game over -> reset trực tiếp, không toggle isPlaying
        gameState.resetGame();
        setScore(0);
        setGameState(prev => ({ ...prev, isGameOver: false }));
        return;
      }
      // Chưa chơi -> bắt đầu chơi
      if (!isPlaying) {
        setIsPlaying(true);
        setScore(0);
        return;
      }
      return;
    }

    // Bắt đầu game mới
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      setGameState(config.initialState);
      
      // Memory game cần init riêng
      if (currentScreenName === 'MEMORY') {
        memoryGame.initGame();
      }
    }
  };

  // Xử lý nút Back (dừng game)
  const handleBack = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setScore(0);
      setGameState(currentConfig?.initialState || {});
    }
  };

  // Lấy text trạng thái từ registry
  const getStatusText = () => {
    if (!currentConfig) return '';
    
    // Drawing cần state từ hook
    if (currentScreenName === 'DRAWING') {
      return currentConfig.getStatusText(drawingGame, isPlaying);
    }
    
    return currentConfig.getStatusText(gameState, isPlaying);
  };

  // Callback khi game state thay đổi
  const handleGameStateUpdate = useCallback((newState) => {
    setGameState(prev => ({ ...prev, ...newState }));
  }, []);

  // Callback khi score thay đổi
  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore);
  }, []); /* GameMatrix gọi callback này liên tục. Nếu function đổi reference: 
  GameMatrix sẽ re-render lại. Không dùng useCallback sẽ không crash nhưng GameMatrix sẽ
  re-render liên tục */

  // Keyboard controls cho Snake
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Enter key cho tất cả games
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEnter();
        return;
      }

      // Arrow keys chỉ cho Snake
      if (!isPlaying || currentScreenName !== 'SNAKE' || !gameState.changeDirection) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          gameState.changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          gameState.changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          gameState.changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          gameState.changeDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentScreenName, gameState.changeDirection, handleEnter]);

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">

        <div className="flex-1 flex flex-row border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555] p-1 overflow-hidden">

          <div className="flex-1 bg-black border-2 border-t-black border-l-black border-b-white border-r-white relative flex flex-col items-center justify-center overflow-hidden p-4">

            <div className="scale-75 md:scale-100 lg:scale-110 transition-transform">
              <GameMatrix
                screen={currentScreenName}
                isPlaying={isPlaying}
                onScoreUpdate={handleScoreUpdate}
                onCardClick={memoryGame.handleCardClick}
                activeGameState={memoryGame}
                botEnabled={true}
                onGameStateUpdate={handleGameStateUpdate}
                drawingState={drawingGame}
              />
            </div>
          </div >

          {/* CỘT PHẢI: ĐIỀU KHIỂN */}
          < div className="w-64 bg-[#c0c0c0] dark:bg-[#2d2d2d] flex flex-col border-l-2 border-l-gray-400 dark:border-l-gray-700" >
            <div className="h-12 border-b-2 border-gray-400 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600">
              <span className="text-white font-bold font-mono tracking-widest">CONTROLS</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
              {/* Hiển thị ColorPalette khi đang chơi Drawing */}
              {currentScreenName === 'DRAWING' && isPlaying ? (
                <ColorPalette
                  selectedColor={drawingGame.selectedColor}
                  isErasing={drawingGame.isErasing}
                  onColorChange={drawingGame.setColor}
                  onToggleEraser={drawingGame.toggleEraser}
                  onClear={drawingGame.clearCanvas}
                />
              ) : (
                <div className="w-full bg-black border-2 border-gray-500 p-3 text-green-500 font-mono text-sm mb-4">
                  <div className="text-center mb-2 border-b border-gray-600 pb-2">
                    <div className="text-yellow-400 font-bold">{currentConfig?.name || currentScreenName}</div>
                    <div className="text-xs text-green-400">{getStatusText()}</div>
                  </div>
                  <div className="flex justify-between">
                    <span>SCORE</span>
                    <span className="text-cyan-400">{score.toString().padStart(4, '0')}</span>
                  </div>
                </div>
              )}

              {/* Game Controls */}
              <GameControls
                onLeft={handlePrevScreen}
                onRight={handleNextScreen}
                onBack={handleBack}
                onEnter={handleEnter}
              />
            </div>
          </div >
        </div >
      </div >
    </div >
  );
};

export default DashboardPage;