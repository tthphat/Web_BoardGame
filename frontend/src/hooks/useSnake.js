import { useState, useEffect, useRef, useCallback } from 'react';

export const useSnake = (enabled, rows, cols) => {
    // CRITICAL: Calculate initial position based on actual board size
    const calcInitialState = useCallback(() => {
        const midR = Math.floor(rows / 2) || 7;
        const midC = Math.floor(cols / 2) || 7;

        const initialSnake = [
            { r: midR, c: midC },
            { r: midR, c: midC + 1 },
            { r: midR, c: midC + 2 }
        ];

        return {
            snake: initialSnake,
            food: { r: Math.max(1, midR - 3), c: midC },
            direction: 'LEFT',
            isGameOver: false,
            score: 0
        };
    }, [rows, cols]);

    const [gameState, setGameState] = useState(() => calcInitialState());

    const intervalRef = useRef(null);
    const nextDirectionRef = useRef('LEFT');
    const lastSnakeRef = useRef(gameState.snake);
    const lastDirRef = useRef('LEFT');

    const generateFood = useCallback((currentSnake) => {
        let newFood;
        let attempts = 0;
        while (attempts < 100) {
            newFood = {
                r: Math.floor(Math.random() * rows) + 1,
                c: Math.floor(Math.random() * cols) + 1
            };
            const onSnake = currentSnake.some(s => s.r === newFood.r && s.c === newFood.c);
            if (!onSnake) return newFood;
            attempts++;
        }
        return { r: 1, c: 1 };
    }, [rows, cols]);

    const resetGame = useCallback(() => {
        const midR = Math.floor(rows / 2) || 7;
        const midC = Math.floor(cols / 2) || 7;
        const initialSnake = [
            { r: midR, c: midC },
            { r: midR, c: midC + 1 },
            { r: midR, c: midC + 2 }
        ];

        lastSnakeRef.current = initialSnake;
        lastDirRef.current = 'LEFT';
        nextDirectionRef.current = 'LEFT';

        const initialFood = generateFood(initialSnake);

        setGameState({
            snake: initialSnake,
            food: initialFood,
            direction: 'LEFT',
            isGameOver: false,
            score: 0
        });
    }, [generateFood, rows, cols]);

    // Auto reset when enabled
    useEffect(() => {
        if (enabled) {
            resetGame();
        }
    }, [enabled, resetGame]);

    const moveSnake = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver) return prev;

            const currentSnake = [...prev.snake];
            const head = currentSnake[0];
            const currentDir = nextDirectionRef.current;
            lastDirRef.current = currentDir;

            const newHead = { ...head };
            if (currentDir === 'UP') newHead.r -= 1;
            if (currentDir === 'DOWN') newHead.r += 1;
            if (currentDir === 'LEFT') newHead.c -= 1;
            if (currentDir === 'RIGHT') newHead.c += 1;

            // Check wall collision
            if (newHead.r < 1 || newHead.r > rows || newHead.c < 1 || newHead.c > cols) {
                return { ...prev, isGameOver: true };
            }

            // Check self collision
            if (currentSnake.some(s => s.r === newHead.r && s.c === newHead.c)) {
                return { ...prev, isGameOver: true };
            }

            const newSnake = [newHead, ...currentSnake];
            let newFood = prev.food;
            let newScore = prev.score;

            // Check if ate food
            if (newHead.r === prev.food.r && newHead.c === prev.food.c) {
                newScore += 10;
                newFood = generateFood(newSnake);
            } else {
                newSnake.pop();
            }

            lastSnakeRef.current = newSnake;
            return {
                ...prev,
                snake: newSnake,
                food: newFood,
                direction: currentDir,
                score: newScore
            };
        });
    }, [rows, cols, generateFood]);

    useEffect(() => {
        if (!enabled || gameState.isGameOver) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(moveSnake, 150);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled, gameState.isGameOver, moveSnake]);

    const changeDirection = useCallback((newDir) => {
        const opposites = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
        if (newDir !== opposites[lastDirRef.current]) {
            nextDirectionRef.current = newDir;
        }
    }, []);

    const getPixelColor = (r, c) => {
        const { snake, food, isGameOver } = gameState;
        if (!snake || snake.length === 0) return 'bg-[#333] opacity-40';

        const isHead = snake[0].r === r && snake[0].c === c;
        const isBody = snake.slice(1).some(s => s.r === r && s.c === c);
        const isFood = food.r === r && food.c === c;

        if (isGameOver && (isHead || isBody)) {
            return 'bg-red-600 shadow-[0_0_10px_red]';
        }

        if (isHead) return 'bg-green-400 shadow-[0_0_12px_#4ade80] z-20 scale-105';
        if (isBody) return 'bg-green-600 opacity-90';
        if (isFood) return 'bg-red-500 shadow-[0_0_15px_red] animate-pulse';

        return 'bg-[#333] opacity-40';
    };

    // Get serialized game state for saving
    const getGameState = () => {
        return {
            snake: gameState.snake,
            food: gameState.food,
            score: gameState.score,
            isGameOver: gameState.isGameOver,
            config: {
                type: 'snake',
                rows: rows,
                cols: cols
            }
        };
    };

    return {
        ...gameState,
        resetGame,
        changeDirection,
        getPixelColor,
        getGameState
    };
};
