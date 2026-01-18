import { getProfileApi } from "@/services/user.service";
import { useState, useEffect } from "react";
import EditProfile from "@/components/user/EditProfile";

function Profile() {
    const [profile, setProfile] = useState(null);

    const fetchProfile = async () => {
        try {
            const profile = await getProfileApi();
            setProfile(profile.data.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-xl flex flex-col">
                {/* Header Bar */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-2 flex items-center justify-between mb-4">
                    <span className="text-white font-bold font-mono tracking-widest pl-2">USER PROFILE</span>
                </div>

                {/* Main Content */}
                <div className="p-4 flex flex-col gap-4">
                    {/* Info Block */}
                    <div className="border-2 border-gray-600 p-4 bg-[#c0c0c0] text-black dark:text-black">
                        <legend className="px-2 font-bold font-mono text-sm transform -translate-y-6 bg-[#c0c0c0] w-max">USER INFORMATION</legend>

                        <div className="flex flex-col gap-4 -mt-2">
                            {/* Username */}
                            <div className="flex items-center gap-4">
                                <label className="w-24 font-mono font-bold text-sm">Username:</label>
                                <div className="flex-1 bg-white border-2 border-inset border-gray-600 p-1 px-2 font-mono flex justify-between items-center shadow-inner">
                                    <span>{profile?.username || "LOADING..."}</span>
                                    <EditProfile data={profile?.username} field="username" onSuccess={fetchProfile} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <label className="w-24 font-mono font-bold text-sm">Email:</label>
                                <div className="flex-1 bg-white border-2 border-inset border-gray-600 p-1 px-2 font-mono flex justify-between items-center shadow-inner">
                                    <span>{profile?.email || "LOADING..."}</span>
                                    <EditProfile data={profile?.email} field="email" onSuccess={fetchProfile} />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex items-center gap-4">
                                <label className="w-24 font-mono font-bold text-sm">Password:</label>
                                <div className="flex-1 bg-white border-2 border-inset border-gray-600 p-1 px-2 font-mono flex justify-between items-center shadow-inner">
                                    <span>**********</span>
                                    <EditProfile data="" field="password" onSuccess={fetchProfile} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Info Block */}
                    <div className="border-2 border-gray-600 p-4 bg-[#c0c0c0] mt-2 text-black dark:text-black">
                        <legend className="px-2 font-bold font-mono text-sm transform -translate-y-6 bg-[#c0c0c0] w-max">SYSTEM DATA</legend>

                        <div className="flex flex-col gap-2 -mt-2 ">
                            <div className="flex justify-between font-mono text-sm">
                                <span>CREATED AT:</span>
                                <span>{profile?.created_at ? new Date(profile.created_at).toLocaleString("vi-VN") : "UNKNOWN"}</span>
                            </div>
                            <div className="flex justify-between font-mono text-sm">
                                <span>USER ROLE:</span>
                                <span className="font-bold text-blue-800">{profile?.role?.toUpperCase() || "GUEST"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="border-t-2 border-gray-500 pt-2 flex justify-between text-xs font-mono text-gray-600 mt-2">
                        <span>ID: {profile?.id || "N/A"}</span>
                        <span>SECURE CONNECTION</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
