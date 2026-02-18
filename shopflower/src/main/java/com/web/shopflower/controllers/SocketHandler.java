package com.web.shopflower.controllers;

import com.corundumstudio.socketio.SocketIOServer;
import com.web.shopflower.dto.request.ChatMessageRequest;
import com.web.shopflower.dto.response.ChatMessageResponse;
import com.web.shopflower.models.ChatMessageEntity;
import com.web.shopflower.models.Conversation;
import com.web.shopflower.repository.ChatMessageRepository;
import com.web.shopflower.repository.UserRepository;
import com.web.shopflower.service.ConversationService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocketHandler {
    private final SocketIOServer server;
    @PostConstruct
    public void init() {

        // Join room
        server.addEventListener("join_room", String.class,
                (client, conversationId, ackSender) -> {
                    client.joinRoom(conversationId);
                    log.info("Client {} joined room {}", client.getSessionId(), conversationId);
                });
    }

    @PreDestroy
    public void destroy() {
        server.stop();
    }
}

