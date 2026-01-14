import React from 'react';

const MenuItem = ({icon, label, active, onclick}) => {
    return (
        <button 
            onClick = {onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
            active 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' // Style khi đang chọn
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800' // Style mặc định
            }`}
            >
        {icon}
        <span className='font-medium'>{label}</span>   
        </button>
    );
};

export default MenuItem;