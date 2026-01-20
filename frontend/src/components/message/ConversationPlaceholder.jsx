import { MessageSquare } from "lucide-react";

function ConversationPlaceholder() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 opacity-60">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
        </div>
    );
}

export default ConversationPlaceholder;
