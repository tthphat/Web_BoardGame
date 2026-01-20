import { rejectFriendApi, acceptFriendApi } from "@/services/user.service";
import { toast } from 'sonner';


function AcceptRejectFriend({ sender_id, handleRequest }) {
    const handleAccept = async () => {
        try {
            await acceptFriendApi(sender_id);
            toast.success("Accept friend successfully");
            handleRequest(sender_id);
        } catch (error) {
            console.error("Accept failed:", error);
            toast.error("Accept friend failed");
        }
    };

    const handleReject = async () => {
        try {
            await rejectFriendApi(sender_id);
            toast.success("Reject friend successfully");
            handleRequest(sender_id);
        } catch (error) {
            console.error("Reject failed:", error);
            toast.error("Reject friend failed");
        }
    };

    return (
        <div className="flex gap-4 justify-center">
            <button
                className="
                px-3 py-1 text-xs border border-green-600 text-green-600 dark:text-green-400 dark:border-green-400
                hover:bg-green-600 hover:text-white transition-all
                active:scale-95 font-bold uppercase
            "

                title="Accept Friend Request"
                onClick={handleAccept}
            >
                + Accept
            </button>

            <button
                className="
                    px-3 py-1 text-xs border border-red-600 text-red-600 dark:text-red-400 dark:border-red-400
                    hover:bg-red-600 hover:text-white transition-all
                    active:scale-95 font-bold uppercase
                "

                title="Reject Friend Request"
                onClick={handleReject}
            >
                - Reject
            </button>
        </div>
    );
}

export default AcceptRejectFriend;
