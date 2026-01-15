import React from 'react';

const HeaderItem = ({icon, onClick, active}) => {
    return (
        <button
            onClick = {onClick}
            className={`
                relative p-2 flex items-center justify-center transition-all
                ${active 
                ? 'bg-[#e0e0e0] border-2 border-[#808080] border-b-white border-r-white shadow-[inset_1px_1px_0px_0px_#000]' // Lõm xuống khi mở menu
                : 'bg-[#c0c0c0] border-2 border-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white' // Nổi lên bình thường
                }
                dark:bg-[#2d2d2d] dark:text-white
                dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-[#000] dark:border-r-[#000]
                ${active ? 'dark:bg-[#202020] dark:border-t-[#000] dark:border-l-[#000]' : ''}
            `}
        >
            {icon}
            </button>
    );
};

export default HeaderItem;
