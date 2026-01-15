import { useState, useEffect, useCallback } from 'react';

// Kích thước lưới Memory: 4x4 (16 thẻ)
const ROWS = 4;
const COLS = 4;

// Danh sách các cặp màu/icon (8 cặp)
const CARD_TYPES = [
  'RED', 'BLUE', 'GREEN', 'YELLOW', 
  'PURPLE', 'CYAN', 'ORANGE', 'WHITE'
];

export const useMemoryGame = () => {
  // --- STATE ---
  // board: Mảng 16 phần tử, mỗi phần tử lưu { id, type, isFlipped, isMatched }
  const [board, setBoard] = useState([]); 
  const [cursor, setCursor] = useState(0); // Vị trí con trỏ (0-15)
  const [flippedIndices, setFlippedIndices] = useState([]); // Các thẻ đang lật tạm thời
  const [isProcessing, setIsProcessing] = useState(false); // Chặn input khi đang check match
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'finished'

  // --- INIT GAME ---
  const initGame = useCallback(() => {
    // 1. Tạo 8 cặp thẻ
    let cards = [...CARD_TYPES, ...CARD_TYPES];
    
    // 2. Xáo trộn (Shuffle)
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // 3. Map vào state object
    const newBoard = cards.map((type, index) => ({
      id: index,
      type,
      isFlipped: false,
      isMatched: false,
    }));

    setBoard(newBoard);
    setCursor(0);
    setFlippedIndices([]);
    setScore(0);
    setGameState('playing');
    setIsProcessing(false);
  }, []);

  // --- ACTIONS ---

  // Di chuyển con trỏ (Trái/Phải)
  const moveCursor = (direction) => {
    if (gameState !== 'playing') return;
    
    setCursor((prev) => {
      if (direction === 'right') return (prev + 1) % (ROWS * COLS);
      if (direction === 'left') return (prev - 1 + (ROWS * COLS)) % (ROWS * COLS);
      return prev;
    });
  };

  // Xử lý khi nhấn Enter (Lật thẻ)
  const flipCard = () => {
    if (gameState !== 'playing' || isProcessing) return;
    
    const currentCard = board[cursor];

    // Nếu thẻ đã lật hoặc đã match thì bỏ qua
    if (currentCard.isFlipped || currentCard.isMatched) return;

    // Lật thẻ
    const newBoard = [...board];
    newBoard[cursor].isFlipped = true;
    setBoard(newBoard);
    
    const newFlipped = [...flippedIndices, cursor];
    setFlippedIndices(newFlipped);

    // Nếu đã lật 2 thẻ -> Kiểm tra Match
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      checkMatch(newFlipped, newBoard);
    }
  };

  // Logic kiểm tra khớp
  const checkMatch = (indices, currentBoard) => {
    const [idx1, idx2] = indices;
    const card1 = currentBoard[idx1];
    const card2 = currentBoard[idx2];

    if (card1.type === card2.type) {
      // MATCH!
      setTimeout(() => {
        const matchedBoard = [...currentBoard];
        matchedBoard[idx1].isMatched = true;
        matchedBoard[idx2].isMatched = true;
        setBoard(matchedBoard);
        setFlippedIndices([]);
        setIsProcessing(false);
        setScore(prev => prev + 10); // Cộng điểm

        // Check Win Condition
        if (matchedBoard.every(c => c.isMatched)) {
            setGameState('finished');
        }
      }, 500);
    } else {
      // NOT MATCH -> Úp lại sau 1s
      setTimeout(() => {
        const resetBoard = [...currentBoard];
        resetBoard[idx1].isFlipped = false;
        resetBoard[idx2].isFlipped = false;
        setBoard(resetBoard);
        setFlippedIndices([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return {
    board,
    cursor,
    score,
    gameState,
    initGame,
    moveCursor,
    flipCard
  };
};