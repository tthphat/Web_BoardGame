import { NavLink, Outlet } from "react-router-dom";
import FriendArea from "@/components/message/FriendArea";

function ConversationLayout() {

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full h-full bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-xl flex flex-col">
                {/* Header Bar */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-2 flex items-center justify-between mb-1">
                    <span className="text-white font-bold font-mono tracking-widest pl-2">CONVERSATION MANAGER</span>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-[2fr_1fr] gap-4 p-4 bg-[#c0c0c0] min-h-0">
                    {/* Conversation Area */}
                    <div className="flex-1 bg-white border-inset border-2 border-gray-600 p-4 shadow-inner overflow-hidden min-h-0 flex flex-col">
                        <Outlet />
                    </div>

                    {/* Friends Area */}
                    <div className="flex-1 bg-white border-inset border-2 border-gray-600 p-4 shadow-inner overflow-hidden min-h-0 flex flex-col">
                        <FriendArea />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationLayout;
