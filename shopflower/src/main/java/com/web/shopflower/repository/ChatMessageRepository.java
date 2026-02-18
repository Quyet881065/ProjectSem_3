package com.web.shopflower.repository;


import com.web.shopflower.models.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, String> {
    List<ChatMessageEntity> findByConversation_IdOrderByCreatedDateAsc(String conversationId);
    Optional<ChatMessageEntity> findTopByConversation_IdOrderByCreatedDateDesc(String conversationId);
}
