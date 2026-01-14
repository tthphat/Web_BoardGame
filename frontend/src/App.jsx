import {Route, Routes} from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import Header from './components/Layout/Header'

// --- 2. Component Footer Giả (Mock) ---
const MockFooter = () => (
  <footer className="h-12 bg-gray-50 dark:bg-[#1f2937] border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500 transition-colors">
    © 2026 BoardGame Project - Dev Mode
  </footer>
);

function App() {

  const [currentView, setCurrentView] = useState('Profile');
  const handleLogout = () => {
    alert("Đã đăng xuất! (Giả lập)");
  };


  return (
    // CONTAINER TỔNG: Giữ cứng chiều cao bằng màn hình (h-screen), không cho body scroll (overflow-hidden)
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#111827] overflow-hidden transition-colors duration-300">
      <Sidebar activeItem={currentView} setActiveItem={setCurrentView} />
      
      <div className="flex-1 flex flex-col h-full relative">
        <Header 
            onNavigate={(view) => setCurrentView(view)} 
            onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#008080] dark:bg-[#111827]"> 
          {/* bg-[#008080] là màu xanh cổ điển của nền Windows 95 */}
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-white border-b-[#808080] border-r-[#808080] shadow-md">
                <div className="bg-[#e0e0e0] dark:bg-[#333] p-6 border-2 border-[#808080] border-b-white border-r-white">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-mono">
                        Current View: {currentView}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 font-mono">
                        Hãy thử bấm vào icon User ở góc phải trên cùng  chọn Profile Info.
                        <br/>
                        Bạn sẽ thấy Sidebar bên trái tự động sáng mục Profile.
                    </p>
                </div>
            </div>
          </div>
        </main>
        <MockFooter />
      </div>
    </div>
  );
}

export default App;
