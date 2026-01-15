import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/common/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import DemoPage from "../pages/DemoPage";
// import LoginPage from "../pages/auth/LoginPage";
// import RegisterPage from "../pages/auth/RegisterPage";

export const router = createBrowserRouter([
    // {
    //     path: "/login",
    //     element: <LoginPage />
    // },
    // {
    //     path: "/register",
    //     element: <RegisterPage />
    // },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />
            },
            {
                path: "/dashboard",
                element: <DashboardPage />
            },
            {
                path: "/profile",
                element: <DemoPage title="Profile" description="Đây là trang thông tin cá nhân. Hãy thử cuộn chuột hoặc đổi theme!" />
            },
            {
                path: "/friends",
                element: <DemoPage title="Friends List" description="Danh sách bạn bè sẽ hiện ở đây." />
            },
            {
                path: "/messages",
                element: <DemoPage title="Messages" description="Hộp thư đến 0 tin nhắn mới." />
            },
            {
                path: "/trophy",
                element: <DemoPage title="Achievements" description="Các danh hiệu bạn đã đạt được." />
            },
            {
                path: "/ranking",
                element: <DemoPage title="Ranking" description="Bảng xếp hạng toàn server." />
            }
        ]
    }
]);
