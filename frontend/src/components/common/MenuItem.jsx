import React from 'react';

const MenuItem = ({icon, label, active, onClick}) => {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 mb-2 border-2 transition-all active:translate-y-[2px] ${
                active 
                // --- THAY ĐỔI Ở ĐÂY: bg-[#008080] ---
                ? 'bg-[#008080] text-white border-[#004040] border-t-[#004040] border-l-[#004040] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]' 
                : 'bg-[#e0e0e0] text-black border-t-white border-l-white border-b-[#808080] border-r-[#808080] hover:bg-[#efefef]' 
            } 
            dark:bg-[#404040] dark:text-[#e0e0e0] 
            dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-[#202020] dark:border-r-[#202020] 
            dark:hover:bg-[#4a4a4a]
            ${active ? 'dark:bg-[#008080] dark:text-yellow-500 dark:border-t-[#004040] dark:border-l-[#004040]' : ''} 
            `}
        >
            {icon}
            <span className='font-bold uppercase text-sm tracking-wide'>{label}</span>   
        </button>
    );
};

export default MenuItem;