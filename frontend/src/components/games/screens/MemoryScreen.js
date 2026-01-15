export const getMemoryPixel = (r, c) => {
    // Chúng ta sẽ vẽ lưới bài 4x4 nằm ở trung tâm
    // Toạ độ các lá bài: Hàng 3,5,7,9 và Cột 3,5,7,9
    const cardRows = [3, 5, 7, 9];
    const cardCols = [3, 5, 7, 9];

    // Kiểm tra xem ô hiện tại có phải là vị trí của lá bài không
    const isCardPosition = cardRows.includes(r) && cardCols.includes(c);

    if (isCardPosition) {
        // --- TRẠNG THÁI CÁC LÁ BÀI ---

        // 1. CẶP BÀI ĐÃ LẬT ĐÚNG (Màu Xanh lá - Sáng rực)
        // Ví dụ: Lá ở [3,3] và [9,9]
        if ((r === 3 && c === 3) || (r === 9 && c === 9)) {
            return 'bg-green-500 shadow-[0_0_15px_#22c55e] animate-bounce'; // Nhảy nhót ăn mừng
        }

        // 2. CẶP BÀI ĐANG LẬT (Chưa so khớp xong - Màu Vàng)
        // Ví dụ: Lá ở [5,7]
        if (r === 5 && c === 7) {
            return 'bg-yellow-400 shadow-[0_0_10px_yellow] border-2 border-white';
        }

        // 3. CÁC LÁ BÀI CÒN ÚP (Màu Xám tối - Face down)
        return 'bg-slate-600 shadow-none border border-slate-400 scale-90';
    }

    // Nền tối (Khoảng cách giữa các lá bài)
    return 'bg-[#111] shadow-none opacity-0';
};