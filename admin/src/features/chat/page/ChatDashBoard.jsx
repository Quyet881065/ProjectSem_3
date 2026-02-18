import { ConversationList } from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";

const ChatDashBoard = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);

    return (
        <div className="flex h-screen">
            {/* Left */}
            <div className="w-1/3 border-r">
                <ConversationList
                    onSelect={setSelectedConversation}
                    selected={selectedConversation}
                />
            </div>

            {/* Right */}
            <div className="flex-1">
                {selectedConversation ? (
                    <ChatWindow conversation={selectedConversation} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Chọn cuộc hội thoại
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatDashBoard;