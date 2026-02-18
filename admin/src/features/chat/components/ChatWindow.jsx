import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../service/chatService";

const ChatWindow = ({ conversation }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        if (conversation?.id) {
            loadMessages();
        }
    }, [conversation]);

    const loadMessages = async () => {
        const data = await fetchMessages(conversation.id);
        setMessages(data.results || []);
    };

    const handleSend = async () => {
        if (!content.trim()) return;

        await sendMessage(conversation.id, content);
        setContent("");
        loadMessages();
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full border-l">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
                <img
                    src={conversation.conversationAvatar || "/avatar-default.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">
                    {conversation.conversationName}
                </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                {messages.map((msg) => {
                    const isMe = msg.sender?.id === conversation.adminId;

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`
                                    max-w-[70%] px-4 py-2 rounded-lg text-sm
                                    ${isMe
                                        ? "bg-blue-500 text-white"
                                        : "bg-white border"}
                                `}
                            >
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
