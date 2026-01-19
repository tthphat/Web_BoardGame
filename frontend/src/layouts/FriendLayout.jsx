import { NavLink, Outlet } from "react-router-dom";

function FriendLayout() {
    const navItems = [
        { path: '/friends/user-list', label: 'Panel', exact: true },
        { path: '/friends/friend-requests', label: 'Requests' },
        { path: '/friends/my-friends', label: 'My Friends' }
    ];

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full h-full bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-xl flex flex-col">
                {/* Header Bar */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-2 flex items-center justify-between mb-1">
                    <span className="text-white font-bold font-mono tracking-widest pl-2">FRIEND MANAGER</span>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-4 p-4 bg-[#c0c0c0] min-h-0">
                    {/* Navigation Tabs */}
                    <div className="flex gap-2 border-b-2 border-white/50 pb-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `
                                    px-6 py-2 font-mono text-sm font-bold uppercase transition-all relative
                                    border-t-2 border-l-2 border-b-2 border-r-2
                                    ${isActive
                                        ? 'bg-blue-800 text-white border-t-black border-l-black border-b-white border-r-white translate-y-[2px]'
                                        : 'bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black hover:bg-[#dcdcdc] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:translate-y-[2px]'
                                    }
                                `}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="flex-1 bg-white border-inset border-2 border-gray-600 p-4 shadow-inner overflow-hidden min-h-0 flex flex-col">
                        <Outlet />
                    </div>

                    {/* Status Bar */}
                    <div className="border-t-2 border-gray-400 pt-2 flex justify-between text-xs font-mono text-gray-600">
                        <span>STATUS: ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FriendLayout;
