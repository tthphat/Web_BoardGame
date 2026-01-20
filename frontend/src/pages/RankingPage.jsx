import React, { useState, useEffect, useCallback } from 'react';
import { getLeaderboardApi, getAllLeaderboardsApi } from '@/services/game.service';
import { getMyFriendsApi } from '@/services/user.service';
import { useEnabledGames } from '@/hooks/useEnabledGames';
import { GAME_REGISTRY } from '@/config/gameRegistry';
import { Trophy, Medal, Clock, Gamepad2, ShieldAlert, RefreshCcw, Users, User, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RankingPage = () => {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const { user } = useAuth();

    const [friends, setFriends] = useState([]);
    const [filterMode, setFilterMode] = useState('global');
    const [targetUserId, setTargetUserId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { enabledScreens } = useEnabledGames();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getMyFriendsApi(1, 100);
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
            const options = {};
            if (filterMode === 'friends_only') {
                options.filter = 'friends';
            } else if (filterMode === 'specific_user' && targetUserId) {
                options.userId = targetUserId;
            }

            if (selectedGame) {
                const slug = GAME_REGISTRY[selectedGame]?.slug;
                if (!slug) throw new Error("Invalid game configuration");

                const response = await getLeaderboardApi(slug, 20, { ...options, page });
                setLeaderboardData(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                }
            } else {
                const response = await getAllLeaderboardsApi(5, options);
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

    const renderUserRow = (user, index, type = 'full', slug = null) => {
        const rankValue = (filterMode === 'specific_user' && user.globalRank) ? Number(user.globalRank) : index + 1;
        const isTop3 = rankValue <= 3;

        let rankColor = 'text-gray-600 dark:text-gray-400';
        if (rankValue === 1) rankColor = 'text-yellow-600';
        else if (rankValue === 2) rankColor = 'text-gray-400';
        else if (rankValue === 3) rankColor = 'text-orange-600';

        const showTotal = !['match-3', 'snake', 'memory-card'].includes(slug);
        const showTime = false;

        return (
            <tr key={user.userId} className={`
                ${isTop3 ? 'font-bold bg-white dark:bg-[#3a3a3a]' : 'even:bg-gray-100 dark:even:bg-[#2a2a2a]'} 
                hover:bg-blue-50 dark:hover:bg-[#4a4a4a] text-xs transition-colors
            `}>
                <td className="p-2 text-center border-r border-gray-400 dark:border-[#555]">
                    <span className={`inline-block w-5 text-center ${rankColor}`}>
                        {rankValue === 1 ? '🥇' : rankValue === 2 ? '🥈' : rankValue === 3 ? '🥉' : `#${rankValue}`}
                    </span>
                </td>
                <td className="p-2 border-r border-gray-400 dark:border-[#555]">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-tr from-teal-600 to-blue-900 rounded-sm border border-black flex items-center justify-center text-[10px] text-white">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[80px] md:max-w-[120px] text-black dark:text-gray-200">{user.username}</span>
                    </div>
                </td>

                {showTotal && (
                    <td className="p-2 text-right border-r border-gray-400 dark:border-[#555] text-black dark:text-gray-200">
                        {user.totalScore?.toLocaleString() || '-'}
                    </td>
                )}

                <td className="p-2 text-right text-black dark:text-gray-200">
                    {user.bestScore?.toLocaleString() || '-'}
                </td>

                {showTime && (
                    <td className="p-2 text-right border-l border-gray-400 dark:border-[#555] text-black dark:text-gray-200">
                        {user.bestTimeSeconds ? `${user.bestTimeSeconds}s` : '-'}
                    </td>
                )}
            </tr>
        );
    };

    const LeaderboardTable = ({ data, title, type = 'full', slug = null }) => {
        const hasData = data && data.length > 0;
        const currentSlug = slug || (selectedGame ? GAME_REGISTRY[selectedGame]?.slug : null);

        const showTotal = !['match-3', 'snake', 'memory-card'].includes(currentSlug);
        const showTime = false;
        const colCount = 2 + (showTotal ? 1 : 0) + 1 + (showTime ? 1 : 0);

        return (
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-1 shadow-md">
                {title && (
                    <div className="bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center gap-2 mb-1 uppercase">
                        <Gamepad2 className="w-3 h-3" />
                        {title}
                    </div>
                )}
                <div className="bg-white dark:bg-[#2a2a2a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#a0a0a0] dark:bg-[#3a3a3a] text-[10px] uppercase text-black dark:text-gray-200">
                                <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] w-10 text-center">Rank</th>
                                <th className="p-2 border-b-2 border-gray-500 dark:border-[#555]">Player</th>
                                {showTotal && <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] text-right">Total Score</th>}
                                <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] text-right">Best Score</th>
                                {showTime && <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] text-right">Time</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {hasData ? (
                                data.map((user, idx) => renderUserRow(user, idx, type, currentSlug))
                            ) : (
                                <tr>
                                    <td colSpan={colCount} className="p-8 text-center text-xs text-gray-500 dark:text-gray-400 italic uppercase">
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
        <div className="container mx-auto max-w-6xl h-full py-4 px-2 font-mono flex flex-col gap-4 text-black dark:text-gray-200">
            {/* Title Bar */}
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-1 shadow-md">
                <div className="bg-[#000080] px-3 py-1.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-white" />
                        <span className="text-white font-bold text-xs uppercase tracking-wider">RANKING_SYSTEM.EXE</span>
                    </div>
                    <div className="flex gap-1">
                        <button className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-[8px] flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white">_</button>
                        <button className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-[8px] flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white">X</button>
                    </div>
                </div>

                {/* Game Tabs */}
                <div className="flex flex-wrap gap-0 p-2 bg-[#c0c0c0] dark:bg-[#4a4a4a]">
                    <button
                        onClick={() => {
                            setSelectedGame(null);
                            setPage(1);
                        }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${!selectedGame
                            ? 'bg-white dark:bg-[#2a2a2a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-blue-800 dark:text-blue-400'
                            : 'bg-[#a0a0a0] dark:bg-[#3a3a3a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] hover:bg-[#b0b0b0] dark:hover:bg-[#4a4a4a]'
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
                            className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${selectedGame === gameKey
                                ? 'bg-white dark:bg-[#2a2a2a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-blue-800 dark:text-blue-400'
                                : 'bg-[#a0a0a0] dark:bg-[#3a3a3a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] hover:bg-[#b0b0b0] dark:hover:bg-[#4a4a4a]'
                                }`}
                        >
                            {GAME_REGISTRY[gameKey].name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-3 flex justify-between items-center shadow-md">
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
                            className="bg-white dark:bg-[#2a2a2a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-xs py-1 pl-2 pr-8 min-w-[150px] focus:outline-none text-black dark:text-gray-200"
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
                    className="px-3 py-1.5 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#d0d0d0] dark:hover:bg-[#5a5a5a] transition-colors"
                >
                    <RefreshCcw className="w-3 h-3" /> Refresh
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-[#e0e0e0] dark:bg-[#3a3a3a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] p-4 overflow-y-auto min-h-[400px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-70">
                        <RefreshCcw className="w-8 h-8 animate-spin text-blue-800 dark:text-blue-400" />
                        <p className="text-sm font-bold uppercase">Reading disk...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-white dark:bg-[#2a2a2a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-red-600 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6" />
                            <p className="font-bold uppercase text-xs">Error: {error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {!selectedGame && leaderboardData && (
                            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
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

                        {selectedGame && Array.isArray(leaderboardData) && (
                            <div className="h-full">
                                <LeaderboardTable
                                    data={leaderboardData}
                                    title={`${GAME_REGISTRY[selectedGame].name} - TOP_PLAYERS`}
                                    type="full"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Pagination */}
            {selectedGame && !loading && !error && totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-2 pb-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase disabled:opacity-50"
                    >
                        &lt; PREV
                    </button>

                    <div className="flex items-center px-4 text-xs font-bold bg-white dark:bg-[#2a2a2a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a]">
                        PAGE {page} / {totalPages}
                    </div>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase disabled:opacity-50"
                    >
                        NEXT &gt;
                    </button>
                </div>
            )}

            {/* Status Bar */}
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] px-2 py-0.5 flex justify-between text-[10px] font-bold uppercase">
                <div>
                    {selectedGame ? `Viewing: ${GAME_REGISTRY[selectedGame].name}` : 'Viewing: All Games Summary'}
                    <span className="ml-4">Filter: {filterMode === 'global' ? 'Global' : filterMode === 'friends_only' ? 'Friends' : 'Single User'}</span>
                </div>
                <div className="text-green-700 dark:text-green-400">● Online</div>
            </div>
        </div>
    );
};

export default RankingPage;
