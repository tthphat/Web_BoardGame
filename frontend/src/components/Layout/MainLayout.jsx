import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Logic tự động xác định menu nào đang active dựa trên URL hiện tại
  // Ví dụ: đang ở link "/profile" thì activeItem là "Profile"
  const getActiveItemFromPath = (path) => {
    if (path.includes('profile')) return 'Profile';
    if (path.includes('friends')) return 'Friends';
    if (path.includes('messages')) return 'Messages';
    if (path.includes('trophy')) return 'Achievements'; // Mapping tên route với ID trong Sidebar
    if (path.includes('ranking')) return 'Ranking';
    return 'Profile'; // Mặc định
  };

  const [activeItem, setActiveItem] = useState(getActiveItemFromPath(location.pathname));

  // Cập nhật activeItem khi URL thay đổi
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  // Hàm xử lý khi bấm vào Sidebar -> Chuyển trang thật
  const handleSidebarNavigation = (itemId) => {
    setActiveItem(itemId);
    // Chuyển đổi ID thành đường dẫn URL (slug)
    const path = itemId === 'Achievements' ? 'trophy' : itemId.toLowerCase(); 
    navigate(`/${path}`);
  };

  // Hàm xử lý Logout
  const handleLogout = () => {
    alert("Đã đăng xuất! (Giả lập)");
    // navigate('/login'); 
  };

  return (
    // CONTAINER TỔNG: Giữ nguyên class cũ của bạn
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#111827] overflow-hidden transition-colors duration-300">
      
      {/* Sidebar nhận props để biết đang ở trang nào */}
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={handleSidebarNavigation} 
      />
      
      <div className="flex-1 flex flex-col h-full relative">
        <Header 
            onNavigate={handleSidebarNavigation} 
            onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#008080] dark:bg-[#111827]"> 
          {/* bg-[#008080] là màu xanh cổ điển của nền Windows 95 */}
          
          {/* Outlet: Nơi nội dung các trang con (Dashboard, Profile...) sẽ hiện ra */}
          <Outlet />

        </main>
        
        <Footer/>
      </div>
    </div>
  );
};

export default MainLayout;