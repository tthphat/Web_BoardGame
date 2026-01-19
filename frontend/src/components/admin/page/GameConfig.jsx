import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import {
    getAllGamesApi,
    updateGameStateApi,
    getAllBoardConfigsApi,
    updateBoardConfigApi
} from '../../../services/admin.service';
import { toast } from 'sonner';

const GameConfig = () => {
    const [games, setGames] = useState([]);
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null); // id being saved

    // Fetch initial data
    const refreshData = async () => {
        setLoading(true);
        try {
            const [gamesData, configsData] = await Promise.all([
                getAllGamesApi(),
                getAllBoardConfigsApi()
            ]);
            setGames(gamesData.data);
            setConfigs(configsData.data);
        } catch (error) {
            toast.error("Failed to load configuration data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Handle Game Enable/Disable
    const handleToggleGame = async (game) => {
        const newState = !game.enabled;
        try {
            await updateGameStateApi(game.id, newState);
            setGames(prev => prev.map(g => g.id === game.id ? { ...g, enabled: newState } : g));
            toast.success(`Game ${game.name} ${newState ? 'ENABLED' : 'DISABLED'}`);
        } catch (error) {
            toast.error("Failed to update game state");
        }
    };

    // Handle Config Change (Local State)
    const handleConfigChange = (id, field, value) => {
        setConfigs(prev => prev.map(c =>
            c.id === id ? { ...c, [field]: parseInt(value) || 0 } : c
        ));
    };

    // Handle Config Save
    const handleSaveConfig = async (config) => {
        setSaving(config.id);
        try {
            await updateBoardConfigApi(config.id, {
                cols: config.cols,
                rows: config.rows,
                dot_size: config.dot_size,
                gap: config.gap
            });
            toast.success(`Config for ${config.code} saved successfully`);
        } catch (error) {
            toast.error("Failed to save configuration");
        } finally {
            setSaving(null);
        }
    };

    // Handle Config Apply (Notify Games)
    const handleApplyConfig = async (config) => {
        setSaving(config.id);
        try {
            await updateBoardConfigApi(config.id, {
                cols: config.cols,
                rows: config.rows,
                dot_size: config.dot_size,
                gap: config.gap
            });
            toast.success(`Configuration applied to all games using '${config.code}' successfully!`);
        } catch (error) {
            toast.error("Failed to apply configuration");
        } finally {
            setSaving(null);
        }
    };

    if (loading) return <div className="p-4 font-mono">LOADING CONFIGURATION...</div>;

    return (
        <div className="space-y-8 font-mono p-1">

            {/* 1. Game Management Section */}
            <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black">
                <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2"><Settings size={14} /> SYSTEM_GAMES.CFG</span>
                    <button onClick={refreshData} className="px-1 bg-[#c0c0c0] text-black"><RefreshCw size={12} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-white dark:bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                    {games.map(game => (
                        <div key={game.id} className={`p-4 border-2 ${game.enabled ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{game.name}</h3>
                                <button
                                    onClick={() => handleToggleGame(game)}
                                    className={`flex items-center gap-1 px-2 py-1 text-xs font-bold border-2 border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white ${game.enabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                                >
                                    {game.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    {game.enabled ? 'ENABLED' : 'DISABLED'}
                                </button>
                            </div>
                            <div className="text-xs text-gray-500">
                                <p>SLUG: {game.slug}</p>
                                <p>BOARD_ID: {game.board_size}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Board Configuration Section */}
            <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black">
                <div className="bg-[#800000] text-white px-2 py-1 text-sm font-bold mb-2">
                    <span className="flex items-center gap-2"><Settings size={14} /> BOARD_CONFIGS.INI</span>
                </div>

                <div className="bg-white dark:bg-black p-0 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#e0e0e0] dark:bg-[#333] border-b border-gray-400">
                            <tr>
                                <th className="p-3 border-r border-gray-400">CODE</th>
                                <th className="p-3 border-r border-gray-400">COLS</th>
                                <th className="p-3 border-r border-gray-400">ROWS</th>
                                <th className="p-3 border-r border-gray-400">DOT SIZE (px)</th>
                                <th className="p-3 border-r border-gray-400">GAP (px)</th>
                                <th className="p-3 text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map(config => (
                                <tr key={config.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="p-3 font-bold border-r border-gray-200 dark:border-gray-800">{config.code}</td>
                                    <td className="p-3 border-r border-gray-200 dark:border-gray-800">
                                        <input
                                            type="number"
                                            className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black"
                                            value={config.cols}
                                            onChange={(e) => handleConfigChange(config.id, 'cols', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3 border-r border-gray-200 dark:border-gray-800">
                                        <input
                                            type="number"
                                            className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black"
                                            value={config.rows}
                                            onChange={(e) => handleConfigChange(config.id, 'rows', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3 border-r border-gray-200 dark:border-gray-800">
                                        <input
                                            type="number"
                                            className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black"
                                            value={config.dot_size}
                                            onChange={(e) => handleConfigChange(config.id, 'dot_size', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3 border-r border-gray-200 dark:border-gray-800">
                                        <input
                                            type="number"
                                            className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black"
                                            value={config.gap}
                                            onChange={(e) => handleConfigChange(config.id, 'gap', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3 text-center flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleSaveConfig(config)}
                                            disabled={saving === config.id}
                                            className="flex items-center justify-center gap-1 px-3 py-1 bg-[#c0c0c0] hover:bg-[#dcdcdc] text-black border-2 border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white disabled:opacity-50"
                                        >
                                            {saving === config.id ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                            SAVE
                                        </button>
                                        <button
                                            onClick={() => handleApplyConfig(config)}
                                            disabled={saving === config.id}
                                            className="flex items-center justify-center gap-1 px-3 py-1 bg-[#c0c0c0] hover:bg-[#dcdcdc] text-black border-2 border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white disabled:opacity-50"
                                        >
                                            {saving === config.id ? <RefreshCw size={14} className="animate-spin" /> : <Settings size={14} />}
                                            APPLY
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GameConfig;
