import React, { useState, useEffect, useCallback } from 'react';
import { getUserAchievementsApi } from '@/services/achievement.service';
import { Trophy, ShieldAlert, Search, RefreshCcw, Gamepad2 } from 'lucide-react';
import { GAME_REGISTRY, GAME_SCREENS } from '@/config/gameRegistry';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState(null); // null means "All Games"

    const fetchAchievements = useCallback(async () => {
        setLoading(true);
        try {
            // Get slug from registry if selectedGame is set
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
        <div className="flex flex-col h-full space-y-4 font-mono">
            {/* Title Bar Style Header */}
            <div className="bg-retro-navy px-3 py-1.5 flex justify-between items-center border-b-2 border-b-retro-shadow">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">User_Achievements.exe</span>
                </div>
                <div className="flex gap-1.5">
                    <button className="w-5 h-5 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black text-[10px] flex items-center justify-center active:border-t-black active:border-l-black active:border-b-retro-highlight active:border-r-retro-highlight">_</button>
                    <button className="w-5 h-5 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black text-[10px] flex items-center justify-center active:border-t-black active:border-l-black active:border-b-retro-highlight active:border-r-retro-highlight">X</button>
                </div>
            </div>

            {/* Retro Tabs Filter */}
            <div className="flex flex-wrap gap-0 px-1 pt-1">
                <button
                    onClick={() => setSelectedGame(null)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase transition-all relative ${!selectedGame
                        ? 'bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-transparent border-r-retro-shadow z-10 -mb-[2px] pt-1.5'
                        : 'bg-[#b0b0b0] border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow hover:bg-retro-silver'
                        }`}
                >
                    All Games
                </button>
                {GAME_SCREENS.filter(key => key !== 'HEART').map((gameKey) => (
                    <button
                        key={gameKey}
                        onClick={() => setSelectedGame(gameKey)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase transition-all relative ${selectedGame === gameKey
                            ? 'bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-transparent border-r-retro-shadow z-10 -mb-[2px] pt-1.5'
                            : 'bg-[#b0b0b0] border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow hover:bg-retro-silver'
                            }`}
                    >
                        {GAME_REGISTRY[gameKey].name}
                    </button>
                ))}
            </div>

            {/* Toolbar / Filters */}
            <div className="bg-retro-silver p-3 border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow flex flex-wrap gap-4 items-center">
                <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search achievements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight outline-none text-sm"
                    />
                    <button
                        type="submit"
                        className="ml-2 px-3 py-1 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight active:translate-y-0.5 text-xs font-bold uppercase transition-all flex items-center gap-1"
                    >
                        <Search className="w-3 h-3" /> Find
                    </button>
                </form>

                <button
                    onClick={fetchAchievements}
                    className="px-3 py-1 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight active:translate-y-0.5 text-xs font-bold uppercase transition-all flex items-center gap-1"
                >
                    <RefreshCcw className="w-3 h-3" /> Refresh
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight p-4 overflow-y-auto min-h-[400px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-70">
                        <RefreshCcw className="w-8 h-8 animate-spin text-retro-navy" />
                        <p className="text-sm font-bold uppercase">Loading trophy data...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-white border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight text-red-600 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6" />
                            <p className="font-bold">Error: {error}</p>
                        </div>
                        <button
                            onClick={fetchAchievements}
                            className="px-6 py-2 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight font-bold uppercase"
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
                                    className={`bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow p-3 transition-transform group ${isEarned ? 'hover:translate-x-0.5 hover:translate-y-0.5' : 'opacity-70 grayscale'
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Achievement Icon */}
                                        <div className={`w-12 h-12 shrink-0 bg-white border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight flex items-center justify-center transition-colors ${isEarned ? 'group-hover:bg-yellow-50' : 'bg-gray-100'}`}>
                                            <Trophy className={`w-8 h-8 ${isEarned ? 'text-yellow-600' : 'text-gray-400'}`} />
                                        </div>

                                        {/* Achievement Details */}
                                        <div className="flex-1 space-y-2 overflow-hidden">
                                            <h3 className={`font-bold text-sm uppercase leading-tight ${isEarned ? 'text-retro-navy' : 'text-gray-600'}`} title={ach.name}>
                                                {ach.name}
                                            </h3>
                                            <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-3 min-h-[36px]">
                                                {ach.description}
                                            </p>
                                            <div className="flex flex-wrap justify-between items-end mt-1 gap-1">
                                                <span className={`text-[11px] text-white px-1.5 py-0.5 font-bold ${isEarned ? 'bg-retro-navy' : 'bg-gray-500'}`}>
                                                    {ach.code}
                                                </span>
                                                <span className={`text-[11px] font-bold ${isEarned ? 'text-gray-800' : 'text-gray-500 italic'}`}>
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

            {/* Status Bar */}
            <div className="bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight px-2 py-0.5 flex justify-between text-[10px] font-bold uppercase text-retro-shadow">
                <div>{achievements.length} items found</div>
                <div>Ready</div>
            </div>
        </div>
    );
};

export default Achievements;
