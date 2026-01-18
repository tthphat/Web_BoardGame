import { PaginationSection } from "../common/PaginationSection";
import { getAllUsersApi } from "@/services/user.service";
import { useState, useEffect, useRef } from "react";


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
                const data = await getAllUsersApi(page, limit, search);
                setUsers(data.data.users);
                setTotalPages(data.data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
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
                <div className="users-list">
                    {users.map((user) => (
                        <div key={user.id} className="user">
                            <p>{user.username}</p>
                            <p>{user.email}</p>
                            <p>{user.role}</p>
                        </div>
                    ))}
                </div>

                {/* Phân trang */}
                <PaginationSection totalPages={totalPages} currentPage={page} onPageChange={setPage} />
            </div>
        </div>
    );
}

export default UserList;


