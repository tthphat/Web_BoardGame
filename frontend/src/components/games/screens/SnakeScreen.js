// Logic vẽ con rắn săn mồi
export const getSnakePixel = (r, c) => {
    // 1. Toạ độ thân rắn (Uốn lượn)
    const snakeBody = [
        [10, 3], [9, 3], [8, 3],
        [7, 3], [6, 3], [5, 3], [4, 3], 
        [4, 4], [4, 5], [4, 6], 
        [5, 6], [6, 6], [7, 6], [8, 6], 
        [8, 7], [8, 8], [8, 9], 
        [7, 9], [6, 9] 
    ];
    
    const snakeHead = [6, 10]; 
    const apple = [6, 11];

    if (snakeBody.some(([br, bc]) => br === r && bc === c)) {
        return 'bg-green-500 shadow-[0_0_10px_#4ade80]'; 
    }
    
    if (snakeHead[0] === r && snakeHead[1] === c) {
        return 'bg-green-400 shadow-[0_0_15px_#86efac] border-2 border-green-800 relative z-10';
    }
    
    // Quả táo
    if (apple[0] === r && apple[1] === c) {
        return 'bg-red-600 shadow-[0_0_15px_red] animate-pulse scale-110'; 
    }

    // Nền tối
    return 'bg-[#222] shadow-none opacity-20 scale-75';
};