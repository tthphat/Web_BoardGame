import { useState, useEffect, useCallback } from 'react';

// Winning combinations (indices 0-8 for 3x3 grid)
const WINNING_LINES = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6], // Diagonal top-right to bottom-left
];

// Cell positions in 13x13 grid (center of each cell)
// Grid: rows 2-4, 6-8, 10-12 and cols 2-4, 6-8, 10-12
// Cell centers: (3,3), (3,7), (3,11), (7,3), (7,7), (7,11), (11,3), (11,7), (11,11)
const CELL_CENTERS = [
    { r: 3, c: 3 },   // Cell 0 (top-left)
    { r: 3, c: 7 },   // Cell 1 (top-center)
    { r: 3, c: 11 },  // Cell 2 (top-right)
    { r: 7, c: 3 },   // Cell 3 (middle-left)
    { r: 7, c: 7 },   // Cell 4 (center)
    { r: 7, c: 11 },  // Cell 5 (middle-right)
    { r: 11, c: 3 },  // Cell 6 (bottom-left)
    { r: 11, c: 7 },  // Cell 7 (bottom-center)
    { r: 11, c: 11 }, // Cell 8 (bottom-right)
];

// Map pixel position to cell index
const getCellIndex = (r, c) => {
    // Cell boundaries (each cell is 3 units, grid lines at 5 and 9)
    // Rows: 2-4 → row 0, 6-8 → row 1, 10-12 → row 2
    // Cols: 2-4 → col 0, 6-8 → col 1, 10-12 → col 2

    let cellRow = -1;
    let cellCol = -1;

    if (r >= 2 && r <= 4) cellRow = 0;
    else if (r >= 6 && r <= 8) cellRow = 1;
    else if (r >= 10 && r <= 12) cellRow = 2;

    if (c >= 2 && c <= 4) cellCol = 0;
    else if (c >= 6 && c <= 8) cellCol = 1;
    else if (c >= 10 && c <= 12) cellCol = 2;

    if (cellRow === -1 || cellCol === -1) return -1;

    return cellRow * 3 + cellCol;
};

// X shape dots (relative to cell center, offsets from center)
const X_SHAPE = [
    { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
    { dr: 0, dc: 0 },
    { dr: 1, dc: -1 }, { dr: 1, dc: 1 },
];

// O shape dots (relative to cell center, forming a ring)
const O_SHAPE = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
];

// Tìm các ô trống trên board
const getEmptyCells = (board) => {
    const emptyCells = [];
    board.forEach((cell, index) => {
        if (cell === null) emptyCells.push(index);
    });
    return emptyCells;
};

// Check winner - định nghĩa bên ngoài hook để dùng chung
const checkWinnerResult = (newBoard) => {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
            return { winner: newBoard[a], line };
        }
    }
    // Check for draw
    if (newBoard.every(cell => cell !== null)) {
        return { winner: 'DRAW', line: [] };
    }
    return null;
};

export const useTicTacToe = (isPlaying, botEnabled = false) => {
    const [board, setBoard] = useState(Array(9).fill(null)); // null, 'X', or 'O'
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [score, setScore] = useState(0); // Count player wins

    // Reset game when starting or when back (keep score)
    useEffect(() => {
        if (isPlaying) {
            setBoard(Array(9).fill(null));
            setCurrentPlayer('X');
            setWinner(null);
            setWinningLine([]);
            // Don't reset score here - keep counting wins
        } else {
            // Clear state when back (isPlaying = false)
            setBoard(Array(9).fill(null));
            setCurrentPlayer('X');
            setWinner(null);
            setWinningLine([]);
        }
    }, [isPlaying]);

    // Bot logic - đi random khi đến lượt O
    const makeBotMove = useCallback((currentBoard) => {
        const emptyCells = getEmptyCells(currentBoard);
        if (emptyCells.length === 0) return;

        // Chọn random một ô trống
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const botMove = emptyCells[randomIndex];

        // Đặt quân O
        const newBoard = [...currentBoard];
        newBoard[botMove] = 'O';
        setBoard(newBoard);

        // Kiểm tra thắng
        const result = checkWinnerResult(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
        } else {
            setCurrentPlayer('X');
        }
    }, []);

    // Bot tự động đi khi đến lượt O
    useEffect(() => {
        if (!isPlaying || !botEnabled || winner) return;
        if (currentPlayer !== 'O') return;

        // Delay 500ms để người chơi thấy rõ nước đi
        const timer = setTimeout(() => {
            makeBotMove(board);
        }, 500);

        return () => clearTimeout(timer);
    }, [currentPlayer, isPlaying, botEnabled, winner, board, makeBotMove]);

    // Check winner (wrapper cho hàm bên ngoài)
    const checkWinner = checkWinnerResult;

    // Handle pixel click - convert to cell and place piece
    const handlePixelClick = (r, c) => {
        if (!isPlaying || winner) return;

        const cellIndex = getCellIndex(r, c);
        if (cellIndex === -1) return; // Clicked on grid line or outside
        if (board[cellIndex] !== null) return; // Cell already occupied

        const newBoard = [...board];
        newBoard[cellIndex] = currentPlayer;
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            // Add score when player X wins
            if (result.winner === 'X') {
                setScore(prev => prev + 1);
            }
        } else {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    // Get pixel color based on game state
    const getPixelColor = (r, c) => {
        // Ẩn dots ngoài vùng chơi (2-12)
        if (r < 2 || r > 12 || c < 2 || c > 12) {
            return 'bg-transparent shadow-none opacity-0';
        }

        // Grid lines
        if ((c === 5 || c === 9) && r >= 2 && r <= 12) return 'bg-gray-500 shadow-none';
        if ((r === 5 || r === 9) && c >= 2 && c <= 12) return 'bg-gray-500 shadow-none';

        // Check each cell for X or O
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const cellValue = board[cellIndex];
            if (!cellValue) continue;

            const center = CELL_CENTERS[cellIndex];
            const isWinningCell = winningLine.includes(cellIndex);
            const pulseClass = isWinningCell ? 'animate-pulse' : '';

            if (cellValue === 'X') {
                // Check if this pixel is part of X shape
                const isX = X_SHAPE.some(({ dr, dc }) =>
                    r === center.r + dr && c === center.c + dc
                );
                if (isX) {
                    return `bg-blue-500 shadow-[0_0_10px_blue] ${pulseClass}`;
                }
            } else if (cellValue === 'O') {
                // Check if this pixel is part of O shape
                const isO = O_SHAPE.some(({ dr, dc }) =>
                    r === center.r + dr && c === center.c + dc
                );
                if (isO) {
                    return `bg-red-500 shadow-[0_0_10px_red] ${pulseClass}`;
                }
            }
        }

        // Background dots
        return 'bg-[#333] shadow-none opacity-40 scale-[0.7]';
    };

    // Reset game function
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setWinningLine([]);
    };

    // Get serialized game state for saving
    const getGameState = () => {
        return {
            board: board,
            currentPlayer: currentPlayer,
            winner: winner,
            score: score,
            config: {
                type: 'tic-tac-toe'
            }
        };
    };

    // Load game state from saved data
    const loadGameState = useCallback((savedState) => {
        if (savedState?.board) {
            setBoard(savedState.board);
            setCurrentPlayer('X');
            setWinner(null);
            setWinningLine([]);
        }
    }, []);

    return {
        board,
        currentPlayer,
        winner,
        winningLine,
        score,
        totalWins: score,
        handlePixelClick,
        getPixelColor,
        resetGame,
        getGameState,
        loadGameState,
    };
};
