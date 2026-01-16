import { getProfileApi } from "@/services/auth.service";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";


function Profile() {
    const [profile, setProfile] = useState(null);
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getProfileApi(user.id);
            setProfile(profile.data.user);
        };
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
                    <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                        <label className="text-primary-text font-mono"><strong>Username:</strong></label>
                        <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                            <div className="flex flex-col gap-2">
                                <input type="text" value={profile?.username} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                        <label className="text-primary-text font-mono"><strong>Email:</strong></label>
                        <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                            <div className="flex flex-col gap-2">
                                <input type="text" value={profile?.email} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                        <label className="text-primary-text font-mono"><strong>Role:</strong></label>
                        <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                            <div className="flex flex-col gap-2">
                                <input type="text" value={profile?.role} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                        <label className="text-primary-text font-mono"><strong>Created At:</strong></label>
                        <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                            <div className="flex flex-col gap-2">
                                <input type="text" value={profile?.createdAt} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-4 p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                        <label className="text-primary-text font-mono"><strong>Password:</strong></label>
                        <div className="p-3 border-2 border-primary-border border-b-white border-r-white">
                            <div className="flex flex-col gap-2">
                                <input type="text" value="......" readOnly />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;
