import { useState, useEffect } from "react";
import { addFriendApi } from "@/services/user.service";
import { toast } from "sonner";

function AddFriend({ friend_state, user_id }) {

    const [currentState, setCurrentState] = useState(friend_state);

    useEffect(() => {
        setCurrentState(friend_state);
    }, [friend_state]);

    const handleColorState = (state) => {
        if (state === "sent") {
            return "bg-blue-600 text-white border-blue-600";
        } else if (state === "friend") {
            return "bg-green-600 text-white border-green-600";
        } else if (state === "received") {
            return "bg-yellow-600 text-white border-yellow-600";
        } else {
            return "bg-white dark:bg-transparent dark:text-blue-400 dark:border-blue-400 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white";
        }
    }

    const handleAddFriend = async () => {
        try {
            await addFriendApi(user_id);
            setCurrentState("sent");
            toast.success("Friend request sent!");
        } catch (error) {
            console.error("Error adding friend:", error);
            toast.error("Failed to add friend");
        }
    };

    const isActionable = currentState === "none";

    return (
        <div>
            <button
                className={
                    `px-3 py-1 text-xs border transition-all
                    active:scale-95 font-bold uppercase
                    cursor-pointer
                    ${handleColorState(currentState)}`
                }
                onClick={isActionable ? handleAddFriend : undefined}
                title={currentState === "none" ? "Send Friend Request" : currentState}
                disabled={!isActionable}
            >
                {currentState === "none" ? "+ Add" : currentState}
            </button>
        </div >
    );
}

export default AddFriend;

