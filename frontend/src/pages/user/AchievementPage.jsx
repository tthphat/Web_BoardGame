import Achievements from "@/components/user/Achievements";

function AchievementPage() {
    return (
        <AchievementPageContent />
    );
}

const AchievementPageContent = () => {
    return (
        <div className="container mx-auto max-w-5xl h-full py-4 px-2">
            <Achievements />
        </div>
    );
};

export default AchievementPage;
