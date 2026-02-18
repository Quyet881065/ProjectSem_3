package com.web.shopflower.service.impl;

import com.corundumstudio.socketio.SocketIOServer;
import com.web.shopflower.dto.request.ChatMessageRequest;
import com.web.shopflower.dto.response.ChatMessageResponse;
import com.web.shopflower.models.ChatMessageEntity;
import com.web.shopflower.models.Conversation;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.ChatMessageRepository;
import com.web.shopflower.repository.ConversationRepository;
import com.web.shopflower.repository.UserRepository;
import com.web.shopflower.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final SocketIOServer socketIOServer;

    @Override
    public List<ChatMessageResponse> getMessage(String conversationId) {
        List<ChatMessageEntity> messages =
                chatMessageRepository.findByConversation_IdOrderByCreatedDateAsc(conversationId);

        List<ChatMessageResponse> responses = new ArrayList<>();

        for (ChatMessageEntity message : messages) {
            ChatMessageResponse response = new ChatMessageResponse();

            response.setId(message.getId());
            response.setConversationId(message.getConversation().getId());
            response.setMessage(message.getMessage());
            response.setSender(message.getSender());
            response.setCreatedDate(message.getCreatedDate());
            response.setSenderRole(message.getSender().getRoles().getLast().getName());
            responses.add(response);
        }

        return responses;
    }

    @Override
    public ChatMessageResponse create(ChatMessageRequest request) {
        Conversation conversation = conversationRepository
                .findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName();
        UserEntity sender = userRepository
                .findById(adminId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessageEntity chatMessage = new ChatMessageEntity();
        chatMessage.setConversation(conversation);
        chatMessage.setSender(sender);
        chatMessage.setMessage(request.getMessage());
        chatMessage.setCreatedDate(Instant.now());

        ChatMessageEntity saved = chatMessageRepository.save(chatMessage);

        // convert thủ công entity -> response
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(saved.getId());
        response.setConversationId(conversation.getId());
        response.setMessage(saved.getMessage());
        response.setCreatedDate(saved.getCreatedDate());
        response.setSenderRole(chatMessage.getSender().getRoles().getLast().getName());

        //  EMIT REALTIME DUY NHẤT TẠI ĐÂY
        socketIOServer.getRoomOperations(conversation.getId())
                .sendEvent("receive_message", response);

        return response;
    }
}
