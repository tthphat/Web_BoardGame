import { RefreshCcw } from "lucide-react";

function Loading({ message = "Loading...", className = "" }) {
    return (
        <div className={`h-full flex flex-col items-center justify-center space-y-2 opacity-70 ${className}`}>
            <RefreshCcw className="w-8 h-8 animate-spin text-retro-navy dark:text-blue-400" />
            <p className="text-sm font-bold uppercase dark:text-gray-300">{message}</p>
        </div>
    );
}

export default Loading;