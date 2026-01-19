import { useState, useEffect, useCallback } from 'react';
import { getBoardConfig } from '../utils/boardConfig';

// 4 hướng kiểm tra: ngang, dọc, chéo phải, chéo trái
const DIRECTIONS = [
  { dr: 0, dc: 1 },   // Ngang →
  { dr: 1, dc: 0 },   // Dọc ↓
  { dr: 1, dc: 1 },   // Chéo phải ↘
  { dr: 1, dc: -1 },  // Chéo trái ↙
];

const WIN_COUNT = 5; // Số quân cần để thắng (Caro5)

// Tìm tất cả ô trống trên board 2D
const getEmptyCells = (board, rows, cols) => {
  const emptyCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }
  return emptyCells;
};

export const useCaro5 = (isPlaying, botEnabled = false) => {
  const config = getBoardConfig(); // { cols, rows, dotSize, gap }
  
  // Khởi tạo board rỗng
  const createEmptyBoard = useCallback(() => {
    return Array(config.rows).fill(null).map(() => Array(config.cols).fill(null));
  }, [config.rows, config.cols]);

  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState('BLUE'); // BLUE đi trước
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]); // [{r, c}, ...]
  const [score, setScore] = useState(0); // Count player wins

  // Reset game khi bắt đầu chơi (keep score)
  useEffect(() => {
    if (isPlaying) {
      setBoard(createEmptyBoard());
      setCurrentPlayer('BLUE');
      setWinner(null);
      setWinningLine([]);
      // Don't reset score - keep counting wins
    }
  }, [isPlaying, createEmptyBoard]);

  // Kiểm tra thắng từ vị trí (r, c) - dùng useCallback để dùng trong bot
  const checkWinnerAtPosition = useCallback((boardState, r, c, player) => {
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
      
      // Nếu đủ 5 quân liên tiếp -> thắng
      if (line.length >= WIN_COUNT) {
        return line;
      }
    }
    return null;
  }, [config.rows, config.cols]);

  // Kiểm tra hòa (board đầy)
  const checkDraw = useCallback((boardState) => {
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (boardState[r][c] === null) return false;
      }
    }
    return true;
  }, [config.rows, config.cols]);

  // Bot logic - đi random khi đến lượt RED
  const makeBotMove = useCallback((currentBoard) => {
    const emptyCells = getEmptyCells(currentBoard, config.rows, config.cols);
    if (emptyCells.length === 0) return;
    
    // Chọn random một ô trống
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r: botR, c: botC } = emptyCells[randomIndex];
    
    // Đặt quân RED
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[botR][botC] = 'RED';
    setBoard(newBoard);
    
    // Kiểm tra thắng
    const winLine = checkWinnerAtPosition(newBoard, botR, botC, 'RED');
    if (winLine) {
      setWinner('RED');
      setWinningLine(winLine);
      return;
    }
    
    // Kiểm tra hòa
    if (checkDraw(newBoard)) {
      setWinner('DRAW');
      return;
    }
    
    // Chuyển lượt về BLUE
    setCurrentPlayer('BLUE');
  }, [config.rows, config.cols, checkWinnerAtPosition, checkDraw]);

  // Bot tự động đi khi đến lượt RED
  useEffect(() => {
    if (!isPlaying || !botEnabled || winner) return;
    if (currentPlayer !== 'RED') return;
    
    // Delay 500ms để người chơi thấy rõ nước đi
    const timer = setTimeout(() => {
      makeBotMove(board);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentPlayer, isPlaying, botEnabled, winner, board, makeBotMove]);

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
    const winLine = checkWinnerAtPosition(newBoard, boardR, boardC, currentPlayer);
    if (winLine) {
      setWinner(currentPlayer);
      setWinningLine(winLine);
      // Add score when BLUE (player) wins
      if (currentPlayer === 'BLUE') {
        setScore(prev => prev + 1);
      }
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
    score,
    totalWins: score, // Alias for score to display wins in UI
    handlePixelClick,
    getPixelColor,
    resetGame,
  };
};
