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
import MyFriends from "../components/friends/MyFriends";
import FriendReuqests from "../components/friends/FriendReuqests";
import UserList from "../components/friends/UserList";
import SettingsPage from "../pages/SettingsPage";
import RankingPage from "../pages/RankingPage";
import ConversationLayout from "../layouts/ConversationLayout";
import ConversationDetail from "../components/message/ConversationDetail";
import ConversationPlaceholder from "../components/message/ConversationPlaceholder";


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
                element: <FriendLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/friends/user-list" replace />
                    },
                    {
                        path: "/friends/user-list",
                        element: <UserList />
                    },
                    {
                        path: "/friends/my-friends",
                        element: <MyFriends />
                    },
                    {
                        path: "/friends/friend-requests",
                        element: <FriendReuqests />
                    }
                ]
            },
            {
                path: "/messages",
                element: <ConversationLayout />,
                children: [
                    {
                        index: true,
                        element: <ConversationPlaceholder />
                    },
                    {
                        path: ":id",
                        element: <ConversationDetail />
                    },
                    {
                        path: "new/:userId",
                        element: <ConversationDetail />
                    }
                ]
            },
            {
                path: "/trophy",
                element: <AchievementPage />
            },
            {
                path: "/ranking",
                element: <RankingPage />
            },
            {
                path: "/settings",
                element: <SettingsPage />
            }
        ]
    }
]);
