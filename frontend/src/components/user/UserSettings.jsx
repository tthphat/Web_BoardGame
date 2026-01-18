import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Keyboard, Grid, Save } from 'lucide-react';
import { toast } from 'sonner';

const UserSettings = () => {
    const {
        controls,
        setControls,
        boardConfigId,
        setBoardConfigId,
        availableConfigs
    } = useSettings();

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="p-1 font-mono space-y-4">
            {/* Header */}
            <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex items-center justify-between border-2 border-t-white border-l-white border-b-black border-r-black">
                <span>USER_PREFERENCES.INI</span>
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
                                    {controls === 'ARROWS' && <div className="w-2 h-2 bg-black"></div>}
                                </div>
                                <input
                                    type="radio"
                                    name="controls"
                                    className="hidden"
                                    checked={controls === 'ARROWS'}
                                    onChange={() => setControls('ARROWS')}
                                />
                                <div>
                                    <p className="font-bold group-hover:text-blue-700">ARROW KEYS</p>
                                    <p className="text-xs text-gray-500">Use ↑ ↓ ← → to move</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white flex items-center justify-center`}>
                                    {controls === 'WASD' && <div className="w-2 h-2 bg-black"></div>}
                                </div>
                                <input
                                    type="radio"
                                    name="controls"
                                    className="hidden"
                                    checked={controls === 'WASD'}
                                    onChange={() => setControls('WASD')}
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
                                value={boardConfigId || ''}
                                onChange={(e) => setBoardConfigId(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-2 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white outline-none font-mono"
                            >
                                <option value="">-- SYSTEM DEFAULT --</option>
                                {availableConfigs.map(config => (
                                    <option key={config.id} value={config.id}>
                                        {config.code} ({config.cols}x{config.rows}, Dot: {config.dot_size}px)
                                    </option>
                                ))}
                            </select>

                            {boardConfigId && (
                                <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs">
                                    <p>Note: Some competitive games may enforce standard board sizes regardless of this setting.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
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
