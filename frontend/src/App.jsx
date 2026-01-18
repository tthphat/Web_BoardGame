import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import AuthProvider from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

function App() {
    return (
        <AuthProvider>
            <Toaster richColors position="top-right" />
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;