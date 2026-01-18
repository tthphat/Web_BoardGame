
import { PaginationSection } from "../common/PaginationSection";
import { getFriendRequestsApi } from "@/services/user.service";
import { useState, useEffect, useRef } from "react";


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
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests?.length > 0 ? (
                                requests.map((request) => (
                                    <tr
                                        key={request.id}
                                        className="hover:bg-blue-50 transition-colors cursor-default font-mono text-sm group"
                                    >
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200">
                                            <div className="font-bold text-gray-800">{request.username}</div>
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-gray-600">
                                            {request.email}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    className="
                                                        px-3 py-1 text-xs border border-green-600 text-green-600 
                                                        hover:bg-green-600 hover:text-white transition-all
                                                        active:scale-95 font-bold uppercase
                                                    "

                                                    title="Accept Friend Request"
                                                >
                                                    + Accept
                                                </button>

                                                <button
                                                    className="
                                                        px-3 py-1 text-xs border border-red-600 text-red-600 
                                                        hover:bg-red-600 hover:text-white transition-all
                                                        active:scale-95 font-bold uppercase
                                                    "

                                                    title="Reject Friend Request"
                                                >
                                                    - Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500 font-mono italic">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <PaginationSection totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div>
    );
}

export default FriendRequests;
