import { useEffect, useState } from "react";
import { fetchConversations } from "../service/chatService";

export const ConversationList = ({ onSelect, selected }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        const data = await fetchConversations();
        setConversations(data.results || []);
    };

    const formatTime = (time) => {
        if (!time) return "";
        const date = new Date(time);
        return date.toLocaleDateString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="px-4 py-3 font-semibold text-lg border-b">
                Conversation List
            </h3>
            {conversations.length === 0 && (
                <p className="px-4 py-3 text-gray-500">
                    Chưa có cuộc hội thoại nào
                </p>
            )}

            <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect && onSelect(conv)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100
                            ${selected?.id === conv.id ? "bg-blue-100" : ""}`}>
                        {/* Avatar */}
                        <img
                            src={conv.conversationAvatar || "/avatar-default.png"}
                            alt="avatar" className="w-11 h-11 rounded-full object-cover" />
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900 truncate">
                                    {conv.conversationName}
                                </span>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatTime(conv.modifiedDate)}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 truncate">
                                {conv.message || "Chưa có tin nhắn"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ConversationList;