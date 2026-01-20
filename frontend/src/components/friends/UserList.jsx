import { PaginationSection } from "../common/PaginationSection";
import { getAllUsersFriendApi } from "@/services/user.service";
import { useState, useEffect, useRef } from "react";
import AddFriend from "@/components/friends/AddFriend";


function UserList() {
    const [users, setUsers] = useState([]);
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
        const fetchUsers = async () => {
            try {
                const data = await getAllUsersFriendApi(page, limit, search);
                setUsers(data.data.users);
                setTotalPages(data.data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [page, search]);

    return (
        <div className="w-full h-full ">
            <div className="flex flex-col justify-between h-full">
                {/* Searchbar */}
                <div className="search-bar flex justify-end">
                    <div className="relative flex items-center gap-2 font-mono">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-[300px] p-2 pr-8 border border-gray-600 dark:bg-[#2d2d2d] dark:text-white"
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
                            className="p-2 border border-gray-600 transition-all hover:bg-blue-800 hover:text-white dark:text-white"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Users list */}
                <div className="users-list dark:bg-[#333] flex-1 overflow-y-auto min-h-0 mt-4 border-2 border-gray-400 bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#c0c0c0] dark:bg-[#2d2d2d] dark:text-white sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider">Username</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider">Email</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Role</th>
                                <th className="p-3 border-b-2 border-gray-600 font-mono text-sm uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-default font-mono text-sm group"
                                    >
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200">
                                            <div className="font-bold text-gray-800 dark:text-white">{user.username}</div>
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-gray-600 dark:text-gray-300">
                                            {user.email}
                                        </td>
                                        <td className="p-3 border-r border-dashed border-gray-300 group-hover:border-blue-200 text-center">
                                            <span className={`
                                                px-2 py-0.5 text-xs border border-gray-400 font-bold
                                                ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}
                                            `}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <AddFriend friend_state={user.friend_state} user_id={user.id} />
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
                <PaginationSection dataLength={users.length} totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div>
    );
}

export default UserList;


