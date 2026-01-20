import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  // Use ref for isDrawing to avoid stale closure issues
  const isDrawingRef = useRef(false);
  const selectedColorRef = useRef('RED');
  const isErasingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    isErasingRef.current = isErasing;
  }, [isErasing]);

  // Reset canvas when isPlaying changes (like other games)
  useEffect(() => {
    if (isPlaying) {
      setCanvas(createEmptyCanvas());
      setSelectedColor('RED');
      setIsErasing(false);
      isDrawingRef.current = false;
    } else {
      setCanvas(createEmptyCanvas());
      setSelectedColor('RED');
      setIsErasing(false);
      isDrawingRef.current = false;
    }
  }, [isPlaying, createEmptyCanvas]);

  // Global mouseup listener to stop drawing
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDrawingRef.current = false;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Vẽ pixel (dùng functional update để tránh stale state)
  const drawPixel = useCallback((r, c) => {
    const canvasR = r - 1;
    const canvasC = c - 1;

    if (canvasR < 0 || canvasR >= config.rows || canvasC < 0 || canvasC >= config.cols) return;

    setCanvas(prevCanvas => {
      const newValue = isErasingRef.current ? null : selectedColorRef.current;
      // Skip if same value (avoid unnecessary re-render)
      if (prevCanvas[canvasR][canvasC] === newValue) return prevCanvas;
      
      const newCanvas = prevCanvas.map(row => [...row]);
      newCanvas[canvasR][canvasC] = newValue;
      return newCanvas;
    });
  }, [config.rows, config.cols]);

  // Xử lý click vào pixel
  const handlePixelClick = useCallback((r, c) => {
    if (!isPlaying) return;
    drawPixel(r, c);
  }, [isPlaying, drawPixel]);

  // Xử lý mouse down - bắt đầu vẽ
  const startDrawing = useCallback((r, c) => {
    if (!isPlaying) return;
    isDrawingRef.current = true;
    drawPixel(r, c);
  }, [isPlaying, drawPixel]);

  // Xử lý mouse enter khi đang kéo (dùng ref nên không bị stale)
  const continueDrawing = useCallback((r, c) => {
    if (!isPlaying || !isDrawingRef.current) return;
    drawPixel(r, c);
  }, [isPlaying, drawPixel]);

  // Xử lý mouse up - dừng vẽ
  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  // Đổi màu bút
  const setColor = useCallback((colorName) => {
    setSelectedColor(colorName);
    setIsErasing(false);
  }, []);

  // Bật/tắt tẩy
  const toggleEraser = useCallback(() => {
    setIsErasing(prev => !prev);
  }, []);

  // Xóa toàn bộ canvas
  const clearCanvas = useCallback(() => {
    setCanvas(createEmptyCanvas());
  }, [createEmptyCanvas]);

  // Lấy màu pixel dựa trên canvas state
  const getPixelColor = useCallback((r, c) => {
    const canvasR = r - 1;
    const canvasC = c - 1;

    if (canvasR < 0 || canvasR >= config.rows || canvasC < 0 || canvasC >= config.cols) {
      return 'bg-[#333] shadow-none opacity-40';
    }

    const cellColor = canvas[canvasR][canvasC];
    return cellColor ? getColorClass(cellColor) : 'bg-[#333] shadow-none opacity-40';
  }, [canvas, config.rows, config.cols]);

  // Load game state from saved data
  const loadGameState = useCallback((savedState) => {
    if (savedState?.canvas) {
      setCanvas(savedState.canvas);
      setSelectedColor(savedState.selectedColor || 'RED');
      setIsErasing(savedState.isErasing || false);
    }
  }, []);

  return {
    canvas,
    selectedColor,
    isErasing,
    isDrawing: isDrawingRef.current,
    handlePixelClick,
    startDrawing,
    continueDrawing,
    stopDrawing,
    setColor,
    toggleEraser,
    clearCanvas,
    getPixelColor,
    loadGameState,
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
