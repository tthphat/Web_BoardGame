import { useState, useEffect, useCallback } from 'react';
import { getBoardConfig } from '../utils/boardConfig';

// 4 hướng kiểm tra: ngang, dọc, chéo phải, chéo trái
const DIRECTIONS = [
  { dr: 0, dc: 1 },   // Ngang →
  { dr: 1, dc: 0 },   // Dọc ↓
  { dr: 1, dc: 1 },   // Chéo phải ↘
  { dr: 1, dc: -1 },  // Chéo trái ↙
];

const WIN_COUNT = 4; // Số quân cần để thắng

export const useCaro = (isPlaying) => {
  const config = getBoardConfig(); // { cols, rows, dotSize, gap }
  
  // Khởi tạo board rỗng
  const createEmptyBoard = useCallback(() => {
    return Array(config.rows).fill(null).map(() => Array(config.cols).fill(null));
  }, [config.rows, config.cols]);

  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState('BLUE'); // BLUE đi trước
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]); // [{r, c}, ...]

  // Reset game khi bắt đầu chơi
  useEffect(() => {
    if (isPlaying) {
      setBoard(createEmptyBoard());
      setCurrentPlayer('BLUE');
      setWinner(null);
      setWinningLine([]);
    }
  }, [isPlaying, createEmptyBoard]);

  // Kiểm tra thắng từ vị trí (r, c)
  const checkWinnerAt = (boardState, r, c, player) => {
    for (const { dr, dc } of DIRECTIONS) {
      const line = [{ r, c }];
      
      // Đếm theo hướng dương
      let nr = r + dr;
      let nc = c + dc;
      while (
        nr >= 0 && nr < config.rows &&
        nc >= 0 && nc < config.cols &&
        boardState[nr][nc] === player
      ) {
        line.push({ r: nr, c: nc });
        nr += dr;
        nc += dc;
      }
      
      // Đếm theo hướng âm
      nr = r - dr;
      nc = c - dc;
      while (
        nr >= 0 && nr < config.rows &&
        nc >= 0 && nc < config.cols &&
        boardState[nr][nc] === player
      ) {
        line.push({ r: nr, c: nc });
        nr -= dr;
        nc -= dc;
      }
      
      // Nếu đủ 4 quân liên tiếp -> thắng
      if (line.length >= WIN_COUNT) {
        return line;
      }
    }
    return null;
  };

  // Kiểm tra hòa (board đầy)
  const checkDraw = (boardState) => {
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (boardState[r][c] === null) return false;
      }
    }
    return true;
  };

  // Xử lý click vào ô
  const handlePixelClick = (r, c) => {
    if (!isPlaying || winner) return;
    
    // Chuyển từ 1-indexed (từ GameMatrix) sang 0-indexed
    const boardR = r - 1;
    const boardC = c - 1;
    
    // Kiểm tra ngoài phạm vi
    if (boardR < 0 || boardR >= config.rows || boardC < 0 || boardC >= config.cols) return;
    
    // Kiểm tra ô đã có quân chưa
    if (board[boardR][boardC] !== null) return;

    // Đặt quân
    const newBoard = board.map(row => [...row]);
    newBoard[boardR][boardC] = currentPlayer;
    setBoard(newBoard);

    // Kiểm tra thắng
    const winLine = checkWinnerAt(newBoard, boardR, boardC, currentPlayer);
    if (winLine) {
      setWinner(currentPlayer);
      setWinningLine(winLine);
      return;
    }

    // Kiểm tra hòa
    if (checkDraw(newBoard)) {
      setWinner('DRAW');
      return;
    }

    // Chuyển lượt
    setCurrentPlayer(currentPlayer === 'BLUE' ? 'RED' : 'BLUE');
  };

  // Lấy màu pixel dựa trên state
  const getPixelColor = (r, c) => {
    // Chuyển từ 1-indexed sang 0-indexed
    const boardR = r - 1;
    const boardC = c - 1;
    
    // Kiểm tra ngoài phạm vi
    if (boardR < 0 || boardR >= config.rows || boardC < 0 || boardC >= config.cols) {
      return 'bg-[#333] shadow-none opacity-40';
    }

    const cellValue = board[boardR][boardC];
    const isWinning = winningLine.some(pos => pos.r === boardR && pos.c === boardC);
    const pulseClass = isWinning ? 'animate-pulse' : '';

    if (cellValue === 'BLUE') {
      return `bg-blue-500 shadow-[0_0_8px_#3b82f6] ${pulseClass}`;
    }
    if (cellValue === 'RED') {
      return `bg-red-500 shadow-[0_0_8px_#ef4444] ${pulseClass}`;
    }
    
    // Ô trống
    return 'bg-[#333] shadow-none opacity-40';
  };

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('BLUE');
    setWinner(null);
    setWinningLine([]);
  }, [createEmptyBoard]);

  return {
    board,
    currentPlayer,
    winner,
    winningLine,
    handlePixelClick,
    getPixelColor,
    resetGame,
  };
};
