package com.web.shopflower.service;

import com.web.shopflower.dto.request.ChatMessageRequest;
import com.web.shopflower.dto.response.ChatMessageResponse;

import java.util.List;

public interface ChatMessageService {
    List<ChatMessageResponse> getMessage(String conversationId);
    ChatMessageResponse create(ChatMessageRequest request);
}
