import { useParams } from "react-router-dom";
import { UserRound, Send, Phone, Video, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserApi, getMessagesApi, sendMessageApi } from "@/services/user.service";

function ConversationDetail() {
    const { id, userId } = useParams();
    const { user, loading } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);

    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [partner, setPartner] = useState({});

    const isLoadingMore = useRef("append");

    const currentUserId = user?.id;
    const isNewChat = Boolean(userId);

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useLayoutEffect(() => {
        if (isLoadingMore.current === "append") {
            scrollToBottom();
        } else if (isLoadingMore.current === "prepend") {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const newScrollHeight = scrollContainer.scrollHeight;
                const diff = newScrollHeight - prevScrollHeightRef.current;
                scrollContainer.scrollTop = diff; // Restore position
            }
            isLoadingMore.current = "idle";
        }
    }, [messages]);



    // Handle load more messages
    const handleLoadMore = async () => {
        if (!hasMore) return;
        isLoadingMore.current = "prepend";
        // Calculate current scroll height before loading more
        if (scrollContainerRef.current) {
            prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        }

        try {
            const res = await getMessagesApi(id, offset, limit);
            setMessages((prevMessages) => [...res.data.messages, ...prevMessages]);
            setOffset((prevOffset) => prevOffset + res.data.messages.length);
            setHasMore(res.data.messages.length === limit);
        } catch (error) {
            console.error("Error fetching more messages:", error);
        }
    };


    // Handle send message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        isLoadingMore.current = "append";

        try {
            if (isNewChat) {
                const res = await sendFirstMessageApi(userId, inputMessage);
                navigate(`/messages/${res.data.conversation_id}`);
            } else {
                const res = await sendMessageApi(id, inputMessage);
                setMessages((prev) => [...prev, res.data.message]);
            }
            setInputMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    // fetch messages from API
    const fetchMessages = async () => {
        isLoadingMore.current = "append";
        try {
            const res = await getMessagesApi(id, 0, limit);
            setMessages(res.data.messages);
            setOffset(res.data.messages.length);
            setPartner(res.data.partner);
            setHasMore(res.data.messages.length === limit);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchMessages();
    }, [id]);

    // fetch partner if don't have conversation
    useEffect(() => {
        const fetchPartner = async () => {
            if (isNewChat) {
                const res = await fetchUserApi(userId);
                setPartner(res.data.user);
                setMessages([]);
                setHasMore(false);
            }
        };
        fetchPartner();
    }, [userId]);



    if (loading) return <div className="h-full flex items-center justify-center">Loading...</div>; // Or use Loading component if imported

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <UserRound className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{partner.username}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <p className="text-xs text-green-600 font-medium">Online</p>
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
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
                {hasMore && messages.length > 0 && (
                    <div className="flex justify-center mb-8 ">
                        <button onClick={handleLoadMore} className="p-2 bg-gray-200 cursor-pointer rounded-full text-xs text-blue-600">
                            Load older messages
                        </button>
                    </div>
                )}

                {messages?.map((msg) => {
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
