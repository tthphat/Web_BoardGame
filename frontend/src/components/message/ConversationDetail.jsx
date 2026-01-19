import { useParams } from "react-router-dom";
import { UserRound, Send, Phone, Video, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

function ConversationDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, sender_id: 1, content: "Hello there!", created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, sender_id: 999, content: "Hi! How are you?", created_at: new Date(Date.now() - 3000000).toISOString() },
        { id: 3, sender_id: 1, content: "I'm doing good, thanks for asking.", created_at: new Date(Date.now() - 1000000).toISOString() },
        // Mock data usually comes with sender_id. Assuming 'current_user_id' is distinct.
        // We'll need real data later.
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Mock user for UI purposes - replace with real data fetching later
    const partner = {
        name: "Partner Name",
        status: "Online"
    };

    const currentUserId = user.id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender_id: currentUserId,
            content: inputMessage,
            created_at: new Date().toISOString()
        };

        setMessages([...messages, newMessage]);
        setInputMessage("");
    };


    return (
        <div className="h-full flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <UserRound className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{partner.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <p className="text-xs text-green-600 font-medium">{partner.status}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            {!isMe && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2 flex items-center justify-center text-gray-500 self-end mb-1">
                                    <UserRound className="w-4 h-4" />
                                </div>
                            )}
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 py-2 px-4 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className={`p-2 rounded-full transition-colors 
                            ${inputMessage.trim()
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ConversationDetail;
