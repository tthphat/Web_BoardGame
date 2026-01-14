import {Route, Routes} from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import { Bell, Search } from 'lucide-react';

// --- 1. Component Header Giả (Mock) ---
const MockHeader = () => (
  <header className="h-16 bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-colors">
    <div className="flex items-center gap-2 text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
      <Search size={16} />
      <span className="text-sm">Search game...</span>
    </div>
    <div className="flex items-center gap-4">
      <Bell size={20} className="text-gray-600 dark:text-gray-300" />
      <div className="w-8 h-8 rounded-full bg-blue-500"></div> {/* Avatar giả */}
    </div>
  </header>
);

// --- 2. Component Footer Giả (Mock) ---
const MockFooter = () => (
  <footer className="h-12 bg-gray-50 dark:bg-[#1f2937] border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500 transition-colors">
    © 2026 BoardGame Project - Dev Mode
  </footer>
);

function App() {
  return (
    // CONTAINER TỔNG: Giữ cứng chiều cao bằng màn hình (h-screen), không cho body scroll (overflow-hidden)
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#111827] overflow-hidden transition-colors duration-300">
      
      {/* KHU VỰC 1: SIDEBAR (Cố định bên trái) */}
      {/* Sidebar của bạn đã có height: 100% nên nó sẽ tự full chiều cao ở đây */}
      <Sidebar />

      {/* KHU VỰC 2: CỘT BÊN PHẢI (Chứa Header + Main + Footer) */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* A. Header */}
        <MockHeader />

        {/* B. Main Content (Quan trọng: overflow-y-auto để chỉ cuộn phần này) */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          
          {/* Nội dung giả để test vị trí */}
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Khung chào mừng */}
            <div className="bg-white dark:bg-[#1f2937] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back!</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Đây là khu vực <strong>Main Content</strong>. 
                Khi nội dung dài, thanh cuộn sẽ hiện ở đây chứ không che mất Sidebar.
              </p>
            </div>

            {/* Giả lập nội dung dài để test cuộn trang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-40 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-800">
                  <span className="text-blue-400 font-medium">Game Card {item}</span>
                </div>
              ))}
            </div>

             <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                Hãy thử cuộn xuống dưới cùng để xem Footer. Sidebar bên trái vẫn đứng yên!
              </p>
            </div>
          </div>

        </main>

        {/* C. Footer */}
        <MockFooter />
        
      </div>
    </div>
  );
}

export default App;
