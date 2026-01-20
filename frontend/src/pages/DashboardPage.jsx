import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameMatrix from '../components/games/GameMatrix';
import GameControls from '../components/games/GameControls';
import ColorPalette from '../components/games/ColorPalette';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { useDrawing } from '../hooks/useDrawing';
import { useEnabledGames } from '../hooks/useEnabledGames';
import { useGameStats } from '../hooks/useGameStats';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { getGameConfig } from '../config/gameRegistry';
import { useSettings } from '../contexts/SettingsContext';
import SaveLoadButtons from '../components/games/SaveLoadButtons';

const DashboardPage = () => {
  // Fetch enabled games from backend
  const { enabledScreens, loading: gamesLoading } = useEnabledGames();

  // Auth context for checking login status
  const { user } = useAuth();

  // Danh sách các màn hình từ backend (filtered)
  const screens = enabledScreens;

  // Ref to GameMatrix for saving state
  const gameMatrixRef = useRef(null);

  // State lưu chỉ số màn hình hiện tại
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameEndHandled, setGameEndHandled] = useState(false);

  // Game state chung cho tất cả games (thay vì nhiều state riêng lẻ)
  const [gameState, setGameState] = useState({});

  // Game config - cần định nghĩa trước các hooks dùng currentScreenName
  const currentScreenName = screens[currentScreenIndex] || 'HEART';
  const currentConfig = getGameConfig(currentScreenName);

  // Hooks cho games cần quản lý ở Dashboard level
  const memoryGame = useMemoryGame(isPlaying && currentScreenName === 'MEMORY');

  // Game stats hook
  const { recordGameEnd, fetchGameStats, currentStats } = useGameStats(currentConfig?.slug, !!user);

  // Drawing hook - cần screen name
  const drawingGame = useDrawing(isPlaying && currentScreenName === 'DRAWING');

  // Effect to handle game end and record stats
  useEffect(() => {
    // Skip if not playing, already handled, or no config
    if (!isPlaying || gameEndHandled || !currentConfig) return;

    const handleGameEnd = async (result) => {
      console.log(`[GameStats] 🎮 Game End Detected: ${currentScreenName}`, result);
      setGameEndHandled(true);

      console.log(`[GameStats] 📤 Calling API to record stats...`);
      const response = await recordGameEnd(result);
      console.log(`[GameStats] 📥 API Response:`, response);

      if (response?.stats?.newBestScore) {
        console.log(`[GameStats] 🏆 NEW HIGH SCORE! Best: ${response.stats.bestScore}`);
        toast.success('🎉 New High Score!', {
          description: `Best: ${response.stats.bestScore}`
        });
      } else if (response?.stats?.newBestTime) {
        console.log(`[GameStats] ⏱️ NEW BEST TIME! Best: ${response.stats.bestTimeSeconds}s`);
        toast.success('⏱️ New Best Time!', {
          description: `Best: ${response.stats.bestTimeSeconds}s`
        });
      }
    };

    // Check for game end conditions
    // Snake / Match3 game over
    if (['SNAKE', 'MATCH3'].includes(currentScreenName) && gameState.isGameOver) {
      console.log(`[GameStats] 🐍/💎 ${currentScreenName} Game Over detected! Score: ${score}`);
      handleGameEnd({ score, won: false });
    }

    // Memory game - check if gameState is 'finished' (all cards matched) or 'timeout'
    if (currentScreenName === 'MEMORY' && (memoryGame.gameState === 'finished' || memoryGame.gameState === 'timeout')) {
      const won = memoryGame.gameState === 'finished';
      const timeUsed = 30 - memoryGame.timeLeft; // TIME_LIMIT is 30 seconds
      console.log(`[GameStats] 🃏 Memory Game ended! State: ${memoryGame.gameState}, Score: ${memoryGame.score}, Time: ${timeUsed}s`);
      handleGameEnd({
        score: memoryGame.score,
        won,
        timeSeconds: timeUsed
      });
    }

    // TicTacToe/Caro - winner determined
    if (['TICTACTOE', 'CARO4', 'CARO5'].includes(currentScreenName) && gameState.winner) {
      const won = gameState.winner === 'BLUE' || gameState.winner === 'X';
      console.log(`[GameStats] ⭕ ${currentScreenName} ended! Winner: ${gameState.winner}, Player won: ${won}`);
      handleGameEnd({
        score: won ? 1 : 0,
        won
      });
    }

    // Note: Match3 is a continuous game without a defined "game over" state
    // Stats would need to be recorded differently (e.g., on manual exit or time limit)
  }, [isPlaying, gameState, memoryGame.gameState, memoryGame.score, memoryGame.timeLeft, currentScreenName, score, currentConfig, recordGameEnd, gameEndHandled]);

  // Sync memoryGame score với score state
  useEffect(() => {
    if (currentScreenName === 'MEMORY' && isPlaying) {
      setScore(memoryGame.score);
    }
  }, [memoryGame.score, currentScreenName, isPlaying]);

  // Fetch stats from DB when game screen changes (for Caro/TicTacToe win count)
  useEffect(() => {
    if (user && currentConfig?.slug && ['tic-tac-toe', 'caro-4', 'caro-5'].includes(currentConfig.slug)) {
      fetchGameStats();
    }
  }, [currentConfig?.slug, user, fetchGameStats]);

  // Reset game state khi đổi màn
  const resetGameState = () => {
    const config = getGameConfig(screens[currentScreenIndex]);
    setGameState(config?.initialState || {});
    setIsPlaying(false);
    setScore(0);
    setGameEndHandled(false);
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

    // HEART is just a display screen, not a playable game
    if (currentScreenName === 'HEART') {
      return;
    }

    if (!config) {
      toast.error("Game chưa được implement!");
      return;
    }

    // Nếu game đã kết thúc và có resetGame -> reset
    if (gameState.winner && gameState.resetGame) {
      gameState.resetGame();
      setGameState({ ...config.initialState, resetGame: gameState.resetGame });
      setGameEndHandled(false);
      return;
    }

    // Snake game - restart logic
    if (currentScreenName === 'SNAKE') {
      if (gameState.isGameOver && gameState.resetGame) {
        // Đã game over -> reset trực tiếp, không toggle isPlaying
        gameState.resetGame();
        setScore(0);
        setGameState(prev => ({ ...prev, isGameOver: false }));
        setGameEndHandled(false);
        return;
      }
      // Chưa chơi -> bắt đầu chơi
      if (!isPlaying) {
        setIsPlaying(true);
        setScore(0);
        setGameEndHandled(false);
        return;
      }
      return;
    }

    // Bắt đầu game mới
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      setGameState(config.initialState);
      setGameEndHandled(false);

      // Memory game auto-inits via useEffect when isPlaying becomes true
    }
  };

  // Xử lý nút Back (dừng game)
  const handleBack = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setScore(0);
      setGameState(currentConfig?.initialState || {});
      
      // Memory game auto-resets via useEffect when isPlaying becomes false
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

  // Callback khi game state thay đổi (từ wrappers)
  const handleGameStateUpdate = useCallback((newState) => {
    setGameState(prev => ({ ...prev, ...newState }));
    // Update score nếu có từ TicTacToe/Caro wrappers
    if (newState.score !== undefined) {
      setScore(newState.score);
    }
  }, []);

  // Callback khi score thay đổi
  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore);
  }, []); /* GameMatrix gọi callback này liên tục. Nếu function đổi reference:
      GameMatrix sẽ re-render lại. Không dùng useCallback sẽ không crash nhưng GameMatrix sẽ
      re-render liên tục */

  // Keyboard controls cho Snake
  const { controls } = useSettings();

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

      const keys = {
        UP: controls === 'WASD' ? ['w', 'W'] : ['ArrowUp'],
        DOWN: controls === 'WASD' ? ['s', 'S'] : ['ArrowDown'],
        LEFT: controls === 'WASD' ? ['a', 'A'] : ['ArrowLeft'],
        RIGHT: controls === 'WASD' ? ['d', 'D'] : ['ArrowRight'],
      };

      // Combine default arrow keys if using ARROWS (to allow both standard and w/s/a/d if user prefers fallback? No, request implies switch)
      // Actually request says: "mặc định đang là các phím mũi tên ... tôi muốn người dùng có thể cài đặt thay đổi mặc định này"
      // If WASD is selected, Arrow keys should probably NOT work, or both can work? Usually exclusive or additive.
      // Let's implement strict switching as per "change default". 
      // Wait, standard games usually allow Arrows + WASD always? 
      // "cho phép cài đặt thay đổi" implies the user selects one. 
      // If user selects WASD, I will check ONLY WASD (and maybe arrows as backup if that's standard UX, but let's stick to strict for now to demonstrate the feature).

      if (keys.UP.includes(e.key)) {
        e.preventDefault();
        gameState.changeDirection('UP');
      } else if (keys.DOWN.includes(e.key)) {
        e.preventDefault();
        gameState.changeDirection('DOWN');
      } else if (keys.LEFT.includes(e.key)) {
        e.preventDefault();
        gameState.changeDirection('LEFT');
      } else if (keys.RIGHT.includes(e.key)) {
        e.preventDefault();
        gameState.changeDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentScreenName, gameState.changeDirection, handleEnter, controls]);

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">

        <div className="flex-1 flex flex-row border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555] p-1 overflow-hidden">

          <div className="flex-1 bg-black border-2 border-t-black border-l-black border-b-white border-r-white relative flex flex-col items-center justify-center overflow-hidden p-4">
            <GameMatrix
              screen={currentScreenName}
              isPlaying={isPlaying}
              onScoreUpdate={handleScoreUpdate}
              onCardClick={memoryGame.handleCardClick}
              activeGameState={memoryGame}
              botEnabled={true}
              onGameStateUpdate={handleGameStateUpdate}
              drawingState={drawingGame}
              ref={gameMatrixRef}
            />
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
                    {/* Caro/TicTacToe hiển thị WINS từ DB, các game khác hiển thị SCORE */}
                    {['TICTACTOE', 'CARO4', 'CARO5'].includes(currentScreenName) ? (
                      <>
                        <span>WINS</span>
                        <span className="text-cyan-400">
                          {/* Hiển thị total_wins từ DB, sau game end sẽ refresh qua currentStats */}
                          {(currentStats?.total_wins || 0).toString().padStart(4, '0')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>SCORE</span>
                        <span className="text-cyan-400">{score.toString().padStart(4, '0')}</span>
                      </>
                    )}
                  </div>
                  {/* Timer for Memory and Match3 games */}
                  {['MEMORY', 'MATCH3'].includes(currentScreenName) && isPlaying && (
                    <div className="flex justify-between mt-1">
                      <span>TIME</span>
                      <span className={`font-bold ${(currentScreenName === 'MEMORY' ? memoryGame.timeLeft : (gameState.timeLeft || 0)) <= 10
                        ? 'text-red-500 animate-pulse'
                        : (currentScreenName === 'MEMORY' ? memoryGame.timeLeft : (gameState.timeLeft || 0)) <= 30
                          ? 'text-yellow-400'
                          : 'text-cyan-400'
                        }`}>
                        {currentScreenName === 'MEMORY' ? memoryGame.timeLeft : (gameState.timeLeft || 60)}s
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Save/Load Logic - Part of feature/SaveGame */}
              {user && isPlaying && (
                <SaveLoadButtons
                  gameMatrixRef={gameMatrixRef}
                  screens={screens}
                  currentScreenIndex={currentScreenIndex}
                  gameEndHandled={gameEndHandled}
                />
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