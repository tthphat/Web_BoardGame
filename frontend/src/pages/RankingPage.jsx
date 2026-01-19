import React, { useState, useEffect, useCallback } from 'react';
import { getLeaderboardApi, getAllLeaderboardsApi } from '@/services/game.service';
import { useEnabledGames } from '@/hooks/useEnabledGames';
import { GAME_REGISTRY } from '@/config/gameRegistry';
import { Trophy, Medal, Clock, Gamepad2, ShieldAlert, RefreshCcw } from 'lucide-react';

const RankingPage = () => {
    const [leaderboardData, setLeaderboardData] = useState(null); // Array or Object depending on view
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null); // null = All Games

    // Hook to get enabled games
    const { enabledScreens } = useEnabledGames();

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            if (selectedGame) {
                // Fetch specific game leaderboard
                const slug = GAME_REGISTRY[selectedGame]?.slug;
                if (!slug) throw new Error("Invalid game configuration");

                const response = await getLeaderboardApi(slug, 20); // Get top 20
                setLeaderboardData(response.data);
            } else {
                // Fetch all leaderboards (summary)
                const response = await getAllLeaderboardsApi(5); // Get top 5 for summary
                setLeaderboardData(response.data);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            setError(err.message || "Failed to load rankings");
        } finally {
            setLoading(false);
        }
    }, [selectedGame]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    // Helper to render user row
    const renderUserRow = (user, index, type = 'full') => {
        const isTop3 = index < 3;
        const rankColor = index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400';

        return (
            <tr key={user.userId} className={`
                ${isTop3 ? 'font-bold bg-white dark:bg-[#3d3d3d]' : 'even:bg-gray-100 dark:even:bg-[#252525]'} 
                hover:bg-blue-50 dark:hover:bg-[#4d4d4d] text-xs transition-colors
            `}>
                <td className="p-2 text-center border-r border-retro-shadow dark:border-[#555]">
                    <span className={`inline-block w-5 text-center ${rankColor}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                </td>
                <td className="p-2 border-r border-retro-shadow dark:border-[#555]">
                    <div className="flex items-center gap-2">
                        {/* Avatar placeholder if needed */}
                        <div className="w-5 h-5 bg-gradient-to-tr from-retro-teal to-retro-navy rounded-sm border border-black flex items-center justify-center text-[10px] text-white">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[100px] md:max-w-[150px]">{user.username}</span>
                    </div>
                </td>
                <td className="p-2 text-right border-r border-retro-shadow dark:border-[#555]">
                    {type === 'full' || selectedGame === 'TIC_TAC_TOE' || selectedGame === 'CARO_4' || selectedGame === 'CARO_5'
                        ? (user.totalScore?.toLocaleString() || '-')
                        : (user.totalWins?.toLocaleString())
                    }
                </td>
                <td className="p-2 text-right">
                    {/* Display Best Score for score-based games, or Total Wins usually */}
                    {user.bestScore?.toLocaleString() || '-'}
                </td>
                {/* Only show time for Memory if full view */}
                {selectedGame === 'MEMORY' && type === 'full' && (
                    <td className="p-2 text-right border-l border-retro-shadow dark:border-[#555]">
                        {user.bestTimeSeconds ? `${user.bestTimeSeconds}s` : '-'}
                    </td>
                )}
            </tr>
        );
    };

    // Render a single leaderboard table (Mini or Full)
    const LeaderboardTable = ({ data, title, type = 'full' }) => {
        const hasData = data && data.length > 0;

        return (
            <div className={`bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight flex flex-col h-full dark:bg-[#2d2d2d] dark:border-t-[#000] dark:border-l-[#000] dark:border-b-[#555] dark:border-r-[#555]`}>
                {title && (
                    <div className="bg-retro-navy px-2 py-1 text-white font-bold text-xs flex items-center gap-2 dark:bg-[#000040]">
                        <Gamepad2 className="w-3 h-3" />
                        {title}
                    </div>
                )}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#d0d0d0] text-[10px] uppercase dark:bg-[#333] dark:text-gray-300">
                                <th className="p-2 border-b-2 border-retro-shadow w-10 text-center dark:border-[#555]">Rank</th>
                                <th className="p-2 border-b-2 border-retro-shadow dark:border-[#555]">Player</th>
                                <th className="p-2 border-b-2 border-retro-shadow text-right dark:border-[#555]">Total Score</th>
                                <th className="p-2 border-b-2 border-retro-shadow text-right dark:border-[#555]">Best Score</th>
                                {selectedGame === 'MEMORY' && type === 'full' && (
                                    <th className="p-2 border-b-2 border-retro-shadow text-right dark:border-[#555]">Time</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {hasData ? (
                                data.map((user, idx) => renderUserRow(user, idx, type))
                            ) : (
                                <tr>
                                    <td colSpan={selectedGame === 'MEMORY' && type === 'full' ? 5 : 4} className="p-8 text-center text-xs text-gray-400 italic">
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto max-w-6xl h-full py-4 px-2 font-mono flex flex-col gap-4">
            {/* Title Bar */}
            <div className="bg-retro-navy px-3 py-1.5 flex justify-between items-center border-b-2 border-b-retro-shadow dark:bg-[#000040]">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">Ranking_System.exe</span>
                </div>
                <div className="flex gap-1.5">
                    <button className="w-5 h-5 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black text-[10px] flex items-center justify-center active:border-t-black active:border-l-black active:border-b-retro-highlight active:border-r-retro-highlight">_</button>
                    <button className="w-5 h-5 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black text-[10px] flex items-center justify-center active:border-t-black active:border-l-black active:border-b-retro-highlight active:border-r-retro-highlight">X</button>
                </div>
            </div>

            {/* Game Tabs */}
            <div className="flex flex-wrap gap-0 px-1">
                <button
                    onClick={() => setSelectedGame(null)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase transition-all relative ${!selectedGame
                        ? 'bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-transparent border-r-retro-shadow z-10 -mb-[2px] pt-1.5 dark:bg-[#2d2d2d] dark:border-t-[#000] dark:border-l-[#000] dark:border-r-[#555]'
                        : 'bg-[#b0b0b0] border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow hover:bg-retro-silver dark:bg-[#1a1a1a] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000] dark:hover:bg-[#2d2d2d]'
                        }`}
                >
                    All Games
                </button>
                {enabledScreens.filter(key => key !== 'HEART').map((gameKey) => (
                    <button
                        key={gameKey}
                        onClick={() => setSelectedGame(gameKey)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase transition-all relative ${selectedGame === gameKey
                            ? 'bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-transparent border-r-retro-shadow z-10 -mb-[2px] pt-1.5 dark:bg-[#2d2d2d] dark:border-t-[#000] dark:border-l-[#000] dark:border-r-[#555]'
                            : 'bg-[#b0b0b0] border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow hover:bg-retro-silver dark:bg-[#1a1a1a] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000] dark:hover:bg-[#2d2d2d]'
                            }`}
                    >
                        {GAME_REGISTRY[gameKey].name}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-retro-silver p-3 border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow flex justify-end items-center dark:bg-[#2d2d2d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000]">
                <button
                    onClick={fetchLeaderboard}
                    className="px-3 py-1 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight active:translate-y-0.5 text-xs font-bold uppercase transition-all flex items-center gap-1 dark:bg-[#3d3d3d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000]"
                >
                    <RefreshCcw className="w-3 h-3" /> Refresh
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight p-4 overflow-y-auto min-h-[400px] dark:bg-[#1a1a1a] dark:border-t-[#000] dark:border-l-[#000] dark:border-b-[#555] dark:border-r-[#555]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-70">
                        <RefreshCcw className="w-8 h-8 animate-spin text-retro-navy dark:text-blue-400" />
                        <p className="text-sm font-bold uppercase dark:text-gray-300">Accessing Mainframe...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-white border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight text-red-600 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6" />
                            <p className="font-bold">Error: {error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* All Games View */}
                        {!selectedGame && leaderboardData && (
                            <div className="flex flex-col gap-10 max-w-3xl mx-auto">
                                {Object.values(leaderboardData).map((gameData) => (
                                    <div key={gameData.slug} className="w-full">
                                        <LeaderboardTable
                                            data={gameData.players}
                                            title={gameData.gameName}
                                            type="mini"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Single Game View */}
                        {selectedGame && Array.isArray(leaderboardData) && (
                            <div className="h-full">
                                <LeaderboardTable
                                    data={leaderboardData}
                                    title={`${GAME_REGISTRY[selectedGame].name} - Top Players`}
                                    type="full"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Status Bar */}
            <div className="bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight px-2 py-0.5 flex justify-between text-[10px] font-bold uppercase text-gray-700 dark:bg-[#2d2d2d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-black dark:border-r-black">
                <div className="dark:text-gray-200">
                    {selectedGame ? `Viewing: ${GAME_REGISTRY[selectedGame].name}` : 'Viewing: All Games Summary'}
                </div>
                <div className="dark:text-gray-200">Online</div>
            </div>
        </div>
    );
};

export default RankingPage;
