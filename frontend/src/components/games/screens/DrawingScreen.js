// Preview screen cho Drawing - hiển thị icon bút vẽ
export const getDrawingPixel = (r, c) => {
  // Vẽ hình bút/pencil đơn giản ở giữa màn hình 13x13
  const pencilShape = [
    // Đầu bút (nhọn)
    [3, 7],
    [4, 6], [4, 7], [4, 8],
    // Thân bút
    [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
    [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
    [7, 5], [7, 6], [7, 7], [7, 8], [7, 9],
    [8, 5], [8, 6], [8, 7], [8, 8], [8, 9],
    // Đuôi bút (eraser)
    [9, 6], [9, 7], [9, 8],
    [10, 7],
  ];

  const isPencil = pencilShape.some(([pr, pc]) => pr === r && pc === c);
  
  if (!isPencil) return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';

  // Phối màu cho bút
  if (r <= 4) return 'bg-gray-400 shadow-[0_0_8px_#9ca3af]'; // Đầu bút
  if (r <= 8) return 'bg-yellow-500 shadow-[0_0_8px_#eab308]'; // Thân bút vàng
  return 'bg-pink-400 shadow-[0_0_8px_#f472b6]'; // Eraser hồng
};
