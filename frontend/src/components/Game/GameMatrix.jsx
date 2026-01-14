import React from 'react';
// Import các "thợ vẽ" từ thư mục screens
import { getHeartPixel } from './screens/HeartScreen';
import { getSnakePixel } from './screens/SnakeScreen';
import { getTicTacToePixel } from './screens/TicTacToeScreen';
import { getCaro5Pixel } from './screens/Caro5Screen';
import { getCaro4Pixel } from './screens/Caro4Screen';
import { getMatch3Pixel } from './screens/Match3Screen';
import { getMemoryPixel } from './screens/MemoryScreen';

const GameMatrix = ({ screen = 'HEART' }) => {
  const gridSize = 13; 

  // Hàm điều phối: Dựa vào props 'screen' để chọn hàm vẽ phù hợp
  const getPixelColor = (r, c) => {
      switch (screen) {
          case 'SNAKE':
              return getSnakePixel(r, c);
          case 'TICTACTOE':
              return getTicTacToePixel(r, c);
          case 'CARO5':
              return getCaro5Pixel(r, c);
          case 'CARO4':
              return getCaro4Pixel(r, c);
          case 'MATCH3': 
              return getMatch3Pixel(r, c);
          case 'MEMORY': 
              return getMemoryPixel(r, c);
          case 'HEART':
          default:
              return getHeartPixel(r, c);
      }
  };

  // Tạo lưới dữ liệu
  const grid = [];
  for (let r = 1; r <= gridSize; r++) {
    for (let c = 1; c <= gridSize; c++) {
      // Gọi hàm điều phối ở trên
      grid.push({ r, c, colorClass: getPixelColor(r, c) });
    }
  }

  return (
    <div className="bg-[#111] p-3 md:p-5 rounded-lg border-4 border-[#444] shadow-[inset_0_0_20px_black] inline-block">
      <div 
        className="grid gap-2 md:gap-3 mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {grid.map((dot, index) => (
          <div 
            key={index}
            className={`w-5 h-5 md:w-8 md:h-8 rounded-full ${dot.colorClass} transition-all duration-300`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GameMatrix;