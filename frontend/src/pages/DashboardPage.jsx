import { useState, useEffect, useCallback, useRef } from 'react';
import GameMatrix from '../components/games/GameMatrix';
import GameControls from '../components/games/GameControls';
import ColorPalette from '../components/games/ColorPalette';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { useDrawing } from '../hooks/useDrawing';
import { toast } from 'sonner';

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
  const [snakeState, setSnakeState] = useState({ isGameOver: false, direction: 'LEFT' });

  // Hàm chuyển màn hình sang TRÁI - Memoized
  const handlePrevScreen = useCallback(() => {
    setIsPlaying(false);
    setScore(0);
    setTicTacToeState({ currentPlayer: 'X', winner: null });
    setCaroState({ currentPlayer: 'BLUE', winner: null });
    setCaro5State({ currentPlayer: 'BLUE', winner: null });
    setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  }, [screens.length]);

  // Hàm chuyển màn hình sang PHẢI - Memoized
  const handleNextScreen = useCallback(() => {
    setIsPlaying(false);
    setScore(0);
    setTicTacToeState({ currentPlayer: 'X', winner: null });
    setCaroState({ currentPlayer: 'BLUE', winner: null });
    setCaro5State({ currentPlayer: 'BLUE', winner: null });
    setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
  }, [screens.length]);

  const currentScreenName = screens[currentScreenIndex];

  // Drawing hook
  const drawingGame = useDrawing(isPlaying && currentScreenName === 'DRAWING');

  // Callback đồng bộ Score - Memoized
  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore);
  }, []);

  // Callback đồng bộ Game State - Memoized
  const handleGameStateUpdate = useCallback((newState) => {
    if (currentScreenName === 'TICTACTOE') {
      setTicTacToeState(newState);
    } else if (currentScreenName === 'CARO4') {
      setCaroState(newState);
    } else if (currentScreenName === 'CARO5') {
      setCaro5State(newState);
    } else if (currentScreenName === 'SNAKE') {
      // Chỉ update nếu thực sự có thay đổi quan trọng để tránh render loop
      setSnakeState(prev => {
        if (prev.isGameOver === newState.isGameOver &&
          prev.direction === newState.direction &&
          prev.resetGame === newState.resetGame) {
          return prev;
        }
        return newState;
      });
    }
  }, [currentScreenName]);

  const handleEnter = useCallback(() => {
    // Diagnosos: Báo trạng thái ra UI để check
    const statusText = `Enter: ${currentScreenName} | Play: ${isPlaying} | Over: ${snakeState.isGameOver}`;
    toast.info(statusText);
    console.log("HANDLE ENTER:", statusText);

    if (currentScreenName === 'TICTACTOE') {
      if (ticTacToeState.winner && ticTacToeState.resetGame) {
        ticTacToeState.resetGame();
        setTicTacToeState(prev => ({ ...prev, winner: null, currentPlayer: 'X' }));
      } else if (!isPlaying) {
        setIsPlaying(true);
        setTicTacToeState({ currentPlayer: 'X', winner: null, resetGame: null });
      }
    } else if (currentScreenName === 'CARO4') {
      if (caroState.winner && caroState.resetGame) {
        caroState.resetGame();
        setCaroState(prev => ({ ...prev, winner: null, currentPlayer: 'BLUE' }));
      } else if (!isPlaying) {
        setIsPlaying(true);
        setCaroState({ currentPlayer: 'BLUE', winner: null, resetGame: null });
      }
    } else if (currentScreenName === 'CARO5') {
      if (caro5State.winner && caro5State.resetGame) {
        caro5State.resetGame();
        setCaro5State(prev => ({ ...prev, winner: null, currentPlayer: 'BLUE' }));
      } else if (!isPlaying) {
        setIsPlaying(true);
        setCaro5State({ currentPlayer: 'BLUE', winner: null, resetGame: null });
      }
    } else if (currentScreenName === 'SNAKE') {
      // ĐỂ ĐẢM BẢO RESTART: Luôn cho phép restart khi bấm Enter ở màn hình Snake
      toast.success("RESTARTING SNAKE...");

      // Reset triệt để bằng cách tắt/bật
      setIsPlaying(false);
      setScore(0);
      setSnakeState(prev => ({ ...prev, isGameOver: false }));

      setTimeout(() => {
        setIsPlaying(true);
      }, 20);
    } else if (currentScreenName === 'MEMORY' && !isPlaying) {
      setIsPlaying(true);
      setScore(0);
      memoryGame.initGame();
    } else if (currentScreenName === 'DRAWING' && !isPlaying) {
      setIsPlaying(true);
    } else if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
    }
  }, [currentScreenName, isPlaying, snakeState.isGameOver, ticTacToeState, caroState, caro5State, memoryGame]);

  // Keyboard controls
  const handleEnterRef = useRef();

  // Luôn cập nhật ref với hàm mới nhất để listener không bao giờ bị stale
  useEffect(() => {
    handleEnterRef.current = handleEnter;
  }, [handleEnter]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Phím Enter hoặc NumpadEnter
      if (e.key === 'Enter') {
        e.preventDefault();
        if (handleEnterRef.current) {
          handleEnterRef.current();
        }
        return;
      }

      // 2. Chỉ xử lý di chuyển nếu đang chơi Snake
      if (!isPlaying || currentScreenName !== 'SNAKE' || !snakeState.changeDirection) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          snakeState.changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          snakeState.changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          snakeState.changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          snakeState.changeDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentScreenName, snakeState.changeDirection]);
  // Rất quan trọng: Re-bind khi isPlaying hoặc changeDirection đổi để đảm bảo capture đúng context


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
    if (currentScreenName === 'SNAKE') {
      if (snakeState.isGameOver) return '- GAME OVER! (PRESS ENTER TO RESTART)';
      return '- HUNTING... (USE ARROWS OR L/R BUTTONS)';
    }
    return '(PLAYING)';
  };

  // Xử lý nút vật lý Left/Right
  const handleOnLeft = useCallback(() => {
    handlePrevScreen();
  }, [handlePrevScreen]);

  const handleOnRight = useCallback(() => {
    handleNextScreen();
  }, [handleNextScreen]);

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
                onScoreUpdate={handleScoreUpdate}
                onCardClick={memoryGame.handleCardClick}
                activeGameState={memoryGame}
                botEnabled={true}  // Bật bot cho TicTacToe
                onGameStateUpdate={handleGameStateUpdate}
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
                onLeft={handleOnLeft}
                onRight={handleOnRight}
                onBack={useCallback(() => {
                  if (isPlaying) {
                    setIsPlaying(false);
                    setScore(0);
                    setTicTacToeState({ currentPlayer: 'X', winner: null, resetGame: null });
                    setCaroState({ currentPlayer: 'BLUE', winner: null, resetGame: null });
                  }
                }, [isPlaying])}
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