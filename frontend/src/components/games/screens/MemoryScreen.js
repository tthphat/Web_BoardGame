export const getMemoryPixel = (r, c) => {
    // Vẽ lưới bài 4x4 nằm ở trung tâm của vùng 13x13
    // Center của 13x13 là hàng 7, cột 7
    // Grid 4x4 với spacing 2: chiếm 7 ô (1+2+1+2+1+2+1)
    // Bắt đầu từ: center - 3 = 4, kết thúc: center + 3 = 10
    // Toạ độ các lá bài: Hàng 4,6,8,10 và Cột 4,6,8,10
    const cardRows = [4, 6, 8, 10];
    const cardCols = [4, 6, 8, 10];

    // Kiểm tra xem ô hiện tại có phải là vị trí của lá bài không
    const isCardPosition = cardRows.includes(r) && cardCols.includes(c);

    if (isCardPosition) {
        // --- TRẠNG THÁI CÁC LÁ BÀI ---

        // 1. CẶP BÀI ĐÃ LẬT ĐÚNG (Màu Xanh lá - Sáng rực)
        if ((r === 4 && c === 4) || (r === 10 && c === 10)) {
            return 'bg-green-500 shadow-[0_0_15px_#22c55e] animate-bounce';
        }

        // 2. CẶP BÀI ĐANG LẬT (Chưa so khớp xong - Màu Vàng)
        if (r === 6 && c === 8) {
            return 'bg-yellow-400 shadow-[0_0_10px_yellow] border-2 border-white';
        }

        // 3. CÁC LÁ BÀI CÒN ÚP (Màu Xám tối - Face down)
        return 'bg-slate-600 shadow-none border border-slate-400 scale-90';
    }

    // Nền bình thường (hiển thị giống các game khác)
    return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';
};