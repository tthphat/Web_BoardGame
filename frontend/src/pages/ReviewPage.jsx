import React from 'react';
import { useEnabledGames } from '../hooks/useEnabledGames';
import GameRating from '../components/games/GameRating';
import { Loader2, Gamepad2 } from 'lucide-react';
import { getGameConfig } from '../config/gameRegistry';

const ReviewPage = () => {
    const { enabledScreens, loading } = useEnabledGames();

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] border-2 border-t-white border-l-white border-b-black border-r-black p-1 shadow-xl mb-6">
                <div className="bg-[#000080] text-white px-4 py-2 font-bold font-mono text-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Gamepad2 />
                        GAME REVIEWS CENTER
                    </span>
                    <span className="text-sm font-normal opacity-80">Rate & Review</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enabledScreens.map((screenKey) => {
                        if (screenKey === 'HEART') return null;

                        const config = getGameConfig(screenKey);
                        if (!config) return null;

                        return (
                            <div key={screenKey} className="bg-[#e0e0e0] dark:bg-[#333] border-4 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                                <div>
                                    <h3 className="text-xl font-bold font-mono uppercase border-b-2 border-black pb-2 mb-2">{config.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono h-10 line-clamp-2">
                                        {config.description || "No description available."}
                                    </p>
                                </div>
                                <div className="mt-auto pt-2 border-t-2 border-gray-400 border-dashed flex justify-end">
                                    <GameRating
                                        gameSlug={config.slug}
                                        gameName={config.name}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
