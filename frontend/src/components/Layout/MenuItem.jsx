import React from 'react';

const MenuItem = ({icon, label, active, onClick}) => {
    return (
        <button 
            onClick = {onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 mb-2 border-2 transition-all active:translate-y-[2px] ${
                active 
                ? 'bg-blue-700 text-white border-blue-900 border-t-blue-900 border-l-blue-900 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]' // Nút đang chọn (Lõm xuống)
                : 'bg-[#e0e0e0] text-black border-t-white border-l-white border-b-[#808080] border-r-[#808080] hover:bg-[#efefef]' // Nút thường (Nổi lên)
            } 
            dark:bg-[#404040] dark:text-[#e0e0e0] 
            dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-[#202020] dark:border-r-[#202020] 
            dark:hover:bg-[#4a4a4a]`}
        >
            {icon}
            <span className='font-bold uppercase text-sm tracking-wide'>{label}</span>
        </button>
    );
};

export default MenuItem;