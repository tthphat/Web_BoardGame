import React, { useEffect, useState } from 'react';
import { Users, Gamepad2, Activity, Server, AlertTriangle, FileText, UserPlus, Trophy } from 'lucide-react';
import { getDashboardStatsApi, getRecentActivitiesApi } from '../../services/admin.service';
import { toast } from 'sonner';

const StatCard = ({ title, value, icon, color, extraControl }) => (
  <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-[#000] dark:border-r-[#000]">
    <div className="flex flex-col p-3 bg-[#e0e0e0] dark:bg-[#3d3d3d] border border-[#808080] dark:border-[#555] h-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-1.5 ${color} text-white border-2 border-t-black border-l-black border-b-white border-r-white dark:border-t-black dark:border-l-black dark:border-b-[#666] dark:border-r-[#666]`}>
          {icon}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-black font-mono text-black dark:text-white leading-none">{value}</p>
        </div>
        {extraControl && <div className="mt-2">{extraControl}</div>}
      </div>
    </div>
  </div>
);

const AdminDashboardMock = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalMatches: 0,
    matchesByGame: []
  });
  const [activities, setActivities] = useState({
    recentSessions: [],
    newRegistrations: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedGameId, setSelectedGameId] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          getDashboardStatsApi(),
          getRecentActivitiesApi()
        ]);
        setStats(statsData.data);
        setActivities(activitiesData.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate display value for Matches
  const displayMatches = selectedGameId === 'all'
    ? stats.totalMatches
    : stats.matchesByGame.find(g => String(g.gameId) === String(selectedGameId))?.count || 0;

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return <div className="p-4 font-mono text-center">LOADING SYSTEM DATA...</div>;
  }

  return (
    <div className="space-y-6 font-mono p-1">

      {/* 1. Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Users */}
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={18} />}
          color="bg-blue-800"
        />

        {/* Total Matches with Filter */}
        <StatCard
          title="Total Matches"
          value={displayMatches}
          icon={<Gamepad2 size={18} />}
          color="bg-green-800"
          extraControl={
            <select
              className="w-full text-xs p-1 border-2 border-t-black border-l-black border-b-white border-r-white bg-white dark:bg-black text-black dark:text-white outline-none"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
            >
              <option value="all">ALL GAMES</option>
              {stats.matchesByGame.map(g => (
                <option key={g.gameId} value={g.gameId}>{g.gameName.toUpperCase()}</option>
              ))}
            </select>
          }
        />

        {/* New Users Today */}
        <StatCard
          title="New Users (Today)"
          value={`+${stats.newUsersToday}`}
          icon={<UserPlus size={18} />}
          color="bg-yellow-700"
        />

        {/* System Status (Mock for now or can use server time/uptime if API available) */}
        <StatCard
          title="System Status"
          value="ONLINE"
          icon={<Activity size={18} />}
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2. Recent Game Sessions (Main Area) */}
        <div className="lg:col-span-2 bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black flex flex-col">
          <div className="bg-[#000080] text-white px-2 py-1 text-sm font-bold flex justify-between items-center select-none">
            <span className="flex items-center gap-2"><FileText size={14} /> RECENT_SESSIONS</span>
            {/* <div className="flex gap-1">
              <button className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0] text-black text-[10px] font-bold border border-white border-b-black border-r-black">_</button>
              <button className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0] text-black text-[10px] font-bold border border-white border-b-black border-r-black">X</button>
            </div> */}
          </div>
          <div className="bg-white dark:bg-black p-0 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#e0e0e0] dark:bg-[#333] border-b border-gray-400">
                  <tr>
                    <th className="p-2 border-r border-gray-300 dark:border-gray-600">TIME</th>
                    <th className="p-2 border-r border-gray-300 dark:border-gray-600">GAME</th>
                    <th className="p-2 border-r border-gray-300 dark:border-gray-600">USER</th>
                    <th className="p-2 border-r border-gray-300 dark:border-gray-600">RESULT</th>
                    <th className="p-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {activities.recentSessions.length > 0 ? (
                    activities.recentSessions.map((session, index) => (
                      <tr key={index} className="border-b border-dashed border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <td className="p-2 text-gray-500">{formatTime(session.updated_at)}</td>
                        <td className="p-2 font-bold text-blue-700 dark:text-blue-400">{session.game_name}</td>
                        <td className="p-2">{session.username}</td>
                        <td className="p-2">
                          <span className="block text-[10px] text-gray-500">Best: {session.best_score}</span>
                          <span className="block text-[10px] text-gray-500">Plays: {session.total_plays}</span>
                        </td>
                        <td className="p-2">
                          <span className="px-1 bg-green-100 text-green-800 rounded">ACTIVE</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500 italic">No recent activity logged.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. New Registrations (Side) */}
        <div className="bg-[#c0c0c0] dark:bg-[#2d2d2d] p-1 border-2 border-t-white border-l-white border-b-black border-r-black flex flex-col h-full">
          <div className="bg-[#800000] text-white px-2 py-1 text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-2"><UserPlus size={14} /> NEW_RECRUITS</span>
          </div>
          <div className="bg-white dark:bg-black p-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white flex-1 overflow-y-auto max-h-[400px]">
            <ul className="space-y-2 text-xs font-mono">
              {activities.newRegistrations.length > 0 ? (
                activities.newRegistrations.map((user, idx) => (
                  <li key={user.id} className="flex flex-col p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-black dark:text-green-400">#{idx + 1} {user.username}</span>
                      <span className="text-[10px] text-gray-400">{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="text-gray-500 truncate">{user.email}</span>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 p-2 italic">No new recruits today.</li>
              )}
            </ul>
          </div>

          <div className="mt-2 bg-[#ffff00] border-2 border-black p-2 flex items-start gap-2">
            <AlertTriangle size={16} className="text-black shrink-0 mt-0.5" />
            <span className="text-[10px] font-bold text-black leading-tight">
              SYSTEM: Stats are updated in real-time.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardMock;