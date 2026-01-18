import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // 1. Controls Preference
    const [controls, setControls] = useState(() => {
        const saved = localStorage.getItem('user_controls');
        return saved ? JSON.parse(saved) : 'ARROWS'; // 'ARROWS' or 'WASD'
    });

    // 2. Board Config Preference (ID)
    const [boardConfigId, setBoardConfigId] = useState(() => {
        const saved = localStorage.getItem('user_board_config_id');
        return saved ? parseInt(saved) : null; // null means use default
    });

    // 3. Available Board Configs (Fetched from API)
    const [availableConfigs, setAvailableConfigs] = useState([]);

    useEffect(() => {
        localStorage.setItem('user_controls', JSON.stringify(controls));
    }, [controls]);

    useEffect(() => {
        if (boardConfigId) {
            localStorage.setItem('user_board_config_id', boardConfigId);
        }
    }, [boardConfigId]);

    // Fetch Board Configs
    const fetchBoardConfigs = async () => {
        try {
            const response = await fetch("/api/games/board-configs", {
                headers: { "x-api-key": import.meta.env.VITE_API_KEY }
            });
            const data = await response.json();
            if (response.ok) {
                setAvailableConfigs(data.data);
                // Set default if none selected
                if (!boardConfigId && data.data.length > 0) {
                    // setBoardConfigId(data.data[0].id); // Optional: Auto select first? No, let's keep it null for "Game Default"
                }
            }
        } catch (error) {
            console.error("Failed to fetch board configs", error);
        }
    };

    useEffect(() => {
        fetchBoardConfigs();
    }, []);

    const value = {
        controls,
        setControls,
        boardConfigId,
        setBoardConfigId,
        availableConfigs,
        // Helper to get actual config object
        activeBoardConfig: availableConfigs.find(c => c.id === boardConfigId) || null
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
