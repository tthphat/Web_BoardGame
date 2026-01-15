export const getMatch3Pixel = (r, c) => {
    // 1. ĐỊNH NGHĨA CÁC LOẠI KẸO (Màu sắc)
    const gemColors = [
        'bg-purple-500 shadow-[0_0_5px_purple]', // Tím
        'bg-yellow-400 shadow-[0_0_5px_yellow]', // Vàng
        'bg-blue-500 shadow-[0_0_5px_blue]',     // Xanh
        'bg-orange-500 shadow-[0_0_5px_orange]', // Cam
    ];

    // 2. TẠO COMBO "MATCH 3" (Ăn điểm)
    // Giả lập cột số 7 (ở giữa), hàng 6,7,8 là 3 viên Đỏ thẳng hàng -> Đang nổ
    const matchLine = [[6,7], [7,7], [8,7]];

    if (matchLine.some(([mr, mc]) => mr === r && mc === c)) {
        // Hiệu ứng nổ: Đỏ rực, nhấp nháy mạnh, viền trắng
        return 'bg-red-600 shadow-[0_0_15px_red] animate-pulse border-2 border-white scale-110 z-10';
    }

    // 3. LOGIC MÀU NGẪU NHIÊN (Cho các ô còn lại)
    // Dùng công thức toán học để tạo màu cố định dựa trên toạ độ (giả lập random)
    // Để tránh trùng lặp quá nhiều tạo thành match ảo
    const colorIndex = (r * 3 + c * 7) % 4;
    
    // Tạo vùng chọn (Cursor) - Giả sử người chơi đang chọn ô [7,8]
    if (r === 7 && c === 8) {
        return `${gemColors[colorIndex]} border-2 border-white scale-90 ring-2 ring-white/50`;
    }

    // Trả về màu kẹo bình thường
    return gemColors[colorIndex];
};