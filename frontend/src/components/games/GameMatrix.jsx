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
  const { activeBoardConfig } = useSettings();
  const defaultConfig = getBoardConfig();

  // Use active config from settings if available, otherwise default
  const cols = activeBoardConfig?.cols || defaultConfig.cols;
  const rows = activeBoardConfig?.rows || defaultConfig.rows;
  const dotSize = activeBoardConfig?.dot_size || defaultConfig.dotSize; // Note: Database uses dot_size, utils uses dotSize
  const gap = activeBoardConfig?.gap || defaultConfig.gap;

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
    snake: useRef(null),
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
          onGameStateUpdate={screen === 'MATCH3' ? onGameStateUpdate : undefined}
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

  return (
    <>
      {/* Game Wrapper Components */}
      {renderWrappers()}

      {/* Render board grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
        }}
        key={forceRenderKey}
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
            />
          );
        })}
      </div>
    </>
  );
};

export default GameMatrix;