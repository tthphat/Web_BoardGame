import {User, Users, MessageSquare, Trophy, BarChart ,Moon, Gamepad2} from 'lucide-react';
import React, {useState} from 'react';
import MenuItem from './MenuItem';


const Sidebar = ({ activeItem, setActiveItem }) => {

    const menuItems = [
        {id: 'Game', icon: <Gamepad2 size={20}/>, label: 'Game Console'},
        {id: 'Profile', icon: <User size={20}/>, label: 'Profile'},
        {id: 'Friends', icon: <Users size={20}/>, label: 'Friends'},
        {id: 'Messages', icon: <MessageSquare size={20}/>, label: 'Messages'},
        {id: 'Achievements', icon: <Trophy size={20}/>, label: 'Trophy'},
        {id: 'Ranking', icon: <BarChart size={20}/>, label: 'Ranking'},
    ]

    return (
        <aside className="w-64 h-full bg-[#c0c0c0] dark:bg-[#2d2d2d] border-r-2 border-r-[#808080] dark:border-r-[#000] flex flex-col transition-colors duration-300 font-mono">
            
            {/* Header: Hiệu ứng lõm vào */}
            <div className="h-16 flex items-center justify-center bg-[#c0c0c0] dark:bg-[#2d2d2d] border-b-2 border-b-[#808080] dark:border-b-[#000]">
                <div className="px-4 py-1 bg-[#008080] dark:bg-[#1a1a1a] 
                    border-2 
                    border-t-black border-l-black    {/* QUAN TRỌNG: Đổi sang màu đen để tạo bóng lõm sâu */}
                    border-b-white border-r-white    {/* Màu trắng hắt sáng ở cạnh dưới */}
                    dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555]">
                        <h1 className="text-xl font-black uppercase text-white dark:text-yellow-500 tracking-wider shadow-sm">
                            BoardGame
                        </h1>
                </div>
            </div>

            {/* Menu List */}
            <nav className="flex-1 py-4 space-y-2 px-3">
                {menuItems.map((item) => (
                <MenuItem 
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)} 
                />
                ))}
            </nav>

            {/* Dark Mode Button Area: Style Retro 3D */}
            <div className="p-4 border-t-2 border-t-white dark:border-t-[#555]">
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

export default Sidebar;
