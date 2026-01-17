import React, { useState } from 'react';
import GameMatrix from '../components/games/GameMatrix';
import GameControls from '../components/games/GameControls';
import ColorPalette from '../components/games/ColorPalette';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { useDrawing } from '../hooks/useDrawing';

const DashboardPage = () => {
  // Danh sách các màn hình
  const screens = ['SNAKE', 'DRAWING', 'CARO5', 'CARO4', 'TICTACTOE', 'MATCH3', 'MEMORY'];
  // State lưu chỉ số màn hình hiện tại (0 là HEART)
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const memoryGame = useMemoryGame();
  const [ticTacToeState, setTicTacToeState] = useState({ currentPlayer: 'X', winner: null });
  const [caroState, setCaroState] = useState({ currentPlayer: 'BLUE', winner: null });
  const [caro5State, setCaro5State] = useState({ currentPlayer: 'BLUE', winner: null });

  // Hàm chuyển màn hình sang TRÁI
  const handlePrevScreen = () => {
    setIsPlaying(false); // Reset game logic khi đổi màn
    setScore(0);
    setTicTacToeState({ currentPlayer: 'X', winner: null });
    setCaroState({ currentPlayer: 'BLUE', winner: null });
    setCaro5State({ currentPlayer: 'BLUE', winner: null });
    setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  // Hàm chuyển màn hình sang PHẢI
  const handleNextScreen = () => {
    setIsPlaying(false); // Reset game logic khi đổi màn
    setScore(0);
    setTicTacToeState({ currentPlayer: 'X', winner: null });
    setCaroState({ currentPlayer: 'BLUE', winner: null });
    setCaro5State({ currentPlayer: 'BLUE', winner: null });
    setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
  };

  const currentScreenName = screens[currentScreenIndex];

  // Drawing hook - phải đặt sau currentScreenName
  const drawingGame = useDrawing(isPlaying && currentScreenName === 'DRAWING');

  const handleEnter = () => {
    if (currentScreenName === 'TICTACTOE') {
      // Nếu game đã kết thúc, reset game
      if (ticTacToeState.winner && ticTacToeState.resetGame) {
        ticTacToeState.resetGame();
        setTicTacToeState({ ...ticTacToeState, winner: null, currentPlayer: 'X' });
      } else if (!isPlaying) {
        // Bắt đầu game mới
        setIsPlaying(true);
        setTicTacToeState({ currentPlayer: 'X', winner: null, resetGame: null });
      }
    } else if (currentScreenName === 'MATCH3') {
      setIsPlaying(true);
      setScore(0);
    } else if (currentScreenName === 'MEMORY') {
      if (!isPlaying) {
        // Bắt đầu game:
        setIsPlaying(true);
        setScore(0);
        memoryGame.initGame(); // Tạo bộ bài mới
      }
    } else if (currentScreenName === 'CARO4') {
      // Nếu game đã kết thúc, reset game
      if (caroState.winner && caroState.resetGame) {
        caroState.resetGame();
        setCaroState({ ...caroState, winner: null, currentPlayer: 'BLUE' });
      } else if (!isPlaying) {
        // Bắt đầu game mới
        setIsPlaying(true);
        setCaroState({ currentPlayer: 'BLUE', winner: null, resetGame: null });
      }
    } else if (currentScreenName === 'CARO5') {
      // Nếu game đã kết thúc, reset game
      if (caro5State.winner && caro5State.resetGame) {
        caro5State.resetGame();
        setCaro5State({ ...caro5State, winner: null, currentPlayer: 'BLUE' });
      } else if (!isPlaying) {
        // Bắt đầu game mới
        setIsPlaying(true);
        setCaro5State({ currentPlayer: 'BLUE', winner: null, resetGame: null });
      }
    } else if (currentScreenName === 'DRAWING') {
      // Bắt đầu vẽ
      if (!isPlaying) {
        setIsPlaying(true);
      }
    } else {
      alert("Game chưa được implement!");
    }
  };

  const getStatusText = () => {
    if (!isPlaying) return '';
    if (currentScreenName === 'TICTACTOE') {
      if (ticTacToeState.winner === 'DRAW') return '- DRAW!';
      if (ticTacToeState.winner) return `- ${ticTacToeState.winner} WINS!`;
      return `- ${ticTacToeState.currentPlayer}'s turn`;
    }
    if (currentScreenName === 'CARO4') {
      if (caroState.winner === 'DRAW') return '- HÒA!';
      if (caroState.winner === 'BLUE') return '- XANH THẮNG!';
      if (caroState.winner === 'RED') return '- ĐỎ THẮNG!';
      return `- Lượt ${caroState.currentPlayer === 'BLUE' ? 'XANH' : 'ĐỎ'}`;
    }
    if (currentScreenName === 'CARO5') {
      if (caro5State.winner === 'DRAW') return '- HÒA!';
      if (caro5State.winner === 'BLUE') return '- XANH THẮNG!';
      if (caro5State.winner === 'RED') return '- ĐỎ THẮNG!';
      return `- Lượt ${caro5State.currentPlayer === 'BLUE' ? 'XANH' : 'ĐỎ'}`;
    }
    if (currentScreenName === 'DRAWING') {
      return `- ${drawingGame.isErasing ? 'ERASING' : drawingGame.selectedColor}`;
    }
    return '(PLAYING)';
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">

        <div className="flex-1 flex flex-row border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555] p-1 overflow-hidden">

          <div className="flex-1 bg-black border-2 border-t-black border-l-black border-b-white border-r-white relative flex flex-col items-center justify-center overflow-hidden p-4">
            <div className="absolute top-4 left-4 text-green-500 font-mono text-xs z-10 opacity-70">
              {/* Hiển thị tên màn hình hiện tại */}
              <div>GAME:</div>
              <div>{currentScreenName} {getStatusText()}</div>
            </div>

            <div className="scale-75 md:scale-100 lg:scale-110 transition-transform">
              {/* Truyền tên màn hình hiện tại vào Matrix */}
              <GameMatrix
                screen={currentScreenName}
                isPlaying={isPlaying}
                onScoreUpdate={setScore}
                onCardClick={memoryGame.handleCardClick}
                activeGameState={memoryGame}
                botEnabled={true}  // Bật bot cho TicTacToe
                onGameStateUpdate={(newState) => {
                  if (currentScreenName === 'TICTACTOE') {
                    setTicTacToeState(newState);
                  } else if (currentScreenName === 'CARO4') {
                    setCaroState(newState);
                  } else if (currentScreenName === 'CARO5') {
                    setCaro5State(newState);
                  }
                }}
                drawingState={drawingGame}
              />
            </div>
          </div>

          {/* CỘT PHẢI: ĐIỀU KHIỂN */}
          <div className="w-64 bg-[#c0c0c0] dark:bg-[#2d2d2d] flex flex-col border-l-2 border-l-gray-400 dark:border-l-gray-700">
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
                <div className="w-full bg-black border-2 border-gray-500 p-2 text-green-500 font-mono text-xs mb-4">
                  <div className="flex justify-between"><span>SCORE</span><span>{score.toString().padStart(4, '0')}</span></div>
                  <div className="flex justify-between"><span>HI-SC</span><span>9999</span></div>
                  <div className="flex justify-between mt-2"><span>LEVEL</span><span>01</span></div>
                </div>
              )}

              {/* Truyền hàm xử lý bấm nút vào GameControls */}
              <GameControls
                onLeft={handlePrevScreen}
                onRight={handleNextScreen}
                onBack={() => {
                  if (isPlaying) {
                    setIsPlaying(false);
                    setScore(0);
                    setTicTacToeState({ currentPlayer: 'X', winner: null, resetGame: null });
                    setCaroState({ currentPlayer: 'BLUE', winner: null, resetGame: null });
                  }
                }}
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