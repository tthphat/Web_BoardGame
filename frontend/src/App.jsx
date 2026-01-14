import {Route, Routes} from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';

function App(){
    return (
        // 1. Container chính giả lập Layout, có màu nền để test Dark mode
        <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar/>

            <div className="flex-1 p-10 text-gray-800 dark:text-white">
            <h1 className="text-3xl font-bold mb-4">Màn hình Test Sidebar</h1>
            <p>
            Thử bấm các nút bên trái xem màu sắc thay đổi chưa. <br/>
            Thử bấm nút <strong>Dark Mode</strong> xem nền chỗ này có tối đi không.
            </p>
            </div>
        </div>
    );
};

export default App;
