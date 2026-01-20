import React, { useState, useEffect } from 'react';
import { useEnabledGames } from '../hooks/useEnabledGames';
import GameRatingContent from '../components/games/GameRatingContent';
import { Loader2, Minimize2, X } from 'lucide-react';
import { getGameConfig } from '../config/gameRegistry';

const ReviewPage = () => {
    // --- GIỮ NGUYÊN LOGIC CŨ ---
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
        <div className="container mx-auto p-4 max-w-5xl h-full font-mono flex flex-col gap-4 text-black">
            
            {/* 1. MAIN WINDOW FRAME */}
            <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-1 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col h-full">
                
                {/* 2. HEADER BAR (Classic Retro Blue) */}
                <div className="bg-[#000080] text-white px-2 py-1 mb-2 font-bold text-lg flex items-center justify-between select-none">
                    {/* Đã bỏ icon MessageSquare, chỉ giữ lại text tên chương trình */}
                    <span className="uppercase tracking-wide truncate pl-1">
                        GAME_REVIEWS_MANAGER.EXE
                    </span>
                    <div className="flex gap-1 ml-2">
                        <button className="w-5 h-5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:translate-y-[1px]">
                            <Minimize2 size={12} strokeWidth={3} />
                        </button>
                        <button className="w-5 h-5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:translate-y-[1px]">
                            <X size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* 3. BODY CONTENT */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 border-2 border-t-black border-l-black border-b-white border-r-white bg-[#c0c0c0]">
                        <Loader2 className="animate-spin h-10 w-10 text-gray-600 mb-2" />
                        <span className="text-sm uppercase blink">Reading Disk...</span>
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
                                        // Đã bỏ icon Gamepad2
                                        // Tab Active: Chữ đen, nền xám trùng với body (tạo cảm giác liền mạch)
                                        // Tab Inactive: Chữ xám đậm, nền xám tối hơn
                                        className={`
                                            px-3 py-1.5 text-xs md:text-sm font-bold uppercase flex items-center transition-none
                                            border-2 border-t-white border-l-white border-r-black truncate
                                            ${isActive 
                                                ? 'bg-[#c0c0c0] border-b-[#c0c0c0] pb-2 -mt-1 pt-2.5 relative z-20 text-black' 
                                                : 'bg-[#a0a0a0] border-b-black hover:bg-[#b0b0b0] text-gray-700'
                                            }
                                        `}
                                    >
                                        {config.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* CONTENT CONTAINER */}
                        <div className="flex-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-4 overflow-y-auto relative z-0">
                            <div className="h-full w-full">
                                {activeGame ? (
                                    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                                        <GameRatingContent
                                            key={activeGame.config.slug}
                                            gameSlug={activeGame.config.slug}
                                            gameName={activeGame.config.name}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center border-2 border-t-black border-l-black border-b-white border-r-white bg-white">
                                        <div className="text-center py-20 text-gray-500 font-bold uppercase">
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