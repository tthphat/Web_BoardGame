

function Profile() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full bg-primary-background p-1 border-2 border-white border-b-primary-border border-r-primary-border shadow-md">
                <div className="w-full h-full bg-secondary-background p-6 border-2 border-primary-border border-b-white border-r-white">
                    <h1 className="text-2xl font-bold text-primary-text mb-2 font-mono">
                        Profile
                    </h1>
                    <p className="text-secondary-text font-mono">
                        Profile
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
