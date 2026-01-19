import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    AreaChart, Area
} from 'recharts';
import { adminService } from '../../../services/admin.service'; // Đảm bảo đường dẫn đúng
import { Activity, BarChart3, Users, Trophy, Save, Printer } from 'lucide-react';

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState('30d'); // 7d, 30d, 90d

    // Retro Palette (Windows 16-color style)
    const COLORS = ['#000080', '#008000', '#800000', '#808000', '#800080', '#008080'];

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Mock data nếu chưa có API, bạn có thể xóa đoạn if (true) này khi nối API thật
            if (true) { 
                // Giả lập dữ liệu để hiển thị UI (Xóa khi chạy thật)
                setTimeout(() => {
                    setStats({
                        gamePopularity: [
                            { name: 'Snake', value: 400 },
                            { name: 'Tetris', value: 300 },
                            { name: 'Minesweeper', value: 300 },
                            { name: 'Sudoku', value: 200 },
                        ],
                        playTrends: Array.from({ length: 10 }).map((_, i) => ({
                            date: `2024-01-${i + 10}`,
                            count: Math.floor(Math.random() * 100) + 50
                        })),
                        userGrowth: Array.from({ length: 10 }).map((_, i) => ({
                            date: `2024-01-${i + 10}`,
                            totalUsers: 100 + i * 10,
                            newUsers: Math.floor(Math.random() * 5)
                        })),
                        globalLeaderboard: [
                            { username: 'RetroKing', gameName: 'Snake', score: 9999, date: '2024-01-15' },
                            { username: 'PixelQueen', gameName: 'Tetris', score: 8888, date: '2024-01-14' },
                            { username: 'Admin', gameName: 'Minesweeper', score: 5000, date: '2024-01-12' },
                        ]
                    });
                    setLoading(false);
                }, 800);
            } else {
                const response = await adminService.getStatistics(period);
                if (response.data) setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch statistics:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center font-mono space-y-4">
                <div className="w-16 h-16 border-4 border-t-black border-l-black border-r-white border-b-white animate-spin"></div>
                <p className="blink text-xl uppercase font-bold">LOADING DATA...</p>
            </div>
        );
    }

    if (!stats) return null;

    // Custom Tooltip cho Recharts để hợp style Retro
    const RetroTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#ffffe0] border border-black p-2 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] font-mono text-xs">
                    <p className="font-bold border-b border-black mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full flex flex-col font-mono p-1 space-y-6 overflow-y-auto">
            
            {/* --- HEADER CONTROL PANEL --- */}
            <div className="bg-[#c0c0c0] p-2 border-2 border-t-white border-l-white border-b-black border-r-black flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-4 py-2">
                        <h1 className="text-xl font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                            <Activity size={24} /> SYSTEM_STATS.EXE
                        </h1>
                    </div>
                </div>

                <div className="flex gap-2">
                    {['7d', '30d', '90d'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1 border-2 font-bold text-sm uppercase transition-all active:translate-y-1 active:shadow-none
                                ${period === p
                                    ? 'bg-[#000080] text-white border-t-black border-l-black border-b-white border-r-white shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]' // Active (Pressed)
                                    : 'bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#d0d0d0]' // Normal
                                }`}
                        >
                            LAST_{p}
                        </button>
                    ))}
                    <div className="w-[2px] bg-gray-500 mx-2"></div>
                    <button className="p-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none">
                        <Printer size={18} />
                    </button>
                    <button className="p-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none">
                        <Save size={18} />
                    </button>
                </div>
            </div>

            {/* --- GRID CONTENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">

                {/* 1. Game Popularity (Pie Chart) */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-lg">
                    <div className="bg-[#000080] text-white px-2 py-1 mb-1 font-bold flex items-center gap-2">
                        <BarChart3 size={16} className="text-yellow-400"/> GAME_DISTRIBUTION
                    </div>
                    <div className="bg-[#e0e0e0] p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.gamePopularity}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    stroke="black"
                                    strokeWidth={1}
                                >
                                    {stats.gamePopularity.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<RetroTooltip />} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontFamily: 'monospace' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Play Count Trends (Line Chart) */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-lg">
                    <div className="bg-[#000080] text-white px-2 py-1 mb-1 font-bold flex items-center gap-2">
                        <Activity size={16} className="text-green-400"/> TRAFFIC_MONITOR
                    </div>
                    {/* Chart Container: Nền trắng, lõm xuống */}
                    <div className="bg-white p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.playTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                                <RechartsTooltip content={<RetroTooltip />} />
                                <Line
                                    type="step" // Dùng step cho nó vuông vức pixel
                                    dataKey="count"
                                    stroke="#000080"
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: 'white', stroke: '#000080', strokeWidth: 2 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. User Growth (Area Chart) */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-lg">
                    <div className="bg-[#000080] text-white px-2 py-1 mb-1 font-bold flex items-center gap-2">
                        <Users size={16} className="text-cyan-400"/> USER_GROWTH
                    </div>
                    {/* Style Terminal: Nền đen, lưới xanh */}
                    <div className="bg-black p-4 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.userGrowth}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ff00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00ff00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#00ff00" tick={{ fontSize: 10, fill: '#00ff00' }} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                <YAxis stroke="#00ff00" tick={{ fontSize: 10, fill: '#00ff00' }} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#000', borderColor: '#00ff00', color: '#00ff00', fontFamily: 'monospace' }} />
                                <Area
                                    type="monotone"
                                    dataKey="totalUsers"
                                    stroke="#00ff00"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Footer Info */}
                    <div className="mt-2 text-center border border-gray-500 bg-[#e0e0e0] p-1 text-xs">
                        NEW_USERS_DETECTED: <span className="font-bold text-red-600 blink">{stats.userGrowth.reduce((acc, curr) => acc + curr.newUsers, 0)}</span>
                    </div>
                </div>

                {/* 4. Global Leaderboard (Table) */}
                <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-lg">
                    <div className="bg-[#000080] text-white px-2 py-1 mb-1 font-bold flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-400"/> HALL_OF_FAME
                    </div>
                    
                    <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white overflow-hidden h-80 flex flex-col">
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-sm font-mono text-left border-collapse">
                                <thead className="bg-[#c0c0c0] sticky top-0 z-10 border-b-2 border-black">
                                    <tr>
                                        {['#', 'PLAYER', 'GAME', 'SCORE', 'DATE'].map((h, i) => (
                                            <th key={i} className="p-2 border-r border-gray-500 text-xs font-bold select-none">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.globalLeaderboard.map((item, index) => (
                                        <tr key={index} className="hover:bg-blue-100 group cursor-default border-b border-gray-200 border-dashed">
                                            <td className="p-2 border-r border-gray-200 font-bold text-gray-500">{index + 1}</td>
                                            <td className="p-2 border-r border-gray-200 font-bold text-blue-900 group-hover:underline">{item.username}</td>
                                            <td className="p-2 border-r border-gray-200 uppercase text-xs">{item.gameName}</td>
                                            <td className="p-2 border-r border-gray-200 font-bold text-red-600 bg-yellow-50">{item.score}</td>
                                            <td className="p-2 text-xs text-gray-500">{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Statistics;