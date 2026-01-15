export const getCaro4Pixel = (r, c) => {
    // 1. Quân Vàng (Yellow)
    const yellowStones = [
        [10,2], [9,2], 
        [10,5], [9,5], [8,5],
        [10,8],
        [10,12]
    ];

    // 2. Quân Đỏ (Red)
    const redStones = [
        [10,3], 
        [10,6], [9,6],
        [10,9], [9,9]
    ];

    // 3. ĐƯỜNG THẮNG 4 QUÂN (Màu Đỏ) - Hàng ngang đáy
    // Tưởng tượng trọng lực kéo quân xuống dưới (kiểu Connect 4)
    const winningLine = [
        [11,4], [11,5], [11,6], [11,7]
    ];
    
    // Thêm vài quân lót bên dưới đường thắng
    const baseLine = [
         [12,4], [12,5], [12,6], [12,7], [12,2], [12,3], [12,8], [12,9]
    ];

    // Logic màu
    if ([...redStones, ...winningLine].some(([x, y]) => x === r && y === c)) {
         const isWin = winningLine.some(([wx, wy]) => wx === r && wy === c);
         return isWin 
            ? 'bg-red-500 shadow-[0_0_15px_red] animate-pulse z-10' 
            : 'bg-red-700 shadow-[0_0_5px_red]';
    }

    if ([...yellowStones, ...baseLine].some(([x, y]) => x === r && y === c)) {
        return 'bg-yellow-500 shadow-[0_0_5px_yellow]';
    }

    // Vẽ khung cột dọc (đặc trưng Connect 4)
    if (c % 2 !== 0 && c > 1 && c < 13) { // Các cột lẻ 3,5,7,9,11 làm vách ngăn
        return 'bg-blue-900 shadow-none opacity-40 scale-[0.2]';
    }

    return 'bg-[#1a1a1a] shadow-none opacity-20 scale-75';
};