import React from 'react';
import UserSettings from '../components/user/UserSettings';

const SettingsPage = () => {
    return (
        <div className="container mx-auto max-w-4xl py-6">
            {/* Title with Retro Style */}
            <div className="mb-6 border-b-4 border-black pb-2 flex items-baseline justify-between">
                <h1 className="text-4xl font-black text-black dark:text-white uppercase tracking-wider font-mono transform -skew-x-12">
                    SETTINGS
                </h1>
                <span className="font-mono text-gray-500">CONFIG_SYS_V1</span>
            </div>

            <UserSettings />
        </div>
    );
};

export default SettingsPage;
