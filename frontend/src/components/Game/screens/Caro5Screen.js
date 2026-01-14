export const getCaro5Pixel = (r, c) => {
    // 1. Quân Xanh (Đội A) - Rải rác
    const blueStones = [
        [2,3], [3,8], [5,2], [8,10], [9,3], [11,9], [12,2]
    ];
    
    // 2. Quân Đỏ (Đội B) - Rải rác
    const redStones = [
        [3,3], [4,9], [6,2], [9,10], [10,4], [2,10]
    ];

    // 3. ĐƯỜNG THẮNG 5 QUÂN (Màu Xanh) - Chéo từ góc trái trên xuống phải dưới
    const winningLine = [
        [4,4], [5,5], [6,6], [7,7], [8,8]
    ];

    // Logic kiểm tra
    if ([...blueStones, ...winningLine].some(([br, bc]) => br === r && bc === c)) {
        // Nếu thuộc đường thắng thì sáng rực rỡ hơn
        const isWin = winningLine.some(([wr, wc]) => wr === r && wc === c);
        return isWin 
            ? 'bg-cyan-400 shadow-[0_0_15px_cyan] animate-pulse border-2 border-white' 
            : 'bg-blue-600 shadow-[0_0_5px_blue] opacity-80';
    }

    if (redStones.some(([rr, rc]) => rr === r && rc === c)) {
        return 'bg-red-600 shadow-[0_0_5px_red] opacity-80';
    }

    // Nền lưới caro mờ (Gợi ý ô cờ)
    return 'bg-[#222] shadow-none opacity-20 scale-50';
};