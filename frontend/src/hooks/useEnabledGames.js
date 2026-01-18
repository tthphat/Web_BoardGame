import { useState, useEffect, useCallback } from 'react';
import { getEnabledGamesApi } from '../services/game.service';
import { GAME_REGISTRY, GAME_SCREENS } from '../config/gameRegistry';

/**
 * Hook to fetch enabled games from backend
 * and filter GAME_SCREENS based on enabled slugs
 */
export const useEnabledGames = () => {
    const [enabledSlugs, setEnabledSlugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEnabledGames = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('[useEnabledGames] Fetching enabled games...');
            const response = await getEnabledGamesApi();
            console.log('[useEnabledGames] API Response:', response);
            
            if (response.success && response.data) {
                const slugs = response.data.map(game => game.slug);
                console.log('[useEnabledGames] Enabled slugs:', slugs);
                setEnabledSlugs(slugs);
            } else {
                console.warn('[useEnabledGames] No data in response, using fallback');
            }
        } catch (err) {
            console.error('Failed to fetch enabled games:', err);
            setError(err.message);
            // Fallback: enable all games if API fails
            setEnabledSlugs(GAME_SCREENS.map(screen => GAME_REGISTRY[screen]?.slug).filter(Boolean));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEnabledGames();
    }, [fetchEnabledGames]);

    // Filter GAME_SCREENS based on enabled slugs
    const enabledScreens = GAME_SCREENS.filter(screen => {
        const config = GAME_REGISTRY[screen];
        if (!config) return false;
        
        // Always show HEART (welcome screen)
        if (screen === 'HEART') return true;
        
        // Check if game slug is in enabled list
        return enabledSlugs.includes(config.slug);
    });

    return {
        enabledSlugs,
        enabledScreens,
        loading,
        error,
        refetch: fetchEnabledGames
    };
};
