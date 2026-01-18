import React, { useState, useEffect } from 'react';
import { getAllUsersApi } from '@/services/user.service';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { format } from "date-fns";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getAllUsersApi(page, meta.limit);
            setUsers(response.data.users);
            setMeta(response.data.meta);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= meta.totalPages) {
            fetchUsers(page);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-mono font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-6">
                User Management
            </h2>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white dark:bg-[#2d2d2d] border-2 border-gray-400 dark:border-gray-600 shadow-lg">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#1a1a1a]">
                                <tr>
                                    <th scope="col" className="px-6 py-4 dark:text-gray-300">Username</th>
                                    <th scope="col" className="px-6 py-4 dark:text-gray-300">Email</th>
                                    <th scope="col" className="px-6 py-4 dark:text-gray-300">Role</th>
                                    <th scope="col" className="px-6 py-4 dark:text-gray-300">State</th>
                                    <th scope="col" className="px-6 py-4 dark:text-gray-300">Achievements</th>
                                    <th scope="col" className="px-6 py-4 dark:text-gray-300">Joined At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#3d3d3d]">
                                        <td className="px-6 py-4 dark:text-gray-300">{user.username}</td>
                                        <td className="px-6 py-4 dark:text-gray-300">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                                ${user.role === 'admin' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                                ${user.state === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-800'}`}>
                                                {user.state}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-center dark:text-gray-300">{user.achievement_count}</td>
                                        <td className="px-6 py-4 dark:text-gray-300">{format(new Date(user.created_at), "yyyy-MM-dd HH:mm")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(meta.page - 1)}
                                        className={meta.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>

                                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            isActive={page === meta.page}
                                            onClick={() => handlePageChange(page)}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(meta.page + 1)}
                                        className={meta.page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserManagement;
