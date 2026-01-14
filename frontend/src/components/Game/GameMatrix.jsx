import React from 'react';

// Nhận props 'screen' từ Dashboard ('HEART' hoặc 'SNAKE')
const GameMatrix = ({ screen = 'HEART' }) => {
  const gridSize = 13; 

  // --- LOGIC VẼ TRÁI TIM (Giữ nguyên) ---
  const getHeartColor = (r, c) => {
    const heartShape = [
      [2,4], [2,5], [2,9], [2,10],
      [3,3], [3,4], [3,5], [3,6], [3,8], [3,9], [3,10], [3,11],
      [4,2], [4,3], [4,4], [4,5], [4,6], [4,7], [4,8], [4,9], [4,10], [4,11], [4,12],
      [5,2], [5,3], [5,4], [5,5], [5,6], [5,7], [5,8], [5,9], [5,10], [5,11], [5,12],
      [6,3], [6,4], [6,5], [6,6], [6,7], [6,8], [6,9], [6,10], [6,11],
      [7,4], [7,5], [7,6], [7,7], [7,8], [7,9], [7,10],
      [8,5], [8,6], [8,7], [8,8], [8,9],
      [9,6], [9,7], [9,8],
      [10,7]
    ];
    const isHeart = heartShape.some(([hr, hc]) => hr === r && hc === c);
    
    if (!isHeart) return 'bg-[#333] shadow-none opacity-30 scale-75'; 

    if (r <= 3) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
    if (r === 4) return 'bg-orange-500 shadow-[0_0_10px_#f97316]';
    if (r === 5) return 'bg-yellow-400 shadow-[0_0_10px_#facc15]';
    if (r === 6) return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
    if (r === 7) return 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';
    if (r === 8) return 'bg-blue-500 shadow-[0_0_10px_#3b82f6]';
    if (r >= 9) return 'bg-purple-500 shadow-[0_0_10px_#a855f7]';
    return 'bg-gray-500';
  };

  // --- LOGIC VẼ SNAKE (Đã bỏ chữ) ---
  const getSnakeColor = (r, c) => {
    // 1. Toạ độ thân rắn (Uốn lượn hình chữ S ngược)
    const snakeBody = [
        // Đuôi ở góc dưới trái
        [10, 3], [9, 3], [8, 3],
        // Khúc cua 1 (Lên -> Phải)
        [7, 3], [6, 3], [5, 3], [4, 3], 
        [4, 4], [4, 5], [4, 6], 
        // Khúc cua 2 (Xuống -> Phải)
        [5, 6], [6, 6], [7, 6], [8, 6], 
        [8, 7], [8, 8], [8, 9], 
        // Khúc cua 3 (Lên -> Chuẩn bị đớp)
        [7, 9], [6, 9] 
    ];
    
    // 2. Đầu rắn: Ngay sát quả táo (Hàng 6, Cột 10)
    const snakeHead = [6, 10]; 
    
    // 3. Quả Táo: Ngay trước mặt rắn (Hàng 6, Cột 11)
    const apple = [6, 11];

    // --- XỬ LÝ MÀU SẮC ---
    
    // Kiểm tra thân rắn
    if (snakeBody.some(([br, bc]) => br === r && bc === c)) {
        return 'bg-green-500 shadow-[0_0_10px_#4ade80]'; 
    }
    
    // Kiểm tra đầu rắn (Sáng hơn, có viền để phân biệt)
    if (snakeHead[0] === r && snakeHead[1] === c) {
        return 'bg-green-400 shadow-[0_0_15px_#86efac] border-2 border-green-800 relative z-10';
    }
    
    // Kiểm tra quả táo (Đỏ rực, nhấp nháy mạnh)
    if (apple[0] === r && apple[1] === c) {
        return 'bg-red-600 shadow-[0_0_15px_red] animate-pulse scale-110'; 
    }

    // Các ô còn lại (Nền tối)
    return 'bg-[#222] shadow-none opacity-20 scale-75';
  };

  // --- MAIN RENDER LOGIC ---
  const getPixelColor = (r, c) => {
      if (screen === 'SNAKE') return getSnakeColor(r, c);
      return getHeartColor(r, c);
  };

  const grid = [];
  for (let r = 1; r <= gridSize; r++) {
    for (let c = 1; c <= gridSize; c++) {
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