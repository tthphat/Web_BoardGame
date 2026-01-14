import {User, Users, MessageSquare, Trophy, BarChart ,Moon, Sun} from 'lucide-react';
import React, {useState} from 'react';
import MenuItem from './MenuItem';


const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('Profile');

    const menuItems = [
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
                <div className="px-4 py-1 bg-[#a0a0a0] dark:bg-[#1a1a1a] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555]">
                     <h1 className="text-xl font-black uppercase text-blue-800 dark:text-yellow-500 tracking-wider shadow-sm">BoardGame</h1>
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

            {/* Dark Mode Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                <Moon size={20} />
                <span>Dark Mode</span>
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;
