import { getAllMyConversationsApi, searchUsersApi } from "@/services/user.service";
import { useState, useEffect, useRef } from "react";
import { PaginationSection } from "@/components/common/PaginationSection";
import Loading from "@/components/common/Loading";
import { MessageCircleX, UserRound } from "lucide-react";
import { Link } from "react-router-dom";


function FriendArea() {
    const [conversations, setConversations] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(false);

    const searchRef = useRef("");

    const handleSearch = () => {
        setPage(1);
        setSearch(searchRef.current.value);
    };

    const handleClearSearch = () => {
        searchRef.current.value = ""; // clear UI
        setPage(1);
        setSearch("");               // trigger fetch all
    };

    const handleLastMessageTime = (last_message_at) => { // tính luôn cả phút, giờ, ngày
        const date = new Date(last_message_at);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        if (diffDays > 0) {
            return `${diffDays} days ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hours ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minutes ago`;
        } else {
            return "Just now";
        }
    }

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const data = await getAllMyConversationsApi(page, limit, search);
                setConversations(data.data.conversations);
                setTotalPages(data.data.pagination.totalPages);

                if (search && data.data.conversations.length === 0) {
                    const userRes = await searchUsersApi(search);
                    setUsers(userRes.data.users);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [page, search]);


    if (loading) {
        return <Loading message="Loading conversations..." />;
    }

    return (
        <div className="w-full h-full bg-white flex flex-col">
            {/* Search Header */}
            <div className="search-bar flex justify-end">
                <div className="relative flex w-full items-center gap-2 font-mono">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 p-2 pr-8 border border-gray-600"
                        ref={searchRef}
                        onChange={(e) => {
                            if (e.target.value === "" && search !== "") {
                                setPage(1);
                                setSearch("");
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                    {/* Clear button */}
                    {search && (
                        <button
                            onClick={handleClearSearch}
                            type="button"
                            className="absolute right-[90px] text-gray-400 hover:text-red-600"
                        >
                            ✕
                        </button>
                    )}

                    <button
                        onClick={handleSearch}
                        className="p-2 border border-gray-600 transition-all hover:bg-blue-800 hover:text-white"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
                {/* Chưa có conversation */}
                {conversations.length === 0 && search && (
                    <div className="divide-y divide-gray-100">
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => startNewConversation(user)}
                                className="p-3 hover:bg-blue-50 cursor-pointer"
                            >
                                <UserRound />
                                <span>{user.username}</span>
                                <span className="text-xs text-gray-400">Start new chat</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Đã tồn tại conversation */}
                {conversations.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {conversations.map((conversation) => (
                            <Link to={`/messages/${conversation.conversation_id}`} key={conversation.conversation_id}
                                className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors group"
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <UserRound className="h-6 w-6" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-semibold text-gray-900 truncate text-sm">
                                            {conversation.partner_name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className={`text-xs truncate ${conversation.last_message_sender_id !== conversation.partner_id
                                            ? "text-gray-500"
                                            : "text-gray-900 font-medium"
                                            }`}>
                                            {conversation.last_message_sender_id !== conversation.partner_id && "You: "}
                                            {conversation.last_message}
                                        </p>
                                        <p className="text-xs text-gray-500">{handleLastMessageTime(conversation.last_message_at)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <MessageCircleX className="w-12 h-12 mb-2 opacity-50" />
                        <p className="text-sm">No conversations yet</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="p-2 border-t border-gray-200">
                <PaginationSection dataLength={conversations.length} totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div >
    );
}

export default FriendArea;
