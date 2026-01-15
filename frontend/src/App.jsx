import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/common/MainLayout'; // Import từ đường dẫn mới
import DashboardPage from './pages/DashboardPage';
// --- Component giả lập nội dung các trang (Để test giao diện) ---
const DemoPage = ({ title, description }) => (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-white border-b-[#808080] border-r-[#808080] shadow-md">
            <div className="bg-[#e0e0e0] dark:bg-[#333] p-6 border-2 border-[#808080] border-b-white border-r-white">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-mono">
                    Current View: {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 font-mono">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <Routes>
            {/* Route Cha: Sử dụng MainLayout */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                {/* Mặc định vào trang chủ (/) sẽ chuyển hướng sang /profile */}
                {/* <Route index element={<Navigate to="/profile" replace />} /> */}

                {/* Các Route Con: Sẽ hiện vào vị trí <Outlet /> của MainLayout */}
                <Route path="profile" element={
                    <DemoPage
                        title="Profile"
                        description="Đây là trang thông tin cá nhân. Hãy thử cuộn chuột hoặc đổi theme!"
                    />
                } />

                <Route path="friends" element={
                    <DemoPage
                        title="Friends List"
                        description="Danh sách bạn bè sẽ hiện ở đây."
                    />
                } />

                <Route path="messages" element={
                    <DemoPage
                        title="Messages"
                        description="Hộp thư đến 0 tin nhắn mới."
                    />
                } />

                <Route path="trophy" element={
                    <DemoPage
                        title="Achievements"
                        description="Các danh hiệu bạn đã đạt được."
                    />
                } />

                <Route path="ranking" element={
                    <DemoPage
                        title="Ranking"
                        description="Bảng xếp hạng toàn server."
                    />
                } />

            </Route>

            {/* Route Login (Nằm ngoài Layout, không có Sidebar/Header) */}
            {/* <Route path="/login" element={<LoginPage />} /> */}

        </Routes>
    );
}

export default App;