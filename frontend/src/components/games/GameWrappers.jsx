import React, { useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { useTicTacToe } from '../../hooks/useTicTacToe';
import { useCaro } from '../../hooks/useCaro';
import { useCaro5 } from '../../hooks/useCaro5';
import { useMatch3 } from '../../hooks/useMatch3';
import { useSnake } from '../../hooks/useSnake';

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
    getGameState: game.getGameState,
    loadGameState: game.loadGameState,
  }), [game.getPixelColor, game.handlePixelClick, game.resetGame, game.getGameState, game.loadGameState]);

  // Chỉ gọi callback khi có thay đổi thực sự
  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;

    const prevState = prevStateRef.current;
    const hasChanged = prevState.currentPlayer !== game.currentPlayer ||
      prevState.winner !== game.winner ||
      prevState.score !== game.score;

    if (hasChanged) {
      prevStateRef.current = { currentPlayer: game.currentPlayer, winner: game.winner, score: game.score };
      callbackRef.current({
        currentPlayer: game.currentPlayer,
        winner: game.winner,
        score: game.score,
        totalWins: game.totalWins, // For UI display
        resetGame: game.resetGame,
      });
    }
  }, [game.currentPlayer, game.winner, game.score, game.resetGame, isPlaying]);

  return null;
});
TicTacToeWrapper.displayName = 'TicTacToeWrapper';

// ===== CARO4 WRAPPER =====
export const Caro4Wrapper = forwardRef(({ isPlaying, botEnabled, onGameStateUpdate, rows, cols }, ref) => {
  const game = useCaro(isPlaying, botEnabled, rows, cols);
  const callbackRef = useRef(onGameStateUpdate);
  const prevStateRef = useRef({ currentPlayer: null, winner: null });

  useEffect(() => {
    callbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);

  useImperativeHandle(ref, () => ({
    getPixelColor: game.getPixelColor,
    handlePixelClick: game.handlePixelClick,
    resetGame: game.resetGame,
    getGameState: game.getGameState,
    loadGameState: game.loadGameState,
  }), [game.getPixelColor, game.handlePixelClick, game.resetGame, game.getGameState, game.loadGameState]);

  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;

    const prevState = prevStateRef.current;
    const hasChanged = prevState.currentPlayer !== game.currentPlayer ||
      prevState.winner !== game.winner ||
      prevState.score !== game.score;

    if (hasChanged) {
      prevStateRef.current = { currentPlayer: game.currentPlayer, winner: game.winner, score: game.score };
      callbackRef.current({
        currentPlayer: game.currentPlayer,
        winner: game.winner,
        score: game.score,
        totalWins: game.totalWins, // For UI display
        resetGame: game.resetGame,
      });
    }
  }, [game.currentPlayer, game.winner, game.score, game.resetGame, isPlaying]);

  return null;
});
Caro4Wrapper.displayName = 'Caro4Wrapper';

// ===== CARO5 WRAPPER =====
export const Caro5Wrapper = forwardRef(({ isPlaying, botEnabled, onGameStateUpdate, rows, cols }, ref) => {
  const game = useCaro5(isPlaying, botEnabled, rows, cols);
  const callbackRef = useRef(onGameStateUpdate);
  const prevStateRef = useRef({ currentPlayer: null, winner: null });

  useEffect(() => {
    callbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);

  useImperativeHandle(ref, () => ({
    getPixelColor: game.getPixelColor,
    handlePixelClick: game.handlePixelClick,
    resetGame: game.resetGame,
    getGameState: game.getGameState,
    loadGameState: game.loadGameState,
  }), [game.getPixelColor, game.handlePixelClick, game.resetGame, game.getGameState, game.loadGameState]);

  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;

    const prevState = prevStateRef.current;
    const hasChanged = prevState.currentPlayer !== game.currentPlayer ||
      prevState.winner !== game.winner ||
      prevState.score !== game.score;

    if (hasChanged) {
      prevStateRef.current = { currentPlayer: game.currentPlayer, winner: game.winner, score: game.score };
      callbackRef.current({
        currentPlayer: game.currentPlayer,
        winner: game.winner,
        score: game.score,
        totalWins: game.totalWins, // For UI display
        resetGame: game.resetGame,
      });
    }
  }, [game.currentPlayer, game.winner, game.score, game.resetGame, isPlaying]);

  return null;
});
Caro5Wrapper.displayName = 'Caro5Wrapper';

