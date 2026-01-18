import React, { useState, useEffect } from 'react';
import { getAllUsersApi, updateUserStateApi } from '@/services/user.service';
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
import { Ban, CheckCircle, AlertTriangle, X } from "lucide-react"; // Import thêm icon X và Alert

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    // --- STATE CHO MODAL ---
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        username: '',
        currentState: '', // 'active' hoặc 'blocked'
    });

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getAllUsersApi(page, meta.limit);
            setUsers(response.data.users);
            setUsers(response.data.users);
            setMeta(response.data.pagination);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 1. Hàm mở Modal khi bấm nút ở bảng
    const openConfirmModal = (user) => {
        setConfirmModal({
            isOpen: true,
            userId: user.id,
            username: user.username,
            currentState: user.state,
        });
    };

    // 2. Hàm đóng Modal
    const closeConfirmModal = () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    // 3. Hàm thực thi khi bấm YES trong Modal
    const handleConfirmAction = async () => {
        const { userId, currentState } = confirmModal;
        // User requested 'lock' for block, 'active' for unblock.
        const newState = currentState === 'active' ? 'lock' : 'active';
        const actionName = currentState === 'active' ? 'BLOCK' : 'UNBLOCK';

        try {
            await updateUserStateApi(userId, newState);

            // Cập nhật State bảng ngay lập tức
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === userId ? { ...user, state: newState } : user
            ));

            // Thông báo Toast
            toast.success(`ACTION COMPLETED`, {
                description: `User [${confirmModal.username}] has been ${actionName}ED.`
            });
        } catch (error) {
            toast.error("Failed to update user state", {
                description: error.message
            });
        } finally {
            // Đóng Modal
            closeConfirmModal();
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= meta.totalPages) fetchUsers(page);
    };

    return (
        <div className="h-full flex flex-col font-mono relative">
            {/* Header Area */}
            <div className="mb-4 flex justify-between items-end shrink-0">
                <div>
                    {/* <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider">
                        USER_DATABASE.MDB
                    </h2> */}
                    <p className="text-xs text-gray-500">Total Records: {meta.total}</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center bg-white dark:bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                        <span className="animate-pulse">LOADING DATA...</span>
                    </div>
                ) : (
                    <>
                        {/* Table Container */}
                        <div className="flex-1 overflow-auto bg-white dark:bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white relative">
                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                <thead className="sticky top-0 z-10 bg-[#c0c0c0] dark:bg-[#2d2d2d] text-black dark:text-white">
                                    <tr>
                                        {['Username', 'Email', 'Role', 'State', 'Trophies', 'Joined Date', 'Actions'].map((head, i) => (
                                            <th key={i} scope="col" className="px-4 py-2 border-b-2 border-r-2 border-gray-500 border-r-white border-b-black text-xs uppercase font-bold select-none">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dashed divide-gray-300 dark:divide-gray-700">
                                    {users.map((user, index) => (
                                        <tr key={user.id} className={`hover:bg-blue-100 dark:hover:bg-blue-900 cursor-default ${index % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-[#111]'}`}>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 dark:text-gray-300 font-bold">{user.username}</td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 dark:text-gray-300">{user.email}</td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800">
                                                <span className={`px-1.5 py-0.5 text-[10px] border border-black dark:border-white font-bold uppercase ${user.role === 'admin' ? 'bg-red-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-blue-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}>{user.role}</span>
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800">
                                                <span className={`text-xs uppercase font-bold ${user.state === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>[{user.state}]</span>
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 text-center dark:text-gray-300">{user.achievement_count.toString().padStart(2, '0')}</td>
                                            <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-800 dark:text-gray-300">{user.created_at ? format(new Date(user.created_at), "yyyy-MM-dd") : 'N/A'}</td>
                                            <td className="px-4 py-2 dark:text-gray-300">
                                                <button
                                                    onClick={() => openConfirmModal(user)} // <-- GỌI MODAL TẠI ĐÂY
                                                    className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold border border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all ${user.state === 'active' ? 'bg-red-200 text-red-900 hover:bg-red-300' : 'bg-green-200 text-green-900 hover:bg-green-300'}`}
                                                >
                                                    {user.state === 'active' ? <><Ban size={12} strokeWidth={3} /> BLOCK</> : <><CheckCircle size={12} strokeWidth={3} /> UNBLOCK</>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Area */}
                        <div className="mt-2 shrink-0 flex justify-center bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-t-2 border-white dark:border-[#555]">
                            {/* ... (Code Pagination giữ nguyên như cũ) ... */}
                            <Pagination>
                                <PaginationContent className="gap-1">
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(meta.page - 1)} className={`h-8 rounded-none border border-black bg-[#e0e0e0] hover:bg-white active:bg-gray-400 ${meta.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`} />
                                    </PaginationItem>
                                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink isActive={page === meta.page} onClick={() => handlePageChange(page)} className={`h-8 w-8 rounded-none border border-black cursor-pointer ${page === meta.page ? 'bg-blue-800 text-white font-bold shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]' : 'bg-[#e0e0e0] text-black hover:bg-white active:bg-gray-400'}`}>{page}</PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(meta.page + 1)} className={`h-8 rounded-none border border-black bg-[#e0e0e0] hover:bg-white active:bg-gray-400 ${meta.page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>

            {/* --- RETRO MODAL POPUP --- */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                    {/* Modal Box: Style Windows 95 Dialog */}
                    <div className="w-[400px] max-w-[90%] bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">

                        {/* Title Bar */}
                        <div className="bg-[#000080] dark:bg-[#000050] px-2 py-1 flex justify-between items-center mb-4 cursor-default select-none">
                            <span className="text-white font-bold text-xs uppercase tracking-wider">
                                SYSTEM_CONFIRM.EXE
                            </span>
                            <button
                                onClick={closeConfirmModal}
                                className="bg-[#c0c0c0] text-black text-[10px] font-bold px-1.5 border border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                            >
                                <X size={12} strokeWidth={4} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 flex flex-col items-center gap-4 text-center">

                            {/* Icon Warning */}
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={36} className="text-yellow-600 dark:text-yellow-400" />
                                <h3 className="font-bold text-lg dark:text-white">ARE YOU SURE?</h3>
                            </div>

                            {/* Message */}
                            <p className="text-sm dark:text-gray-300">
                                You are about to <span className="font-bold uppercase underline decoration-2 decoration-red-500">
                                    {confirmModal.currentState === 'active' ? 'BLOCK' : 'UNBLOCK'}
                                </span> the user:
                                <br />
                                <span className="inline-block mt-2 bg-white dark:bg-black px-2 py-1 border border-gray-500 font-bold font-mono text-blue-800 dark:text-blue-300">
                                    {confirmModal.username}
                                </span>
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-4 mt-4 w-full justify-center">
                                {/* YES Button */}
                                <button
                                    onClick={handleConfirmAction}
                                    className="w-24 py-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black text-black font-bold uppercase text-sm shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white transition-all"
                                >
                                    Yes
                                </button>

                                {/* NO Button */}
                                <button
                                    onClick={closeConfirmModal}
                                    className="w-24 py-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black text-black font-bold uppercase text-sm shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white transition-all"
                                >
                                    No
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserManagement;