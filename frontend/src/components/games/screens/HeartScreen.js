// Logic vẽ hình trái tim cầu vồng - lùi xuống 2 dòng
export const getHeartPixel = (r, c) => {
    // Tất cả row đã +2 để lùi xuống
    const heartShape = [
      // Row 3: đỉnh 2 nửa (2 dots + gap + 2 dots)
      [3,4], [3,5], [3,9], [3,10],
      
      // Row 4: mở rộng đỉnh (4 dots + gap + 4 dots)
      [4,3], [4,4], [4,5], [4,6], [4,8], [4,9], [4,10], [4,11],
      
      // Row 5: nối liền (11 dots) - cam
      [5,2], [5,3], [5,4], [5,5], [5,6], [5,7], [5,8], [5,9], [5,10], [5,11], [5,12],
      
      // Row 6: thân rộng nhất (11 dots) - vàng
      [6,2], [6,3], [6,4], [6,5], [6,6], [6,7], [6,8], [6,9], [6,10], [6,11], [6,12],
      
      // Row 7: thu hẹp (9 dots) - xanh lá
      [7,3], [7,4], [7,5], [7,6], [7,7], [7,8], [7,9], [7,10], [7,11],
      
      // Row 8: thu hẹp tiếp (7 dots) - cyan
      [8,4], [8,5], [8,6], [8,7], [8,8], [8,9], [8,10],
      
      // Row 9: nhỏ hơn (5 dots) - xanh dương
      [9,5], [9,6], [9,7], [9,8], [9,9],
      
      // Row 10: gần đuôi (3 dots) - tím
      [10,6], [10,7], [10,8],
      
      // Row 11: đuôi tim (1 dot) - tím đậm
      [11,7],
    ];

    const isHeart = heartShape.some(([hr, hc]) => hr === r && hc === c);
    
    // Nếu không phải hình tim -> Màu tối
    if (!isHeart) return 'bg-[#333] shadow-none opacity-40 scale-[0.7]'; 

    // Phối màu cầu vồng theo hàng
    if (r === 3) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';      // Đỏ
    if (r === 4) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';      // Đỏ
    if (r === 5) return 'bg-orange-500 shadow-[0_0_10px_#f97316]';   // Cam
    if (r === 6) return 'bg-yellow-400 shadow-[0_0_10px_#facc15]';   // Vàng
    if (r === 7) return 'bg-green-500 shadow-[0_0_10px_#22c55e]';    // Xanh lá
    if (r === 8) return 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';     // Xanh cyan
    if (r === 9) return 'bg-blue-500 shadow-[0_0_10px_#3b82f6]';     // Xanh dương
    if (r === 10) return 'bg-purple-500 shadow-[0_0_10px_#a855f7]';  // Tím
    if (r === 11) return 'bg-purple-600 shadow-[0_0_10px_#9333ea]';  // Tím đậm
    
    return 'bg-gray-500';
};