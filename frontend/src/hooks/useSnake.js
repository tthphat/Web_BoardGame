import { useState, useEffect, useRef, useCallback } from 'react';

export const useSnake = (enabled, rows, cols) => {
    // State quản lý toàn bộ trò chơi
    const [gameState, setGameState] = useState({
        snake: [{ r: 10, c: 10 }, { r: 10, c: 11 }, { r: 10, c: 12 }],
        food: { r: 5, c: 5 },
        direction: 'LEFT',
        isGameOver: false,
        score: 0
    });

    const intervalRef = useRef(null);
    const nextDirectionRef = useRef('LEFT');
    // Refs để tracking logic nhanh mà không cần render lại
    const lastSnakeRef = useRef(gameState.snake);
    const lastDirRef = useRef('LEFT');

    const generateFood = useCallback((currentSnake) => {
        let newFood;
        let attempts = 0;
        // Giới hạn số lần thử để tránh treo trình duyệt nếu không còn chỗ trống
        while (attempts < 100) {
            newFood = {
                r: Math.floor(Math.random() * rows) + 1,
                c: Math.floor(Math.random() * cols) + 1
            };
            const onSnake = currentSnake.some(s => s.r === newFood.r && s.c === newFood.c);
            if (!onSnake) return newFood;
            attempts++;
        }
        return { r: 1, c: 1 }; // Fallback
    }, [rows, cols]);

    const resetGame = useCallback(() => {
        const midR = Math.floor(rows / 2) || 10;
        const midC = Math.floor(cols / 2) || 10;
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

    // Tự động reset khi "enabled" (bật mode play)
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

            // Kiểm tra va chạm tường
            if (newHead.r < 1 || newHead.r > rows || newHead.c < 1 || newHead.c > cols) {
                return { ...prev, isGameOver: true };
            }

            // Kiểm tra va chạm thân
            if (currentSnake.some(s => s.r === newHead.r && s.c === newHead.c)) {
                return { ...prev, isGameOver: true };
            }

            const newSnake = [newHead, ...currentSnake];
            let newFood = prev.food;
            let newScore = prev.score;

            // Kiểm tra ăn mồi
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
        // Stop interval if not enabled or game over
        if (!enabled || gameState.isGameOver) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        // Tốc độ 150ms để vừa tay
        intervalRef.current = setInterval(moveSnake, 150);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled, gameState.isGameOver, moveSnake]);

    const changeDirection = useCallback((newDir) => {
        const opposites = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
        // Không cho phép quay đầu 180 độ
        if (newDir !== opposites[lastDirRef.current]) {
            nextDirectionRef.current = newDir;
        }
    }, []);

    const getPixelColor = (r, c) => {
        const { snake, food, isGameOver } = gameState;
        if (!snake || snake.length === 0) return 'bg-[#222] opacity-20';

        const isHead = snake[0].r === r && snake[0].c === c;
        const isBody = snake.slice(1).some(s => s.r === r && s.c === c);
        const isFood = food.r === r && food.c === c;

        if (isGameOver && (isHead || isBody)) {
            return 'bg-red-600 shadow-[0_0_10px_red]';
        }

        if (isHead) return 'bg-green-400 shadow-[0_0_12px_#4ade80] z-20 scale-105';
        if (isBody) return 'bg-green-600 opacity-90';
        if (isFood) return 'bg-red-500 shadow-[0_0_15px_red] animate-pulse';

        return 'bg-[#222] opacity-20';
    };

    return {
        ...gameState,
        resetGame,
        changeDirection,
        getPixelColor
    };
};
