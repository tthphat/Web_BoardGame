export const getTicTacToePixel = (r, c) => {
    // 1. Vẽ khung bàn cờ (Dấu #)
    // Kẻ 2 dòng dọc (Cột 5 và 9) và 2 dòng ngang (Hàng 5 và 9)
    if (c === 5 || c === 9) return 'bg-gray-500 shadow-none';
    if (r === 5 || r === 9) return 'bg-gray-500 shadow-none';

    // 2. Vẽ quân X (Màu Xanh - Blue) - Ở ô Góc trên trái và Giữa phải
    // X ở góc trái (Hàng 2-4, Cột 2-4)
    const x1 = [[2,2],[2,4], [3,3], [4,2],[4,4]]; 
    // X ở giữa phải (Hàng 6-8, Cột 10-12)
    const x2 = [[6,10],[6,12], [7,11], [8,10],[8,12]];

    if ([...x1, ...x2].some(([xr, xc]) => xr === r && xc === c)) {
        return 'bg-blue-500 shadow-[0_0_10px_blue]';
    }

    // 3. Vẽ quân O (Màu Đỏ - Red) - Ở ô Trung tâm và Góc dưới trái
    // O ở trung tâm (Hàng 6-8, Cột 6-8)
    const o1 = [[6,7], [7,6],[7,8], [8,7]];
    // O ở góc dưới trái (Hàng 10-12, Cột 2-4)
    const o2 = [[10,3], [11,2],[11,4], [12,3]];
    
    // O chiến thắng (Gạch chéo từ phải sang trái: Góc trên phải -> Dưới trái)
    // Giả lập đường thắng nhấp nháy
    const winningLine = [[2,11], [3,10], [4,11], [3, 12]]; // Ví dụ quân O ở góc trên phải

    if ([...o1, ...o2, ...winningLine].some(([or, oc]) => or === r && oc === c)) {
         // Nếu là đường thắng thì nhấp nháy
         const isWinning = winningLine.some(([wr, wc]) => wr === r && wc === c);
         return `bg-red-500 shadow-[0_0_10px_red] ${isWinning ? 'animate-pulse bg-red-400' : ''}`;
    }

    return 'bg-[#222] shadow-none opacity-20 scale-75';
};