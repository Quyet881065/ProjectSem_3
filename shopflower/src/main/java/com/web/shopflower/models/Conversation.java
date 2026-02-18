package com.web.shopflower.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "conversation")
@Data
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Instant createdDate;
    private Instant modifiedDate;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private UserEntity admin;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "conversation")
    private List<ChatMessageEntity> messages;
}
