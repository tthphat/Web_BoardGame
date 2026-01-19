import { useState } from 'react';
import { rejectFriendApi } from "@/services/user.service";
import { toast } from 'sonner';


function AcceptRejectFriend({ sender_id, onReject }) {
    const [clicked, setClicked] = useState(false);

    const handleAccept = async () => {
        try {
            await acceptFriendApi(sender_id);
            setClicked(true);
            toast.success("Accept friend successfully");
        } catch (error) {
            console.error("Accept failed:", error);
            toast.error("Accept friend failed");
            setClicked(false);
        }
    };

    const handleReject = async () => {
        setClicked(true);
        try {
            await rejectFriendApi(sender_id);
            if (onReject) {
                onReject(sender_id);
            }
            toast.success("Reject friend successfully");
        } catch (error) {
            console.error("Reject failed:", error);
            toast.error("Reject friend failed");
            setClicked(false);
        }
    };

    return (
        <div className="flex gap-4 justify-center">
            {
                isClick ? (
                    <button
                        className="
                            px-3 py-1 text-xs border border-blue-600 text-white
                            bg-blue-600 font-bold uppercase
                        "
                        title="Accept Friend Request"
                    >
                        Sent
                    </button>
                ) : (
                    <>
                        <button
                            className="
                            px-3 py-1 text-xs border border-green-600 text-green-600 
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
                                px-3 py-1 text-xs border border-red-600 text-red-600 
                                hover:bg-red-600 hover:text-white transition-all
                                active:scale-95 font-bold uppercase
                            "

                            title="Reject Friend Request"
                            onClick={handleReject}
                        >
                            - Reject
                        </button>
                    </>
                )
            }
        </div>
    );
}

export default AcceptRejectFriend;
