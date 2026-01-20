import React from 'react';
import { toast } from 'sonner';
import { saveGameSessionApi, loadGameSessionApi } from '../../services/game.service';
import { getGameConfig } from '../../config/gameRegistry';

const SaveLoadButtons = ({
    gameMatrixRef,
    screens,
    currentScreenIndex,
    gameEndHandled
}) => {
    const handleSave = async () => {
        if (!gameMatrixRef.current?.getGameState) {
            toast.error("Unable to access game state for saving.");
            return;
        }

        const gameStateData = gameMatrixRef.current.getGameState();

        if (!gameStateData) {
            toast.error("Game state is empty or invalid.");
            return;
        }

        const activeScreen = screens[currentScreenIndex];
        const config = getGameConfig(activeScreen);

        if (!config || !config.slug) {
            toast.error("Invalid game configuration.");
            return;
        }

        try {
            const loadingToast = toast.loading("Saving game...");
            await saveGameSessionApi(config.slug, gameStateData);
            toast.dismiss(loadingToast);
            toast.success("Game saved successfully!");
        } catch (error) {
            console.error("Save game error:", error);
            toast.dismiss();
            toast.error(`Failed to save game: ${error.message}`);
        }
    };

    const handleLoad = async () => {
        const activeScreen = screens[currentScreenIndex];
        const config = getGameConfig(activeScreen);

        if (!config || !config.slug) {
            toast.error("Invalid game configuration.");
            return;
        }

        try {
            const loadingToast = toast.loading("Loading game...");
            const { data } = await loadGameSessionApi(config.slug);
            toast.dismiss(loadingToast);

            if (data && data.state) {
                // Handle both string and already-parsed object
                const savedState = typeof data.state === 'string' 
                    ? JSON.parse(data.state) 
                    : data.state;
                console.log("Loaded Game State:", savedState);

                // Call loadGameState via gameMatrixRef
                if (gameMatrixRef.current?.loadGameState) {
                    const success = gameMatrixRef.current.loadGameState(savedState);
                    if (success) {
                        toast.success("Game loaded successfully!");
                    } else {
                        toast.error("Failed to restore game state.");
                    }
                } else {
                    toast.error("Unable to restore game state.");
                }
            } else {
                toast.warning("No saved game found.");
            }
        } catch (error) {
            console.error("Load game error:", error);
            toast.dismiss();
            toast.error(`Failed to load game: ${error.message}`);
        }
    };

    return (
        <div className="flex gap-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
                onClick={handleSave}
                disabled={gameEndHandled}
                className={`
          px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all
          border-b-4 shadow-md flex items-center justify-center min-w-[80px]
          ${gameEndHandled
                        ? 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed opacity-60'
                        : 'bg-green-600 border-green-800 text-white hover:bg-green-500 active:border-b-0 active:translate-y-1'}
        `}
            >
                Save
            </button>
            <button
                onClick={handleLoad}
                className="px-4 py-1.5 bg-blue-600 border-blue-800 text-white hover:bg-blue-500 active:border-b-0 active:translate-y-1 rounded text-[11px] font-bold uppercase tracking-wider transition-all border-b-4 shadow-md flex items-center justify-center min-w-[80px]"
            >
                Load
            </button>
        </div>
    );
};

export default SaveLoadButtons;
