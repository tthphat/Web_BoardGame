import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { flushSync } from 'react-dom';
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
  SnakeWrapper,
  PREVIEW_FUNCTIONS,
  getActiveGamePixel
} from './GameWrappers';

// Screen previews cho Heart (default)
import { getHeartPixel } from './screens/HeartScreen';

// Kích thước gốc của các game screens (được thiết kế cho 13x13)
const ORIGINAL_GAME_SIZE = 13;

import { useSettings } from '../../contexts/SettingsContext';

// ... (imports)

const GameMatrix = forwardRef(({
  screen = 'HEART',
  isPlaying = false,
  onScoreUpdate,
  onGameStateUpdate,
  activeGameState,
  onCardClick,
  botEnabled = false,
  drawingState
}, ref) => {
  const { activeConfig } = useSettings();
  const defaultConfig = getBoardConfig();

  // Use active config from settings if available, otherwise default
  const cols = activeConfig?.cols || defaultConfig.cols;
  const rows = activeConfig?.rows || defaultConfig.rows;
  const dotSize = activeConfig?.dot_size || defaultConfig.dotSize; // Note: Database uses dot_size, utils uses dotSize
  const gap = activeConfig?.gap || defaultConfig.gap;

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
  // IMPORTANT: These refs are stable across renders
  const ticTacToeRef = useRef(null);
  const caro4Ref = useRef(null);
  const caro5Ref = useRef(null);
  const match3Ref = useRef(null);
  const snakeRef = useRef(null);

  const gameRefs = {
    ticTacToe: ticTacToeRef,
    caro4: caro4Ref,
    caro5: caro5Ref,
    match3: match3Ref,
    snake: snakeRef,
  };

  // Helper: Lấy ref của game hiện tại dựa trên registry
  const getActiveGameRef = useCallback(() => {
    const refKey = gameConfig?.refKey;
    return refKey ? gameRefs[refKey] : null;
  }, [gameConfig?.refKey]);

  // Expose getGameState and loadGameState via ref
  useImperativeHandle(ref, () => ({
    getGameState: () => {
      // 1. Games with Wrappers (TicTacToe, Caro, Snake, Match3)
      if (gameConfig?.hasWrapper) {
        const refKey = gameConfig?.refKey;
        const gameRef = refKey ? gameRefs[refKey] : null;
        console.log('[GameMatrix] getGameState - screen:', screen, 'refKey:', refKey, 'gameRef:', gameRef?.current);
        if (gameRef?.current?.getGameState) {
          return gameRef.current.getGameState();
        }
      }

      // 2. Drawing Game
      if (screen === 'DRAWING' && drawingState?.getGameState) {
        return drawingState.getGameState();
      }

      // 3. Memory Game
      if (screen === 'MEMORY' && activeGameState?.getGameState) {
        return activeGameState.getGameState();
      }

      console.warn('GameMatrix: No getGameState method found for current screen:', screen);
      return null;
    },

    loadGameState: (savedState) => {
      // 1. Games with Wrappers (TicTacToe, Caro, Snake, Match3)
      if (gameConfig?.hasWrapper) {
        const refKey = gameConfig?.refKey;
        const gameRef = refKey ? gameRefs[refKey] : null;
        console.log('[GameMatrix] loadGameState - screen:', screen, 'refKey:', refKey);
        if (gameRef?.current?.loadGameState) {
          gameRef.current.loadGameState(savedState);
          // Force synchronous re-render to update UI immediately
          flushSync(() => setForceRenderKey(prev => prev + 1));
          // Trigger another re-render after hook state has propagated
          setTimeout(() => setForceRenderKey(prev => prev + 1), 10);
          return true;
        }
      }

      // 2. Drawing Game
      if (screen === 'DRAWING' && drawingState?.loadGameState) {
        drawingState.loadGameState(savedState);
        flushSync(() => setForceRenderKey(prev => prev + 1));
        return true;
      }

      // 3. Memory Game
      if (screen === 'MEMORY' && activeGameState?.loadGameState) {
        activeGameState.loadGameState(savedState);
        flushSync(() => setForceRenderKey(prev => prev + 1));
        return true;
      }

      console.warn('GameMatrix: No loadGameState method found for current screen:', screen);
      return false;
    }
  }), [screen, activeGameState, gameConfig, drawingState]);


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

        // Dùng registry: useFullCoords (true cho CARO4, CARO5, SNAKE)
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

  // ===== XỬ LÝ CLICK PIXEL =====
  const handlePixelClick = (r, c) => {
    if (!isPlaying) return;

    const gameR = r - offsetRow;
    const gameC = c - offsetCol;

    const gameRef = getActiveGameRef();

    // Games có wrapper
    if (gameConfig?.hasWrapper && gameRef?.current?.handlePixelClick) {
      // Match3 dùng offset coords
      if (screen === 'MATCH3') {
        gameRef.current.handlePixelClick(gameR, gameC);
        return;
      }

      // Các game dùng fullCoords
      if (gameConfig?.useFullCoords) {
        gameRef.current.handlePixelClick(r, c);
        return;
      }

      gameRef.current.handlePixelClick(gameR, gameC);
      return;
    }

    // Drawing game (external state)
    if (screen === 'DRAWING' && drawingState?.handlePixelClick) {
      // Drawing dùng full coords (1-indexed)
      drawingState.handlePixelClick(r, c);
      return;
    }

    // Memory game (external state)
    if (screen === 'MEMORY' && activeGameState) {
      // Cards are at positions 4, 6, 8, 10 (matching ActiveMemoryScreen.js)
      const rowMap = { 4: 0, 6: 1, 8: 2, 10: 3 };
      const colMap = { 4: 0, 6: 1, 8: 2, 10: 3 };

      const cardRow = rowMap[gameR];
      const cardCol = colMap[gameC];

      if (cardRow !== undefined && cardCol !== undefined) {
        const cardIndex = cardRow * 4 + cardCol;
        if (cardIndex >= 0 && cardIndex < 16 && onCardClick) {
          onCardClick(cardIndex);
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
          rows={rows}
          cols={cols}
          onGameStateUpdate={screen === 'CARO4' ? onGameStateUpdate : undefined}
        />
      )}
      {GAME_REGISTRY.CARO5.hasWrapper && (
        <Caro5Wrapper
          ref={gameRefs.caro5}
          isPlaying={isPlaying && screen === 'CARO5'}
          botEnabled={true}
          rows={rows}
          cols={cols}
          onGameStateUpdate={screen === 'CARO5' ? onGameStateUpdate : undefined}
        />
      )}
      {GAME_REGISTRY.MATCH3.hasWrapper && (
        <Match3Wrapper
          ref={gameRefs.match3}
          isPlaying={isPlaying && screen === 'MATCH3'}
          onScoreUpdate={screen === 'MATCH3' ? onScoreUpdate : undefined}
          onGameStateUpdate={screen === 'MATCH3' ? onGameStateUpdate : undefined}
          onBoardUpdate={screen === 'MATCH3' ? handleBoardUpdate : undefined}
        />
      )}
      {GAME_REGISTRY.SNAKE.hasWrapper && (
        <SnakeWrapper
          ref={gameRefs.snake}
          isPlaying={isPlaying && screen === 'SNAKE'}
          rows={rows}
          cols={cols}
          onScoreUpdate={screen === 'SNAKE' ? onScoreUpdate : undefined}
          onGameStateUpdate={screen === 'SNAKE' ? onGameStateUpdate : undefined}
          onBoardUpdate={screen === 'SNAKE' ? handleBoardUpdate : undefined}
        />
      )}
    </>
  );

  // ===== AUTO SCALING =====
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Calculate desired board dimensions
      const boardWidth = cols * dotSize + (cols - 1) * gap;
      const boardHeight = rows * dotSize + (rows - 1) * gap;

      // Add some padding (e.g. 20px)
      const availableW = containerWidth - 40;
      const availableH = containerHeight - 40;

      const scaleX = availableW / boardWidth;
      const scaleY = availableH / boardHeight;

      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [cols, rows, dotSize, gap]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden" ref={containerRef}>
      {/* Game Wrapper Components */}
      {renderWrappers()}

      {/* Render board grid */}
      <div
        className="grid origin-center transition-transform duration-300"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
          transform: `scale(${scale})`
        }}
        key={forceRenderKey}
        onMouseLeave={() => {
          // Stop drawing when mouse leaves the board
          if (screen === 'DRAWING' && drawingState?.stopDrawing) {
            drawingState.stopDrawing();
          }
        }}
        onMouseUp={() => {
          // Stop drawing when mouse is released
          if (screen === 'DRAWING' && drawingState?.stopDrawing) {
            drawingState.stopDrawing();
          }
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const r = Math.floor(index / cols) + 1;
          const c = (index % cols) + 1;
          const colorClass = getPixelColor(r, c);

          return (
            <div
              key={`${r}-${c}`}
              className={`rounded-full cursor-pointer transition-all duration-200 ${colorClass}`}
              style={{ width: dotSize, height: dotSize }}
              onClick={() => handlePixelClick(r, c)}
              onMouseDown={() => {
                // Start drawing when mouse is pressed (Drawing game only)
                if (screen === 'DRAWING' && drawingState?.startDrawing) {
                  drawingState.startDrawing(r, c);
                }
              }}
              onMouseEnter={() => {
                // Continue drawing when dragging (Drawing game only)
                if (screen === 'DRAWING' && drawingState?.continueDrawing) {
                  drawingState.continueDrawing(r, c);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

export default GameMatrix;