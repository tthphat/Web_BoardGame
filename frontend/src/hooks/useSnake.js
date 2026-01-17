import { useEffect, useRef, useState } from "react";

export function useSnake(enabled, rows = 13, cols = 13) {
    const [snake, setSnake] = useState([]);
    const [direction, setDirection] = useState("RIGHT");
    const [food, setFood] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const intervalRef = useRef(null);

    const resetGame = () => {
        const midR = Math.floor(rows / 2);
        const midC = Math.floor(cols / 2);

        const initSnake = [
            { r: midR, c: midC },
            { r: midR, c: midC - 1 },
            { r: midR, c: midC - 2 },
        ];

        setSnake(initSnake);
        setDirection("RIGHT");
        setScore(0);
        setGameOver(false);
        spawnFood(initSnake);
    };

    const spawnFood = (currentSnake = snake) => {
        let newFood;

        do {
            newFood = {
                r: Math.floor(Math.random() * rows) + 1,
                c: Math.floor(Math.random() * cols) + 1,
            };
        } while (
            currentSnake.some(s => s.r === newFood.r && s.c === newFood.c)
        );

        setFood(newFood);
    };

    const moveSnake = () => {
        setSnake(prev => {
            if (gameOver) return prev;

            const head = prev[0];
            let newHead = { ...head };

            if (direction === "UP") newHead.r--;
            if (direction === "DOWN") newHead.r++;
            if (direction === "LEFT") newHead.c--;
            if (direction === "RIGHT") newHead.c++;
            if (
                newHead.r < 1 || newHead.r > rows ||
                newHead.c < 1 || newHead.c > cols
            ) {
                endGame();
                return prev;
            }

            if (prev.some(p => p.r === newHead.r && p.c === newHead.c)) {
                endGame();
                return prev;
            }

            const newSnake = [newHead, ...prev];

            if (food && newHead.r === food.r && newHead.c === food.c) {
                setScore(s => s + 10);
                spawnFood(newSnake);
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    };

    const endGame = () => {
        setGameOver(true);
        clearInterval(intervalRef.current);
    };

}