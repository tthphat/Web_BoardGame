import { useState, useCallback } from 'react';
import { finishGameApi, getLeaderboardApi, getUserStatsApi } from '../services/game.service';

/**
 * Hook to manage game statistics tracking and leaderboard
 * @param {string} gameSlug - The game identifier (e.g., 'snake', 'memory-card')
 * @param {boolean} isLoggedIn - Whether the user is logged in
 */
export function useGameStats(gameSlug, isLoggedIn) {
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    /**
     * Call when a game ends to record stats
     * @param {object} result - { score, won, timeSeconds }
     * @returns {Promise<object|null>} Stats info or null if guest
     */
    const recordGameEnd = useCallback(async (result) => {
        console.log(`[useGameStats] 🎯 recordGameEnd called`, { gameSlug, isLoggedIn, result });
        
        // Skip API call for guests
        if (!isLoggedIn) {
            console.log('[useGameStats] ⚠️ Guest mode - skipping stats recording');
            return null;
        }

        if (!gameSlug) {
            console.warn('[useGameStats] ⚠️ No gameSlug provided for stats recording');
            return null;
        }

        setLoading(true);
        try {
            console.log(`[useGameStats] 📡 Calling finishGameApi for: ${gameSlug}`, result);
            const response = await finishGameApi(gameSlug, result);
            console.log(`[useGameStats] ✅ API Success:`, response);
            setLastResult(response.data);
            return response.data;
        } catch (error) {
            console.error('[useGameStats] ❌ Failed to record game stats:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [gameSlug, isLoggedIn]);

    /**
     * Fetch leaderboard for the current game
     * @param {number} limit - Number of top players to fetch
     */
    const fetchLeaderboard = useCallback(async (limit = 10) => {
        if (!gameSlug) return;

        setLoading(true);
        try {
            const response = await getLeaderboardApi(gameSlug, limit);
            setLeaderboard(response.data || []);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [gameSlug]);

    /**
     * Fetch all game stats for the current user
     */
    const fetchUserStats = useCallback(async () => {
        if (!isLoggedIn) return [];

        setLoading(true);
        try {
            const response = await getUserStatsApi();
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    return {
        loading,
        lastResult,
        leaderboard,
        recordGameEnd,
        fetchLeaderboard,
        fetchUserStats,
        // Helper to check if this was a new high score
        isNewBestScore: lastResult?.stats?.newBestScore || false,
        isNewBestTime: lastResult?.stats?.newBestTime || false,
    };
}
