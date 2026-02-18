package com.web.shopflower.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConversationResponse {
    String id;
    String conversationAvatar;
    String conversationName;
    Instant createdDate;
    Instant modifiedDate;
    String message;
    UserProFileResponse sender;
}
