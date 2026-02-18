import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getToken, getUserId } from "../../../service/localStorageService";
import { sendChatMessage, fetchMessages, fetchConversations, createConversation } from "../service/chatMessage";

const ChatPopup = ({ onClose }) => {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const userId = getUserId();


    useEffect(() => {
        if (!socketRef.current) {
            const url = "http://localhost:8099";

            socketRef.current = io(url, {
                transports: ["websocket"],
                auth: {
                    token: getToken(),
                },
            });

            socketRef.current.on("connect", () => {
                console.log("✅ Socket connected:", socketRef.current.id);
            });

            socketRef.current.on("disconnect", () => {
                console.log(" Socket disconnected");
            });

            socketRef.current.on("receive_message", (msgObj) => {
                console.log("Received:", msgObj);
                if (msgObj?.conversationId) {
                    setMessages(prev => [...prev, msgObj]);
                }
            });
        }

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (socketRef.current && conversationId) {
            console.log("👉 join_room:", conversationId);
            socketRef.current.emit("join_room", conversationId);
        }
    }, [conversationId]);



    useEffect(() => {
        const loadConversation = async () => {
            try {
                const res = await fetchConversations(); // ✅ gọi service
                // nếu API trả list
                const conversation = res?.results?.[0];
                if (conversation) {
                    setConversationId(conversation.id);
                }
            } catch (err) {
                console.error("Fetch conversation error:", err);
            }
        };
        loadConversation();
    }, []);

    console.log("Conversation ID:", conversationId);

    useEffect(() => {
        if (!conversationId) return;

        const loadMessages = async () => {
            try {
                const res = await fetchMessages(conversationId);
                setMessages(res.results);
            } catch (err) {
                console.error("Load messages error:", err);
            }
        };

        loadMessages();
    }, [conversationId]);
    console.log("Messages:", messages);

    const handleSendMessage = async () => {
        if (!text.trim() || !conversationId) return;

        const tempMessage = {
            id: Date.now(), // id tạm
            message: text,
            sender: { id: userId },
            conversationId,
            createdDate: new Date().toISOString(),
        };

        // ✅ HIỂN THỊ NGAY
        setMessages(prev => [...prev, tempMessage]);
        setText("");

        try {
            await sendChatMessage(conversationId, text, userId);
            setText("");
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    return (
        <div className="fixed bottom-24 right-5 w-[360px] h-[480px] bg-white rounded-xl shadow-xl flex flex-col">

            {/* Header */}
            <div className="p-4 border-b flex justify-between">
                <div>
                    <b>MayFlower</b>
                    <p className="text-sm text-gray-500">Hoa tươi Hà Nội</p>
                </div>
                <button onClick={onClose}>✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`px-4 py-2 rounded-2xl w-fit max-w-[80%]
                        ${m.sender?.id === userId
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200 text-black"}
`}
                    >
                        {m.message}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-2"
                    placeholder="Nhập tin nhắn..."
                />
                <button
                    onClick={handleSendMessage}
                    className="text-blue-500 font-bold"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatPopup;
