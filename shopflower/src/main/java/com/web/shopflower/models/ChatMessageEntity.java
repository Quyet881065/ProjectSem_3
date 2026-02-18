package com.web.shopflower.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
@Data
public class ChatMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Instant createdDate;

    @Column(columnDefinition = "TEXT")
    private String message;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    @JsonIgnore
    private Conversation conversation;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "sender_id")
    private UserEntity sender;
}
