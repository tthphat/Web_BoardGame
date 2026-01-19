import React, { useState, useEffect, useCallback } from 'react';
import { getLeaderboardApi, getAllLeaderboardsApi } from '@/services/game.service';
import { getMyFriendsApi } from '@/services/user.service';
import { useEnabledGames } from '@/hooks/useEnabledGames';
import { GAME_REGISTRY } from '@/config/gameRegistry';
import { Trophy, Medal, Clock, Gamepad2, ShieldAlert, RefreshCcw, Users, User, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RankingPage = () => {
    const [leaderboardData, setLeaderboardData] = useState(null); // Array or Object depending on view
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null); // null = All Games
    const { user } = useAuth();

    // Filter State
    const [friends, setFriends] = useState([]);
    const [filterMode, setFilterMode] = useState('global'); // 'global', 'friends_only', 'specific_user'
    const [targetUserId, setTargetUserId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Hook to get enabled games
    const { enabledScreens } = useEnabledGames();

    // Fetch friends list on mount
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getMyFriendsApi(1, 100); // Get first 100 friends
                setFriends(response.data.myFriends || []);
            } catch (err) {
                console.warn("Failed to fetch friends for filter:", err);
            }
        };
        fetchFriends();
    }, []);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            // Construct options
            const options = {};
            if (filterMode === 'friends_only') {
                options.filter = 'friends';
            } else if (filterMode === 'specific_user' && targetUserId) {
                options.userId = targetUserId;
            }

            if (selectedGame) {
                // Fetch specific game leaderboard
                const slug = GAME_REGISTRY[selectedGame]?.slug;
                if (!slug) throw new Error("Invalid game configuration");

                const response = await getLeaderboardApi(slug, 20, { ...options, page }); // Get top 20
                setLeaderboardData(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                }
            } else {
                // Fetch all leaderboards (summary)
                const response = await getAllLeaderboardsApi(5, options); // Get top 5 for summary
                setLeaderboardData(response.data);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            setError(err.message || "Failed to load rankings");
        } finally {
            setLoading(false);
        }
    }, [selectedGame, filterMode, targetUserId, page]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    // Helper to render user row
    const renderUserRow = (user, index, type = 'full', slug = null) => {
        // Correct rank display: Use database-provided "globalRank" if in specific_user mode, otherwise index-based
        const rankValue = (filterMode === 'specific_user' && user.globalRank) ? Number(user.globalRank) : index + 1;
        const isTop3 = rankValue <= 3;

        // Rank color logic based on the actual rank value
        let rankColor = 'text-gray-600 dark:text-gray-400';
        if (rankValue === 1) rankColor = 'text-yellow-600';
        else if (rankValue === 2) rankColor = 'text-gray-400';
        else if (rankValue === 3) rankColor = 'text-orange-600';

        // Dynamic column checks
        const showTotal = !['match-3', 'snake', 'memory-card'].includes(slug);
        const showTime = false;

        return (
            <tr key={user.userId} className={`
                ${isTop3 ? 'font-bold bg-white dark:bg-[#3d3d3d]' : 'even:bg-gray-100 dark:even:bg-[#252525]'} 
                hover:bg-blue-50 dark:hover:bg-[#4d4d4d] text-xs transition-colors
            `}>
                <td className="p-2 text-center border-r border-retro-shadow dark:border-[#555]">
                    <span className={`inline-block w-5 text-center ${rankColor}`}>
                        {rankValue === 1 ? '🥇' : rankValue === 2 ? '🥈' : rankValue === 3 ? '🥉' : `#${rankValue}`}
                    </span>
                </td>
                <td className="p-2 border-r border-retro-shadow dark:border-[#555]">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-tr from-retro-teal to-retro-navy rounded-sm border border-black flex items-center justify-center text-[10px] text-white">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[80px] md:max-w-[120px]">{user.username}</span>
                    </div>
                </td>

                {showTotal && (
                    <td className="p-2 text-right border-r border-retro-shadow dark:border-[#555]">
                        {user.totalScore?.toLocaleString() || '-'}
                    </td>
                )}

                <td className="p-2 text-right">
                    {user.bestScore?.toLocaleString() || '-'}
                </td>

                {showTime && (
                    <td className="p-2 text-right border-l border-retro-shadow dark:border-[#555]">
                        {user.bestTimeSeconds ? `${user.bestTimeSeconds}s` : '-'}
                    </td>
                )}
            </tr>
        );
    };

    // Render a single leaderboard table (Mini or Full)
    const LeaderboardTable = ({ data, title, type = 'full', slug = null }) => {
        const hasData = data && data.length > 0;
        const currentSlug = slug || (selectedGame ? GAME_REGISTRY[selectedGame]?.slug : null);

        // Column Logic
        const showTotal = !['match-3', 'snake', 'memory-card'].includes(currentSlug);
        const showTime = false;
        const colCount = 2 + (showTotal ? 1 : 0) + 1 + (showTime ? 1 : 0);

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
                                {showTotal && <th className="p-2 border-b-2 border-retro-shadow text-right dark:border-[#555]">Total Score</th>}
                                <th className="p-2 border-b-2 border-retro-shadow text-right dark:border-[#555]">Best Score</th>
                                {showTime && <th className="p-2 border-b-2 border-retro-shadow text-right dark:border-[#555]">Time</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {hasData ? (
                                data.map((user, idx) => renderUserRow(user, idx, type, currentSlug))
                            ) : (
                                <tr>
                                    <td colSpan={colCount} className="p-8 text-center text-xs text-gray-400 italic">
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
                    onClick={() => {
                        setSelectedGame(null);
                        setPage(1);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold uppercase transition-all relative ${!selectedGame
                        ? 'bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-transparent border-r-retro-shadow z-10 -mb-[2px] pt-1.5 dark:bg-[#2d2d2d] dark:border-t-[#000] dark:border-l-[#000] dark:border-r-[#555]'
                        : 'bg-[#b0b0b0] border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow hover:bg-retro-silver dark:bg-[#1a1a1a] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000] dark:hover:bg-[#2d2d2d]'
                        }`}
                >
                    All Games
                </button>
                {enabledScreens.filter(key => key !== 'HEART' && key !== 'DRAWING').map((gameKey) => (
                    <button
                        key={gameKey}
                        onClick={() => {
                            setSelectedGame(gameKey);
                            setPage(1);
                        }}
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
            <div className="bg-retro-silver p-3 border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow flex justify-between items-center dark:bg-[#2d2d2d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000]">
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase hidden sm:block">View Scope:</span>
                    <div className="relative">
                        <select
                            value={
                                filterMode === 'global' ? 'global' :
                                    filterMode === 'friends_only' ? 'friends_only' :
                                        (filterMode === 'specific_user' && user && targetUserId === user.id) ? 'me' :
                                            targetUserId || ''
                            }
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'global') {
                                    setFilterMode('global');
                                    setTargetUserId(null);
                                } else if (val === 'friends_only') {
                                    setFilterMode('friends_only');
                                    setTargetUserId(null);
                                } else if (val === 'me') {
                                    setFilterMode('specific_user');
                                    setTargetUserId(user?.id);
                                } else {
                                    setFilterMode('specific_user');
                                    setTargetUserId(val);
                                }
                                setPage(1);
                            }}
                            className="bg-white border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight text-xs py-1 pl-2 pr-8 min-w-[150px] focus:outline-none dark:bg-[#3d3d3d] dark:border-t-[#000] dark:border-l-[#000] dark:border-b-[#555] dark:border-r-[#555]"
                        >
                            <option value="global">🌐 Global Ranking</option>
                            <option value="friends_only">👥 Friends Only</option>
                            <option value="me">👤 My Rank Only</option>
                            {friends.length > 0 && (
                                <optgroup label="Specific Friend">
                                    {friends.map(f => (
                                        <option key={f.friend_id} value={f.friend_id}>👤 {f.username}</option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>
                </div>

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
                        <p className="text-sm font-bold uppercase dark:text-gray-300">Loading Data...</p>
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

            {/* Pagination Controls - Only for Single Game View */}
            {selectedGame && !loading && !error && (
                <div className="flex justify-center items-center gap-4 py-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight disabled:opacity-50 disabled:grayscale text-xs font-bold uppercase dark:bg-[#3d3d3d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000]"
                    >
                        ◀ Prev
                    </button>
                    <span className="text-xs font-bold uppercase dark:text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 bg-retro-silver border-2 border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight disabled:opacity-50 disabled:grayscale text-xs font-bold uppercase dark:bg-[#3d3d3d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-[#000] dark:border-r-[#000]"
                    >
                        Next ▶
                    </button>
                </div>
            )}

            {/* Status Bar */}
            <div className="bg-retro-silver border-2 border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight px-2 py-0.5 flex justify-between text-[10px] font-bold uppercase text-gray-700 dark:bg-[#2d2d2d] dark:border-t-[#555] dark:border-l-[#555] dark:border-b-black dark:border-r-black">
                <div className="dark:text-gray-200">
                    {selectedGame ? `Viewing: ${GAME_REGISTRY[selectedGame].name}` : 'Viewing: All Games Summary'}
                    <span className="ml-4">Filter: {filterMode === 'global' ? 'Global' : filterMode === 'friends_only' ? 'Friends' : 'Single User'}</span>
                </div>
                <div className="dark:text-gray-200">Online</div>
            </div>
        </div>
    );
};

export default RankingPage;
