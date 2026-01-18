import React from 'react';
import { Eraser, Trash2 } from 'lucide-react';
import { DRAWING_COLORS } from '../../hooks/useDrawing';

const ColorPalette = ({ 
  selectedColor, 
  isErasing, 
  onColorChange, 
  onToggleEraser, 
  onClear 
}) => {
  // Map màu sang Tailwind classes cho button
  const getButtonClass = (colorName) => {
    const colorMap = {
      RED: 'bg-red-500 hover:bg-red-400',
      ORANGE: 'bg-orange-500 hover:bg-orange-400',
      YELLOW: 'bg-yellow-400 hover:bg-yellow-300',
      GREEN: 'bg-green-500 hover:bg-green-400',
      CYAN: 'bg-cyan-400 hover:bg-cyan-300',
      BLUE: 'bg-blue-500 hover:bg-blue-400',
      PURPLE: 'bg-purple-500 hover:bg-purple-400',
      PINK: 'bg-pink-400 hover:bg-pink-300',
      WHITE: 'bg-white hover:bg-gray-100',
      BLACK: 'bg-gray-800 hover:bg-gray-700',
    };
    return colorMap[colorName] || 'bg-gray-500';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Grid màu 2x5 */}
      <div className="grid grid-cols-5 gap-2 p-2 bg-gray-800 rounded-lg">
        {DRAWING_COLORS.map((color) => (
          <button
            key={color.name}
            className={`
              w-8 h-8 rounded-full transition-all duration-200
              ${getButtonClass(color.name)}
              ${selectedColor === color.name && !isErasing 
                ? 'ring-2 ring-white scale-110 z-10' 
                : 'opacity-70 hover:opacity-100'
              }
            `}
            onClick={() => onColorChange(color.name)}
            title={color.name}
          />
        ))}
      </div>

      {/* Tools: Eraser & Clear */}
      <div className="flex gap-2 justify-center">
        <button
          className={`
            flex items-center gap-1 px-3 py-2 rounded-lg font-mono text-xs
            transition-all duration-200
            ${isErasing 
              ? 'bg-pink-500 text-white ring-2 ring-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }
          `}
          onClick={onToggleEraser}
        >
          <Eraser size={16} />
          ERASER
        </button>

        <button
          className="
            flex items-center gap-1 px-3 py-2 rounded-lg font-mono text-xs
            bg-red-600 text-white hover:bg-red-500 transition-all duration-200
          "
          onClick={onClear}
        >
          <Trash2 size={16} />
          CLEAR
        </button>
      </div>
    </div>
  );
};

export default ColorPalette;
