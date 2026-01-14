import React from 'react';

const Footer = () => {
  return (
    // Container chính: Màu xám, viền trên sáng màu để tách biệt với nội dung chính
    <footer className="h-10 bg-[#c0c0c0] dark:bg-[#2d2d2d] border-t-2 border-t-white dark:border-t-[#555] flex items-center px-2 gap-2 select-none font-mono text-xs text-black dark:text-[#e0e0e0]">
      
      {/* Pane 1: Thông báo chính (Chiếm phần lớn diện tích) */}
      <div className="flex-1 h-7 flex items-center justify-end px-2 bg-[#c0c0c0] dark:bg-[#2d2d2d] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555]">
        <span className="truncate">23120319 - 23129327 - 23120328 - 23120337</span>
      </div>

      <div className="hidden md:flex w-64 h-7 items-center px-2 bg-[#c0c0c0] dark:bg-[#2d2d2d] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#555] dark:border-r-[#555]">
        <span className="truncate">© BoardGame</span>
      </div>

      <div className="w-4 h-full flex items-end justify-end pb-1 pr-1">
         <div className="border-r-2 border-b-2 border-gray-500 w-2 h-2 dark:border-gray-400"></div>
      </div>
      
    </footer>
  );
};

export default Footer;