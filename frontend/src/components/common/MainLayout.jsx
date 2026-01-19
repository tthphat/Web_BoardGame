import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Mặc định ban đầu là Game
  const [activeItem, setActiveItem] = useState('Game');

  // 1. Cập nhật Sidebar khi URL thay đổi (Sync URL -> Sidebar)
  useEffect(() => {
    const path = location.pathname.substring(1); // Lấy phần sau dấu /

    switch (true) {
      case path === '':
        setActiveItem('Game');
        break;
      case path.startsWith('friends'):
        setActiveItem('Friends');
        break;
      case path.startsWith('messages'):
        setActiveItem('Messages');
        break;
      case path === 'trophy':
        setActiveItem('Achievements');
        break;
      case path === 'ranking':
        setActiveItem('Ranking');
        break;
      case path === 'profile':
        setActiveItem('Profile');
        break;
      case path === 'settings':
        setActiveItem('Settings');
        break;
      default:
        setActiveItem('Game');
        break;
    }
  }, [location.pathname]);

  // 2. Xử lý khi bấm nút trên Sidebar (Sync Sidebar -> URL)
  const handleNavigation = (itemId) => {
    setActiveItem(itemId);

    let path = '';
    switch (itemId) {
      case 'Game': path = ''; break;
      case 'Friends': path = 'friends/user-list'; break;
      case 'Messages': path = 'messages'; break;
      case 'Achievements': path = 'trophy'; break;
      case 'Ranking': path = 'ranking'; break;
      case 'Profile': path = 'profile'; break;
      case 'Login': path = 'login'; break;
      case 'Register': path = 'register'; break;
      case 'Settings': path = 'settings'; break;
      default: path = ''; break;
    }
    navigate(`/${path}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.info('Logout successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    // THAY ĐỔI 1: Outer Container dùng flex-col (Dọc) thay vì mặc định (Ngang)
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-[#111827] overflow-hidden transition-colors duration-300">

      {/* THAY ĐỔI 2: Đưa Header ra ngoài cùng -> Full width */}
      <Header
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      {/* THAY ĐỔI 3: Tạo một Container ở giữa chứa Sidebar và Main Content (Ngang) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar nằm bên trái */}
        <Sidebar activeItem={activeItem} setActiveItem={handleNavigation} />

        {/* Main Content nằm bên phải, chiếm hết phần còn lại */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-base-background">
          <Outlet />
        </main>

      </div>

      {/* THAY ĐỔI 4: Đưa Footer ra ngoài cùng -> Full width */}
      <Footer />

    </div>
  );
};

export default MainLayout;