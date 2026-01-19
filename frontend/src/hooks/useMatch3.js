import { useState, useEffect } from 'react';

const COLORS = [
    'bg-red-500 shadow-[0_0_5px_red]',
    'bg-yellow-400 shadow-[0_0_5px_yellow]',
    'bg-blue-500 shadow-[0_0_5px_blue]',
    'bg-green-500 shadow-[0_0_5px_green]',
    'bg-purple-500 shadow-[0_0_5px_purple]',
    'bg-orange-500 shadow-[0_0_5px_orange]'
];

const generateBoard = (rows, cols) => {
    const board = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            // Pick a random color that doesn't create a match
            let validColors = [...COLORS];

            // Avoid creating a horizontal match (check left 2)
            if (c >= 2) {
                const color1 = row[c - 1];
                const color2 = row[c - 2];
                if (color1 === color2) {
                    validColors = validColors.filter(color => color !== color1);
                }
            }

            // Avoid creating a vertical match (check up 2)
            if (r >= 2) {
                const color1 = board[r - 1][c];
                const color2 = board[r - 2][c];
                if (color1 === color2) {
                    validColors = validColors.filter(color => color !== color1);
                }
            }

            // If strictly needed, we could have a fallback if validColors is empty, 
            // but with 4+ colors it's impossible to run out (max 2 constraints).
            row.push(validColors[Math.floor(Math.random() * validColors.length)]);
        }
        board.push(row);
    }
    return board;
};

// Kích thước cố định cho game Match3 (13x13)
const MATCH3_SIZE = 13;

export const useMatch3 = (isPlaying) => {
    const rows = MATCH3_SIZE;
    const cols = MATCH3_SIZE;

    const [board, setBoard] = useState([]);
    const [selected, setSelected] = useState(null); // {r, c}
    const [isAnimating, setIsAnimating] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);

    // Initialize board when game starts - logic moved inside useEffect to avoid warning
    useEffect(() => {
        if (!isPlaying) {
            setBoard([]);
            setTimeLeft(60);
            setIsGameOver(false);
            return;
        }

        const initialBoard = generateBoard(rows, cols);
        setBoard(initialBoard);
        setScore(0);
        setTimeLeft(60);
        setIsGameOver(false);
    }, [isPlaying, rows, cols]);

    // Timer effect
    useEffect(() => {
        if (!isPlaying || isGameOver || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, isGameOver, timeLeft]);

    // Tìm tất cả các match (ngang và dọc)
    const findMatches = (currentBoard) => {
        const matches = [];
        const matched = Array(rows).fill(null).map(() => Array(cols).fill(false));

        // Check horizontal matches
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols - 2; c++) {
                const color = currentBoard[r][c];
                if (!color) continue;

                let matchLength = 1;
                while (c + matchLength < cols && currentBoard[r][c + matchLength] === color) {
                    matchLength++;
                }

                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        matched[r][c + i] = true;
                    }
                    c += matchLength - 1;
                }
            }
        }

        // Check vertical matches
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows - 2; r++) {
                const color = currentBoard[r][c];
                if (!color) continue;

                let matchLength = 1;
                while (r + matchLength < rows && currentBoard[r + matchLength][c] === color) {
                    matchLength++;
                }

                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        matched[r + i][c] = true;
                    }
                    r += matchLength - 1;
                }
            }
        }

        // Collect all matched positions
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (matched[r][c]) {
                    matches.push({ r, c });
                }
            }
        }

        return matches;
    };

    // Xóa các ô match
    const removeMatches = (currentBoard, matches) => {
        const newBoard = currentBoard.map(row => [...row]);
        matches.forEach(({ r, c }) => {
            newBoard[r][c] = null;
        });
        return newBoard;
    };

    // Áp dụng gravity - các ô rơi xuống
    const applyGravity = (currentBoard) => {
        const newBoard = Array(rows).fill(null).map(() => Array(cols).fill(null));

        for (let c = 0; c < cols; c++) {
            let writeRow = rows - 1;
            // Duyệt từ dưới lên
            for (let r = rows - 1; r >= 0; r--) {
                if (currentBoard[r][c]) {
                    newBoard[writeRow][c] = currentBoard[r][c];
                    writeRow--;
                }
            }
        }

        return newBoard;
    };

    // Lấp đầy board bằng ô mới
    const fillBoard = (currentBoard) => {
        const newBoard = currentBoard.map(row => [...row]);

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                if (!newBoard[r][c]) {
                    newBoard[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
                }
            }
        }

        return newBoard;
    };

    // Xử lý cascade matches (liên tục kiểm tra và xóa)
    const processCascade = async (currentBoard) => {
        let newBoard = currentBoard;
        let hasMoreMatches = true;

        while (hasMoreMatches) {
            const matches = findMatches(newBoard);

            if (matches.length === 0) {
                hasMoreMatches = false;
                break;
            }

            // Increase score
            setScore(prev => prev + matches.length);

            // Xóa matches
            newBoard = removeMatches(newBoard, matches);
            setBoard([...newBoard]);
            await delay(300);

            // Áp dụng gravity
            newBoard = applyGravity(newBoard);
            setBoard([...newBoard]);
            await delay(300);

            // Lấp đầy
            newBoard = fillBoard(newBoard);
            setBoard([...newBoard]);
            await delay(300);
        }

        return newBoard;
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSwap = async (r1, c1, r2, c2) => {
        if (isAnimating) return;

        setIsAnimating(true);

        // Swap
        const newBoard = board.map(row => [...row]);
        const temp = newBoard[r1][c1];
        newBoard[r1][c1] = newBoard[r2][c2];
        newBoard[r2][c2] = temp;
        setBoard(newBoard);
        await delay(200);

        // Kiểm tra có match không
        const matches = findMatches(newBoard);

        if (matches.length === 0) {
            // Không có match -> hoàn tác swap
            const revertBoard = newBoard.map(row => [...row]);
            revertBoard[r1][c1] = newBoard[r2][c2];
            revertBoard[r2][c2] = newBoard[r1][c1];
            setBoard(revertBoard);
            await delay(200);
        } else {
            // Có match -> xử lý cascade
            await processCascade(newBoard);
        }

        setSelected(null);
        setIsAnimating(false);
    };

    const handlePixelClick = (r, c) => {
        if (!isPlaying || isAnimating) return;

        if (!selected) {
            setSelected({ r, c });
        } else {
            // Check if adjacent
            const isAdjacent = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;

            if (isAdjacent) {
                handleSwap(selected.r, selected.c, r, c);
            } else {
                setSelected({ r, c }); // Select new
            }
        }
    };

    // Get serialized game state for saving
    const getGameState = () => {
        return {
            board: board,
            score: score,
            timeLeft: timeLeft,
            isGameOver: isGameOver,
            config: {
                type: 'match-3',
                rows: rows,
                cols: cols
            }
        };
    };

    return {
        board,
        selected,
        handlePixelClick,
        isAnimating,
        score,
        timeLeft,
        isGameOver,
        getGameState
    };
};
