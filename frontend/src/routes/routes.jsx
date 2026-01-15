import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
])