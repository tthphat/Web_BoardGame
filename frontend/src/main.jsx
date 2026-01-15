import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 1. Đổi cái này
import App from './App' // 2. Import App của bạn
import AuthProvider from '@/contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Dùng BrowserRouter bọc bên ngoài cùng */}
    <BrowserRouter>
      <AuthProvider>
        <App /> {/* 4. Gọi App vào đây */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)