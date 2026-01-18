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
            // Giả lập delay một chút để thấy hiệu ứng loading retro nếu cần
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
        <div className="h-full flex flex-col font-mono">
            {/* Header Area */}
            <div className="mb-4 flex justify-between items-end shrink-0">
                <div>
                    {/* <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider">
                        USER_DATABASE.MDB
                    </h2> */}
                    <p className="text-xs text-gray-500">Total Records: {meta.total}</p>
                </div>
            </div>

            {/* Main Content Area - Chiếm phần còn lại và scroll nội bộ */}
            <div className="flex-1 overflow-hidden flex flex-col">
                
                {loading ? (
                    <div className="flex-1 flex items-center justify-center bg-white dark:bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                        <span className="animate-pulse">LOADING DATA...</span>
                    </div>
                ) : (
                    <>
                        {/* Table Container: Hiệu ứng lõm sâu (Sunken) */}
                        <div className="flex-1 overflow-auto bg-white dark:bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white relative">
                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                
                                {/* Table Header: Sticky để khi cuộn header vẫn đứng yên */}
                                <thead className="sticky top-0 z-10 bg-[#c0c0c0] dark:bg-[#2d2d2d] text-black dark:text-white">
                                    <tr>
                                        {['Username', 'Email', 'Role', 'State', 'Trophies', 'Joined Date'].map((head, i) => (
                                            <th key={i} scope="col" className="px-4 py-2 border-b-2 border-r-2 border-gray-500 border-r-white border-b-black text-xs uppercase font-bold select-none">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-dashed divide-gray-300 dark:divide-gray-700">
                                    {users.map((user, index) => (
                                        <tr key={user.id} className={`hover:bg-blue-100 dark:hover:bg-blue-900 cursor-default ${index % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-[#111]'}`}>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 dark:text-gray-300 font-bold">
                                                {user.username}
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 dark:text-gray-300">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800">
                                                {/* Role Badge: Style vuông vức */}
                                                <span className={`px-1.5 py-0.5 text-[10px] border border-black dark:border-white font-bold uppercase
                                                    ${user.role === 'admin' 
                                                        ? 'bg-red-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                                                        : 'bg-blue-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800">
                                                <span className={`text-xs uppercase font-bold ${user.state === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                                    [{user.state}]
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 text-center dark:text-gray-300">
                                                {user.achievement_count.toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-4 py-2 dark:text-gray-300">
                                                {/* FORMAT DATE: Chỉ lấy ngày tháng năm */}
                                                {user.created_at ? format(new Date(user.created_at), "yyyy-MM-dd") : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Area: Style Toolbar */}
                        <div className="mt-2 shrink-0 flex justify-center bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-t-2 border-white dark:border-[#555]">
                            <Pagination>
                                <PaginationContent className="gap-1">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(meta.page - 1)}
                                            className={`h-8 rounded-none border border-black bg-[#e0e0e0] hover:bg-white active:bg-gray-400 ${meta.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={page === meta.page}
                                                onClick={() => handlePageChange(page)}
                                                className={`h-8 w-8 rounded-none border border-black cursor-pointer
                                                    ${page === meta.page 
                                                        ? 'bg-blue-800 text-white font-bold shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]' 
                                                        : 'bg-[#e0e0e0] text-black hover:bg-white active:bg-gray-400'
                                                    }`}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(meta.page + 1)}
                                            className={`h-8 rounded-none border border-black bg-[#e0e0e0] hover:bg-white active:bg-gray-400 ${meta.page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserManagement;