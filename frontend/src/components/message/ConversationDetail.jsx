import { useParams } from "react-router-dom";

function ConversationDetail() {
    const { id } = useParams();

    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <h2 className="text-xl font-bold mb-2">Conversation Detail</h2>
            <p>Viewing conversation ID: <span className="font-mono text-black bg-gray-200 px-1 rounded">{id}</span></p>
            <p className="text-sm mt-4">Chat interface will be implemented here.</p>
        </div>
    );
}

export default ConversationDetail;
