import React from 'react';
import { getBoardConfig } from '../../utils/boardConfig';
// Import các "thợ vẽ" từ thư mục screens
import { getHeartPixel } from './screens/HeartScreen';
import { getSnakePixel } from './screens/SnakeScreen';
import { getTicTacToePixel } from './screens/TicTacToeScreen';
import { getCaro5Pixel } from './screens/Caro5Screen';
import { getCaro4Pixel } from './screens/Caro4Screen';
import { getMatch3Pixel } from './screens/Match3Screen';
import { getMemoryPixel } from './screens/MemoryScreen';
import { useMatch3 } from '../../hooks/useMatch3';

// Games sử dụng full board (kích thước động theo config) - CHỈ KHI CHƠI THẬT
// Hiện tại preview screens đều căn giữa
const FULLBOARD_GAMES = ['CARO4', 'CARO5', 'DRAWING'];

// Kích thước gốc của các game screens (được thiết kế cho 13x13)
const ORIGINAL_GAME_SIZE = 13;

const GameMatrix = ({ screen = 'HEART', isPlaying = false }) => {
  const { cols, rows, dotSize, gap } = getBoardConfig();

  // Hook cho game Match 3
  const match3 = useMatch3(rows, cols, isPlaying && screen === 'MATCH3');

  // Chỉ dùng fullboard khi đang CHƠI game (không phải preview)
  const useFullboard = isPlaying && FULLBOARD_GAMES.includes(screen);

  // Tính offset để căn giữa (cho tất cả preview và fixed-size games)
  // Nếu là Match 3 đang chơi thì offset là 0 luôn (vì board được hook generate full size)
  const offsetCol = (useFullboard || (screen === 'MATCH3' && isPlaying)) ? 0 : Math.floor((cols - ORIGINAL_GAME_SIZE) / 2);
  const offsetRow = (useFullboard || (screen === 'MATCH3' && isPlaying)) ? 0 : Math.floor((rows - ORIGINAL_GAME_SIZE) / 2);

  // Hàm điều phối: chuyển đổi tọa độ và gọi screen tương ứng
  const getPixelColor = (r, c) => {
    // 1. Nếu đang chơi Match 3: lấy màu từ hook
    if (screen === 'MATCH3' && isPlaying) {
      const cellColor = match3.board[r - 1]?.[c - 1];
      let classes = cellColor || 'bg-[#222] opacity-20';

      if (match3.selected && match3.selected.r === r - 1 && match3.selected.c === c - 1) {
        classes += ' ring-4 ring-white z-20 scale-110';
      }
      return classes;
    }

    // Với fullboard games khi ĐANG CHƠI: dùng tọa độ trực tiếp
    if (useFullboard) {
      switch (screen) {
        case 'CARO5':
          return getCaro5Pixel(r, c);
        case 'CARO4':
          return getCaro4Pixel(r, c);
        case 'DRAWING':
          return 'bg-[#333] shadow-none opacity-50';
        default:
          return 'bg-[#333] shadow-none opacity-50';
      }
    }

    // Với tất cả preview và fixed-size games: chuyển đổi tọa độ để căn giữa
    const gameR = r - offsetRow;
    const gameC = c - offsetCol;

    // Nếu nằm ngoài vùng game 13x13, hiển thị dot mờ giống bên trong
    if (gameR < 1 || gameR > ORIGINAL_GAME_SIZE || gameC < 1 || gameC > ORIGINAL_GAME_SIZE) {
      return 'bg-[#222] shadow-none opacity-20 scale-50';
    }

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
  const scrollRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);

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
    if (screen === 'MATCH3' && isPlaying) {
      match3.handlePixelClick(r - 1, c - 1);
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