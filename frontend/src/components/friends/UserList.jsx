import { PaginationSection } from "../common/PaginationSection";
import { getAllUsersApi } from "@/services/user.service";
import { useState, useEffect } from "react";


function UserList() {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

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
                    <div className="flex gap-2 font-mono">
                        <input type="text" placeholder="Search..." className="w-[300px] p-2 border border-gray-600" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button className="p-2 border border-gray-600 transition-all hover:bg-blue-800 hover:text-white">Search</button>
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