// ===== MATCH3 WRAPPER =====
export const Match3Wrapper = forwardRef(({ isPlaying, onScoreUpdate, onGameStateUpdate, onBoardUpdate }, ref) => {
  const game = useMatch3(isPlaying);
  const callbackRef = useRef(onScoreUpdate);
  const stateCallbackRef = useRef(onGameStateUpdate);
  const boardUpdateRef = useRef(onBoardUpdate);
  const prevScoreRef = useRef(null);
  const prevStateRef = useRef({ timeLeft: null, isGameOver: null });

  // Lưu game vào ref để luôn lấy được giá trị mới nhất
  const gameRef = useRef(game);
  gameRef.current = game;

  useEffect(() => {
    callbackRef.current = onScoreUpdate;
  }, [onScoreUpdate]);

  useEffect(() => {
    stateCallbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);

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
    getGameState: () => gameRef.current.getGameState(),
    loadGameState: (savedState) => gameRef.current.loadGameState?.(savedState),
    // Expose trực tiếp để GameMatrix có thể đọc
    get selected() { return gameRef.current.selected; },
    get board() { return gameRef.current.board; },
  }), []); // Không cần dependencies vì dùng gameRef

  // Gọi onBoardUpdate khi board hoặc selected thay đổi để force parent re-render
  useEffect(() => {
    if (isPlaying && boardUpdateRef.current) {
      boardUpdateRef.current();
    }
  }, [game.board, game.selected, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !callbackRef.current) return;

    if (prevScoreRef.current !== game.score) {
      prevScoreRef.current = game.score;
      callbackRef.current(game.score);
    }
  }, [game.score, isPlaying]);

  // Gọi onGameStateUpdate khi timeLeft hoặc isGameOver thay đổi
  useEffect(() => {
    if (!isPlaying || !stateCallbackRef.current) return;

    const prevState = prevStateRef.current;
    const hasChanged = prevState.timeLeft !== game.timeLeft ||
      prevState.isGameOver !== game.isGameOver;

    if (hasChanged) {
      prevStateRef.current = { timeLeft: game.timeLeft, isGameOver: game.isGameOver };
      stateCallbackRef.current({
        timeLeft: game.timeLeft,
        isGameOver: game.isGameOver,
      });
    }
  }, [game.timeLeft, game.isGameOver, isPlaying]);

  return null;
});
Match3Wrapper.displayName = 'Match3Wrapper';

// ===== SNAKE WRAPPER =====
export const SnakeWrapper = forwardRef(({ isPlaying, rows, cols, onScoreUpdate, onGameStateUpdate, onBoardUpdate }, ref) => {
  const game = useSnake(isPlaying, rows, cols);
  const scoreCallbackRef = useRef(onScoreUpdate);
  const stateCallbackRef = useRef(onGameStateUpdate);
  const boardUpdateRef = useRef(onBoardUpdate);
  const prevScoreRef = useRef(null);
  const prevGameOverRef = useRef(null);

  // Lưu game vào ref để luôn lấy được giá trị mới nhất
  const gameRef = useRef(game);
  gameRef.current = game;

  useEffect(() => {
    scoreCallbackRef.current = onScoreUpdate;
  }, [onScoreUpdate]);

  useEffect(() => {
    stateCallbackRef.current = onGameStateUpdate;
  }, [onGameStateUpdate]);

  useEffect(() => {
    boardUpdateRef.current = onBoardUpdate;
  }, [onBoardUpdate]);

  useImperativeHandle(ref, () => ({
    getPixelColor: (r, c) => gameRef.current.getPixelColor(r, c),
    changeDirection: (dir) => gameRef.current.changeDirection(dir),
    resetGame: () => gameRef.current.resetGame(),
    getGameState: () => gameRef.current.getGameState ? gameRef.current.getGameState() : { snake: gameRef.current.snake, food: gameRef.current.food, score: gameRef.current.score, isGameOver: gameRef.current.isGameOver },
    loadGameState: (savedState) => gameRef.current.loadGameState?.(savedState),
    get isGameOver() { return gameRef.current.isGameOver; },
    get score() { return gameRef.current.score; },
  }), []);

  // CRITICAL: Force parent re-render when snake moves
  useEffect(() => {
    if (isPlaying && boardUpdateRef.current) {
      boardUpdateRef.current();
    }
  }, [game.snake, isPlaying]);

  // Gọi onScoreUpdate khi score thay đổi
  useEffect(() => {
    if (!isPlaying || !scoreCallbackRef.current) return;

    if (prevScoreRef.current !== game.score) {
      prevScoreRef.current = game.score;
      scoreCallbackRef.current(game.score);
    }
  }, [game.score, isPlaying]);

  // Gọi onGameStateUpdate khi game state thay đổi
  useEffect(() => {
    if (!isPlaying || !stateCallbackRef.current) return;

    if (prevGameOverRef.current !== game.isGameOver) {
      prevGameOverRef.current = game.isGameOver;
      stateCallbackRef.current({
        isGameOver: game.isGameOver,
        resetGame: game.resetGame,
        changeDirection: game.changeDirection,
        direction: game.direction,
      });
    }
  }, [game.isGameOver, game.resetGame, game.changeDirection, game.direction, isPlaying]);

  return null;
});
SnakeWrapper.displayName = 'SnakeWrapper';

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
