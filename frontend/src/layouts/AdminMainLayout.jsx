import React, { useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader'; // Import từ folder common của bạn
import Footer from '../components/common/Footer'; // Import từ folder common của bạn
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboardMock from '../components/admin/AdminDashboardMock';

// Import các trang placeholder cho các mục chưa làm
const PlaceholderPage = ({ title }) => (
    <div className="h-full flex items-center justify-center border-4 border-dashed border-gray-400 rounded-lg p-10 opacity-50">
        <div className="text-center">
            <h2 className="text-2xl font-black font-mono uppercase mb-2">UNDER CONSTRUCTION</h2>
            <p className="font-mono">{title} module is coming soon...</p>
        </div>
    </div>
);

const AdminMainLayout = () => {
    // State quản lý tab đang chọn ở Sidebar
    const [activeItem, setActiveItem] = useState('Dashboard');

    // Hàm render nội dung dựa trên tab đang chọn
    const renderContent = () => {
        switch (activeItem) {
            case 'Dashboard':
                return <AdminDashboardMock />;
            case 'UserMgmt':
                return <PlaceholderPage title="User Management" />;
            case 'GameConfig':
                return <PlaceholderPage title="Game Configuration" />;
            case 'Statistics':
                return <PlaceholderPage title="Detailed Statistics" />;
            default:
                return <AdminDashboardMock />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#c0c0c0] dark:bg-[#2d2d2d] overflow-hidden">
            
            {/* 1. Common Header */}
            {/* Header nằm trên cùng, chiếm full chiều rộng */}
            <AdminHeader />

            {/* 2. Main Body Area */}
            {/* Flex row để Sidebar nằm trái, Content nằm phải */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Sidebar Component */}
                <AdminSidebar activeItem={activeItem} setActiveItem={setActiveItem} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-[#d4d4d4] dark:bg-[#1a1a1a] p-4 relative">
                    
                    {/* Hiệu ứng bóng đổ nội dung bên trong để tạo chiều sâu */}
                    <div className="h-full w-full flex flex-col">
                        
                        {/* Breadcrumb / Title Bar giả lập */}
                        <div className="mb-4 pb-2 border-b-2 border-gray-400 dark:border-gray-600 flex justify-between items-end">
                            <h2 className="text-2xl font-mono font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                                {'>'} ADMIN / {activeItem.toUpperCase()}
                            </h2>
                            <span className="text-xs font-mono text-gray-500">SYS.VER.1.0.2</span>
                        </div>

                        {/* Nội dung thay đổi (Dynamic Content) */}
                        <div className="flex-1">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>

            {/* 3. Common Footer */}
            <Footer />
            
        </div>
    );
};

export default AdminMainLayout;