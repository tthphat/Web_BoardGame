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
            row.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
        board.push(row);
    }
    return board;
};

export const useMatch3 = (rows, cols, isPlaying) => {
    const [board, setBoard] = useState([]);
    const [selected, setSelected] = useState(null); // {r, c}

    // Initialize board when game starts
    useEffect(() => {
        if (isPlaying) {
            setBoard(generateBoard(rows, cols));
        }
    }, [isPlaying, rows, cols]);

    const handleSwap = (r1, c1, r2, c2) => {
        const newBoard = [...board.map(row => [...row])];
        const temp = newBoard[r1][c1];
        newBoard[r1][c1] = newBoard[r2][c2];
        newBoard[r2][c2] = temp;
        setBoard(newBoard);

        // TODO: Check for matches here and revert if no match, 
        // handle gravity, etc. For now, simple swap.

        // Reset selection
        setSelected(null);
    };

    const handlePixelClick = (r, c) => {
        if (!isPlaying) return;

        // Convert from 1-based index (UI) to 0-based (Logic) if necessary, 
        // but let's assume UI component passes 0-based or we adjust.
        // The GameMatrix uses 1-based usually. Let's assume input is correct.

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

    return {
        board,
        selected,
        handlePixelClick
    };
};
