import { getBoardConfig } from '../../utils/boardConfig';
// Import các "thợ vẽ" từ thư mục screens
import { getHeartPixel } from './screens/HeartScreen';
import { getSnakePixel } from './screens/SnakeScreen';
import { getTicTacToePixel } from './screens/TicTacToeScreen';
import { getCaro5Pixel } from './screens/Caro5Screen';
import { getCaro4Pixel } from './screens/Caro4Screen';
import { getMatch3Pixel } from './screens/Match3Screen';
import { getMemoryPixel } from './screens/MemoryScreen';
import { getActiveMemoryPixel } from './screens/ActiveMemoryScreen';
import { useMatch3 } from '../../hooks/useMatch3';
import { useTicTacToe } from '../../hooks/useTicTacToe';
import { useCaro } from '../../hooks/useCaro';
import { useCaro5 } from '../../hooks/useCaro5';
import { useEffect, useRef, useState } from 'react';

// Games sử dụng full board (kích thước động theo config) - CHỈ KHI CHƠI THẬT
const FULLBOARD_GAMES = ['CARO4', 'CARO5', 'DRAWING'];

// Kích thước gốc của các game screens (được thiết kế cho 13x13)
const ORIGINAL_GAME_SIZE = 13;

const GameMatrix = ({ 
  screen = 'HEART', 
  isPlaying = false, 
  onScoreUpdate, 
  onGameStateUpdate,
  activeGameState, 
  onCardClick,
  botEnabled = false  // Thêm prop cho bot TicTacToe
}) => {
  const { cols, rows, dotSize, gap } = getBoardConfig();

  // Hook cho game Match 3
  const match3 = useMatch3(rows, cols, isPlaying && screen === 'MATCH3');

  // Hook cho game TicTacToe (truyền botEnabled)
  const ticTacToe = useTicTacToe(isPlaying && screen === 'TICTACTOE', botEnabled);

  // Hook cho game Caro4 (truyền botEnabled)
  const caro = useCaro(isPlaying && screen === 'CARO4', botEnabled);

  // Hook cho game Caro5
  const caro5 = useCaro5(isPlaying && screen === 'CARO5');

  // Sync score with parent (Dành cho Match 3)
  useEffect(() => {
    if (screen === 'MATCH3' && isPlaying && onScoreUpdate) {
      onScoreUpdate(match3.score);
    }
  }, [match3.score, screen, isPlaying, onScoreUpdate]);

  // Sync TicTacToe game state with parent
  useEffect(() => {
    if (screen === 'TICTACTOE' && isPlaying && onGameStateUpdate) {
      onGameStateUpdate({
        currentPlayer: ticTacToe.currentPlayer,
        winner: ticTacToe.winner,
        resetGame: ticTacToe.resetGame,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticTacToe.currentPlayer, ticTacToe.winner, screen, isPlaying]);

  // Sync Caro4 game state with parent
  useEffect(() => {
    if (screen === 'CARO4' && isPlaying && onGameStateUpdate) {
      onGameStateUpdate({
        currentPlayer: caro.currentPlayer,
        winner: caro.winner,
        resetGame: caro.resetGame,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caro.currentPlayer, caro.winner, screen, isPlaying]);

  // Sync Caro5 game state with parent
  useEffect(() => {
    if (screen === 'CARO5' && isPlaying && onGameStateUpdate) {
      onGameStateUpdate({
        currentPlayer: caro5.currentPlayer,
        winner: caro5.winner,
        resetGame: caro5.resetGame,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caro5.currentPlayer, caro5.winner, screen, isPlaying]);

  // Chỉ dùng fullboard khi đang CHƠI game (không phải preview)
  const useFullboard = isPlaying && FULLBOARD_GAMES.includes(screen);

  // Tính offset để căn giữa
  // Match 3: Full size -> Offset 0
  // Memory (Active): Vẫn dùng 13x13 căn giữa -> Có Offset
  const offsetCol = (useFullboard || (screen === 'MATCH3' && isPlaying)) ? 0 : Math.floor((cols - ORIGINAL_GAME_SIZE) / 2);
  const offsetRow = (useFullboard || (screen === 'MATCH3' && isPlaying)) ? 0 : Math.floor((rows - ORIGINAL_GAME_SIZE) / 2);

  // Hàm điều phối: chuyển đổi tọa độ và gọi screen tương ứng
  const getPixelColor = (r, c) => {
    // Chuyển đổi tọa độ để căn giữa
    const gameR = r - offsetRow;
    const gameC = c - offsetCol;

    // Xác định kích thước vùng chơi
    // Fullboard games: dùng kích thước thực của board
    // Standard games: dùng 13x13 căn giữa
    const maxRows = useFullboard ? rows : ORIGINAL_GAME_SIZE;
    const maxCols = useFullboard ? cols : ORIGINAL_GAME_SIZE;

    // Nếu nằm ngoài vùng game
    const isOutside = gameR < 1 || gameR > maxRows || gameC < 1 || gameC > maxCols;
    if (isOutside) {
      // TicTacToe: ẩn hoàn toàn các dots ngoài vùng chơi
      if (screen === 'TICTACTOE' && isPlaying) {
        return 'bg-transparent shadow-none opacity-0';
      }
      // Các game khác: hiển thị dot mờ
      return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';
    }

    // 1. Nếu đang chơi TicTacToe: lấy màu từ hook
    if (screen === 'TICTACTOE' && isPlaying) {
      return ticTacToe.getPixelColor(gameR, gameC);
    }

    // 2. Nếu đang chơi Match 3: lấy màu từ hook
    if (screen === 'MATCH3' && isPlaying) {
      const cellColor = match3.board[r - 1]?.[c - 1];
      let classes = cellColor || 'bg-[#222] opacity-20';

      if (match3.selected && match3.selected.r === r - 1 && match3.selected.c === c - 1) {
        classes += ' ring-4 ring-white z-20 scale-110';
      }
      
      return classes;
    }

    // 3. Fullboard Games (Caro, Drawing...)
    if (useFullboard) {
      switch (screen) {
        case 'CARO5':
          // Khi đang chơi: dùng hook, không chơi: dùng preview
          if (isPlaying) {
            return caro5.getPixelColor(r, c);
          }
          return getCaro5Pixel(r, c);
        case 'CARO4':
          // Khi đang chơi: dùng hook, không chơi: dùng preview
          if (isPlaying) {
            return caro.getPixelColor(r, c);
          }
          return getCaro4Pixel(r, c);
        case 'DRAWING':
          return 'bg-[#333] shadow-none opacity-50';
        default:
          return 'bg-[#333] shadow-none opacity-50';
      }
    }

    // 4. Standard Games (Căn giữa 13x13)
    switch (screen) {
      case 'SNAKE':
        return getSnakePixel(gameR, gameC);
      case 'TICTACTOE':
        return getTicTacToePixel(gameR, gameC);
      case 'CARO5':
        return getCaro5Pixel(gameR, gameC);
      case 'CARO4':
        return getCaro4Pixel(gameR, gameC);
      case 'MATCH3':
        return getMatch3Pixel(gameR, gameC);
      case 'MEMORY':
        // Nếu đang chơi và có state truyền từ ngoài vào -> Dùng Active Pixel
        if (isPlaying && activeGameState) {
          return getActiveMemoryPixel(gameR, gameC, activeGameState);
        }
        // Nếu không -> Dùng Preview Pixel
        return getMemoryPixel(gameR, gameC);
      case 'HEART':
      default:
        return getHeartPixel(gameR, gameC);
    }
  };

  // Tạo lưới dữ liệu
  const grid = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      grid.push({ r, c, colorClass: getPixelColor(r, c) });
    }
  }

  /* --- Logic Drag-to-Scroll --- */
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walkX;
    scrollRef.current.scrollTop = scrollTop - walkY;
  };

  const onPixelClick = (r, c) => {
    if (isDragging) return;
    
    // Chuyển đổi tọa độ cho game fixed-size
    const gameR = r - offsetRow;
    const gameC = c - offsetCol;
    
    // TicTacToe click
    if (screen === 'TICTACTOE' && isPlaying) {
      ticTacToe.handlePixelClick(gameR, gameC);
    } 
    // Match3 click
    else if (screen === 'MATCH3' && isPlaying) {
      match3.handlePixelClick(r - 1, c - 1);
    }
    // Caro4 click
    else if (screen === 'CARO4' && isPlaying) {
      caro.handlePixelClick(r, c);
    }
    // Caro5 click
    else if (screen === 'CARO5' && isPlaying) {
      caro5.handlePixelClick(r, c);
    }
    // Memory click
    else if (screen === 'MEMORY' && isPlaying && onCardClick) {
      // Định nghĩa vị trí các lá bài (Khớp với logic vẽ trong ActiveMemoryScreen)
      // Hàng/Cột: 4, 6, 8, 10 tương ứng với index 0, 1, 2, 3
      const validPositions = { 4: 0, 6: 1, 8: 2, 10: 3 };

      const cardRow = validPositions[gameR];
      const cardCol = validPositions[gameC];

      // Kiểm tra: Nếu click trúng vị trí có lá bài (không phải undefined)
      if (cardRow !== undefined && cardCol !== undefined) {
        // Tính ra index mảng 1 chiều (0 - 15)
        const index = cardRow * 4 + cardCol;
        onCardClick(index);
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      className={`bg-[#111] p-3 rounded-lg border-4 border-[#444] shadow-[inset_0_0_20px_black] inline-block max-w-full overflow-auto max-h-[85vh] ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div
        className="grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`
        }}
      >
        {grid.map((dot, index) => (
          <div
            key={index}
            className={`rounded-full ${dot.colorClass} transition-all duration-300`}
            style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
            onClick={() => onPixelClick(dot.r, dot.c)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GameMatrix;