import { useState, useCallback, useEffect } from 'react';
import { getBoardConfig } from '../utils/boardConfig';

// Danh sách màu sắc cho Drawing
const DRAWING_COLORS = [
  { name: 'RED', class: 'bg-red-500 shadow-[0_0_8px_#ef4444]' },
  { name: 'ORANGE', class: 'bg-orange-500 shadow-[0_0_8px_#f97316]' },
  { name: 'YELLOW', class: 'bg-yellow-400 shadow-[0_0_8px_#facc15]' },
  { name: 'GREEN', class: 'bg-green-500 shadow-[0_0_8px_#22c55e]' },
  { name: 'CYAN', class: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' },
  { name: 'BLUE', class: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' },
  { name: 'PURPLE', class: 'bg-purple-500 shadow-[0_0_8px_#a855f7]' },
  { name: 'PINK', class: 'bg-pink-400 shadow-[0_0_8px_#f472b6]' },
  { name: 'WHITE', class: 'bg-white shadow-[0_0_8px_#ffffff]' },
  { name: 'BLACK', class: 'bg-gray-800 shadow-[0_0_8px_#1f2937]' },
];

// Export để ColorPalette có thể dùng
export { DRAWING_COLORS };

// Lấy class màu từ tên màu
const getColorClass = (colorName) => {
  const color = DRAWING_COLORS.find(c => c.name === colorName);
  return color ? color.class : 'bg-[#333] shadow-none opacity-40';
};

export const useDrawing = (isPlaying) => {
  const config = getBoardConfig();

  // Khởi tạo canvas rỗng
  const createEmptyCanvas = useCallback(() => {
    return Array(config.rows).fill(null).map(() => Array(config.cols).fill(null));
  }, [config.rows, config.cols]);

  const [canvas, setCanvas] = useState(createEmptyCanvas);
  const [selectedColor, setSelectedColor] = useState('RED');
  const [isErasing, setIsErasing] = useState(false);

  // Reset canvas when isPlaying changes (like other games)
  useEffect(() => {
    if (isPlaying) {
      // Start with empty canvas
      setCanvas(createEmptyCanvas());
      setSelectedColor('RED');
      setIsErasing(false);
    } else {
      // Clear state when back (isPlaying = false)
      setCanvas(createEmptyCanvas());
      setSelectedColor('RED');
      setIsErasing(false);
    }
  }, [isPlaying, createEmptyCanvas]);

  // Xử lý click vào pixel
  const handlePixelClick = (r, c) => {
    if (!isPlaying) return;

    // Chuyển từ 1-indexed sang 0-indexed
    const canvasR = r - 1;
    const canvasC = c - 1;

    // Kiểm tra ngoài phạm vi
    if (canvasR < 0 || canvasR >= config.rows || canvasC < 0 || canvasC >= config.cols) return;

    // Cập nhật canvas
    const newCanvas = canvas.map(row => [...row]);

    if (isErasing) {
      // Xóa pixel
      newCanvas[canvasR][canvasC] = null;
    } else {
      // Tô màu pixel
      newCanvas[canvasR][canvasC] = selectedColor;
    }

    setCanvas(newCanvas);
  };

  // Đổi màu bút
  const setColor = (colorName) => {
    setSelectedColor(colorName);
    setIsErasing(false); // Tắt eraser khi chọn màu
  };

  // Bật/tắt tẩy
  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  // Xóa toàn bộ canvas
  const clearCanvas = () => {
    setCanvas(createEmptyCanvas());
  };

  // Lấy màu pixel dựa trên canvas state
  const getPixelColor = (r, c) => {
    // Chuyển từ 1-indexed sang 0-indexed
    const canvasR = r - 1;
    const canvasC = c - 1;

    // Kiểm tra ngoài phạm vi
    if (canvasR < 0 || canvasR >= config.rows || canvasC < 0 || canvasC >= config.cols) {
      return 'bg-[#333] shadow-none opacity-40';
    }

    const cellColor = canvas[canvasR][canvasC];

    if (cellColor) {
      return getColorClass(cellColor);
    }

    // Ô trống
    return 'bg-[#333] shadow-none opacity-40';
  };

  return {
    canvas,
    selectedColor,
    isErasing,
    handlePixelClick,
    setColor,
    toggleEraser,
    clearCanvas,
    getPixelColor,
    getGameState: () => ({
      canvas,
      selectedColor,
      isErasing,
      config: {
        type: 'drawing',
        rows: config.rows,
        cols: config.cols
      }
    }),
  };
};
