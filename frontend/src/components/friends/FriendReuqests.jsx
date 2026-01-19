
import { PaginationSection } from "../common/PaginationSection";
import { getFriendRequestsApi } from "@/services/user.service";
import { useState, useEffect, useRef } from "react";
import AcceptRejectFriend from "@/components/friends/AcceptRejectFriend";


function FriendRequests() {
    const [requests, setRequests] = useState([]);
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

    const handleDateSent = (date) => {
        const now = new Date();
        const sentDate = new Date(date);
        const diffMs = now - sentDate;

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (days < 1) {
            return "Hôm nay";
        }

        if (days < 7) {
            return `${days} ngày trước`;
        }

        if (days < 30) {
            const weeks = Math.floor(days / 7);
            return `${weeks} tuần trước`;
        }

        if (days < 365) {
            const months = Math.floor(days / 30);
            return `${months} tháng trước`;
        }

        const years = Math.floor(days / 365);
        return `${years} năm trước`;
    };

    // xử lí xóa khi reject
    const handleRequest = (idToRemove) => {
        setRequests((prevRequests) =>
            prevRequests.filter(req => req.sender_id !== idToRemove)
        );
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getFriendRequestsApi(page, limit, search);
                setRequests(data.data.friendRequests);
                setTotalPages(data.data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchRequests();
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
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Date sent</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests?.length > 0 ? (
                                requests.map((request) => (
                                    <tr
                                        key={request.sender_id}
                                        className="hover:bg-blue-50 transition-colors cursor-default font-mono text-sm group"
                                    >
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200">
                                            <div className="font-bold text-gray-800">{request.username}</div>
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-gray-600">
                                            {request.email}
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-gray-600 text-center">
                                            {handleDateSent(request.created_at)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <AcceptRejectFriend
                                                sender_id={request.sender_id}
                                                handleRequest={handleRequest}
                                            />
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
                <PaginationSection dataLength={requests.length} totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div>
    );
}

export default FriendRequests;
