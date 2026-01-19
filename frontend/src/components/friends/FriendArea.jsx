import { getConversationsApi } from "@/api/conversations";
import { useState, useEffect, useRef } from "react";
import { PaginationSection } from "@/components/common/PaginationSection";


function FriendArea() {
    const [conversations, setConversations] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

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


    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversationsApi(page, limit, search);
                setConversations(data.data.conversations);
                setTotalPages(data.data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchConversations();
    }, [page, search]);

    return (
        <div className="w-full h-full">
            <div className="flex flex-col justify-between h-full">
                {/* Searchbar */}
                <div className="search-bar flex justify-end">
                    <div className="relative flex items-center gap-2 font-mono w-full">
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
                <div className="users-list flex-1 overflow-y-auto min-h-0 mt-4 border-2 border-gray-400 bg-white">

                </div>

                {/* Phân trang */}
                <PaginationSection dataLength={conversations.length} totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div>
    );
}

export default FriendArea;
