import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mặc định ban đầu là Game
  const [activeItem, setActiveItem] = useState('Game');

  // 1. Cập nhật Sidebar khi URL thay đổi (Sync URL -> Sidebar)
  useEffect(() => {
    const path = location.pathname.substring(1); // Lấy phần sau dấu /
    
    switch(path) {
        case '': setActiveItem('Game'); break; // URL rỗng (Trang chủ) -> Sáng nút Game
        case 'friends': setActiveItem('Friends'); break;
        case 'messages': setActiveItem('Messages'); break;
        case 'trophy': setActiveItem('Achievements'); break;
        case 'ranking': setActiveItem('Ranking'); break;
        case 'profile': setActiveItem('Profile'); break;
        default: setActiveItem('Game'); break;
    }
  }, [location.pathname]);

  // 2. Xử lý khi bấm nút trên Sidebar (Sync Sidebar -> URL)
  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    
    let path = '';
    switch(itemId) {
        case 'Game': path = ''; break; 
        case 'Friends': path = 'friends'; break;
        case 'Messages': path = 'messages'; break;
        case 'Achievements': path = 'trophy'; break;
        case 'Ranking': path = 'ranking'; break;
        case 'Profile': path = 'profile'; break;
        default: path = ''; break;
    }
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    alert("Đã đăng xuất! (Giả lập)");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#111827] overflow-hidden transition-colors duration-300">
      <Sidebar activeItem={activeItem} setActiveItem={handleNavigation} />
      
      <div className="flex-1 flex flex-col h-full relative">
        <Header 
            onNavigate={handleNavigation} 
            onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#008080] dark:bg-[#111827]"> 
           <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  );
};

export default MainLayout;