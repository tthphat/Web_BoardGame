export const getCaro4Pixel = (r, c) => {
    // Connect 4 style - căn giữa trong grid 13x13
    // Dịch lên 4 hàng để căn giữa (từ hàng 9-12 thành 5-8)
    
    // 1. Quân Vàng (Yellow) - đã dịch lên 4 hàng
    const yellowStones = [
        [6,3], [5,3], 
        [6,6], [5,6], [4,6],
        [6,9],
        [6,12]
    ];

    // 2. Quân Đỏ (Red) - đã dịch lên 4 hàng
    const redStones = [
        [6,4], 
        [6,7], [5,7],
        [6,10], [5,10]
    ];

    // 3. ĐƯỜNG THẮNG 4 QUÂN (Màu Đỏ) - Hàng ngang
    const winningLine = [
        [7,5], [7,6], [7,7], [7,8]
    ];
    
    // Quân lót bên dưới đường thắng
    const baseLine = [
         [8,5], [8,6], [8,7], [8,8], [8,3], [8,4], [8,9], [8,10]
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

    // Nền bình thường
    return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';
};