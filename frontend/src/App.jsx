import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { SettingsProvider } from './contexts/SettingsContext';

// ...

function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <Toaster position="top-center" duration={2000} />
                <RouterProvider router={router} />
            </SettingsProvider>
        </AuthProvider>
    );
}

export default App;