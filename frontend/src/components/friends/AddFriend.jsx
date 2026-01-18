import { useState, useEffect } from "react";
import { addFriendApi } from "@/services/user.service";
import { toast } from "sonner";

function AddFriend({ friend_state, user_id }) {

    const [allowAdd, setAllowAdd] = useState(false);

    const handelFriendState = (friend_state) => {
        if (friend_state !== "none") {
            setAllowAdd(false);
        } else {
            setAllowAdd(true);
        }
    }

    useEffect(() => {
        handelFriendState(friend_state);
    }, [friend_state]);

    const handleColorState = (friend_state) => {
        if (friend_state === "sent") {
            return "bg-blue-600 text-white border-blue-600";
        } else if (friend_state === "friend") {
            return "bg-green-600 text-white border-green-600";
        } else if (friend_state === "received") {
            return "bg-yellow-600 text-white border-yellow-600";
        } else {
            return "";
        }
    }

    const handleAddFriend = () => {
        try {
            addFriendApi(user_id);
            setAllowAdd(false);
        } catch (error) {
            console.error("Error adding friend:", error);
            toast.error("Failed to add friend");
        }
    };

    return (
        <div>
            <button
                className={
                    `px-3 py-1 text-xs border text-blue-600 
                    active:scale-95 font-bold uppercase
                    cursor-pointer
                    ${handleColorState(friend_state)}`
                }
                onClick={handleAddFriend}
                title="Send Friend Request"
                disabled={!allowAdd}
            >
                {allowAdd ? "+ Add" : friend_state}
            </button>
        </div>
    );
}

export default AddFriend;

