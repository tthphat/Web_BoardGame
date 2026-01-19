import { removeFriendApi } from "@/services/user.service";

function RemoveFriend({ friendId, onRemove }) {

    const handleRemove = () => {
        try {
            removeFriendApi(friendId);
            onRemove(friendId);
            toast.success("Remove friend successfully");
        } catch (error) {
            console.log(error);
            toast.error("Remove friend failed");
        }
    }

    return (
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer" onClick={handleRemove}>
            Remove
        </button>
    );
}

export default RemoveFriend;

