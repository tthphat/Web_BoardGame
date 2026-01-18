import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Keyboard, Grid, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const UserSettings = () => {
    const {
        controls,
        setControls,
        boardConfigId,
        setBoardConfigId,
        availableConfigs
    } = useSettings();

    // Local state for deferred saving
    const [localControls, setLocalControls] = useState(controls);
    const [localBoardId, setLocalBoardId] = useState(boardConfigId);

    // Sync local state when global state changes (e.g. initial load)
    useEffect(() => {
        setLocalControls(controls);
        setLocalBoardId(boardConfigId);
    }, [controls, boardConfigId]);

    const handleSave = () => {
        setControls(localControls);
        setBoardConfigId(localBoardId);
        toast.success("Settings saved successfully!");
    };

    const handleReset = () => {
        // Reset to defaults
        const defaultControls = 'ARROWS';
        const defaultBoardId = null; // or availableConfigs[0]?.id if required

        setLocalControls(defaultControls);
        setLocalBoardId(defaultBoardId);

        // Also commit defaults immediately or wait for save? 
        // Request says "reset ... to default (show toast)", usually implies immediate action or just form reset.
        // "Change settings... only when user clicks save".
        // Use case: User clicks Reset -> Form updates to default -> User clicks Save to apply? 
        // OR Reset -> Applies immediately?
        // Usually Reset in a form just resets the form. 
        // But "Reset setting về mặc định" might imply the action of resetting.
        // Let's implement: Reset Button -> Resets FORM to default values. User still needs to Click Save?
        // User request: "Chỉ khi người dùng nhấn save settings thì mới áp dụng các setting ấy" (Only apply when user presses save).
        // So Reset should ONLY reset the form state.

        toast.info("Settings reset to default. Click Save to apply.");
    };

    return (
        <div className="p-1 font-mono space-y-4">
            {/* Header */}
            <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex items-center justify-between border-2 border-t-white border-l-white border-b-black border-r-black">
                <span>USER_PREFERENCES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Control Settings */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black">
                    <div className="bg-[#e0e0e0] p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-full">
                        <div className="flex items-center gap-2 mb-4 text-[#000080] font-bold border-b border-gray-400 pb-2">
                            <Keyboard size={20} />
                            <h3>CONTROLS CONFIGURATION</h3>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white flex items-center justify-center`}>
                                    {localControls === 'ARROWS' && <div className="w-2 h-2 bg-black"></div>}
                                </div>
                                <input
                                    type="radio"
                                    name="controls"
                                    className="hidden"
                                    checked={localControls === 'ARROWS'}
                                    onChange={() => setLocalControls('ARROWS')}
                                />
                                <div>
                                    <p className="font-bold group-hover:text-blue-700">ARROW KEYS</p>
                                    <p className="text-xs text-gray-500">Use ↑ ↓ ← → to move</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white flex items-center justify-center`}>
                                    {localControls === 'WASD' && <div className="w-2 h-2 bg-black"></div>}
                                </div>
                                <input
                                    type="radio"
                                    name="controls"
                                    className="hidden"
                                    checked={localControls === 'WASD'}
                                    onChange={() => setLocalControls('WASD')}
                                />
                                <div>
                                    <p className="font-bold group-hover:text-blue-700">WASD KEYS</p>
                                    <p className="text-xs text-gray-500">Use W A S D to move</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 2. Board Settings */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black">
                    <div className="bg-[#e0e0e0] p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-full">
                        <div className="flex items-center gap-2 mb-4 text-[#000080] font-bold border-b border-gray-400 pb-2">
                            <Grid size={20} />
                            <h3>BOARD DISPLAY CONFIG</h3>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm mb-2">Select your preferred board size for supported games (Snake, etc.):</p>

                            <select
                                value={localBoardId || ''}
                                onChange={(e) => setLocalBoardId(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-2 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white outline-none font-mono"
                            >
                                {/* Removed System Default as requested. If value is null, it shows empty or first? 
                                    If user MUST select one, we should auto-select first one. 
                                    But "null" means default logic in code.
                                    If we remove option but keep null possibility, select might separate.
                                    Let's add a placeholder if no id selected that forces selection? 
                                    Or just don't show "System Default".
                                    If I remove <option value="">, and localBoardId is null, browser might show nothing or first option.
                                    Better to show "Select Board Size" if null, but request says "Remove option".
                                    I will remove the EXPLICIT option. 
                                */}
                                {availableConfigs.map(config => (
                                    <option key={config.id} value={config.id}>
                                        {config.code} ({config.cols}x{config.rows}, Dot: {config.dot_size}px)
                                    </option>
                                ))}
                            </select>

                            {localBoardId && (
                                <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs">
                                    <p>Note: Some competitive games may enforce standard board sizes regardless of this setting.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 gap-4">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-2 bg-[#ffcccc] text-red-900 border-2 border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold hover:bg-[#ffb3b3]"
                >
                    <RotateCcw size={16} />
                    RESET DEFAULT
                </button>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-[#c0c0c0] text-black border-2 border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold hover:bg-[#dcdcdc]"
                >
                    <Save size={16} />
                    SAVE SETTINGS
                </button>
            </div>
        </div>
    );
};

export default UserSettings;
