import React, {useState} from 'react';
import {User, LogOut, ChevronDown} from 'lucide-react';
import HeaderItem from './HeaderItem';

const Header = ({onNavigate, onLogout}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleProfileClick = () => {
    onNavigate('Profile'); // Gọi hàm chuyển trang ở App
    setIsDropdownOpen(false); // Đóng menu
    };

    const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
    };

    return (
    <header className="h-16 px-6 flex items-center justify-end bg-[#c0c0c0] dark:bg-[#2d2d2d] border-b-2 border-white dark:border-b-[#555] shadow-md z-20 relative">
      
      {/* User Actions (Bên phải) */}
      <div className="relative">
        <HeaderItem 
            icon={<User size={20} />} 
            active={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        {/* --- DROPDOWN MENU RETRO STYLE --- */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#c0c0c0] dark:bg-[#2d2d2d] border-2 border-white border-b-[#808080] border-r-[#808080] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] p-1 z-50">
            
            {/* Header info nhỏ */}
            <div className="px-3 py-2 text-sm text-gray-800 dark:text-gray-300 border-b border-gray-400 dark:border-gray-600 mb-1 font-bold">
               User Name
            </div>

            {/* Menu Item 1: Profile */}
            <button 
              onClick={handleProfileClick}
              className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-blue-800 hover:text-white dark:text-white dark:hover:bg-blue-700 group transition-none"
            >
              <User size={16} />
              <span>Profile Info</span>
            </button>

            {/* Divider */}
            <div className="h-[1px] bg-gray-400 border-b border-white my-1 mx-1"></div>

            {/* Menu Item 2: Logout */}
            <button 
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-blue-800 hover:text-white dark:text-white dark:hover:bg-blue-700 transition-none"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;