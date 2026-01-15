// src/components/games/screens/ActiveMemoryScreen.js

// Helper: Map loại thẻ sang class màu CSS
const getColorClass = (type) => {
    switch (type) {
        case 'RED': return 'bg-red-500 shadow-[0_0_10px_red]';
        case 'BLUE': return 'bg-blue-500 shadow-[0_0_10px_blue]';
        case 'GREEN': return 'bg-green-500 shadow-[0_0_10px_green]';
        case 'YELLOW': return 'bg-yellow-400 shadow-[0_0_10px_yellow]';
        case 'PURPLE': return 'bg-purple-500 shadow-[0_0_10px_purple]';
        case 'CYAN': return 'bg-cyan-400 shadow-[0_0_10px_cyan]';
        case 'ORANGE': return 'bg-orange-500 shadow-[0_0_10px_orange]';
        case 'WHITE': return 'bg-white shadow-[0_0_10px_white]';
        default: return 'bg-gray-500';
    }
};

export const getActiveMemoryPixel = (r, c, gameState) => {
    const { board, cursor } = gameState;
    
    // Board Memory 4x4 sẽ được căn giữa trên lưới 13x13
    // Map toạ độ lưới 13x13 (visual) sang toạ độ logic (card index 0-15)
    // Các hàng chứa bài: 3, 5, 7, 9
    // Các cột chứa bài: 3, 5, 7, 9
    
    const rowMap = { 3: 0, 5: 1, 7: 2, 9: 3 };
    const colMap = { 3: 0, 5: 1, 7: 2, 9: 3 };

    const cardRow = rowMap[r];
    const cardCol = colMap[c];

    // Nếu không phải vị trí đặt bài -> trả về nền tối (khoảng cách giữa các lá bài)
    if (cardRow === undefined || cardCol === undefined) {
        return 'bg-[#111] shadow-none opacity-0';
    }

    // Tính index trong mảng board (0-15)
    const index = cardRow * 4 + cardCol;
    const card = board[index];
    
    // Nếu chưa khởi tạo board xong (tránh lỗi crash khi mới mount)
    if (!card) return 'bg-[#111] shadow-none opacity-0';

    const isCursor = index === cursor;

    // --- LOGIC MÀU SẮC ---

    let baseClass = 'scale-90 transition-all duration-200';
    
    // Hiệu ứng Cursor (Đang chọn): Có viền trắng sáng
    if (isCursor) {
        baseClass += ' ring-2 ring-white scale-100 z-10';
    }

    // 1. Nếu đã Match -> Màu của thẻ nhưng sáng hơn/nhấp nháy
    if (card.isMatched) {
        return `${getColorClass(card.type)} opacity-50 ${baseClass}`;
    }

    // 2. Nếu đang Lật -> Hiện màu thẻ
    if (card.isFlipped) {
        return `${getColorClass(card.type)} ${baseClass}`;
    }

    // 3. Nếu đang Úp -> Màu lưng bài (Xám xanh)
    return `bg-slate-700 border border-slate-500 ${baseClass}`;
};