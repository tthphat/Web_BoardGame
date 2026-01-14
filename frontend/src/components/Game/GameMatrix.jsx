import React from 'react';

const GameMatrix = () => {
  // Kích thước lưới 13x13
  const gridSize = 13; 
  
  // Hàm kiểm tra toạ độ (row, col) có thuộc hình trái tim không
  // Đây là "Hardcode" hình dáng trái tim dựa trên toạ độ lưới
  const getPixelColor = (r, c) => {
    // Định nghĩa hình dáng trái tim (các toạ độ x,y)
    const heartShape = [
      // Vòm trên
      [2,3],[2,4], [2,8],[2,9],
      [3,2],[3,3],[3,4],[3,5], [3,7],[3,8],[3,9],[3,10],
      // Thân giữa
      [4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[4,10],[4,11],
      [5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],[5,11],
      [6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9],[6,10],
      // Đuôi nhọn dần
      [7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9],
      [8,4],[8,5],[8,6],[8,7],[8,8],
      [9,5],[9,6],[9,7],
      [10,6]
    ];

    const isHeart = heartShape.some(([hr, hc]) => hr === r && hc === c);

    if (!isHeart) return 'bg-gray-200 shadow-inner'; // Màu trắng (đèn tắt)

    // Tô màu cầu vồng theo từng hàng (Row)
    if (r <= 3) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';
    if (r === 4) return 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]';
    if (r === 5) return 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]';
    if (r === 6) return 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]';
    if (r >= 7) return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]';
    
    return 'bg-gray-200';
  };

  // Tạo mảng 2 chiều để render
  const grid = [];
  for (let r = 1; r <= gridSize; r++) {
    for (let c = 1; c <= gridSize; c++) {
      grid.push({ r, c, colorClass: getPixelColor(r, c) });
    }
  }

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border-4 border-gray-600 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
      <div className="grid grid-cols-13 gap-1 md:gap-2 mx-auto max-w-fit">
        {grid.map((dot, index) => (
          <div 
            key={index}
            className={`w-3 h-3 md:w-5 md:h-5 rounded-full border border-gray-400/30 ${dot.colorClass} transition-all duration-300`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GameMatrix;