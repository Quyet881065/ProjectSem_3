package com.web.shopflower.controllers;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocketServerRunner {
    private final SocketIOServer server;

    @PostConstruct
    public void start() {
        server.start();
        log.info("✅ Socket.IO server started at port 8099");
    }

    @PreDestroy
    public void stop() {
        server.stop();
        log.info("🛑 Socket.IO server stopped");
    }
}
