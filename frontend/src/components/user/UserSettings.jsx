import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Keyboard, Grid, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useBlocker } from 'react-router-dom';

const UserSettings = () => {
    const {
        controls,
        setControls,
    } = useSettings();

    // Local state for deferred saving
    const [localControls, setLocalControls] = useState(controls);

    // Sync local state when global state changes (e.g. initial load)
    useEffect(() => {
        setLocalControls(controls);
    }, [controls]);

    // Check for unsaved changes
    const isDirty = useMemo(() => {
        return localControls !== controls;
    }, [localControls, controls]);

    // Block navigation if dirty
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    const handleSave = () => {
        setControls(localControls);
        toast.success("Settings saved successfully!");
    };

    const handleReset = () => {
        // Reset to defaults
        const defaultControls = 'ARROWS';

        setLocalControls(defaultControls);

        toast.info("Settings reset to default. Click Save to apply.");
    };

    return (
        <div className="p-1 font-mono space-y-4 relative">
            {/* Header */}
            <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex items-center justify-between border-2 border-t-white border-l-white border-b-black border-r-black">
                <span>USER_PREFERENCES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Control Settings */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black">
                    <div className="bg-[#e0e0e0] p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-full">
                        <div className="flex items-center gap-2 mb-4 text-[#000080] dark:text-[#000080] font-bold border-b border-gray-400 pb-2">
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
                                    <p className="font-bold group-hover:text-blue-700 dark:group-hover:text-blue-700 text-black dark:text-black">ARROW KEYS</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Use ↑ ↓ ← → to move</p>
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
                                    <p className="font-bold group-hover:text-blue-700 dark:group-hover:text-blue-700 text-black dark:text-black">WASD KEYS</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Use W A S D to move</p>
                                </div>
                            </label>
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

            {/* Unsaved Changes Warning Modal */}
            {blocker.state === "blocked" && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black w-full max-w-sm shadow-2xl">
                        <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex items-center gap-2">
                            <AlertTriangle size={16} className="text-yellow-400" />
                            <span>WARNING</span>
                        </div>
                        <div className="p-4 bg-gray-100 text-black text-center">
                            <p className="font-bold mb-2">UNSAVED CHANGES DETECTED!</p>
                            <p className="text-sm mb-6">Do you want to save your changes before leaving?</p>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        handleSave();
                                        blocker.proceed();
                                    }}
                                    className="w-full py-2 bg-green-200 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold hover:bg-green-300"
                                >
                                    YES - SAVE & LEAVE
                                </button>
                                <button
                                    onClick={() => blocker.proceed()}
                                    className="w-full py-2 bg-red-200 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold hover:bg-red-300"
                                >
                                    NO - DISCARD CHANGES
                                </button>
                                <button
                                    onClick={() => blocker.reset()}
                                    className="w-full py-2 bg-gray-300 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold hover:bg-gray-400"
                                >
                                    CANCEL - STAY HERE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSettings;
