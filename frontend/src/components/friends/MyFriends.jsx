import { PaginationSection } from "../common/PaginationSection";
import { getMyFriendsApi } from "@/services/user.service";
import { useState, useEffect, useRef } from "react";
import RemoveFriend from "@/components/friends/RemoveFriend";


function MyFriends() {
    const [friends, setFriends] = useState([]);
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

    const getFriendSince = (acceptedAt) => {
        if (!acceptedAt) return "";

        const now = new Date();
        const start = new Date(acceptedAt);
        const diffMs = now - start;

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (days < 1) return "Hôm nay";
        if (days < 7) return `${days} ngày`;
        if (days < 30) return `${Math.floor(days / 7)} tuần`;
        if (days < 365) return `${Math.floor(days / 30)} tháng`;
        return `${Math.floor(days / 365)} năm`;
    };

    const handleRemoveFriend = (friendId) => {
        setFriends((prevFriends) =>
            prevFriends.filter(friend => friend.id !== friendId)
        );
    }

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const data = await getMyFriendsApi(page, limit, search);
                setFriends(data.data.myFriends);
                setTotalPages(data.data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchFriends();
    }, [page, search]);

    return (
        <div className="w-full h-full">
            <div className="flex flex-col justify-between h-full">
                {/* Searchbar */}
                <div className="search-bar flex justify-end">
                    <div className="relative flex items-center gap-2 font-mono">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-[300px] p-2 pr-8 border border-gray-600"
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

                {/* Users list */}
                <div className="users-list flex-1 overflow-y-auto min-h-0 mt-4 border-2 border-gray-400 bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#c0c0c0] sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider">Username</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider">Email</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Friend since</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {friends?.length > 0 ? (
                                friends.map((friend, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-blue-50 transition-colors cursor-default font-mono text-sm group"
                                    >
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200">
                                            <div className="font-bold text-gray-800">{friend.username}</div>
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-gray-600">
                                            {friend.email}
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-gray-600 text-center">
                                            {getFriendSince(friend.accepted_at)}
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-red-200 text-gray-600 text-center">
                                            <RemoveFriend friendId={friend.id} onRemove={handleRemoveFriend} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 font-mono italic">
                                        No users found. Please try again.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <PaginationSection dataLength={friends.length} totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div>
    );
}

export default MyFriends;

