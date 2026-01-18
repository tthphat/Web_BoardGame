import React, { useRef, useState, useCallback } from 'react';
import { getBoardConfig } from '../../utils/boardConfig';
import { 
  GAME_REGISTRY, 
  getGameConfig, 
  HIDE_OUTSIDE_DOTS_GAMES 
} from '../../config/gameRegistry';
import { 
  TicTacToeWrapper, 
  Caro4Wrapper, 
  Caro5Wrapper, 
  Match3Wrapper,
  PREVIEW_FUNCTIONS,
  getActiveGamePixel 
} from './GameWrappers';

// Screen previews cho Heart (default)
import { getHeartPixel } from './screens/HeartScreen';

// Kích thước gốc của các game screens (được thiết kế cho 13x13)
const ORIGINAL_GAME_SIZE = 13;

const GameMatrix = ({ 
  screen = 'HEART', 
  isPlaying = false, 
  onScoreUpdate, 
  onGameStateUpdate,
  activeGameState, 
  onCardClick,
  botEnabled = false,
  drawingState
}) => {
  const { cols, rows, dotSize, gap } = getBoardConfig();
  
  // Force re-render key để cập nhật UI khi Match3 board thay đổi
  const [forceRenderKey, setForceRenderKey] = useState(0);
  
  // Callback để Match3 wrapper gọi khi board thay đổi
  const handleBoardUpdate = useCallback(() => {
    setForceRenderKey(prev => prev + 1);
  }, []);
  
  // Lấy config của game hiện tại từ registry
  const gameConfig = getGameConfig(screen);
  
  // ===== REFS OBJECT - Map refKey -> ref =====
  // Do React hooks không thể tạo động, ta phải khai báo sẵn
  // nhưng dùng object để lookup theo refKey từ registry
  const gameRefs = {
    ticTacToe: useRef(null),
    caro4: useRef(null),
    caro5: useRef(null),
    match3: useRef(null),
  };
  
  // Helper: Lấy ref của game hiện tại dựa trên registry
  const getActiveGameRef = () => {
    const refKey = gameConfig?.refKey;
    return refKey ? gameRefs[refKey] : null;
  };

  // Fullboard: dùng toàn bộ board thay vì 13x13
  const useFullboard = isPlaying && gameConfig?.fullboard;

  // Tính offset để căn giữa (0 nếu fullboard)
  const offsetCol = useFullboard ? 0 : Math.floor((cols - ORIGINAL_GAME_SIZE) / 2);
  const offsetRow = useFullboard ? 0 : Math.floor((rows - ORIGINAL_GAME_SIZE) / 2);

  // ===== HÀM LẤY MÀU PIXEL - Dùng registry config =====
  const getPixelColor = (r, c) => {
    const gameR = r - offsetRow;
    const gameC = c - offsetCol;
    
    const maxRows = useFullboard ? rows : ORIGINAL_GAME_SIZE;
    const maxCols = useFullboard ? cols : ORIGINAL_GAME_SIZE;

    // Kiểm tra nằm ngoài vùng game
    const isOutside = gameR < 1 || gameR > maxRows || gameC < 1 || gameC > maxCols;
    if (isOutside) {
      // Dùng registry: hideOutsideDots
      if (HIDE_OUTSIDE_DOTS_GAMES.includes(screen) && isPlaying) {
        return 'bg-transparent shadow-none opacity-0';
      }
      return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';
    }

    // === ĐANG CHƠI ===
    if (isPlaying) {
      const gameRef = getActiveGameRef();
      
      // Games có wrapper (từ registry: hasWrapper = true)
      if (gameConfig?.hasWrapper && gameRef?.current?.getPixelColor) {
        // Match3 cần kiểm tra thêm vùng chơi và selected state
        if (screen === 'MATCH3') {
          if (gameR < 1 || gameR > ORIGINAL_GAME_SIZE || gameC < 1 || gameC > ORIGINAL_GAME_SIZE) {
            return 'bg-transparent shadow-none opacity-0';
          }
          let classes = gameRef.current.getPixelColor(gameR, gameC);
          if (gameRef.current?.selected?.r === gameR - 1 && gameRef.current?.selected?.c === gameC - 1) {
            classes += ' ring-4 ring-white z-20 scale-110';
          }
          return classes;
        }
        
        // Dùng registry: useFullCoords (true cho CARO4, CARO5)
        if (gameConfig?.useFullCoords) {
          return gameRef.current.getPixelColor(r, c);
        }
        return gameRef.current.getPixelColor(gameR, gameC);
      }
      
      // Games với external state (từ registry: externalState)
      if (gameConfig?.externalState) {
        const externalData = gameConfig.externalState === 'activeGameState' 
          ? activeGameState 
          : drawingState;
        
        if (externalData) {
          // Drawing dùng full coords
          if (gameConfig?.useFullCoords && externalData.getPixelColor) {
            return externalData.getPixelColor(r, c);
          }
          // Memory và các game khác
          const activePixel = getActiveGamePixel(screen, gameR, gameC, externalData);
          if (activePixel) return activePixel;
        }
      }
    }

    // === PREVIEW: Dùng static screen functions ===
    const previewFn = PREVIEW_FUNCTIONS[screen];
    if (previewFn) {
      // Fullboard preview dùng full coords
      if (useFullboard) return previewFn(r, c);
      return previewFn(gameR, gameC);
    }
    
    // Default: Heart screen
    return getHeartPixel(gameR, gameC);
  };

  // Tạo lưới dữ liệu
  const grid = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      grid.push({ r, c, colorClass: getPixelColor(r, c) });
    }
  }

  /* --- Logic Drag-to-Scroll --- */
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
    scrollRef.current.scrollTop = scrollTop - (y - startY) * 1.5;
  };

  // ===== XỬ LÝ CLICK - Dùng registry config =====
  const onPixelClick = (r, c) => {
    if (isDragging || !isPlaying) return;
    
    const gameR = r - offsetRow;
    const gameC = c - offsetCol;
    const gameRef = getActiveGameRef();

    // Games có wrapper
    if (gameConfig?.hasWrapper && gameRef?.current?.handlePixelClick) {
      // Dùng registry: useFullCoords
      if (gameConfig?.useFullCoords) {
        gameRef.current.handlePixelClick(r, c);
      } else {
        gameRef.current.handlePixelClick(gameR, gameC);
      }
      return;
    }

    // Games với external state
    if (gameConfig?.externalState) {
      // Drawing
      if (gameConfig.externalState === 'drawingState' && drawingState?.handlePixelClick) {
        drawingState.handlePixelClick(r, c);
        return;
      }
      
      // Memory - có logic đặc biệt cho vị trí cards
      if (gameConfig.externalState === 'activeGameState' && onCardClick) {
        const validPositions = { 4: 0, 6: 1, 8: 2, 10: 3 };
        const cardRow = validPositions[gameR];
        const cardCol = validPositions[gameC];
        if (cardRow !== undefined && cardCol !== undefined) {
          onCardClick(cardRow * 4 + cardCol);
        }
      }
    }
  };

  // ===== RENDER WRAPPERS - Dựa trên registry =====
  // Chỉ render wrappers cho games có hasWrapper = true
  const renderWrappers = () => (
    <>
      {GAME_REGISTRY.TICTACTOE.hasWrapper && (
        <TicTacToeWrapper 
          ref={gameRefs.ticTacToe}
          isPlaying={isPlaying && screen === 'TICTACTOE'}
          botEnabled={botEnabled}
          onGameStateUpdate={screen === 'TICTACTOE' ? onGameStateUpdate : undefined}
        />
      )}
      {GAME_REGISTRY.CARO4.hasWrapper && (
        <Caro4Wrapper 
          ref={gameRefs.caro4}
          isPlaying={isPlaying && screen === 'CARO4'}
          botEnabled={true}
          onGameStateUpdate={screen === 'CARO4' ? onGameStateUpdate : undefined}
        />
      )}
      {GAME_REGISTRY.CARO5.hasWrapper && (
        <Caro5Wrapper 
          ref={gameRefs.caro5}
          isPlaying={isPlaying && screen === 'CARO5'}
          botEnabled={true}
          onGameStateUpdate={screen === 'CARO5' ? onGameStateUpdate : undefined}
        />
      )}
      {GAME_REGISTRY.MATCH3.hasWrapper && (
        <Match3Wrapper 
          ref={gameRefs.match3}
          isPlaying={isPlaying && screen === 'MATCH3'}
          onScoreUpdate={screen === 'MATCH3' ? onScoreUpdate : undefined}
          onBoardUpdate={screen === 'MATCH3' ? handleBoardUpdate : undefined}
        />
      )}
    </>
  );

  return (
    <>
      {/* Game Wrapper Components */}
      {renderWrappers()}

      {/* Game Board */}
      <div
        ref={scrollRef}
        className={`bg-[#111] p-3 rounded-lg border-4 border-[#444] shadow-[inset_0_0_20px_black] inline-block max-w-full overflow-auto max-h-[85vh] ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
            gap: `${gap}px`
          }}
        >
          {grid.map((dot, index) => (
            <div
              key={index}
              className={`rounded-full ${dot.colorClass} transition-all duration-300`}
              style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
              onClick={() => onPixelClick(dot.r, dot.c)}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameMatrix;