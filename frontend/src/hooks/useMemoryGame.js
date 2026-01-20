import { useState, useEffect, useCallback, useRef } from 'react';

// Kích thước lưới Memory: 4x4 (16 thẻ)
const ROWS = 4;
const COLS = 4;

// Thời gian giới hạn (giây)
const TIME_LIMIT = 30;

// Danh sách các cặp màu/icon (8 cặp)
const CARD_TYPES = [
  'RED', 'BLUE', 'GREEN', 'YELLOW',
  'PURPLE', 'CYAN', 'ORANGE', 'WHITE'
];

export const useMemoryGame = (isPlaying) => {
  // --- STATE ---
  // board: Mảng 16 phần tử, mỗi phần tử lưu { id, type, isFlipped, isMatched }
  const [board, setBoard] = useState([]);
  const [cursor, setCursor] = useState(0); // Vị trí con trỏ (0-15)
  const [flippedIndices, setFlippedIndices] = useState([]); // Các thẻ đang lật tạm thời
  const [isProcessing, setIsProcessing] = useState(false); // Chặn input khi đang check match
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'finished', 'timeout'
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT); // Countdown timer
  const [isPaused, setIsPaused] = useState(false); // Paused state for loaded games

  const timerRef = useRef(null);
  const isPausedRef = useRef(false); // Ref for race-condition-safe pause check

  // Timer countdown logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        // Check isPausedRef to prevent race condition
        if (isPausedRef.current) return;
        
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('timeout'); // Hết giờ
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  // --- AUTO INIT/RESET based on isPlaying (like other games) ---
  useEffect(() => {
    if (isPlaying) {
      // Init game when starting
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

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
      setTimeLeft(TIME_LIMIT);
      setGameState('playing');
      setIsProcessing(false);
    } else {
      // Clear state when back (isPlaying = false)
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setBoard([]);
      setCursor(0);
      setFlippedIndices([]);
      setScore(0);
      setTimeLeft(TIME_LIMIT);
      setGameState('idle');
      setIsProcessing(false);
    }
  }, [isPlaying]);

  // --- INIT GAME (manual call, kept for compatibility) ---
  const initGame = useCallback(() => {
    // Clear timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
    setTimeLeft(TIME_LIMIT); // Reset timer
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

  const performFlip = (index) => {
    if (gameState !== 'playing' || isProcessing) return;

    const currentCard = board[index];
    // Nếu thẻ đã lật hoặc đã match thì bỏ qua
    if (currentCard.isFlipped || currentCard.isMatched) return;

    // Lật thẻ
    const newBoard = [...board];
    newBoard[index].isFlipped = true;
    setBoard(newBoard);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Nếu đã lật 2 thẻ -> Kiểm tra Match
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      checkMatch(newFlipped, newBoard);
    }
  };
  // Xử lý khi nhấn Enter (Lật thẻ)
  const flipCard = () => {
    performFlip(cursor);
  };
  const handleCardClick = (index) => {
    // If paused (just loaded), unpause on first click
    if (isPaused && gameState === 'playing') {
      isPausedRef.current = false;
      setIsPaused(false);
    }
    
    // Cập nhật cursor đến vị trí vừa click (để đồng bộ giao diện)
    setCursor(index);
    // Thực hiện lật
    performFlip(index);
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

  // Reset game (clear state when back)
  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setBoard([]);
    setCursor(0);
    setFlippedIndices([]);
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('idle');
    setIsProcessing(false);
  }, []);

  // Load game state from saved data
  const loadGameState = useCallback((savedState) => {
    if (savedState?.board) {
      // CRITICAL: Set isPausedRef BEFORE state update to prevent race condition
      isPausedRef.current = true;
      
      setBoard(savedState.board);
      setCursor(savedState.cursor || 0);
      setScore(savedState.score || 0);
      setTimeLeft(savedState.timeLeft || TIME_LIMIT);
      setGameState('playing');
      setFlippedIndices([]);
      setIsProcessing(false);
      setIsPaused(true);
    }
  }, []);

  return {
    board,
    cursor,
    score,
    gameState,
    timeLeft,
    isPaused,
    initGame,
    resetGame,
    loadGameState,
    moveCursor,
    flipCard,
    handleCardClick,
    getGameState: () => ({
      board,
      cursor,
      score,
      gameState,
      timeLeft,
      config: {
        type: 'memory',
        rows: ROWS,
        cols: COLS
      }
    }),
  };
};