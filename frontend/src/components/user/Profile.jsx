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
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full bg-primary-background p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                <div className="w-full h-full flex flex-col gap-6 bg-secondary-background p-6 border-2 border-primary-border border-b-white border-r-white">
                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-primary-text mb-2 font-mono">Profile</h1>
                        <p className="text-secondary-text font-mono">Only you can see this information. Edit your profile here.</p>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                        {/* Username*/}
                        <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                            <label className="text-primary-text font-mono"><strong>Username:</strong></label>
                            <div className="flex justify-between items-center p-3 border-2 border-primary-border border-b-white border-r-white">
                                <div className="flex flex-col gap-2">
                                    <input type="text" value={profile?.username || ""} readOnly className="bg-transparent focus:outline-none text-primary-text" />
                                </div>
                                <EditProfile data={profile?.username} field="username" onSuccess={fetchProfile} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                            <label className="text-primary-text font-mono"><strong>Email:</strong></label>
                            <div className="flex justify-between items-center p-3 border-2 border-primary-border border-b-white border-r-white">
                                <div className="flex flex-col gap-2">
                                    <input type="text" value={profile?.email || ""} readOnly className="bg-transparent focus:outline-none text-primary-text" />
                                </div>
                                <EditProfile data={profile?.email} field="email" onSuccess={fetchProfile} />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                            <label className="text-primary-text font-mono"><strong>Password:</strong></label>
                            <div className="flex justify-between items-center p-3 border-2 border-primary-border border-b-white border-r-white">
                                <div className="flex flex-col gap-2">
                                    <input type="text" value="**********" readOnly className="bg-transparent focus:outline-none text-primary-text" />
                                </div>
                                <EditProfile data="" field="password" onSuccess={fetchProfile} />
                            </div>
                        </div>

                        {/* Created At */}
                        <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                            <label className="text-primary-text font-mono"><strong>Created At:</strong></label>
                            <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                                <div className="flex flex-col gap-2">
                                    <input type="text" value={profile?.created_at ? new Date(profile.created_at).toLocaleString("vi-VN") : ""} readOnly className="bg-transparent focus:outline-none text-primary-text" />
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                            <label className="text-primary-text font-mono"><strong>Role:</strong></label>
                            <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                                <div className="flex flex-col gap-2">
                                    <input type="text" value={profile?.role?.toUpperCase() || ""} readOnly className="bg-transparent focus:outline-none text-primary-text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
