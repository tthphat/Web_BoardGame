useEffect(() => {
    if (!enabled) {
        clearInterval(intervalRef.current);
        return;
    }

    resetGame();
    intervalRef.current = setInterval(moveSnake, 300);

    return () => clearInterval(intervalRef.current);
}, [enabled]);
