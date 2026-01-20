import React, { useState, useEffect } from 'react';
import { useEnabledGames } from '../hooks/useEnabledGames';
import GameRatingContent from '../components/games/GameRatingContent';
import { Loader2, Minimize2, X, MessageSquare } from 'lucide-react';
import { getGameConfig } from '../config/gameRegistry';

const ReviewPage = () => {
    const { enabledScreens, loading } = useEnabledGames();
    const [selectedGameKey, setSelectedGameKey] = useState(null);

    const games = enabledScreens
        .filter(key => key !== 'HEART')
        .map(key => ({ key, config: getGameConfig(key) }))
        .filter(item => item.config);

    useEffect(() => {
        if (!selectedGameKey && games.length > 0) {
            setSelectedGameKey(games[0].key);
        }
    }, [games, selectedGameKey]);

    const activeGame = games.find(g => g.key === selectedGameKey);

    return (
        <div className="container mx-auto p-4 max-w-5xl h-full font-mono flex flex-col gap-4 text-black dark:text-gray-200">

            {/* MAIN WINDOW FRAME */}
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-1 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col h-full">

                {/* HEADER BAR */}
                <div className="bg-[#000080] text-white px-2 py-1 mb-2 font-bold text-lg flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        <span className="uppercase tracking-wide truncate">GAME_REVIEWS</span>
                    </div>
                    <div className="flex gap-1 ml-2">
                        <button className="w-5 h-5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:translate-y-[1px]">
                            <Minimize2 size={12} strokeWidth={3} />
                        </button>
                        <button className="w-5 h-5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:translate-y-[1px]">
                            <X size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* BODY CONTENT */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 bg-[#c0c0c0] dark:bg-[#4a4a4a]">
                        <Loader2 className="animate-spin h-10 w-10 text-gray-600 dark:text-gray-400 mb-2" />
                        <span className="text-sm uppercase">Reading Disk...</span>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0 px-1 pb-1">

                        {/* TABS NAVIGATION */}
                        <div className="flex flex-wrap gap-1 px-1 relative top-[2px] z-10">
                            {games.map(({ key, config }) => {
                                const isActive = selectedGameKey === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedGameKey(key)}
                                        className={`
                                            px-3 py-1.5 text-xs md:text-sm font-bold uppercase flex items-center transition-none
                                            border-2 border-t-white border-l-white border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-r-[#2a2a2a] truncate
                                            ${isActive
                                                ? 'bg-[#c0c0c0] dark:bg-[#4a4a4a] border-b-[#c0c0c0] dark:border-b-[#4a4a4a] pb-2 -mt-1 pt-2.5 relative z-20 text-black dark:text-white'
                                                : 'bg-[#a0a0a0] dark:bg-[#3a3a3a] border-b-black dark:border-b-[#2a2a2a] hover:bg-[#b0b0b0] dark:hover:bg-[#4a4a4a] text-gray-700 dark:text-gray-300'
                                            }
                                        `}
                                    >
                                        {config.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* CONTENT CONTAINER */}
                        <div className="flex-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-4 overflow-y-auto relative z-0">
                            <div className="h-full w-full">
                                {activeGame ? (
                                    <div className="max-w-4xl mx-auto">
                                        <GameRatingContent
                                            key={activeGame.config.slug}
                                            gameSlug={activeGame.config.slug}
                                            gameName={activeGame.config.name}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center py-8 border-2 border-dashed border-gray-400 dark:border-gray-500 bg-[#e0e0e0] dark:bg-[#3a3a3a] text-gray-500 dark:text-gray-400 uppercase text-xs px-8 font-bold">
                                            &lt; NO_GAME_SELECTED &gt;
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewPage;