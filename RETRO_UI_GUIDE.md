# Hướng dẫn Thiết kế Giao diện Retro (Windows 95 / Phong cách Game Cổ điển)

Hướng dẫn này giải thích các nguyên tắc thiết kế và kỹ thuật Tailwind CSS được sử dụng để tạo ra giao diện "Retro" trong dự án này.

## 1. Nguyên tắc cốt lõi: Skeuomorphism (Thiết kế mô phỏng)
Skeuomorphism là một phong cách thiết kế mô phỏng các vật thể trong thế giới thực. Trong thiết kế kỹ thuật số retro, điều này có nghĩa là mô phỏng độ sâu, ánh sáng và phản hồi xúc giác vật lý.

### Ánh sáng và Hiệu ứng 3D
Mọi thứ phụ thuộc vào "Nguồn sáng" (thường được tưởng tượng ở góc trên bên trái).
- **Nổi (Raised):** Ánh sáng chiếu vào phía trên/bên trái, bóng đổ xuống phía dưới/bên phải.
- **Lõm (Sunken):** Bóng đổ ở phía trên/bên trái, ánh sáng ở phía dưới/bên phải.

## 2. Triển khai kỹ thuật với Tailwind CSS

### A. Đường viền "Nổi" (Nút bấm, Container)
Để tạo hiệu ứng 3D của một vật thể nổi lên:
```html
<div class="bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow">
  <!-- Nội dung ở đây -->
</div>
```

### B. Đường viền "Lõm" (Ô nhập liệu, Header thụt lề)
Để tạo hiệu ứng của một vật thể được khắc vào bề mặt:
```html
<input className="bg-white border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight outline-none" />
```

### C. Hiệu ứng Nhấn nút Vật lý
Mô phỏng một nút vật lý được nhấn bằng cách hoán đổi các đường viền và di chuyển phần tử một chút:
```html
<button className="
    border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow 
    active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight 
    active:translate-y-0.5 transition-all">
  Nhấn vào tôi
</button>
```

## 3. Bản sắc Thị giác (Màu sắc & Typography)

### Bảng màu cổ điển (Tailwind Theme)
- **`bg-retro-silver` (#c0c0c0):** Dùng cho nền và các bảng điều khiển (panels).
- **`bg-retro-teal` (#008080):** Màu nền "Desktop" cổ điển.
- **`bg-retro-navy` (#000080):** Màu thanh tiêu đề cổ điển.
- **`bg-retro-shadow` (#808080):** Dùng cho đổ bóng.
- **`bg-retro-highlight` (#ffffff):** Dùng cho các cạnh sáng/vùng sáng.

### Typography (Phông chữ)
- **Phông chữ Monospace:** Sử dụng `font-mono` để gợi cảm giác terminal hoặc 8-bit.
- **Độ dày lớn:** Sử dụng `font-bold` hoặc `font-black` cho các tiêu đề.
- **Viết hoa (Uppercase):** Viết hoa các nhãn để tạo giao diện phần mềm retro cứng cáp.

## 4. Các thành phần (Components)

### Thành phần "Thanh tiêu đề" (Title Bar)
Một thành phần không thể thiếu của giao diện Win95/Retro.
```jsx
<div className="bg-[#000080] px-2 py-1 flex justify-between items-center border-b-2 border-b-[#808080]">
    <span className="text-white font-bold text-xs">APPLICATION.EXE</span>
    <div className="flex gap-1">
        <button className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-[10px]">_</button>
        <button className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-[10px]">X</button>
    </div>
</div>
```

## 5. Chiến lược Chế độ tối (Dark Mode)
Để thích ứng các thiết kế retro với Chế độ tối mà không làm mất đi tính thẩm mỹ:
- Thay thế **nền Teal** bằng màu xám rất đậm hoặc đen (`#1a1a1a`).
- Giữ nguyên **logic Đường viền 3D** nhưng sử dụng các sắc thái tối hơn (ví dụ: `#606060` cho các cạnh sáng và `black` cho các cạnh bóng).

---
*Được tạo bởi Antigravity - 15/01/2026*

