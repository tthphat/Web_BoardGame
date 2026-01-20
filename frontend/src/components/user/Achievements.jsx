import React, { useState, useEffect, useCallback } from 'react';
import { getUserAchievementsApi } from '@/services/achievement.service';
import { Trophy, ShieldAlert, Search, RefreshCcw, Minimize2, X, Loader2 } from 'lucide-react';
import { GAME_REGISTRY } from '@/config/gameRegistry';
import { useEnabledGames } from '@/hooks/useEnabledGames';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState(null);

    const { enabledScreens } = useEnabledGames();

    const fetchAchievements = useCallback(async () => {
        setLoading(true);
        try {
            const gameSlug = selectedGame ? GAME_REGISTRY[selectedGame]?.slug : null;
            const response = await getUserAchievementsApi(gameSlug, searchTerm, true);
            setAchievements(response.data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [selectedGame, searchTerm]);

    useEffect(() => {
        fetchAchievements();
    }, [selectedGame]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAchievements();
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl h-full font-mono flex flex-col gap-4 text-black dark:text-gray-200">

            {/* MAIN WINDOW FRAME */}
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-1 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col h-full">

                {/* HEADER BAR */}
                <div className="bg-[#000080] text-white px-2 py-1 mb-2 font-bold text-lg flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        <span className="uppercase tracking-wide truncate">USER_ACHIEVEMENTS</span>
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
                <div className="flex flex-col flex-1 min-h-0 px-1 pb-1">

                    {/* TABS NAVIGATION */}
                    <div className="flex flex-wrap gap-1 px-1 relative top-[2px] z-10">
                        <button
                            onClick={() => setSelectedGame(null)}
                            className={`
                                px-3 py-1.5 text-xs md:text-sm font-bold uppercase flex items-center transition-none
                                border-2 border-t-white border-l-white border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-r-[#2a2a2a] truncate
                                ${!selectedGame
                                    ? 'bg-[#c0c0c0] dark:bg-[#4a4a4a] border-b-[#c0c0c0] dark:border-b-[#4a4a4a] pb-2 -mt-1 pt-2.5 relative z-20 text-black dark:text-white'
                                    : 'bg-[#a0a0a0] dark:bg-[#3a3a3a] border-b-black dark:border-b-[#2a2a2a] hover:bg-[#b0b0b0] dark:hover:bg-[#4a4a4a] text-gray-700 dark:text-gray-300'
                                }
                            `}
                        >
                            All Games
                        </button>
                        {enabledScreens.filter(key => key !== 'HEART').map((gameKey) => (
                            <button
                                key={gameKey}
                                onClick={() => setSelectedGame(gameKey)}
                                className={`
                                    px-3 py-1.5 text-xs md:text-sm font-bold uppercase flex items-center transition-none
                                    border-2 border-t-white border-l-white border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-r-[#2a2a2a] truncate
                                    ${selectedGame === gameKey
                                        ? 'bg-[#c0c0c0] dark:bg-[#4a4a4a] border-b-[#c0c0c0] dark:border-b-[#4a4a4a] pb-2 -mt-1 pt-2.5 relative z-20 text-black dark:text-white'
                                        : 'bg-[#a0a0a0] dark:bg-[#3a3a3a] border-b-black dark:border-b-[#2a2a2a] hover:bg-[#b0b0b0] dark:hover:bg-[#4a4a4a] text-gray-700 dark:text-gray-300'
                                    }
                                `}
                            >
                                {GAME_REGISTRY[gameKey].name}
                            </button>
                        ))}
                    </div>

                    {/* TOOLBAR */}
                    <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] px-3 py-2 flex flex-wrap gap-4 items-center relative z-0">
                        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search achievements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-2 py-1 bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] outline-none text-xs text-black dark:text-gray-200"
                            />
                            <button
                                type="submit"
                                className="ml-2 px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#d0d0d0] dark:hover:bg-[#5a5a5a] active:translate-y-[1px]"
                            >
                                <Search className="w-3 h-3" /> Find
                            </button>
                        </form>

                        <button
                            onClick={fetchAchievements}
                            className="px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#d0d0d0] dark:hover:bg-[#5a5a5a] active:translate-y-[1px]"
                        >
                            <RefreshCcw className="w-3 h-3" /> Refresh
                        </button>
                    </div>

                    {/* CONTENT CONTAINER */}
                    <div className="flex-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-4 overflow-y-auto relative z-0">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin h-10 w-10 text-gray-600 dark:text-gray-400 mb-2" />
                                <span className="text-sm uppercase">Loading trophy data...</span>
                            </div>
                        ) : error ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-red-600 flex items-center gap-3">
                                    <ShieldAlert className="w-6 h-6" />
                                    <p className="font-bold uppercase text-xs">Error: {error}</p>
                                </div>
                                <button
                                    onClick={fetchAchievements}
                                    className="px-6 py-2 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] font-bold uppercase text-xs active:translate-y-[1px]"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : achievements.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <Trophy className="w-12 h-12 mb-2" />
                                <p className="font-bold uppercase italic text-sm">No medals found in this cabinet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {achievements.map((ach) => {
                                    const isEarned = !!ach.earned_at;
                                    return (
                                        <div
                                            key={ach.id}
                                            className={`bg-[#c0c0c0] dark:bg-[#3a3a3a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-3 transition-transform group ${isEarned ? 'hover:translate-x-0.5 hover:translate-y-0.5' : 'opacity-70 grayscale'}`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Achievement Icon */}
                                                <div className={`w-12 h-12 shrink-0 bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] flex items-center justify-center transition-colors ${isEarned ? 'group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                    <Trophy className={`w-8 h-8 ${isEarned ? 'text-yellow-600' : 'text-gray-400 dark:text-gray-600'}`} />
                                                </div>

                                                {/* Achievement Details */}
                                                <div className="flex-1 space-y-2 overflow-hidden">
                                                    <h3 className={`font-bold text-xs uppercase leading-tight ${isEarned ? 'text-blue-800 dark:text-blue-400' : 'text-gray-600 dark:text-gray-500'}`} title={ach.name}>
                                                        {ach.name}
                                                    </h3>
                                                    <p className="text-[10px] text-gray-700 dark:text-gray-400 leading-relaxed font-medium line-clamp-3 min-h-[36px]">
                                                        {ach.description}
                                                    </p>
                                                    <div className="flex flex-wrap justify-between items-end mt-1 gap-1">
                                                        <span className={`text-[10px] text-white px-1.5 py-0.5 font-bold ${isEarned ? 'bg-[#000080]' : 'bg-gray-500 dark:bg-gray-700'}`}>
                                                            {ach.code}
                                                        </span>
                                                        <span className={`text-[10px] font-bold ${isEarned ? 'text-gray-800 dark:text-gray-300' : 'text-gray-500 dark:text-gray-600 italic'}`}>
                                                            {isEarned ? new Date(ach.earned_at).toLocaleDateString() : 'Locked'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Achievements;
