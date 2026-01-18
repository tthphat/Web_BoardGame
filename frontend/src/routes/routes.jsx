import AdminRoute from "./AdminRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/common/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import DemoPage from "../pages/DemoPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminMainLayout from "../layouts/AdminMainLayout";
import VerifyEmail from "../components/register/VerifyEmail";
import ProfilePage from "../pages/user/ProfilePage";
import AchievementPage from "../pages/user/AchievementPage";
import FriendLayout from "../layouts/FriendLayout";

export const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },

    { path: "/register", element: <RegisterPage /> },

    { path: "/verify-email", element: <VerifyEmail /> },

    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminMainLayout />
            </AdminRoute>
        )
    },
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
                element: <ProfilePage />
            },
            {
                path: "/friends",
                element: <FriendLayout />
            },
            {
                path: "/messages",
                element: <DemoPage title="Messages" description="Hộp thư đến 0 tin nhắn mới." />
            },
            {
                path: "/trophy",
                element: <AchievementPage />
            },
            {
                path: "/ranking",
                element: <DemoPage title="Ranking" description="Bảng xếp hạng toàn server." />
            }
        ]
    }
]);
