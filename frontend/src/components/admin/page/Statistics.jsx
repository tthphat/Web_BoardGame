import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    AreaChart, Area
} from 'recharts';
import { adminService } from '../../../services/admin.service';
import { Loader2, Calendar, Trophy, Users, Activity, BarChart3 } from 'lucide-react';

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState('30d'); // 7d, 30d, 90d

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await adminService.getStatistics(period);
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-gray-400" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header / Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#e0e0e0] dark:bg-[#252525] p-4 rounded-lg shadow-sm border-2 border-white dark:border-[#404040]">
                <div>
                    <h1 className="text-2xl font-bold font-mono uppercase flex items-center gap-2">
                        <Activity className="text-blue-500" />
                        System Statistics
                    </h1>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                        Overview of game performance and user engagement
                    </p>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                    {['7d', '30d', '90d'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded font-mono font-bold text-sm transition-all
                                ${period === p
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                    : 'bg-[#d0d0d0] dark:bg-[#333] hover:bg-gray-300 dark:hover:bg-[#444]'
                                }`}
                        >
                            Last {p.replace('d', ' Days')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Game Popularity (Pie Chart) */}
                <div className="bg-[#e0e0e0] dark:bg-[#252525] p-6 rounded-lg shadow-sm border-2 border-white dark:border-[#404040]">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 pb-2">
                        <BarChart3 className="text-purple-500" size={20} />
                        <h3 className="font-bold font-mono uppercase">Game Popularity</h3>
                    </div>
                    <div className="h-64 md:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.gamePopularity}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.gamePopularity.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Play Count Trends (Line Chart) */}
                <div className="bg-[#e0e0e0] dark:bg-[#252525] p-6 rounded-lg shadow-sm border-2 border-white dark:border-[#404040]">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 pb-2">
                        <Activity className="text-green-500" size={20} />
                        <h3 className="font-bold font-mono uppercase">Total Play Count Trend</h3>
                    </div>
                    <div className="h-64 md:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.playTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#00C49F"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. User Growth (Area Chart) */}
                <div className="bg-[#e0e0e0] dark:bg-[#252525] p-6 rounded-lg shadow-sm border-2 border-white dark:border-[#404040]">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 pb-2">
                        <Users className="text-blue-500" size={20} />
                        <h3 className="font-bold font-mono uppercase">User Growth</h3>
                    </div>
                    <div className="h-64 md:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.userGrowth}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="totalUsers"
                                    stroke="#0088FE"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                        <div className="inline-block bg-[#d0d0d0] dark:bg-[#333] px-4 py-2 rounded text-sm font-mono">
                            <span className="text-gray-500">New Users (Last {period}): </span>
                            <span className="font-bold text-blue-600">
                                {stats.userGrowth.reduce((acc, curr) => acc + curr.newUsers, 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Global Leaderboard (Table) */}
                <div className="bg-[#e0e0e0] dark:bg-[#252525] p-6 rounded-lg shadow-sm border-2 border-white dark:border-[#404040]">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 pb-2">
                        <Trophy className="text-yellow-500" size={20} />
                        <h3 className="font-bold font-mono uppercase">Global Hall of Fame</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm font-mono">
                            <thead>
                                <tr className="bg-[#d0d0d0] dark:bg-[#333] text-left">
                                    <th className="p-3 rounded-tl-lg">Rank</th>
                                    <th className="p-3">Player</th>
                                    <th className="p-3">Game</th>
                                    <th className="p-3">Score</th>
                                    <th className="p-3 rounded-tr-lg">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                                {stats.globalLeaderboard.map((item, index) => (
                                    <tr key={index} className="hover:bg-[#d0d0d0] dark:hover:bg-[#333] transition-colors">
                                        <td className="p-3 font-bold text-gray-500">#{index + 1}</td>
                                        <td className="p-3 font-bold">{item.username}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-xs">
                                                {item.gameName}
                                            </span>
                                        </td>
                                        <td className="p-3 font-bold text-yellow-600 dark:text-yellow-400">
                                            {item.score}
                                        </td>
                                        <td className="p-3 text-gray-500 text-xs">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Statistics;
