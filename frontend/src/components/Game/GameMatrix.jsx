import React from 'react';

const GameMatrix = () => {
  const gridSize = 13; 

  const getPixelColor = (r, c) => {
    // --- CẬP NHẬT TOẠ ĐỘ TRÁI TIM ---
    // Cột 7 là tâm. Hình dáng đối xứng qua cột 7.
    const heartShape = [
      // Hàng 2: 2 đỉnh tròn (cách nhau 3 ô ở giữa)
      [2,4], [2,5],             [2,9], [2,10],
      
      // Hàng 3: Nở ra, vẫn lõm 1 ô ở giữa (số 7)
      [3,3], [3,4], [3,5], [3,6],   [3,8], [3,9], [3,10], [3,11],
      
      // Hàng 4: Full bề ngang (Rộng nhất)
      [4,2], [4,3], [4,4], [4,5], [4,6], [4,7], [4,8], [4,9], [4,10], [4,11], [4,12],
      
      // Hàng 5: Full bề ngang (Rộng nhất - bắt đầu thân dưới)
      [5,2], [5,3], [5,4], [5,5], [5,6], [5,7], [5,8], [5,9], [5,10], [5,11], [5,12],
      
      // Hàng 6: Thu vào 1 nấc
      [6,3], [6,4], [6,5], [6,6], [6,7], [6,8], [6,9], [6,10], [6,11],
      
      // Hàng 7: Thu vào tiếp
      [7,4], [7,5], [7,6], [7,7], [7,8], [7,9], [7,10],
      
      // Hàng 8: Thu vào tiếp
      [8,5], [8,6], [8,7], [8,8], [8,9],
      
      // Hàng 9: Gần chóp
      [9,6], [9,7], [9,8],
      
      // Hàng 10: Chóp nhọn
      [10,7]
    ];

    // Kiểm tra xem ô hiện tại có thuộc hình tim không
    const isHeart = heartShape.some(([hr, hc]) => hr === r && hc === c);

    // Màu nền cho các ô KHÔNG phải trái tim (Đèn tắt)
    // Dùng opacity thấp để tạo lưới mờ
    if (!isHeart) return 'bg-[#333] shadow-none opacity-30 scale-75'; 

    // --- PHỐI MÀU RAINBOW GLOW ---
    if (r <= 3) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';       // Đỏ
    if (r === 4) return 'bg-orange-500 shadow-[0_0_10px_#f97316]';    // Cam
    if (r === 5) return 'bg-yellow-400 shadow-[0_0_10px_#facc15]';    // Vàng
    if (r === 6) return 'bg-green-500 shadow-[0_0_10px_#22c55e]';     // Xanh lá
    if (r === 7) return 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';      // Xanh lơ
    if (r === 8) return 'bg-blue-500 shadow-[0_0_10px_#3b82f6]';      // Xanh dương
    if (r >= 9) return 'bg-purple-500 shadow-[0_0_10px_#a855f7]';     // Tím
    
    return 'bg-gray-500';
  };

  const grid = [];
  for (let r = 1; r <= gridSize; r++) {
    for (let c = 1; c <= gridSize; c++) {
      grid.push({ r, c, colorClass: getPixelColor(r, c) });
    }
  }

  return (
    <div className="bg-[#111] p-3 md:p-5 rounded-lg border-4 border-[#444] shadow-[inset_0_0_20px_black] inline-block">
      
      {/* QUAN TRỌNG: Thêm style gridTemplateColumns để ép đúng 13 cột */}
      <div 
        className="grid gap-2 md:gap-3 mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {grid.map((dot, index) => (
          <div 
            key={index}
            className={`
                w-5 h-5 md:w-8 md:h-8 
                rounded-full 
                ${dot.colorClass} 
                transition-all duration-300
            `}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GameMatrix;