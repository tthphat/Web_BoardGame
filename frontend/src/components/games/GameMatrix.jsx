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

// Games sử dụng full board (kích thước động theo config) - CHỈ KHI CHƠI THẬT
// Hiện tại preview screens đều căn giữa
const FULLBOARD_GAMES = ['CARO4', 'CARO5', 'DRAWING'];

// Kích thước gốc của các game screens (được thiết kế cho 13x13)
const ORIGINAL_GAME_SIZE = 13;

const GameMatrix = ({ screen = 'HEART', isPlaying = false }) => {
  const { cols, rows, dotSize, gap } = getBoardConfig();
  
  // Chỉ dùng fullboard khi đang CHƠI game (không phải preview)
  const useFullboard = isPlaying && FULLBOARD_GAMES.includes(screen);
  
  // Tính offset để căn giữa (cho tất cả preview và fixed-size games)
  const offsetCol = useFullboard ? 0 : Math.floor((cols - ORIGINAL_GAME_SIZE) / 2);
  const offsetRow = useFullboard ? 0 : Math.floor((rows - ORIGINAL_GAME_SIZE) / 2);

  // Hàm điều phối: chuyển đổi tọa độ và gọi screen tương ứng
  const getPixelColor = (r, c) => {
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
      
      // Nếu nằm ngoài vùng game 13x13, hiển thị dot mờ
      if (gameR < 1 || gameR > ORIGINAL_GAME_SIZE || gameC < 1 || gameC > ORIGINAL_GAME_SIZE) {
          return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';
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

  return (
    <div className="bg-[#111] p-3 rounded-lg border-4 border-[#444] shadow-[inset_0_0_20px_black] inline-block">
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
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GameMatrix;