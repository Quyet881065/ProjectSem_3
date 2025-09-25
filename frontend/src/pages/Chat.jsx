import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import Scene from "./Scene";
import NewChatPopover from "../components/NewChatPopover";
import {
  getMyConversations,
  createConversation,
  getMessages,
  createMessage,
} from "../service/chatService";
import { getToken } from "../service/localStorageService";

export function Chat() {
  const [message, setMessage] = useState("");
  const [newChatAnchorEl, setNewChatAnchorEl] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);

  // Chức năng: đảm bảo vùng hiển thị tin nhắn luôn cuộn xuống dòng cuối cùng (tin nhắn mới nhất).
  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
      setTimeout(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }, 100);
      setTimeout(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }, 300);
    }
  }, []);

  // Chức năng: quản lý trạng thái mở/đóng NewChatPopover (popup chọn người để chat).
  const handleNewChatClick = (event) => setNewChatAnchorEl(event.currentTarget);
  const handleCloseNewChat = () => setNewChatAnchorEl(null);

  // Chức năng: khi chọn người để chat, tạo cuộc trò chuyện mới (nếu chưa có) và chuyển đến cuộc trò chuyện đó.
  // Gọi API createConversation để tạo hoặc lấy lại cuộc trò chuyện.
  //Nếu cuộc trò chuyện đã tồn tại → chọn nó.
  //Nếu chưa tồn tại → thêm mới vào danh sách.
  const handleSelectNewChatUser = async (user) => {
    const response = await createConversation({
      type: "DIRECT",
      participantIds: [user.userId],
    });
    const newConversation = response?.data?.results;

    const existingConversation = conversations.find(
      (conv) => conv.id === newConversation.id
    );
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      //setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };

  // Chức năng: tải danh sách cuộc trò chuyện của user.
  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyConversations();
      setConversations(response?.data?.results || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Chức năng: khi có danh sách conversations, nếu chưa chọn cuộc trò chuyện nào thì tự động chọn cuộc đầu tiên.
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Load messages . Tải toàn bộ tin nhắn của một cuộc trò chuyện.
  useEffect(() => {
    const fetchMessages = async (conversationId) => {
      try {
        if (!messagesMap[conversationId]) {
          const response = await getMessages(conversationId);
          if (response?.data?.results) {
            const sorted = [...response.data.results].sort(
              (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
            );
            setMessagesMap((prev) => ({ ...prev, [conversationId]: sorted }));
          }
        }
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unread: 0 } : conv
          )
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    if (selectedConversation?.id) fetchMessages(selectedConversation.id);
  }, [selectedConversation, messagesMap]);

  const currentMessages = selectedConversation
    ? messagesMap[selectedConversation.id] || []
    : [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedConversation, scrollToBottom]);

  // Socket . Tạo kết nối socket.io-client tới server với token xác thực.
  // Lắng nghe sự kiện "message" để nhận tin nhắn real-time. Khi component unmount → ngắt kết nối.
  useEffect(() => {
    if (!socketRef.current) {
      const url = "http://localhost:8099?token=" + getToken();
      socketRef.current = new io(url);

      socketRef.current.on("connect", () => console.log("Socket connected"));
      socketRef.current.on("disconnect", () => console.log("Socket disconnected"));
      socketRef.current.on("message", (message) => {
        const msgObj = JSON.parse(message);
        console.log("Received message:", msgObj);
        if (msgObj?.conversationId) handleIncomingMessage(msgObj);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Chức năng: xử lý tin nhắn đến qua socket. 
  // Nếu cuộc trò chuyện đang mở → unread = 0. Nếu không → tăng unread.
  // Đồng thời cập nhật lastMessage, modifiedDate để hiển thị ngoài danh sách.
  const handleIncomingMessage = useCallback(
    (message) => {
      setMessagesMap((prev) => {
        const existing = prev[message.conversationId] || [];
        if (!existing.some((msg) => msg.id && message.id && msg.id === message.id)) {
          const updated = [...existing, message].sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
          );
          return { ...prev, [message.conversationId]: updated };
        }
        return prev;
      });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? {
              ...conv,
              lastMessage: message.message,
              lastTimestamp: new Date(message.createdDate).toLocaleString(),
              unread:
                selectedConversation?.id === message.conversationId ? 0 : (conv.unread || 0) + 1,
              modifiedDate: message.createdDate,
            }
            : conv
        ));
    },
    [selectedConversation]
  );

  // Chức năng: chọn 1 cuộc trò chuyện để hiển thị nội dung.
  const handleConversationSelect = (conversation) =>
    setSelectedConversation(conversation);

  // Chức năng: gửi tin nhắn trong cuộc trò chuyện đang chọn.
  // Gọi API createMessage. Sau đó socket sẽ broadcast tin nhắn, và handleIncomingMessage sẽ tự xử lý cập nhật UI.
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;
    const msgText = message;
    setMessage("");
    try {
      await createMessage({
        conversationId: selectedConversation.id,
        message: msgText,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Scene>
      <div className="w-full h-[calc(100vh-64px)] flex flex-row border rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chats</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1" onClick={handleNewChatClick} >
              ＋
            </button>
            <NewChatPopover anchorEl={newChatAnchorEl} open={Boolean(newChatAnchorEl)}
              onClose={handleCloseNewChat} onSelectUser={handleSelectNewChatUser} />
          </div>

          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-3">Loading...</div>
            ) : error ? (
              <div className="p-2 text-red-500 text-sm">{error}</div>
            ) : conversations.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                No conversations yet. Start a new chat.
              </div>
            ) : (
              <ul>
                {conversations.map((conv) => (
                  <li
                    key={conv.id}
                    onClick={() => handleConversationSelect(conv)}
                    className={`p-3 cursor-pointer flex items-center justify-between ${selectedConversation?.id === conv.id ? "bg-red-100" : "hover:bg-gray-50"}`} >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <img src={conv.conversationAvatar || ""} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                      <div className="overflow-hidden">
                        <div className={`font-medium truncate ${conv.unread > 0 ? "font-bold" : "" }`}>
                          {conv.conversationName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {conv.lastMessage || "Start a conversation"}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(conv.modifiedDate).toLocaleDateString("vi-VN")}
                    </span>
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-grow">
          {selectedConversation ? (
            <>
              <div className="p-3 border-b flex items-center space-x-2">
                <img
                  src={selectedConversation.conversationAvatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <h3 className="font-semibold">
                  {selectedConversation.conversationName}
                </h3>
              </div>

              <div ref={messageContainerRef} className="flex-grow overflow-y-auto p-3 flex flex-col">
                {currentMessages.map((msg) => {
                  const bgColor = msg.me ? msg.failed ? "bg-red-100" : "bg-blue-100" : "bg-gray-100";
                  return (
                    <div key={msg.id}
                      className={`flex mb-3 ${msg.me ? "justify-end" : "justify-start" }`}>
                      {!msg.me && (
                        <img src={msg.sender?.avatar} alt="sender" className="w-8 h-8 rounded-full mr-2 self-end" />
                      )}
                      <div className={`p-2 max-w-[70%] rounded-lg shadow ${bgColor}`}>
                        <div>{msg.message}</div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {msg.failed && (
                            <span className="text-red-500 mr-1">Failed</span>
                          )}
                          {msg.pending && (
                            <span className="text-gray-400 mr-1">Sending...</span>
                          )}
                          {new Date(msg.createdDate).toLocaleString()}
                        </div>
                      </div>
                      {msg.me && (
                        <div className="ml-2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">
                          You
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <form onSubmit={(e) => {e.preventDefault();  handleSendMessage();}} className="p-3 border-t flex">
                <input type="text" value={message}
                  onChange={(e) => setMessage(e.target.value)} placeholder="Type a message"
                  className="flex-grow border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button type="submit" disabled={!message.trim()}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}
