package com.web.shopflower.dto.response;

import com.web.shopflower.models.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {
    String id;
    String conversationId;
    String message;
    UserEntity sender;
    Instant createdDate;
    private String senderRole;
}
