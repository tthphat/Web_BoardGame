import React, { useState, useEffect } from 'react';
import { useEnabledGames } from '../hooks/useEnabledGames';
import GameRatingContent from '../components/games/GameRatingContent';
import { Loader2, Gamepad2, MessageSquare } from 'lucide-react';
import { getGameConfig } from '../config/gameRegistry';

const ReviewPage = () => {
    const { enabledScreens, loading } = useEnabledGames();
    const [selectedGameKey, setSelectedGameKey] = useState(null);

    // Filter out HEART and get valid game configs
    const games = enabledScreens
        .filter(key => key !== 'HEART')
        .map(key => ({ key, config: getGameConfig(key) }))
        .filter(item => item.config);

    // Set default selected game once loaded
    useEffect(() => {
        if (!selectedGameKey && games.length > 0) {
            setSelectedGameKey(games[0].key);
        }
    }, [games, selectedGameKey]);

    const activeGame = games.find(g => g.key === selectedGameKey);

    return (
        <div className="container mx-auto p-4 max-w-5xl h-full font-mono flex flex-col gap-4">
            {/* Header */}
            <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] border-2 border-t-white border-l-white border-b-black border-r-black p-1 shadow-md">
                <div className="bg-[#000080] text-white px-4 py-2 font-bold text-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        GAME_REVIEWS.EXE
                    </span>
                    <div className="flex gap-1.5">
                        <button className="w-5 h-5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center text-[10px]">_</button>
                        <button className="w-5 h-5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center text-[10px]">X</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-0 px-1 pt-1 border-b-2 border-black dark:border-gray-600">
                        {games.map(({ key, config }) => (
                            <button
                                key={key}
                                onClick={() => setSelectedGameKey(key)}
                                className={`px-4 py-2 text-xs md:text-sm font-bold uppercase transition-all relative flex items-center gap-2 ${selectedGameKey === key
                                        ? 'bg-[#e0e0e0] border-2 border-t-black border-l-black border-b-transparent border-r-black z-10 -mb-[2px] pt-2.5 dark:bg-[#333] dark:border-gray-500 dark:border-b-[#1a1a1a]'
                                        : 'bg-[#999] text-gray-700 border-2 border-t-white border-l-white border-b-black border-r-black hover:bg-[#b0b0b0] dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700'
                                    }`}
                            >
                                <Gamepad2 size={14} />
                                {config.name}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-[#e0e0e0] dark:bg-[#333] border-2 border-t-transparent border-l-black border-b-black border-r-black p-4 dark:border-gray-500 overflow-y-auto shadow-inner">
                        {activeGame ? (
                            <div className="max-w-4xl mx-auto">
                                <GameRatingContent
                                    key={activeGame.config.slug}
                                    gameSlug={activeGame.config.slug}
                                    gameName={activeGame.config.name}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                Select a game to view reviews.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
