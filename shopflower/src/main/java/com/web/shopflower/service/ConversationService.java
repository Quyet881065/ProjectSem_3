package com.web.shopflower.service;

import com.web.shopflower.dto.request.ConversationRequest;
import com.web.shopflower.dto.response.ConversationResponse;
import com.web.shopflower.models.Conversation;

import java.util.List;

public interface ConversationService {
    ConversationResponse createConversation(ConversationRequest request);
    List<ConversationResponse> getAllConversations();
   List<ConversationResponse> myConversations();
    Conversation findById(String conversationId);
}
