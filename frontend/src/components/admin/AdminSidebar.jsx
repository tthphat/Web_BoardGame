import { LayoutDashboard, Users, Settings, BarChart3, Moon, LogOut } from 'lucide-react';
import React from 'react';

import MenuItem from '../common/MenuItem';
const AdminSidebar = ({ activeItem, setActiveItem }) => {

    const adminMenuItems = [
        {id: 'Dashboard', icon: <LayoutDashboard size={20}/>, label: 'Dashboard'},
        {id: 'UserMgmt', icon: <Users size={20}/>, label: 'User Manager'},
        {id: 'GameConfig', icon: <Settings size={20}/>, label: 'Game Config'},
        {id: 'Statistics', icon: <BarChart3 size={20}/>, label: 'Statistics'},
    ];

    return (
        <aside className="w-64 h-full bg-[#c0c0c0] dark:bg-[#2d2d2d] border-r-2 border-r-[#808080] dark:border-r-[#000] flex flex-col transition-colors duration-300 font-mono">
            
            {/* Header: Admin Panel */}
            <div className="h-16 flex items-center justify-center bg-[#c0c0c0] dark:bg-[#2d2d2d] border-b-2 border-b-[#808080] dark:border-b-[#000]">
                <div className="px-4 py-1 bg-[#800000] dark:bg-[#4a0404] 
                    border-2 
                    border-t-black border-l-black
                    border-b-white border-r-white
                    dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555]">
                        {/* Đổi màu chữ sang đỏ/trắng để phân biệt với User */}
                        <h1 className="text-xl font-black uppercase text-white tracking-wider shadow-sm">
                            SYS.ADMIN
                        </h1>
                </div>
            </div>

            {/* Menu List */}
            <nav className="flex-1 py-4 space-y-2 px-3">
                {adminMenuItems.map((item) => (
                <MenuItem 
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)} 
                />
                ))}
            </nav>

            {/* Footer Area: Dark Mode & Logout */}
            <div className="p-4 border-t-2 border-t-white dark:border-t-[#555] space-y-2">
                
                {/* Dark Mode Button */}
                <button 
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="flex items-center justify-center gap-3 w-full px-4 py-2 
                    bg-[#e0e0e0] dark:bg-[#404040] 
                    text-black dark:text-white 
                    border-2 
                    border-t-white border-l-white border-b-[#808080] border-r-[#808080] 
                    dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-[#202020] dark:border-r-[#202020] 
                    active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white 
                    active:bg-[#d0d0d0] dark:active:bg-[#303030] 
                    transition-all active:translate-y-0.5"
                >
                    <Moon size={20} />
                    <span className="font-bold uppercase text-sm">Dark Mode</span>
                </button>

                
            </div>

        </aside>
    );
};

export default AdminSidebar;