import React, { useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { useTicTacToe } from '../../hooks/useTicTacToe';
import { useCaro } from '../../hooks/useCaro';
import { useCaro5 } from '../../hooks/useCaro5';
import { useMatch3 } from '../../hooks/useMatch3';

// Screen previews
import { getTicTacToePixel } from './screens/TicTacToeScreen';
import { getCaro4Pixel } from './screens/Caro4Screen';
import { getCaro5Pixel } from './screens/Caro5Screen';
import { getMatch3Pixel } from './screens/Match3Screen';
import { getMemoryPixel } from './screens/MemoryScreen';
import { getActiveMemoryPixel } from './screens/ActiveMemoryScreen';
import { getSnakePixel } from './screens/SnakeScreen';
import { getDrawingPixel } from './screens/DrawingScreen';
import { getHeartPixel } from './screens/HeartScreen';

/**
 * GAME WRAPPER COMPONENTS
 * 
 * Mỗi wrapper component:
 * 1. Khởi tạo hook tương ứng
 * 2. Expose getPixelColor, handlePixelClick, gameState qua ref
 * 3. Sync state với parent qua callbacks
 * 
 * IMPORTANT: Dùng useRef cho callbacks và so sánh trước khi update để tránh infinite loop
 */

// ===== TIC TAC TOE WRAPPER =====
export const TicTacToeWrapper = forwardRef(({ isPlaying, botEnabled, onGameStateUpdate }, ref) => {
  const game = useTicTacToe(isPlaying, botEnabled);
  const callbackRef = useRef(onGameStateUpdate);
  const prevStateRef = useRef({ currentPlayer: null, winner: null });
  
  // Cập nhật callback ref
  useEffect(() => {
    callbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);
  
  useImperativeHandle(ref, () => ({
    getPixelColor: game.getPixelColor,
    handlePixelClick: game.handlePixelClick,
    resetGame: game.resetGame,
  }), [game.getPixelColor, game.handlePixelClick, game.resetGame]);

  // Chỉ gọi callback khi có thay đổi thực sự
  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;
    
    const prevState = prevStateRef.current;
    const hasChanged = prevState.currentPlayer !== game.currentPlayer || 
                       prevState.winner !== game.winner;
    
    if (hasChanged) {
      prevStateRef.current = { currentPlayer: game.currentPlayer, winner: game.winner };
      callbackRef.current({
        currentPlayer: game.currentPlayer,
        winner: game.winner,
        resetGame: game.resetGame,
      });
    }
  }, [game.currentPlayer, game.winner, game.resetGame, isPlaying]);

  return null;
});
TicTacToeWrapper.displayName = 'TicTacToeWrapper';

// ===== CARO4 WRAPPER =====
export const Caro4Wrapper = forwardRef(({ isPlaying, botEnabled, onGameStateUpdate }, ref) => {
  const game = useCaro(isPlaying, botEnabled);
  const callbackRef = useRef(onGameStateUpdate);
  const prevStateRef = useRef({ currentPlayer: null, winner: null });
  
  useEffect(() => {
    callbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);
  
  useImperativeHandle(ref, () => ({
    getPixelColor: game.getPixelColor,
    handlePixelClick: game.handlePixelClick,
    resetGame: game.resetGame,
  }), [game.getPixelColor, game.handlePixelClick, game.resetGame]);

  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;
    
    const prevState = prevStateRef.current;
    const hasChanged = prevState.currentPlayer !== game.currentPlayer || 
                       prevState.winner !== game.winner;
    
    if (hasChanged) {
      prevStateRef.current = { currentPlayer: game.currentPlayer, winner: game.winner };
      callbackRef.current({
        currentPlayer: game.currentPlayer,
        winner: game.winner,
        resetGame: game.resetGame,
      });
    }
  }, [game.currentPlayer, game.winner, game.resetGame, isPlaying]);

  return null;
});
Caro4Wrapper.displayName = 'Caro4Wrapper';

// ===== CARO5 WRAPPER =====
export const Caro5Wrapper = forwardRef(({ isPlaying, botEnabled, onGameStateUpdate }, ref) => {
  const game = useCaro5(isPlaying, botEnabled);
  const callbackRef = useRef(onGameStateUpdate);
  const prevStateRef = useRef({ currentPlayer: null, winner: null });
  
  useEffect(() => {
    callbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);
  
  useImperativeHandle(ref, () => ({
    getPixelColor: game.getPixelColor,
    handlePixelClick: game.handlePixelClick,
    resetGame: game.resetGame,
  }), [game.getPixelColor, game.handlePixelClick, game.resetGame]);

  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;
    
    const prevState = prevStateRef.current;
    const hasChanged = prevState.currentPlayer !== game.currentPlayer || 
                       prevState.winner !== game.winner;
    
    if (hasChanged) {
      prevStateRef.current = { currentPlayer: game.currentPlayer, winner: game.winner };
      callbackRef.current({
        currentPlayer: game.currentPlayer,
        winner: game.winner,
        resetGame: game.resetGame,
      });
    }
  }, [game.currentPlayer, game.winner, game.resetGame, isPlaying]);

  return null;
});
Caro5Wrapper.displayName = 'Caro5Wrapper';

// ===== MATCH3 WRAPPER =====
export const Match3Wrapper = forwardRef(({ isPlaying, onScoreUpdate, onBoardUpdate }, ref) => {
  const game = useMatch3(isPlaying);
  const callbackRef = useRef(onScoreUpdate);
  const boardUpdateRef = useRef(onBoardUpdate);
  const prevScoreRef = useRef(null);
  
  // Lưu game vào ref để luôn lấy được giá trị mới nhất
  const gameRef = useRef(game);
  gameRef.current = game;
  
  useEffect(() => {
    callbackRef.current = onScoreUpdate;
  }, [onScoreUpdate]);
  
  useEffect(() => {
    boardUpdateRef.current = onBoardUpdate;
  }, [onBoardUpdate]);
  
  // Dùng getter functions để luôn lấy state mới nhất
  useImperativeHandle(ref, () => ({
    getPixelColor: (r, c) => {
      const currentGame = gameRef.current;
      return currentGame.board[r - 1]?.[c - 1] || 'bg-[#222] opacity-20';
    },
    handlePixelClick: (r, c) => {
      const currentGame = gameRef.current;
      currentGame.handlePixelClick(r - 1, c - 1);
    },
    getSelected: () => gameRef.current.selected,
    getBoard: () => gameRef.current.board,
    // Expose trực tiếp để GameMatrix có thể đọc
    get selected() { return gameRef.current.selected; },
    get board() { return gameRef.current.board; },
  }), []); // Không cần dependencies vì dùng gameRef

  // Gọi onBoardUpdate khi board thay đổi để force parent re-render
  useEffect(() => {
    if (isPlaying && boardUpdateRef.current) {
      boardUpdateRef.current();
    }
  }, [game.board, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;
    
    if (prevScoreRef.current !== game.score) {
      prevScoreRef.current = game.score;
      callbackRef.current(game.score);
    }
  }, [game.score, isPlaying]);

  return null;
});
Match3Wrapper.displayName = 'Match3Wrapper';

/**
 * PREVIEW FUNCTIONS REGISTRY
 * Map screen name to preview function
 */
export const PREVIEW_FUNCTIONS = {
  HEART: getHeartPixel,
  TICTACTOE: getTicTacToePixel,
  CARO4: getCaro4Pixel,
  CARO5: getCaro5Pixel,
  MATCH3: getMatch3Pixel,
  MEMORY: getMemoryPixel,
  SNAKE: getSnakePixel,
  DRAWING: getDrawingPixel,
};

/**
 * ACTIVE GAME FUNCTIONS
 * For games with external state (Memory, Drawing)
 */
export const getActiveGamePixel = (screen, r, c, activeState) => {
  if (screen === 'MEMORY' && activeState) {
    return getActiveMemoryPixel(r, c, activeState);
  }
  if (screen === 'DRAWING' && activeState) {
    return activeState.getPixelColor(r, c);
  }
  return null;
};
