import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getBoardConfigsApi } from "@/services/game.service"

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // 1. Controls Preference
    const [controls, setControls] = useState(() => {
        const saved = localStorage.getItem('user_controls');
        return saved ? JSON.parse(saved) : 'ARROWS'; // 'ARROWS' or 'WASD'
    });

    // 2. Game Time Limits
    const [memoryTimeLimit, setMemoryTimeLimit] = useState(() => {
        const saved = localStorage.getItem('memory_time_limit');
        return saved ? parseInt(saved, 10) : 30; // Default: 30 seconds
    });

    const [match3TimeLimit, setMatch3TimeLimit] = useState(() => {
        const saved = localStorage.getItem('match3_time_limit');
        return saved ? parseInt(saved, 10) : 60; // Default: 60 seconds
    });

    // 3. Available Board Configs (Fetched from API)
    const [availableConfigs, setAvailableConfigs] = useState([]);

    useEffect(() => {
        localStorage.setItem('user_controls', JSON.stringify(controls));
    }, [controls]);

    useEffect(() => {
        localStorage.setItem('memory_time_limit', memoryTimeLimit.toString());
    }, [memoryTimeLimit]);

    useEffect(() => {
        localStorage.setItem('match3_time_limit', match3TimeLimit.toString());
    }, [match3TimeLimit]);



    // Fetch Board Configs
    const fetchBoardConfigs = async () => {
        try {
            const response = await getBoardConfigsApi();
            setAvailableConfigs(response.data);
        } catch (error) {
            console.error("Failed to fetch board configs", error);
        }
    };

    useEffect(() => {
        fetchBoardConfigs();
    }, []);

    // Expose active configuration
    const activeConfig = availableConfigs.find(c => c.is_active) || null;

    const value = {
        controls,
        setControls,
        memoryTimeLimit,
        setMemoryTimeLimit,
        match3TimeLimit,
        setMatch3TimeLimit,
        availableConfigs,
        activeConfig,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
