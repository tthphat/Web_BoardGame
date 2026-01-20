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



    // 3. Available Board Configs (Fetched from API)
    const [availableConfigs, setAvailableConfigs] = useState([]);

    useEffect(() => {
        localStorage.setItem('user_controls', JSON.stringify(controls));
    }, [controls]);



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
        availableConfigs,
        activeConfig,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
