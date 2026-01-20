import React, { useState, useEffect, useCallback } from 'react';
import { getLeaderboardApi, getAllLeaderboardsApi } from '@/services/game.service';
import { getMyFriendsApi } from '@/services/user.service';
import { useEnabledGames } from '@/hooks/useEnabledGames';
import { GAME_REGISTRY } from '@/config/gameRegistry';
import { Trophy, Gamepad2, ShieldAlert, RefreshCcw, Minimize2, X, Loader2 } from 'lucide-react';
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
            </tr>
        );
    };

    const LeaderboardTable = ({ data, title, type = 'full', slug = null }) => {
        const hasData = data && data.length > 0;
        const currentSlug = slug || (selectedGame ? GAME_REGISTRY[selectedGame]?.slug : null);

        const showTotal = !['match-3', 'snake', 'memory-card'].includes(currentSlug);
        const colCount = 2 + (showTotal ? 1 : 0) + 1;

        return (
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-1 shadow-sm mb-4">
                {title && (
                    <div className="bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center gap-2 mb-1 uppercase">
                        <Gamepad2 className="w-3 h-3" />
                        {title}
                    </div>
                )}
                <div className="bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#c0c0c0] dark:bg-[#3a3a3a] text-[10px] uppercase text-black dark:text-gray-200">
                                <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] w-10 text-center">Rank</th>
                                <th className="p-2 border-b-2 border-gray-500 dark:border-[#555]">Player</th>
                                {showTotal && <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] text-right">Total Score</th>}
                                <th className="p-2 border-b-2 border-gray-500 dark:border-[#555] text-right">Best Score</th>
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
        <div className="container mx-auto p-4 max-w-5xl h-full font-mono flex flex-col gap-4 text-black dark:text-gray-200">

            {/* MAIN WINDOW FRAME */}
            <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-1 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col h-full">

                {/* HEADER BAR */}
                <div className="bg-[#000080] text-white px-2 py-1 mb-2 font-bold text-lg flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        <span className="uppercase tracking-wide truncate">RANKING_SYSTEM</span>
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
                            onClick={() => {
                                setSelectedGame(null);
                                setPage(1);
                            }}
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
                        {enabledScreens.filter(key => key !== 'HEART' && key !== 'DRAWING').map((gameKey) => (
                            <button
                                key={gameKey}
                                onClick={() => {
                                    setSelectedGame(gameKey);
                                    setPage(1);
                                }}
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
                    <div className="bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] px-3 py-2 flex justify-between items-center relative z-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase hidden sm:block">Scope:</span>
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
                                className="bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-xs py-1 pl-2 pr-6 min-w-[140px] focus:outline-none text-black dark:text-gray-200"
                            >
                                <option value="global">🌐 Global</option>
                                <option value="friends_only">👥 Friends</option>
                                <option value="me">👤 My Rank</option>
                                {friends.length > 0 && (
                                    <optgroup label="Friend">
                                        {friends.map(f => (
                                            <option key={f.friend_id} value={f.friend_id}>👤 {f.username}</option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>

                        <button
                            onClick={fetchLeaderboard}
                            className="px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#d0d0d0] dark:hover:bg-[#5a5a5a] transition-colors active:translate-y-[1px]"
                        >
                            <RefreshCcw className="w-3 h-3" /> Refresh
                        </button>
                    </div>

                    {/* CONTENT CONTAINER */}
                    <div className="flex-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] p-4 overflow-y-auto relative z-0">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin h-10 w-10 text-gray-600 dark:text-gray-400 mb-2" />
                                <span className="text-sm uppercase">Reading Disk...</span>
                            </div>
                        ) : error ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <div className="p-4 bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a] text-red-600 flex items-center gap-3">
                                    <ShieldAlert className="w-6 h-6" />
                                    <p className="font-bold uppercase text-xs">Error: {error}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                {!selectedGame && leaderboardData && (
                                    <div className="flex flex-col gap-4">
                                        {Object.values(leaderboardData).map((gameData) => (
                                            <LeaderboardTable
                                                key={gameData.slug}
                                                data={gameData.players}
                                                title={gameData.gameName}
                                                type="mini"
                                            />
                                        ))}
                                    </div>
                                )}

                                {selectedGame && Array.isArray(leaderboardData) && (
                                    <LeaderboardTable
                                        data={leaderboardData}
                                        title={`${GAME_REGISTRY[selectedGame].name} - TOP PLAYERS`}
                                        type="full"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination - Only for specific game views */}
                    {selectedGame && !loading && !error && (
                        <div className="flex justify-center gap-2 py-2 bg-[#c0c0c0] dark:bg-[#4a4a4a]">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase disabled:opacity-50"
                            >
                                ◀ Prev
                            </button>

                            <div className="flex items-center px-4 text-xs font-bold bg-white dark:bg-[#2a2a2a] border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-[#1a1a1a] dark:border-l-[#1a1a1a] dark:border-b-[#5a5a5a] dark:border-r-[#5a5a5a]">
                                Page {page} / {totalPages || 1}
                            </div>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="px-3 py-1 bg-[#c0c0c0] dark:bg-[#4a4a4a] border-2 border-t-white border-l-white border-b-black border-r-black dark:border-t-[#6a6a6a] dark:border-l-[#6a6a6a] dark:border-b-[#2a2a2a] dark:border-r-[#2a2a2a] active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold uppercase disabled:opacity-50"
                            >
                                Next ▶
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RankingPage;
